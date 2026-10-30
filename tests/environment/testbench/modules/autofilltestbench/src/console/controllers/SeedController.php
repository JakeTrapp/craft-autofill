<?php

declare(strict_types=1);

namespace modules\autofilltestbench\console\controllers;

use Craft;
use craft\base\FieldInterface;
use craft\console\Controller;
use craft\elements\Category;
use craft\elements\Entry;
use craft\elements\Asset;
use craft\elements\Tag;
use craft\elements\User;
use craft\fieldlayoutelements\CustomField;
use craft\fieldlayoutelements\entries\EntryTitleField;
use craft\fields\Addresses;
use craft\fields\Checkboxes;
use craft\fields\Color;
use craft\fields\Country;
use craft\fields\Date;
use craft\fields\Dropdown;
use craft\fields\Email;
use craft\fields\Entries;
use craft\fields\Json;
use craft\fields\Lightswitch;
use craft\fields\Money;
use craft\fields\MultiSelect;
use craft\fields\Number;
use craft\fields\PlainText;
use craft\fields\RadioButtons;
use craft\fields\Table;
use craft\fields\Time;
use craft\helpers\StringHelper;
use craft\models\EntryType;
use craft\models\CategoryGroup;
use craft\models\CategoryGroup_SiteSettings;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use craft\models\Section;
use craft\models\Section_SiteSettings;
use craft\models\TagGroup;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\fields\AutofillField;
use jtdev\craftautofill\models\Workflow;
use Tests\Support\AssetTestProject;
use Tests\Support\TestProject;
use RuntimeException;
use yii\console\ExitCode;

final class SeedController extends Controller
{
    public $defaultAction = 'index';

    public function actionIndex(): int
    {
        if (Craft::$app->getEntries()->getSectionByHandle('autofillSamples') !== null) {
            $this->stdout("Sample project already exists.\n");
            return ExitCode::OK;
        }

        Craft::$app->getPlugins()->switchEdition('autofill', AutofillPlugin::EDITION_PRO);
        $siteId = (int)Craft::$app->getSites()->getPrimarySite()->id;
        $relationSources = $this->createRelatedElementSamples($siteId);
        $fields = $this->createFields($relationSources);
        foreach ($fields as $field) {
            if (!Craft::$app->getFields()->saveField($field)) {
                throw new RuntimeException(sprintf(
                    'Could not save %s: %s',
                    $field->name,
                    implode(' ', $field->getErrorSummary(true)),
                ));
            }
        }

        $autofill = new AutofillField([
            'name' => 'Generate with Autofill',
            'handle' => 'generateWithAutofill',
            'globalPrompt' => 'Create realistic sample content for this test entry.',
        ]);
        if (!Craft::$app->getFields()->saveField($autofill)) {
            throw new RuntimeException('Could not save the sample Autofill field.');
        }

        $layout = new FieldLayout(['type' => Entry::class]);
        $tab = new FieldLayoutTab(['name' => 'Autofill fields']);
        $layout->setTabs([$tab]);
        $tab->setElements([
            new EntryTitleField(),
            ...array_map(static fn(FieldInterface $field) => new CustomField($field), [...$fields, $autofill]),
        ]);

        $entryType = new EntryType([
            'name' => 'Autofill Sample',
            'handle' => 'autofillSample',
            'uid' => StringHelper::UUID(),
        ]);
        $entryType->setFieldLayout($layout);
        foreach ($entryType->getFieldLayout()->getCustomFields() as $layoutField) {
            if ($layoutField instanceof AutofillField) {
                $layoutField->entryTypeUid = (string)$entryType->uid;
            }
        }
        $this->saveEntryType($entryType, false);

        $entryType = Craft::$app->getEntries()->getEntryTypeByUid((string)$entryType->uid);
        if (!$entryType instanceof EntryType) {
            throw new RuntimeException('Could not reload the sample entry type after its first save.');
        }

        $rows = [];
        $autofillInstance = null;
        foreach ($entryType->getFieldLayout()->getCustomFields() as $field) {
            if ($field instanceof AutofillField) {
                $autofillInstance = $field;
                continue;
            }
            $rows[] = [
                'targetFieldUid' => (string)($field->layoutElement->uid ?? $field->uid),
                'prompt' => 'Generate a useful value for ' . $field->name . '.',
                'requiresApproval' => true,
                'overrideCurrentValue' => true,
            ];
        }
        if (!$autofillInstance instanceof AutofillField) {
            throw new RuntimeException('Could not find the Autofill layout field after saving the sample entry type.');
        }
        $autofill->entryTypeUid = (string)$entryType->uid;
        $autofill->rows = $rows;
        if (!Craft::$app->getFields()->saveField($autofill)) {
            throw new RuntimeException('Could not save the configured sample Autofill field.');
        }
        $autofillInstance->entryTypeUid = (string)$entryType->uid;
        $autofillInstance->rows = $rows;
        $this->saveEntryType($entryType);
        AutofillPlugin::getInstance()->getWorkflowService()->migrateLegacyFields();

        $section = new Section([
            'name' => 'Autofill Samples',
            'handle' => 'autofillSamples',
            'type' => Section::TYPE_CHANNEL,
            'enableVersioning' => true,
        ]);
        $section->setEntryTypes([$entryType]);
        $section->setSiteSettings([new Section_SiteSettings([
            'siteId' => $siteId,
            'enabledByDefault' => true,
            'hasUrls' => true,
            'uriFormat' => 'autofill-samples/{slug}',
            'template' => 'autofill-samples/_entry',
        ])]);
        if (!Craft::$app->getEntries()->saveSection($section)) {
            throw new RuntimeException('Could not save the sample section: ' . implode(' ', $section->getErrorSummary(true)));
        }

        foreach (['Empty sample', 'Partially filled sample'] as $index => $title) {
            $entry = new Entry([
                'sectionId' => $section->id,
                'typeId' => $entryType->id,
                'siteId' => $siteId,
                'title' => $title,
                'slug' => StringHelper::toKebabCase($title),
            ]);
            if ($index === 1) {
                $entry->setFieldValue('plainTextSample', 'Existing content for override tests.');
            }
            if (!Craft::$app->getElements()->saveElement($entry)) {
                throw new RuntimeException('Could not save a sample entry: ' . implode(' ', $entry->getErrorSummary(true)));
            }
        }

        $this->stdout("Created the sample fields, Autofill configuration, and two entries.\n");
        return ExitCode::OK;
    }

