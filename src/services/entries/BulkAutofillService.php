<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\entries;

use Craft;
use craft\base\Component;
use craft\elements\Entry;
use craft\elements\User;
use craft\fieldlayoutelements\CustomField;
use craft\helpers\Json;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\fields\AutofillField;
use jtdev\craftautofill\jobs\RunAutofillEntryJob;
use jtdev\craftautofill\models\ai\AiModelConfig;
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
        $modelConfig = $this->resolveModelConfigForField($field);
        $entries = [];
        $succeeded = 0;
        $failed = 0;
        $suggestionsApplied = 0;

        if ($onStart !== null) {
            $onStart($resolvedFieldId, count($ids));
        }

        foreach ($ids as $entryId) {
            $result = $this->processEntry($resolvedFieldId, $entryId, $siteId, $modelConfig, $userPrompt, $source, $this->currentUserId());
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

        return Craft::$app->getQueue()->push(new RunAutofillEntryJob([
            'fieldId' => (int)$field->id,
            'entryId' => $entryId,
            'siteId' => $siteId,
            'userPrompt' => $userPrompt,
            'source' => $source,
            'initiatingUserId' => $initiatingUserId,
        ]));
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
        $modelConfig = $this->resolveModelConfigForField($field);

        $initiatingUserId ??= $this->currentUserId();
        return $this->processEntry($resolvedFieldId, $entryId, $siteId, $modelConfig, $userPrompt, $source, $initiatingUserId);
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

    private function resolveModelConfigForField(AutofillField $field): AiModelConfig
    {
        $settings = AutofillPlugin::getInstance()->getSettings();
        $targetUid = trim($field->modelConfigUid);
        $chosen = null;

        foreach ($settings->modelConfigs as $row) {
            if (!is_array($row) || !($row['enabled'] ?? false)) {
                continue;
            }

            $uid = trim((string)($row['uid'] ?? ''));
            if ($targetUid !== '' && $uid !== $targetUid) {
                continue;
            }

            $chosen = $row;
            break;
        }

        if ($chosen === null && $targetUid !== '') {
            throw new RuntimeException('The selected AI model configuration is missing or disabled.');
        }

        if ($chosen === null) {
            foreach ($settings->modelConfigs as $row) {
                if (!is_array($row) || !($row['enabled'] ?? false)) {
                    continue;
                }

                $chosen = $row;
                break;
            }
        }

        if (!is_array($chosen)) {
            throw new RuntimeException('No enabled AI model configuration is available.');
        }

        $modelConfig = AutofillPlugin::getInstance()->getAiService()->createModelConfig($chosen);
        if (!$modelConfig->validate()) {
            $message = implode(' ', array_values($modelConfig->getFirstErrors()));
            throw new RuntimeException($message !== '' ? $message : 'Selected AI model configuration is invalid.');
        }

        return $modelConfig;
    }

    /**
     * @return array{entryId:int,success:bool,suggestionsApplied:int,error:string|null}
     */
    private function processEntry(
        int $fieldId,
        int $entryId,
        ?int $siteId,
        AiModelConfig $modelConfig,
        string $userPrompt,
        string $source,
        ?int $initiatingUserId = null,
    ): array {
        $startedAt = microtime(true);
        $logId = null;
        $plugin = AutofillPlugin::getInstance();

        try {
            $entry = Craft::$app->getElements()->getElementById($entryId, Entry::class, $siteId);
            if (!$entry instanceof Entry) {
                throw new RuntimeException(sprintf('Entry %d could not be found.', $entryId));
            }

            $user = $initiatingUserId !== null ? Craft::$app->getUsers()->getUserById($initiatingUserId) : null;
            if ($initiatingUserId !== null && (!$user instanceof User || $user->getStatus() !== User::STATUS_ACTIVE)) {
                throw new RuntimeException('The user who requested this Autofill job is no longer available.');
            }
            $definition = $this->resolveAutofillField($fieldId, null);
            $this->authorizeEntryRun($definition, $entry, $user);

            $aiService = $plugin->getAiService();
            $instruction = $aiService->buildAutofillPromptPreview($userPrompt, $fieldId, $entryId, $siteId);
            $request = $aiService->promptBuilder->buildGenerationRequest(
                '',
                $instruction,
                $modelConfig,
                ['fieldId' => $fieldId, 'entryId' => $entryId, 'source' => $source]
            );

            $targetElement = Craft::$app->getElements()->getElementById($entryId, \craft\elements\Entry::class, $siteId);
            if ($targetElement !== null) {
                $request->fileInputs = (new \jtdev\craftautofill\services\assets\AssetInputService())->collect($definition, $targetElement, true, $user)['files'];
            }
            $requestPayload = $request->safeLogPayload();

            $logId = $plugin->getAiRequestLogService()->begin([
                'fieldId' => $fieldId,
                'entryId' => $entryId,
                'siteId' => $siteId,
                'provider' => $modelConfig->provider,
                'modelConfigUid' => $modelConfig->uid !== '' ? $modelConfig->uid : null,
                'modelId' => $modelConfig->modelId !== '' ? $modelConfig->modelId : null,
                'reasoningEffort' => $modelConfig->reasoningEffort,
                'requestPrompt' => $instruction,
                'requestPayloadJson' => $this->encodeJson($requestPayload),
                'success' => false,
            ]);

            $detailedResult = $aiService->generateFromRequestDetailed($request, $modelConfig);
            $generationResult = $detailedResult['result'];
            $rawResponse = $detailedResult['rawResponse'];
            $responseRawText = $this->extractResponseRawText($rawResponse);
            $usage = $this->extractTokenUsage($rawResponse);
            $providerResponseId = isset($rawResponse['id']) && is_string($rawResponse['id'])
                ? $rawResponse['id']
                : null;

            if (!$generationResult->success) {
                throw new RuntimeException($generationResult->error ?: 'AI generation failed.');
            }

            $normalizedResult = $aiService->normalizeAutofillResponse(
                Json::encode($generationResult->suggestions),
                $fieldId,
                $entryId,
                $siteId
            );

            if (!$normalizedResult->success) {
                throw new RuntimeException($normalizedResult->error ?: 'Could not normalize generated suggestions.');
            }

            $appliedCount = 0;
            $suggestionErrors = [];
            foreach ($normalizedResult->suggestions as $suggestion) {
                if (!is_array($suggestion)) {
                    continue;
                }

                if (!empty($suggestion['validationErrors'])) {
                    $suggestionErrors[] = ($suggestion['displayFieldName'] ?? $suggestion['fieldName'] ?? 'Field') . ': ' . implode(' ', $suggestion['validationErrors']);
                    continue;
                }
                try {
                    $plugin->getEntrySuggestionApplyService()->applySuggestion($fieldId, $entryId, $siteId, $suggestion);
                    $appliedCount++;
                } catch (Throwable $exception) {
                    $suggestionErrors[] = ($suggestion['displayFieldName'] ?? $suggestion['fieldName'] ?? 'Field') . ': ' . $exception->getMessage();
                }
            }

            $plugin->getAiRequestLogService()->complete($logId, [
                'responseRawText' => $responseRawText,
                'responsePayloadJson' => $this->encodeJson(['providerResponse' => $rawResponse, 'suggestions' => $normalizedResult->suggestions]),
                'success' => $suggestionErrors === [],
                'errorMessage' => $suggestionErrors ? implode(' ', $suggestionErrors) : null,
                'latencyMs' => (int)round((microtime(true) - $startedAt) * 1000),
                'inputTokens' => $usage['inputTokens'],
                'outputTokens' => $usage['outputTokens'],
                'totalTokens' => $usage['totalTokens'],
                'providerResponseId' => $providerResponseId,
            ]);

            return [
                'entryId' => $entryId,
                'success' => $suggestionErrors === [],
                'suggestionsApplied' => $appliedCount,
                'error' => $suggestionErrors ? implode(' ', $suggestionErrors) : null,
            ];
        } catch (Throwable $exception) {
            $plugin->getAiRequestLogService()->complete($logId, [
                'fieldId' => $fieldId,
                'entryId' => $entryId,
                'siteId' => $siteId,
                'provider' => $modelConfig->provider,
                'modelConfigUid' => $modelConfig->uid !== '' ? $modelConfig->uid : null,
                'modelId' => $modelConfig->modelId !== '' ? $modelConfig->modelId : null,
                'reasoningEffort' => $modelConfig->reasoningEffort,
                'success' => false,
                'errorMessage' => $exception->getMessage(),
                'latencyMs' => (int)round((microtime(true) - $startedAt) * 1000),
            ]);

            Craft::error(sprintf(
                'Bulk Autofill failed for field %d and entry %d: %s',
                $fieldId,
                $entryId,
                $exception->getMessage()
            ), __METHOD__);

            return [
                'entryId' => $entryId,
                'success' => false,
                'suggestionsApplied' => 0,
                'error' => $exception->getMessage(),
            ];
        }
    }

    private function encodeJson(mixed $value): ?string
    {
        try {
            return Json::encode($value, JSON_UNESCAPED_SLASHES);
        } catch (Throwable) {
            return null;
        }
    }

    private function extractResponseRawText(array $rawResponse): ?string
    {
        if (isset($rawResponse['output_text']) && is_string($rawResponse['output_text'])) {
            return $rawResponse['output_text'];
        }

        $output = $rawResponse['output'] ?? null;
        if (!is_array($output)) {
            return null;
        }

        foreach ($output as $item) {
            if (!is_array($item)) {
                continue;
            }

            $content = $item['content'] ?? null;
            if (!is_array($content)) {
                continue;
            }

            foreach ($content as $contentItem) {
                if (!is_array($contentItem)) {
                    continue;
                }

                $text = $contentItem['text'] ?? null;
                if (is_string($text) && $text !== '') {
                    return $text;
                }
            }
        }

        return null;
    }

    /**
     * @return array{inputTokens:?int,outputTokens:?int,totalTokens:?int}
     */
    private function extractTokenUsage(array $rawResponse): array
    {
        $usage = is_array($rawResponse['usage'] ?? null) ? $rawResponse['usage'] : [];
        $inputTokens = $this->toIntOrNull($usage['input_tokens'] ?? $usage['prompt_tokens'] ?? null);
        $outputTokens = $this->toIntOrNull($usage['output_tokens'] ?? $usage['completion_tokens'] ?? null);
        $totalTokens = $this->toIntOrNull($usage['total_tokens'] ?? null);

        if ($totalTokens === null && $inputTokens !== null && $outputTokens !== null) {
            $totalTokens = $inputTokens + $outputTokens;
        }

        return [
            'inputTokens' => $inputTokens,
            'outputTokens' => $outputTokens,
            'totalTokens' => $totalTokens,
        ];
    }

    private function toIntOrNull(mixed $value): ?int
    {
        if (!is_numeric($value)) {
            return null;
        }

        return (int)$value;
    }

    private function currentUserId(): ?int
    {
        if (Craft::$app->getRequest()->getIsConsoleRequest()) {
            return null;
        }

        $userId = Craft::$app->getUser()->getId();
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
