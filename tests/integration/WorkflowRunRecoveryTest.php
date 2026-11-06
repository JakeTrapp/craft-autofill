<?php

declare(strict_types=1);

namespace Tests\integration;

use Closure;
use Codeception\Test\Unit;
use Craft;
use craft\base\Model;
use craft\elements\User;
use craft\fields\PlainText;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\models\Workflow;
use jtdev\craftautofill\models\ai\AiGenerationRequest;
use jtdev\craftautofill\records\WorkflowRunRecord;
use jtdev\craftautofill\services\ai\AiProviderInterface;
use jtdev\craftautofill\services\ai\providers\openai\OpenAiProvider;
use Tests\Support\TestProject;

final class WorkflowRunRecoveryTest extends Unit
{
    private function scenario(Closure $check, bool $automatic = false): void
    {
        $fixture = TestProject::create(new PlainText(['name' => 'Recovery target', 'handle' => 'recoveryTarget']));
        $plugin = AutofillPlugin::getInstance();
        $actor = User::find()->admin()->one();
        $before = $plugin->getSettings()->modelConfigs;
        $provider = new RecoveryFixtureProvider();
        $plugin->getSettings()->modelConfigs = [['uid' => 'recovery-model', 'provider' => 'openai', 'modelId' => 'fixture', 'apiKeyEnv' => '$OPENAI_API_KEY', 'enabled' => true]];
        $plugin->getAiService()->registerProvider($provider);
        $workflow = new Workflow([
            'handle' => 'recovery-workflow', 'name' => 'Recovery workflow', 'ownerId' => (int)$actor->id,
            'entryTypeUid' => (string)$fixture['entry']->getType()->uid, 'modelConfigUid' => 'recovery-model',
            'rows' => [['targetFieldUid' => $fixture['targetUid'], 'requiresApproval' => !$automatic, 'includeCurrentFieldValue' => false, 'prompt' => 'Generate a value.']],
        ]);
        self::assertTrue($plugin->getWorkflowService()->saveWorkflow($workflow));
        try { $check($plugin, $workflow, $fixture, $actor, $provider); }
        finally {
            $plugin->getSettings()->modelConfigs = $before;
            $plugin->getAiService()->registerProvider(new OpenAiProvider());
        }
    }

    private function editor(array $fixture): User
    {
        $suffix = substr(str_replace('-', '', StringHelper::UUID()), 0, 10);
        $user = new User(['username' => 'recovery-' . $suffix, 'email' => 'recovery-' . $suffix . '@example.test', 'enabled' => true]);
        $user->newPassword = 'local-test-password';
        self::assertTrue(Craft::$app->getElements()->saveElement($user, false, false, false));
        Craft::$app->getUsers()->activateUser($user);
        $section = $fixture['entry']->getSection();
        $permissions = ['accessCp', 'accessPlugin-autofill', ...array_keys($this->autofillPermissions())];
        foreach (['viewEntries', 'saveEntries', 'viewPeerEntries', 'savePeerEntries'] as $prefix) $permissions[] = "$prefix:$section->uid";
        self::assertTrue(Craft::$app->getUserPermissions()->saveUserPermissions((int)$user->id, $permissions));
        return $user;
    }

    private function autofillPermissions(): array
    {
        return \jtdev\craftautofill\services\permissions\WorkflowAccess::permissionDefinitions();
    }

    public function testCancelledQueuedRunCannotGenerateAndReleasesEditLock(): void
    {
        $this->scenario(function($plugin, $workflow, $fixture, $actor, $provider) {
            $service = $plugin->getWorkflowRunService();
            $run = $service->start($workflow, $fixture['entry'], $actor);
            $service->cancel((int)$run->id, $actor);
            $service->process((int)$run->id);
            self::assertSame(0, $provider->calls);
            self::assertSame('cancelled', WorkflowRunRecord::findOne($run->id)->status);
            self::assertTrue($plugin->getWorkflowService()->saveWorkflow($workflow));
        });
    }

