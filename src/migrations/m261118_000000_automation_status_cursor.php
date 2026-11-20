<?php

declare(strict_types=1);

namespace jtdev\craftautofill\migrations;

use craft\db\Migration;
use craft\db\Query;
use craft\helpers\Db;
use DateTimeImmutable;
use jtdev\craftautofill\records\AutomationRecord;

/** Gives date-driven entry status triggers a durable polling cursor. */
class m261118_000000_automation_status_cursor extends Migration
{
    public function safeUp(): bool
    {
        $table = AutomationRecord::tableName();
        if (!$this->db->columnExists($table, 'statusCheckedAt')) {
            $this->addColumn($table, 'statusCheckedAt', $this->dateTime());
        }
        $now = Db::prepareDateForDb(new DateTimeImmutable());
        $uncounted = (new Query())->select(['id', 'triggersJson'])->from($table)
            ->where(['enabled' => true, 'pausedReason' => null, 'statusCheckedAt' => null]);
        foreach ($uncounted->each() as $row) {
            $events = json_decode($row['triggersJson'], true)['events'] ?? [];
            if (!empty($events['enabled']) && array_intersect($events['types'] ?? [], ['live', 'statusChanged']) !== []) {
                $this->update($table, ['statusCheckedAt' => $now], ['id' => $row['id']], updateTimestamp: false);
            }
        }
        return true;
    }

    public function safeDown(): bool
    {
        return false;
    }
}
