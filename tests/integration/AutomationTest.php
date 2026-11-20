<?php

declare(strict_types=1);

namespace Tests\integration;

use Codeception\Test\Unit;
use Craft;
use craft\elements\conditions\entries\EntryCondition;
use craft\elements\conditions\StatusConditionRule;
use craft\elements\Entry;
use craft\elements\User;
use craft\events\ElementEvent;
use craft\fields\PlainText;
use craft\helpers\Db;
use craft\helpers\StringHelper;
use DateTimeImmutable;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\jobs\RunAutomationJob;
use jtdev\craftautofill\jobs\RunWorkflowJob;
use jtdev\craftautofill\models\Automation;
use jtdev\craftautofill\models\Workflow;
use jtdev\craftautofill\records\AutomationRecord;
use jtdev\craftautofill\records\AutomationStateRecord;
use jtdev\craftautofill\records\WorkflowRunRecord;
use jtdev\craftautofill\services\automations\AutomationService;
use jtdev\craftautofill\services\workflows\WorkflowRuntimeService;
use RuntimeException;
use Tests\Support\TestProject;
use yii\queue\PushEvent;
use yii\queue\Queue;

final class AutomationTest extends Unit
{
    private AutomationService $service;
    private User $admin;

    protected function _before(): void
    {
        $this->service = AutofillPlugin::getInstance()->getAutomationService();
        $admin = User::find()->admin()->status(null)->one();
        self::assertInstanceOf(User::class, $admin);
        $this->admin = $admin;
        Craft::$app->getUser()->setIdentity($admin);
    }

    protected function _after(): void
    {
        WorkflowRuntimeService::$applying = 0;
        TestProject::switchEdition(AutofillPlugin::EDITION_PRO);
    }

    /** @return array{0:array,1:Workflow} */
    private function project(string $handle, array $workflowConfig = []): array
    {
        $fixture = TestProject::create(new PlainText(['name' => 'Automation target', 'handle' => $handle]));
        $workflow = new Workflow($workflowConfig + [
            'handle' => 'automation-' . strtolower(StringHelper::randomString(8)),
            'name' => 'Automation workflow',
            'ownerId' => (int)$this->admin->id,
            'scope' => 'entry',
            'entryTypeUid' => (string)$fixture['entry']->getType()->uid,
            'contextRows' => [['fieldUid' => '__native__:title', 'enabled' => true]],
            'rows' => [['targetFieldUid' => $fixture['targetUid'], 'requiresApproval' => true, 'prompt' => 'Write a value.']],
        ]);
        self::assertTrue(AutofillPlugin::getInstance()->getWorkflowService()->saveWorkflow($workflow), implode(' ', $workflow->getFirstErrors()));
        return [$fixture, $workflow];
    }

    private function automation(Workflow $workflow, array $fixture, array $config = []): Automation
    {
        return new Automation($config + [
            'name' => 'Test automation',
            'workflowId' => (int)$workflow->id,
            'siteIds' => [$fixture['siteId']],
        ]);
    }

    private function save(Automation $automation, ?User $actor = null, bool $acknowledge = false): Automation
    {
        self::assertTrue($this->service->save($automation, $actor ?? $this->admin, $acknowledge), implode(' ', $automation->getFirstErrors()));
        return $this->service->getById((int)$automation->id);
    }

    private function entry(array $fixture, string $title, bool $enabled = true): Entry
    {
        $source = $fixture['entry'];
        $entry = new Entry([
            'sectionId' => $source->sectionId, 'typeId' => $source->typeId, 'siteId' => $fixture['siteId'],
            'title' => $title, 'slug' => StringHelper::slugify($title) . '-' . StringHelper::randomString(5), 'enabled' => $enabled,
        ]);
        self::assertTrue(Craft::$app->getElements()->saveElement($entry), implode(' ', $entry->getErrorSummary(true)));
        return $entry;
    }

    private function user(array $permissions, bool $admin = false): User
    {
        $username = 'automation-' . strtolower(StringHelper::randomString(10));
        $user = new User(['username' => $username, 'email' => $username . '@example.test', 'admin' => $admin, 'enabled' => true]);
        $user->newPassword = 'automation-test-password';
        self::assertTrue(Craft::$app->getElements()->saveElement($user, false, false, false), implode(' ', $user->getErrorSummary(true)));
        Craft::$app->getUsers()->activateUser($user);
        Craft::$app->getUserPermissions()->saveUserPermissions((int)$user->id, $permissions);
        return Craft::$app->getUsers()->getUserById((int)$user->id);
    }

    private function queuedJobs(): int
    {
        return (int)Craft::$app->getQueue()->getTotalJobs();
    }

    private function runsFor(Automation $automation): array
    {
        return WorkflowRunRecord::find()->where(['automationId' => $automation->id])->orderBy(['id' => SORT_ASC])->all();
    }

    private function saveEvent(Entry $entry, bool $isNew = false): void
    {
        $this->service->afterElementSave(new ElementEvent(['element' => $entry, 'isNew' => $isNew]));
    }

    // Saving and permissions

    public function testSaveRecordsOwnerRunAsAndNextScheduledRun(): void
    {
        [$fixture, $workflow] = $this->project('automationSaveTarget');
        $saved = $this->save($this->automation($workflow, $fixture, [
            'schedule' => ['enabled' => true, 'frequency' => 'daily', 'times' => ['09:00']],
        ]));

        self::assertSame((int)$this->admin->id, $saved->ownerId);
        self::assertSame((int)$this->admin->id, $saved->runAsId);
        self::assertTrue($saved->isActive());
        self::assertNotNull($saved->nextRunAt);
        self::assertGreaterThan(time(), $saved->nextRunAt->getTimestamp());
        self::assertSame(['09:00'], $saved->schedule['times']);
        self::assertSame([$fixture['siteId']], $saved->siteIds);
    }

    public function testSaveValidatesTriggersAndName(): void
    {
        [$fixture, $workflow] = $this->project('automationValidationTarget');
        $automation = $this->automation($workflow, $fixture, [
            'name' => '  ',
            'schedule' => ['enabled' => true, 'frequency' => 'weekly'],
            'events' => ['enabled' => true, 'types' => []],
        ]);
        self::assertFalse($this->service->save($automation, $this->admin));
        self::assertNotEmpty($automation->getErrors('name'));
        self::assertSame(['Choose at least one day of the week.'], $automation->getErrors('schedule'));
        self::assertSame(['Choose at least one kind of change.'], $automation->getErrors('events'));
        self::assertNull($automation->id);
    }

    public function testSaveRejectsArchivedWorkflowsUnknownFieldsAndForeignConditions(): void
    {
        [$fixture, $workflow] = $this->project('automationRejectTarget');

        $unknownField = $this->automation($workflow, $fixture, ['fields' => ['enabled' => true, 'uids' => ['not-a-field']]]);
        $this->expectExceptionMessageFromCall(fn() => $this->service->save($unknownField, $this->admin), 'watched fields');

        $assetCondition = $this->automation($workflow, $fixture, ['condition' => ['class' => \craft\elements\conditions\assets\AssetCondition::class, 'conditionRules' => []]]);
        $this->expectExceptionMessageFromCall(fn() => $this->service->save($assetCondition, $this->admin), 'conditions are invalid');

        AutofillPlugin::getInstance()->getWorkflowService()->setArchived((int)$workflow->id, true);
        $archived = $this->automation($workflow, $fixture);
        $this->expectExceptionMessageFromCall(fn() => $this->service->save($archived, $this->admin), 'Choose an available workflow');
    }

    public function testEventTypesAreLimitedToTheWorkflowScope(): void
    {
        [$fixture, $workflow] = $this->project('automationScopeEventsTarget');
        $saved = $this->save($this->automation($workflow, $fixture, ['events' => ['enabled' => true, 'types' => ['created', 'replaced']]]));
        self::assertSame(['created'], $saved->events['types'], 'Asset-only events are dropped for entry workflows.');
    }

