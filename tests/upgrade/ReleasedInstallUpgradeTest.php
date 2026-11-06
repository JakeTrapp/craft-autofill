<?php

declare(strict_types=1);

namespace Tests\upgrade;

use Codeception\Test\Unit;
use Craft;
use craft\elements\Entry;
use craft\fields\PlainText;
use craft\helpers\Json;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\fields\AutofillField;
use Tests\Support\TestProject;

final class ReleasedInstallUpgradeTest extends Unit
{
    public function testReleasedInstallationUpgrade(): void
    {
        if (!in_array(getenv('AUTOFILL_UPGRADE_STAGE'), ['legacy', 'current'], true)) {
            self::markTestSkipped('Run tests/upgrade/run for the two-process release upgrade rehearsal.');
        }
        $snapshotFile = CRAFT_ROOT_PATH . '/.upgrade-snapshot.json';
        $edition = getenv('AUTOFILL_UPGRADE_EDITION') ?: AutofillPlugin::EDITION_PRO;
        if (getenv('AUTOFILL_UPGRADE_STAGE') === 'legacy') {
            // Composer points at the working checkout. Make Craft discover only
            // the migrations shipped with the released source during install.
            $plugins = Craft::$app->getPlugins();
            $plugins->on(\craft\services\Plugins::EVENT_BEFORE_INSTALL_PLUGIN, static function($event): void {
                if ($event->plugin->id === 'autofill') $event->plugin->setBasePath(CRAFT_ROOT_PATH . '/.upgrade-legacy/src');
            });
            self::assertTrue(Craft::$app->getPlugins()->installPlugin('autofill', $edition));
            $plugin = Craft::$app->getPlugins()->getPlugin('autofill');
            self::assertInstanceOf(AutofillPlugin::class, $plugin);
            self::assertSame('1.0.0', $plugin->schemaVersion);
            self::assertStringContainsString('.upgrade-legacy', (new \ReflectionClass($plugin))->getFileName());
            self::assertFalse(Craft::$app->getDb()->tableExists('{{%autofill_workflows}}'), 'The old installation must not create new workflow storage.');
            $fixture = TestProject::create(new PlainText(['name' => 'Upgrade content', 'handle' => 'upgradeContent']), $edition);
            $field = $fixture['autofill'];
            $field->globalPrompt = 'Preserve these existing instructions.';
            $field->actionButtonLabel = 'Write copy';
            $field->showUserPromptInput = false;
            $field->contextRows = [['fieldUid' => '__native__:title', 'prompt' => 'Use the title.', 'enabled' => true]];
            self::assertTrue(Craft::$app->getFields()->saveField($field));
            $entry = $fixture['entry'];
            $entry->setFieldValue('upgradeContent', 'Existing editorial content');
            self::assertTrue(Craft::$app->getElements()->saveElement($entry));
            Craft::$app->getProjectConfig()->saveModifiedConfigData();
            file_put_contents($snapshotFile, Json::encode([
                'fieldId' => (int)$field->id, 'fieldUid' => $field->uid,
                'entryId' => (int)$entry->id, 'siteId' => (int)$entry->siteId,
                'settings' => $field->getSettings(),
            ]));
            return;
        }

        self::assertSame('current', getenv('AUTOFILL_UPGRADE_STAGE'));
        $expected = Json::decode(file_get_contents($snapshotFile));
        $plugin = Craft::$app->getPlugins()->getPlugin('autofill');
        self::assertInstanceOf(AutofillPlugin::class, $plugin);
        self::assertSame($edition, $plugin->edition);
        self::assertStringNotContainsString('.upgrade-legacy', (new \ReflectionClass($plugin))->getFileName());
        $storedSchema = static fn(): string => (string)(new \craft\db\Query())->select('schemaVersion')->from('{{%plugins}}')->where(['handle' => 'autofill'])->scalar();
        self::assertSame('1.0.0', $storedSchema());
        Craft::$app->getUpdates()->runMigrations(['autofill']);
        self::assertSame($plugin->schemaVersion, $storedSchema());
        $field = Craft::$app->getFields()->getFieldById($expected['fieldId']);
        self::assertInstanceOf(AutofillField::class, $field);
        self::assertSame($expected['fieldUid'], $field->uid);
        self::assertNotEmpty($field->workflowHandle);
        $service = $plugin->getWorkflowService();
        $workflow = $service->getByHandle($field->workflowHandle);
        self::assertNotNull($workflow);
        // File-input defaults were introduced after 1.0.7; old row options must
        // survive byte-for-byte apart from this empty additive configuration.
        foreach (['rows', 'contextRows'] as $key) {
            $expected['settings'][$key] = array_map(static fn(array $row): array => $row + ['assets' => []], $expected['settings'][$key]);
        }
        foreach (['entryTypeUid', 'globalPrompt', 'actionButtonLabel', 'showUserPromptInput', 'rows', 'contextRows'] as $key) {
            self::assertSame($expected['settings'][$key], $workflow->$key, $key . ' survives upgrade');
        }
        self::assertSame('public', $workflow->visibility);
        self::assertTrue($workflow->adminManaged);
        self::assertNull($workflow->ownerId);
        self::assertSame(['workflowHandle'], $field->settingsAttributes());
        $entry = Entry::find()->id($expected['entryId'])->siteId($expected['siteId'])->status(null)->one();
        self::assertInstanceOf(Entry::class, $entry);
        self::assertSame('Existing editorial content', (string)$entry->getFieldValue('upgradeContent'));
        self::assertNotNull(Craft::$app->getDb()->getTableSchema('{{%autofill_runs}}', true)->getColumn('privateOwnerId'));
        $count = count($service->getAll());
        Craft::$app->getUpdates()->runMigrations(['autofill']);
        self::assertCount($count, $service->getAll(), 'A repeated migration does not duplicate workflows.');
    }
}
