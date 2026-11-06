<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\workflows;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\base\FieldInterface;
use craft\elements\Asset;
use craft\elements\Entry;
use craft\elements\User;
use craft\fields\Addresses;
use craft\helpers\DateTimeHelper;
use craft\helpers\Json;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\fields\AutofillField;
use jtdev\craftautofill\models\Workflow;
use jtdev\craftautofill\models\ai\AiGenerationRequest;
use jtdev\craftautofill\models\ai\AiGenerationResult;
use jtdev\craftautofill\models\ai\AiModelConfig;
use jtdev\craftautofill\services\ai\AutofillFieldConfigBuilder;
use jtdev\craftautofill\services\assets\AssetInputService;
use RuntimeException;
use Throwable;

/** The same scope, prompt and application rules serve every editor launcher. */
class WorkflowRuntimeService extends Component
{
    public function resolve(string $handle, int $elementId, ?int $siteId = null): array
    {
        $workflow = AutofillPlugin::getInstance()->getWorkflowService()->getByHandle($handle);
        if ($workflow === null) {
            throw new RuntimeException('This Autofill workflow is unavailable.');
        }
        $element = Craft::$app->getElements()->getElementById($elementId, null, $siteId);
        if (!$element instanceof Entry && !$element instanceof Asset) {
            throw new RuntimeException('Save the entry or asset before using Autofill.');
        }
        $this->assertScope($workflow, $element);
        $this->assertCanSave($element);
        $actor = Craft::$app->getUser()->getIdentity();
        if ($actor !== null) AutofillPlugin::getInstance()->getWorkflowAccess()->assertCanRun($workflow, $element, $actor);
        elseif (!Craft::$app->getRequest()->getIsConsoleRequest()) throw new RuntimeException('Sign in to run workflows.');
        return [$workflow, AutofillPlugin::getInstance()->getWorkflowService()->asField($workflow), $element];
    }

    /** Authorize legacy field-based endpoints before reading any content. */
    public function authorizeField(int $fieldId, ?int $elementId, ?int $siteId): void
    {
        $field = Craft::$app->getFields()->getFieldById($fieldId);
        if (!$field instanceof AutofillField) {
            throw new RuntimeException('The Autofill field is unavailable.');
        }
        if (!$elementId) {
            if (!Craft::$app->getRequest()->getIsConsoleRequest() && !Craft::$app->getUser()->getIsAdmin()) {
                throw new RuntimeException('You do not have permission to preview this workflow.');
            }
            return;
        }
        $element = Craft::$app->getElements()->getElementById($elementId, Entry::class, $siteId);
        if (!$element instanceof Entry) {
            throw new RuntimeException('The selected entry is unavailable.');
        }
        $this->assertCanSave($element);
        if ($field->workflowHandle !== '') {
            $workflow = AutofillPlugin::getInstance()->getWorkflowService()->getByHandle($field->workflowHandle);
            if ($workflow === null) { throw new RuntimeException('This workflow is unavailable.'); }
            $this->assertScope($workflow, $element);
            $actor = Craft::$app->getUser()->getIdentity();
            if ($actor !== null) {
                AutofillPlugin::getInstance()->getWorkflowAccess()->assertCanRun($workflow, $element, $actor);
                $this->definitionForActor(AutofillPlugin::getInstance()->getWorkflowService()->asField($workflow), $element, $actor);
            }
        } elseif ($field->entryTypeUid !== (string)$element->getType()->uid) {
            throw new RuntimeException('This workflow does not support this entry type.');
        }
    }

    public function assertScope(Workflow $workflow, ElementInterface $element): void
    {
        $matches = $workflow->scope === 'entry'
            ? $element instanceof Entry && (string)$element->getType()->uid === $workflow->entryTypeUid
            : $element instanceof Asset && (string)$element->getVolume()->uid === $workflow->volumeUid;
        if (!$matches) {
            throw new RuntimeException('This workflow does not support this entry type or asset volume.');
        }
        if ($element->getIsRevision()) {
            throw new RuntimeException('Revisions cannot be changed by Autofill.');
        }
    }

    public function assertCanSave(ElementInterface $element): void
    {
        if (Craft::$app->getRequest()->getIsConsoleRequest()) {
            return;
        }
        $user = Craft::$app->getUser()->getIdentity();
        if ($user === null || !Craft::$app->getElements()->canSave($element, $user)) {
            throw new RuntimeException('You do not have permission to change this content.');
        }
    }

