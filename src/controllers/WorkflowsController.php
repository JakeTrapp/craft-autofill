<?php

declare(strict_types=1);

namespace jtdev\craftautofill\controllers;

use Craft;
use craft\helpers\UrlHelper;
use craft\models\EntryType;
use craft\models\Volume;
use craft\web\Controller;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\models\Workflow;
use Throwable;
use yii\web\Response;

class WorkflowsController extends Controller
{
    protected array|bool|int $allowAnonymous = false;

    public function actionIndex(): Response
    {
        $this->requireCpRequest();
        $this->requireAdmin(false);

        return $this->renderTemplate('autofill/cp/workflows/index', [
            'workflows' => $this->workflowList(),
        ]);
    }

    public function actionEdit(?string $handle = null): Response
    {
        $this->requireCpRequest();
        $this->requireAdmin(false);
        $workflow = trim((string)$handle) !== ''
            ? AutofillPlugin::getInstance()->getWorkflowService()->getByHandle((string)$handle)
            : null;

        if (trim((string)$handle) !== '' && !$workflow instanceof Workflow) {
            throw new \yii\web\NotFoundHttpException('Workflow not found.');
        }

        if (!$workflow instanceof Workflow) {
            $workflow = new Workflow();
            $workflow->rows = [[
                'targetFieldUid' => '', 'prompt' => '', 'requiresApproval' => true,
                'includeCurrentFieldValue' => true, 'overrideCurrentValue' => true, 'enabled' => true,
                'seomatic' => ['includeSeoTitle' => true, 'includeSiteNamePosition' => true, 'includeSeoDescription' => true, 'includeSeoKeywords' => true],
                'related' => ['mode' => 'topN', 'topN' => 25, 'forceUseCurrentValues' => false],
                'link' => ['entry' => ['mode' => 'topN', 'count' => 10], 'category' => ['mode' => 'topN', 'count' => 10], 'asset' => ['mode' => 'topN', 'count' => 10]],
            ]];
        }

        return $this->renderTemplate('autofill/cp/workflows/edit', [
            'workflow' => $this->workflowPayload($workflow),
            'entryTypes' => $this->entryTypeOptions(),
            'volumes' => $this->volumeOptions(),
            'modelConfigs' => $this->modelConfigOptions(),
        ]);
    }

    public function actionFields(): Response
    {
        $this->requireCpRequest();
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        $this->requireAdmin(false);

        try {
            $body = Craft::$app->getRequest()->getBodyParams();
            $scope = (string)($body['scope'] ?? 'entry');
            if ($scope === 'asset') {
                $uid = trim((string)($body['volumeUid'] ?? ''));
                $volume = $uid !== '' ? Craft::$app->getVolumes()->getVolumeByUid($uid) : null;
                if (!$volume instanceof Volume) {
                    return $this->asJson(['success' => true, 'fields' => [], 'metadataFields' => $this->assetMetadataOptions()]);
                }
                return $this->asJson([
                    'success' => true,
                    'fields' => AutofillPlugin::getInstance()->getFieldDiscoveryService()->getSupportedVolumeFields($volume),
                    'metadataFields' => $this->assetMetadataOptions($volume),
                ]);
            }

            $uid = trim((string)($body['entryTypeUid'] ?? ''));
            $entryType = $uid !== '' ? Craft::$app->getEntries()->getEntryTypeByUid($uid) : null;
            if (!$entryType instanceof EntryType) {
                return $this->asJson(['success' => true, 'fields' => [], 'metadataFields' => $this->assetMetadataOptions()]);
            }
            return $this->asJson([
                'success' => true,
                'fields' => AutofillPlugin::getInstance()->getFieldDiscoveryService()->getSupportedEntryTypeFields($entryType),
                'metadataFields' => $this->assetMetadataOptions(),
            ]);
        } catch (Throwable $exception) {
            Craft::error($exception->getMessage(), __METHOD__);
            return $this->asJson(['success' => false, 'error' => 'Could not load fields for this workflow.', 'fields' => []]);
        }
    }

    public function actionSave(): Response
    {
        $this->requireCpRequest();
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        $this->requireAdmin(false);

        $payload = Craft::$app->getRequest()->getBodyParam('workflow');
        if (!is_array($payload)) {
            return $this->asJson(['success' => false, 'error' => 'Workflow data was invalid.']);
        }

        $workflow = null;
        $id = filter_var($payload['id'] ?? null, FILTER_VALIDATE_INT);
        if ($id !== false && $id > 0) {
            foreach (AutofillPlugin::getInstance()->getWorkflowService()->getAll() as $existing) {
                if ($existing->id === $id) {
                    $workflow = $existing;
                    break;
                }
            }
            if (!$workflow instanceof Workflow) {
                return $this->asJson(['success' => false, 'error' => 'Workflow could not be found.']);
            }
        } else {
            $workflow = new Workflow();
        }

        foreach (['handle', 'name', 'scope', 'entryTypeUid', 'volumeUid', 'modelConfigUid', 'globalPrompt', 'actionButtonLabel'] as $attribute) {
            if (array_key_exists($attribute, $payload)) {
                $workflow->$attribute = is_scalar($payload[$attribute]) ? (string)$payload[$attribute] : '';
            }
        }
        $workflow->showUserPromptInput = $this->toBool($payload['showUserPromptInput'] ?? true);
        $workflow->showOnSidebar = $this->toBool($payload['showOnSidebar'] ?? false);
        $workflow->rows = is_array($payload['rows'] ?? null) ? array_values($payload['rows']) : [];
        $workflow->contextRows = is_array($payload['contextRows'] ?? null) ? array_values($payload['contextRows']) : [];

        try {
            $saved = AutofillPlugin::getInstance()->getWorkflowService()->saveWorkflow($workflow);
        } catch (Throwable $exception) {
            Craft::error($exception->getMessage(), __METHOD__);
            return $this->asJson(['success' => false, 'error' => 'Could not save this workflow.']);
        }

        if (!$saved) {
            return $this->asJson([
                'success' => false,
                'error' => $workflow->getFirstError('name') ?: 'Check the workflow fields and try again.',
                'errors' => $workflow->getErrors(),
            ]);
        }

        return $this->asJson([
            'success' => true,
            'workflow' => $this->workflowPayload($workflow),
            'editUrl' => UrlHelper::cpUrl('autofill/workflows/edit/' . rawurlencode($workflow->handle)),
        ]);
    }

