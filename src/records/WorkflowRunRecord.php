<?php

declare(strict_types=1);

namespace jtdev\craftautofill\records;

use craft\db\ActiveRecord;

/** Durable generation and review state, independent of queue jobs and request logs. */
class WorkflowRunRecord extends ActiveRecord
{
    public static function tableName(): string
    {
        return '{{%autofill_runs}}';
    }
}
