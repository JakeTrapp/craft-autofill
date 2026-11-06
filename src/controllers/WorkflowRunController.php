<?php

declare(strict_types=1);

namespace jtdev\craftautofill\controllers;

use Craft;
use craft\web\Controller;
use jtdev\craftautofill\AutofillPlugin;
use Throwable;
use yii\web\Response;

class WorkflowRunController extends Controller
{
    public function actionPreview(): Response { return $this->dispatchOperation('preview'); }
    public function actionGenerate(): Response { return $this->dispatchRun('start'); }
    public function actionNormalize(): Response { return $this->dispatchOperation('normalize'); }
    public function actionApply(): Response { return $this->dispatchOperation('apply'); }

    public function actionNotifications(): Response { return $this->dispatchRun('notifications'); }
    public function actionStart(): Response { return $this->dispatchRun('start'); }
    public function actionStatus(): Response { return $this->dispatchRun('status'); }
    public function actionCurrent(): Response { return $this->dispatchRun('current'); }
    public function actionRegenerate(): Response { return $this->dispatchRun('regenerate'); }
    public function actionCancel(): Response { return $this->dispatchRun('cancel'); }
    public function actionDecide(): Response { return $this->dispatchRun('decide'); }

    private function dispatchRun(string $operation): Response
    {
        $this->requireCpRequest();
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        $this->requirePermission('accessPlugin-autofill');
        try {
            $actor = Craft::$app->getUser()->getIdentity();
            if ($actor === null) throw new \RuntimeException('Sign in to use Autofill.');
            $body = Craft::$app->getRequest()->getBodyParams();
            $plugin = AutofillPlugin::getInstance();
            $service = $plugin->getWorkflowRunService();
            if ($operation === 'notifications') return $this->asJson(['success' => true, ...$service->notificationState($actor)]);
            if ($operation === 'current') {
                $workflow = $plugin->getWorkflowService()->getByHandle((string)($body['workflowHandle'] ?? ''));
                $run = $workflow ? $service->current((int)$workflow->id, (int)($body['elementId'] ?? 0), isset($body['siteId']) ? (int)$body['siteId'] : null, $actor) : null;
                return $this->asJson(['success' => true, 'run' => $run ? $service->editorPayload($run, $actor) : null]);
            }
            if ($operation === 'start') {
                [$workflow, , $element] = $plugin->getWorkflowRuntimeService()->resolve(
                    (string)($body['workflowHandle'] ?? ''), (int)($body['elementId'] ?? 0),
                    isset($body['siteId']) ? (int)$body['siteId'] : null,
                );
                $run = $service->start($workflow, $element, $actor, (string)($body['userPrompt'] ?? ''));
                return $this->asJson(['success' => true, 'run' => $service->payload($run, $actor)]);
            }
            if ($operation === 'regenerate' || $operation === 'cancel') {
                $run = $service->$operation((int)($body['runId'] ?? 0), $actor);
                return $this->asJson(['success' => true, 'run' => $service->payload($run, $actor)]);
            }
            if ($operation === 'decide') {
                $run = $service->decide((int)($body['runId'] ?? 0), (int)($body['index'] ?? -1), $actor,
                    ($body['accept'] ?? false) === true, is_array($body['suggestion'] ?? null) ? $body['suggestion'] : []);
                return $this->asJson(['success' => true, 'run' => $run]);
            }
            $run = \jtdev\craftautofill\records\WorkflowRunRecord::findOne((int)($body['runId'] ?? 0));
            if (!$run) throw new \RuntimeException('This Autofill run is unavailable.');
            return $this->asJson(['success' => true, 'run' => $service->editorPayload($run, $actor)]);
        } catch (Throwable $e) {
            return $this->asJson(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    private function dispatchOperation(string $action): Response
    {
        $this->requireCpRequest();
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        try {
            $body = Craft::$app->getRequest()->getBodyParams();
            $runtime = AutofillPlugin::getInstance()->getWorkflowRuntimeService();
            [, $definition, $element] = $runtime->resolve(
                (string)($body['workflowHandle'] ?? ''),
                (int)($body['elementId'] ?? $body['entryId'] ?? 0),
                isset($body['siteId']) ? (int)$body['siteId'] : null,
            );
            if ($action === 'apply') $this->requirePermission('autofill-review');
            if ($action === 'normalize' && !AutofillPlugin::getInstance()->getSettings()->testMode) throw new \RuntimeException('Manual response parsing is only available in test mode.');
            $prompt = (string)($body['userPrompt'] ?? '');
            $result = match ($action) {
                'preview' => ['prompt' => $runtime->preview($definition, $element, $prompt)],
                'generate' => ['suggestions' => $runtime->generate($definition, $element, $prompt)],
                'normalize' => ['suggestions' => $runtime->normalizePreview((string)($body['rawResponse'] ?? ''), $definition, $element)],
                'apply' => ['applied' => $runtime->apply($definition, $element, is_array($body['suggestion'] ?? null) ? $body['suggestion'] : [])],
            };
            return $this->asJson(['success' => true, ...$result]);
        } catch (Throwable $e) {
            return $this->asJson(['success' => false, 'error' => $e->getMessage()]);
        }
    }
}
