<?php

declare(strict_types=1);

namespace Tests\integration;

use Codeception\Test\Unit;
use craft\fields\PlainText;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\models\Workflow;
use Tests\Support\TestProject;

final class WorkflowReferenceTest extends Unit
{
    public function testMissingWorkflowReferenceCanBeSavedAndResolvesWhenDefinitionIsCreated(): void
    {
        $project = TestProject::create(new PlainText(['name' => 'Late workflow target', 'handle' => 'lateWorkflowTarget']));
        $service = AutofillPlugin::getInstance()->getWorkflowService();
        $field = \Craft::$app->getFields()->getFieldById((int)$project['autofill']->id);
        $field->workflowHandle = 'workflow-created-later';
        self::assertTrue(\Craft::$app->getFields()->saveField($field), implode(' ', $field->getErrorSummary(true)));

        $field = \Craft::$app->getFields()->getFieldById((int)$field->id);
        self::assertSame(['workflowHandle'], $field->settingsAttributes());
        self::assertSame('workflow-created-later', $field->workflowHandle);
        self::assertSame('', $field->getInputHtml(null, $project['entry']));

        $workflow = new Workflow([
            'handle' => 'workflow-created-later',
            'name' => 'Created after field setup',
            'scope' => 'entry',
            'entryTypeUid' => (string)$project['entry']->getType()->uid,
            'rows' => [[
                'targetFieldUid' => $project['targetUid'],
                'prompt' => 'Write a value.',
            ]],
        ]);
        self::assertTrue($service->saveWorkflow($workflow), implode(' ', $workflow->getFirstErrors()));
        self::assertNotNull($service->resolveForField($field));
        self::assertStringContainsString('data-autofill-runtime', $field->getInputHtml(null, $project['entry']));

        $workflow->handle = 'renamed-workflow';
        self::assertTrue($service->saveWorkflow($workflow), implode(' ', $workflow->getFirstErrors()));
        self::assertNull($service->resolveForField($field));
        self::assertSame('', $field->getInputHtml(null, $project['entry']));

        self::assertTrue($service->deleteWorkflow($workflow));
        self::assertNull($service->getByHandle('renamed-workflow'));
        self::assertSame('', $field->getInputHtml(null, $project['entry']));
    }
}