    /** Seed a deterministic CP login and entry for Playwright tests in the local browser DB. */
    public function actionBrowser(): int
    {
        $username = 'autofill-browser-admin';
        $password = 'autofill-browser-test-password';
        $user = User::find()->username($username)->one();
        if (!$user instanceof User) {
            $user = new User();
            $user->username = $username;
            $user->email = 'autofill-browser-admin@example.test';
        }
        $user->admin = true;
        $user->enabled = true;
        $user->newPassword = $password;
        if (!Craft::$app->getElements()->saveElement($user, false, false, false)) {
            throw new RuntimeException('Could not save the browser test administrator: ' . implode(' ', $user->getErrorSummary(true)));
        }
        Craft::$app->getUsers()->activateUser($user);

        $entrySuffix = substr(str_replace('-', '', StringHelper::UUID()), 0, 8);
        $project = TestProject::create(new PlainText([
            'name' => 'Browser generated summary',
            'handle' => 'browserGeneratedSummary' . $entrySuffix,
        ]));
        $browserEntryType = $project['entry']->getType();
        $browserOutputFields = [
            new Lightswitch(['name' => 'Browser enabled', 'handle' => 'browserEnabled' . $entrySuffix]),
            new Dropdown([
                'name' => 'Browser status',
                'handle' => 'browserStatus' . $entrySuffix,
                'options' => [
                    ['label' => 'Ready', 'value' => 'ready'],
                    ['label' => 'Queued', 'value' => 'queued'],
                ],
            ]),
            new Json(['name' => 'Browser JSON', 'handle' => 'browserJson' . $entrySuffix]),
            new Table([
                'name' => 'Browser table',
                'handle' => 'browserTable' . $entrySuffix,
                'columns' => [
                    'col1' => ['heading' => 'Label', 'handle' => 'label', 'type' => 'singleline'],
                    'col2' => ['heading' => 'Amount', 'handle' => 'amount', 'type' => 'number'],
                ],
            ]),
        ];
        if (class_exists('craft\\ckeditor\\Field')) {
            $browserOutputFields[] = new \craft\ckeditor\Field([
                'name' => 'Browser rich text',
                'handle' => 'browserRichText' . $entrySuffix,
            ]);
        }
        foreach ($browserOutputFields as $browserOutputField) {
            if (!Craft::$app->getFields()->saveField($browserOutputField)) {
                throw new RuntimeException('Could not save browser output field: ' . implode(' ', $browserOutputField->getErrorSummary(true)));
            }
        }
        $browserLayout = $browserEntryType->getFieldLayout();
        $browserTabs = $browserLayout->getTabs();
        $browserTab = $browserTabs[0];
        $browserTab->setElements([
            ...$browserTab->getElements(),
            ...array_map(static fn(FieldInterface $field): CustomField => new CustomField($field), $browserOutputFields),
        ]);
        $browserEntryType->setFieldLayout($browserLayout);
        $this->saveEntryType($browserEntryType);
        AutofillPlugin::getInstance()->getWorkflowService()->migrateLegacyFields();

        $entry = $project['entry'];
        $section = Craft::$app->getEntries()->getSectionById((int)$entry->sectionId);
        $entryWorkflow = AutofillPlugin::getInstance()->getWorkflowService()->getByHandle($project['autofill']->workflowHandle);
        if ($entryWorkflow !== null) {
            $entryWorkflow->showOnSidebar = true;
            AutofillPlugin::getInstance()->getWorkflowService()->saveWorkflow($entryWorkflow);
        }
        $image = imagecreatetruecolor(2, 2);
        $pixel = imagecolorallocate($image, 40, 110, 180);
        imagefill($image, 0, 0, $pixel);
        ob_start();
        imagepng($image);
        $browserImage = (string)ob_get_clean();
        imagedestroy($image);
        $assetFixture = AssetTestProject::createVolumeWithAssets([
            'browser-test.png' => $browserImage,
        ], public: true);
        $asset = $assetFixture['assets'][0];
        $assetCaption = $assetFixture['volume']->getFieldLayout()->getCustomFields()[0];
        $assetCaptionUid = (string)($assetCaption->layoutElement->uid ?? $assetCaption->uid);
        $assetSuffix = substr(str_replace('-', '', (string)$assetFixture['volume']->uid), 0, 8);
        $assetWorkflow = new Workflow([
            'handle' => 'browserAssetWorkflow' . $assetSuffix,
            'name' => 'Browser asset workflow',
            'scope' => 'asset',
            'volumeUid' => (string)$assetFixture['volume']->uid,
            'rows' => [[
                'targetFieldUid' => '__native__:alt',
                'prompt' => 'Write accessible alt text for the image.',
                'requiresApproval' => true,
                'overrideCurrentValue' => true,
            ], [
                'targetFieldUid' => $assetCaptionUid,
                'prompt' => 'Write a short caption for the image.',
                'requiresApproval' => true,
                'overrideCurrentValue' => true,
            ]],
            'contextRows' => [[
                'fieldUid' => '__asset__:file',
                'prompt' => 'Inspect the current image.',
                'enabled' => true,
                'assets' => ['metadata' => ['filename'], 'includeFile' => true, 'maxFiles' => 1],
            ]],
        ]);
        $workflowService = AutofillPlugin::getInstance()->getWorkflowService();
        if (!$workflowService->saveWorkflow($assetWorkflow)) {
            throw new RuntimeException('Could not save the browser asset workflow: ' . implode(' ', $assetWorkflow->getFirstErrors()));
        }
        $assetAutofillField = new AutofillField([
            'name' => 'Generate asset copy',
            'handle' => 'generateAssetCopy' . $assetSuffix,
            'workflowHandle' => $assetWorkflow->handle,
        ]);
        if (!Craft::$app->getFields()->saveField($assetAutofillField)) {
            throw new RuntimeException('Could not save the browser asset Autofill field: ' . implode(' ', $assetAutofillField->getErrorSummary(true)));
        }
        $assetLayout = $assetFixture['volume']->getFieldLayout();
        $assetTab = $assetLayout->getTabs()[0];
        $assetTab->setElements([...$assetTab->getElements(), new CustomField($assetAutofillField)]);
        $assetFixture['volume']->setFieldLayout($assetLayout);
        if (!Craft::$app->getVolumes()->saveVolume($assetFixture['volume'])) {
            throw new RuntimeException('Could not attach the browser Autofill field to the asset volume.');
        }

        $editorUsername = 'autofill-browser-editor';
        $editorPassword = 'autofill-browser-editor-password';
        $editor = User::find()->username($editorUsername)->one();
        if (!$editor instanceof User) {
            $editor = new User();
            $editor->username = $editorUsername;
            $editor->email = 'autofill-browser-editor@example.test';
        }
        $editor->admin = false;
        $editor->enabled = true;
        $editor->newPassword = $editorPassword;
        if (!Craft::$app->getElements()->saveElement($editor, false, false, false)) {
            throw new RuntimeException('Could not save the browser test editor: ' . implode(' ', $editor->getErrorSummary(true)));
        }
        Craft::$app->getUsers()->activateUser($editor);
        if ($section !== null) {
            Craft::$app->getUserPermissions()->saveUserPermissions((int)$editor->id, [
                'accessCp',
                'viewEntries:' . $section->uid,
                'saveEntries:' . $section->uid,
            ]);
        }

        $this->stdout(json_encode([
            'username' => $username,
            'password' => $password,
            'editorUsername' => $editorUsername,
            'editorPassword' => $editorPassword,
            'entryId' => (int)$entry->id,
            'siteId' => (int)$entry->siteId,
            'sectionId' => (int)$entry->sectionId,
            'entryTypeId' => (int)$entry->typeId,
            'entryTypeUid' => (string)$entry->getType()->uid,
            'autofillFieldId' => (int)$project['autofill']->id,
            'sectionHandle' => (string)$section?->handle,
            'workflowHandle' => (string)$project['autofill']->workflowHandle,
            'sidebarWorkflowHandle' => (string)$project['autofill']->workflowHandle,
            'targetFieldHandle' => (string)$project['target']->handle,
            'outputFields' => array_map(static fn(FieldInterface $field): array => [
                'name' => (string)$field->name,
                'handle' => (string)$field->handle,
            ], $browserOutputFields),
            'editorPath' => sprintf('/admin/entries/%s/%d-%d', (string)$section?->handle, (int)$entry->id, (int)$entry->siteId),
            'assetId' => (int)$asset->id,
            'volumeUid' => (string)$assetFixture['volume']->uid,
            'assetWorkflowHandle' => $assetWorkflow->handle,
            'assetAutofillFieldId' => (int)$assetAutofillField->id,
            'assetCaptionFieldHandle' => (string)$assetCaption->handle,
            'assetEditorPath' => (string)$asset->getCpEditUrl(),
        ], JSON_THROW_ON_ERROR) . "\n");
        return ExitCode::OK;
    }