    public function testRegenerationRetainsPrivateHistoryAndUsesCurrentDefinition(): void
    {
        $this->scenario(function($plugin, $workflow, $fixture, $actor, $provider) {
            $service = $plugin->getWorkflowRunService();
            $run = $service->start($workflow, $fixture['entry'], $actor);
            $service->process((int)$run->id);
            $workflow->visibility = 'public';
            $workflow->globalPrompt = 'New shared instructions';
            self::assertTrue($plugin->getWorkflowService()->saveWorkflow($workflow));
            $new = $service->regenerate((int)$run->id, $actor);
            self::assertNotSame((int)$run->id, (int)$new->id);
            self::assertSame('superseded', WorkflowRunRecord::findOne($run->id)->status);
            self::assertSame('private', $new->visibility);
            self::assertSame('New shared instructions', Json::decode($new->definitionJson)['globalPrompt']);
            self::assertNotNull(WorkflowRunRecord::findOne($run->id)->suggestionsJson);
            $service->process((int)$new->id);
            self::assertSame(2, $provider->calls);
        });
    }

    public function testPublicRunRemainsAccessibleAfterDefinitionBecomesPrivateAndArchived(): void
    {
        $this->scenario(function($plugin, $workflow, $fixture, $actor) {
            $editor = $this->editor($fixture);
            $workflow->visibility = 'public';
            self::assertTrue($plugin->getWorkflowService()->saveWorkflow($workflow));
            $service = $plugin->getWorkflowRunService();
            $run = $service->start($workflow, $fixture['entry'], $actor);
            $service->process((int)$run->id);
            $workflow->visibility = 'private';
            self::assertTrue($plugin->getWorkflowService()->saveWorkflow($workflow));
            self::assertTrue($plugin->getWorkflowService()->deleteWorkflow($workflow));
            $restored = $service->current((int)$workflow->id, (int)$fixture['entry']->id, $fixture['siteId'], $editor);
            self::assertNotNull($restored);
            $payload = $service->payload($restored, $editor);
            self::assertSame('public', $payload['visibility']);
            self::assertArrayNotHasKey('definitionJson', $payload);
            self::assertArrayNotHasKey('globalPrompt', $payload);
            $service->decide((int)$run->id, 0, $editor, true);
            self::assertSame('Recovery fixture value', TestProject::reloadEntry($fixture['entry'])->getFieldValue('recoveryTarget'));
        });
    }

    public function testPrivateHistoryNeverAppearsToAnotherEditorAfterPublication(): void
    {
        $this->scenario(function($plugin, $workflow, $fixture, $actor) {
            $editor = $this->editor($fixture);
            $service = $plugin->getWorkflowRunService();
            $run = $service->start($workflow, $fixture['entry'], $actor);
            $service->process((int)$run->id);
            $workflow->visibility = 'public';
            self::assertTrue($plugin->getWorkflowService()->saveWorkflow($workflow));
            self::assertFalse($service->canView(WorkflowRunRecord::findOne($run->id), $editor));
            self::assertNull($service->current((int)$workflow->id, (int)$fixture['entry']->id, $fixture['siteId'], $editor));
            self::assertSame(0, $service->actionableCount($editor));
        });
    }

    public function testChangedOutputStopsAutomaticApplicationButAllowsManualAcceptance(): void
    {
        $this->scenario(function($plugin, $workflow, $fixture, $actor) {
            $service = $plugin->getWorkflowRunService();
            $run = $service->start($workflow, $fixture['entry'], $actor);
            $entry = TestProject::reloadEntry($fixture['entry']);
            $entry->setFieldValue('recoveryTarget', 'New human edit');
            self::assertTrue(Craft::$app->getElements()->saveElement($entry, false, false, false));
            $service->process((int)$run->id);
            $run = WorkflowRunRecord::findOne($run->id);
            self::assertSame('ready', $run->status);
            self::assertSame('New human edit', TestProject::reloadEntry($entry)->getFieldValue('recoveryTarget'));
            $payload = $service->payload($run, $actor);
            self::assertSame([$fixture['targetUid']], $payload['stale']['outputs']);
            self::assertFalse($payload['stale']['context']);
            $service->decide((int)$run->id, 0, $actor, true);
            self::assertSame('Recovery fixture value', TestProject::reloadEntry($entry)->getFieldValue('recoveryTarget'));
        }, true);
    }