    public function preview(AutofillField $definition, ElementInterface $element, string $userPrompt, ?User $actor = null): string
    {
        $actor ??= Craft::$app->getUser()->getIdentity();
        if ($actor !== null) $definition = $this->definitionForActor($definition, $element, $actor);
        return $this->withActor($actor, fn(): string => AutofillPlugin::getInstance()->getAiService()->promptBuilder->buildForElementPrompt($userPrompt, $definition, $element));
    }

    public function generate(
        AutofillField $definition,
        ElementInterface $element,
        string $userPrompt,
        ?User $actor = null,
        ?callable $beforeRepair = null,
    ): array {
        return $this->withActor($actor, fn(): array => $this->generateForActor($definition, $element, $userPrompt, $actor, $beforeRepair));
    }

    private function generateForActor(
        AutofillField $definition,
        ElementInterface $element,
        string $userPrompt,
        ?User $actor,
        ?callable $beforeRepair,
    ): array {
        $plugin = AutofillPlugin::getInstance();
        $model = $this->modelForDefinition($definition);
        if ($actor !== null) $definition = $this->definitionForActor($definition, $element, $actor);
        $prompt = $this->preview($definition, $element, $userPrompt, $actor);
        $inputs = (new AssetInputService())->collect($definition, $element, true, $actor);
        $request = $plugin->getAiService()->promptBuilder->buildGenerationRequest('', $prompt, $model, [
            'workflowHandle' => $definition->workflowHandle,
            'elementId' => (int)$element->id,
            'elementType' => $element instanceof Asset ? 'asset' : 'entry',
        ]);
        $sourceFieldId = null;
        foreach (Craft::$app->getFields()->getAllFields() as $sourceField) {
            if ($sourceField instanceof AutofillField && $sourceField->workflowHandle === $definition->workflowHandle) {
                $sourceFieldId = (int)$sourceField->id;
                break;
            }
        }
        $request->fileInputs = $inputs['files'];
        $logContext = [
            'fieldId' => $sourceFieldId,
            'entryId' => $element instanceof Entry ? (int)$element->id : null,
            'siteId' => $element->siteId,
            'userId' => $actor?->id ?? (Craft::$app->getRequest()->getIsConsoleRequest() ? null : Craft::$app->getUser()->getId()),
            'provider' => $model->provider,
            'modelConfigUid' => $model->uid,
            'modelId' => $model->modelId,
        ];
        $suggestions = $this->generateLogged($request, $model, $prompt, $logContext, $definition, $element);

        $targetCounts = array_count_values(array_column($suggestions, 'targetFieldUid'));
        $failed = [];
        foreach ($suggestions as $index => $suggestion) {
            $uid = $suggestion['targetFieldUid'];
            if ($uid === '' || $targetCounts[$uid] !== 1 || $suggestion['validationErrors'] === []) {
                continue;
            }
            $failed[$uid] = $index;
        }
        if ($failed === []) {
            return $suggestions;
        }

        if ($beforeRepair !== null) {
            $beforeRepair($suggestions);
        }

        try {
            $feedback = [];
            foreach ($failed as $uid => $index) {
                $suggestion = $suggestions[$index];
                $feedback[] = [
                    'fieldName' => $uid,
                    'fieldLabel' => $suggestion['displayFieldName'],
                    'rejectedValue' => $suggestion['rawValue'],
                    'normalizedValue' => $suggestion['value'],
                    'validationErrors' => $suggestion['validationErrors'],
                ];
            }
            $repairPrompt = "Correct only the failed suggestions listed below using the same source context and the corresponding field contracts above. "
                . "Return the same JSON format with at most one suggestion per listed field. Use the supplied fieldName exactly. Omit a field if you cannot produce a valid value.\n"
                . Json::encode($feedback);
            $repairRequest = clone $request;
            $repairRequest->messages[array_key_last($repairRequest->messages)]['content'] .= "\n\n" . $repairPrompt;
            $repairRequest->context['validationRepair'] = array_keys($failed);

            $repairs = $this->generateLogged($repairRequest, $model, $prompt . "\n\n" . $repairPrompt, $logContext, $definition, $element);
            $repairCounts = array_count_values(array_column($repairs, 'targetFieldUid'));
            foreach ($repairs as $repair) {
                $uid = $repair['targetFieldUid'];
                if (isset($failed[$uid]) && $repairCounts[$uid] === 1 && $repair['validationErrors'] === []) {
                    $suggestions[$failed[$uid]] = $repair;
                }
            }
        } catch (Throwable) {
            Craft::warning('Autofill could not repair invalid suggestions. The original suggestions were kept.', __METHOD__);
        }
        return $suggestions;
    }

