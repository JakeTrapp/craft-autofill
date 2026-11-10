<?php

declare(strict_types=1);

namespace jtdev\craftautofill\records;

use craft\db\ActiveRecord;

/** Durable generation and review state, independent of queue jobs and request logs. */
class WorkflowRunRecord extends ActiveRecord
{
    /** Set by WorkflowRunService::start() when it created this run rather than returning an existing one. Not stored. */
    public bool $wasCreated = false;

    public static function tableName(): string
    {
        return '{{%autofill_runs}}';
    }
}
