<?php

declare(strict_types=1);

namespace Tests\integration;

use Codeception\Test\Unit;
use Craft;
use craft\base\Model;
use craft\elements\User;
use craft\fields\PlainText;
use craft\helpers\StringHelper;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\models\ai\AiGenerationRequest;
use jtdev\craftautofill\models\Workflow;
use jtdev\craftautofill\services\ai\AiProviderInterface;
use jtdev\craftautofill\services\ai\providers\openai\OpenAiProvider;
use modules\autofilltestbench\FixtureOpenAiProvider;
use Tests\Support\TestProject;
use RuntimeException;

final class BulkWorkflowAuthorizationTest extends Unit
{
    public function testQueueRejectsWrongEntryTypeBeforeEnqueuing(): void
    {
        $configured = TestProject::create(new PlainText(['name' => 'Configured target', 'handle' => 'configuredTarget']));
        $other = TestProject::create(new PlainText(['name' => 'Other target', 'handle' => 'otherTarget']));
        $workflow = new Workflow([
            'handle' => 'bulk-scope-authorization',
            'name' => 'Bulk scope authorization',
            'scope' => 'entry',
            'entryTypeUid' => (string)$configured['entry']->getType()->uid,
            'rows' => [['targetFieldUid' => $configured['targetUid'], 'prompt' => 'Write a value.']],
        ]);
        $workflowService = AutofillPlugin::getInstance()->getWorkflowService();
        self::assertTrue($workflowService->saveWorkflow($workflow), implode(' ', $workflow->getFirstErrors()));

        $field = $configured['autofill'];
        $field->workflowHandle = $workflow->handle;
        self::assertTrue(Craft::$app->getFields()->saveField($field));

        try {
            AutofillPlugin::getInstance()->getBulkAutofillService()->queueForEntry(
                (int)$field->id,
                null,
                (int)$other['entry']->id,
            );
            self::fail('Bulk Autofill queued a workflow for an entry of another type.');
        } catch (RuntimeException $exception) {
            self::assertStringContainsString('does not support', $exception->getMessage());
        }
    }

    public function testImmediateBulkRunRejectsWrongEntryTypeBeforeGeneration(): void
    {
        $configured = TestProject::create(new PlainText(['name' => 'Run configured target', 'handle' => 'runConfiguredTarget']));
        $other = TestProject::create(new PlainText(['name' => 'Run other target', 'handle' => 'runOtherTarget']));
        $plugin = AutofillPlugin::getInstance();
        $settings = $plugin->getSettings();
        $previousConfigs = $settings->modelConfigs;
        $settings->modelConfigs = [[
            'uid' => 'bulk-scope-test-model',
            'provider' => 'openai',
            'apiKeyEnv' => '$OPENAI_API_KEY',
            'modelId' => 'fixture-model',
            'enabled' => true,
        ]];
        $provider = new TrackingFixtureOpenAiProvider();
        $plugin->getAiService()->registerProvider($provider);

        try {
            $workflow = new Workflow([
                'handle' => 'bulk-run-scope-authorization',
                'name' => 'Bulk run scope authorization',
                'scope' => 'entry',
                'entryTypeUid' => (string)$configured['entry']->getType()->uid,
                'modelConfigUid' => 'bulk-scope-test-model',
                'rows' => [['targetFieldUid' => $configured['targetUid'], 'prompt' => 'Write a value.']],
            ]);
            $workflowService = $plugin->getWorkflowService();
            self::assertTrue($workflowService->saveWorkflow($workflow), implode(' ', $workflow->getFirstErrors()));

            $field = $configured['autofill'];
            $field->workflowHandle = $workflow->handle;
            self::assertTrue(Craft::$app->getFields()->saveField($field));

            $result = $plugin->getBulkAutofillService()->runForEntry(
                (int)$field->id,
                null,
                (int)$other['entry']->id,
            );
            self::assertFalse($result['success']);
            self::assertStringContainsString('does not support', $result['error']);
            self::assertSame(0, $provider->calls);
        } finally {
            $settings->modelConfigs = $previousConfigs;
            $plugin->getAiService()->registerProvider(new OpenAiProvider());
        }
    }

