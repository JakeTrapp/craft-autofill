<?php

declare(strict_types=1);

namespace jtdev\craftautofill\jobs;

use craft\queue\BaseJob;
use jtdev\craftautofill\AutofillPlugin;

class RunWorkflowJob extends BaseJob
{
    public int $runId;

    public function execute($queue): void
    {
        AutofillPlugin::getInstance()->getWorkflowRunService()->process($this->runId);
    }

    protected function defaultDescription(): ?string
    {
        return 'Generating Autofill results';
    }
}
