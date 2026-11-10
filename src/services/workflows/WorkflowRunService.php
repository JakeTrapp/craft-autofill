<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\workflows;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\elements\Asset;
use craft\elements\db\ElementQueryInterface;
use craft\elements\Entry;
use craft\elements\User;
use craft\fields\Assets;
use craft\helpers\Json;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\jobs\RunWorkflowJob;
use jtdev\craftautofill\models\Workflow;
use jtdev\craftautofill\records\WorkflowRunRecord;
use jtdev\craftautofill\services\fields\adapters\SeomaticFieldAdapter;
use RuntimeException;
use Throwable;

/** One durable lifecycle for Lite single runs and Pro batches/inbox. */
class WorkflowRunService extends Component
{
    public function start(Workflow $workflow, ElementInterface $element, User $actor, string $prompt = '', ?string $batchUid = null, ?int $privateOwnerId = null): WorkflowRunRecord
    {
        $plugin = AutofillPlugin::getInstance();
        if (!$workflow->showUserPromptInput) $prompt = '';
        if ($workflow->visibility === 'private') {
            $privateOwnerId ??= $workflow->ownerId ?? (int)$actor->id;
            if (!$actor->admin && $privateOwnerId !== ($workflow->ownerId ?? (int)$actor->id)) throw new RuntimeException('The private review audience cannot be changed.');
        } else { $privateOwnerId = null; }
        $plugin->getWorkflowAccess()->assertCanRun($workflow, $element, $actor);
        $plugin->getWorkflowRuntimeService()->assertScope($workflow, $element);
        if ($batchUid !== null && (!$plugin->isProEdition() || !$plugin->getWorkflowAccess()->can($actor, 'bulk'))) {
            throw new RuntimeException('You do not have permission to run bulk Autofill.');
        }
        $lock = 'autofill:start:' . $workflow->id . ':' . $element->id . ':' . $element->siteId;
        if (!Craft::$app->getMutex()->acquire($lock, 5)) throw new RuntimeException('This content is starting another run. Try again.');
        try {
            // Return only runs visible to this actor. Private work never reveals another user's activity.
            $query = WorkflowRunRecord::find()->where([
                'workflowId' => $workflow->id, 'elementId' => $element->id, 'siteId' => $element->siteId,
                'status' => ['queued', 'running', 'ready'],
                'visibility' => $workflow->visibility,
                'privateOwnerId' => $privateOwnerId,
            ])->orderBy(['id' => SORT_DESC]);
            foreach ($query->all() as $existing) {
                if ($this->canView($existing, $actor)) return $existing;
            }
            $definition = $this->definitionForActor($workflow, $element, $actor);
            $run = new WorkflowRunRecord();
            $run->setAttributes([
                'workflowId' => $workflow->id, 'initiatorId' => $actor->id, 'visibility' => $workflow->visibility,
                'privateOwnerId' => $privateOwnerId,
                'elementId' => $element->id, 'elementType' => $element instanceof Asset ? 'asset' : 'entry',
                'siteId' => $element->siteId, 'batchUid' => $batchUid, 'status' => 'queued',
                'definitionJson' => Json::encode($definition->getAttributes()), 'userPrompt' => $prompt,
                'baselineJson' => Json::encode($this->baseline($definition, $element)),
            ], false);
            if (!$run->save()) throw new RuntimeException('The Autofill run could not be saved.');
            try {
                Craft::$app->getQueue()->push(new RunWorkflowJob(['runId' => (int)$run->id]));
            } catch (Throwable $error) {
                $run->status = 'failed';
                $run->errorMessage = 'The run could not be queued: ' . $error->getMessage();
                $this->saveRun($run);
                throw $error;
            }
            return $run;
        } finally {
            Craft::$app->getMutex()->release($lock);
        }
    }

