<?php

declare(strict_types=1);

namespace jtdev\craftautofill\migrations;

use craft\db\Migration;
use craft\db\Query;
use craft\helpers\Json;
use jtdev\craftautofill\records\WorkflowRunRecord;

class m261101_000000_private_run_ownership extends Migration
{
    public function safeUp(): bool
    {
        $table = WorkflowRunRecord::tableName();
        if (!$this->db->tableExists($table)) return true;
        if ($this->db->getTableSchema($table, true)->getColumn('privateOwnerId') === null) {
            $this->addColumn($table, 'privateOwnerId', $this->integer());
            $this->createIndex(null, $table, ['privateOwnerId']);
        }
        foreach ((new Query())->from($table)->where(['visibility' => 'private', 'privateOwnerId' => null])->each() as $row) {
            $definition = Json::decode($row['definitionJson']);
            $ownerId = $definition['ownerId'] ?? $row['initiatorId'];
            if ($ownerId !== null) $this->update($table, ['privateOwnerId' => (int)$ownerId], ['id' => $row['id']]);
        }
        return true;
    }

    public function safeDown(): bool { return true; }
}
