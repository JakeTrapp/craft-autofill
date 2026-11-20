<?php

declare(strict_types=1);

namespace jtdev\craftautofill\jobs;

use Craft;
use craft\queue\BaseJob;
use jtdev\craftautofill\AutofillPlugin;
use yii\queue\RetryableJobInterface;

/** Starts runs for everything an automation matches. Each run then queues its own generation job. */
class RunAutomationJob extends BaseJob implements RetryableJobInterface
{
    public int $automationId;
    /** 'schedule' or 'manual'. */
    public string $trigger = 'schedule';

    public function execute($queue): void
    {
        AutofillPlugin::getInstance()->getAutomationService()->run(
            $this->automationId,
            $this->trigger === 'manual' ? 'manual' : 'schedule',
            retryIfBusy: true,
        );
    }

    public function getTtr(): int
    {
        // Starting an item checks access and fingerprints fields; it never calls the AI provider.
        return 3600;
    }

    public function canRetry($attempt, $error): bool
    {
        // Items that already started are skipped as unchanged, so one retry continues where it stopped.
        return $attempt < 2;
    }

    protected function defaultDescription(): ?string
    {
        return Craft::t('autofill', 'Running Autofill automation');
    }
}