    /** Lookup is based on the run, so archived/private definitions cannot strand public results. */
    public function current(int $workflowId, int $elementId, ?int $siteId, User $actor): ?WorkflowRunRecord
    {
        $query = WorkflowRunRecord::find()->where([
            'workflowId' => $workflowId, 'elementId' => $elementId, 'status' => ['queued', 'running', 'ready', 'failed'],
        ]);
        if ($siteId !== null) $query->andWhere(['siteId' => $siteId]);
        foreach ($query->orderBy(['id' => SORT_DESC])->each() as $run) {
            if ($this->canView($run, $actor)) return $run;
        }
        return null;
    }

    public function pendingForElement(int $elementId, int $siteId, User $actor): array
    {
        $result = [];
        foreach (WorkflowRunRecord::find()->where(['elementId' => $elementId, 'siteId' => $siteId, 'status' => ['queued', 'running', 'ready', 'failed']])->orderBy(['id' => SORT_DESC])->each() as $run) {
            if ($this->canView($run, $actor)) $result[] = $run;
        }
        return $result;
    }

    public function actionableCount(User $actor): int
    {
        return $this->notificationState($actor)['count'];
    }

    public function nextForReview(WorkflowRunRecord $run, User $actor): ?WorkflowRunRecord
    {
        $query = WorkflowRunRecord::find()->where(['status' => 'ready'])
            ->andWhere(['not', ['id' => $run->id]])->orderBy(['id' => SORT_ASC]);
        if ($run->batchUid) $query->orderBy([new \yii\db\Expression('CASE WHEN [[batchUid]] = :batch THEN 0 ELSE 1 END', [':batch' => $run->batchUid]), 'id' => SORT_ASC]);
        foreach ($query->each() as $candidate) {
            if ($this->isActionable($candidate, $actor)) return $candidate;
        }
        return null;
    }

    public function notificationState(User $actor): array
    {
        if (!Craft::$app->getDb()->tableExists(WorkflowRunRecord::tableName())) return ['count' => 0, 'latestId' => 0];
        $count = 0;
        $latestId = 0;
        $query = WorkflowRunRecord::find()->where(['status' => 'ready']);
        if (!$actor->admin) $query->andWhere(['or', ['initiatorId' => $actor->id], ['privateOwnerId' => $actor->id], ['visibility' => 'public']]);
        foreach ($query->each() as $run) {
            if ($this->isActionable($run, $actor)) { $count++; $latestId = max($latestId, (int)$run->id); }
        }
        return compact('count', 'latestId');
    }

    public function isActionable(WorkflowRunRecord $run, User $actor): bool
    {
        if ($run->status !== 'ready' || !$this->canView($run, $actor)) return false;
        $access = AutofillPlugin::getInstance()->getWorkflowAccess();
        $element = $this->element($run);
        if (!$this->canReview($run, $actor, $element)) return false;
        $workflow = new Workflow(Json::decode($run->definitionJson));
        foreach ($run->suggestionsJson ? Json::decode($run->suggestionsJson) : [] as $suggestion) {
            if (($suggestion['state'] ?? '') === 'pending' && $access->canUseField($workflow, (string)($suggestion['targetFieldUid'] ?? ''), $actor, $element, true)) return true;
        }
        return false;
    }

