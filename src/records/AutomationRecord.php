<?php

declare(strict_types=1);

namespace jtdev\craftautofill\records;

use craft\db\ActiveRecord;

/**
 * @property int $id
 * @property string $name
 * @property int $workflowId
 * @property int|null $ownerId
 * @property int|null $runAsId
 * @property bool $enabled
 * @property string|null $pausedReason
 * @property string $triggersJson
 * @property string|null $conditionJson
 * @property string $siteIdsJson
 * @property string|null $userPrompt
 * @property int|null $privateOwnerId
 * @property int|null $maxRuns
 * @property int|null $maxItemsPerRun
 * @property int|null $minMinutesBetweenRuns
 * @property string|null $acknowledgedAutomaticHash
 * @property string|null $acknowledgedWorkflowHash
 * @property int $runCount
 * @property string|null $nextRunAt
 * @property string|null $statusCheckedAt
 * @property string|null $lastRunAt
 * @property string|null $lastBatchUid
 * @property string|null $lastRunSummaryJson
 * @property string $dateCreated
 * @property string $dateUpdated
 * @property string $uid
 */
class AutomationRecord extends ActiveRecord
{
    public static function tableName(): string
    {
        return '{{%autofill_automations}}';
    }
}