    public function testAutomaticFieldsNeedAcknowledgementAndPauseWhenTheyChange(): void
    {
        [$fixture, $workflow] = $this->project('automationAckTarget');
        $workflow->rows[0]['requiresApproval'] = false;
        self::assertTrue(AutofillPlugin::getInstance()->getWorkflowService()->saveWorkflow($workflow));

        $automation = $this->automation($workflow, $fixture);
        $this->expectExceptionMessageFromCall(fn() => $this->service->save($automation, $this->admin), 'apply some fields without review');

        $saved = $this->save($this->automation($workflow, $fixture), acknowledge: true);
        self::assertSame($this->service->automaticHash($workflow), $saved->acknowledgedAutomaticHash);
        self::assertSame(['Automation target'], $this->service->automaticFieldNames($workflow));
        self::assertNotNull($this->service->health($saved, false));

        // Re-saving without the box keeps the earlier acknowledgement while the fields are the same.
        $this->save($saved);

        $workflow->rows[] = ['targetFieldUid' => '__native__:slug', 'requiresApproval' => false, 'prompt' => 'Write a slug.'];
        self::assertTrue(AutofillPlugin::getInstance()->getWorkflowService()->saveWorkflow($workflow), implode(' ', $workflow->getFirstErrors()));
        self::assertNull($this->service->run((int)$saved->id, 'manual'));
        $paused = $this->service->getById((int)$saved->id);
        self::assertSame('Its workflow now applies some fields without review.', $paused->pausedReason);
        $this->expectExceptionMessageFromCall(fn() => $this->service->setEnabled((int)$saved->id, true, $this->admin), 'Open the automation to confirm');
    }

    public function testNonAdminsNeedAutomationAndBulkPermissions(): void
    {
        [$fixture, $workflow] = $this->project('automationPermissionTarget', ['visibility' => 'public']);
        $section = $fixture['entry']->getSection();
        $base = ['accesscp', 'accessplugin-autofill', 'autofill-view', 'autofill-viewothers', 'autofill-run', "viewentries:$section->uid", "saveentries:$section->uid"];

        $noAutomations = $this->user([...$base, 'autofill-bulk']);
        self::assertFalse($this->service->canCreate($noAutomations));
        $this->expectExceptionMessageFromCall(fn() => $this->service->save($this->automation($workflow, $fixture), $noAutomations), 'permission');

        $noBulk = $this->user([...$base, 'autofill-automations']);
        self::assertTrue($this->service->canCreate($noBulk));
        $this->expectExceptionMessageFromCall(fn() => $this->service->save($this->automation($workflow, $fixture), $noBulk), 'in bulk');

        $editor = $this->user([...$base, 'autofill-bulk', 'autofill-automations']);
        $saved = $this->save($this->automation($workflow, $fixture), $editor);
        self::assertSame((int)$editor->id, $saved->ownerId);
        self::assertTrue($this->service->canManage($saved, $editor));

        $colleague = $this->user([...$base, 'autofill-bulk', 'autofill-automations']);
        self::assertFalse($this->service->canManage($saved, $colleague));
        $this->expectExceptionMessageFromCall(fn() => $this->service->delete((int)$saved->id, $colleague), 'permission');
        $manager = $this->user([...$base, 'autofill-bulk', 'autofill-automations', 'autofill-automationsothers']);
        self::assertTrue($this->service->canManage($saved, $manager));
    }

    public function testOnlyAdminsChooseThePrivateReviewer(): void
    {
        [$fixture, $workflow] = $this->project('automationReviewerTarget');
        $reviewer = $this->user(['accesscp', 'accessplugin-autofill']);
        $saved = $this->save($this->automation($workflow, $fixture, ['privateOwnerId' => (int)$reviewer->id]));
        self::assertSame((int)$reviewer->id, $saved->privateOwnerId);

        [$publicFixture, $public] = $this->project('automationPublicReviewerTarget', ['visibility' => 'public']);
        $cleared = $this->save($this->automation($public, $publicFixture, ['privateOwnerId' => (int)$reviewer->id]));
        self::assertNull($cleared->privateOwnerId, 'Public workflows have no private reviewer.');
    }

    public function testPromptIsDroppedWhenTheWorkflowHidesInstructions(): void
    {
        [$fixture, $workflow] = $this->project('automationPromptTarget', ['showUserPromptInput' => false]);
        $saved = $this->save($this->automation($workflow, $fixture, ['userPrompt' => 'Be brief.']));
        self::assertSame('', $saved->userPrompt);
    }

    public function testProEditionIsRequired(): void
    {
        [$fixture, $workflow] = $this->project('automationLiteTarget');
        $saved = $this->save($this->automation($workflow, $fixture, ['schedule' => ['enabled' => true, 'frequency' => 'minutes', 'interval' => 5]]));
        TestProject::switchEdition(AutofillPlugin::EDITION_LITE);
        self::assertFalse($this->service->canCreate($this->admin));
        self::assertSame('Automations require Autofill Pro.', $this->service->problem($saved));
        self::assertSame(0, $this->service->tick(new DateTimeImmutable('+1 day')));
    }

    // Running

    public function testRunStartsEachItemOnceUntilItsContextChanges(): void
    {
        [$fixture, $workflow] = $this->project('automationRunTarget');
        $saved = $this->save($this->automation($workflow, $fixture, ['userPrompt' => 'Mention the season.']));

        self::assertSame(['started' => 1, 'skipped' => 0, 'failed' => 0], $this->service->run((int)$saved->id, 'manual'));
        $runs = $this->runsFor($saved);
        self::assertCount(1, $runs);
        self::assertSame('queued', $runs[0]->status);
        self::assertSame((int)$this->admin->id, (int)$runs[0]->initiatorId);
        self::assertSame('Mention the season.', $runs[0]->userPrompt);
        self::assertNotNull($runs[0]->batchUid);

        $reloaded = $this->service->getById((int)$saved->id);
        self::assertSame(1, $reloaded->runCount);
        self::assertSame(['trigger' => 'manual', 'started' => 1, 'skipped' => 0, 'failed' => 0], $reloaded->lastRunSummary);
        self::assertSame($runs[0]->batchUid, $reloaded->lastBatchUid);

        // Unchanged, so the next run skips it.
        self::assertSame(['started' => 0, 'skipped' => 1, 'failed' => 0], $this->service->run((int)$saved->id, 'manual'));
        $runs[0]->status = 'completed';
        $runs[0]->save(false);
        self::assertSame(['started' => 0, 'skipped' => 1, 'failed' => 0], $this->service->run((int)$saved->id, 'manual'));

        // A context change starts it again.
        $entry = TestProject::reloadEntry($fixture['entry']);
        $entry->title = 'Changed title';
        self::assertTrue(Craft::$app->getElements()->saveElement($entry));
        self::assertSame(['started' => 1, 'skipped' => 0, 'failed' => 0], $this->service->run((int)$saved->id, 'manual'));

        // A failed run is retried even without a change.
        $latest = $this->runsFor($saved)[1];
        $latest->status = 'failed';
        $latest->save(false);
        self::assertSame(['started' => 0, 'skipped' => 1, 'failed' => 0], $this->service->run((int)$saved->id, 'manual'), 'A recent failure waits for the retry period.');
        WorkflowRunRecord::updateAll(['dateUpdated' => Db::prepareDateForDb(new DateTimeImmutable('-2 days'))], ['id' => $latest->id]);
        self::assertSame(['started' => 1, 'skipped' => 0, 'failed' => 0], $this->service->run((int)$saved->id, 'manual'));
        self::assertCount(3, $this->runsFor($saved));
    }

    public function testApplyingAResultDoesNotCountAsAContextChange(): void
    {
        [$fixture, $workflow] = $this->project('automationOutputTarget');
        $saved = $this->save($this->automation($workflow, $fixture));
        $this->service->run((int)$saved->id, 'manual');
        $run = $this->runsFor($saved)[0];
        $run->status = 'completed';
        $run->save(false);

        $entry = TestProject::reloadEntry($fixture['entry']);
        $entry->setFieldValue('automationOutputTarget', 'Applied value');
        self::assertTrue(Craft::$app->getElements()->saveElement($entry));
        self::assertSame(['started' => 0, 'skipped' => 1, 'failed' => 0], $this->service->run((int)$saved->id, 'manual'));
    }