    /** Retain old outcomes; regeneration creates a separate, attributable run. */
    public function regenerate(int $id, User $actor): WorkflowRunRecord
    {
        $lock = 'autofill:process:' . $id;
        if (!Craft::$app->getMutex()->acquire($lock, 0)) throw new RuntimeException('This run is processing. Wait before regenerating.');
        $transaction = Craft::$app->getDb()->beginTransaction();
        try {
            $run = WorkflowRunRecord::findOne($id);
            if (!$run || !$this->canManage($run, $actor)) throw new RuntimeException('You cannot regenerate this run.');
            if (!in_array($run->status, ['ready', 'failed'], true)) throw new RuntimeException('Only pending or failed results can be regenerated.');
            $workflow = AutofillPlugin::getInstance()->getWorkflowService()->getById((int)$run->workflowId);
            if (!$workflow || $workflow->archived) throw new RuntimeException('This workflow is archived or unavailable.');
            AutofillPlugin::getInstance()->getWorkflowAccess()->assertCanRun($workflow, $this->element($run), $actor);
            $run->status = 'superseded';
            $this->saveRun($run);
            // Respect the old privacy boundary even if the definition was published subsequently.
            $workflow = clone $workflow;
            if ($run->visibility === 'private') $workflow->visibility = 'private';
            $privateOwnerId = $run->visibility === 'private' ? ($run->privateOwnerId ?? Json::decode($run->definitionJson)['ownerId'] ?? $run->initiatorId) : null;
            $replacement = $this->start($workflow, $this->element($run), $actor, (string)$run->userPrompt, null, $privateOwnerId !== null ? (int)$privateOwnerId : null);
            $transaction->commit();
            return $replacement;
        } catch (Throwable $error) {
            $transaction->rollBack();
            throw $error;
        } finally {
            Craft::$app->getMutex()->release($lock);
        }
    }

    public function cancel(int $id, User $actor): WorkflowRunRecord
    {
        $lock = 'autofill:process:' . $id;
        if (!Craft::$app->getMutex()->acquire($lock, 0)) throw new RuntimeException('This run is processing. Wait before cancelling.');
        try {
            $run = WorkflowRunRecord::findOne($id);
            if (!$run || !$this->canManage($run, $actor)) throw new RuntimeException('You cannot cancel this run.');
            if (!in_array($run->status, ['queued', 'running', 'ready', 'failed'], true)) throw new RuntimeException('This run has already finished.');
            $run->status = 'cancelled';
            $this->saveRun($run);
            return $run;
        } finally {
            Craft::$app->getMutex()->release($lock);
        }
    }

    private function canManage(WorkflowRunRecord $run, User $actor): bool
    {
        $access = AutofillPlugin::getInstance()->getWorkflowAccess();
        return $this->canView($run, $actor) && ($actor->admin ||
            (Craft::$app->getElements()->canSave($this->element($run), $actor) && (((int)$run->initiatorId === (int)$actor->id || $this->isPrivateOwner($run, $actor)) ? $access->can($actor, 'run') : ($access->can($actor, 'review') && $access->can($actor, 'reviewOthers')))));
    }