    public function testChangedContextPausesAutomaticOutputsWithoutDiscardingResults(): void
    {
        $this->scenario(function($plugin, $workflow, $fixture, $actor) {
            $workflow->contextRows = [['fieldUid' => '__native__:title', 'enabled' => true]];
            self::assertTrue($plugin->getWorkflowService()->saveWorkflow($workflow));
            $service = $plugin->getWorkflowRunService();
            $run = $service->start($workflow, $fixture['entry'], $actor);
            $entry = TestProject::reloadEntry($fixture['entry']);
            $entry->title = 'Changed source context';
            self::assertTrue(Craft::$app->getElements()->saveElement($entry, false, false, false));
            $service->process((int)$run->id);
            $run = WorkflowRunRecord::findOne($run->id);
            self::assertSame('ready', $run->status);
            self::assertTrue($service->payload($run, $actor)['stale']['context']);
            self::assertNotSame('Recovery fixture value', TestProject::reloadEntry($entry)->getFieldValue('recoveryTarget'));
            $service->decide((int)$run->id, 0, $actor, true);
            self::assertSame('Recovery fixture value', TestProject::reloadEntry($entry)->getFieldValue('recoveryTarget'));
        }, true);
    }

    public function testPendingProBatchCanStillBeReviewedOnContentAfterDowngradingToLite(): void
    {
        $this->scenario(function($plugin, $workflow, $fixture, $actor) {
            $service = $plugin->getWorkflowRunService();
            $run = $service->start($workflow, $fixture['entry'], $actor, '', StringHelper::UUID());
            TestProject::switchEdition(AutofillPlugin::EDITION_LITE);
            $service->process((int)$run->id);
            self::assertSame('ready', WorkflowRunRecord::findOne($run->id)->status);
            $service->decide((int)$run->id, 0, $actor, true);
            self::assertSame('Recovery fixture value', TestProject::reloadEntry($fixture['entry'])->getFieldValue('recoveryTarget'));
        });
    }

    private function restrictTargetToAdmins(array $fixture): void
    {
        $type = $fixture['entry']->getType();
        foreach ($type->getFieldLayout()->getCustomFields() as $field) {
            if ((string)($field->layoutElement->uid ?? $field->uid) !== $fixture['targetUid']) continue;
            $field->layoutElement->setUserCondition(new \craft\elements\conditions\users\UserCondition(null, [
                'conditionRules' => [['class' => \craft\elements\conditions\users\AdminConditionRule::class, 'value' => true]],
            ]));
        }
        self::assertTrue(Craft::$app->getEntries()->saveEntryType($type));
    }

    public function testReviewSkipsRestrictedFieldWithoutExposingItsValueOrBadge(): void
    {
        $this->scenario(function($plugin, $workflow, $fixture, $actor) {
            $editor = $this->editor($fixture);
            $workflow->visibility = 'public';
            self::assertTrue($plugin->getWorkflowService()->saveWorkflow($workflow));
            $service = $plugin->getWorkflowRunService();
            $run = $service->start($workflow, $fixture['entry'], $actor);
            $service->process((int)$run->id);
            $this->restrictTargetToAdmins($fixture);
            $payload = $service->payload(WorkflowRunRecord::findOne($run->id), $editor);
            self::assertSame([], $payload['suggestions']);
            self::assertSame(0, $service->actionableCount($editor));
            self::assertStringNotContainsString('Recovery fixture value', Json::encode($payload));
            self::assertSame('ready', WorkflowRunRecord::findOne($run->id)->status);
        });
    }