    public function testConditionsAndItemLimitNarrowWhatRuns(): void
    {
        [$fixture, $workflow] = $this->project('automationConditionTarget');
        $this->entry($fixture, 'Disabled entry', false);
        $this->entry($fixture, 'Second live entry');

        $live = $this->save($this->automation($workflow, $fixture, ['name' => 'Live only', 'onlyLive' => true]));
        self::assertTrue($live->onlyLive);
        self::assertSame(2, $this->service->run((int)$live->id, 'manual')['started'], '"Only live entries" skips disabled entries.');

        [$limitedFixture, $limitedWorkflow] = $this->project('automationLimitTarget');
        $this->entry($limitedFixture, 'Another entry');
        $this->entry($limitedFixture, 'Third entry');
        $limited = $this->save($this->automation($limitedWorkflow, $limitedFixture, ['maxItemsPerRun' => 2]));
        self::assertSame(2, $this->service->run((int)$limited->id, 'manual')['started']);
        self::assertSame(['started' => 1, 'skipped' => 2, 'failed' => 0], $this->service->run((int)$limited->id, 'manual'), 'Started items count toward the limit; skipped ones do not.');
    }

    public function testItemsThatCannotStartAreRecordedAsFailedRuns(): void
    {
        [$fixture, $workflow] = $this->project('automationFailedStartTarget');
        $saved = $this->save($this->automation($workflow, $fixture));
        // A watcher who lost access to the target field can't start runs, so each item records a failure.
        $workflow->rows = [['targetFieldUid' => 'missing-field', 'requiresApproval' => true, 'prompt' => 'x']];
        AutomationRecord::updateAll(['workflowId' => $workflow->id], ['id' => $saved->id]);
        \jtdev\craftautofill\records\WorkflowRecord::updateAll(['rowsJson' => \craft\helpers\Json::encode($workflow->rows)], ['id' => $workflow->id]);

        self::assertSame(['started' => 0, 'skipped' => 0, 'failed' => 1], $this->service->run((int)$saved->id, 'manual'));
        $failed = $this->runsFor($saved);
        self::assertCount(1, $failed);
        self::assertSame('failed', $failed[0]->status);
        self::assertStringStartsWith('This item could not start:', (string)$failed[0]->errorMessage);
    }

    public function testOnlyLiveStillAppliesWithAStatusRule(): void
    {
        [$fixture, $workflow] = $this->project('automationLiveStatusRuleTarget');
        $pending = $this->entry($fixture, 'Scheduled entry');
        $pending->postDate = new \DateTime('+1 week');
        self::assertTrue(Craft::$app->getElements()->saveElement($pending));
        self::assertSame(Entry::STATUS_PENDING, $pending->getStatus());
        $saved = $this->save($this->automation($workflow, $fixture, [
            'onlyLive' => true,
            'schedule' => ['enabled' => true, 'frequency' => 'daily'],
            'condition' => [
                'class' => EntryCondition::class,
                'conditionRules' => [
                    ['class' => StatusConditionRule::class, 'operator' => 'in', 'values' => ['live', 'pending']],
                ],
            ],
        ]));

        $this->service->run((int)$saved->id, 'schedule');
        self::assertSame([(int)$fixture['entry']->id], array_map(static fn(WorkflowRunRecord $run): int => (int)$run->elementId, $this->runsFor($saved)));
    }

    public function testRunLimitPausesAndSavingStartsCountingAgain(): void
    {
        [$fixture, $workflow] = $this->project('automationLimitPauseTarget');
        $saved = $this->save($this->automation($workflow, $fixture, ['maxRuns' => 1]));
        $this->service->run((int)$saved->id, 'manual');
        $paused = $this->service->getById((int)$saved->id);
        self::assertSame('It reached its run limit.', $paused->pausedReason);
        self::assertFalse($paused->isActive());

        $resumed = $this->save($paused);
        self::assertNull($resumed->pausedReason);
        self::assertSame(0, $resumed->runCount);
    }

    public function testScheduledRunsRespectTheMinimumGap(): void
    {
        [$fixture, $workflow] = $this->project('automationGapTarget');
        $saved = $this->save($this->automation($workflow, $fixture, ['minMinutesBetweenRuns' => 60]));
        AutomationRecord::updateAll(['lastRunAt' => Db::prepareDateForDb(new DateTimeImmutable('-10 minutes'))], ['id' => $saved->id]);
        self::assertNull($this->service->run((int)$saved->id, 'schedule'));
        self::assertNotNull($this->service->run((int)$saved->id, 'manual'), 'Run now ignores the gap.');
    }

    public function testScheduledRunsSkipDisabledAutomations(): void
    {
        [$fixture, $workflow] = $this->project('automationDisabledTarget');
        $saved = $this->save($this->automation($workflow, $fixture, ['enabled' => false]));
        self::assertNull($this->service->run((int)$saved->id, 'schedule'));
        self::assertCount(0, $this->runsFor($saved));
    }

    // Scheduling

    public function testTickQueuesDueAutomationsExactlyOnce(): void
    {
        [$fixture, $workflow] = $this->project('automationTickTarget');
        $saved = $this->save($this->automation($workflow, $fixture, ['schedule' => ['enabled' => true, 'frequency' => 'hours', 'interval' => 1, 'minute' => 0]]));
        $past = new DateTimeImmutable('-5 minutes');
        AutomationRecord::updateAll(['nextRunAt' => Db::prepareDateForDb($past)], ['id' => $saved->id]);
        $paused = $this->save($this->automation($workflow, $fixture, ['name' => 'Paused', 'schedule' => ['enabled' => true, 'frequency' => 'daily']]));
        AutomationRecord::updateAll(['nextRunAt' => Db::prepareDateForDb($past), 'pausedReason' => 'Its workflow was archived.'], ['id' => $paused->id]);

        $jobs = $this->queuedJobs();
        self::assertSame(1, $this->service->tick());
        self::assertSame($jobs + 1, $this->queuedJobs());
        self::assertSame(0, $this->service->tick(), 'A claimed automation is not queued twice.');

        $next = $this->service->getById((int)$saved->id)->nextRunAt;
        self::assertGreaterThan(time(), $next->getTimestamp());
        self::assertSame('00', $next->setTimezone(new \DateTimeZone(Craft::$app->getTimeZone()))->format('i'));
    }

    public function testFallbackTickWaitsForCronAndRunsAtMostOncePerMinute(): void
    {
        [$fixture, $workflow] = $this->project('automationFallbackTarget');
        $saved = $this->save($this->automation($workflow, $fixture, ['schedule' => ['enabled' => true, 'frequency' => 'daily']]));
        $cache = Craft::$app->getCache();
        $cache->delete('autofill:automations:fallbackTick');

        $this->service->recordCronTick();
        self::assertFalse($this->service->isUsingFallbackScheduler());
        AutomationRecord::updateAll(['nextRunAt' => Db::prepareDateForDb(new DateTimeImmutable('-1 minute'))], ['id' => $saved->id]);
        $this->service->fallbackTick();
        self::assertNotNull(AutomationRecord::findOne($saved->id)->nextRunAt);
        self::assertLessThan(time(), strtotime(AutomationRecord::findOne($saved->id)->nextRunAt . ' UTC'), 'A recent cron tick means the fallback does nothing.');

        $cache->delete(AutomationService::CRON_TICK_CACHE_KEY);
        self::assertTrue($this->service->isUsingFallbackScheduler());
        $this->service->fallbackTick();
        self::assertGreaterThan(time(), strtotime(AutomationRecord::findOne($saved->id)->nextRunAt . ' UTC'));

        AutomationRecord::updateAll(['nextRunAt' => Db::prepareDateForDb(new DateTimeImmutable('-1 minute'))], ['id' => $saved->id]);
        $this->service->fallbackTick();
        self::assertLessThan(time(), strtotime(AutomationRecord::findOne($saved->id)->nextRunAt . ' UTC'), 'The fallback runs at most once a minute.');
        $cache->delete('autofill:automations:fallbackTick');
    }

