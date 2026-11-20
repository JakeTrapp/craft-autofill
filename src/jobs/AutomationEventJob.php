<?php

declare(strict_types=1);

namespace jtdev\craftautofill\jobs;

use Craft;
use craft\queue\BaseJob;
use jtdev\craftautofill\AutofillPlugin;
use yii\queue\RetryableJobInterface;

/** Fires an automation for one changed item once its delay has passed without further changes. */
class AutomationEventJob extends BaseJob implements RetryableJobInterface
{
    public int $automationId;
    public int $elementId;
    public int $siteId;
    public ?string $triggerHash = null;

    public function execute($queue): void
    {
        AutofillPlugin::getInstance()->getAutomationService()->processEvent($this->automationId, $this->elementId, $this->siteId, $this->triggerHash);
    }

    public function getTtr(): int
    {
        return 120;
    }

    public function canRetry($attempt, $error): bool
    {
        return $attempt < 3;
    }

    protected function defaultDescription(): ?string
    {
        return Craft::t('autofill', 'Checking Autofill automation');
    }
}
