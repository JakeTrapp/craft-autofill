<?php

declare(strict_types=1);

namespace jtdev\craftautofill\migrations;

use craft\db\Migration;
use craft\db\Table;
use craft\helpers\Db;
use jtdev\craftautofill\records\AutomationRecord;
use jtdev\craftautofill\records\AutomationStateRecord;
use jtdev\craftautofill\records\WorkflowRecord;
use jtdev\craftautofill\records\WorkflowRunRecord;

/** Adds automations, their per-element state, and attributes runs to the automation that started them. */
class m261117_000000_automations extends Migration
{
    public function safeUp(): bool
    {
        $automations = AutomationRecord::tableName();
        if (!$this->db->tableExists($automations)) {
            $this->createTable($automations, [
                'id' => $this->primaryKey(),
                'name' => $this->string(255)->notNull(),
                'workflowId' => $this->integer()->notNull(),
                'ownerId' => $this->integer(),
                'runAsId' => $this->integer(),
                'enabled' => $this->boolean()->notNull()->defaultValue(true),
                'pausedReason' => $this->text(),
                'triggersJson' => $this->text()->notNull(),
                'conditionJson' => $this->mediumText(),
                'siteIdsJson' => $this->text()->notNull(),
                'userPrompt' => $this->text(),
                'privateOwnerId' => $this->integer(),
                'maxRuns' => $this->integer(),
                'maxItemsPerRun' => $this->integer(),
                'minMinutesBetweenRuns' => $this->integer(),
                'acknowledgedAutomaticHash' => $this->string(64),
                'acknowledgedWorkflowHash' => $this->string(64),
                'runCount' => $this->integer()->notNull()->defaultValue(0),
                'nextRunAt' => $this->dateTime(),
                'lastRunAt' => $this->dateTime(),
                'lastBatchUid' => $this->string(36),
                'lastRunSummaryJson' => $this->text(),
                'dateCreated' => $this->dateTime()->notNull(),
                'dateUpdated' => $this->dateTime()->notNull(),
                'uid' => $this->uid(),
            ]);
            $this->createIndex(null, $automations, ['workflowId']);
            $this->createIndex(null, $automations, ['enabled', 'nextRunAt']);
            $this->createIndex(null, $automations, ['ownerId']);
            $this->addForeignKey(null, $automations, ['workflowId'], WorkflowRecord::tableName(), ['id'], 'CASCADE');
            $this->addForeignKey(null, $automations, ['ownerId'], Table::USERS, ['id'], 'SET NULL');
            $this->addForeignKey(null, $automations, ['runAsId'], Table::USERS, ['id'], 'SET NULL');
            // privateOwnerId has no foreign key: a deleted reviewer must pause the automation, not silently fall back to the owner.
        }

        $state = AutomationStateRecord::tableName();
        if (!$this->db->tableExists($state)) {
            $this->createTable($state, [
                'id' => $this->primaryKey(),
                'automationId' => $this->integer()->notNull(),
                'elementId' => $this->integer()->notNull(),
                'siteId' => $this->integer()->notNull(),
                'contextFingerprint' => $this->string(64),
                'watchFingerprint' => $this->string(64),
                'lastRunId' => $this->integer(),
                'lastRunAt' => $this->dateTime(),
                'failedAt' => $this->dateTime(),
                'pendingAt' => $this->dateTime(),
                'dateCreated' => $this->dateTime()->notNull(),
                'dateUpdated' => $this->dateTime()->notNull(),
                'uid' => $this->uid(),
            ]);
            $this->createIndex(null, $state, ['automationId', 'elementId', 'siteId'], true);
            $this->addForeignKey(null, $state, ['automationId'], $automations, ['id'], 'CASCADE');
            $this->addForeignKey(null, $state, ['elementId'], Table::ELEMENTS, ['id'], 'CASCADE');
            $this->addForeignKey(null, $state, ['siteId'], Table::SITES, ['id'], 'CASCADE');
        }

        $runs = WorkflowRunRecord::tableName();
        if ($this->db->tableExists($runs) && $this->db->getTableSchema($runs, true)->getColumn('automationId') === null) {
            $this->addColumn($runs, 'automationId', $this->integer());
            $this->createIndex(null, $runs, ['automationId']);
        }
        if ($this->db->tableExists($runs) && !Db::findForeignKey($runs, 'automationId', $this->db)) {
            // Deleting an automation keeps its runs for review; they just lose the link.
            $this->addForeignKey(null, $runs, ['automationId'], $automations, ['id'], 'SET NULL');
        }
        return true;
    }

    public function safeDown(): bool
    {
        return false;
    }
}
