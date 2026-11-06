<?php

declare(strict_types=1);

namespace jtdev\craftautofill\controllers;

use Craft;
use craft\web\Controller;
use jtdev\craftautofill\AutofillPlugin;
use Throwable;
use yii\web\Response;

class FieldSettingsController extends Controller
{
    public function actionSupportedFields(): Response
    {
        $this->requireCpRequest();
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        $this->requirePermission('accessPlugin-autofill');

        try {
            $entryTypeUid = trim((string)Craft::$app->getRequest()->getBodyParam('entryTypeUid', ''));
            if ($entryTypeUid === '') {
                return $this->asJson([
                    'success' => true,
                    'fields' => [],
                ]);
            }

            $entryType = Craft::$app->getEntries()->getEntryTypeByUid($entryTypeUid);
            if ($entryType === null) {
                return $this->asJson([
                    'success' => false,
                    'error' => 'Selected entry type could not be found.',
                    'fields' => [],
                ]);
            }

            $actor = Craft::$app->getUser()->getIdentity();
            $workflow = new \jtdev\craftautofill\models\Workflow(['entryTypeUid' => $entryTypeUid]);
            $access = AutofillPlugin::getInstance()->getWorkflowAccess();
            if (!$access->canConfigureScope($workflow, $actor)) throw new \RuntimeException('This content scope is unavailable.');
            return $this->asJson([
                'success' => true,
                'fields' => array_values(array_filter(AutofillPlugin::getInstance()
                    ->getFieldDiscoveryService()
                    ->getSupportedEntryTypeFields($entryType), fn(array $field): bool => $access->canUseField($workflow, (string)$field['uid'], $actor))),
            ]);
        } catch (Throwable $exception) {
            Craft::error($exception->getMessage(), __METHOD__);

            return $this->asJson([
                'success' => false,
                'error' => Craft::$app->getConfig()->getGeneral()->devMode
                    ? $exception->getMessage()
                    : 'Could not load fields for the selected entry type.',
                'fields' => [],
            ]);
        }
    }
}
