<?php

declare(strict_types=1);

namespace jtdev\craftautofill\records;

use craft\db\ActiveRecord;

/**
 * @property int $id
 * @property string $handle
 * @property string $name
 * @property string $scope
 * @property string|null $entryTypeUid
 * @property string|null $volumeUid
 * @property string|null $modelConfigUid
 * @property string|null $sourceFieldUid
 * @property string|null $legacyConfigJson
 * @property string|null $globalPrompt
 * @property string|null $actionButtonLabel
 * @property bool $showUserPromptInput
 * @property bool $showOnSidebar
 * @property string $rowsJson
 * @property string $contextRowsJson
 */
class WorkflowRecord extends ActiveRecord
{
    public static function tableName(): string
    {
        return '{{%autofill_workflows}}';
    }
}