    public function actionDelete(): Response
    {
        $this->requireCpRequest();
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        $this->requireAdmin(false);
        $id = filter_var(Craft::$app->getRequest()->getBodyParam('id'), FILTER_VALIDATE_INT);
        if ($id === false || $id <= 0) {
            return $this->asJson(['success' => false, 'error' => 'Workflow ID was invalid.']);
        }
        if (!AutofillPlugin::getInstance()->getWorkflowService()->deleteWorkflow((int)$id)) {
            return $this->asJson(['success' => false, 'error' => 'Workflow could not be deleted.']);
        }
        return $this->asJson(['success' => true]);
    }

    private function workflowList(): array
    {
        $entryTypes = [];
        foreach ($this->entryTypeOptions() as $option) $entryTypes[$option['uid']] = $option['name'];
        $volumes = [];
        foreach ($this->volumeOptions() as $option) $volumes[$option['uid']] = $option['name'];
        return array_map(function(Workflow $workflow) use ($entryTypes, $volumes): array {
            $row = $this->workflowPayload($workflow);
            $row['entryTypeName'] = $entryTypes[$workflow->entryTypeUid] ?? '';
            $row['volumeName'] = $volumes[$workflow->volumeUid] ?? '';
            return $row;
        }, AutofillPlugin::getInstance()->getWorkflowService()->getAll());
    }

    private function workflowPayload(Workflow $workflow): array
    {
        return [
            'id' => $workflow->id, 'uid' => $workflow->uid, 'handle' => $workflow->handle, 'name' => $workflow->name,
            'scope' => $workflow->scope, 'entryTypeUid' => $workflow->entryTypeUid, 'volumeUid' => $workflow->volumeUid,
            'modelConfigUid' => $workflow->modelConfigUid, 'globalPrompt' => $workflow->globalPrompt,
            'actionButtonLabel' => $workflow->actionButtonLabel, 'showUserPromptInput' => $workflow->showUserPromptInput,
            'showOnSidebar' => $workflow->showOnSidebar, 'rows' => $workflow->rows, 'contextRows' => $workflow->contextRows,
        ];
    }

    private function entryTypeOptions(): array
    {
        return array_map(static fn(EntryType $type): array => ['uid' => (string)$type->uid, 'name' => (string)$type->name], Craft::$app->getEntries()->getAllEntryTypes());
    }

    private function volumeOptions(): array
    {
        return array_map(static fn(Volume $volume): array => ['uid' => (string)$volume->uid, 'name' => (string)$volume->name], Craft::$app->getVolumes()->getAllVolumes());
    }

    /** @return array<int, array{key:string,label:string}> */
    private function assetMetadataOptions(?Volume $selectedVolume = null): array
    {
        $options = [
            ['key' => 'title', 'label' => Craft::t('app', 'Title')],
            ['key' => 'filename', 'label' => Craft::t('app', 'Filename')],
            ['key' => 'alt', 'label' => Craft::t('app', 'Alt text')],
            ['key' => 'size', 'label' => Craft::t('app', 'File size')],
            ['key' => 'dateCreated', 'label' => Craft::t('app', 'Date created')],
        ];
        $seen = array_fill_keys(array_column($options, 'key'), true);
        $volumes = $selectedVolume ? [$selectedVolume] : Craft::$app->getVolumes()->getAllVolumes();
        foreach ($volumes as $volume) {
            $layout = $volume->getFieldLayout();
            foreach ($layout->getCustomFields() as $field) {
                $handle = trim((string)$field->handle);
                if ($handle === '' || isset($seen[$handle])) continue;
                $options[] = [
                    'key' => $handle,
                    'label' => $field->name . ' (' . $handle . ')',
                ];
                $seen[$handle] = true;
            }
        }
        return $options;
    }

    private function modelConfigOptions(): array
    {
        $rows = AutofillPlugin::getInstance()->getSettings()->modelConfigs;
        return array_values(array_map(static fn(array $row): array => [
            'uid' => (string)($row['uid'] ?? ''), 'label' => (string)($row['label'] ?? ''),
            'provider' => (string)($row['provider'] ?? ''), 'modelId' => (string)($row['modelId'] ?? ''),
        ], array_filter($rows, static fn(array $row): bool => trim((string)($row['uid'] ?? '')) !== '')));
    }

    private function toBool(mixed $value): bool
    {
        return in_array($value, [true, 1, '1', 'true', 'on'], true);
    }
}
