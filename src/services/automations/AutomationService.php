<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\automations;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\elements\Asset;
use craft\elements\conditions\ElementCondition;
use craft\elements\db\ElementQueryInterface;
use craft\elements\db\EntryQuery;
use craft\elements\Entry;
use craft\elements\User;
use craft\events\ElementEvent;
use craft\helpers\DateTimeHelper;
use craft\helpers\Db;
use craft\helpers\ElementHelper;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use DateTimeImmutable;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\helpers\ErrorMessage;
use jtdev\craftautofill\helpers\Schedule;
use jtdev\craftautofill\jobs\AutomationEventJob;
use jtdev\craftautofill\jobs\RunAutomationJob;
use jtdev\craftautofill\models\Automation;
use jtdev\craftautofill\models\Workflow;
use jtdev\craftautofill\records\AutomationRecord;
use jtdev\craftautofill\records\AutomationStateRecord;
use jtdev\craftautofill\records\WorkflowRunRecord;
use jtdev\craftautofill\services\workflows\WorkflowRuntimeService;
use RuntimeException;
use Throwable;
use yii\db\Expression;

/**
 * Automations start workflow runs on a schedule or when content changes.
 * Runs use the normal run lifecycle, so results wait in the Inbox unless a row applies automatically.
 */
class AutomationService extends Component
{
    public const CRON_TICK_CACHE_KEY = 'autofill:automations:cronTick';
    private const FALLBACK_LOCK_CACHE_KEY = 'autofill:automations:fallbackTick';
    /** Without a recent cron tick, CP and queue requests check for due automations at most once a minute. */
    private const CRON_FRESH_SECONDS = 300;
    /** An event job that finds its debounce moved later leaves the work to the later job. */
    private const PENDING_TOLERANCE_SECONDS = 2;
    /** Queue jobs for content changes wait at least this long, so the save that triggered them has committed. */
    private const MIN_EVENT_DELAY_SECONDS = 5;
    private const EVENT_RETRY_DELAY_SECONDS = 60;
    /** An item that failed with unchanged context isn't retried sooner than this, so failures don't repeat AI calls or flood the inbox. */
    public const RETRY_FAILED_AFTER_SECONDS = 86400;
    /** Condition rules that would widen the automation beyond its workflow's scope and chosen sites. */
    private const SCOPE_QUERY_PARAMS = ['site', 'siteId', 'type', 'typeId', 'section', 'sectionId', 'volume', 'volumeId'];

    /** @var Automation[]|null */
    private ?array $contentAutomations = null;
    /** @var array<string, string> Status before save, keyed by element and site. */
    private array $previousStatus = [];

    // Storage

    /** @return Automation[] */
    public function getAll(): array
    {
        if (!$this->tableExists()) {
            return [];
        }
        return array_map(fn(AutomationRecord $record): Automation => $this->modelFromRecord($record),
            AutomationRecord::find()->orderBy(['name' => SORT_ASC, 'id' => SORT_ASC])->all());
    }

    public function getById(int $id): ?Automation
    {
        if (!$this->tableExists()) {
            return null;
        }
        $record = AutomationRecord::findOne($id);
        return $record ? $this->modelFromRecord($record) : null;
    }

    /** @return array<int, string> Names keyed by ID. */
    public function namesById(array $ids): array
    {
        $ids = array_values(array_unique(array_filter(array_map('intval', $ids))));
        if ($ids === [] || !$this->tableExists()) {
            return [];
        }
        return AutomationRecord::find()->select(['name', 'id'])->where(['id' => $ids])->indexBy('id')->column();
    }

    /**
     * Saves on behalf of $actor, who becomes the person the automation runs as.
     * @param bool $acknowledgeAutomatic Whether the person confirmed that some fields apply without review.
     */
    public function save(Automation $automation, User $actor, bool $acknowledgeAutomatic = false): bool
    {
        $previous = $automation->id ? $this->getById($automation->id) : null;
        if ($automation->id && $previous === null) {
            throw new RuntimeException('This automation no longer exists.');
        }
        $automation->normalizeTriggers();
        $this->assertCanSave($automation, $previous, $actor, $acknowledgeAutomatic);
        if (!$automation->validate()) {
            return false;
        }

        $record = $previous ? AutomationRecord::findOne($automation->id) : new AutomationRecord();
        if ($record === null) {
            throw new RuntimeException('This automation no longer exists.');
        }
        $automation->ownerId = $previous?->ownerId ?? (int)$actor->id;
        $automation->runAsId = (int)$actor->id;
        $automation->pausedReason = null;
        $automation->runCount = (int)($record->runCount ?? 0);
        if ($automation->maxRuns !== null && $automation->runCount >= $automation->maxRuns) {
            $automation->runCount = 0;
        }
        $automation->nextRunAt = $this->nextRunAt($automation);

        $triggerConfigurationChanged = $previous !== null && (
            $previous->isActive() !== $automation->isActive()
            || $previous->workflowId !== $automation->workflowId
            || $previous->siteIds !== $automation->siteIds
            || $previous->events !== $automation->events
            || $previous->fields !== $automation->fields
        );
        $statusCheckedAt = null;
        if ($automation->isActive() && $this->statusEvents($automation) !== []) {
            $statusCheckedAt = (!$triggerConfigurationChanged ? $record->statusCheckedAt : null)
                ?? Db::prepareDateForDb(new DateTimeImmutable());
        }
        $record->setAttributes([
            'name' => $automation->name,
            'workflowId' => $automation->workflowId,
            'ownerId' => $automation->ownerId,
            'runAsId' => $automation->runAsId,
            'enabled' => $automation->enabled,
            'pausedReason' => null,
            'triggersJson' => Json::encode(['schedule' => $automation->schedule, 'events' => $automation->events, 'fields' => $automation->fields]),
            'conditionJson' => $this->conditionJson($automation),
            'siteIdsJson' => Json::encode($automation->siteIds),
            'userPrompt' => $automation->userPrompt,
            'privateOwnerId' => $automation->privateOwnerId,
            'maxRuns' => $automation->maxRuns,
            'maxItemsPerRun' => $automation->maxItemsPerRun,
            'minMinutesBetweenRuns' => $automation->minMinutesBetweenRuns,
            'acknowledgedAutomaticHash' => $automation->acknowledgedAutomaticHash,
            'acknowledgedWorkflowHash' => $automation->acknowledgedWorkflowHash,
            'runCount' => $automation->runCount,
            'nextRunAt' => Db::prepareDateForDb($automation->nextRunAt),
            'statusCheckedAt' => $statusCheckedAt,
        ], false);
        Craft::$app->getDb()->transaction(function() use ($record, $triggerConfigurationChanged): void {
            if (!$record->save(false)) {
                throw new RuntimeException('The automation could not be saved.');
            }
            if ($triggerConfigurationChanged) {
                $this->clearPendingEvents((int)$record->id);
            }
        });
        $automation->id = (int)$record->id;
        $automation->uid = (string)$record->uid;
        $this->contentAutomations = null;
        return true;
    }

    public function delete(int $id, User $actor): bool
    {
        $automation = $this->getById($id);
        if ($automation === null) {
            return false;
        }
        if (!$this->canManage($automation, $actor)) {
            throw new RuntimeException('You do not have permission to delete this automation.');
        }
        $this->contentAutomations = null;
        return (bool)AutomationRecord::findOne($id)?->delete();
    }

