<?php

declare(strict_types=1);

namespace jtdev\craftautofill\controllers;

use Craft;
use craft\helpers\UrlHelper;
use craft\helpers\Cp;
use craft\models\EntryType;
use craft\models\Volume;
use craft\web\Controller;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\helpers\ErrorMessage;
use jtdev\craftautofill\models\Workflow;
use Throwable;
use yii\web\Response;

class WorkflowsController extends Controller
{
    protected array|bool|int $allowAnonymous = false;

    public function actionRoot(): Response
    {
        $this->requireCpRequest();
        $this->requirePermission('accessPlugin-autofill');

        $plugin = AutofillPlugin::getInstance();
        $actor = Craft::$app->getUser()->getIdentity();
        $hasPendingReview = $plugin->isProEdition() && $actor !== null
            && $plugin->getWorkflowRunService()->actionableCount($actor) > 0;

        return $this->redirect(UrlHelper::cpUrl($hasPendingReview ? 'autofill/inbox' : 'autofill/workflows'));
    }

    public function actionIndex(): Response
    {
        $this->requireCpRequest();
        $this->requirePermission('accessPlugin-autofill');

        return $this->renderTemplate('autofill/cp/workflows/index', [
            'workflows' => $this->workflowList(),
            'showArchived' => (bool)Craft::$app->getRequest()->getQueryParam('archived', false),
        ]);
    }

    public function actionEdit(?string $handle = null): Response
    {
        $this->requireCpRequest();
        $this->requirePermission('accessPlugin-autofill');
        $workflow = trim((string)$handle) !== ''
            ? AutofillPlugin::getInstance()->getWorkflowService()->getByHandle((string)$handle)
            : null;

        if (trim((string)$handle) !== '' && !$workflow instanceof Workflow) {
            throw new \yii\web\NotFoundHttpException('Workflow not found.');
        }

        if (!$workflow instanceof Workflow) {
            $workflow = new Workflow(['ownerId' => (int)Craft::$app->getUser()->getId()]);
        }

        $actor = Craft::$app->getUser()->getIdentity();
        $access = AutofillPlugin::getInstance()->getWorkflowAccess();
        if ($workflow->id === null ? !$access->can($actor, 'create') : !$access->canView($workflow, $actor)) {
            throw new \yii\web\ForbiddenHttpException('This workflow is unavailable.');
        }
        return $this->renderTemplate('autofill/cp/workflows/edit', [
            'workflow' => $this->workflowPayload($workflow),
            'entryTypes' => $this->entryTypeOptions(),
            'volumes' => $this->volumeOptions(),
            'modelConfigs' => $this->modelConfigOptions(),
            'isAdmin' => (bool)$actor->admin,
        ]);
    }

    /** @param array<int, array<string, mixed>> $fields
     * @return array<int, array<string, mixed>>
     */
    private function fieldPickerOptions(array $fields): array
    {
        $body = Craft::$app->getRequest()->getBodyParams();
        $workflow = new Workflow([
            'scope' => (string)($body['scope'] ?? 'entry'),
            'entryTypeUid' => (string)($body['entryTypeUid'] ?? ''),
            'volumeUid' => (string)($body['volumeUid'] ?? ''),
        ]);
        $access = AutofillPlugin::getInstance()->getWorkflowAccess();
        $actor = Craft::$app->getUser()->getIdentity();
        if (!$access->canConfigureScope($workflow, $actor)) return [];
        $fields = array_values(array_filter($fields, fn(array $field): bool => $access->canUseField($workflow, (string)$field['uid'], $actor)));
        return array_map(static function(array $field) use ($access, $workflow, $actor): array {
            $field['contextOnly'] = ($field['contextOnly'] ?? false) || !$access->canUseField($workflow, (string)$field['uid'], $actor, write: true);
            $field['iconSvg'] ??= Cp::iconSvg(match ($field['adapter'] ?? '') {
                'date', 'time' => 'calendar',
                'lightswitch' => 'toggle-on',
                'assets' => 'image',
                default => 'font',
            });
            return $field;
        }, $fields);
    }

