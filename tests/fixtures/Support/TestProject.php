<?php

declare(strict_types=1);

namespace Tests\Support;

use Craft;
use craft\base\FieldInterface;
use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fieldlayoutelements\entries\EntryTitleField;
use craft\helpers\StringHelper;
use craft\models\EntryType;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use craft\models\Section;
use craft\models\Section_SiteSettings;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\fields\AutofillField;
use RuntimeException;

final class TestProject
{
    private static int $sequence = 0;

    /**
     * @return array{entry:Entry,target:FieldInterface,autofill:AutofillField,targetUid:string,siteId:int}
     */
    public static function create(FieldInterface $target, string $edition = AutofillPlugin::EDITION_PRO): array
    {
        self::$sequence++;
        $suffix = self::$sequence . substr(str_replace('-', '', StringHelper::UUID()), 0, 6);
        $target->name ??= 'Target ' . $suffix;
        $target->handle ??= 'target' . $suffix;

        self::switchEdition($edition);
        self::saveField($target);

        $autofill = new AutofillField([
            'name' => 'Autofill ' . $suffix,
            'handle' => 'autofill' . $suffix,
            'globalPrompt' => 'Return concise fixture content.',
            'rows' => [],
        ]);
        self::saveField($autofill);

        $layout = new FieldLayout(['type' => Entry::class]);
        $tab = new FieldLayoutTab(['name' => 'Content']);
        $layout->setTabs([$tab]);
        $tab->setElements([new EntryTitleField(), new CustomField($target), new CustomField($autofill)]);

        $entryType = new EntryType([
            'name' => 'Autofill Fixture ' . $suffix,
            'handle' => 'autofillFixture' . $suffix,
            'uid' => StringHelper::UUID(),
        ]);
        $entryType->setFieldLayout($layout);
        foreach ($entryType->getFieldLayout()->getCustomFields() as $layoutField) {
            if ($layoutField instanceof AutofillField) {
                $layoutField->entryTypeUid = (string)$entryType->uid;
            }
        }
        self::saveEntryType($entryType, false);

        $entryType = Craft::$app->getEntries()->getEntryTypeByUid((string)$entryType->uid);
        if (!$entryType instanceof EntryType) {
            throw new RuntimeException('Could not reload the fixture entry type after its first save.');
        }

        $targetInstance = self::fieldByHandle($entryType, (string)$target->handle);
        $autofillInstance = self::fieldByHandle($entryType, (string)$autofill->handle);
        if (!$autofillInstance instanceof AutofillField) {
            throw new RuntimeException('Craft did not return the Autofill field instance from the entry type layout.');
        }

        $targetUid = trim((string)($targetInstance->layoutElement->uid ?? $targetInstance->uid));
        $rows = [[
            'targetFieldUid' => $targetUid,
            'prompt' => 'Generate the test value.',
            'requiresApproval' => false,
            'overrideCurrentValue' => true,
        ]];
        $autofill->entryTypeUid = (string)$entryType->uid;
        $autofill->rows = $rows;
        self::saveField($autofill);
        $autofillInstance->entryTypeUid = (string)$entryType->uid;
        $autofillInstance->rows = $rows;
        self::saveEntryType($entryType);

        $entryType = Craft::$app->getEntries()->getEntryTypeByUid((string)$entryType->uid);
        if (!$entryType instanceof EntryType) {
            throw new RuntimeException('Could not reload the configured fixture entry type.');
        }
        $targetInstance = self::fieldByHandle($entryType, (string)$target->handle);
        $autofillInstance = self::fieldByHandle($entryType, (string)$autofill->handle);
        if (!$autofillInstance instanceof AutofillField) {
            throw new RuntimeException('Could not reload the configured Autofill field instance.');
        }

        $siteId = (int)Craft::$app->getSites()->getPrimarySite()->id;
        $section = new Section([
            'name' => 'Autofill Fixtures ' . $suffix,
            'handle' => 'autofillFixtures' . $suffix,
            'type' => Section::TYPE_CHANNEL,
            'enableVersioning' => false,
        ]);
        $section->setEntryTypes([$entryType]);
        $section->setSiteSettings([new Section_SiteSettings([
            'siteId' => $siteId,
            'enabledByDefault' => true,
            'hasUrls' => false,
        ])]);
        if (!Craft::$app->getEntries()->saveSection($section)) {
            throw new RuntimeException('Could not save fixture section: ' . implode(' ', $section->getErrorSummary(true)));
        }

        $entry = new Entry([
            'sectionId' => $section->id,
            'typeId' => $entryType->id,
            'siteId' => $siteId,
            'title' => 'Before Autofill',
            'slug' => 'before-autofill-' . strtolower($suffix),
            'enabled' => true,
        ]);
        if (!Craft::$app->getElements()->saveElement($entry)) {
            throw new RuntimeException('Could not save fixture entry: ' . implode(' ', $entry->getErrorSummary(true)));
        }

        return [
            'entry' => $entry,
            'target' => $targetInstance,
            'autofill' => $autofill,
            'targetUid' => $targetUid,
            'siteId' => $siteId,
        ];
    }

    public static function reloadEntry(Entry $entry): Entry
    {
        $reloaded = Entry::find()
            ->id($entry->id)
            ->siteId($entry->siteId)
            ->status(null)
            ->one();

        if (!$reloaded instanceof Entry) {
            throw new RuntimeException('Could not reload the fixture entry from Craft.');
        }

        return $reloaded;
    }

    public static function switchEdition(string $edition): void
    {
        $plugin = AutofillPlugin::getInstance();
        if ($plugin->edition === $edition) {
            return;
        }

        Craft::$app->getPlugins()->switchEdition('autofill', $edition);
    }

    private static function fieldByHandle(EntryType $entryType, string $handle): FieldInterface
    {
        foreach ($entryType->getFieldLayout()->getCustomFields() as $field) {
            if ($field->handle === $handle) {
                return $field;
            }
        }

        throw new RuntimeException(sprintf('Could not find field "%s" in the fixture layout.', $handle));
    }

    private static function saveField(FieldInterface $field): void
    {
        if (!Craft::$app->getFields()->saveField($field)) {
            throw new RuntimeException('Could not save fixture field: ' . implode(' ', $field->getErrorSummary(true)));
        }
    }

    private static function saveEntryType(EntryType $entryType, bool $runValidation = true): void
    {
        if (!Craft::$app->getEntries()->saveEntryType($entryType, $runValidation)) {
            throw new RuntimeException('Could not save fixture entry type: ' . implode(' ', $entryType->getErrorSummary(true)));
        }
    }
}
