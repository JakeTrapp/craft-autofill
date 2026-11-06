<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\entries;

use Craft;
use craft\base\Component;
use craft\elements\Entry;
use craft\elements\User;
use craft\fieldlayoutelements\CustomField;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\fields\AutofillField;
use RuntimeException;
use Throwable;

class BulkAutofillService extends Component
{
    /**
     * @return array{fieldId:int,entries:array<int,array{entryId:int,success:bool,suggestionsApplied:int,error:string|null}>,total:int,succeeded:int,failed:int,suggestionsApplied:int}
     */
    public function run(
        ?int $fieldId,
        ?string $fieldSlug,
        string|array $entryIds,
        ?int $siteId = null,
        string $userPrompt = '',
        string $source = 'bulk',
        ?callable $onStart = null,
        ?callable $onEntryProcessed = null,
    ): array {
        if (!AutofillPlugin::getInstance()->isProEdition()) {
            throw new RuntimeException('Bulk Autofill is only available in Autofill Pro.');
        }

        $ids = is_array($entryIds) ? $this->normalizeEntryIds($entryIds) : $this->parseEntryIds($entryIds);
        if ($ids === []) {
            throw new RuntimeException('No valid entry IDs were provided.');
        }

        $field = $this->resolveAutofillField($fieldId, $fieldSlug);
        $resolvedFieldId = (int)$field->id;
        $entries = [];
        $succeeded = 0;
        $failed = 0;
        $suggestionsApplied = 0;

        if ($onStart !== null) {
            $onStart($resolvedFieldId, count($ids));
        }

        foreach ($ids as $entryId) {
            $result = $this->processEntry($resolvedFieldId, $entryId, $siteId, $userPrompt, $source, $this->currentUserId());
            $entries[] = $result;

            if ($onEntryProcessed !== null) {
                $onEntryProcessed($result);
            }

            if ($result['success']) {
                $succeeded++;
                $suggestionsApplied += $result['suggestionsApplied'];
                continue;
            }

            $failed++;
        }

        return [
            'fieldId' => $resolvedFieldId,
            'entries' => $entries,
            'total' => count($ids),
            'succeeded' => $succeeded,
            'failed' => $failed,
            'suggestionsApplied' => $suggestionsApplied,
        ];
    }

    /**
     * Queues Autofill jobs for one Autofill field across one or more entries.
     *
     * @return array{fieldId:int,entries:array<int,array{entryId:int,queued:bool,jobId:mixed,error:string|null}>,total:int,queued:int,failed:int}
     */
    public function queue(
        ?int $fieldId,
        ?string $fieldSlug,
        string|array $entryIds,
        ?int $siteId = null,
        string $userPrompt = '',
        string $source = 'bulk-queue',
        ?callable $onStart = null,
        ?callable $onEntryQueued = null,
    ): array {
        if (!AutofillPlugin::getInstance()->isProEdition()) {
            throw new RuntimeException('Bulk Autofill is only available in Autofill Pro.');
        }

        $ids = is_array($entryIds) ? $this->normalizeEntryIds($entryIds) : $this->parseEntryIds($entryIds);
        if ($ids === []) {
            throw new RuntimeException('No valid entry IDs were provided.');
        }

        $field = $this->resolveAutofillField($fieldId, $fieldSlug);
        $resolvedFieldId = (int)$field->id;
        $entries = [];
        $queued = 0;
        $failed = 0;

        if ($onStart !== null) {
            $onStart($resolvedFieldId, count($ids));
        }

        foreach ($ids as $entryId) {
            try {
                $jobId = $this->queueForEntry($resolvedFieldId, null, $entryId, $siteId, $userPrompt, $source, $this->currentUserId());
                $result = [
                    'entryId' => $entryId,
                    'queued' => true,
                    'jobId' => $jobId,
                    'error' => null,
                ];
                $queued++;
            } catch (Throwable $exception) {
                $result = [
                    'entryId' => $entryId,
                    'queued' => false,
                    'jobId' => null,
                    'error' => $exception->getMessage(),
                ];
                $failed++;
            }

            $entries[] = $result;

            if ($onEntryQueued !== null) {
                $onEntryQueued($result);
            }
        }

        return [
            'fieldId' => $resolvedFieldId,
            'entries' => $entries,
            'total' => count($ids),
            'queued' => $queued,
            'failed' => $failed,
        ];
    }

