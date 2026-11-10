<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\entries;

use Craft;
use craft\base\Component;
use craft\elements\Entry;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\fields\AutofillField;
use RuntimeException;

/**
 * Legacy (v1) field-ID based apply entry point.
 *
 * Every suggestion goes through WorkflowRuntimeService::apply(), so this path enforces the same review permission,
 * "preserve existing value" setting, value guard and field validation as workflow runs.
 *
 * @deprecated in 2.1. Will be removed in 3.0; apply results through workflow runs instead.
 */
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

        $plugin = AutofillPlugin::getInstance();
        $runtime = $plugin->getWorkflowRuntimeService();
        $runtime->assertCanSave($entry);

        if ($autofillField->workflowHandle !== '') {
            $workflow = $plugin->getWorkflowService()->resolveForField($autofillField);
            if ($workflow === null) {
                throw new RuntimeException('This Autofill workflow is unavailable.');
            }
            $runtime->assertScope($workflow, $entry);
            $definition = $plugin->getWorkflowService()->asField($workflow);
        } else {
            // Unmigrated inline configuration: the field itself is the definition.
            if ($autofillField->entryTypeUid !== (string)$entry->getType()->uid) {
                throw new RuntimeException('This workflow does not support this entry type.');
            }
            if ($entry->getIsRevision()) {
                throw new RuntimeException('Revisions cannot be changed by Autofill.');
            }
            $definition = $autofillField;
        }

        $applied = $runtime->apply($definition, $entry, $suggestion);
        return $applied + ['matchedHandle' => trim((string)($suggestion['matchedHandle'] ?? ''))];
    }
}