    /** Turning an automation on runs it as the person who turned it on, which also clears a pause. */
    public function setEnabled(int $id, bool $enabled, User $actor): Automation
    {
        $automation = $this->getById($id);
        if ($automation === null) {
            throw new RuntimeException('This automation no longer exists.');
        }
        if (!$this->canManage($automation, $actor)) {
            throw new RuntimeException('You do not have permission to change this automation.');
        }
        if (!$enabled) {
            Craft::$app->getDb()->transaction(function() use ($id): void {
                AutomationRecord::updateAll(['enabled' => false, 'statusCheckedAt' => null], ['id' => $id]);
                $this->clearPendingEvents($id);
            });
            $automation->enabled = false;
            $this->contentAutomations = null;
            return $automation;
        }
        $automation->enabled = true;
        $workflow = AutofillPlugin::getInstance()->getWorkflowService()->getById((int)$automation->workflowId);
        $hash = $workflow ? $this->automaticHash($workflow) : null;
        if ($hash !== null && $hash !== $automation->acknowledgedAutomaticHash) {
            throw new RuntimeException('Its workflow now applies some fields without review. Open the automation to confirm.');
        }
        if (!$this->save($automation, $actor, $hash !== null)) {
            throw new RuntimeException(implode(' ', $automation->getErrorSummary(false)) ?: 'This automation needs changes before it can run.');
        }
        return $automation;
    }

    private function clearPendingEvents(int $automationId): void
    {
        AutomationStateRecord::updateAll(['pendingAt' => null], ['automationId' => $automationId]);
    }

    // Access

    public function canCreate(User $user): bool
    {
        return AutofillPlugin::getInstance()->isProEdition() && AutofillPlugin::getInstance()->getWorkflowAccess()->can($user, 'automations');
    }

    public function canManage(Automation $automation, User $user): bool
    {
        if (!AutofillPlugin::getInstance()->isProEdition()) {
            return false;
        }
        $access = AutofillPlugin::getInstance()->getWorkflowAccess();
        $own = $automation->ownerId !== null && $automation->ownerId === (int)$user->id;
        return (bool)$user->admin || $access->can($user, $own ? 'automations' : 'automationsOthers');
    }

    public function canAccessSection(User $user): bool
    {
        if (!AutofillPlugin::getInstance()->isProEdition()) {
            return false;
        }
        $access = AutofillPlugin::getInstance()->getWorkflowAccess();
        return $access->can($user, 'automations') || $access->can($user, 'automationsOthers');
    }

    /** @throws RuntimeException */
    public function assertCanSave(Automation $automation, ?Automation $previous, User $actor, bool $acknowledgeAutomatic = false): void
    {
        $plugin = AutofillPlugin::getInstance();
        $access = $plugin->getWorkflowAccess();
        if (!$plugin->isProEdition()) {
            throw new RuntimeException('Automations require Autofill Pro.');
        }
        if ($previous ? !$this->canManage($previous, $actor) : !$this->canCreate($actor)) {
            throw new RuntimeException('You do not have permission to change this automation.');
        }
        $workflow = $automation->workflowId ? $plugin->getWorkflowService()->getById($automation->workflowId) : null;
        if ($workflow === null || $workflow->archived) {
            throw new RuntimeException('Choose an available workflow.');
        }
        $this->assertCanOperate($workflow, $automation->siteIds, $actor);
        if (!$workflow->showUserPromptInput) {
            $automation->userPrompt = '';
        }
        if ($workflow->visibility !== 'private') {
            $automation->privateOwnerId = null;
        } elseif (!$actor->admin) {
            // Only administrators may send private results to someone other than the workflow owner.
            if ($automation->privateOwnerId !== ($previous?->privateOwnerId)) {
                throw new RuntimeException('Only administrators can choose who reviews results.');
            }
            if ($automation->privateOwnerId !== null && $automation->privateOwnerId !== $workflow->ownerId) {
                throw new RuntimeException('Only administrators can edit an automation that sends results to another person.');
            }
        } elseif ($automation->privateOwnerId !== null) {
            $reviewer = Craft::$app->getUsers()->getUserById($automation->privateOwnerId);
            if (!$reviewer || $reviewer->getStatus() !== User::STATUS_ACTIVE) {
                throw new RuntimeException('Choose an active reviewer.');
            }
        }
        $allowed = array_column($this->watchableFields($workflow), 'uid');
        foreach ($automation->fields['uids'] as $uid) {
            if (!in_array($uid, $allowed, true)) {
                throw new RuntimeException('One of the watched fields is no longer available.');
            }
        }
        $allowedEvents = $workflow->scope === 'asset' ? Automation::ASSET_EVENTS : Automation::ENTRY_EVENTS;
        $automation->events['types'] = array_values(array_intersect($automation->events['types'], $allowedEvents));
        if ($automation->condition !== null) {
            $automation->condition = $this->sanitizeCondition($automation->condition, $workflow);
        }
        $hash = $this->automaticHash($workflow);
        if ($hash !== null && $hash !== $previous?->acknowledgedAutomaticHash && !$acknowledgeAutomatic) {
            throw new RuntimeException('Confirm that this automation may apply some fields without review.');
        }
        $automation->acknowledgedAutomaticHash = $hash;
        $automation->acknowledgedWorkflowHash = $this->workflowHash($workflow);
    }

    /**
     * What anyone who makes an automation run on their behalf must be allowed to do: run the workflow in bulk
     * on its content and sites. Applies to saving, turning on, and "Run now".
     * @param int[] $siteIds
     * @throws RuntimeException
     */
    public function assertCanOperate(Workflow $workflow, array $siteIds, User $actor): void
    {
        $access = AutofillPlugin::getInstance()->getWorkflowAccess();
        if (!$access->canView($workflow, $actor) || !$access->can($actor, 'run') || !$access->can($actor, 'bulk') || !$access->canConfigureScope($workflow, $actor)) {
            throw new RuntimeException('You need permission to run this workflow in bulk to automate it.');
        }
        $editableSiteIds = $actor->admin ? Craft::$app->getSites()->getAllSiteIds() : $this->editableSiteIds($actor);
        foreach ($siteIds as $siteId) {
            if (!in_array($siteId, $editableSiteIds, true)) {
                throw new RuntimeException('You can’t edit content on one of the chosen sites.');
            }
        }
    }

    // Workflow details

    /** Identifies which fields apply without review, so a change to them needs confirming again. */
    public function automaticHash(Workflow $workflow): ?string
    {
        $uids = [];
        foreach ($workflow->rows as $row) {
            if (($row['enabled'] ?? true) && ($row['requiresApproval'] ?? true) === false) {
                $uids[] = (string)($row['targetFieldUid'] ?? '');
            }
        }
        if ($uids === []) {
            return null;
        }
        sort($uids);
        return hash('sha256', implode("\n", $uids));
    }

    /**
     * Identifies everything about the workflow that shapes what an automation generates. Someone else editing
     * the workflow must not steer runs that use the automation's run-as permissions, so a change pauses it.
     */
    public function workflowHash(Workflow $workflow): string
    {
        return hash('sha256', Json::encode([
            $workflow->scope, $workflow->entryTypeUid, $workflow->volumeUid, $workflow->visibility, $workflow->ownerId,
            $workflow->modelConfigUid, $workflow->globalPrompt, $workflow->showUserPromptInput, $workflow->rows, $workflow->contextRows,
        ]));
    }

