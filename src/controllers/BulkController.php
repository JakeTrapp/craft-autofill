<?php

declare(strict_types=1);

namespace jtdev\craftautofill\controllers;

use Craft;
use craft\helpers\StringHelper;
use craft\helpers\UrlHelper;
use craft\helpers\Cp;
use craft\web\Controller;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\helpers\ErrorMessage;
use jtdev\craftautofill\jobs\PrepareBulkRunsJob;
use jtdev\craftautofill\models\Workflow;
use RuntimeException;
use Throwable;
use yii\web\Response;

class BulkController extends Controller
{
    public function actionIndex(): Response
    {
        $this->authorize();
        $plugin = AutofillPlugin::getInstance();
        $actor = Craft::$app->getUser()->getIdentity();
        $workflows = array_values(array_filter($plugin->getWorkflowService()->getAll(), fn(Workflow $workflow): bool =>
            !$workflow->archived && $plugin->getWorkflowAccess()->canView($workflow, $actor) && $plugin->getWorkflowAccess()->canConfigureScope($workflow, $actor)));
        $handle = (string)Craft::$app->getRequest()->getQueryParam('workflow', '');
        $selected = null;
        foreach ($workflows as $workflow) if ($workflow->handle === $handle) $selected = $workflow;
        $sites = Craft::$app->getSites()->getEditableSites();
        $siteId = (int)Craft::$app->getRequest()->getQueryParam('site', Craft::$app->getSites()->getCurrentSite()->id);
        $site = null;
        foreach ($sites as $editableSite) if ($editableSite->id === $siteId) $site = $editableSite;
        $site ??= $sites[0] ?? null;
        $workflowOptions = [];
        foreach ($workflows as $workflow) {
            $sources = [];
            $criteria = [];
            $fields = [];
            $scopeIcon = null;
            if ($workflow->scope === 'asset') {
                $volume = Craft::$app->getVolumes()->getVolumeByUid($workflow->volumeUid);
                $scopeName = $volume?->name;
                if ($volume) $fields = $plugin->getFieldDiscoveryService()->getSupportedVolumeFields($volume);
                $sources = $volume ? ['volume:' . $volume->uid] : [];
                $criteria = ['volumeId' => $volume?->id, 'siteId' => $site?->id];
            } else {
                $type = Craft::$app->getEntries()->getEntryTypeByUid($workflow->entryTypeUid);
                $scopeName = $type?->name;
                if ($type) {
                    $fields = $plugin->getFieldDiscoveryService()->getSupportedEntryTypeFields($type);
                    if ($type->icon !== null && $type->icon !== '') $scopeIcon = Cp::iconSvg($type->icon);
                }
                $criteria = ['typeId' => $type?->id, 'siteId' => $site?->id];
                foreach (Craft::$app->getEntries()->getEditableSections() as $section) {
                    foreach ($section->getEntryTypes() as $sectionType) {
                        if ($sectionType->uid === $workflow->entryTypeUid) $sources[] = $section->type === 'single' ? 'singles' : 'section:' . $section->uid;
                    }
                }
            }
            $fieldNames = [];
            foreach ($fields as $field) {
                $fieldNames[$field['uid']] = $field['name'];
                if (!empty($field['fieldUid'])) $fieldNames[$field['fieldUid']] = $field['name'];
            }
            $contextFields = [];
            foreach ($workflow->contextRows as $row) {
                if (($row['enabled'] ?? true) && !empty($row['fieldUid'])) $contextFields[] = $fieldNames[$row['fieldUid']] ?? Craft::t('autofill', 'Unavailable field');
            }
            $outputFields = [];
            foreach ($workflow->rows as $row) {
                if (($row['enabled'] ?? true) && !empty($row['targetFieldUid'])) $outputFields[] = $fieldNames[$row['targetFieldUid']] ?? Craft::t('autofill', 'Unavailable field');
            }
            $automatic = (bool)array_filter($workflow->rows, static fn(array $row): bool => ($row['enabled'] ?? true) && ($row['requiresApproval'] ?? true) === false);
            $workflowOptions[] = compact('workflow', 'sources', 'criteria', 'automatic', 'scopeName', 'scopeIcon', 'contextFields', 'outputFields');
        }
        return $this->renderTemplate('autofill/cp/bulk/index', compact('workflows', 'workflowOptions', 'selected', 'sites', 'site'));
    }