    private function generateLogged(
        AiGenerationRequest $request,
        AiModelConfig $model,
        string $prompt,
        array $logContext,
        AutofillField $definition,
        ElementInterface $element,
    ): array {
        $plugin = AutofillPlugin::getInstance();
        $started = microtime(true);
        $logId = $plugin->getAiRequestLogService()->begin([
            ...$logContext,
            'requestPrompt' => $prompt,
            'requestPayloadJson' => json_encode($request->safeLogPayload(), JSON_THROW_ON_ERROR),
        ]);
        try {
            $response = $plugin->getAiService()->generateFromRequestDetailed($request, $model);
            $result = $response['result'];
            $raw = $response['rawResponse'];
            $text = (string)($raw['output_text'] ?? json_encode($result->suggestions, JSON_THROW_ON_ERROR));
            if (!$result->success) {
                throw new RuntimeException($result->error ?? 'AI response was invalid.');
            }
            $normalized = $this->normalizeResult($text, $definition, $element, fromModel: true);
            $suggestions = $normalized->suggestions;
            $responsePayload = ['suggestions' => $suggestions];
            if ($normalized->droppedRelatedTitles !== []) {
                $responsePayload['droppedRelatedTitles'] = $normalized->droppedRelatedTitles;
            }
            $hasInvalid = (bool)array_filter($suggestions, static fn(array $item): bool => $item['validationErrors'] !== []);
            $plugin->getAiRequestLogService()->complete($logId, [
                'success' => !$hasInvalid,
                'errorMessage' => $hasInvalid ? 'One or more suggestions need correction. Valid suggestions remain usable.' : null,
                'responsePayloadJson' => json_encode($responsePayload, JSON_THROW_ON_ERROR),
                'responseRawText' => $text,
                'latencyMs' => (int)((microtime(true) - $started) * 1000),
                'inputTokens' => $raw['usage']['input_tokens'] ?? null,
                'outputTokens' => $raw['usage']['output_tokens'] ?? null,
                'totalTokens' => $raw['usage']['total_tokens'] ?? null,
                'providerResponseId' => $raw['id'] ?? null,
            ]);
            return $suggestions;
        } catch (Throwable $e) {
            $plugin->getAiRequestLogService()->complete($logId, [
                'success' => false, 'errorMessage' => $e->getMessage(),
                'responseRawText' => $text ?? null,
                'latencyMs' => (int)((microtime(true) - $started) * 1000),
            ]);
            throw $e;
        }
    }

    public function modelForDefinition(AutofillField $definition): AiModelConfig
    {
        foreach (AutofillPlugin::getInstance()->getSettings()->modelConfigs as $row) {
            if (!($row['enabled'] ?? false)) {
                continue;
            }
            if ($definition->modelConfigUid !== '' && ($row['uid'] ?? '') !== $definition->modelConfigUid) {
                continue;
            }
            return AutofillPlugin::getInstance()->getAiService()->createModelConfig($row);
        }
        throw new RuntimeException('The selected AI model configuration is missing or disabled.');
    }

    private function withActor(?User $actor, callable $operation): mixed
    {
        $session = Craft::$app->getUser();
        $previous = $session->getIdentity();
        if ($actor === null || $actor === $previous) return $operation();
        $session->setIdentity($actor);
        try { return $operation(); }
        finally { $session->setIdentity($previous); }
    }

    private function definitionForActor(AutofillField $definition, ElementInterface $element, User $actor): AutofillField
    {
        $workflow = new Workflow([
            'scope' => $definition->scope, 'entryTypeUid' => $definition->entryTypeUid, 'volumeUid' => $definition->volumeUid,
            'rows' => $definition->rows, 'contextRows' => $definition->contextRows,
        ]);
        $allowed = AutofillPlugin::getInstance()->getWorkflowRunService()->definitionForActor($workflow, $element, $actor);
        $definition = clone $definition;
        $definition->rows = $allowed->rows;
        $definition->contextRows = $allowed->contextRows;
        return $definition;
    }

    public function normalize(string $raw, AutofillField $definition, ElementInterface $element): array
    {
        return $this->normalizeResult($raw, $definition, $element)->suggestions;
    }

    private function normalizeResult(
        string $raw,
        AutofillField $definition,
        ElementInterface $element,
        bool $fromModel = false,
    ): AiGenerationResult
    {
        $actor = Craft::$app->getUser()->getIdentity();
        if ($actor !== null) $definition = $this->definitionForActor($definition, $element, $actor);
        $result = AutofillPlugin::getInstance()->getAiService()->responseNormalizer->normalizeForElement($raw, $definition, $element, $fromModel);
        if (!$result->success) {
            throw new RuntimeException($result->error ?? 'The response could not be read.');
        }
        return $result;
    }

