<?php

declare(strict_types=1);

namespace jtdev\craftautofill\migrations;

use craft\db\Migration;
use jtdev\craftautofill\records\AiRequestLogRecord;
use jtdev\craftautofill\records\WorkflowRecord;
use jtdev\craftautofill\records\WorkflowRunRecord;

class Install extends Migration
{
    public function safeUp(): bool
    {
        $tableName = AiRequestLogRecord::tableName();

        if (!$this->db->tableExists($tableName)) {
            $this->createTable($tableName, [
                'id' => $this->primaryKey(),
                'fieldId' => $this->integer(),
                'entryId' => $this->integer(),
                'siteId' => $this->integer(),
                'userId' => $this->integer(),
                'provider' => $this->string(40)->notNull(),
                'modelConfigUid' => $this->string(36),
                'modelId' => $this->string(255),
                'reasoningEffort' => $this->string(20),
                'requestPrompt' => $this->text()->notNull(),
                'requestPayloadJson' => $this->text(),
                'responseRawText' => $this->text(),
                'responsePayloadJson' => $this->text(),
                'success' => $this->boolean()->notNull()->defaultValue(false),
                'errorMessage' => $this->text(),
                'latencyMs' => $this->integer(),
                'inputTokens' => $this->integer(),
                'outputTokens' => $this->integer(),
                'totalTokens' => $this->integer(),
                'providerResponseId' => $this->string(255),
                'dateCreated' => $this->dateTime()->notNull(),
                'dateUpdated' => $this->dateTime()->notNull(),
                'uid' => $this->uid(),
            ]);

            $this->createIndex(null, $tableName, ['fieldId']);
            $this->createIndex(null, $tableName, ['entryId']);
            $this->createIndex(null, $tableName, ['siteId']);
            $this->createIndex(null, $tableName, ['userId']);
            $this->createIndex(null, $tableName, ['provider']);
            $this->createIndex(null, $tableName, ['modelConfigUid']);
            $this->createIndex(null, $tableName, ['success']);
            $this->createIndex(null, $tableName, ['dateCreated']);
        }

        $workflowTable = WorkflowRecord::tableName();
        if (!$this->db->tableExists($workflowTable)) {
            $this->createTable($workflowTable, [
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
                'description' => $this->text(),
                'actionButtonLabel' => $this->string(255),
                'showUserPromptInput' => $this->boolean()->notNull()->defaultValue(true),
                'showOnSidebar' => $this->boolean()->notNull()->defaultValue(false),
                'rowsJson' => $this->mediumText()->notNull(),
                'contextRowsJson' => $this->mediumText()->notNull(),
                'dateCreated' => $this->dateTime()->notNull(),
                'dateUpdated' => $this->dateTime()->notNull(),
                'uid' => $this->uid(),
            ]);
            $this->createIndex(null, $workflowTable, ['handle'], true);
            $this->createIndex(null, $workflowTable, ['scope']);
            $this->createIndex(null, $workflowTable, ['entryTypeUid']);
            $this->createIndex(null, $workflowTable, ['volumeUid']);
        }

        (new m261031_000000_workflow_runs())->safeUp();
        (new m261101_000000_private_run_ownership())->safeUp();
        (new m261109_000000_run_maintenance())->safeUp();
        return true;
    }

    /** Uninstalling removes all Autofill data. Runs go first because they reference workflows. */
    public function safeDown(): bool
    {
        $this->dropTableIfExists(WorkflowRunRecord::tableName());
        $this->dropTableIfExists(WorkflowRecord::tableName());
        $this->dropTableIfExists(AiRequestLogRecord::tableName());
        return true;
    }
}
