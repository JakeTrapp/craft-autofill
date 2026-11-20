<?php

declare(strict_types=1);

namespace jtdev\craftautofill\controllers;

use Craft;
use craft\elements\User;
use craft\web\Controller;
use jtdev\craftautofill\AutofillPlugin;
use craft\helpers\UrlHelper;
use jtdev\craftautofill\records\WorkflowRunRecord;
use yii\web\NotFoundHttpException;
use yii\web\Response;

class InboxController extends Controller
{
    public function actionIndex(): Response
    {
        $this->requireInbox();
        $actor = Craft::$app->getUser()->getIdentity();
        $service = AutofillPlugin::getInstance()->getWorkflowRunService();
        $automations = AutofillPlugin::getInstance()->getAutomationService();
        $automationId = (int)Craft::$app->getRequest()->getQueryParam('automation', 0) ?: null;
        $automation = $automationId ? $automations->getById($automationId) : null;
        // Filtering never reveals runs; it only narrows the runs this person can already see.
        if ($automation !== null && !$automations->canManage($automation, $actor)) $automation = null;
        // An automation's history opens on all of its runs.
        $status = (string)Craft::$app->getRequest()->getQueryParam('status', $automationId ? 'all' : 'ready');
        if (!in_array($status, ['all', 'ready', 'queued', 'running', 'completed', 'failed'], true) || ($status === 'all' && $automationId === null)) {
            $status = 'ready';
        }
        $query = WorkflowRunRecord::find()->orderBy(['id' => SORT_DESC]);
        if ($status !== 'all') $query->where(['status' => $status]);
        if ($automationId !== null) $query->andWhere(['automationId' => $automationId]);
        $runs = [];
        foreach ($query->each() as $run) {
            if (!$service->canView($run, $actor)) continue;
            $runs[] = $service->payload($run, $actor) + ['initiatorId' => $run->initiatorId];
            if (count($runs) >= 100) break;
        }
        $initiatorIds = array_values(array_unique(array_filter(array_column($runs, 'initiatorId'))));
        $initiators = $initiatorIds === [] ? [] : User::find()->id($initiatorIds)->status(null)->indexBy('id')->all();
        $automationNames = $automations->namesById(array_column($runs, 'automationId'));
        $automationFilter = $automationId !== null ? ['id' => $automationId, 'editable' => $automation !== null, 'name' => $automation?->name ?? ($automationNames[$automationId] ?? null)] : null;
        return $this->renderTemplate('autofill/cp/inbox/index', compact('runs', 'status', 'initiators', 'automationNames', 'automationFilter'));
    }

    public function actionReview(int $runId): Response
    {
        $this->requireInbox();
        $plugin = AutofillPlugin::getInstance();
        $run = WorkflowRunRecord::findOne($runId);
        $actor = Craft::$app->getUser()->getIdentity();
        if (!$run || !$plugin->getWorkflowRunService()->canView($run, $actor)) throw new NotFoundHttpException('Run unavailable.');
        $payload = $plugin->getWorkflowRunService()->payload($run, $actor);
        return $this->redirect(UrlHelper::urlWithParams($payload['editUrl'], ['autofillRun' => (int)$run->id]));
    }

    private function requireInbox(): void
    {
        $this->requireCpRequest();
        $this->requirePermission('accessPlugin-autofill');
        if (!AutofillPlugin::getInstance()->isProEdition()) throw new NotFoundHttpException('The review inbox requires Autofill Pro.');
    }
}
