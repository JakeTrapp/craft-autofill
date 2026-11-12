<?php

declare(strict_types=1);

namespace jtdev\craftautofill\records;

use craft\db\ActiveRecord;

/**
 * Durable generation and review state, independent of queue jobs and request logs.
 *
 * @property int $id
 * @property int $workflowId
 * @property int|null $initiatorId
 * @property string $visibility
 * @property int|null $privateOwnerId
 * @property int $elementId
 * @property string $elementType
 * @property int $siteId
 * @property string|null $batchUid
 * @property string $status
 * @property string $definitionJson
 * @property string|null $userPrompt
 * @property string|null $baselineJson
 * @property string|null $suggestionsJson
 * @property string|null $errorMessage
 * @property string|null $generationCompletedAt
 * @property string $dateCreated
 * @property string $dateUpdated
 * @property string $uid
 */
class WorkflowRunRecord extends ActiveRecord
{
    /** Set by WorkflowRunService::start() when it created this run rather than returning an existing one. Not stored. */
    public bool $wasCreated = false;

    public static function tableName(): string
    {
        return '{{%autofill_runs}}';
    }
}
