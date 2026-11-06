<?php

declare(strict_types=1);

namespace Tests\integration;

use Codeception\Test\Unit;
use craft\fields\PlainText;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\models\Workflow;
use jtdev\craftautofill\records\WorkflowRecord;
use Tests\Support\TestProject;

final class WorkflowPersistenceTest extends Unit
{
    public function testWorkflowRowsRoundTripWithoutLosingNestedOptions(): void
    {
        $project = TestProject::create(new PlainText(['name' => 'Workflow target', 'handle' => 'workflowTarget']));
        $workflow = new Workflow([
            'handle' => 'workflow-roundtrip',
            'name' => 'Workflow roundtrip',
            'scope' => 'entry',
            'entryTypeUid' => (string)$project['entry']->getType()->uid,
            'globalPrompt' => 'Keep the context and prompts.',
            'rows' => [[
                'targetFieldUid' => $project['targetUid'],
                'prompt' => 'Write the field.',
                'requiresApproval' => false,
                'includeCurrentFieldValue' => true,
                'overrideCurrentValue' => false,
                'enabled' => true,
                'seomatic' => ['includeSeoTitle' => true, 'includeSeoDescription' => false],
                'related' => ['mode' => 'all', 'topN' => 37, 'forceUseCurrentValues' => true],
                'link' => ['entry' => ['mode' => 'mostRecent', 'count' => 7]],
                'assets' => ['metadata' => ['filename', 'alt'], 'includeFile' => true, 'maxFiles' => 2],
            ]],
            'contextRows' => [[
                'fieldUid' => '__native__:title',
                'prompt' => 'Use the current title.',
                'enabled' => true,
                'assets' => ['metadata' => ['title'], 'includeFile' => false, 'maxFiles' => 3],
            ]],
        ]);

        $service = AutofillPlugin::getInstance()->getWorkflowService();
        self::assertTrue($service->saveWorkflow($workflow), implode(' ', $workflow->getFirstErrors()));

        $loaded = $service->getByHandle('workflow-roundtrip');
        self::assertNotNull($loaded);
        self::assertSame($workflow->rows, $loaded->rows);
        self::assertSame($workflow->contextRows, $loaded->contextRows);
        self::assertSame($workflow->entryTypeUid, $loaded->entryTypeUid);
        self::assertSame('entry', $loaded->scope);
    }

    public function testLegacyFieldMigrationKeepsSourceSnapshotAndIsIdempotent(): void
    {
        $project = TestProject::create(new PlainText(['name' => 'Legacy target', 'handle' => 'legacyTarget']));
        $field = $project['autofill'];
        $field->modelConfigUid = 'legacy-manual-model';
        $field->actionButtonLabel = 'Fill legacy content';
        $field->showUserPromptInput = false;
        $field->rows[0]['enabled'] = false;
        $field->rows[0]['includeCurrentFieldValue'] = true;
        $field->rows[0]['overrideCurrentValue'] = false;
        $field->contextRows = [[
            'fieldUid' => '__native__:title',
            'prompt' => 'Preserve this legacy context.',
            'enabled' => false,
            'assets' => [],
        ]];
        self::assertTrue(\Craft::$app->getFields()->saveField($field, runValidation: false));
        $sourceUid = (string)$field->uid;
        $expectedRows = $field->rows;
        $beforeSettings = $field->getSettings();

        $service = AutofillPlugin::getInstance()->getWorkflowService();
        $service->migrateLegacyFields();

        $linkedField = \Craft::$app->getFields()->getFieldById((int)$field->id);
        self::assertSame($field->handle, $linkedField->workflowHandle);
        self::assertSame(['workflowHandle'], $linkedField->settingsAttributes());

        $record = WorkflowRecord::find()->where(['sourceFieldUid' => $sourceUid])->one();
        self::assertInstanceOf(WorkflowRecord::class, $record);
        self::assertSame($expectedRows, $service->getByHandle($linkedField->workflowHandle)->rows);
        $migrated = $service->getByHandle($linkedField->workflowHandle);
        self::assertSame('public', $migrated->visibility);
        self::assertTrue($migrated->adminManaged);
        self::assertNull($migrated->ownerId);
        self::assertSame($field->contextRows, $migrated->contextRows);
        self::assertSame($field->modelConfigUid, $migrated->modelConfigUid);
        self::assertSame($field->actionButtonLabel, $migrated->actionButtonLabel);
        self::assertFalse($migrated->showUserPromptInput);
        self::assertSame($field->entryTypeUid, $migrated->entryTypeUid);
        self::assertSame($beforeSettings['rows'], json_decode($record->legacyConfigJson, true)['rows']);

        $countBefore = WorkflowRecord::find()->where(['sourceFieldUid' => $sourceUid])->count();
        $service->migrateLegacyFields();
        self::assertSame($countBefore, WorkflowRecord::find()->where(['sourceFieldUid' => $sourceUid])->count());
    }

    public function testLiteAllowsOneWorkflowAndKeepsItWhenEditionChanges(): void
    {
        $project = TestProject::create(
            new PlainText(['name' => 'Lite target', 'handle' => 'liteTarget']),
            AutofillPlugin::EDITION_LITE,
        );
        $service = AutofillPlugin::getInstance()->getWorkflowService();
        $first = new Workflow([
            'handle' => 'lite-first-workflow',
            'name' => 'First Lite workflow',
            'scope' => 'entry',
            'entryTypeUid' => (string)$project['entry']->getType()->uid,
        ]);
        self::assertTrue($service->saveWorkflow($first), implode(' ', $first->getFirstErrors()));

        $second = new Workflow([
            'handle' => 'lite-second-workflow',
            'name' => 'Second Lite workflow',
            'scope' => 'entry',
            'entryTypeUid' => (string)$project['entry']->getType()->uid,
        ]);
        self::assertFalse($service->saveWorkflow($second));
        self::assertNotEmpty($second->getErrors('name'));
        self::assertNotNull($service->getByHandle('lite-first-workflow'));

        TestProject::switchEdition(AutofillPlugin::EDITION_PRO);
        self::assertNotNull($service->getByHandle('lite-first-workflow'));
        self::assertTrue($service->saveWorkflow($second), implode(' ', $second->getFirstErrors()));
    }
}