    /**
     * Queues Autofill for a single entry and field.
     */
    public function queueForEntry(
        ?int $fieldId,
        ?string $fieldSlug,
        int $entryId,
        ?int $siteId = null,
        string $userPrompt = '',
        string $source = 'queue',
        ?int $initiatingUserId = null,
    ): mixed {
        if (!AutofillPlugin::getInstance()->isProEdition()) {
            throw new RuntimeException('Bulk Autofill is only available in Autofill Pro.');
        }

        if ($entryId <= 0) {
            throw new RuntimeException('A valid entry ID is required.');
        }

        $field = $this->resolveAutofillField($fieldId, $fieldSlug);
        $initiatingUserId ??= $this->currentUserId();
        $entry = Craft::$app->getElements()->getElementById($entryId, Entry::class, $siteId);
        if (!$entry instanceof Entry) {
            throw new RuntimeException(sprintf('Entry %d could not be found.', $entryId));
        }
        $user = $initiatingUserId !== null ? Craft::$app->getUsers()->getUserById($initiatingUserId) : null;
        if ($initiatingUserId !== null && (!$user instanceof User || $user->getStatus() !== User::STATUS_ACTIVE)) {
            throw new RuntimeException('The user who requested this Autofill job is no longer available.');
        }
        if (!Craft::$app->getRequest()->getIsConsoleRequest()) {
            AutofillPlugin::getInstance()->getWorkflowRuntimeService()->authorizeField(
                (int)$field->id,
                (int)$entry->id,
                $entry->siteId,
            );
        }
        $this->authorizeEntryRun($field, $entry, $user);

        if (!$user) throw new RuntimeException('Specify an active initiating user for queued Autofill.');
        $workflow = AutofillPlugin::getInstance()->getWorkflowService()->getByHandle($field->workflowHandle);
        if (!$workflow) throw new RuntimeException('Migrate this Autofill field to a saved workflow before running it.');
        $run = AutofillPlugin::getInstance()->getWorkflowRunService()->start($workflow, $entry, $user, $userPrompt, \craft\helpers\StringHelper::UUID());
        return (int)$run->id;
    }

    /**
     * Runs Autofill immediately for a single entry and field.
     *
     * @return array{entryId:int,success:bool,suggestionsApplied:int,error:string|null}
     */
    public function runForEntry(
        ?int $fieldId,
        ?string $fieldSlug,
        int $entryId,
        ?int $siteId = null,
        string $userPrompt = '',
        string $source = 'api',
        ?int $initiatingUserId = null,
    ): array {
        if (!AutofillPlugin::getInstance()->isProEdition()) {
            throw new RuntimeException('Bulk Autofill is only available in Autofill Pro.');
        }

        if ($entryId <= 0) {
            throw new RuntimeException('A valid entry ID is required.');
        }

        $field = $this->resolveAutofillField($fieldId, $fieldSlug);
        $resolvedFieldId = (int)$field->id;

        $initiatingUserId ??= $this->currentUserId();
        return $this->processEntry($resolvedFieldId, $entryId, $siteId, $userPrompt, $source, $initiatingUserId);
    }

    /**
     * @return int[]
     */
    public function parseEntryIds(string $entryIds): array
    {
        return $this->normalizeEntryIds(explode(',', $entryIds));
    }

    /**
     * @param array<int|string, mixed> $entryIds
     * @return int[]
     */
    private function normalizeEntryIds(array $entryIds): array
    {
        $ids = [];

        foreach ($entryIds as $rawId) {
            $id = (int)trim((string)$rawId);
            if ($id > 0) {
                $ids[$id] = $id;
            }
        }

        return array_values($ids);
    }