    public function testTickCanRetryTheSameSlotAfterTheQueueRejectsIt(): void
    {
        [$fixture, $workflow] = $this->project('automationQueueOutageTarget');
        $saved = $this->save($this->automation($workflow, $fixture, ['schedule' => ['enabled' => true, 'frequency' => 'daily']]));
        $now = new DateTimeImmutable();
        AutomationRecord::updateAll(['nextRunAt' => Db::prepareDateForDb($now->modify('-1 minute'))], ['id' => $saved->id]);

        $failPush = static function(PushEvent $event) use ($saved): void {
            if ($event->job instanceof RunAutomationJob && $event->job->automationId === $saved->id) {
                throw new RuntimeException('Test queue unavailable');
            }
        };
        $queue = Craft::$app->getQueue();
        $queue->on(Queue::EVENT_BEFORE_PUSH, $failPush);
        try {
            $this->service->tick($now);
        } catch (RuntimeException $error) {
            self::assertSame('Test queue unavailable', $error->getMessage());
        } finally {
            $queue->off(Queue::EVENT_BEFORE_PUSH, $failPush);
        }

        self::assertSame(1, $this->service->tick($now), 'The missed firing should remain due when the queue comes back.');
    }

    // Health

    public function testProblemsPauseTheAutomationAndTurningItOnRunsAsYou(): void
    {
        [$fixture, $workflow] = $this->project('automationHealthTarget');
        $saved = $this->save($this->automation($workflow, $fixture));

        AutofillPlugin::getInstance()->getWorkflowService()->setArchived((int)$workflow->id, true);
        self::assertNull($this->service->run((int)$saved->id, 'manual'));
        self::assertSame('Its workflow was archived.', $this->service->getById((int)$saved->id)->pausedReason);
        $this->expectExceptionMessageFromCall(fn() => $this->service->queueRun((int)$saved->id, $this->admin), 'Paused.');
        AutofillPlugin::getInstance()->getWorkflowService()->setArchived((int)$workflow->id, false);

        $inactive = $this->user([], admin: true);
        Craft::$app->getUsers()->suspendUser($inactive);
        AutomationRecord::updateAll(['runAsId' => $inactive->id, 'pausedReason' => null], ['id' => $saved->id]);
        self::assertSame('The user it runs as is inactive.', $this->service->problem($this->service->getById((int)$saved->id)));

        $otherAdmin = $this->user([], admin: true);
        $resumed = $this->service->setEnabled((int)$saved->id, true, $otherAdmin);
        self::assertSame((int)$otherAdmin->id, $resumed->runAsId);
        self::assertSame((int)$this->admin->id, $resumed->ownerId, 'Turning it on keeps the owner.');
        self::assertNull($this->service->getById((int)$saved->id)->pausedReason);

        $this->service->setEnabled((int)$saved->id, false, $this->admin);
        self::assertFalse($this->service->getById((int)$saved->id)->enabled);
    }

    public function testQueueRunPushesAJob(): void
    {
        [$fixture, $workflow] = $this->project('automationQueueRunTarget');
        $saved = $this->save($this->automation($workflow, $fixture, ['enabled' => false]));
        $jobs = $this->queuedJobs();
        $this->service->queueRun((int)$saved->id, $this->admin);
        self::assertSame($jobs + 1, $this->queuedJobs(), 'Disabled automations can still be run by hand.');
    }

    public function testRevokingManageOthersPausesAnAutomationOwnedBySomeoneElse(): void
    {
        [$fixture, $workflow] = $this->project('automationRevokedManagerTarget', ['visibility' => 'public']);
        $saved = $this->save($this->automation($workflow, $fixture, ['schedule' => ['enabled' => true, 'frequency' => 'daily']]));
        $section = $fixture['entry']->getSection();
        $permissions = [
            'accesscp', 'accessplugin-autofill', 'autofill-viewothers', 'autofill-run', 'autofill-bulk', 'autofill-automations',
            "viewentries:$section->uid", "saveentries:$section->uid", "viewpeerentries:$section->uid", "savepeerentries:$section->uid",
        ];
        $manager = $this->user([...$permissions, 'autofill-automationsothers']);
        $saved = $this->service->setEnabled((int)$saved->id, true, $manager);
        self::assertSame((int)$manager->id, $saved->runAsId);
        self::assertSame((int)$this->admin->id, $saved->ownerId);

        self::assertTrue(Craft::$app->getUserPermissions()->saveUserPermissions((int)$manager->id, $permissions));
        $manager = Craft::$app->getUsers()->getUserById((int)$manager->id);
        self::assertFalse($this->service->canManage($saved, $manager));
        self::assertNull($this->service->run((int)$saved->id, 'schedule'), 'Manage own automations does not cover another user’s automation.');
        self::assertNotNull($this->service->getById((int)$saved->id)->pausedReason);
        self::assertCount(0, $this->runsFor($saved));
    }

    // Content events

    public function testContentChangesQueueDebouncedJobs(): void
    {
        [$fixture, $workflow] = $this->project('automationEventTarget');
        $saved = $this->save($this->automation($workflow, $fixture, ['events' => ['enabled' => true, 'types' => ['saved'], 'delay' => 5]]));
        $entry = TestProject::reloadEntry($fixture['entry']);

        $jobs = $this->queuedJobs();
        $this->saveEvent($entry);
        self::assertSame($jobs + 1, $this->queuedJobs());
        $state = AutomationStateRecord::findOne(['automationId' => $saved->id, 'elementId' => $entry->id, 'siteId' => $entry->siteId]);
        self::assertNotNull($state->pendingAt);
        self::assertGreaterThan(time() + 240, strtotime($state->pendingAt . ' UTC'));

        // The job does nothing until the delay has passed.
        self::assertNull($this->service->processEvent((int)$saved->id, (int)$entry->id, (int)$entry->siteId));
        AutomationStateRecord::updateAll(['pendingAt' => Db::prepareDateForDb(new DateTimeImmutable('-1 second'))], ['id' => $state->id]);
        self::assertSame('started', $this->service->processEvent((int)$saved->id, (int)$entry->id, (int)$entry->siteId));
        self::assertNull(AutomationStateRecord::findOne($state->id)->pendingAt);
        self::assertNull($this->service->processEvent((int)$saved->id, (int)$entry->id, (int)$entry->siteId), 'A handled change does not fire twice.');

        $run = $this->runsFor($saved)[0];
        self::assertSame('queued', $run->status);
        self::assertSame(['trigger' => 'event', 'started' => 1, 'skipped' => 0, 'failed' => 0], $this->service->getById((int)$saved->id)->lastRunSummary);
    }

    public function testOwnSavesDraftsResavesAndOtherScopesAreIgnored(): void
    {
        [$fixture, $workflow] = $this->project('automationIgnoreTarget');
        $this->save($this->automation($workflow, $fixture, ['events' => ['enabled' => true, 'types' => ['saved'], 'delay' => 0]]));
        $entry = TestProject::reloadEntry($fixture['entry']);
        $jobs = $this->queuedJobs();

        WorkflowRuntimeService::$applying = 1;
        $this->saveEvent($entry);
        WorkflowRuntimeService::$applying = 0;

        $entry->resaving = true;
        $this->saveEvent($entry);
        $entry->resaving = false;

        $entry->propagating = true;
        $this->saveEvent($entry);
        $entry->propagating = false;

        $draft = Craft::$app->getDrafts()->createDraft($entry, (int)$this->admin->id);
        $this->saveEvent($draft);

        [$otherFixture] = $this->project('automationOtherScopeTarget');
        $this->saveEvent(TestProject::reloadEntry($otherFixture['entry']));

        self::assertSame($jobs, $this->queuedJobs());
    }

