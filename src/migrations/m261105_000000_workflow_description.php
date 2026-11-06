<?php

declare(strict_types=1);

namespace jtdev\craftautofill\migrations;

use craft\db\Migration;
use jtdev\craftautofill\records\WorkflowRecord;

class m261105_000000_workflow_description extends Migration
{
    public function safeUp(): bool
    {
        $table = WorkflowRecord::tableName();
        if ($this->db->getTableSchema($table, true)?->getColumn('description') === null) {
            $this->addColumn($table, 'description', $this->text());
        }
        return true;
    }

    public function safeDown(): bool
    {
        return false;
    }
}