    /**
     * @param array{category: string, tag: string} $relationSources
     * @return FieldInterface[]
     */
    private function createFields(array $relationSources): array
    {
        $options = [
            ['label' => 'Alpha', 'value' => 'alpha', 'default' => true],
            ['label' => 'Beta', 'value' => 'beta', 'default' => false],
        ];
        $definitions = [
            [PlainText::class, 'Plain Text Sample', 'plainTextSample', []],
            [Lightswitch::class, 'Lightswitch Sample', 'lightswitchSample', []],
            [Number::class, 'Number Sample', 'numberSample', []],
            [Date::class, 'Date Sample', 'dateSample', []],
            [Time::class, 'Time Sample', 'timeSample', []],
            [Dropdown::class, 'Dropdown Sample', 'dropdownSample', ['options' => $options]],
            [Checkboxes::class, 'Checkboxes Sample', 'checkboxesSample', ['options' => $options]],
            [MultiSelect::class, 'Multi-select Sample', 'multiSelectSample', ['options' => $options]],
            [RadioButtons::class, 'Radio Buttons Sample', 'radioButtonsSample', ['options' => $options]],
            [Color::class, 'Color Sample', 'colorSample', ['allowCustomColors' => true]],
            [Country::class, 'Country Sample', 'countrySample', []],
            [Json::class, 'JSON Sample', 'jsonSample', []],
            [Money::class, 'Money Sample', 'moneySample', ['currency' => 'USD']],
            [Table::class, 'Table Sample', 'tableSample', ['columns' => [
                'col1' => ['heading' => 'Label', 'handle' => 'label', 'type' => 'singleline'],
                'col2' => ['heading' => 'Amount', 'handle' => 'amount', 'type' => 'number'],
            ]]],
            [Email::class, 'Email Sample', 'emailSample', []],
            [Addresses::class, 'Addresses Sample', 'addressesSample', []],
            [Entries::class, 'Entries Sample', 'entriesSample', []],
            ['craft\\fields\\ButtonGroup', 'Button Group Sample', 'buttonGroupSample', ['options' => $options]],
            ['craft\\fields\\Icon', 'Icon Sample', 'iconSample', []],
            ['craft\\fields\\Link', 'Link Sample', 'linkSample', ['types' => ['url']]],
            ['craft\\fields\\Range', 'Range Sample', 'rangeSample', ['min' => 0, 'max' => 100, 'step' => 1]],
            ['craft\\fields\\Categories', 'Categories Sample', 'categoriesSample', ['source' => $relationSources['category']]],
            ['craft\\fields\\Tags', 'Tags Sample', 'tagsSample', ['source' => $relationSources['tag']]],
            ['craft\\ckeditor\\Field', 'CKEditor Sample', 'ckeditorSample', []],
            ['nystudio107\\seomatic\\fields\\SeoSettings', 'SEOmatic Sample', 'seomaticSample', []],
        ];

        $fields = [];
        foreach ($definitions as [$class, $name, $handle, $settings]) {
            if (!class_exists($class)) {
                continue;
            }
            $fields[] = new $class(['name' => $name, 'handle' => $handle, ...$settings]);
        }
        return $fields;
    }