    public function normalizePreview(string $raw, AutofillField $definition, ElementInterface $element): array
    {
        $suggestions = $this->normalize($raw, $definition, $element);
        foreach ($suggestions as &$suggestion) {
            if ($this->matchesSavedValue($element, $suggestion)) $suggestion['state'] = 'unchanged';
        }
        unset($suggestion);
        return $suggestions;
    }

    public function apply(AutofillField $definition, ElementInterface $element, array $suggestion, ?User $actor = null): array
    {
        return $this->withActor($actor, fn(): array => $this->applyForActor($definition, $element, $suggestion, $actor));
    }

    public function matchesSavedValue(ElementInterface $element, array $suggestion, ?User $actor = null): bool
    {
        if (!empty($suggestion['validationErrors']) || !array_key_exists('value', $suggestion)) {
            return false;
        }

        $uid = (string)($suggestion['targetFieldUid'] ?? '');
        try {
            if (str_starts_with($uid, '__native__:')) {
                $handle = substr($uid, strlen('__native__:'));
                $proposed = $this->nativeValueForSuggestion($element, $handle, $suggestion['value']);
                $current = $element->getAttributes([$handle])[$handle] ?? null;
                if ($proposed instanceof \DateTimeInterface && $current instanceof \DateTimeInterface) {
                    return $proposed->getTimestamp() === $current->getTimestamp();
                }
                return $proposed === $current;
            }

            foreach ($element->getFieldLayout()?->getCustomFields() ?? [] as $field) {
                if ((string)($field->layoutElement->uid ?? $field->uid) === $uid) {
                    return $this->withActor($actor, fn(): bool => $this->matchesCustomField($element, $field, $suggestion['value']));
                }
            }
        } catch (Throwable) {
            // An uncertain comparison must leave the suggestion available for review.
        }
        return false;
    }

    private function matchesCustomField(ElementInterface $element, FieldInterface $field, mixed $value): bool
    {
        $adapter = AutofillPlugin::getInstance()->getFieldAdapterService()->getAdapterForField($field);
        if ($adapter === null) return false;

        $current = $element->getFieldValue($field->handle);
        $before = $field->serializeValue($current, $element);
        // Adapters prepare an assignment in memory. Use an isolated element so
        // the comparison takes the same path as apply without saving content.
        $candidate = clone $element;
        $candidate->setFieldValue($field->handle, $current);
        $assignment = $adapter->applySuggestionToEntry($field, $candidate, $value);
        if ($field instanceof Addresses) {
            // Normalizing address edits on a draft can create nested drafts.
            // Only compare patches that retain the same existing IDs and order.
            if (!is_array($before) || !is_array($assignment) || array_keys($before) !== array_keys($assignment)) return false;
            foreach ($assignment as $id => $patch) {
                if (!is_int($id)) return false;
                foreach ($patch as $key => $item) {
                    if (($before[$id][$key] ?? null) !== $item) return false;
                }
            }
            return true;
        }
        $after = $field->serializeValue($candidate->getFieldValue($field->handle), $candidate);

        return $this->comparableValue($before) === $this->comparableValue($after);
    }

    private function comparableValue(mixed $value): string
    {
        return Json::encode($this->sortObjectKeys(Json::decode(Json::encode($value), false)));
    }

    private function sortObjectKeys(mixed $value): mixed
    {
        if ($value instanceof \stdClass) {
            $properties = get_object_vars($value);
            ksort($properties, SORT_STRING);
            return (object)array_map($this->sortObjectKeys(...), $properties);
        }
        return is_array($value) ? array_map($this->sortObjectKeys(...), $value) : $value;
    }

    private function nativeValueForSuggestion(ElementInterface $element, string $handle, mixed $value): mixed
    {
        $allowed = $element instanceof Asset ? ['title', 'alt'] : ['title', 'slug', 'enabled', 'postDate', 'expiryDate'];
        if (!in_array($handle, $allowed, true)) {
            throw new RuntimeException('This native property cannot be changed by this workflow.');
        }
        if (in_array($handle, ['postDate', 'expiryDate'], true)) {
            $date = $value === null || $value === '' ? null : DateTimeHelper::toDateTime($value);
            if ($date === false) throw new RuntimeException('The suggestion is not a valid date.');
            return $date;
        }
        if ($handle === 'enabled') return filter_var($value, FILTER_VALIDATE_BOOLEAN);
        if (!is_scalar($value) && $value !== null) throw new RuntimeException('The suggestion must be text.');
        return $value === null ? null : trim((string)$value);
    }