    private function resolveAutofillField(?int $fieldId, ?string $fieldSlug): AutofillField
    {
        $fieldId = is_numeric($fieldId) ? (int)$fieldId : 0;
        $fieldSlug = trim((string)$fieldSlug);

        if ($fieldId <= 0 && $fieldSlug === '') {
            throw new RuntimeException('Specify an Autofill field with --field-id=123 or --field-slug=fieldHandle.');
        }

        if ($fieldId > 0 && $fieldSlug !== '') {
            throw new RuntimeException('Specify only one of --field-id or --field-slug.');
        }

        if ($fieldId > 0) {
            $field = Craft::$app->getFields()->getFieldById($fieldId);
            if (!$field instanceof AutofillField) {
                throw new RuntimeException(sprintf('Autofill field %d could not be found.', $fieldId));
            }

            if ($field->workflowHandle !== '') {
                $workflow = AutofillPlugin::getInstance()->getWorkflowService()->resolveForField($field);
                if ($workflow === null) {
                    throw new RuntimeException('This Autofill workflow is unavailable.');
                }
                $resolved = AutofillPlugin::getInstance()->getWorkflowService()->asField($workflow);
                $resolved->id = $field->id;
                $resolved->uid = $field->uid;
                $resolved->handle = $field->handle;
                return $resolved;
            }
            return $field;
        }

        $field = Craft::$app->getFields()->getFieldByHandle($fieldSlug);
        if (!$field instanceof AutofillField) {
            throw new RuntimeException(sprintf(
                'Autofill field with slug/handle "%s" could not be found.',
                $fieldSlug
            ));
        }

        if ($field->workflowHandle !== '') {
            $workflow = AutofillPlugin::getInstance()->getWorkflowService()->resolveForField($field);
            if ($workflow === null) {
                throw new RuntimeException('This Autofill workflow is unavailable.');
            }
            $resolved = AutofillPlugin::getInstance()->getWorkflowService()->asField($workflow);
            $resolved->id = $field->id;
            $resolved->uid = $field->uid;
            $resolved->handle = $field->handle;
            return $resolved;
        }
        return $field;
    }

    /**
     * @return array{entryId:int,success:bool,suggestionsApplied:int,error:string|null}
     */
    private function processEntry(
        int $fieldId,
        int $entryId,
        ?int $siteId,
        string $userPrompt,
        string $source,
        ?int $initiatingUserId = null,
    ): array {
        $plugin = AutofillPlugin::getInstance();
        try {
            $entry = Craft::$app->getElements()->getElementById($entryId, Entry::class, $siteId);
            if (!$entry instanceof Entry) throw new RuntimeException('The entry is unavailable.');
            $definition = $this->resolveAutofillField($fieldId, null);
            $user = $initiatingUserId ? Craft::$app->getUsers()->getUserById($initiatingUserId) : null;
            $this->authorizeEntryRun($definition, $entry, $user);
            if (!$user || $user->getStatus() !== User::STATUS_ACTIVE) throw new RuntimeException('Specify an active initiating user for Autofill.');
            $workflow = $plugin->getWorkflowService()->getByHandle($definition->workflowHandle);
            if (!$workflow) throw new RuntimeException('Migrate this Autofill field to a saved workflow before running it.');
            $service = $plugin->getWorkflowRunService();
            $run = $service->start($workflow, $entry, $user, $userPrompt, \craft\helpers\StringHelper::UUID());
            $service->process((int)$run->id);
            $run = \jtdev\craftautofill\records\WorkflowRunRecord::findOne($run->id);
            $payload = $service->payload($run, $user);
            $invalid = array_filter($payload['suggestions'], static fn(array $item): bool => !empty($item['validationErrors']) || !empty($item['applicationError']));
            return [
                'entryId' => $entryId, 'runId' => (int)$run->id,
                'success' => $run->status !== 'failed' && $invalid === [],
                'suggestionsApplied' => count(array_filter($payload['suggestions'], static fn(array $item): bool => $item['state'] === 'applied')),
                'error' => $run->errorMessage ?: ($invalid ? implode(' ', array_map(static fn(array $item): string => ($item['displayFieldName'] ?? $item['fieldName'] ?? 'Field') . ': ' . implode(' ', $item['validationErrors'] ?? [$item['applicationError'] ?? 'Needs review.']), $invalid)) : null),
            ];
        } catch (Throwable $exception) {
            return ['entryId' => $entryId, 'success' => false, 'suggestionsApplied' => 0, 'error' => $exception->getMessage()];
        }
    }