    /** Only the owner and administrators can edit a private workflow, so its owner's automations needn't re-confirm their own edits. */
    private function needsWorkflowReconfirm(Automation $automation, Workflow $workflow): bool
    {
        if ($automation->acknowledgedWorkflowHash === $this->workflowHash($workflow)) {
            return false;
        }
        return !($workflow->visibility === 'private' && $workflow->ownerId !== null && $workflow->ownerId === $automation->runAsId);
    }

    public function fieldLayout(Workflow $workflow): ?FieldLayout
    {
        return $workflow->scope === 'asset'
            ? Craft::$app->getVolumes()->getVolumeByUid($workflow->volumeUid)?->getFieldLayout()
            : Craft::$app->getEntries()->getEntryTypeByUid($workflow->entryTypeUid)?->getFieldLayout();
    }

    /** @return array<int, array{uid:string,name:string,context:bool}> Fields whose changes can trigger the automation. */
    public function watchableFields(Workflow $workflow): array
    {
        $context = [];
        foreach ($workflow->contextRows as $row) {
            if ($row['enabled'] ?? true) {
                $context[(string)($row['fieldUid'] ?? '')] = true;
            }
        }
        $natives = $workflow->scope === 'asset'
            ? ['__asset__:file' => Craft::t('autofill', 'File'), '__native__:title' => Craft::t('app', 'Title'), '__native__:alt' => Craft::t('app', 'Alternative Text')]
            : ['__native__:title' => Craft::t('app', 'Title'), '__native__:slug' => Craft::t('app', 'Slug'), '__native__:postDate' => Craft::t('app', 'Post Date'), '__native__:expiryDate' => Craft::t('app', 'Expiry Date')];
        $fields = [];
        foreach ($natives as $uid => $name) {
            $fields[] = ['uid' => $uid, 'name' => $name, 'context' => isset($context[$uid])];
        }
        foreach ($this->fieldLayout($workflow)?->getCustomFields() ?? [] as $field) {
            $uid = (string)($field->layoutElement->uid ?? $field->uid);
            $name = trim((string)($field->layoutElement?->label() ?? '')) ?: (string)$field->name;
            $fields[] = ['uid' => $uid, 'name' => $name, 'context' => isset($context[$uid])];
        }
        return $fields;
    }

    /** @return class-string<Entry|Asset> */
    public function elementType(Workflow $workflow): string
    {
        return $workflow->scope === 'asset' ? Asset::class : Entry::class;
    }

    public function condition(Automation $automation, Workflow $workflow): ElementCondition
    {
        $expected = get_class($this->elementType($workflow)::createCondition());
        $config = $automation->condition !== null && ($automation->condition['class'] ?? null) === $expected ? $automation->condition : [];
        return $this->buildCondition($config, $workflow);
    }

    /**
     * Builds the workflow's element condition from a config, keeping only rules Craft allows here.
     * Rules that would change the site, section, entry type, or volume are dropped, so conditions only narrow.
     */
    private function buildCondition(array $config, Workflow $workflow): ElementCondition
    {
        /** @var ElementCondition $condition */
        $condition = $this->elementType($workflow)::createCondition();
        if (is_string($config['fieldContext'] ?? null)) {
            $condition->fieldContext = $config['fieldContext'];
        }
        $condition->queryParams = self::SCOPE_QUERY_PARAMS;
        $layout = $this->fieldLayout($workflow);
        if ($layout !== null) {
            $condition->setFieldLayouts([$layout]);
        }
        foreach ((array)($config['conditionRules'] ?? []) as $ruleConfig) {
            if (!is_array($ruleConfig)) {
                continue;
            }
            try {
                $condition->addConditionRule(Craft::$app->getConditions()->createConditionRule($ruleConfig));
            } catch (Throwable) {
                // A rule whose field was removed, or one that isn't allowed here, is skipped.
            }
        }
        return $condition;
    }

    /** New automations start with a status rule, so they skip disabled content unless someone removes it. */
    /**
     * Narrows a query to elements that match all rules, or any rule when $matchAny is set.
     * Craft's conditions only support "all", so "any" collects each rule's matches separately.
     */
    public function applyCondition(ElementCondition $condition, ElementQueryInterface $query, bool $matchAny): void
    {
        $rules = $condition->getConditionRules();
        if (!$matchAny || count($rules) < 2) {
            $condition->modifyQuery($query);
            return;
        }
        $ids = [];
        foreach ($rules as $rule) {
            $ruleQuery = clone $query;
            try {
                /** @var \craft\elements\conditions\ElementConditionRuleInterface $rule */
                $rule->modifyQuery($ruleQuery);
            } catch (\yii\base\InvalidConfigException) {
                continue; // The rule is misconfigured.
            }
            foreach ($ruleQuery->ids() as $id) {
                $ids[(int)$id] = true;
            }
        }
        $query->id($ids === [] ? [0] : array_keys($ids));
    }

    /** Whether an element matches all rules, or any rule when $matchAny is set. */
    public function conditionMatches(ElementCondition $condition, ElementInterface $element, bool $matchAny): bool
    {
        $rules = $condition->getConditionRules();
        if (!$matchAny || count($rules) < 2) {
            return $condition->matchElement($element);
        }
        foreach ($rules as $rule) {
            /** @var \craft\elements\conditions\ElementConditionRuleInterface $rule */
            if ($rule->matchElement($element)) {
                return true;
            }
        }
        return false;
    }

    /** The condition rules plus the "any" and "only live" switches, stored together. */
    private function conditionJson(Automation $automation): ?string
    {
        $config = ($automation->condition ?? []) + array_filter(['matchAny' => $automation->matchAny, 'onlyLive' => $automation->onlyLive]);
        return $config === [] ? null : Json::encode($config);
    }

    /** Builds a condition config from the condition builder's posted values. */
    public function conditionFromPost(mixed $posted, Workflow $workflow): ?array
    {
        if (!is_array($posted)) {
            return null;
        }
        unset($posted['new-rule-type']);
        return $this->sanitizeCondition($posted, $workflow);
    }

    private function sanitizeCondition(array $config, Workflow $workflow): ?array
    {
        if (($config['class'] ?? null) !== get_class($this->elementType($workflow)::createCondition())) {
            throw new RuntimeException('The content conditions are invalid.');
        }
        if (isset($config['config']) && is_string($config['config'])) {
            $base = Json::decodeIfJson($config['config']);
            $config['fieldContext'] = is_array($base) ? ($base['fieldContext'] ?? null) : null;
        }
        $saved = $this->buildCondition($config, $workflow)->getConfig();
        return $saved['conditionRules'] === [] ? null : $saved;
    }

    // Health

    /**
     * Checks everything an automation needs before it fires, and pauses it with a reason when something is wrong.
     * @return array{0:Workflow,1:User}|null
     */
    public function health(Automation $automation, bool $pause = true): ?array
    {
        $reason = $this->problem($automation);
        if ($reason === null) {
            $workflow = AutofillPlugin::getInstance()->getWorkflowService()->getById((int)$automation->workflowId);
            $actor = Craft::$app->getUsers()->getUserById((int)$automation->runAsId);
            return [$workflow, $actor];
        }
        if ($pause) {
            $this->pause($automation, $reason);
        }
        return null;
    }

