<?php

declare(strict_types=1);

namespace Tests\integration;

use Codeception\Test\Unit;
use craft\fields\PlainText;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\models\Workflow;
use jtdev\craftautofill\records\WorkflowRunRecord;
use RuntimeException;
use Tests\Support\TestProject;

final class WorkflowRunStorageTest extends Unit
{
    public function testVisibilityHistorySurvivesDefinitionChangesAndHistoryPreventsDestructiveDeletion(): void
    {
        $fixture = TestProject::create(new PlainText(['name' => 'Run storage', 'handle' => 'runStorage']));
        $service = AutofillPlugin::getInstance()->getWorkflowService();
        $workflow = new Workflow(['handle' => 'run-storage', 'name' => 'Run storage', 'entryTypeUid' => (string)$fixture['entry']->getType()->uid]);
        self::assertTrue($service->saveWorkflow($workflow));
        $run = new WorkflowRunRecord();
        $run->setAttributes([
            'workflowId' => $workflow->id, 'visibility' => 'private', 'elementId' => $fixture['entry']->id,
            'elementType' => 'entry', 'siteId' => $fixture['siteId'], 'status' => 'ready', 'definitionJson' => '{}',
        ], false);
        self::assertTrue($run->save());
        $workflow->visibility = 'public';
        self::assertTrue($service->saveWorkflow($workflow));
        self::assertSame('private', WorkflowRunRecord::findOne($run->id)->visibility);
        self::assertTrue($service->deleteWorkflow($workflow));
        self::assertTrue($service->getById($workflow->id)->archived);
        self::assertNotNull(WorkflowRunRecord::findOne($run->id));
    }

    public function testProcessingLocksDefinitionUntilGenerationFinishes(): void
    {
        $fixture = TestProject::create(new PlainText(['name' => 'Run lock', 'handle' => 'runLock']));
        $service = AutofillPlugin::getInstance()->getWorkflowService();
        $workflow = new Workflow(['handle' => 'run-lock', 'name' => 'Run lock', 'entryTypeUid' => (string)$fixture['entry']->getType()->uid]);
        self::assertTrue($service->saveWorkflow($workflow));
        $run = new WorkflowRunRecord();
        $run->setAttributes([
            'workflowId' => $workflow->id, 'visibility' => 'public', 'elementId' => $fixture['entry']->id,
            'elementType' => 'entry', 'siteId' => $fixture['siteId'], 'status' => 'queued', 'definitionJson' => '{}',
        ], false);
        self::assertTrue($run->save());
        try {
            $service->saveWorkflow($workflow);
            self::fail('Queued workflow was editable.');
        } catch (RuntimeException $e) {
            self::assertStringContainsString('processing', $e->getMessage());
        }
        $run->status = 'ready';
        self::assertTrue($run->save());
        self::assertTrue($service->saveWorkflow($workflow));
    }
}