    public function testUnavailableRequiredContextStopsGenerationBeforeQueueing(): void
    {
        $this->scenario(function($plugin, $workflow, $fixture, $actor, $provider) {
            $editor = $this->editor($fixture);
            $workflow->visibility = 'public';
            $workflow->rows = [['targetFieldUid' => '__native__:title', 'prompt' => 'Write a title.', 'requiresApproval' => true]];
            $workflow->contextRows = [['fieldUid' => $fixture['targetUid'], 'enabled' => true]];
            self::assertTrue($plugin->getWorkflowService()->saveWorkflow($workflow));
            $this->restrictTargetToAdmins($fixture);
            try {
                $plugin->getWorkflowRunService()->start($workflow, TestProject::reloadEntry($fixture['entry']), $editor);
                self::fail('Restricted context was allowed.');
            } catch (\RuntimeException $error) {
                self::assertStringContainsString('context field is unavailable', $error->getMessage());
            }
            self::assertSame(0, $provider->calls);
            self::assertFalse(WorkflowRunRecord::find()->where(['workflowId' => $workflow->id])->exists());
        });
    }

    public function testDraftResultsNeverApplyToTheCanonicalEntry(): void
    {
        $this->scenario(function($plugin, $workflow, $fixture, $actor) {
            $draft = Craft::$app->getDrafts()->createDraft($fixture['entry'], (int)$actor->id, 'Autofill draft');
            $service = $plugin->getWorkflowRunService();
            $run = $service->start($workflow, $draft, $actor);
            $service->process((int)$run->id);
            $service->decide((int)$run->id, 0, $actor, true);
            $storedDraft = Craft::$app->getElements()->getElementById((int)$draft->id, \craft\elements\Entry::class, (int)$draft->siteId);
            self::assertSame('Recovery fixture value', $storedDraft->getFieldValue('recoveryTarget'));
            self::assertNotSame('Recovery fixture value', TestProject::reloadEntry($fixture['entry'])->getFieldValue('recoveryTarget'));
            self::assertSame((int)$draft->id, (int)WorkflowRunRecord::findOne($run->id)->elementId);
        });
    }

    public function testCliRunsRequireAcknowledgementAndUseTheSameAutomaticPolicy(): void
    {
        $this->scenario(function($plugin, $workflow, $fixture, $actor, $provider) {
            $controller = new RecordingBulkController('bulk', $plugin);
            $controller->workflow = $workflow->handle;
            $controller->user = (string)$actor->id;
            $controller->elementIds = (string)$fixture['entry']->id;
            $controller->runNow = true;
            self::assertSame(1, $controller->actionRun());
            self::assertStringContainsString('confirm-automatic', $controller->messages);
            self::assertSame(0, $provider->calls);
            $controller->confirmAutomatic = true;
            self::assertSame(0, $controller->actionRun(), $controller->messages);
            self::assertSame('Recovery fixture value', TestProject::reloadEntry($fixture['entry'])->getFieldValue('recoveryTarget'));
        }, true);
    }

    public function testLegacyCliFieldIdentifierLeavesRequiredReviewPending(): void
    {
        $this->scenario(function($plugin, $workflow, $fixture, $actor) {
            $field = $fixture['autofill'];
            $field->workflowHandle = $workflow->handle;
            self::assertTrue(Craft::$app->getFields()->saveField($field));
            $controller = new RecordingBulkController('bulk', $plugin);
            $controller->fieldId = (int)$field->id;
            $controller->user = (string)$actor->id;
            $controller->entryIds = (string)$fixture['entry']->id;
            $controller->runNow = true;
            self::assertSame(0, $controller->actionRun(), $controller->messages);
            self::assertSame('ready', WorkflowRunRecord::find()->where(['workflowId' => $workflow->id])->one()->status);
            self::assertNotSame('Recovery fixture value', TestProject::reloadEntry($fixture['entry'])->getFieldValue('recoveryTarget'));
        });
    }

