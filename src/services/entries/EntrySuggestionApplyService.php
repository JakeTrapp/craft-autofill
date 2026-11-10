<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\entries;

use Craft;
use craft\base\Component;
use craft\elements\Entry;
use DateTime;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\fields\AutofillField;
use RuntimeException;

class EntrySuggestionApplyService extends Component
{
    /**
     * @param array<string, mixed> $suggestion
     * @return array<string, mixed>
     */
    public function applySuggestion(int $fieldId, int $entryId, ?int $siteId, array $suggestion): array
    {
        if ($entryId <= 0) {
            throw new RuntimeException('Entry ID is required to apply suggestions.');
        }

        $autofillField = Craft::$app->getFields()->getFieldById($fieldId);
        if (!$autofillField instanceof AutofillField) {
            throw new RuntimeException(sprintf('Autofill field %d could not be found.', $fieldId));
        }

        $entry = Craft::$app->getElements()->getElementById($entryId, Entry::class, $siteId);
        if (!$entry instanceof Entry) {
            throw new RuntimeException(sprintf('Entry %d could not be found.', $entryId));
        }

        AutofillPlugin::getInstance()->getWorkflowRuntimeService()->assertCanSave($entry);

        if ($autofillField->workflowHandle !== '') {
            $workflow = AutofillPlugin::getInstance()->getWorkflowService()->resolveForField($autofillField);
            if ($workflow === null) {
                throw new RuntimeException('This Autofill workflow is unavailable.');
            }
            $runtime = AutofillPlugin::getInstance()->getWorkflowRuntimeService();
            $runtime->assertScope($workflow, $entry);
            return $runtime->apply(AutofillPlugin::getInstance()->getWorkflowService()->asField($workflow), $entry, $suggestion);
        }

        $targetFieldUid = trim((string)($suggestion['targetFieldUid'] ?? ''));
        $matchedHandle = trim((string)($suggestion['matchedHandle'] ?? ''));
        $rawValue = $suggestion['value'] ?? null;

        if ($targetFieldUid === '' && $matchedHandle === '') {
            throw new RuntimeException('Suggestion is missing target field information.');
        }

        $appliedValue = $rawValue;
        $targetHandle = '';

        if (str_starts_with($targetFieldUid, '__native__:')) {
            $appliedValue = \jtdev\craftautofill\services\ai\SuggestionValueGuard::checked($autofillField, $entry, $targetFieldUid, $suggestion);
            $this->applyNativeFieldValue($entry, $targetFieldUid, $appliedValue);
        } else {
            $field = $targetFieldUid !== ''
                ? AutofillPlugin::getInstance()
                    ->getEntryTypeFieldResolverService()
                    ->resolveForAutofillField($autofillField, $targetFieldUid)
                : null;
            if ($field === null) {
                throw new RuntimeException(sprintf('Field UID "%s" could not be found.', $targetFieldUid));
            }

            $layoutElement = null;
            $layout = $entry->getFieldLayout();
            $isConsole = Craft::$app->getRequest()->getIsConsoleRequest();
            $fields = $isConsole ? $layout?->getCustomFields() : $layout?->getVisibleCustomFields($entry);
            foreach ($fields ?? [] as $layoutField) {
                if (($layoutField->layoutElement->uid ?? $layoutField->uid) === $targetFieldUid) {
                    $layoutElement = $layoutField->layoutElement;
                    break;
                }
            }
            if ($layoutElement === null) {
                throw new RuntimeException('The output field is not part of this content layout.');
            }
            if (!$isConsole && method_exists($layoutElement, 'editable') && !$layoutElement->editable($entry)) {
                throw new RuntimeException('You cannot edit this output field.');
            }

            $adapter = AutofillPlugin::getInstance()->getFieldAdapterService()->getAdapterForField($field);
            if ($adapter === null) {
                throw new RuntimeException(sprintf('No adapter available for field UID "%s".', $targetFieldUid));
            }

            $rawValue = \jtdev\craftautofill\services\ai\SuggestionValueGuard::checked($autofillField, $entry, $targetFieldUid, $suggestion);
            $targetHandle = (string)($field->handle ?? '');
            $appliedValue = $adapter->applySuggestionToEntry($field, $entry, $rawValue);
        }

        if (!Craft::$app->getElements()->saveElement($entry, false, false, false)) {
            $errors = $entry->getErrorSummary(true);
            Craft::error(sprintf(
                'Autofill entry suggestion save failed for entry %d and target "%s": %s',
                $entryId,
                $targetFieldUid,
                $errors !== [] ? implode(' ', $errors) : 'Entry save failed while applying suggestion.'
            ), __METHOD__);

            throw new RuntimeException($errors !== []
                ? implode(' ', $errors)
                : 'Entry save failed while applying suggestion.');
        }

        return [
            'entryId' => (int)$entry->id,
            'targetFieldUid' => $targetFieldUid,
            'matchedHandle' => $matchedHandle,
            'savedValue' => $appliedValue,
        ];
    }

    private function applyNativeFieldValue(Entry $entry, string $targetFieldUid, mixed $value): void
    {
        switch ($targetFieldUid) {
            case '__native__:title':
                $entry->title = trim((string)$value);
                return;

            case '__native__:slug':
                $entry->slug = trim((string)$value);
                return;

            case '__native__:enabled':
                $entry->enabled = $this->asBool($value);
                return;

            case '__native__:postDate':
                $entry->postDate = $this->toDateTimeOrNull($value);
                return;

            case '__native__:expiryDate':
                $entry->expiryDate = $this->toDateTimeOrNull($value);
                return;

            default:
                throw new RuntimeException(sprintf('Unsupported native field UID "%s".', $targetFieldUid));
        }
    }

    private function asBool(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        if (is_numeric($value)) {
            return (float)$value !== 0.0;
        }

        $normalized = strtolower(trim((string)$value));
        return in_array($normalized, ['1', 'true', 'on', 'yes'], true);
    }

    private function toDateTimeOrNull(mixed $value): ?DateTime
    {
        $raw = trim((string)$value);
        if ($raw === '') {
            return null;
        }

        try {
            return new DateTime($raw);
        } catch (\Throwable) {
            throw new RuntimeException(sprintf('Invalid date value "%s".', $raw));
        }
    }
}
