<?php

declare(strict_types=1);

namespace jtdev\craftautofill\console\controllers;

use craft\console\Controller;
use jtdev\craftautofill\AutofillPlugin;
use yii\console\ExitCode;

/** Runs scheduled automations. Add `* * * * * php craft autofill/automations/tick` to cron for exact timing. */
class AutomationsController extends Controller
{
    /** Queues every automation whose scheduled time has passed. */
    public function actionTick(): int
    {
        $service = AutofillPlugin::getInstance()->getAutomationService();
        $service->recordCronTick();
        $queued = $service->tick();
        if ($this->interactive || $queued > 0) {
            $this->stdout(sprintf("Queued %d automation%s.\n", $queued, $queued === 1 ? '' : 's'));
        }
        return ExitCode::OK;
    }

    /** Runs one automation now, in this process. */
    public function actionRun(int $id): int
    {
        $summary = AutofillPlugin::getInstance()->getAutomationService()->run($id, 'manual');
        if ($summary === null) {
            $automation = AutofillPlugin::getInstance()->getAutomationService()->getById($id);
            $this->stderr(($automation?->pausedReason ?: 'The automation could not run.') . "\n");
            return ExitCode::UNSPECIFIED_ERROR;
        }
        $this->stdout(sprintf("Started %d, skipped %d, failed %d.\n", $summary['started'], $summary['skipped'], $summary['failed']));
        return $summary['failed'] > 0 ? ExitCode::UNSPECIFIED_ERROR : ExitCode::OK;
    }
}