    public function testFixedWorkflowIgnoresBrowserSuppliedAdditionalInstructions(): void
    {
        $this->scenario(function($plugin, $workflow, $fixture, $actor, $provider) {
            $workflow->showUserPromptInput = false;
            self::assertTrue($plugin->getWorkflowService()->saveWorkflow($workflow));
            $run = $plugin->getWorkflowRunService()->start($workflow, $fixture['entry'], $actor, 'UNAUTHORIZED_EXTRA_INSTRUCTIONS');
            self::assertSame('', $run->userPrompt);
            $plugin->getWorkflowRunService()->process((int)$run->id);
            self::assertStringNotContainsString('UNAUTHORIZED_EXTRA_INSTRUCTIONS', Json::encode($provider->lastRequest->messages));
        });
    }

    public function testRelatedCandidatesAndApplicationRespectTheInitiatingActor(): void
    {
        $secret = TestProject::create(new PlainText(['name' => 'Secret relation', 'handle' => 'secretRelation']));
        $secret['entry']->title = 'SECRET_RELATION_TITLE';
        self::assertTrue(Craft::$app->getElements()->saveElement($secret['entry'], false, false, false));
        $source = TestProject::create(new \craft\fields\Entries(['name' => 'Allowed relation field', 'handle' => 'allowedRelationField', 'sources' => ['section:' . $secret['entry']->getSection()->uid]]));
        $editor = $this->editor($source);
        self::assertFalse(Craft::$app->getElements()->canView($secret['entry'], $editor));
        $plugin = AutofillPlugin::getInstance();
        $workflow = new Workflow([
            'handle' => 'related-candidate-permissions', 'name' => 'Related candidates', 'visibility' => 'public',
            'entryTypeUid' => (string)$source['entry']->getType()->uid,
            'rows' => [['targetFieldUid' => $source['targetUid'], 'prompt' => 'Choose a related entry.', 'requiresApproval' => true, 'includeCurrentFieldValue' => false]],
        ]);
        self::assertTrue($plugin->getWorkflowService()->saveWorkflow($workflow));
        $definition = $plugin->getWorkflowService()->asField($workflow);
        $before = Craft::$app->getUser()->getIdentity();
        $prompt = $plugin->getWorkflowRuntimeService()->preview($definition, $source['entry'], '', $editor);
        self::assertStringNotContainsString('SECRET_RELATION_TITLE', $prompt);
        self::assertSame($before, Craft::$app->getUser()->getIdentity());
        try {
            $plugin->getWorkflowRuntimeService()->apply($definition, $source['entry'], ['targetFieldUid' => $source['targetUid'], 'value' => ['selectedTitles' => ['SECRET_RELATION_TITLE']]], $editor);
            self::fail('Restricted related content was assigned.');
        } catch (\RuntimeException) {
            self::assertSame([], TestProject::reloadEntry($source['entry'])->getFieldValue('allowedRelationField')->ids());
        }
        self::assertSame($before, Craft::$app->getUser()->getIdentity());
    }

    public function testUnreadableRelatedContextFailsBeforeCreatingARun(): void
    {
        $secret = TestProject::create(new PlainText(['name' => 'Secret source', 'handle' => 'secretSource']));
        $source = TestProject::create(new \craft\fields\Entries(['name' => 'Related context', 'handle' => 'relatedContext', 'sources' => ['*']]));
        $source['entry']->setFieldValue('relatedContext', [(int)$secret['entry']->id]);
        self::assertTrue(Craft::$app->getElements()->saveElement($source['entry'], false, false, false));
        $editor = $this->editor($source);
        $workflow = new Workflow([
            'handle' => 'related-context-permissions', 'name' => 'Related context', 'visibility' => 'public',
            'entryTypeUid' => (string)$source['entry']->getType()->uid,
            'rows' => [['targetFieldUid' => '__native__:title', 'prompt' => 'Write a title.', 'requiresApproval' => true]],
            'contextRows' => [['fieldUid' => $source['targetUid'], 'enabled' => true]],
        ]);
        self::assertTrue(AutofillPlugin::getInstance()->getWorkflowService()->saveWorkflow($workflow));
        try {
            AutofillPlugin::getInstance()->getWorkflowRunService()->start($workflow, TestProject::reloadEntry($source['entry']), $editor);
            self::fail('Restricted related context was accepted.');
        } catch (\RuntimeException $error) {
            self::assertStringContainsString('related context item is unavailable', $error->getMessage());
        }
        self::assertFalse(WorkflowRunRecord::find()->where(['workflowId' => $workflow->id])->exists());
    }