    /** Why the automation can't run right now, or null. Stored untranslated and translated when shown. */
    public function problem(Automation $automation): ?string
    {
        $plugin = AutofillPlugin::getInstance();
        $access = $plugin->getWorkflowAccess();
        $workflow = $automation->workflowId ? $plugin->getWorkflowService()->getById($automation->workflowId) : null;
        $actor = $automation->runAsId ? Craft::$app->getUsers()->getUserById($automation->runAsId) : null;
        return match (true) {
            !$plugin->isProEdition() => 'Automations require Autofill Pro.',
            $workflow === null => 'Its workflow was deleted.',
            $workflow->archived => 'Its workflow was archived.',
            $actor === null || $actor->getStatus() !== User::STATUS_ACTIVE => 'The user it runs as is inactive.',
            !$this->canManage($automation, $actor),
            !$access->canView($workflow, $actor), !$access->can($actor, 'run'), !$access->can($actor, 'bulk') => 'The user it runs as lost access.',
            $this->automaticHash($workflow) !== null && $this->automaticHash($workflow) !== $automation->acknowledgedAutomaticHash => 'Its workflow now applies some fields without review.',
            $this->needsWorkflowReconfirm($automation, $workflow) => 'Its workflow changed since it was saved.',
            $automation->privateOwnerId !== null && $workflow->visibility === 'private'
                && Craft::$app->getUsers()->getUserById($automation->privateOwnerId)?->getStatus() !== User::STATUS_ACTIVE => 'Its reviewer is no longer active.',
            $automation->maxRuns !== null && $automation->runCount >= $automation->maxRuns => 'It reached its run limit.',
            array_intersect($automation->siteIds, Craft::$app->getSites()->getAllSiteIds()) === [] => 'Its sites were deleted.',
            default => null,
        };
    }

    /** @return string[] Names of the workflow's fields that apply without review. */
    public function automaticFieldNames(Workflow $workflow): array
    {
        $names = array_column($this->watchableFields($workflow), 'name', 'uid');
        $result = [];
        foreach ($workflow->rows as $row) {
            if (($row['enabled'] ?? true) && ($row['requiresApproval'] ?? true) === false) {
                $result[] = $names[(string)($row['targetFieldUid'] ?? '')] ?? Craft::t('autofill', 'Unavailable field');
            }
        }
        return $result;
    }

    public function pause(Automation $automation, string $reason): void
    {
        if ($automation->id === null) {
            return;
        }
        AutomationRecord::updateAll(['pausedReason' => $reason], ['id' => $automation->id]);
        $automation->pausedReason = $reason;
        $this->contentAutomations = null;
        Craft::warning(sprintf('Autofill automation %d paused: %s', $automation->id, $reason), __METHOD__);
    }

    // Scheduling

    public function nextRunAt(Automation $automation, ?\DateTimeInterface $after = null): ?\DateTime
    {
        if (!$automation->hasSchedule()) {
            return null;
        }
        $next = Schedule::next($automation->schedule, $after ?? new DateTimeImmutable());
        return $next ? \DateTime::createFromImmutable($next) : null;
    }

    /**
     * Claims automations whose scheduled time has passed and queues them. Each one is claimed by moving its
     * next run time forward, so overlapping ticks (cron plus the fallback) can't queue it twice.
     */
    public function tick(?\DateTimeInterface $now = null): int
    {
        if (!$this->tableExists() || !AutofillPlugin::getInstance()->isProEdition()) {
            return 0;
        }
        $now = DateTimeImmutable::createFromInterface($now ?? new DateTimeImmutable());
        $queued = 0;
        $db = Craft::$app->getDb();
        $table = AutomationRecord::tableName();
        $due = AutomationRecord::find()
            ->where(['enabled' => true, 'pausedReason' => null])
            ->andWhere(['not', ['nextRunAt' => null]])
            ->andWhere(['<=', 'nextRunAt', Db::prepareDateForDb($now)])
            ->all();
        foreach ($due as $record) {
            /** @var AutomationRecord $record */
            $automation = $this->modelFromRecord($record);
            $next = Db::prepareDateForDb($this->nextRunAt($automation, $now));
            $configuration = ['id' => $record->id, 'enabled' => true, 'pausedReason' => null, 'triggersJson' => $record->triggersJson];
            $claimed = $db->createCommand()->update(
                $table,
                ['nextRunAt' => $next],
                $configuration + ['nextRunAt' => $record->nextRunAt],
                updateTimestamp: false,
            )->execute();
            if ($claimed !== 1) {
                continue;
            }
            try {
                $jobId = Craft::$app->getQueue()->push(new RunAutomationJob(['automationId' => (int)$record->id, 'trigger' => 'schedule']));
                if ($jobId === null) {
                    throw new RuntimeException('The queue did not accept the job.');
                }
                $queued++;
            } catch (Throwable $error) {
                $db->createCommand()->update(
                    $table,
                    ['nextRunAt' => $record->nextRunAt],
                    $configuration + ['nextRunAt' => $next],
                    updateTimestamp: false,
                )->execute();
                Craft::warning(sprintf('Autofill automation %d could not queue its scheduled run: %s', $record->id, $error->getMessage()), __METHOD__);
            }
        }
        return $queued + $this->queueStatusTransitions($now);
    }

    /** Finds publication and expiry transitions that happen without an element save. */
    private function queueStatusTransitions(DateTimeImmutable $now): int
    {
        if (Craft::$app->getConfig()->getGeneral()->staticStatuses) {
            return 0;
        }
        $through = Db::prepareDateForDb($now);
        $due = ['and', ['enabled' => true, 'pausedReason' => null], ['<', 'statusCheckedAt', $through]];
        $ids = AutomationRecord::find()->select('id')->where($due)->column();
        $mutex = Craft::$app->getMutex();
        $queued = 0;
        foreach ($ids as $id) {
            $lock = 'autofill:automation:' . $id;
            if (!$mutex->acquire($lock, 0)) {
                continue;
            }
            try {
                $record = AutomationRecord::find()->where($due)->andWhere(['id' => $id])->one();
                if ($record instanceof AutomationRecord) {
                    $queued += $this->queueStatusTransitionsFor($record, $through);
                }
            } catch (Throwable $error) {
                Craft::warning(sprintf('Autofill automation %d could not queue timed status changes: %s', $id, $error->getMessage()), __METHOD__);
            } finally {
                $mutex->release($lock);
            }
        }
        return $queued;
    }

    private function queueStatusTransitionsFor(AutomationRecord $record, string $through): int
    {
        $automation = $this->modelFromRecord($record);
        $health = $this->health($automation);
        if ($health === null || $this->statusEvents($automation) === []) {
            return 0;
        }
        [$workflow] = $health;
        if ($workflow->scope !== 'entry') {
            return 0;
        }
        $window = ['and',
            ['>', 'entries.postDate', $record->statusCheckedAt],
            ['<=', 'entries.postDate', $through],
            ['<=', 'elements.dateCreated', new Expression('[[entries.postDate]]')],
            ['or', ['entries.expiryDate' => null], ['>', 'entries.expiryDate', $through]],
        ];
        if (!$automation->onlyLive && in_array('statusChanged', $automation->events['types'], true)) {
            $window = ['or', $window, ['and',
                ['>', 'entries.expiryDate', $record->statusCheckedAt],
                ['<=', 'entries.expiryDate', $through],
                ['<', 'entries.postDate', new Expression('[[entries.expiryDate]]')],
                ['<=', 'elements.dateCreated', new Expression('[[entries.expiryDate]]')],
            ]];
        }
        $seconds = max(self::MIN_EVENT_DELAY_SECONDS, $automation->events['delay'] * 60);
        $queued = 0;
        foreach ($automation->siteIds as $siteId) {
            if (!Craft::$app->getSites()->getSiteById($siteId)) {
                continue;
            }
            $query = $this->elementQuery($workflow, $siteId);
            if (!$query instanceof EntryQuery) {
                continue;
            }
            $query->andWhere(['elements.enabled' => true, 'elements_sites.enabled' => true])->andWhere($window);
            foreach ($query->each(50) as $entry) {
                $this->scheduleEvent($automation, $entry, $seconds);
                $queued++;
            }
        }
        // Move the cursor only after the queue accepted all matching events.
        Craft::$app->getDb()->createCommand()->update(
            AutomationRecord::tableName(),
            ['statusCheckedAt' => $through],
            ['id' => $record->id, 'statusCheckedAt' => $record->statusCheckedAt, 'enabled' => true, 'pausedReason' => null, 'triggersJson' => $record->triggersJson],
            updateTimestamp: false,
        )->execute();
        return $queued;
    }