    public function testRemovingTheContentTriggerCancelsItsPendingRun(): void
    {
        [$fixture, $workflow] = $this->project('automationRemovedTriggerTarget');
        $saved = $this->save($this->automation($workflow, $fixture, ['events' => ['enabled' => true, 'types' => ['saved'], 'delay' => 5]]));
        $entry = TestProject::reloadEntry($fixture['entry']);
        $entry->title = 'Saved before the trigger was removed';
        self::assertTrue(Craft::$app->getElements()->saveElement($entry));

        $key = ['automationId' => $saved->id, 'elementId' => $entry->id, 'siteId' => $entry->siteId];
        self::assertNotNull(AutomationStateRecord::findOne($key)?->pendingAt);
        $saved->events['enabled'] = false;
        $saved = $this->save($saved);
        self::assertFalse($saved->hasContentTriggers());
        AutomationStateRecord::updateAll(['pendingAt' => Db::prepareDateForDb(new DateTimeImmutable('-1 second'))], $key);

        $this->service->processEvent((int)$saved->id, (int)$entry->id, (int)$entry->siteId);
        self::assertCount(0, $this->runsFor($saved), 'A manual-only automation must not fire from an old content event.');
    }

    public function testContentChangeWaitsForAnEarlierRunOnTheSameEntry(): void
    {
        [$fixture, $workflow] = $this->project('automationPendingChangeTarget');
        $saved = $this->save($this->automation($workflow, $fixture, ['fields' => ['enabled' => true, 'uids' => ['__native__:title']]]));
        self::assertSame(1, $this->service->run((int)$saved->id, 'manual')['started']);
        $firstRun = $this->runsFor($saved)[0];

        $entry = TestProject::reloadEntry($fixture['entry']);
        $entry->title = 'New title while the first run is queued';
        self::assertTrue(Craft::$app->getElements()->saveElement($entry));
        $key = ['automationId' => $saved->id, 'elementId' => $entry->id, 'siteId' => $entry->siteId];
        self::assertNotNull(AutomationStateRecord::findOne($key)?->pendingAt);
        AutomationStateRecord::updateAll(['pendingAt' => Db::prepareDateForDb(new DateTimeImmutable('-1 second'))], $key);
        $this->service->processEvent((int)$saved->id, (int)$entry->id, (int)$entry->siteId);
        self::assertCount(1, $this->runsFor($saved), 'The earlier run still owns this entry.');

        WorkflowRunRecord::updateAll(['status' => 'completed'], ['id' => $firstRun->id]);
        $state = AutomationStateRecord::findOne($key);
        if ($state?->pendingAt !== null) {
            AutomationStateRecord::updateAll(['pendingAt' => Db::prepareDateForDb(new DateTimeImmutable('-1 second'))], $key);
            $this->service->processEvent((int)$saved->id, (int)$entry->id, (int)$entry->siteId);
        }
        self::assertCount(2, $this->runsFor($saved), 'The newer edit needs a run without requiring another save.');
    }

    public function testDisabledAndPausedAutomationsIgnoreChanges(): void
    {
        [$fixture, $workflow] = $this->project('automationInactiveEventTarget');
        $off = $this->save($this->automation($workflow, $fixture, ['enabled' => false, 'events' => ['enabled' => true, 'types' => ['saved']]]));
        $entry = TestProject::reloadEntry($fixture['entry']);
        $jobs = $this->queuedJobs();
        $this->saveEvent($entry);
        self::assertSame($jobs, $this->queuedJobs());
        self::assertNull($this->service->processEvent((int)$off->id, (int)$entry->id, (int)$entry->siteId));
    }

    public function testWatchedFieldsFireOnlyWhenTheyChange(): void
    {
        [$fixture, $workflow] = $this->project('automationWatchTarget');
        $saved = $this->save($this->automation($workflow, $fixture, ['fields' => ['enabled' => true, 'uids' => ['__native__:title'], 'delay' => 0]]));
        $entry = TestProject::reloadEntry($fixture['entry']);

        // Without a saved fingerprint, Craft's dirty tracking decides.
        $jobs = $this->queuedJobs();
        $this->saveEvent($entry);
        self::assertSame($jobs, $this->queuedJobs(), 'An untouched title is not a change.');
        self::assertNotNull(AutomationStateRecord::findOne(['automationId' => $saved->id, 'elementId' => $entry->id])->watchFingerprint);

        $entry->setFieldValue('automationWatchTarget', 'Unwatched change');
        $this->saveEvent($entry);
        self::assertSame($jobs, $this->queuedJobs(), 'Changes to other fields are ignored.');

        $entry->title = 'Watched change';
        $this->saveEvent($entry);
        self::assertSame($jobs + 1, $this->queuedJobs());
        $this->saveEvent($entry);
        self::assertSame($jobs + 1, $this->queuedJobs(), 'Saving the same title again is not a change.');
    }

    public function testCreatedAndStatusEvents(): void
    {
        [$fixture, $workflow] = $this->project('automationStatusTarget');
        $automation = $this->automation($workflow, $fixture, ['events' => ['enabled' => true, 'types' => ['created', 'live', 'statusChanged']]]);
        $entry = TestProject::reloadEntry($fixture['entry']);

        $entry->firstSave = true;
        self::assertSame(['created', 'live'], $this->service->firedEvents($automation, $entry, null));
        $entry->firstSave = false;
        self::assertSame([], $this->service->firedEvents($automation, $entry, Entry::STATUS_LIVE));
        self::assertSame(['live', 'statusChanged'], $this->service->firedEvents($automation, $entry, Entry::STATUS_DISABLED));

        $entry->enabled = false;
        self::assertSame(['statusChanged'], $this->service->firedEvents($automation, $entry, Entry::STATUS_LIVE));
    }

    public function testBeforeSaveCapturesThePreviousStatusForStatusTriggers(): void
    {
        [$fixture, $workflow] = $this->project('automationPreviousStatusTarget');
        $this->save($this->automation($workflow, $fixture, ['events' => ['enabled' => true, 'types' => ['statusChanged']]]));
        $entry = TestProject::reloadEntry($fixture['entry']);
        $jobs = $this->queuedJobs();

        $entry->enabled = false;
        $this->service->beforeElementSave(new ElementEvent(['element' => $entry, 'isNew' => false]));
        self::assertTrue(Craft::$app->getElements()->saveElement($entry));
        self::assertSame($jobs + 1, $this->queuedJobs(), 'Disabling a live entry is a status change.');
    }

    // Descriptions, Inbox, and deletion

    public function testDescribeTriggers(): void
    {
        [$fixture, $workflow] = $this->project('automationDescribeTarget');
        $automation = $this->automation($workflow, $fixture, [
            'schedule' => ['enabled' => true, 'frequency' => 'minutes', 'interval' => 30],
            'events' => ['enabled' => true, 'types' => ['created', 'live'], 'delay' => 60],
            'fields' => ['enabled' => true, 'uids' => ['__native__:title', $fixture['targetUid'], '__native__:slug'], 'delay' => 5],
        ]);
        self::assertSame([
            'schedule' => 'Every 30 minutes',
            'changes' => 'When an entry is created or goes live or has a change to Title, Automation target +1 more (after 1 hour)',
        ], $this->service->describeTriggers($automation, $workflow));
        self::assertSame([], $this->service->describeTriggers($this->automation($workflow, $fixture), $workflow));
    }

    public function testDescribeTriggersForAssetsAndMinuteDelays(): void
    {
        [$fixture, $workflow] = $this->project('automationDescribeAssetTarget');
        $assetWorkflow = new Workflow(['scope' => 'asset']);
        $automation = $this->automation($workflow, $fixture, ['events' => ['enabled' => true, 'types' => ['created', 'replaced'], 'delay' => 15]]);
        self::assertSame(['changes' => 'When an asset is uploaded or has its file replaced (after 15 min)'], $this->service->describeTriggers($automation, $assetWorkflow));
    }