    private function applyForActor(AutofillField $definition, ElementInterface $element, array $suggestion, ?User $actor = null): array
    {
        if ($actor !== null) {
            if (!Craft::$app->getElements()->canView($element, $actor) || !Craft::$app->getElements()->canSave($element, $actor)) {
                throw new RuntimeException('You do not have permission to change this content.');
            }
            $workflow = new Workflow(['scope' => $definition->scope, 'entryTypeUid' => $definition->entryTypeUid, 'volumeUid' => $definition->volumeUid]);
            if (!AutofillPlugin::getInstance()->getWorkflowAccess()->canUseField($workflow, (string)($suggestion['targetFieldUid'] ?? ''), $actor, $element, true)) {
                throw new RuntimeException('You cannot edit this output field.');
            }
        } else {
            $this->assertCanSave($element);
            $actor = Craft::$app->getUser()->getIdentity();
            if ($actor !== null) {
                $access = AutofillPlugin::getInstance()->getWorkflowAccess();
                if (!$access->can($actor, 'review')) throw new RuntimeException('You do not have permission to apply suggestions.');
                $workflow = AutofillPlugin::getInstance()->getWorkflowService()->getByHandle($definition->workflowHandle);
                if ($workflow !== null && !$access->canView($workflow, $actor)) throw new RuntimeException('This workflow is unavailable.');
                if (!$access->canUseField($workflow ?? new Workflow(['scope' => $definition->scope, 'entryTypeUid' => $definition->entryTypeUid, 'volumeUid' => $definition->volumeUid]), (string)($suggestion['targetFieldUid'] ?? ''), $actor, $element, true)) throw new RuntimeException('You cannot edit this output field.');
            }
        }
        if (!$element instanceof Entry && !$element instanceof Asset) {
            throw new RuntimeException('Unsupported content type.');
        }
        $uid = (string)($suggestion['targetFieldUid'] ?? '');
        $row = null;
        foreach ($definition->rows as $candidate) {
            if (($candidate['targetFieldUid'] ?? '') === $uid && ($candidate['enabled'] ?? true)) {
                $row = $candidate;
                break;
            }
        }
        if ($row === null || !array_key_exists('value', $suggestion)) {
            throw new RuntimeException('The suggestion must have a value and target a configured output field.');
        }
        $value = \jtdev\craftautofill\services\ai\SuggestionValueGuard::checked($definition, $element, $uid, $suggestion);
        if (str_starts_with($uid, '__native__:')) {
            $handle = substr($uid, strlen('__native__:'));
            $value = $this->nativeValueForSuggestion($element, $handle, $value);
            $current = $element->getAttributes([$handle])[$handle] ?? null;
            if (!($row['overrideCurrentValue'] ?? true) && $current !== null && $current !== '') {
                throw new RuntimeException('This workflow preserves the existing field value.');
            }
            $element->setAttributes([$handle => $value], false);
        } else {
            $field = AutofillPlugin::getInstance()->getEntryTypeFieldResolverService()->resolveForAutofillField($definition, $uid);
            if ($field === null) {
                throw new RuntimeException('The configured output field is no longer available.');
            }
            $isInLayout = false;
            foreach ($element->getFieldLayout()?->getCustomFields() ?? [] as $layoutField) {
                if (($layoutField->layoutElement->uid ?? $layoutField->uid) === $uid) { $isInLayout = true; }
            }
            if (!$isInLayout) {
                throw new RuntimeException('The output field is not part of this content layout.');
            }
            $layoutElement = $field->layoutElement;
            if (!Craft::$app->getRequest()->getIsConsoleRequest() && $layoutElement !== null &&
                (!$layoutElement->showInForm($element) || (method_exists($layoutElement, 'editable') && !$layoutElement->editable($element)))) {
                throw new RuntimeException('You cannot edit this output field.');
            }
            $handle = $field->handle;
            $current = $element->getFieldValue($handle);
            if (!($row['overrideCurrentValue'] ?? true) && !$field->isValueEmpty($current, $element)) {
                throw new RuntimeException('This workflow preserves the existing field value.');
            }
            $adapter = AutofillPlugin::getInstance()->getFieldAdapterService()->getAdapterForField($field);
            if ($adapter === null) {
                throw new RuntimeException('The configured field type is unsupported.');
            }
            $value = $adapter->applySuggestionToEntry($field, $element, $value);
        }
        if (!Craft::$app->getElements()->saveElement($element, false, false, false)) {
            throw new RuntimeException(implode(' ', $element->getErrorSummary(true)) ?: 'The suggestion could not be saved.');
        }
        return ['elementId' => (int)$element->id, 'targetFieldUid' => $uid, 'savedValue' => $value];
    }
}
