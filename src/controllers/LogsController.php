<?php

declare(strict_types=1);

namespace jtdev\craftautofill\controllers;

use Craft;
use craft\helpers\AdminTable;
use craft\web\Controller;
use jtdev\craftautofill\records\AiRequestLogRecord;
use yii\web\Response;

class LogsController extends Controller
{
    public function actionIndex(): Response
    {
        $this->requireCpRequest();
        $this->requireAdmin(false); // Legacy request payloads have no reliable run privacy attribution.

        return $this->renderTemplate('autofill/cp/logs/index.twig');
    }

    /** Data contract used by Craft's native admin-table search and pagination. */
    public function actionTableData(): Response
    {
        $this->requireCpRequest();
        $this->requireAdmin(false);
        $this->requireAcceptsJson();
        $request = Craft::$app->getRequest();
        $limit = max(1, min(100, (int)$request->getParam('per_page', 50)));
        $query = AiRequestLogRecord::find();
        $search = mb_substr(trim((string)$request->getParam('search', '')), 0, 500);
        if ($search !== '') {
            $conditions = ['or'];
            foreach (['provider', 'modelId', 'errorMessage', 'reasoningEffort', 'providerResponseId'] as $column) {
                $conditions[] = ['like', $column, $search];
            }
            if (ctype_digit($search)) {
                foreach (['id', 'fieldId', 'entryId', 'siteId', 'userId'] as $column) $conditions[] = [$column => (int)$search];
            }
            foreach ([1 => 'Success', 0 => 'Failed'] as $success => $label) {
                if (mb_strtolower($search) === mb_strtolower(Craft::t('app', $label))) $conditions[] = ['success' => $success];
            }
            $query->andWhere($conditions);
        }
        $total = (int)(clone $query)->count();
        $page = min(max(1, (int)$request->getParam('page', 1)), max(1, (int)ceil($total / $limit)));
        $allowedSorts = ['id', 'dateCreated', 'success', 'fieldId', 'entryId', 'siteId', 'userId', 'provider', 'modelId', 'latencyMs', 'totalTokens'];
        $sortField = (string)$request->getParam('sort.0.field', 'dateCreated');
        if (!in_array($sortField, $allowedSorts, true)) $sortField = 'dateCreated';
        $sortDirection = $request->getParam('sort.0.direction') === 'asc' ? SORT_ASC : SORT_DESC;
        $order = [$sortField => $sortDirection];
        if ($sortField !== 'id') $order['id'] = SORT_DESC;
        $rows = [];
        foreach ($query->orderBy($order)->offset(($page - 1) * $limit)->limit($limit)->all() as $log) {
            $none = Craft::t('app', 'None');
            $rows[] = [
                'id' => (int)$log->id,
                'dateCreated' => $log->dateCreated ? Craft::$app->getFormatter()->asDatetime($log->dateCreated, 'short') : $none,
                'success' => (bool)$log->success,
                'fieldId' => $log->fieldId ?? $none, 'entryId' => $log->entryId ?? $none,
                'siteId' => $log->siteId ?? $none, 'userId' => $log->userId ?? $none,
                'provider' => $log->provider ?: $none, 'modelId' => $log->modelId ?: $none,
                'latencyMs' => $log->latencyMs !== null ? Craft::t('autofill', '{latency} ms', ['latency' => number_format((int)$log->latencyMs)]) : $none,
                'totalTokens' => $log->totalTokens !== null ? number_format((int)$log->totalTokens) : $none,
                'detail' => [
                    'title' => Craft::t('app', 'Details'),
                    'content' => Craft::$app->getView()->renderTemplate('autofill/cp/logs/_detail', ['log' => $log]),
                ],
            ];
        }
        return $this->asJson(['pagination' => AdminTable::paginationLinks($page, $total, $limit), 'data' => $rows]);
    }
}
