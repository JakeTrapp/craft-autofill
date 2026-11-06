<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\workflows;

use Craft;
use craft\base\Component;
use craft\elements\User;
use jtdev\craftautofill\records\WorkflowRunRecord;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\fields\AutofillField;
use jtdev\craftautofill\models\Workflow;
use jtdev\craftautofill\records\WorkflowRecord;
use RuntimeException;
use Throwable;

class WorkflowService extends Component
{
    public function getByHandle(string $handle): ?Workflow
    {
        $handle = trim($handle);
        if ($handle === '' || !Craft::$app->getDb()->tableExists(WorkflowRecord::tableName())) {
            return null;
        }

        $record = WorkflowRecord::find()->where(['handle' => $handle])->one();
        return $record instanceof WorkflowRecord ? $this->modelFromRecord($record) : null;
    }

    public function getAll(): array
    {
        if (!Craft::$app->getDb()->tableExists(WorkflowRecord::tableName())) { return []; }
        $records = WorkflowRecord::find()->orderBy(['name' => SORT_ASC, 'id' => SORT_ASC])->all();
        return array_map(fn(WorkflowRecord $record): Workflow => $this->modelFromRecord($record), $records);
    }

    public function saveWorkflow(Workflow $workflow, bool $allowLiteOverLimit = false, ?User $actor = null): bool
    {
        $previous = $workflow->id !== null ? $this->getById($workflow->id) : null;
        if ($previous !== null) $this->assertNotProcessing($previous);
        if (!$allowLiteOverLimit) {
            $actor ??= Craft::$app->getUser()->getIdentity();
            if ($workflow->id === null && $actor !== null && $workflow->ownerId === null && !$workflow->adminManaged) $workflow->ownerId = (int)$actor->id;
            if ($actor !== null) AutofillPlugin::getInstance()->getWorkflowAccess()->assertCanSave($workflow, $previous, $actor);
            elseif (!Craft::$app->getRequest()->getIsConsoleRequest()) throw new RuntimeException('Sign in to change workflows.');
        }
        if ($workflow->ownerId !== null && $workflow->ownerId !== $previous?->ownerId) {
            $owner = Craft::$app->getUsers()->getUserById($workflow->ownerId);
            if (!$owner || $owner->getStatus() !== User::STATUS_ACTIVE) throw new RuntimeException('Choose an active workflow owner.');
        }
        $workflow->handle = trim($workflow->handle);
        $workflow->name = trim($workflow->name);
        $workflow->description = trim($workflow->description);
        $workflow->entryTypeUid = trim($workflow->entryTypeUid);
        $workflow->volumeUid = trim($workflow->volumeUid);
        $workflow->modelConfigUid = trim($workflow->modelConfigUid);

        if (!$workflow->validate()) {
            return false;
        }

        if (!$allowLiteOverLimit && !$this->validateConfiguration($workflow)) {
            return false;
        }
        $existing = WorkflowRecord::find()->where(['handle' => $workflow->handle])->one();
        if ($existing instanceof WorkflowRecord && $existing->id !== $workflow->id) {
            $workflow->addError('handle', 'A workflow with this handle already exists.');
            return false;
        }

        if (!$allowLiteOverLimit && !$this->isProEdition() && $workflow->id === null && WorkflowRecord::find()->exists()) {
            $workflow->addError('name', 'Autofill Lite supports one workflow. Upgrade to Autofill Pro to create more.');
            return false;
        }

        $record = $workflow->id === null ? new WorkflowRecord() : WorkflowRecord::findOne($workflow->id);
        if (!$record instanceof WorkflowRecord) {
            $workflow->addError('id', 'Workflow could not be found.');
            return false;
        }

        $record->setAttributes([
            'ownerId' => $workflow->ownerId,
            'visibility' => $workflow->visibility,
            'adminManaged' => $workflow->adminManaged,
            'archived' => $workflow->archived,
            'handle' => $workflow->handle,
            'name' => $workflow->name,
            'description' => $workflow->description,
            'scope' => $workflow->scope,
            'entryTypeUid' => $workflow->scope === 'entry' ? $workflow->entryTypeUid : null,
            'volumeUid' => $workflow->scope === 'asset' ? $workflow->volumeUid : null,
            'modelConfigUid' => $workflow->modelConfigUid !== '' ? $workflow->modelConfigUid : null,
            'globalPrompt' => $workflow->globalPrompt,
            'actionButtonLabel' => $workflow->actionButtonLabel,
            'showUserPromptInput' => $workflow->showUserPromptInput,
            'showOnSidebar' => $workflow->showOnSidebar,
            'rowsJson' => json_encode(array_values($workflow->rows), JSON_THROW_ON_ERROR),
            'contextRowsJson' => json_encode(array_values($workflow->contextRows), JSON_THROW_ON_ERROR),
        ], false);

        if (!$record->save()) {
            foreach ($record->getErrors() as $attributeErrors) {
                foreach ($attributeErrors as $error) {
                    $workflow->addError('name', $error);
                }
            }
            return false;
        }

        $workflow->id = (int)$record->id;
        $workflow->uid = (string)$record->uid;
        return true;
    }