    public function actionQueue(): Response
    {
        $this->authorize();
        $this->requirePostRequest();
        $plugin = AutofillPlugin::getInstance();
        $request = Craft::$app->getRequest();
        try {
            $workflow = $plugin->getWorkflowService()->getByHandle((string)$request->getBodyParam('workflowHandle', ''));
            if ($workflow === null || $workflow->archived) throw new RuntimeException('Select an available workflow.');
            $ids = $request->getBodyParam('elementIds', []);
            if (!is_array($ids)) $ids = [$ids];
            $ids = array_values(array_unique(array_filter(array_map('intval', $ids), static fn(int $id): bool => $id > 0)));
            if ($ids === []) throw new RuntimeException('Select content to run this workflow on.');
            $automatic = (bool)array_filter($workflow->rows, static fn(array $row): bool => ($row['enabled'] ?? true) && ($row['requiresApproval'] ?? true) === false);
            if ($automatic && !in_array($request->getBodyParam('confirmAutomatic'), [true, 1, '1', 'on'], true)) {
                throw new RuntimeException('Confirm that this batch may apply fields automatically without review.');
            }
            $actor = Craft::$app->getUser()->getIdentity();
            $access = $plugin->getWorkflowAccess();
            if (!$access->canView($workflow, $actor) || !$access->can($actor, 'run')) {
                throw new RuntimeException('You do not have permission to run this workflow.');
            }
            $siteId = (int)$request->getBodyParam('siteId', Craft::$app->getSites()->getCurrentSite()->id);
            if (!in_array($siteId, Craft::$app->getSites()->getEditableSiteIds(), true)) {
                throw new RuntimeException('You do not have permission to edit content on this site.');
            }
            // Runs are created by a queue job so large selections don't hit the request time limit.
            // Each item is still checked for scope and permission when its run is created.
            $batchUid = StringHelper::UUID();
            Craft::$app->getQueue()->push(new PrepareBulkRunsJob([
                'workflowId' => (int)$workflow->id,
                'elementIds' => $ids,
                'siteId' => $siteId,
                'actorId' => (int)$actor->id,
                'userPrompt' => (string)$request->getBodyParam('userPrompt', ''),
                'batchUid' => $batchUid,
            ]));
            $queued = count($ids);
            if ($request->getAcceptsJson()) return $this->asJson(['success' => true, 'queued' => $queued, 'runIds' => [], 'errors' => [], 'batchUid' => $batchUid]);
            Craft::$app->getSession()->setNotice(Craft::t('autofill', 'Preparing {count, plural, =1{# item} other{# items}}. Results appear in the inbox as they’re ready.', ['count' => $queued]));
            return $this->redirect(UrlHelper::cpUrl('autofill/inbox', ['status' => 'queued']));
        } catch (Throwable $error) {
            $message = ErrorMessage::forUser($error);
            if ($request->getAcceptsJson()) return $this->asJson(['success' => false, 'error' => $message]);
            Craft::$app->getSession()->setError($message);
            return $this->redirect(UrlHelper::cpUrl('autofill/bulk'));
        }
    }

    private function authorize(): void
    {
        $this->requireCpRequest();
        $this->requirePermission('accessPlugin-autofill');
        $plugin = AutofillPlugin::getInstance();
        if (!$plugin->isProEdition() || !$plugin->getWorkflowAccess()->can(Craft::$app->getUser()->getIdentity(), 'bulk')) {
            throw new \yii\web\ForbiddenHttpException('Bulk Autofill requires Autofill Pro and bulk permission.');
        }
    }
}
