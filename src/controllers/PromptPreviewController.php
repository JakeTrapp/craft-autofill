<?php

declare(strict_types=1);

namespace jtdev\craftautofill\controllers;

use Craft;
use craft\web\Controller;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\fields\AutofillField;
use RuntimeException;
use Throwable;
use yii\web\Response;

class PromptPreviewController extends Controller
{
    public function actionBuildPrompt(): Response
    {
        $this->requireCpRequest();
        $this->requirePostRequest();
        $this->requireAcceptsJson();

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
                ]);
            }

            AutofillPlugin::getInstance()->getWorkflowRuntimeService()->authorizeField($fieldId, $entryId, $siteId);

            $plugin = AutofillPlugin::getInstance();
            $element = $entryId ? Craft::$app->getElements()->getElementById($entryId, \craft\elements\Entry::class, $siteId) : null;
            $prompt = $element
                ? $plugin->getWorkflowRuntimeService()->preview($this->resolveAutofillField($fieldId), $element, (string)($body['userPrompt'] ?? ''))
                : $plugin->getAiService()->buildAutofillPromptPreview((string)($body['userPrompt'] ?? ''), $fieldId, $entryId, $siteId);

            return $this->asJson([
                'success' => true,
                'prompt' => $prompt,
            ]);
        } catch (Throwable $exception) {
            Craft::error($exception->getMessage(), __METHOD__);

            return $this->asJson([
                'success' => false,
                'error' => Craft::$app->getConfig()->getGeneral()->devMode
                    ? $exception->getMessage()
                    : 'Could not build prompt preview.',
            ]);
        }
    }

    public function actionGenerateSuggestions(): Response
    {
        $this->requireCpRequest();
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        $this->requirePermission('accessPlugin-autofill');
        try {
            $body = Craft::$app->getRequest()->getBodyParams();
            $plugin = AutofillPlugin::getInstance();
            $field = $this->resolveAutofillField((int)($body['fieldId'] ?? 0));
            $workflow = $plugin->getWorkflowService()->getByHandle($field->workflowHandle);
            if (!$workflow) throw new RuntimeException('Select a saved workflow before starting Autofill.');
            $element = Craft::$app->getElements()->getElementById((int)($body['entryId'] ?? 0), \craft\elements\Entry::class, isset($body['siteId']) ? (int)$body['siteId'] : null);
            if (!$element) throw new RuntimeException('Save the content before starting Autofill.');
            $run = $plugin->getWorkflowRunService()->start($workflow, $element, Craft::$app->getUser()->getIdentity(), (string)($body['userPrompt'] ?? ''));
            return $this->asJson(['success' => true, 'run' => $plugin->getWorkflowRunService()->payload($run, Craft::$app->getUser()->getIdentity())]);
        } catch (Throwable $error) {
            return $this->asJson(['success' => false, 'error' => $error->getMessage()]);
        }
    }

    private function resolveAutofillField(int $fieldId): AutofillField
    {
        $field = Craft::$app->getFields()->getFieldById($fieldId);
        if (!$field instanceof AutofillField) {
            throw new RuntimeException(sprintf('Autofill field %d could not be found.', $fieldId));
        }

        if ($field->workflowHandle !== '') {
            $workflow = AutofillPlugin::getInstance()->getWorkflowService()->resolveForField($field);
            if ($workflow === null) {
                throw new RuntimeException('This Autofill workflow is unavailable.');
            }
            $resolved = AutofillPlugin::getInstance()->getWorkflowService()->asField($workflow);
            $resolved->id = $field->id;
            $resolved->uid = $field->uid;
            $resolved->handle = $field->handle;
            return $resolved;
        }
        return $field;
    }

}