    public function getById(int $id): ?Workflow
    {
        $record = WorkflowRecord::findOne($id);
        return $record instanceof WorkflowRecord ? $this->modelFromRecord($record) : null;
    }

    public function assertNotProcessing(Workflow $workflow): void
    {
        if ($workflow->id !== null && Craft::$app->getDb()->tableExists(WorkflowRunRecord::tableName()) &&
            WorkflowRunRecord::find()->where(['workflowId' => $workflow->id, 'status' => ['queued', 'running']])->exists()) {
            throw new RuntimeException('This workflow is processing. Wait for its runs to finish before changing it.');
        }
    }

    public function setArchived(int $id, bool $archived): bool
    {
        $record = WorkflowRecord::findOne($id);
        if (!$record instanceof WorkflowRecord) return false;

        $this->assertNotProcessing($this->modelFromRecord($record));
        $record->archived = $archived;
        return $record->save(false);
    }

    public function deleteWorkflow(Workflow|int $workflow): bool
    {
        $id = $workflow instanceof Workflow ? $workflow->id : $workflow;
        if ($id === null) {
            return false;
        }

        $definition = $this->getById($id);
        if ($definition === null) return false;
        $this->assertNotProcessing($definition);
        $actor = Craft::$app->getUser()->getIdentity();
        if ($actor !== null && !$actor->admin) {
            $access = AutofillPlugin::getInstance()->getWorkflowAccess();
            if ($definition->adminManaged || !$access->canView($definition, $actor) ||
                !$access->can($actor, $access->owns($definition, $actor) ? 'delete' : 'deleteOthers')) {
                throw new RuntimeException('You do not have permission to archive this workflow.');
            }
        } elseif ($actor === null && !Craft::$app->getRequest()->getIsConsoleRequest()) {
            throw new RuntimeException('Sign in to archive workflows.');
        }
        $record = WorkflowRecord::findOne($id);
        if (WorkflowRunRecord::find()->where(['workflowId' => $id])->exists()) {
            $record->archived = true;
            return $record->save(false);
        }
        return (bool)$record->delete();
    }

    public function resolveForField(AutofillField $field): ?Workflow
    {
        $handle = trim($field->workflowHandle);
        if ($handle !== '') {
            return $this->getByHandle($handle);
        }

        // Legacy embedded configuration remains usable until the data migration links it.
        if ($field->entryTypeUid === '' && $field->rows === [] && $field->contextRows === []) {
            return null;
        }

        return $this->legacyWorkflowFromField($field);
    }

    public function asField(Workflow $workflow): AutofillField
    {
        $field = new AutofillField();
        $field->name = $workflow->name;
        $field->workflowHandle = $workflow->handle;
        $field->scope = $workflow->scope;
        $field->entryTypeUid = $workflow->entryTypeUid;
        $field->volumeUid = $workflow->volumeUid;
        $field->modelConfigUid = $workflow->modelConfigUid;
        $field->globalPrompt = $workflow->globalPrompt;
        $field->actionButtonLabel = $workflow->actionButtonLabel;
        $field->showUserPromptInput = $workflow->showUserPromptInput;
        $field->rows = $workflow->rows;
        $field->contextRows = $workflow->contextRows;
        return $field;
    }

