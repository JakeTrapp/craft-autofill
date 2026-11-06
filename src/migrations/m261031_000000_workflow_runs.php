<?php

declare(strict_types=1);

namespace jtdev\craftautofill\migrations;

use craft\db\Migration;
use jtdev\craftautofill\records\WorkflowRecord;

/** Existing definitions stay shared and administrator-managed after upgrading. */
class m261031_000000_workflow_runs extends Migration
{
    public function safeUp(): bool
    {
        $workflows = WorkflowRecord::tableName();
        foreach ([
            'ownerId' => $this->integer(),
            'visibility' => $this->string(16)->notNull()->defaultValue('public'),
            'adminManaged' => $this->boolean()->notNull()->defaultValue(true),
            'archived' => $this->boolean()->notNull()->defaultValue(false),
        ] as $name => $type) {
            if ($this->db->getTableSchema($workflows, true)->getColumn($name) === null) {
                $this->addColumn($workflows, $name, $type);
            }
        }
        $runs = '{{%autofill_runs}}';
        if (!$this->db->tableExists($runs)) {
            $this->createTable($runs, [
                'id' => $this->primaryKey(),
                'workflowId' => $this->integer()->notNull(),
                'initiatorId' => $this->integer(),
                'visibility' => $this->string(16)->notNull(),
                'elementId' => $this->integer()->notNull(),
                'elementType' => $this->string(16)->notNull(),
                'siteId' => $this->integer()->notNull(),
                'batchUid' => $this->string(36),
                'status' => $this->string(24)->notNull()->defaultValue('queued'),
                'definitionJson' => $this->mediumText()->notNull(),
                'userPrompt' => $this->text(),
                'baselineJson' => $this->mediumText(),
                'suggestionsJson' => $this->mediumText(),
                'errorMessage' => $this->text(),
                'generationCompletedAt' => $this->dateTime(),
                'dateCreated' => $this->dateTime()->notNull(),
                'dateUpdated' => $this->dateTime()->notNull(),
                'uid' => $this->uid(),
            ]);
            $this->createIndex(null, $runs, ['workflowId', 'status']);
            $this->createIndex(null, $runs, ['elementId', 'siteId']);
            $this->createIndex(null, $runs, ['initiatorId']);
            $this->createIndex(null, $runs, ['batchUid']);
            // Preserve historical identity if the associated user/content is deleted.
            $this->addForeignKey(null, $runs, ['workflowId'], $workflows, ['id'], 'RESTRICT');
        }
        return true;
    }

    public function safeDown(): bool
    {
        return true;
    }
}