    private function statusEvents(Automation $automation): array
    {
        return $automation->events['enabled'] ? array_intersect($automation->events['types'], ['live', 'statusChanged']) : [];
    }

    public function recordCronTick(): void
    {
        Craft::$app->getCache()->set(self::CRON_TICK_CACHE_KEY, time(), 86400);
    }

    /** Runs a tick from a web request when cron hasn't run recently. Cheap, and limited to once a minute. */
    public function fallbackTick(): void
    {
        try {
            if (!AutofillPlugin::getInstance()->isProEdition() || !$this->tableExists()) {
                return;
            }
            $cache = Craft::$app->getCache();
            $lastCron = (int)$cache->get(self::CRON_TICK_CACHE_KEY);
            if ($lastCron > time() - self::CRON_FRESH_SECONDS) {
                return;
            }
            if (!$cache->add(self::FALLBACK_LOCK_CACHE_KEY, time(), 60)) {
                return;
            }
            $this->tick();
        } catch (Throwable $error) {
            Craft::warning('Autofill automations could not check for scheduled work: ' . $error->getMessage(), __METHOD__);
        }
    }

    /** Whether scheduled automations rely on site traffic because cron isn't set up. */
    public function isUsingFallbackScheduler(): bool
    {
        $lastCron = (int)Craft::$app->getCache()->get(self::CRON_TICK_CACHE_KEY);
        return $lastCron <= time() - self::CRON_FRESH_SECONDS * 2;
    }

    // Firing

    /**
     * Starts runs for every matching item (scheduled or "Run now").
     * @return array{started:int,skipped:int,failed:int}|null Null when the automation couldn't run.
     */
    public function run(int $id, string $trigger, bool $retryIfBusy = false): ?array
    {
        $lock = 'autofill:automation:' . $id;
        $mutex = Craft::$app->getMutex();
        if (!$mutex->acquire($lock, $retryIfBusy ? 5 : 0)) {
            if ($retryIfBusy) {
                throw new RuntimeException('This automation is processing another trigger.');
            }
            return null;
        }
        try {
            $automation = $this->getById($id);
            if ($automation === null || ($trigger === 'schedule' && (!$automation->isActive() || !$automation->hasSchedule()))) {
                return null;
            }
            $health = $this->health($automation);
            if ($health === null) {
                return null;
            }
            [$workflow, $actor] = $health;
            if ($trigger === 'schedule' && $automation->minMinutesBetweenRuns !== null && $automation->lastRunAt !== null
                && $automation->lastRunAt->getTimestamp() + $automation->minMinutesBetweenRuns * 60 > time()) {
                return null;
            }
            $summary = $this->withIdentity($actor, function() use ($automation, $workflow, $actor): array {
                $summary = ['started' => 0, 'skipped' => 0, 'failed' => 0];
                $batchUid = StringHelper::UUID();
                $condition = $this->condition($automation, $workflow);
                foreach ($automation->siteIds as $siteId) {
                    if (!Craft::$app->getSites()->getSiteById($siteId)) {
                        continue;
                    }
                    $query = $this->elementQuery($workflow, $siteId);
                    if ($query === null) {
                        continue;
                    }
                    if ($automation->onlyLive && $query instanceof EntryQuery) {
                        $query->status(Entry::STATUS_LIVE);
                    }
                    $this->applyCondition($condition, $query, $automation->matchAny);
                    // Re-apply the scope in case a rule's query params slipped past the condition's filters.
                    $this->scopeQuery($query, $workflow, $siteId);
                    foreach ($query->each(50) as $element) {
                        if ($automation->maxItemsPerRun !== null && $summary['started'] >= $automation->maxItemsPerRun) {
                            break 2;
                        }
                        $result = $this->startFor($automation, $workflow, $actor, $element, $batchUid, null, false);
                        $summary[in_array($result, ['blocked', 'waiting'], true) ? 'skipped' : $result]++;
                    }
                }
                return $summary + ['batchUid' => $batchUid];
            });
            $this->recordFiring($automation, $trigger, $summary);
            return array_intersect_key($summary, array_flip(['started', 'skipped', 'failed']));
        } finally {
            $mutex->release($lock);
        }
    }

    /** Queues "Run now". */
    public function queueRun(int $id, User $actor): void
    {
        $automation = $this->getById($id);
        if ($automation === null || !$this->canManage($automation, $actor)) {
            throw new RuntimeException('You do not have permission to run this automation.');
        }
        if ($automation->isPaused()) {
            throw new RuntimeException(Craft::t('autofill', 'Paused. {reason}', ['reason' => Craft::t('autofill', (string)$automation->pausedReason)]));
        }
        if (($problem = $this->problem($automation)) !== null) {
            throw new RuntimeException(Craft::t('autofill', $problem));
        }
        // Run now uses the run-as user's permissions, so whoever clicks it must be allowed to run it themselves.
        if (!$actor->admin && (int)$actor->id !== $automation->runAsId) {
            $workflow = AutofillPlugin::getInstance()->getWorkflowService()->getById((int)$automation->workflowId);
            if ($workflow === null) {
                throw new RuntimeException(Craft::t('autofill', 'Its workflow was deleted.'));
            }
            $this->assertCanOperate($workflow, $automation->siteIds, $actor);
        }
        Craft::$app->getQueue()->push(new RunAutomationJob(['automationId' => $id, 'trigger' => 'manual']));
    }

    /** Fires a debounced content change. */
    public function processEvent(int $automationId, int $elementId, int $siteId, ?string $triggerHash = null): ?string
    {
        $lock = 'autofill:automation:' . $automationId;
        $mutex = Craft::$app->getMutex();
        if (!$mutex->acquire($lock, 0)) {
            $this->enqueueEventJob($automationId, $elementId, $siteId, self::EVENT_RETRY_DELAY_SECONDS, $triggerHash);
            return null;
        }
        try {
            return $this->processPendingEvent($automationId, $elementId, $siteId, $triggerHash);
        } finally {
            $mutex->release($lock);
        }
    }