    public function process(int $id): void
    {
        $lock = 'autofill:process:' . $id;
        if (!Craft::$app->getMutex()->acquire($lock, 0)) return;
        try {
            $run = WorkflowRunRecord::findOne($id);
            if (!$run || !in_array($run->status, ['queued', 'running'], true)) return;
            $run->status = 'running';
            $this->saveRun($run);
            try {
                $plugin = AutofillPlugin::getInstance();
                $actor = Craft::$app->getUsers()->getUserById((int)$run->initiatorId);
                if (!$actor || $actor->getStatus() !== User::STATUS_ACTIVE) throw new RuntimeException('The initiating user is no longer active.');
                $workflow = new Workflow(Json::decode($run->definitionJson));
                $current = $plugin->getWorkflowService()->getById((int)$run->workflowId);
                if (!$current || $current->archived) throw new RuntimeException('This workflow is no longer available for generation.');
                $element = $this->element($run);
                $plugin->getWorkflowAccess()->assertCanRun($current, $element, $actor);
                $definition = $this->definitionForActor($workflow, $element, $actor);
                $runtime = $plugin->getWorkflowRuntimeService();
                // Persist generated results before any content changes, so retries never repeat model requests unnecessarily.
                $suggestions = $run->suggestionsJson ? Json::decode($run->suggestionsJson) : $runtime->generate(
                    $plugin->getWorkflowService()->asField($definition), $element, (string)$run->userPrompt, $actor,
                    beforeRepair: function(array $original) use ($run): void {
                        // An interrupted repair can resume with the original suggestions.
                        $run->suggestionsJson = Json::encode($original);
                        $this->saveRun($run);
                    },
                );
                foreach ($suggestions as &$suggestion) $suggestion['state'] ??= 'pending';
                unset($suggestion);
                $run->suggestionsJson = Json::encode($suggestions);
                $this->saveRun($run);
                $element = $this->element($run);
                if ($this->markUnchanged($suggestions, $workflow, $element, $actor)) {
                    $run->suggestionsJson = Json::encode($suggestions);
                    $this->saveRun($run);
                }
                foreach ($suggestions as $index => &$suggestion) {
                    if (($suggestion['state'] ?? '') !== 'pending' || ($suggestion['requiresApproval'] ?? true) || !empty($suggestion['validationErrors'])) continue;
                    $actor = $this->refreshActor((int)$run->initiatorId);
                    $element = $this->element($run);
                    $plugin->getWorkflowAccess()->assertCanRun($current, $element, $actor);
                    $stale = $this->staleness($run, $workflow, $element);
                    $uid = (string)($suggestion['targetFieldUid'] ?? '');
                    if ($stale['context'] || in_array($uid, $stale['outputs'], true)) continue;
                    if (!$plugin->getWorkflowAccess()->canUseField($workflow, $uid, $actor, $element, true)) continue;
                    $transaction = Craft::$app->getDb()->beginTransaction();
                    try {
                        $runtime->apply($plugin->getWorkflowService()->asField($workflow), $element, $suggestion, $actor);
                        $suggestion['state'] = 'applied';
                        $suggestion['applicationMode'] = 'automatic';
                        $suggestion['decidedBy'] = (int)$actor->id;
                        $suggestion['appliedFingerprint'] = $this->baseline($workflow, $this->element($run))['outputs'][$uid] ?? null;
                        $run->suggestionsJson = Json::encode($suggestions);
                        $this->saveRun($run);
                        $transaction->commit();
                    } catch (Throwable $error) {
                        $transaction->rollBack();
                        $suggestion['state'] = 'pending';
                        $suggestion['applicationError'] = $error->getMessage();
                    }
                    $run->suggestionsJson = Json::encode($suggestions);
                    $this->saveRun($run);
                }
                unset($suggestion);
                $run->suggestionsJson = Json::encode($suggestions);
                $run->status = $this->hasPending($suggestions) ? 'ready' : 'completed';
                $run->generationCompletedAt = \craft\helpers\Db::prepareDateForDb(new \DateTime());
                $this->saveRun($run);
            } catch (Throwable $error) {
                $run->status = 'failed';
                $run->errorMessage = $error->getMessage();
                $this->saveRun($run);
                Craft::error('Autofill run ' . $id . ': ' . $error->getMessage(), __METHOD__);
            }
        } finally {
            Craft::$app->getMutex()->release($lock);
        }
    }

    private function isPrivateOwner(WorkflowRunRecord $run, User $actor): bool
    {
        if ($run->visibility !== 'private') return false;
        $ownerId = $run->privateOwnerId ?? Json::decode($run->definitionJson)['ownerId'] ?? $run->initiatorId;
        return $ownerId !== null && (int)$ownerId === (int)$actor->id;
    }

    public function canView(WorkflowRunRecord $run, User $actor): bool
    {
        $access = AutofillPlugin::getInstance()->getWorkflowAccess();
        if (!$actor->admin) {
            $own = (int)$run->initiatorId === (int)$actor->id || $this->isPrivateOwner($run, $actor);
            $canViewRun = $own
                ? $access->can($actor, 'view')
                : $run->visibility === 'public' && $access->can($actor, 'viewOthers') && $access->can($actor, 'reviewOthers');
            if (!$canViewRun) return false;
        }
        try {
            return Craft::$app->getElements()->canView($this->element($run), $actor);
        } catch (Throwable) {
            return false;
        }
    }

