<?php

declare(strict_types=1);

namespace Tests\integration;

use Codeception\Test\Unit;
use craft\fields\PlainText;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\models\Workflow;
use RuntimeException;
use Tests\Support\TestProject;

final class WorkflowScopeTest extends Unit
{
    public function testEntryWorkflowRejectsEntriesOfAnotherEntryType(): void
    {
        $first = TestProject::create(new PlainText(['name' => 'First scope', 'handle' => 'firstScope']));
        $second = TestProject::create(new PlainText(['name' => 'Second scope', 'handle' => 'secondScope']));
        $workflow = new Workflow([
            'handle' => 'scope-entry-workflow',
            'name' => 'Entry scoped workflow',
            'scope' => 'entry',
            'entryTypeUid' => (string)$first['entry']->getType()->uid,
        ]);
        $service = AutofillPlugin::getInstance()->getWorkflowService();
        self::assertTrue($service->saveWorkflow($workflow), implode(' ', $workflow->getFirstErrors()));

        $runtime = AutofillPlugin::getInstance()->getWorkflowRuntimeService();
        $runtime->assertScope($workflow, $first['entry']);
        try {
            $runtime->assertScope($workflow, $second['entry']);
            self::fail('The workflow unexpectedly accepted an entry of a different type.');
        } catch (RuntimeException $exception) {
            self::assertStringContainsString('does not support', $exception->getMessage());
        }
    }
}