    private function processPendingEvent(int $automationId, int $elementId, int $siteId, ?string $triggerHash): ?string
    {
        $automation = $this->getById($automationId);
        if ($automation === null || !$automation->isActive() || !$automation->hasContentTriggers() || !in_array($siteId, $automation->siteIds, true)) {
            return null;
        }
        $currentTriggerHash = $this->contentTriggerHash($automation);
        if ($triggerHash !== null && $triggerHash !== $currentTriggerHash) {
            return null;
        }
        $state = AutomationStateRecord::findOne(['automationId' => $automationId, 'elementId' => $elementId, 'siteId' => $siteId]);
        $pendingAt = $state?->pendingAt ? DateTimeHelper::toDateTime($state->pendingAt) : null;
        if (!$pendingAt || $pendingAt->getTimestamp() > time() + self::PENDING_TOLERANCE_SECONDS) {
            return null;
        }
        $pending = ['id' => $state->id, 'pendingAt' => $state->pendingAt];
        $health = $this->health($automation);
        if ($health === null) {
            AutomationStateRecord::updateAll(['pendingAt' => null], $pending);
            return null;
        }
        [$workflow, $actor] = $health;
        $element = Craft::$app->getElements()->getElementById($elementId, $this->elementType($workflow), $siteId);
        if (!$element instanceof ElementInterface || !$this->matchesScope($workflow, $element)) {
            AutomationStateRecord::updateAll(['pendingAt' => null], $pending);
            return null;
        }
        $batchUid = StringHelper::UUID();
        $result = $this->withIdentity($actor, fn(): string => $this->startFor($automation, $workflow, $actor, $element, $batchUid, $this->condition($automation, $workflow), true));
        if ($result === 'waiting') {
            // Keep the change pending without polling; resumeAfterRun() picks it up once that result is reviewed.
            AutomationStateRecord::updateAll(['pendingAt' => Db::prepareDateForDb(new DateTimeImmutable())], $pending);
            return null;
        }
        if ($result === 'blocked') {
            $delay = self::EVENT_RETRY_DELAY_SECONDS;
            $this->enqueueEventJob($automationId, $elementId, $siteId, $delay, $currentTriggerHash);
            AutomationStateRecord::updateAll(['pendingAt' => Db::prepareDateForDb((new DateTimeImmutable())->setTimestamp(time() + $delay))], $pending);
            return null;
        }
        // A save during processing may have scheduled a newer event.
        AutomationStateRecord::updateAll(['pendingAt' => null], $pending);
        $this->recordFiring($automation, 'event', ['started' => 0, 'skipped' => 0, 'failed' => 0, $result => 1, 'batchUid' => $batchUid]);
        return $result;
    }

    /** Queues content changes that waited on this item's earlier run, now that the run is reviewed or finished. */
    public function resumeAfterRun(WorkflowRunRecord $run): void
    {
        if (in_array($run->status, ['queued', 'running', 'ready'], true) || !$this->tableExists()) {
            return;
        }
        $waiting = AutomationStateRecord::find()
            ->where(['elementId' => $run->elementId, 'siteId' => $run->siteId])
            ->andWhere(['not', ['pendingAt' => null]])
            ->andWhere(['<=', 'pendingAt', Db::prepareDateForDb((new DateTimeImmutable())->setTimestamp(time() + self::PENDING_TOLERANCE_SECONDS))])
            ->all();
        foreach ($waiting as $state) {
            /** @var AutomationStateRecord $state */
            try {
                $this->enqueueEventJob((int)$state->automationId, (int)$state->elementId, (int)$state->siteId, self::MIN_EVENT_DELAY_SECONDS, null);
            } catch (Throwable $error) {
                Craft::warning(sprintf('Autofill automation %d could not resume a waiting change: %s', $state->automationId, $error->getMessage()), __METHOD__);
            }
        }
    }

    /**
     * Starts one item unless it's unchanged since this automation last ran on it.
     * @return 'started'|'skipped'|'failed'|'blocked'|'waiting'
     */
    public function startFor(Automation $automation, Workflow $workflow, User $actor, ElementInterface $element, string $batchUid, ?ElementCondition $condition, bool $respectGap): string
    {
        $runs = AutofillPlugin::getInstance()->getWorkflowRunService();
        $state = null;
        $fingerprint = null;
        try {
            if ($automation->onlyLive && $element instanceof Entry && $element->getStatus() !== Entry::STATUS_LIVE) {
                return 'skipped';
            }
            if ($condition !== null && !$this->conditionMatches($condition, $element, $automation->matchAny)) {
                return 'skipped';
            }
            $state = $this->state($automation, $element);
            $fingerprint = $runs->contextFingerprint($workflow, $element);
            if ($state->contextFingerprint === $fingerprint && $this->outcomeStands($state)) {
                return 'skipped';
            }
            if ($respectGap && $automation->minMinutesBetweenRuns !== null && $state->lastRunAt !== null
                && DateTimeHelper::toDateTime($state->lastRunAt)->getTimestamp() + $automation->minMinutesBetweenRuns * 60 > time()) {
                return 'skipped';
            }
            $run = $runs->start($workflow, $element, $actor, $automation->userPrompt, $batchUid, $automation->privateOwnerId, automationId: $automation->id);
            if ($run->batchUid !== $batchUid) {
                // An earlier run for this item is still active, or its result is waiting for review.
                return $run->status === 'ready' ? 'waiting' : 'blocked';
            }
            $state->contextFingerprint = $fingerprint;
            $state->lastRunId = (int)$run->id;
            $state->lastRunAt = Db::prepareDateForDb(new DateTimeImmutable());
            $state->failedAt = null;
            $state->save(false);
            return 'started';
        } catch (Throwable $error) {
            try {
                $runs->recordFailedStart($workflow, $element, $actor, $batchUid, ErrorMessage::forUser($error), $automation->id, $automation->privateOwnerId);
                if ($state !== null && $fingerprint !== null) {
                    // Remember the failure so the item waits for a change (or the retry period) instead of failing every firing.
                    $state->contextFingerprint = $fingerprint;
                    $state->lastRunId = null;
                    $state->failedAt = Db::prepareDateForDb(new DateTimeImmutable());
                    $state->save(false);
                }
            } catch (Throwable $recordError) {
                Craft::error('Autofill automation could not record a failed item: ' . $recordError->getMessage(), __METHOD__);
            }
            return 'failed';
        }
    }

    /** Whether the item's last outcome stands while its context is unchanged. Failures are retried after a waiting period. */
    private function outcomeStands(AutomationStateRecord $state): bool
    {
        $retryCutoff = time() - self::RETRY_FAILED_AFTER_SECONDS;
        if ($state->failedAt !== null) {
            return DateTimeHelper::toDateTime($state->failedAt)->getTimestamp() > $retryCutoff;
        }
        if ($state->lastRunId === null) {
            return false;
        }
        $run = WorkflowRunRecord::find()->select(['status', 'dateUpdated'])->where(['id' => $state->lastRunId])->asArray()->one();
        if ($run === null) {
            return false;
        }
        return $run['status'] !== 'failed' || DateTimeHelper::toDateTime($run['dateUpdated'])->getTimestamp() > $retryCutoff;
    }

    private function recordFiring(Automation $automation, string $trigger, array $summary): void
    {
        $didWork = (int)($summary['started'] ?? 0) + (int)($summary['failed'] ?? 0) > 0;
        if (!$didWork && $trigger === 'event') {
            return;
        }
        AutomationRecord::updateAll([
            'lastRunAt' => Db::prepareDateForDb(new DateTimeImmutable()),
            'lastRunSummaryJson' => Json::encode(['trigger' => $trigger] + array_intersect_key($summary, array_flip(['started', 'skipped', 'failed']))),
        ] + ($didWork ? ['lastBatchUid' => $summary['batchUid'] ?? null] : []), ['id' => $automation->id]);
        if (!$didWork) {
            return;
        }
        // The firing lock covers the limit check, result, and counter update.
        AutomationRecord::updateAllCounters(['runCount' => 1], ['id' => $automation->id]);
        $automation->runCount = (int)AutomationRecord::find()->select('runCount')->where(['id' => $automation->id])->scalar();
        if ($automation->maxRuns !== null && $automation->runCount >= $automation->maxRuns) {
            $this->pause($automation, 'It reached its run limit.');
        }
    }