    public function editorPayload(WorkflowRunRecord $run, User $actor): array
    {
        // A pending result may already match because the editor saved it
        // independently. Reconcile when opening it, under the same lock as decisions.
        $lock = 'autofill:process:' . $run->id;
        if ($run->status !== 'ready' || !$this->canView($run, $actor) || !Craft::$app->getMutex()->acquire($lock, 5)) {
            return $this->payload($run, $actor);
        }
        try {
            $run = WorkflowRunRecord::findOne($run->id) ?? $run;
            if ($run->status === 'ready' && $this->canView($run, $actor)) {
                $element = $this->element($run);
                if ($this->canReview($run, $actor, $element)) {
                    $workflow = new Workflow(Json::decode($run->definitionJson));
                    $suggestions = Json::decode($run->suggestionsJson);
                    if ($this->markUnchanged($suggestions, $workflow, $element, $actor)) {
                        $run->suggestionsJson = Json::encode($suggestions);
                        if (!$this->hasPending($suggestions)) $run->status = 'completed';
                        $this->saveRun($run);
                    }
                }
            }
            return $this->payload($run, $actor);
        } finally {
            Craft::$app->getMutex()->release($lock);
        }
    }

    public function payload(WorkflowRunRecord $run, User $actor): array
    {
        if (!$this->canView($run, $actor)) throw new RuntimeException('This Autofill run is unavailable.');
        $workflow = new Workflow(Json::decode($run->definitionJson));
        $element = $this->element($run);
        $plugin = AutofillPlugin::getInstance();
        $access = $plugin->getWorkflowAccess();
        $definition = $plugin->getWorkflowService()->asField($workflow);
        $rows = array_column($definition->rows, null, 'targetFieldUid');
        $suggestions = [];
        foreach ($run->suggestionsJson ? Json::decode($run->suggestionsJson) : [] as $index => $suggestion) {
            $uid = (string)($suggestion['targetFieldUid'] ?? '');
            if (!$access->canUseField($workflow, $uid, $actor, $element)) continue;
            if (($suggestion['state'] ?? '') === 'pending' && ($suggestion['reviewEditor']['type'] ?? '') === 'seomaticBasic') {
                $field = $plugin->getEntryTypeFieldResolverService()->resolveForAutofillField($definition, $uid);
                $adapter = $field === null ? null : $plugin->getFieldAdapterService()->getAdapterForField($field);
                if ($adapter instanceof SeomaticFieldAdapter) {
                    $sections = $adapter->buildPromptContract($field, $rows[$uid] ?? [])['sections'];
                    $suggestion['reviewEditor']['visibleFields'] = $sections;
                    $suggestion['value'] = $adapter->normalizeSuggestion($field, $suggestion['value'] ?? null, $sections);
                    if ($suggestion['value'] === [] && empty($suggestion['validationErrors'])) {
                        $suggestion['validationErrors'] = ['The suggestion has no values for enabled SEOmatic fields.'];
                    }
                }
            }
            $suggestion['index'] = $index;
            $suggestion['canApply'] = $access->canUseField($workflow, $uid, $actor, $element, true);
            $suggestions[] = $suggestion;
        }
        $stale = $this->staleness($run, $workflow, $element);
        $visibleUids = array_column($suggestions, 'targetFieldUid');
        $currentWorkflow = AutofillPlugin::getInstance()->getWorkflowService()->getById((int)$run->workflowId);
        $canRegenerate = $currentWorkflow !== null && !$currentWorkflow->archived && $access->canView($currentWorkflow, $actor) && $access->can($actor, 'run');

        $stale['outputs'] = array_values(array_intersect($stale['outputs'], $visibleUids));
        return [
            'id' => (int)$run->id, 'status' => $run->status, 'visibility' => $run->visibility,
            'elementId' => (int)$run->elementId, 'siteId' => (int)$run->siteId, 'elementType' => $run->elementType,
            'elementTitle' => $element->title, 'editUrl' => $element->getCpEditUrl(), 'workflowName' => $workflow->name,
            'suggestions' => $suggestions, 'error' => $run->errorMessage,
            'stale' => $stale,
            'canCancel' => $this->canManage($run, $actor) && in_array($run->status, ['queued', 'running', 'ready', 'failed'], true),
            'canRegenerate' => $canRegenerate && $this->canManage($run, $actor) && in_array($run->status, ['ready', 'failed'], true),
            'canReview' => $this->canReview($run, $actor, $element),
        ];
    }

