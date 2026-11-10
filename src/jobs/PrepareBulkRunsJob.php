<?php

declare(strict_types=1);

namespace jtdev\craftautofill\jobs;

use Craft;
use craft\elements\Asset;
use craft\elements\Entry;
use craft\elements\User;
use craft\queue\BaseJob;
use jtdev\craftautofill\AutofillPlugin;
use Throwable;
use yii\queue\RetryableJobInterface;

/**
 * Creates the runs for a bulk submission outside the web request, so large batches don't hit PHP time limits.
 * Each created run queues its own generation job. Items that can't start are recorded as failed runs.
 */
class PrepareBulkRunsJob extends BaseJob implements RetryableJobInterface
{
    public int $workflowId;
    /** @var int[] */
    public array $elementIds = [];
    public int $siteId;
    public int $actorId;
    public string $userPrompt = '';
    public string $batchUid;

    public function execute($queue): void
    {
        $plugin = AutofillPlugin::getInstance();
        $workflow = $plugin->getWorkflowService()->getById($this->workflowId);
        $actor = Craft::$app->getUsers()->getUserById($this->actorId);
        if ($workflow === null || $workflow->archived) {
            Craft::warning(sprintf('Autofill bulk batch %s skipped: the workflow is unavailable.', $this->batchUid), __METHOD__);
            return;
        }
        if (!$actor || $actor->getStatus() !== User::STATUS_ACTIVE) {
            Craft::warning(sprintf('Autofill bulk batch %s skipped: the initiating user is no longer active.', $this->batchUid), __METHOD__);
            return;
        }

        $runs = $plugin->getWorkflowRunService();
        $elementType = $workflow->scope === 'asset' ? Asset::class : Entry::class;
        $total = count($this->elementIds);
        foreach (array_values($this->elementIds) as $i => $id) {
            $this->setProgress($queue, $total > 0 ? $i / $total : 1, Craft::t('autofill', 'Preparing {step} of {total}', ['step' => $i + 1, 'total' => $total]));
            $element = Craft::$app->getElements()->getElementById((int)$id, $elementType, $this->siteId);
            if ($element === null) {
                Craft::warning(sprintf('Autofill bulk batch %s: element %d is unavailable.', $this->batchUid, $id), __METHOD__);
                continue;
            }
            try {
                $runs->start($workflow, $element, $actor, $this->userPrompt, $this->batchUid);
            } catch (Throwable $error) {
                $runs->recordFailedStart($workflow, $element, $actor, $this->batchUid, $error->getMessage());
            }
        }
    }

    public function getTtr(): int
    {
        // Preparing an item checks access and fingerprints its fields; it never calls the AI provider.
        return min(3600, 60 + count($this->elementIds) * 5);
    }

    public function canRetry($attempt, $error): bool
    {
        // start() returns existing runs, so a retry continues the batch without duplicating it.
        return $attempt < 2;
    }

    protected function defaultDescription(): ?string
    {
        return Craft::t('autofill', 'Preparing Autofill bulk run');
    }
}