    private function state(Automation $automation, ElementInterface $element): AutomationStateRecord
    {
        $state = AutomationStateRecord::findOne(['automationId' => $automation->id, 'elementId' => $element->id, 'siteId' => $element->siteId]);
        if ($state) {
            return $state;
        }
        $state = new AutomationStateRecord();
        $state->automationId = (int)$automation->id;
        $state->elementId = (int)$element->id;
        $state->siteId = (int)$element->siteId;
        return $state;
    }

    public function elementQuery(Workflow $workflow, int $siteId): ?ElementQueryInterface
    {
        $query = $workflow->scope === 'asset' ? Asset::find() : Entry::find();
        $query->status(null)->orderBy(['elements.id' => SORT_ASC]);
        return $this->scopeQuery($query, $workflow, $siteId) ? $query : null;
    }

    /** Limits a query to the workflow's entry type or volume and one site. Returns false when the scope no longer exists. */
    private function scopeQuery(ElementQueryInterface $query, Workflow $workflow, int $siteId): bool
    {
        if ($workflow->scope === 'asset') {
            $volume = Craft::$app->getVolumes()->getVolumeByUid($workflow->volumeUid);
            if ($volume === null || !$query instanceof \craft\elements\db\AssetQuery) {
                return false;
            }
            $query->volumeId($volume->id);
        } else {
            $type = Craft::$app->getEntries()->getEntryTypeByUid($workflow->entryTypeUid);
            if ($type === null || !$query instanceof \craft\elements\db\EntryQuery) {
                return false;
            }
            $query->sectionId(null)->typeId($type->id);
        }
        $query->siteId($siteId);
        return true;
    }

    // Content events

    public function beforeElementSave(ElementEvent $event): void
    {
        $element = $event->element;
        if (!$element instanceof Entry || $event->isNew || !$element->id || $this->skipsEvent($element)) {
            return;
        }
        foreach ($this->automationsFor($element) as [$automation]) {
            if ($this->statusEvents($automation) === []) {
                continue;
            }
            $previous = Entry::find()->id($element->id)->siteId($element->siteId)->status(null)->one();
            if ($previous) {
                $this->previousStatus[$element->id . ':' . $element->siteId] = (string)$previous->getStatus();
            }
            return;
        }
    }

    public function afterElementSave(ElementEvent $event): void
    {
        $element = $event->element;
        if ((!$element instanceof Entry && !$element instanceof Asset) || $this->skipsEvent($element)) {
            return;
        }
        $key = $element->id . ':' . $element->siteId;
        $previousStatus = $this->previousStatus[$key] ?? null;
        unset($this->previousStatus[$key]);
        foreach ($this->automationsFor($element) as [$automation]) {
            try {
                $this->queueContentEvent($automation, $element, $previousStatus);
            } catch (Throwable $error) {
                Craft::error(sprintf('Autofill automation %d could not react to a change: %s', $automation->id, $error->getMessage()), __METHOD__);
            }
        }
    }

    /** Which content-change triggers fired for this save. */
    public function firedEvents(Automation $automation, ElementInterface $element, ?string $previousStatus): array
    {
        $fired = [];
        $status = (string)$element->getStatus();
        foreach ($automation->events['enabled'] ? $automation->events['types'] : [] as $type) {
            $match = match ($type) {
                'created' => $element->firstSave,
                'saved' => true,
                'live' => $status === Entry::STATUS_LIVE && ($element->firstSave || ($previousStatus !== null && $previousStatus !== Entry::STATUS_LIVE)),
                'statusChanged' => $previousStatus !== null && $previousStatus !== $status,
                'replaced' => $element instanceof Asset && $element->getScenario() === Asset::SCENARIO_REPLACE,
                default => false,
            };
            if ($match) {
                $fired[] = $type;
            }
        }
        return $fired;
    }

    private function queueContentEvent(Automation $automation, ElementInterface $element, ?string $previousStatus): void
    {
        $delays = [];
        if ($this->firedEvents($automation, $element, $previousStatus) !== []) {
            $delays[] = $automation->events['delay'];
        }
        $state = null;
        if ($automation->fields['enabled']) {
            $state = $this->state($automation, $element);
            $fingerprint = AutofillPlugin::getInstance()->getWorkflowRunService()->fieldsFingerprint($element, $automation->fields['uids']);
            $changed = $state->watchFingerprint !== null
                ? $state->watchFingerprint !== $fingerprint
                : $element->firstSave || $this->hasDirtyField($element, $automation->fields['uids']);
            $state->watchFingerprint = $fingerprint;
            if ($changed) {
                $delays[] = $automation->fields['delay'];
            }
        }
        if ($delays === []) {
            $state?->save(false);
            return;
        }
        $seconds = max(self::MIN_EVENT_DELAY_SECONDS, max($delays) * 60);
        $this->scheduleEvent($automation, $element, $seconds, $state);
    }

    private function scheduleEvent(Automation $automation, ElementInterface $element, int $seconds, ?AutomationStateRecord $state = null): void
    {
        $state ??= $this->state($automation, $element);
        $state->pendingAt = Db::prepareDateForDb((new DateTimeImmutable())->setTimestamp(time() + $seconds));
        $state->save(false);
        $this->enqueueEventJob((int)$automation->id, (int)$element->id, (int)$element->siteId, $seconds, $this->contentTriggerHash($automation));
    }

    private function contentTriggerHash(Automation $automation): string
    {
        // Who it runs as isn't part of this: a different person saving it shouldn't drop changes already waiting.
        return hash('sha256', Json::encode([$automation->workflowId, $automation->siteIds, $automation->events, $automation->fields]));
    }

    private function enqueueEventJob(int $automationId, int $elementId, int $siteId, int $seconds, ?string $triggerHash): void
    {
        $jobId = Craft::$app->getQueue()->delay($seconds)->push(new AutomationEventJob([
            'automationId' => $automationId, 'elementId' => $elementId, 'siteId' => $siteId, 'triggerHash' => $triggerHash,
        ]));
        if ($jobId === null) {
            throw new RuntimeException('The queue did not accept the content event.');
        }
    }

    private function hasDirtyField(ElementInterface $element, array $uids): bool
    {
        foreach ($uids as $uid) {
            if ($uid === '__asset__:file') {
                if ($element instanceof Asset && $element->getScenario() === Asset::SCENARIO_REPLACE) {
                    return true;
                }
                continue;
            }
            if (str_starts_with($uid, '__native__:')) {
                if ($element->isAttributeDirty(substr($uid, 11))) {
                    return true;
                }
                continue;
            }
            foreach ($element->getFieldLayout()?->getCustomFields() ?? [] as $field) {
                if ((string)($field->layoutElement->uid ?? $field->uid) === $uid && $element->isFieldDirty($field->handle)) {
                    return true;
                }
            }
        }
        return false;
    }

    /** Drafts, revisions, propagation, bulk resaves, and Autofill's own saves never trigger automations. */
    private function skipsEvent(ElementInterface $element): bool
    {
        return WorkflowRuntimeService::$applying > 0 || $element->propagating || $element->resaving
            || ElementHelper::isDraftOrRevision($element) || !$element->id || !$element->getIsCanonical();
    }

