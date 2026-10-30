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
    public function actionGenerate(): Response { return $this->dispatchOperation('generate'); }
    public function actionNormalize(): Response { return $this->dispatchOperation('normalize'); }
    public function actionApply(): Response { return $this->dispatchOperation('apply'); }

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
            $prompt = (string)($body['userPrompt'] ?? '');
            $result = match ($action) {
                'preview' => ['prompt' => $runtime->preview($definition, $element, $prompt)],
                'generate' => ['suggestions' => $runtime->generate($definition, $element, $prompt)],
                'normalize' => ['suggestions' => $runtime->normalize((string)($body['rawResponse'] ?? ''), $definition, $element)],
                'apply' => ['applied' => $runtime->apply($definition, $element, is_array($body['suggestion'] ?? null) ? $body['suggestion'] : [])],
            };
            return $this->asJson(['success' => true, ...$result]);
        } catch (Throwable $e) {
            return $this->asJson(['success' => false, 'error' => $e->getMessage()]);
        }
    }
}