    public function decide(int $runId, int $index, User $actor, bool $accept, array $correction = []): array
    {
        $lock = 'autofill:process:' . $runId;
        if (!Craft::$app->getMutex()->acquire($lock, 5)) throw new RuntimeException('This run is being updated. Try again.');
        $transaction = Craft::$app->getDb()->beginTransaction();
        try {
            $run = WorkflowRunRecord::findOne($runId);
            if (!$run || !$this->canView($run, $actor)) throw new RuntimeException('This Autofill run is unavailable.');
            $payload = $this->payload($run, $actor);
            if (!$payload['canReview']) throw new RuntimeException('You do not have permission to review these results.');
            if ($run->status !== 'ready') throw new RuntimeException('This run is not awaiting review.');
            $suggestions = Json::decode($run->suggestionsJson);
            $suggestion = $suggestions[$index] ?? null;
            if (!$suggestion || ($suggestion['state'] ?? '') !== 'pending') throw new RuntimeException('This suggestion has already been decided.');
            $workflow = new Workflow(Json::decode($run->definitionJson));
            $element = $this->element($run);
            if (!AutofillPlugin::getInstance()->getWorkflowAccess()->canUseField($workflow, (string)$suggestion['targetFieldUid'], $actor, $element, true)) {
                throw new RuntimeException('You cannot edit this output field.');
            }
            if ($accept) {
                if (!empty($suggestion['validationErrors']) && in_array($suggestion['reviewEditor']['type'] ?? '', ['tablePreview', 'iconPreview', 'linkPreview'], true)) {
                    throw new RuntimeException('This invalid result is read-only. Reject it or regenerate.');
                }
                // Target identity and policy come from saved generation, never from browser-supplied data.
                if (array_key_exists('value', $correction)) $suggestion['value'] = $correction['value'];
                AutofillPlugin::getInstance()->getWorkflowRuntimeService()->apply(
                    AutofillPlugin::getInstance()->getWorkflowService()->asField($workflow), $element, $suggestion, $actor,
                );
                $suggestion['appliedFingerprint'] = $this->baseline($workflow, $this->element($run))['outputs'][(string)$suggestion['targetFieldUid']] ?? null;
            }
            $suggestion['state'] = $accept ? 'applied' : 'rejected';
            $suggestion['applicationMode'] = $accept ? 'reviewed' : null;
            $suggestion['decidedBy'] = (int)$actor->id;
            $suggestions[$index] = $suggestion;
            $run->suggestionsJson = Json::encode($suggestions);
            $run->status = $this->hasPending($suggestions) ? 'ready' : 'completed';
            $this->saveRun($run);
            $payload = $this->payload($run, $actor);
            $transaction->commit();
            return $payload;
        } catch (Throwable $error) {
            $transaction->rollBack();
            throw $error;
        } finally {
            Craft::$app->getMutex()->release($lock);
        }
    }

    private function saveRun(WorkflowRunRecord $run): void
    {
        if (!$run->save(false)) throw new RuntimeException('The Autofill run state could not be saved. No result should be applied without recording its outcome.');
    }

    private function refreshActor(int $id): User
    {
        $permissions = Craft::$app->getUserPermissions();
        if (method_exists($permissions, 'reset')) $permissions->reset();
        else Craft::$app->set('userPermissions', new \craft\services\UserPermissions());
        $actor = Craft::$app->getUsers()->getUserById($id);
        if (!$actor || $actor->getStatus() !== User::STATUS_ACTIVE) throw new RuntimeException('The initiating user is no longer active.');
        return $actor;
    }

    private function element(WorkflowRunRecord $run): ElementInterface
    {
        $element = Craft::$app->getElements()->getElementById((int)$run->elementId,
            $run->elementType === 'asset' ? Asset::class : Entry::class, (int)$run->siteId);
        if (!$element || $element->getIsRevision()) throw new RuntimeException('The original content is no longer available.');
        return $element;
    }