    public function testLegacyQueuedJobWithoutActorFailsVisiblyWithoutCallingModel(): void
    {
        $this->scenario(function($plugin, $workflow, $fixture, $actor, $provider) {
            $field = $fixture['autofill'];
            $field->workflowHandle = $workflow->handle;
            self::assertTrue(Craft::$app->getFields()->saveField($field));
            $job = new \jtdev\craftautofill\jobs\RunAutofillEntryJob(['fieldId' => (int)$field->id, 'entryId' => (int)$fixture['entry']->id, 'siteId' => $fixture['siteId']]);
            $session = Craft::$app->getUser();
            $before = $session->getIdentity();
            $session->setIdentity(null);
            try {
                $job->execute(Craft::$app->getQueue());
                self::fail('The unauthenticated legacy job silently succeeded.');
            } catch (\RuntimeException $error) {
                self::assertStringContainsString('Requeue it with an active initiating user', $error->getMessage());
            } finally { $session->setIdentity($before); }
            self::assertSame(0, $provider->calls);
            self::assertFalse(WorkflowRunRecord::find()->where(['workflowId' => $workflow->id])->exists());
        });
    }

    public function testPrivateCreatorCanReviewAnAdminStartedRunWithoutReviewOthersPermission(): void
    {
        $this->scenario(function($plugin, $workflow, $fixture, $admin) {
            $creator = $this->editor($fixture);
            $permissions = Craft::$app->getUserPermissions()->getPermissionsByUserId((int)$creator->id);
            $permissions = array_values(array_diff($permissions, ['autofill-reviewOthers']));
            self::assertTrue(Craft::$app->getUserPermissions()->saveUserPermissions((int)$creator->id, $permissions));
            $workflow->ownerId = (int)$creator->id;
            self::assertTrue($plugin->getWorkflowService()->saveWorkflow($workflow));
            $service = $plugin->getWorkflowRunService();
            $run = $service->start($workflow, $fixture['entry'], $admin);
            self::assertSame((int)$creator->id, (int)$run->privateOwnerId);
            self::assertSame((int)$admin->id, (int)$run->initiatorId);
            $service->process((int)$run->id);
            $run = WorkflowRunRecord::findOne($run->id);
            self::assertTrue($service->canView($run, $creator));
            self::assertTrue($service->payload($run, $creator)['canReview']);
            self::assertSame(1, $service->actionableCount($creator));
            $service->decide((int)$run->id, 0, $creator, true);
            self::assertSame('Recovery fixture value', TestProject::reloadEntry($fixture['entry'])->getFieldValue('recoveryTarget'));
        });
    }

    public function testRegeneratingPrivateResultsDoesNotReuseAnExistingPublicRun(): void
    {
        $this->scenario(function($plugin, $workflow, $fixture, $actor) {
            $service = $plugin->getWorkflowRunService();
            $private = $service->start($workflow, $fixture['entry'], $actor);
            $service->process((int)$private->id);
            $workflow->visibility = 'public';
            self::assertTrue($plugin->getWorkflowService()->saveWorkflow($workflow));
            $public = $service->start($workflow, $fixture['entry'], $actor);
            self::assertNotSame((int)$private->id, (int)$public->id);
            $service->process((int)$public->id);
            $replacement = $service->regenerate((int)$private->id, $actor);
            self::assertNotSame((int)$public->id, (int)$replacement->id);
            self::assertSame('private', $replacement->visibility);
            self::assertSame('public', WorkflowRunRecord::findOne($public->id)->visibility);
            self::assertSame('ready', WorkflowRunRecord::findOne($public->id)->status);
            self::assertSame('superseded', WorkflowRunRecord::findOne($private->id)->status);
        });
    }

