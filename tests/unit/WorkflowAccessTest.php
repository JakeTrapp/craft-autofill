<?php

declare(strict_types=1);

namespace jtdev\craftautofill\tests\unit;

use craft\elements\User;
use jtdev\craftautofill\models\Workflow;
use jtdev\craftautofill\services\permissions\WorkflowAccess;
use PHPUnit\Framework\TestCase;
use RuntimeException;

final class WorkflowAccessTest extends TestCase
{
    private function user(int $id, array $permissions = [], bool $admin = false): User
    {
        $user = $this->getMockBuilder(User::class)->disableOriginalConstructor()->onlyMethods(['can'])->getMock();
        $user->id = $id;
        $user->admin = $admin;
        $user->method('can')->willReturnCallback(static fn(string $key): bool => in_array($key, ['accessPlugin-autofill', ...$permissions], true));
        return $user;
    }

    public function testPrivateWorkflowsStayPrivateDespiteEditOthersPermission(): void
    {
        $access = new WorkflowAccess();
        $workflow = new Workflow(['ownerId' => 10, 'visibility' => 'private']);
        $other = $this->user(20, ['autofill-viewOthers', 'autofill-editOthers']);
        self::assertFalse($access->canView($workflow, $other));
        self::assertFalse($access->canEdit($workflow, $other));
        self::assertTrue($access->canView($workflow, $this->user(30, admin: true)));
        self::assertTrue($access->canEdit($workflow, $this->user(30, admin: true)));
    }

    public function testPublicDoesNotGrantEditingAndAdminManagedDefinitionsStayProtected(): void
    {
        $access = new WorkflowAccess();
        $workflow = new Workflow(['ownerId' => 10, 'visibility' => 'public']);
        self::assertTrue($access->canView($workflow, $this->user(20, ['autofill-viewOthers'])));
        self::assertFalse($access->canEdit($workflow, $this->user(20, ['autofill-viewOthers'])));
        $editor = $this->user(20, ['autofill-viewOthers', 'autofill-editOthers']);
        self::assertTrue($access->canEdit($workflow, $editor));
        $workflow->adminManaged = true;
        self::assertFalse($access->canEdit($workflow, $editor));
    }

    public function testCreatingAndEditingAreIndependentCapabilities(): void
    {
        $access = new WorkflowAccess();
        $creator = $this->user(10, ['autofill-create', 'autofill-view']);
        self::assertTrue($access->can($creator, 'create'));
        self::assertFalse($access->canEdit(new Workflow(['ownerId' => 10]), $creator));
    }

    public function testSharedPromptCanChangeButAutomaticRowCannot(): void
    {
        $access = $this->getMockBuilder(WorkflowAccess::class)->onlyMethods(['canConfigureScope', 'canUseField'])->getMock();
        $access->method('canConfigureScope')->willReturn(true);
        $access->method('canUseField')->willReturn(true);
        $owner = $this->user(10, ['autofill-view', 'autofill-edit']);
        $previous = new Workflow(['id' => 1, 'ownerId' => 10, 'rows' => [
            ['targetFieldUid' => 'a', 'prompt' => 'Automatic', 'requiresApproval' => false],
            ['targetFieldUid' => 'b', 'prompt' => 'Review', 'requiresApproval' => true],
        ]]);
        $updated = clone $previous;
        $updated->globalPrompt = 'Shared instructions may change.';
        $updated->rows[1]['prompt'] = 'Review-only instructions may change.';
        $access->assertCanSave($updated, $previous, $owner);
        $updated->rows[0]['prompt'] = 'Unauthorized automatic change';
        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Automatic output fields are read-only');
        $access->assertCanSave($updated, $previous, $owner);
    }

    public function testAutomaticPermissionCannotBeBypassedByConvertingOrDeletingRow(): void
    {
        $access = $this->getMockBuilder(WorkflowAccess::class)->onlyMethods(['canConfigureScope', 'canUseField'])->getMock();
        $access->method('canConfigureScope')->willReturn(true);
        $access->method('canUseField')->willReturn(true);
        $owner = $this->user(10, ['autofill-view', 'autofill-edit']);
        $previous = new Workflow(['id' => 1, 'ownerId' => 10, 'rows' => [['targetFieldUid' => 'a', 'requiresApproval' => false]]]);
        $updated = clone $previous;
        $updated->rows = [];
        $this->expectException(RuntimeException::class);
        $access->assertCanSave($updated, $previous, $owner);
    }
    public function testNonBooleanApprovalFlagCannotBypassAutomaticPermission(): void
    {
        $access = $this->getMockBuilder(WorkflowAccess::class)->onlyMethods(['canConfigureScope', 'canUseField'])->getMock();
        $access->method('canConfigureScope')->willReturn(true);
        $access->method('canUseField')->willReturn(true);
        $owner = $this->user(10, ['autofill-view', 'autofill-edit']);
        $previous = new Workflow(['id' => 1, 'ownerId' => 10, 'rows' => [['targetFieldUid' => 'a', 'requiresApproval' => true]]]);
        $updated = clone $previous;
        $updated->rows[0]['requiresApproval'] = 0;
        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Review requirements must be booleans');
        $access->assertCanSave($updated, $previous, $owner);
    }

}