    public function testWatchableFieldsIncludeNativeAndLayoutFields(): void
    {
        [$fixture, $workflow] = $this->project('automationWatchableTarget');
        $fields = array_column($this->service->watchableFields($workflow), 'context', 'uid');
        self::assertTrue($fields['__native__:title'], 'Context fields are marked so new automations watch them by default.');
        self::assertArrayHasKey('__native__:slug', $fields);
        self::assertArrayHasKey($fixture['targetUid'], $fields);
        self::assertFalse($fields[$fixture['targetUid']]);
    }

    public function testRunsCarryTheAutomationAndKeepItsHistoryAfterDeletion(): void
    {
        [$fixture, $workflow] = $this->project('automationDeleteTarget');
        $saved = $this->save($this->automation($workflow, $fixture, ['name' => 'Nightly copy']));
        $this->service->run((int)$saved->id, 'manual');
        $run = $this->runsFor($saved)[0];

        $payload = AutofillPlugin::getInstance()->getWorkflowRunService()->payload($run, $this->admin);
        self::assertSame((int)$saved->id, $payload['automationId']);
        self::assertSame([(int)$saved->id => 'Nightly copy'], $this->service->namesById([(int)$saved->id, 0]));

        self::assertTrue($this->service->delete((int)$saved->id, $this->admin));
        self::assertNull($this->service->getById((int)$saved->id));
        $kept = WorkflowRunRecord::findOne($run->id);
        self::assertNotNull($kept, 'Deleting an automation keeps the runs it started.');
        self::assertNull($kept->automationId);
        self::assertFalse(AutomationStateRecord::find()->where(['automationId' => $saved->id])->exists());
    }

    // Security

    public function testEditsByOthersToAPublicWorkflowPauseTheAutomation(): void
    {
        [$fixture, $workflow] = $this->project('automationSteerTarget', ['visibility' => 'public']);
        $saved = $this->save($this->automation($workflow, $fixture));
        self::assertNull($this->service->problem($saved));

        $workflow->globalPrompt = 'Ignore the content and write something else.';
        self::assertTrue(AutofillPlugin::getInstance()->getWorkflowService()->saveWorkflow($workflow));
        self::assertNull($this->service->run((int)$saved->id, 'manual'));
        self::assertSame('Its workflow changed since it was saved.', $this->service->getById((int)$saved->id)->pausedReason);
        self::assertCount(0, $this->runsFor($saved));

        $resumed = $this->save($this->service->getById((int)$saved->id));
        self::assertNull($this->service->problem($resumed), 'Saving again confirms the new workflow.');
    }

    public function testOwnersOfPrivateWorkflowsDontReconfirmTheirOwnEdits(): void
    {
        [$fixture, $workflow] = $this->project('automationPrivateEditTarget');
        $saved = $this->save($this->automation($workflow, $fixture));
        $workflow->globalPrompt = 'A new prompt from the owner.';
        self::assertTrue(AutofillPlugin::getInstance()->getWorkflowService()->saveWorkflow($workflow));
        self::assertNull($this->service->problem($this->service->getById((int)$saved->id)));
    }

    public function testRunNowRequiresTheClickerToBeAllowedToRunIt(): void
    {
        [$fixture, $workflow] = $this->project('automationRunNowTarget', ['visibility' => 'public']);
        $saved = $this->save($this->automation($workflow, $fixture));
        $section = $fixture['entry']->getSection();

        $managerOnly = $this->user(['accesscp', 'accessplugin-autofill', 'autofill-automationsothers']);
        self::assertTrue($this->service->canManage($saved, $managerOnly));
        $this->expectExceptionMessageFromCall(fn() => $this->service->queueRun((int)$saved->id, $managerOnly), 'in bulk');

        $capable = $this->user(['accesscp', 'accessplugin-autofill', 'autofill-automationsothers', 'autofill-viewothers', 'autofill-run', 'autofill-bulk', "viewentries:$section->uid", "saveentries:$section->uid"]);
        $jobs = $this->queuedJobs();
        $this->service->queueRun((int)$saved->id, $capable);
        self::assertSame($jobs + 1, $this->queuedJobs());
    }

    public function testFailedItemsWaitBeforeTheyAreRetried(): void
    {
        [$fixture, $workflow] = $this->project('automationBackoffTarget');
        $saved = $this->save($this->automation($workflow, $fixture));
        \jtdev\craftautofill\records\WorkflowRecord::updateAll(['rowsJson' => \craft\helpers\Json::encode([['targetFieldUid' => 'missing-field', 'requiresApproval' => true, 'prompt' => 'x']])], ['id' => $workflow->id]);

        self::assertSame(['started' => 0, 'skipped' => 0, 'failed' => 1], $this->service->run((int)$saved->id, 'manual'));
        self::assertSame(['started' => 0, 'skipped' => 1, 'failed' => 0], $this->service->run((int)$saved->id, 'manual'), 'An unchanged item that just failed is not retried.');
        self::assertCount(1, $this->runsFor($saved), 'Repeated firings do not add failed runs.');

        AutomationStateRecord::updateAll(['failedAt' => Db::prepareDateForDb(new DateTimeImmutable('-2 days'))], ['automationId' => $saved->id]);
        self::assertSame(['started' => 0, 'skipped' => 0, 'failed' => 1], $this->service->run((int)$saved->id, 'manual'), 'It is retried after the waiting period.');
    }

    public function testConditionsCannotWidenTheScope(): void
    {
        [$fixture, $workflow] = $this->project('automationScopeRuleTarget');
        $config = [
            'class' => \craft\elements\conditions\entries\EntryCondition::class,
            'config' => '{"elementType":"craft\\\\elements\\\\Entry","fieldContext":"global","fieldLayouts":[{"type":"evil"}]}',
            'conditionRules' => [
                ['class' => \craft\elements\conditions\SiteConditionRule::class, 'operator' => 'in', 'values' => ['1']],
                ['class' => \craft\elements\conditions\entries\TypeConditionRule::class, 'operator' => 'in', 'values' => ['1']],
                ['class' => \craft\elements\conditions\StatusConditionRule::class, 'operator' => 'in', 'values' => ['live']],
            ],
        ];
        $saved = $this->service->conditionFromPost($config, $workflow);
        self::assertSame([\craft\elements\conditions\StatusConditionRule::class], array_column($saved['conditionRules'], 'class'));
        self::assertArrayNotHasKey('fieldLayouts', $saved);
    }

    public function testAMissingReviewerPausesInsteadOfFallingBackToTheOwner(): void
    {
        [$fixture, $workflow] = $this->project('automationReviewerGoneTarget');
        $reviewer = $this->user(['accesscp', 'accessplugin-autofill']);
        $saved = $this->save($this->automation($workflow, $fixture, ['privateOwnerId' => (int)$reviewer->id]));
        self::assertNull($this->service->problem($saved));
        self::assertTrue(Craft::$app->getElements()->deleteElement($reviewer, true));
        $reloaded = $this->service->getById((int)$saved->id);
        self::assertSame((int)$reviewer->id, $reloaded->privateOwnerId, 'The reviewer ID is kept so the problem is visible.');
        self::assertSame('Its reviewer is no longer active.', $this->service->problem($reloaded));
    }

    public function testRunLimitIsCheckedBeforeStarting(): void
    {
        [$fixture, $workflow] = $this->project('automationLimitCheckTarget');
        $saved = $this->save($this->automation($workflow, $fixture, ['maxRuns' => 2]));
        AutomationRecord::updateAll(['runCount' => 2], ['id' => $saved->id]);
        self::assertNull($this->service->run((int)$saved->id, 'manual'));
        self::assertCount(0, $this->runsFor($saved));
        self::assertSame('It reached its run limit.', $this->service->getById((int)$saved->id)->pausedReason);
    }