    public function testPermissionRevokedDuringGenerationPreventsAutomaticSave(): void
    {
        $this->scenario(function($plugin, $workflow, $fixture, $actor, $provider) {
            $editor = $this->editor($fixture);
            $workflow->visibility = 'public';
            self::assertTrue($plugin->getWorkflowService()->saveWorkflow($workflow));
            $service = $plugin->getWorkflowRunService();
            $run = $service->start($workflow, $fixture['entry'], $editor);
            $provider->onGenerate = static function() use ($editor): void {
                Craft::$app->getUserPermissions()->saveUserPermissions((int)$editor->id, ['accessPlugin-autofill', 'autofill-viewOthers']);
            };
            $service->process((int)$run->id);
            self::assertSame('failed', WorkflowRunRecord::findOne($run->id)->status);
            self::assertNotSame('Recovery fixture value', TestProject::reloadEntry($fixture['entry'])->getFieldValue('recoveryTarget'));
        }, true);
    }

    public function testOwnerTransferDoesNotTransferEarlierPrivateResults(): void
    {
        $this->scenario(function($plugin, $workflow, $fixture, $admin) {
            $original = $this->editor($fixture);
            $replacement = $this->editor($fixture);
            $workflow->ownerId = (int)$original->id;
            self::assertTrue($plugin->getWorkflowService()->saveWorkflow($workflow));
            $service = $plugin->getWorkflowRunService();
            $run = $service->start($workflow, $fixture['entry'], $admin);
            $service->process((int)$run->id);
            $workflow->ownerId = (int)$replacement->id;
            self::assertTrue($plugin->getWorkflowService()->saveWorkflow($workflow));
            $run = WorkflowRunRecord::findOne($run->id);
            self::assertTrue($service->canView($run, $original));
            self::assertFalse($service->canView($run, $replacement));
            self::assertTrue($plugin->getWorkflowAccess()->canView($workflow, $replacement));
            self::assertTrue($service->canView($run, $admin));
        });
    }

    public function testPrivateReviewOwnershipBackfillUsesCapturedOwnerAndRepeatsSafely(): void
    {
        $this->scenario(function($plugin, $workflow, $fixture, $admin) {
            $original = $this->editor($fixture);
            $workflow->ownerId = (int)$original->id;
            self::assertTrue($plugin->getWorkflowService()->saveWorkflow($workflow));
            $service = $plugin->getWorkflowRunService();
            $run = $service->start($workflow, $fixture['entry'], $admin);
            $run->privateOwnerId = null;
            self::assertTrue($run->save(), 'Simulate an existing run before review ownership was stored separately.');
            $migration = new \jtdev\craftautofill\migrations\m261101_000000_private_run_ownership();
            self::assertTrue($migration->safeUp());
            self::assertSame((int)$original->id, (int)WorkflowRunRecord::findOne($run->id)->privateOwnerId);
            self::assertTrue($migration->safeUp());
            self::assertSame((int)$original->id, (int)WorkflowRunRecord::findOne($run->id)->privateOwnerId);
        });
    }
}

final class RecoveryFixtureProvider implements AiProviderInterface
{
    public int $calls = 0;
    public ?Closure $onGenerate = null;
    public ?AiGenerationRequest $lastRequest = null;
    public function getProviderKey(): string { return 'openai'; }
    public function generate(AiGenerationRequest $request, Model $providerConfig): array
    {
        $this->calls++;
        $this->lastRequest = $request;
        if ($this->onGenerate) ($this->onGenerate)();
        return ['output_text' => '{"suggestions":[{"fieldName":"recoveryTarget","value":"Recovery fixture value"}]}'];
    }
}


final class RecordingBulkController extends \jtdev\craftautofill\console\controllers\BulkController
{
    public string $messages = '';
    public function stdout($string) { $this->messages .= $string; return strlen($string); }
    public function stderr($string) { $this->messages .= $string; return strlen($string); }
}
