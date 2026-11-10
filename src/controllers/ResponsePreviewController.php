<?php

declare(strict_types=1);

namespace jtdev\craftautofill\controllers;

use Craft;
use craft\web\Controller;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\helpers\ErrorMessage;
use Throwable;
use yii\web\Response;

class ResponsePreviewController extends Controller
{
    public function actionNormalizeResponse(): Response
    {
        $this->requireCpRequest();
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        $this->requirePermission('accessPlugin-autofill');

        try {
            $body = Craft::$app->getRequest()->getBodyParams();
            $fieldId = (int)($body['fieldId'] ?? 0);
            $entryIdRaw = $body['entryId'] ?? null;
            $siteIdRaw = $body['siteId'] ?? null;
            $entryId = is_numeric($entryIdRaw) && (int)$entryIdRaw > 0 ? (int)$entryIdRaw : null;
            $siteId = is_numeric($siteIdRaw) && (int)$siteIdRaw > 0 ? (int)$siteIdRaw : null;

            if ($fieldId <= 0) {
                return $this->asJson([
                    'success' => false,
                    'error' => 'Autofill field ID was invalid.',
                    'suggestions' => [],
                ]);
            }

            $plugin = AutofillPlugin::getInstance();
            $authorized = $plugin->getWorkflowRuntimeService()->authorizeField($fieldId, $entryId, $siteId);
            $rawResponse = (string)($body['rawResponse'] ?? '');
            $result = $authorized === null
                ? $plugin->getAiService()->normalizeAutofillResponse($rawResponse, $fieldId, $entryId, $siteId)
                : $plugin->getAiService()->responseNormalizer->normalizeForElement($rawResponse, ...$authorized);

            return $this->asJson([
                'success' => $result->success,
                'suggestions' => $result->suggestions,
                'error' => $result->error,
            ]);
        } catch (Throwable $exception) {
            Craft::error($exception->getMessage(), __METHOD__);

            return $this->asJson([
                'success' => false,
                'suggestions' => [],
                'error' => ErrorMessage::forUser($exception, 'Could not normalize response.'),
            ]);
        }
    }

    public function actionApplySuggestion(): Response
    {
        $this->requireCpRequest();
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        $this->requirePermission('accessPlugin-autofill');

        try {
            $body = Craft::$app->getRequest()->getBodyParams();
            $fieldId = (int)($body['fieldId'] ?? 0);
            $entryId = (int)($body['entryId'] ?? 0);
            $siteIdRaw = $body['siteId'] ?? null;
            $siteId = is_numeric($siteIdRaw) ? (int)$siteIdRaw : null;
            $suggestion = is_array($body['suggestion'] ?? null) ? $body['suggestion'] : [];

            if ($fieldId <= 0) {
                return $this->asJson([
                    'success' => false,
                    'error' => 'Autofill field ID was invalid.',
                ]);
            }

            AutofillPlugin::getInstance()->getWorkflowRuntimeService()->authorizeField($fieldId, $entryId, $siteId);

            $applied = AutofillPlugin::getInstance()
                ->getEntrySuggestionApplyService()
                ->applySuggestion($fieldId, $entryId, $siteId, $suggestion);

            return $this->asJson([
                'success' => true,
                'applied' => $applied,
                'error' => null,
            ]);
        } catch (Throwable $exception) {
            Craft::error($exception->getMessage(), __METHOD__);

            return $this->asJson([
                'success' => false,
                'error' => ErrorMessage::forUser($exception, 'Could not apply suggestion.'),
            ]);
        }
    }
}