    public function testOverlappingContentEventsHonorTheRunLimit(): void
    {
        [$fixture, $workflow] = $this->project('automationOverlappingEventsTarget');
        $first = TestProject::reloadEntry($fixture['entry']);
        $second = $this->entry($fixture, 'Another entry in the same automation');
        $saved = $this->save($this->automation($workflow, $fixture, [
            'maxRuns' => 1,
            'events' => ['enabled' => true, 'types' => ['saved']],
        ]));
        self::assertTrue(Craft::$app->getElements()->saveElement($first));
        self::assertTrue(Craft::$app->getElements()->saveElement($second));
        $due = Db::prepareDateForDb(new DateTimeImmutable('-1 second'));
        self::assertSame(2, AutomationStateRecord::updateAll(['pendingAt' => $due], ['automationId' => $saved->id]));

        // Start the second event while the first is still handing its workflow run to the queue.
        $overlapped = false;
        $processSecond = function(PushEvent $event) use ($saved, $second, &$overlapped): void {
            if ($event->job instanceof RunWorkflowJob && !$overlapped) {
                $overlapped = true;
                $this->service->processEvent((int)$saved->id, (int)$second->id, (int)$second->siteId);
            }
        };
        $queue = Craft::$app->getQueue();
        $queue->on(Queue::EVENT_BEFORE_PUSH, $processSecond);
        try {
            $this->service->processEvent((int)$saved->id, (int)$first->id, (int)$first->siteId);
        } finally {
            $queue->off(Queue::EVENT_BEFORE_PUSH, $processSecond);
        }

        self::assertTrue($overlapped);
        self::assertCount(1, $this->runsFor($saved), 'Two overlapping edits must not consume the same final firing.');
    }

    // When it runs: schedules

    public function testTickFiresOnlyWhenTheScheduledTimeArrivesAndAdvancesToTheNextSlot(): void
    {
        [$fixture, $workflow] = $this->project('automationSlotTarget');
        $saved = $this->save($this->automation($workflow, $fixture, ['schedule' => ['enabled' => true, 'frequency' => 'daily', 'times' => ['09:00']]]));
        $tz = new \DateTimeZone(Craft::$app->getTimeZone());
        $first = DateTimeImmutable::createFromInterface($saved->nextRunAt);
        self::assertSame('09:00', $first->setTimezone($tz)->format('H:i'), 'Times are in the site time zone.');
        self::assertGreaterThan(time(), $first->getTimestamp());
        self::assertLessThanOrEqual(86400, $first->getTimestamp() - time(), 'A daily time is never more than a day away.');

        self::assertSame(0, $this->service->tick($first->modify('-1 minute')), 'Nothing fires before the time.');
        self::assertSame(1, $this->service->tick($first), 'It fires at the time.');
        $second = DateTimeImmutable::createFromInterface($this->service->getById((int)$saved->id)->nextRunAt);
        self::assertSame($first->modify('+1 day')->setTimezone($tz)->format('Y-m-d') . ' 09:00', $second->setTimezone($tz)->format('Y-m-d H:i'));
        self::assertSame(0, $this->service->tick($first->modify('+30 minutes')), 'The same slot never fires twice.');

        // Cron down for three days: one catch-up run, then back on the schedule.
        $late = $second->modify('+3 days +2 hours');
        self::assertSame(1, $this->service->tick($late));
        self::assertSame(0, $this->service->tick($late), 'Missed slots are not replayed one by one.');
        $third = DateTimeImmutable::createFromInterface($this->service->getById((int)$saved->id)->nextRunAt);
        self::assertSame('09:00', $third->setTimezone($tz)->format('H:i'));
        self::assertGreaterThan($late->getTimestamp(), $third->getTimestamp());
        self::assertLessThanOrEqual(86400, $third->getTimestamp() - $late->getTimestamp());
    }

    public function testEditingOrTurningOffAScheduleMovesOrClearsTheNextRun(): void
    {
        [$fixture, $workflow] = $this->project('automationScheduleEditTarget');
        $saved = $this->save($this->automation($workflow, $fixture, ['schedule' => ['enabled' => true, 'frequency' => 'weekly', 'weekdays' => [1], 'times' => ['07:15']]]));
        $tz = new \DateTimeZone(Craft::$app->getTimeZone());
        self::assertSame('1 07:15', $saved->nextRunAt->setTimezone($tz)->format('N H:i'));

        $saved->schedule = ['enabled' => true, 'frequency' => 'hours', 'interval' => 4, 'minute' => 30];
        $saved = $this->save($saved);
        self::assertSame('30', $saved->nextRunAt->setTimezone($tz)->format('i'));
        self::assertLessThanOrEqual(4 * 3600, $saved->nextRunAt->getTimestamp() - time());

        $saved->schedule['enabled'] = false;
        $saved = $this->save($saved);
        self::assertNull($saved->nextRunAt);
        AutomationRecord::updateAll(['nextRunAt' => Db::prepareDateForDb(new DateTimeImmutable('-1 minute'))], ['id' => $saved->id]);
        self::assertNull($this->service->run((int)$saved->id, 'schedule'), 'A queued scheduled job does nothing once the schedule is off.');
        self::assertCount(0, $this->runsFor($saved));
    }

    // When it runs: content waiting on earlier results

    public function testAChangeWaitingOnReviewDoesNotPollAndRunsOnceTheResultIsReviewed(): void
    {
        [$fixture, $workflow] = $this->project('automationReviewWaitTarget');
        $saved = $this->save($this->automation($workflow, $fixture, ['fields' => ['enabled' => true, 'uids' => ['__native__:title']]]));
        self::assertSame(1, $this->service->run((int)$saved->id, 'manual')['started']);
        $firstRun = $this->runsFor($saved)[0];
        WorkflowRunRecord::updateAll(['status' => 'ready'], ['id' => $firstRun->id]);

        $entry = TestProject::reloadEntry($fixture['entry']);
        $entry->title = 'Edited while the first result waits for review';
        self::assertTrue(Craft::$app->getElements()->saveElement($entry));
        $key = ['automationId' => $saved->id, 'elementId' => $entry->id, 'siteId' => $entry->siteId];
        AutomationStateRecord::updateAll(['pendingAt' => Db::prepareDateForDb(new DateTimeImmutable('-1 second'))], $key);

        $jobs = $this->queuedJobs();
        $this->service->processEvent((int)$saved->id, (int)$entry->id, (int)$entry->siteId);
        self::assertCount(1, $this->runsFor($saved), 'The result waiting for review still owns this entry.');
        self::assertSame($jobs, $this->queuedJobs(), 'Waiting on a review must not re-queue a job every minute.');
        self::assertNotNull(AutomationStateRecord::findOne($key)?->pendingAt, 'The change stays pending.');

        $review = WorkflowRunRecord::findOne($firstRun->id);
        $review->status = 'completed';
        self::assertTrue($review->save(false));
        self::assertSame($jobs + 1, $this->queuedJobs(), 'Reviewing the result queues the waiting change.');
        self::assertSame('started', $this->service->processEvent((int)$saved->id, (int)$entry->id, (int)$entry->siteId));
        self::assertCount(2, $this->runsFor($saved));
        self::assertNull(AutomationStateRecord::findOne($key)?->pendingAt);
    }