    public function definitionForActor(Workflow $workflow, ElementInterface $element, User $actor): Workflow
    {
        $definition = clone $workflow;
        $access = AutofillPlugin::getInstance()->getWorkflowAccess();
        foreach ($definition->contextRows as $row) {
            if (($row['enabled'] ?? true) && !$access->canUseField($workflow, (string)($row['fieldUid'] ?? ''), $actor, $element)) {
                throw new RuntimeException('A required context field is unavailable to you.');
            }
        }
        $definition->rows = array_values(array_filter($definition->rows, static fn(array $row): bool =>
            ($row['enabled'] ?? true) && $access->canUseField($workflow, (string)($row['targetFieldUid'] ?? ''), $actor, $element, true)));
        if ($definition->rows === []) throw new RuntimeException('No output fields are available to you.');
        $sourceUids = [];
        foreach ($definition->contextRows as $row) if ($row['enabled'] ?? true) $sourceUids[(string)$row['fieldUid']] = true;
        foreach ($definition->rows as $row) {
            if (($row['enabled'] ?? true) && (($row['includeCurrentFieldValue'] ?? true) || ($row['related']['forceUseCurrentValues'] ?? false))) $sourceUids[(string)$row['targetFieldUid']] = true;
        }
        foreach ($element->getFieldLayout()?->getCustomFields() ?? [] as $field) {
            $uid = (string)($field->layoutElement->uid ?? $field->uid);
            if (!isset($sourceUids[$uid])) continue;
            $value = $element->getFieldValue($field->handle);
            if ($field instanceof \craft\fields\BaseRelationField && is_object($value) && method_exists($value, 'all')) {
                foreach ($value->all() as $related) {
                    if ($related instanceof ElementInterface && !Craft::$app->getElements()->canView($related, $actor)) throw new RuntimeException('A related context item is unavailable to you.');
                }
            }
            if ($value instanceof \craft\fields\data\LinkData) {
                $related = $value->getElement();
                if ($related && !Craft::$app->getElements()->canView($related, $actor)) throw new RuntimeException('A linked context item is unavailable to you.');
            }
        }
        (new \jtdev\craftautofill\services\assets\AssetInputService())->collect(AutofillPlugin::getInstance()->getWorkflowService()->asField($definition), $element, false, $actor);
        return $definition;
    }

    private function hasPending(array $suggestions): bool
    {
        return (bool)array_filter($suggestions, static fn(array $item): bool => ($item['state'] ?? '') === 'pending');
    }

    private function canReview(WorkflowRunRecord $run, User $actor, ElementInterface $element): bool
    {
        $access = AutofillPlugin::getInstance()->getWorkflowAccess();
        return Craft::$app->getElements()->canSave($element, $actor) && $access->can($actor, 'review') &&
            ((int)$run->initiatorId === (int)$actor->id || $this->isPrivateOwner($run, $actor) || $access->can($actor, 'reviewOthers'));
    }

    private function markUnchanged(array &$suggestions, Workflow $workflow, ElementInterface $element, User $actor): bool
    {
        $plugin = AutofillPlugin::getInstance();
        $changed = false;
        foreach ($suggestions as &$suggestion) {
            if (($suggestion['state'] ?? '') !== 'pending' || !empty($suggestion['validationErrors'])) continue;
            if (!$plugin->getWorkflowAccess()->canUseField($workflow, (string)($suggestion['targetFieldUid'] ?? ''), $actor, $element, true)) continue;
            if ($plugin->getWorkflowRuntimeService()->matchesSavedValue($element, $suggestion, $actor)) {
                $suggestion['state'] = 'unchanged';
                $changed = true;
            }
        }
        unset($suggestion);
        return $changed;
    }

