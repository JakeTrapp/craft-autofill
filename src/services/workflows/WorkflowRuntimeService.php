<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\workflows;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\elements\Asset;
use craft\elements\Entry;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\fields\AutofillField;
use jtdev\craftautofill\models\Workflow;
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

    public function preview(AutofillField $definition, ElementInterface $element, string $userPrompt): string
    {
        return AutofillPlugin::getInstance()->getAiService()->promptBuilder->buildForElementPrompt($userPrompt, $definition, $element);
    }

    public function generate(AutofillField $definition, ElementInterface $element, string $userPrompt): array
    {
        $plugin = AutofillPlugin::getInstance();
        $model = $this->modelForDefinition($definition);
        $prompt = $this->preview($definition, $element, $userPrompt);
        $inputs = (new AssetInputService())->collect($definition, $element);
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
        $started = microtime(true);
        $logId = $plugin->getAiRequestLogService()->begin([
            'fieldId' => $sourceFieldId,
            'entryId' => $element instanceof Entry ? (int)$element->id : null,
            'siteId' => $element->siteId,
            'userId' => Craft::$app->getRequest()->getIsConsoleRequest() ? null : Craft::$app->getUser()->getId(),
            'provider' => $model->provider,
            'modelConfigUid' => $model->uid,
            'modelId' => $model->modelId,
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
            $suggestions = $this->normalize($text, $definition, $element);
            $plugin->getAiRequestLogService()->complete($logId, [
                'success' => !array_filter($suggestions, static fn(array $item): bool => $item['validationErrors'] !== []),
                'errorMessage' => array_filter($suggestions, static fn(array $item): bool => $item['validationErrors'] !== []) ? 'One or more suggestions need correction. Valid suggestions remain usable.' : null,
                'responsePayloadJson' => json_encode(['suggestions' => $suggestions], JSON_THROW_ON_ERROR),
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

    public function modelForDefinition(AutofillField $definition): \jtdev\craftautofill\models\ai\AiModelConfig
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

    public function normalize(string $raw, AutofillField $definition, ElementInterface $element): array
    {
        $result = AutofillPlugin::getInstance()->getAiService()->responseNormalizer->normalizeForElement($raw, $definition, $element);
        if (!$result->success) {
            throw new RuntimeException($result->error ?? 'The response could not be read.');
        }
        return $result->suggestions;
    }

    public function apply(AutofillField $definition, ElementInterface $element, array $suggestion): array
    {
        $this->assertCanSave($element);
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
            $allowed = $element instanceof Asset ? ['title', 'alt'] : ['title', 'slug', 'enabled', 'postDate', 'expiryDate'];
            if (!in_array($handle, $allowed, true)) {
                throw new RuntimeException('This native property cannot be changed by this workflow.');
            }
            $current = $element->getAttributes([$handle])[$handle] ?? null;
            if (!($row['overrideCurrentValue'] ?? true) && $current !== null && $current !== '') {
                throw new RuntimeException('This workflow preserves the existing field value.');
            }
            if (in_array($handle, ['postDate', 'expiryDate'], true)) {
                $value = $value === null || $value === '' ? null : \craft\helpers\DateTimeHelper::toDateTime($value);
                if ($value === false) {
                    throw new RuntimeException('The suggestion is not a valid date.');
                }
            } elseif ($handle === 'enabled') {
                $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
            } else {
                if (!is_scalar($value) && $value !== null) {
                    throw new RuntimeException('The suggestion must be text.');
                }
                $value = $value === null ? null : trim((string)$value);
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