    public function actionFields(): Response
    {
        $this->requireCpRequest();
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        $this->requirePermission('accessPlugin-autofill');

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
                    'fields' => $this->fieldPickerOptions(AutofillPlugin::getInstance()->getFieldDiscoveryService()->getSupportedVolumeFields($volume)),
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
                'fields' => $this->fieldPickerOptions(AutofillPlugin::getInstance()->getFieldDiscoveryService()->getSupportedEntryTypeFields($entryType)),
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
        $this->requirePermission('accessPlugin-autofill');

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

        foreach (['visibility', 'handle', 'name', 'description', 'scope', 'entryTypeUid', 'volumeUid', 'modelConfigUid', 'globalPrompt', 'actionButtonLabel'] as $attribute) {
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
            return $this->asJson(['success' => false, 'error' => ErrorMessage::forUser($exception, 'Could not save this workflow.')]);
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

    public function actionSetArchived(): Response
    {
        $this->requireCpRequest();
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        $this->requireAdmin(false);

        $id = filter_var(Craft::$app->getRequest()->getBodyParam('id'), FILTER_VALIDATE_INT);
        $archived = Craft::$app->getRequest()->getBodyParam('archived');
        if ($id === false || $id <= 0 || !is_bool($archived)) {
            return $this->asJson(['success' => false, 'error' => 'Invalid workflow archive request.']);
        }

        try {
            if (!AutofillPlugin::getInstance()->getWorkflowService()->setArchived($id, $archived)) {
                return $this->asJson(['success' => false, 'error' => 'Could not change the workflow archive status.']);
            }
        } catch (\RuntimeException $exception) {
            return $this->asJson(['success' => false, 'error' => ErrorMessage::forUser($exception)]);
        }

        return $this->asJson(['success' => true, 'archived' => $archived]);
    }

    public function actionDelete(): Response
    {
        $this->requireCpRequest();
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        $this->requirePermission('accessPlugin-autofill');
        $id = filter_var(Craft::$app->getRequest()->getBodyParam('id'), FILTER_VALIDATE_INT);
        if ($id === false || $id <= 0) {
            Craft::$app->getResponse()->setStatusCode(400);
            return $this->asJson(['success' => false, 'error' => 'Workflow ID was invalid.']);
        }
        if (!AutofillPlugin::getInstance()->getWorkflowService()->deleteWorkflow((int)$id)) {
            Craft::$app->getResponse()->setStatusCode(400);
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
        }, array_values(array_filter(AutofillPlugin::getInstance()->getWorkflowService()->getAll(), fn(Workflow $workflow): bool => $workflow->archived === (bool)Craft::$app->getRequest()->getQueryParam('archived', false) && AutofillPlugin::getInstance()->getWorkflowAccess()->canView($workflow, Craft::$app->getUser()->getIdentity()))));
    }

    private function workflowPayload(Workflow $workflow): array
    {
        $actor = Craft::$app->getUser()->getIdentity();
        $access = AutofillPlugin::getInstance()->getWorkflowAccess();
        return [
            'canDelete' => (bool)$actor->admin || (!$workflow->adminManaged && $access->canView($workflow, $actor) && $access->can($actor, $access->owns($workflow, $actor) ? 'delete' : 'deleteOthers')),
            'ownerName' => $workflow->ownerId ? (Craft::$app->getUsers()->getUserById($workflow->ownerId)?->getFriendlyName() ?? 'Former user') : 'Administrators',
            'visibility' => $workflow->visibility, 'ownerId' => $workflow->ownerId, 'adminManaged' => $workflow->adminManaged, 'archived' => $workflow->archived,
            'canEdit' => $workflow->id === null ? AutofillPlugin::getInstance()->getWorkflowAccess()->can(Craft::$app->getUser()->getIdentity(), 'create') : AutofillPlugin::getInstance()->getWorkflowAccess()->canEdit($workflow, Craft::$app->getUser()->getIdentity()),
            'processing' => $workflow->id !== null && \jtdev\craftautofill\records\WorkflowRunRecord::find()->where(['workflowId' => $workflow->id, 'status' => ['queued', 'running']])->exists(),
            'canConfigureAutomatic' => AutofillPlugin::getInstance()->getWorkflowAccess()->can(Craft::$app->getUser()->getIdentity(), 'automatic'),
            'id' => $workflow->id, 'uid' => $workflow->uid, 'handle' => $workflow->handle, 'name' => $workflow->name,
            'description' => $workflow->description,
            'scope' => $workflow->scope, 'entryTypeUid' => $workflow->entryTypeUid, 'volumeUid' => $workflow->volumeUid,
            'modelConfigUid' => $workflow->modelConfigUid, 'globalPrompt' => $workflow->globalPrompt,
            'actionButtonLabel' => $workflow->actionButtonLabel, 'showUserPromptInput' => $workflow->showUserPromptInput,
            'showOnSidebar' => $workflow->showOnSidebar, 'rows' => $workflow->rows, 'contextRows' => $workflow->contextRows,
        ];
    }

    private function entryTypeOptions(): array
    {
        return array_map(static fn(EntryType $type): array => ['uid' => (string)$type->uid, 'name' => (string)$type->name], array_filter(Craft::$app->getEntries()->getAllEntryTypes(), fn(EntryType $type): bool => AutofillPlugin::getInstance()->getWorkflowAccess()->canConfigureScope(new Workflow(['entryTypeUid' => (string)$type->uid]), Craft::$app->getUser()->getIdentity())));
    }

    private function volumeOptions(): array
    {
        return array_map(static fn(Volume $volume): array => ['uid' => (string)$volume->uid, 'name' => (string)$volume->name], array_filter(Craft::$app->getVolumes()->getAllVolumes(), fn(Volume $volume): bool => AutofillPlugin::getInstance()->getWorkflowAccess()->canConfigureScope(new Workflow(['scope' => 'asset', 'volumeUid' => (string)$volume->uid]), Craft::$app->getUser()->getIdentity())));
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
            $access = AutofillPlugin::getInstance()->getWorkflowAccess();
            $actor = Craft::$app->getUser()->getIdentity();
            $scope = new Workflow(['scope' => 'asset', 'volumeUid' => (string)$volume->uid]);
            if (!$actor->admin && !$actor->can("viewAssets:$volume->uid")) continue;
            $layout = $volume->getFieldLayout();
            foreach ($layout->getCustomFields() as $field) {
                if (!$access->canUseField($scope, (string)($field->layoutElement->uid ?? $field->uid), $actor)) continue;
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