    public function testSavingTheAutomationAsSomeoneElseKeepsChangesAlreadyWaiting(): void
    {
        [$fixture, $workflow] = $this->project('automationRunAsChangeTarget', ['visibility' => 'public']);
        $saved = $this->save($this->automation($workflow, $fixture, ['fields' => ['enabled' => true, 'uids' => ['__native__:title'], 'delay' => 5]]));
        $pushed = [];
        $capture = static function(PushEvent $event) use (&$pushed): void {
            if ($event->job instanceof \jtdev\craftautofill\jobs\AutomationEventJob) {
                $pushed[] = $event->job;
            }
        };
        $queue = Craft::$app->getQueue();
        $queue->on(Queue::EVENT_AFTER_PUSH, $capture);
        try {
            $entry = TestProject::reloadEntry($fixture['entry']);
            $entry->title = 'Changed just before another admin renamed the automation';
            self::assertTrue(Craft::$app->getElements()->saveElement($entry));
        } finally {
            $queue->off(Queue::EVENT_AFTER_PUSH, $capture);
        }
        self::assertCount(1, $pushed);

        $saved->name = 'Renamed by another admin';
        $saved = $this->save($saved, $this->user([], true));
        self::assertNotSame((int)$this->admin->id, $saved->runAsId);
        $key = ['automationId' => $saved->id, 'elementId' => $entry->id, 'siteId' => $entry->siteId];
        self::assertNotNull(AutomationStateRecord::findOne($key)?->pendingAt, 'Renaming it does not drop the waiting change.');

        AutomationStateRecord::updateAll(['pendingAt' => Db::prepareDateForDb(new DateTimeImmutable('-1 second'))], $key);
        self::assertSame('started', $this->service->processEvent($pushed[0]->automationId, $pushed[0]->elementId, $pushed[0]->siteId, $pushed[0]->triggerHash));
    }

    // When it runs: publication and expiry by date

    /** An entry created a day ago whose post and expiry dates are set directly, as Craft's date-driven status sees them. */
    private function datedEntry(array $fixture, string $title, string $postDate, ?string $expiryDate = null, bool $enabled = true): Entry
    {
        $entry = $this->entry($fixture, $title, $enabled);
        $db = Craft::$app->getDb();
        $db->createCommand()->update('{{%elements}}', ['dateCreated' => Db::prepareDateForDb(new DateTimeImmutable('-2 days'))], ['id' => $entry->id], updateTimestamp: false)->execute();
        $db->createCommand()->update('{{%entries}}', [
            'postDate' => Db::prepareDateForDb(new DateTimeImmutable($postDate)),
            'expiryDate' => $expiryDate !== null ? Db::prepareDateForDb(new DateTimeImmutable($expiryDate)) : null,
        ], ['id' => $entry->id], updateTimestamp: false)->execute();
        return $entry;
    }

    private function statusAutomation(Workflow $workflow, array $fixture, array $types, bool $onlyLive = false): Automation
    {
        $saved = $this->save($this->automation($workflow, $fixture, ['onlyLive' => $onlyLive, 'events' => ['enabled' => true, 'types' => $types]]));
        self::assertNotNull(AutomationRecord::findOne($saved->id)->statusCheckedAt, 'Status triggers start watching from the save.');
        // Pretend the last check was ten minutes ago.
        AutomationRecord::updateAll(['statusCheckedAt' => Db::prepareDateForDb(new DateTimeImmutable('-10 minutes'))], ['id' => $saved->id]);
        return $saved;
    }

    /** @return int[] Entry IDs with a pending change for this automation. */
    private function pendingEntries(Automation $automation): array
    {
        return array_map('intval', AutomationStateRecord::find()->select('elementId')
            ->where(['automationId' => $automation->id])->andWhere(['not', ['pendingAt' => null]])->column());
    }

    public function testPublishingByPostDateFiresGoesLiveOnce(): void
    {
        [$fixture, $workflow] = $this->project('automationPublishTarget');
        $published = $this->datedEntry($fixture, 'Scheduled post that just went live', '-5 minutes');
        $earlier = $this->datedEntry($fixture, 'Went live before the last check', '-20 minutes');
        $future = $this->datedEntry($fixture, 'Still scheduled', '+1 hour');
        $disabled = $this->datedEntry($fixture, 'Disabled scheduled post', '-5 minutes', null, false);
        $createdLive = $this->entry($fixture, 'Created already live');
        $saved = $this->statusAutomation($workflow, $fixture, ['live']);

        $this->service->tick();
        self::assertSame([(int)$published->id], $this->pendingEntries($saved));
        AutomationStateRecord::updateAll(['pendingAt' => null], ['automationId' => $saved->id]);
        $this->service->tick();
        self::assertSame([], $this->pendingEntries($saved), 'The same publication never fires twice.');

        AutomationStateRecord::updateAll(['pendingAt' => Db::prepareDateForDb(new DateTimeImmutable('-1 second'))], ['automationId' => $saved->id, 'elementId' => $published->id]);
        self::assertSame('started', $this->service->processEvent((int)$saved->id, (int)$published->id, (int)$published->siteId));
        self::assertSame([(int)$published->id], array_map(static fn(WorkflowRunRecord $run): int => (int)$run->elementId, $this->runsFor($saved)));
        unset($earlier, $future, $disabled, $createdLive);
    }

    public function testExpiryFiresStatusChangedButNotForLiveOnlyAutomations(): void
    {
        [$fixture, $workflow] = $this->project('automationExpiryTarget');
        $expired = $this->datedEntry($fixture, 'Just expired', '-1 day', '-5 minutes');
        $changes = $this->statusAutomation($workflow, $fixture, ['statusChanged']);
        $liveOnly = $this->statusAutomation($workflow, $fixture, ['statusChanged'], true);
        $goesLive = $this->statusAutomation($workflow, $fixture, ['live']);

        $this->service->tick();
        self::assertSame([(int)$expired->id], $this->pendingEntries($changes), 'Expiry is a status change.');
        self::assertSame([], $this->pendingEntries($liveOnly), '"Only live entries" ignores expiry.');
        self::assertSame([], $this->pendingEntries($goesLive), 'Expiry is not going live.');
    }

    public function testATimedStatusChangeIsRetriedWhenTheQueueRejectsIt(): void
    {
        [$fixture, $workflow] = $this->project('automationStatusQueueTarget');
        $published = $this->datedEntry($fixture, 'Published during a queue outage', '-5 minutes');
        $saved = $this->statusAutomation($workflow, $fixture, ['live']);
        $cursor = AutomationRecord::findOne($saved->id)->statusCheckedAt;

        $fail = static function(PushEvent $event): void {
            if ($event->job instanceof \jtdev\craftautofill\jobs\AutomationEventJob) {
                throw new RuntimeException('Test queue unavailable');
            }
        };
        $queue = Craft::$app->getQueue();
        $queue->on(Queue::EVENT_BEFORE_PUSH, $fail);
        try {
            $this->service->tick();
        } finally {
            $queue->off(Queue::EVENT_BEFORE_PUSH, $fail);
        }
        self::assertSame($cursor, AutomationRecord::findOne($saved->id)->statusCheckedAt, 'The check does not move past work it could not queue.');

        AutomationStateRecord::updateAll(['pendingAt' => null], ['automationId' => $saved->id]);
        $this->service->tick();
        self::assertSame([(int)$published->id], $this->pendingEntries($saved));
        self::assertNotSame($cursor, AutomationRecord::findOne($saved->id)->statusCheckedAt);
    }

    public function testChangingTheTriggersDoesNotReplayEarlierPublications(): void
    {
        [$fixture, $workflow] = $this->project('automationStatusResetTarget');
        $this->datedEntry($fixture, 'Published before the trigger was added', '-5 minutes');
        $saved = $this->save($this->automation($workflow, $fixture, ['events' => ['enabled' => true, 'types' => ['saved']]]));
        self::assertNull(AutomationRecord::findOne($saved->id)->statusCheckedAt, 'Only status triggers poll for dates.');

        $saved->events['types'] = ['live'];
        $saved = $this->save($saved);
        $this->service->tick();
        self::assertSame([], $this->pendingEntries($saved), 'A new trigger only reacts to what happens after it was saved.');

        $saved = $this->service->setEnabled((int)$saved->id, false, $this->admin);
        self::assertNull(AutomationRecord::findOne($saved->id)->statusCheckedAt);
    }

    private function expectExceptionMessageFromCall(callable $call, string $fragment): void
    {
        try {
            $call();
        } catch (RuntimeException $error) {
            self::assertStringContainsStringIgnoringCase($fragment, $error->getMessage());
            return;
        }
        self::fail(sprintf('Expected an error containing "%s".', $fragment));
    }
}