    /** @return array<int, array{0:Automation,1:Workflow}> Active content-triggered automations for this element's scope and site. */
    private function automationsFor(ElementInterface $element): array
    {
        if (!AutofillPlugin::getInstance()->isProEdition()) {
            return [];
        }
        $result = [];
        $workflows = AutofillPlugin::getInstance()->getWorkflowService();
        foreach ($this->contentAutomations() as $automation) {
            if (!in_array((int)$element->siteId, $automation->siteIds, true)) {
                continue;
            }
            $workflow = $workflows->getById((int)$automation->workflowId);
            if ($workflow === null || $workflow->archived) {
                continue;
            }
            if ($this->matchesScope($workflow, $element)) {
                $result[] = [$automation, $workflow];
            }
        }
        return $result;
    }

    private function matchesScope(Workflow $workflow, ElementInterface $element): bool
    {
        return $element instanceof Asset
            ? $workflow->scope === 'asset' && $element->getVolume()->uid === $workflow->volumeUid
            : $workflow->scope === 'entry' && $element instanceof Entry && $element->getType()->uid === $workflow->entryTypeUid;
    }

    /** @return Automation[] */
    private function contentAutomations(): array
    {
        if ($this->contentAutomations !== null) {
            return $this->contentAutomations;
        }
        $this->contentAutomations = [];
        if (!$this->tableExists()) {
            return [];
        }
        foreach (AutomationRecord::find()->where(['enabled' => true, 'pausedReason' => null])->all() as $record) {
            $automation = $this->modelFromRecord($record);
            if ($automation->hasContentTriggers()) {
                $this->contentAutomations[] = $automation;
            }
        }
        return $this->contentAutomations;
    }

    // Descriptions

    /** @return array<string, string> Plain-language trigger summaries keyed by `schedule` and `changes`. */
    public function describeTriggers(Automation $automation, ?Workflow $workflow): array
    {
        $lines = [];
        if ($automation->hasSchedule()) {
            $lines['schedule'] = Schedule::describe($automation->schedule);
        }
        $isAsset = $workflow?->scope === 'asset';
        $phrases = [];
        if ($automation->events['enabled']) {
            $verbs = [
                'created' => $isAsset ? Craft::t('autofill', 'is uploaded') : Craft::t('autofill', 'is created'),
                'saved' => Craft::t('autofill', 'is saved'),
                'live' => Craft::t('autofill', 'goes live'),
                'statusChanged' => Craft::t('autofill', 'changes status'),
                'replaced' => Craft::t('autofill', 'has its file replaced'),
            ];
            foreach ($automation->events['types'] as $type) {
                $phrases[] = $verbs[$type] ?? $type;
            }
        }
        if ($automation->fields['enabled'] && $automation->fields['uids'] !== []) {
            $known = $workflow ? array_column($this->watchableFields($workflow), 'name', 'uid') : [];
            $names = array_map(static fn(string $uid): string => $known[$uid] ?? Craft::t('autofill', 'Unavailable field'), $automation->fields['uids']);
            $phrases[] = count($names) > 2
                ? Craft::t('autofill', 'has a change to {fields} +{n} more', ['fields' => implode(', ', array_slice($names, 0, 2)), 'n' => count($names) - 2])
                : Craft::t('autofill', 'has a change to {fields}', ['fields' => implode(Craft::t('autofill', ' or '), $names)]);
        }
        if ($phrases !== []) {
            $delay = max($automation->events['enabled'] ? $automation->events['delay'] : 0, $automation->fields['enabled'] ? $automation->fields['delay'] : 0);
            $line = $isAsset
                ? Craft::t('autofill', 'When an asset {phrases}', ['phrases' => implode(Craft::t('autofill', ' or '), $phrases)])
                : Craft::t('autofill', 'When an entry {phrases}', ['phrases' => implode(Craft::t('autofill', ' or '), $phrases)]);
            $lines['changes'] = match (true) {
                $delay <= 0 => $line,
                $delay % 60 === 0 => Craft::t('autofill', '{line} (after {n, plural, =1{1 hour} other{# hours}})', ['line' => $line, 'n' => intdiv($delay, 60)]),
                default => Craft::t('autofill', '{line} (after {n} min)', ['line' => $line, 'n' => $delay]),
            };
        }
        return $lines;
    }

    // Helpers

    private function editableSiteIds(User $actor): array
    {
        $ids = [];
        $sites = Craft::$app->getSites();
        foreach ($sites->getAllSites() as $site) {
            if (count($sites->getAllSiteIds()) === 1 || $actor->can('editSite:' . $site->uid)) {
                $ids[] = (int)$site->id;
            }
        }
        return $ids;
    }

    private function withIdentity(User $actor, callable $operation): mixed
    {
        $session = Craft::$app->getUser();
        $previous = $session->getIdentity();
        $session->setIdentity($actor);
        try {
            return $operation();
        } finally {
            $session->setIdentity($previous);
        }
    }

    private function tableExists(): bool
    {
        return Craft::$app->getDb()->tableExists(AutomationRecord::tableName());
    }

    public function modelFromRecord(AutomationRecord $record): Automation
    {
        $triggers = Json::decodeIfJson((string)$record->triggersJson);
        $triggers = is_array($triggers) ? $triggers : [];
        $condition = $record->conditionJson ? Json::decodeIfJson($record->conditionJson) : null;
        $condition = is_array($condition) ? $condition : [];
        $matchAny = !empty($condition['matchAny']);
        $onlyLive = !empty($condition['onlyLive']);
        unset($condition['matchAny'], $condition['onlyLive']);
        $sites = Json::decodeIfJson((string)$record->siteIdsJson);
        $summary = $record->lastRunSummaryJson ? Json::decodeIfJson($record->lastRunSummaryJson) : null;
        return new Automation([
            'id' => (int)$record->id,
            'uid' => (string)$record->uid,
            'name' => (string)$record->name,
            'workflowId' => (int)$record->workflowId,
            'ownerId' => $record->ownerId !== null ? (int)$record->ownerId : null,
            'runAsId' => $record->runAsId !== null ? (int)$record->runAsId : null,
            'enabled' => (bool)$record->enabled,
            'pausedReason' => $record->pausedReason,
            'schedule' => (array)($triggers['schedule'] ?? []),
            'events' => (array)($triggers['events'] ?? []),
            'fields' => (array)($triggers['fields'] ?? []),
            'condition' => isset($condition['class']) ? $condition : null,
            'matchAny' => $matchAny,
            'onlyLive' => $onlyLive,
            'siteIds' => is_array($sites) ? $sites : [],
            'userPrompt' => (string)$record->userPrompt,
            'privateOwnerId' => $record->privateOwnerId !== null ? (int)$record->privateOwnerId : null,
            'maxRuns' => $record->maxRuns,
            'maxItemsPerRun' => $record->maxItemsPerRun,
            'minMinutesBetweenRuns' => $record->minMinutesBetweenRuns,
            'acknowledgedAutomaticHash' => $record->acknowledgedAutomaticHash,
            'acknowledgedWorkflowHash' => $record->acknowledgedWorkflowHash,
            'runCount' => (int)$record->runCount,
            'nextRunAt' => $record->nextRunAt ? DateTimeHelper::toDateTime($record->nextRunAt) ?: null : null,
            'lastRunAt' => $record->lastRunAt ? DateTimeHelper::toDateTime($record->lastRunAt) ?: null : null,
            'lastBatchUid' => $record->lastBatchUid,
            'lastRunSummary' => is_array($summary) ? $summary : null,
            'dateCreated' => $record->dateCreated ? DateTimeHelper::toDateTime($record->dateCreated) ?: null : null,
        ]);
    }
}