    private function baseline(Workflow $workflow, ElementInterface $element): array
    {
        $result = ['context' => [], 'outputs' => []];
        foreach ($workflow->contextRows as $row) {
            if ($row['enabled'] ?? true) $result['context'][(string)$row['fieldUid']] = $this->fingerprint($element, (string)$row['fieldUid'], $row['assets'] ?? []);
        }
        foreach ($workflow->rows as $row) {
            if (!($row['enabled'] ?? true)) continue;
            $uid = (string)$row['targetFieldUid'];
            $result['outputs'][$uid] = $this->fingerprint($element, $uid, $row['assets'] ?? [], output: true);
            if ($row['includeCurrentFieldValue'] ?? true) $result['context'][$uid] = $result['outputs'][$uid];
        }
        return $result;
    }

    private function fingerprint(ElementInterface $element, string $uid, array $assetOptions = [], bool $output = false): string
    {
        if ($uid === '__asset__:file') {
            $value = $this->assetFingerprint($element, $assetOptions);
        } elseif (str_starts_with($uid, '__native__:')) {
            $value = $element->{substr($uid, 11)};
        } else {
            $value = null;
            foreach ($element->getFieldLayout()?->getCustomFields() ?? [] as $field) {
                if ((string)($field->layoutElement->uid ?? $field->uid) !== $uid) continue;
                $fieldValue = $element->getFieldValue($field->handle);
                $value = $field->serializeValue($fieldValue, $element);
                if ($field instanceof Assets) {
                    $limit = max(1, min(20, (int)($assetOptions['maxFiles'] ?? 3)));
                    $assets = $fieldValue instanceof ElementQueryInterface
                        ? (clone $fieldValue)->limit($limit)->all()
                        : $fieldValue->take($limit);
                    $inputs = [];
                    foreach ($assets as $asset) {
                        $inputs[] = $this->assetFingerprint($asset, $assetOptions);
                    }
                    // The input limit does not constrain which relations an output can replace.
                    $value = $output ? ['selection' => $value, 'inputs' => $inputs] : $inputs;
                }
                break;
            }
        }
        return hash('sha256', Json::encode($value));
    }

    private function assetFingerprint(Asset $asset, array $options): array
    {
        $values = ['assetId' => (int)$asset->id];
        foreach ($options['metadata'] ?? ['title', 'filename'] as $key) {
            $field = $asset->getFieldLayout()?->getFieldByHandle($key);
            $values[$key] = match ($key) {
                'title' => $asset->title, 'filename' => $asset->getFilename(), 'alt', 'altText' => $asset->alt,
                'size' => $asset->size, 'dateCreated' => $asset->dateCreated?->format(DATE_ATOM),
                default => $field ? $field->serializeValue($asset->getFieldValue($key), $asset) : null,
            };
        }
        if ($options['includeFile'] ?? false) {
            $values['file'] = [$asset->getFilename(), $asset->size, $asset->dateModified?->format(DATE_ATOM)];
        }
        return $values;
    }

    private function staleness(WorkflowRunRecord $run, Workflow $workflow, ElementInterface $element): array
    {
        $before = $run->baselineJson ? Json::decode($run->baselineJson) : [];
        $now = $this->baseline($workflow, $element);
        $changed = ['context' => false, 'outputs' => []];
        // Compare against our own saved value after application. Later human
        // edits must still make dependent suggestions stale.
        $applied = [];
        foreach ($run->suggestionsJson ? Json::decode($run->suggestionsJson) : [] as $item) {
            if (($item['state'] ?? '') === 'applied' && isset($item['appliedFingerprint'])) {
                $applied[(string)$item['targetFieldUid']] = $item['appliedFingerprint'];
            }
        }
        foreach ($before['context'] ?? [] as $uid => $hash) {
            if (($now['context'][$uid] ?? null) !== ($applied[$uid] ?? $hash)) $changed['context'] = true;
        }
        foreach ($before['outputs'] ?? [] as $uid => $hash) {
            if (($now['outputs'][$uid] ?? null) !== ($applied[$uid] ?? $hash)) $changed['outputs'][] = $uid;
        }
        return $changed;
    }
}