    /** Convert legacy field definitions once, preserving row arrays and layout UIDs. */
    public function migrateLegacyFields(): void
    {
        foreach (Craft::$app->getFields()->getAllFields() as $field) {
            if (!$field instanceof AutofillField || trim($field->workflowHandle) !== '') {
                continue;
            }

            if ($field->entryTypeUid === '' && $field->rows === [] && $field->contextRows === []) {
                continue;
            }

            $previous = WorkflowRecord::find()->where(['sourceFieldUid' => $field->uid])->one();
            $workflow = $previous instanceof WorkflowRecord ? $this->modelFromRecord($previous) : $this->legacyWorkflowFromField($field);
            if (!$previous) {
                $workflow->handle = $this->migrationHandleForField($field);
            }
            $workflow->visibility = 'public';
            $workflow->adminManaged = true;
            $workflow->ownerId = null;
            $workflow->name = trim($field->name) !== '' ? $field->name : $workflow->handle;

            $transaction = Craft::$app->getDb()->beginTransaction();
            try {
                if (!$this->saveWorkflow($workflow, allowLiteOverLimit: true)) {
                    throw new RuntimeException('Could not migrate Autofill field: ' . implode(' ', $workflow->getFirstErrors()));
                }

                $record = WorkflowRecord::findOne($workflow->id);
                $record->sourceFieldUid = $field->uid;
                if (!$record->legacyConfigJson) {
                    $record->legacyConfigJson = json_encode($field->getSettings(), JSON_THROW_ON_ERROR);
                }
                if (!$record->save(false)) {
                    throw new RuntimeException('Could not preserve the original Autofill configuration.');
                }
                $field->workflowHandle = $workflow->handle;
                if (!Craft::$app->getFields()->saveField($field, runValidation: false)) {
                    throw new RuntimeException(sprintf('Could not link Autofill field "%s" to its workflow.', $field->handle));
                }
                $transaction->commit();
            } catch (Throwable $exception) {
                $transaction->rollBack();
                throw $exception;
            }
        }
    }

    private function validateConfiguration(Workflow $workflow): bool
    {
        $scope = $workflow->scope === 'asset'
            ? Craft::$app->getVolumes()->getVolumeByUid($workflow->volumeUid)
            : Craft::$app->getEntries()->getEntryTypeByUid($workflow->entryTypeUid);
        if ($scope === null) {
            $workflow->addError($workflow->scope === 'asset' ? 'volumeUid' : 'entryTypeUid', 'The configured content scope does not exist.');
            return false;
        }
        $discovery = AutofillPlugin::getInstance()->getFieldDiscoveryService();
        $fields = $workflow->scope === 'asset' ? $discovery->getSupportedVolumeFields($scope) : $discovery->getSupportedEntryTypeFields($scope);
        $available = array_column($fields, null, 'uid');
        $old = $workflow->id ? WorkflowRecord::findOne($workflow->id) : null;
        $previous = [];
        if ($old) {
            foreach (array_merge($this->decodeRows($old->rowsJson), $this->decodeRows($old->contextRowsJson)) as $row) {
                $previous[] = $row['targetFieldUid'] ?? $row['fieldUid'] ?? '';
            }
        }
        $seen = [];
        foreach (['rows' => 'targetFieldUid', 'contextRows' => 'fieldUid'] as $attribute => $key) {
            foreach ($workflow->$attribute as $index => $row) {
                if (!is_array($row)) {
                    $workflow->addError($attribute, 'Each configured row must be an object.');
                    continue;
                }
                foreach ($attribute === 'rows' ? ['requiresApproval', 'includeCurrentFieldValue', 'overrideCurrentValue', 'enabled'] : ['enabled'] as $flag) {
                    if (array_key_exists($flag, $row) && !is_bool($row[$flag])) {
                        $workflow->addError($attribute, 'Workflow behavior flags must be booleans.');
                    }
                }
                if (isset($row['assets']['includeFile']) && !is_bool($row['assets']['includeFile'])) {
                    $workflow->addError($attribute, 'File-content inclusion must be a boolean.');
                }
                $uid = trim((string)($row[$key] ?? ''));
                if ($uid === '' || !isset($available[$uid])) {
                    // Preserve previously configured missing fields so an admin can repair them.
                    if ($uid === '' || !in_array($uid, $previous, true)) {
                        $workflow->addError($attribute, sprintf('Row %d must select a supported field in this layout.', $index + 1));
                    }
                } elseif (!$this->isProEdition() && !$available[$uid]['availableInLiteVersion'] && !in_array($uid, $previous, true)) {
                    $workflow->addError($attribute, sprintf('Row %d uses a field type that requires Autofill Pro.', $index + 1));
                }
                if (isset($seen[$uid])) {
                    $workflow->addError($attribute, 'A field cannot be selected more than once across outputs and context.');
                }
                $seen[$uid] = true;
                if ($attribute === 'rows' && (trim((string)($row['prompt'] ?? '')) === '' || ($available[$uid]['contextOnly'] ?? false))) {
                    $workflow->addError('rows', sprintf('Output row %d needs instructions and an editable target field.', $index + 1));
                }
                if (isset($row['assets'])) {
                    $max = $row['assets']['maxFiles'] ?? 3;
                    if (filter_var($max, FILTER_VALIDATE_INT) === false || $max < 1 || $max > 20) {
                        $workflow->addError($attribute, 'File input count must be between 1 and 20.');
                    }
                }
            }
        }
        if ($workflow->modelConfigUid !== '') {
            $found = false;
            foreach (AutofillPlugin::getInstance()->getSettings()->modelConfigs as $model) {
                if (($model['uid'] ?? '') === $workflow->modelConfigUid && ($model['enabled'] ?? false)) { $found = true; }
            }
            if (!$found) { $workflow->addError('modelConfigUid', 'Select an enabled model configuration.'); }
        }
        return !$workflow->hasErrors();
    }