    private function currentUserId(): ?int
    {
        if (Craft::$app->getRequest()->getIsConsoleRequest()) {
            return null;
        }

        $userId = Craft::$app->getUser()->getId();
        if (!$userId && Craft::$app->getRequest()->getIsConsoleRequest()) return null;
        if (!$userId) {
            throw new RuntimeException('You must be signed in to queue Autofill for content.');
        }

        return (int)$userId;
    }

    /** Authorize content scope, edit access, and selected asset context before any provider request. */
    private function authorizeEntryRun(AutofillField $definition, Entry $entry, ?User $user): void
    {
        if ($definition->workflowHandle !== '') {
            $workflow = AutofillPlugin::getInstance()->getWorkflowService()->getByHandle($definition->workflowHandle);
            if ($workflow === null) {
                throw new RuntimeException('This Autofill workflow is unavailable.');
            }
            AutofillPlugin::getInstance()->getWorkflowRuntimeService()->assertScope($workflow, $entry);
            if ($user !== null) {
                AutofillPlugin::getInstance()->getWorkflowAccess()->assertCanRun($workflow, $entry, $user);
                if (!AutofillPlugin::getInstance()->getWorkflowAccess()->can($user, 'bulk')) throw new RuntimeException('You do not have permission to run bulk Autofill.');
            }
        } elseif ($definition->entryTypeUid !== (string)$entry->getType()->uid) {
            throw new RuntimeException('This workflow does not support this entry type.');
        }

        if ($user !== null && !Craft::$app->getElements()->canSave($entry, $user)) {
            throw new RuntimeException('You do not have permission to change this content.');
        }

        (new \jtdev\craftautofill\services\assets\AssetInputService())->collect($definition, $entry, false, $user);

        if ($user === null) {
            return;
        }

        $layoutFields = [];
        foreach ($entry->getFieldLayout()?->getCustomFields() ?? [] as $layoutField) {
            $uid = (string)($layoutField->layoutElement->uid ?? $layoutField->uid ?? '');
            $layoutFields[$uid] = $layoutField;
        }
        foreach ($definition->rows as $row) {
            if (!is_array($row) || !($row['enabled'] ?? true)) {
                continue;
            }
            $uid = trim((string)($row['targetFieldUid'] ?? ''));
            if (str_starts_with($uid, '__native__:')) {
                continue;
            }
            $layoutField = $layoutFields[$uid] ?? null;
            $layoutElement = $layoutField?->layoutElement;
            if ($layoutField === null || !$layoutElement instanceof CustomField) {
                throw new RuntimeException('You cannot edit one of this workflow’s output fields.');
            }
            $userCondition = $layoutElement->getUserCondition();
            if ($userCondition !== null && !$userCondition->matchElement($user)) {
                throw new RuntimeException('You cannot edit one of this workflow’s output fields.');
            }
            $elementCondition = $layoutElement->getElementCondition();
            if ($elementCondition !== null && !$elementCondition->matchElement($entry)) {
                throw new RuntimeException('You cannot edit one of this workflow’s output fields.');
            }
            if (method_exists($layoutElement, 'getEditCondition')) {
                $editCondition = $layoutElement->getEditCondition();
                if ($editCondition !== null && !$editCondition->matchElement($user)) {
                    throw new RuntimeException('You cannot edit one of this workflow’s output fields.');
                }
            }
            if (method_exists($layoutElement, 'getElementEditCondition')) {
                $elementEditCondition = $layoutElement->getElementEditCondition();
                if ($elementEditCondition !== null && !$elementEditCondition->matchElement($entry)) {
                    throw new RuntimeException('You cannot edit one of this workflow’s output fields.');
                }
            }
        }
    }
}
