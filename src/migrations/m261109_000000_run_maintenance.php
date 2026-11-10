<?php

declare(strict_types=1);

namespace jtdev\craftautofill\migrations;

use craft\db\Migration;
use craft\db\Query;
use craft\db\Table;
use craft\helpers\Db;
use jtdev\craftautofill\records\WorkflowRunRecord;

/**
 * Indexes run lookups by status, and removes runs when their content or site is permanently deleted.
 * Trashed content keeps its runs until Craft's garbage collection hard-deletes it, so restoring content restores its runs.
 * Runs started by deleted users are kept so administrators can still review them.
 */
class m261109_000000_run_maintenance extends Migration
{
    public function safeUp(): bool
    {
        $runs = WorkflowRunRecord::tableName();
        if (!$this->db->tableExists($runs)) {
            return true;
        }

        if (!Db::findIndex($runs, ['status', 'id'], db: $this->db)) {
            $this->createIndex(null, $runs, ['status', 'id']);
        }

        // Foreign keys can't be added while orphaned rows exist.
        $this->delete($runs, ['not in', 'elementId', (new Query())->select('id')->from(Table::ELEMENTS)]);
        $this->delete($runs, ['not in', 'siteId', (new Query())->select('id')->from(Table::SITES)]);

        if (!Db::findForeignKey($runs, 'elementId', $this->db)) {
            $this->addForeignKey(null, $runs, ['elementId'], Table::ELEMENTS, ['id'], 'CASCADE');
        }
        if (!Db::findForeignKey($runs, 'siteId', $this->db)) {
            $this->addForeignKey(null, $runs, ['siteId'], Table::SITES, ['id'], 'CASCADE');
        }
        return true;
    }

    public function safeDown(): bool
    {
        return false;
    }
}
