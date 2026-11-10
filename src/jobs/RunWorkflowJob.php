<?php

declare(strict_types=1);

namespace jtdev\craftautofill\jobs;

use craft\queue\BaseJob;
use jtdev\craftautofill\AutofillPlugin;
use yii\queue\RetryableJobInterface;

class RunWorkflowJob extends BaseJob implements RetryableJobInterface
{
    public int $runId;

    public function execute($queue): void
    {
        AutofillPlugin::getInstance()->getWorkflowRunService()->process($this->runId);
    }

    /** A run can make a generation request and one repair request, plus saving time. */
    public static function ttrSeconds(): int
    {
        return AutofillPlugin::getInstance()->getSettings()->getMaxRequestTimeout() * 2 + 120;
    }

    public function getTtr(): int
    {
        return self::ttrSeconds();
    }

    /** Retrying would repeat paid model requests; interrupted runs are failed by the stale-run sweep instead. */
    public function canRetry($attempt, $error): bool
    {
        return false;
    }

    protected function defaultDescription(): ?string
    {
        return 'Generating Autofill results';
    }
}