    public function testBulkRunUsesMigratedWorkflowWithDeterministicProvider(): void
    {
        $project = TestProject::create(new PlainText(['name' => 'Migrated bulk target', 'handle' => 'migratedBulkTarget']));
        $plugin = AutofillPlugin::getInstance();
        $settings = $plugin->getSettings();
        $previousConfigs = $settings->modelConfigs;
        $settings->modelConfigs = [[
            'uid' => 'bulk-migration-test-model',
            'provider' => 'openai',
            'apiKeyEnv' => '$OPENAI_API_KEY',
            'modelId' => 'fixture-model',
            'enabled' => true,
        ]];
        $aiService = $plugin->getAiService();
        $provider = new TrackingFixtureOpenAiProvider();
        $aiService->registerProvider($provider);

        try {
            $legacyField = $project['autofill'];
            self::assertSame('', $legacyField->workflowHandle);
            $plugin->getWorkflowService()->migrateLegacyFields();

            $migratedField = Craft::$app->getFields()->getFieldById((int)$legacyField->id);
            self::assertSame($legacyField->handle, $migratedField->workflowHandle);
            self::assertNotNull($plugin->getWorkflowService()->getByHandle($migratedField->workflowHandle));

            $result = $plugin->getBulkAutofillService()->runForEntry(
                (int)$migratedField->id,
                null,
                (int)$project['entry']->id,
            );

            self::assertTrue($result['success'], (string)$result['error']);
            self::assertSame(1, $provider->calls);
            self::assertSame(1, $result['suggestionsApplied']);
            self::assertSame(
                'Fixture generated value for Migrated bulk target',
                TestProject::reloadEntry($project['entry'])->getFieldValue($project['target']->handle),
            );
        } finally {
            $settings->modelConfigs = $previousConfigs;
            $aiService->registerProvider(new OpenAiProvider());
        }
    }

    public function testQueueChecksInitiatingUsersEntryPermission(): void
    {
        $project = TestProject::create(new PlainText(['name' => 'Permission target', 'handle' => 'permissionTarget']));
        $workflow = new Workflow([
            'handle' => 'bulk-user-authorization',
            'name' => 'Bulk user authorization',
            'scope' => 'entry',
            'entryTypeUid' => (string)$project['entry']->getType()->uid,
            'rows' => [['targetFieldUid' => $project['targetUid'], 'prompt' => 'Write a value.']],
        ]);
        $workflowService = AutofillPlugin::getInstance()->getWorkflowService();
        self::assertTrue($workflowService->saveWorkflow($workflow), implode(' ', $workflow->getFirstErrors()));

        $field = $project['autofill'];
        $field->workflowHandle = $workflow->handle;
        self::assertTrue(Craft::$app->getFields()->saveField($field));

        $username = 'autofill-no-entry-access-' . substr(str_replace('-', '', StringHelper::UUID()), 0, 8);
        $user = new User([
            'username' => $username,
            'email' => $username . '@example.test',
            'admin' => false,
            'enabled' => true,
        ]);
        $user->newPassword = 'autofill-test-password';
        self::assertTrue(Craft::$app->getElements()->saveElement($user, false, false, false), implode(' ', $user->getErrorSummary(true)));
        Craft::$app->getUsers()->activateUser($user);

        try {
            AutofillPlugin::getInstance()->getBulkAutofillService()->queueForEntry(
                (int)$field->id,
                null,
                (int)$project['entry']->id,
                null,
                '',
                'queue',
                (int)$user->id,
            );
            self::fail('Bulk Autofill queued content for a user without save permission.');
        } catch (RuntimeException $exception) {
            self::assertStringContainsString('permission', strtolower($exception->getMessage()));
        }
    }
}

final class TrackingFixtureOpenAiProvider implements AiProviderInterface
{
    public int $calls = 0;

    public function getProviderKey(): string
    {
        return 'openai';
    }

    public function generate(AiGenerationRequest $request, Model $providerConfig): array
    {
        $this->calls++;
        return (new FixtureOpenAiProvider())->generate($request, $providerConfig);
    }
}