    private function legacyWorkflowFromField(AutofillField $field): Workflow
    {
        return new Workflow([
            'uid' => '',
            'scope' => 'entry',
            'entryTypeUid' => $field->entryTypeUid,
            'modelConfigUid' => $field->modelConfigUid,
            'globalPrompt' => $field->globalPrompt,
            'actionButtonLabel' => $field->actionButtonLabel,
            'showUserPromptInput' => $field->showUserPromptInput,
            'rows' => $field->rows,
            'contextRows' => $field->contextRows,
        ]);
    }

    private function migrationHandleForField(AutofillField $field): string
    {
        $base = strtolower(trim((string)$field->handle));
        $base = preg_replace('/[^a-z0-9_-]+/', '-', $base) ?: '';
        $base = trim($base, '-_');
        if ($base === '' || !preg_match('/^[a-z]/', $base)) {
            $base = 'workflow-' . substr(hash('sha256', (string)$field->uid), 0, 10);
        }

        $handle = $base;
        $suffix = 2;
        while ($this->getByHandle($handle) !== null) {
            $handle = $base . '-' . $suffix++;
        }
        return $handle;
    }

    private function modelFromRecord(WorkflowRecord $record): Workflow
    {
        $workflow = new Workflow([
            'ownerId' => $record->ownerId !== null ? (int)$record->ownerId : null,
            'visibility' => (string)$record->visibility,
            'adminManaged' => (bool)$record->adminManaged,
            'archived' => (bool)$record->archived,
            'id' => (int)$record->id,
            'uid' => (string)$record->uid,
            'handle' => (string)$record->handle,
            'name' => (string)$record->name,
            'description' => (string)$record->description,
            'scope' => (string)$record->scope,
            'entryTypeUid' => (string)($record->entryTypeUid ?? ''),
            'volumeUid' => (string)($record->volumeUid ?? ''),
            'modelConfigUid' => (string)($record->modelConfigUid ?? ''),
            'globalPrompt' => (string)$record->globalPrompt,
            'actionButtonLabel' => (string)($record->actionButtonLabel ?? ''),
            'showUserPromptInput' => (bool)$record->showUserPromptInput,
            'showOnSidebar' => (bool)$record->showOnSidebar,
            'rows' => $this->decodeRows($record->rowsJson),
            'contextRows' => $this->decodeRows($record->contextRowsJson),
        ]);
        return $workflow;
    }

    private function decodeRows(mixed $json): array
    {
        if (!is_string($json) || $json === '') {
            return [];
        }
        $rows = json_decode($json, true);
        return is_array($rows) ? array_values($rows) : [];
    }

    private function isProEdition(): bool
    {
        return class_exists(AutofillPlugin::class) && AutofillPlugin::getInstance()->isProEdition();
    }
}
