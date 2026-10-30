<?php

declare(strict_types=1);

namespace jtdev\craftautofill\migrations;

use craft\db\Migration;
use jtdev\craftautofill\records\WorkflowRecord;
use jtdev\craftautofill\services\workflows\WorkflowService;

class m261028_000000_create_workflows extends Migration
{
    public function safeUp(): bool
    {
        $tableName = WorkflowRecord::tableName();
        if (!$this->db->tableExists($tableName)) {
            $this->createTable($tableName, [
                'id' => $this->primaryKey(),
                'handle' => $this->string(255)->notNull(),
                'sourceFieldUid' => $this->string(36),
                'legacyConfigJson' => $this->mediumText(),
                'name' => $this->string(255)->notNull(),
                'scope' => $this->string(16)->notNull()->defaultValue('entry'),
                'entryTypeUid' => $this->string(36),
                'volumeUid' => $this->string(36),
                'modelConfigUid' => $this->string(36),
                'globalPrompt' => $this->text(),
                'actionButtonLabel' => $this->string(255),
                'showUserPromptInput' => $this->boolean()->notNull()->defaultValue(true),
                'showOnSidebar' => $this->boolean()->notNull()->defaultValue(false),
                'rowsJson' => $this->mediumText()->notNull(),
                'contextRowsJson' => $this->mediumText()->notNull(),
                'dateCreated' => $this->dateTime()->notNull(),
                'dateUpdated' => $this->dateTime()->notNull(),
                'uid' => $this->uid(),
            ]);
            $this->createIndex(null, $tableName, ['handle'], true);
            $this->createIndex(null, $tableName, ['scope']);
            $this->createIndex(null, $tableName, ['entryTypeUid']);
            $this->createIndex(null, $tableName, ['volumeUid']);
        }

        (new WorkflowService())->migrateLegacyFields();
        return true;
    }

    public function safeDown(): bool
    {
        // Workflow definitions are live site data and must survive plugin rollbacks.
        return true;
    }
}