    private function saveEntryType(EntryType $entryType, bool $runValidation = true): void
    {
        if (!Craft::$app->getEntries()->saveEntryType($entryType, $runValidation)) {
            throw new RuntimeException('Could not save the sample entry type: ' . implode(' ', $entryType->getErrorSummary(true)));
        }
    }

    /** @return array{category: string, tag: string} */
    private function createRelatedElementSamples(int $siteId): array
    {
        $categoryGroup = new CategoryGroup([
            'name' => 'Autofill Categories',
            'handle' => 'autofillCategories',
        ]);
        $categoryGroup->setFieldLayout(new FieldLayout(['type' => Category::class]));
        $categoryGroup->setSiteSettings([new CategoryGroup_SiteSettings([
            'siteId' => $siteId,
            'hasUrls' => false,
        ])]);
        if (!Craft::$app->getCategories()->saveGroup($categoryGroup)) {
            throw new RuntimeException('Could not save the sample category group.');
        }

        $category = new Category([
            'groupId' => $categoryGroup->id,
            'siteId' => $siteId,
            'title' => 'Sample Category',
            'slug' => 'sample-category',
        ]);
        if (!Craft::$app->getElements()->saveElement($category)) {
            throw new RuntimeException('Could not save the sample category.');
        }

        $tagGroup = new TagGroup([
            'name' => 'Autofill Tags',
            'handle' => 'autofillTags',
        ]);
        $tagGroup->setFieldLayout(new FieldLayout(['type' => Tag::class]));
        if (!Craft::$app->getTags()->saveTagGroup($tagGroup)) {
            throw new RuntimeException('Could not save the sample tag group.');
        }

        $tag = new Tag([
            'groupId' => $tagGroup->id,
            'siteId' => $siteId,
            'title' => 'Sample Tag',
        ]);
        if (!Craft::$app->getElements()->saveElement($tag)) {
            throw new RuntimeException('Could not save the sample tag.');
        }

        return [
            'category' => 'group:' . $categoryGroup->uid,
            'tag' => 'taggroup:' . $tagGroup->uid,
        ];
    }
}
