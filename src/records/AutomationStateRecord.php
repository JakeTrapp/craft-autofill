<?php

declare(strict_types=1);

namespace jtdev\craftautofill\records;

use craft\db\ActiveRecord;

/**
 * What an automation last saw for one element on one site.
 *
 * @property int $id
 * @property int $automationId
 * @property int $elementId
 * @property int $siteId
 * @property string|null $contextFingerprint Context fields when the automation last started a run.
 * @property string|null $watchFingerprint Watched fields when the element was last saved.
 * @property int|null $lastRunId
 * @property string|null $lastRunAt
 * @property string|null $failedAt When an item last failed to start or generate with this context.
 * @property string|null $pendingAt When a debounced event should fire.
 * @property string $dateCreated
 * @property string $dateUpdated
 * @property string $uid
 */
class AutomationStateRecord extends ActiveRecord
{
    public static function tableName(): string
    {
        return '{{%autofill_automation_state}}';
    }
}
