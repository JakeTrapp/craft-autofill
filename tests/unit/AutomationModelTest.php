<?php

declare(strict_types=1);

namespace jtdev\craftautofill\tests\unit;

use jtdev\craftautofill\models\Automation;
use PHPUnit\Framework\TestCase;

final class AutomationModelTest extends TestCase
{
    public function testTriggersAreNormalizedOnConstruction(): void
    {
        $automation = new Automation([
            'events' => ['enabled' => '1', 'types' => ['created', 'bogus', 'created', 'replaced'], 'delay' => '7'],
            'fields' => ['enabled' => 'on', 'uids' => ['a', '', 'a', 'b'], 'delay' => 15],
            'siteIds' => ['2', 0, -1, 2, '3'],
            'maxRuns' => 0,
            'maxItemsPerRun' => '25',
            'minMinutesBetweenRuns' => -5,
        ]);

        self::assertSame(['enabled' => true, 'types' => ['created', 'replaced'], 'delay' => 0], $automation->events);
        self::assertSame(['enabled' => true, 'uids' => ['a', 'b'], 'delay' => 15], $automation->fields);
        self::assertSame([2, 3], $automation->siteIds);
        self::assertNull($automation->maxRuns);
        self::assertSame(25, $automation->maxItemsPerRun);
        self::assertNull($automation->minMinutesBetweenRuns);
        self::assertFalse($automation->schedule['enabled']);
    }

    public function testStateHelpers(): void
    {
        $automation = new Automation(['enabled' => true]);
        self::assertTrue($automation->isActive());
        self::assertFalse($automation->isPaused());
        self::assertFalse($automation->hasSchedule());
        self::assertFalse($automation->hasContentTriggers());

        $automation->pausedReason = 'Its workflow was archived.';
        self::assertTrue($automation->isPaused());
        self::assertFalse($automation->isActive());

        $automation->pausedReason = '';
        $automation->enabled = false;
        self::assertFalse($automation->isPaused());
        self::assertFalse($automation->isActive());

        self::assertTrue((new Automation(['schedule' => ['enabled' => true]]))->hasSchedule());
        self::assertTrue((new Automation(['fields' => ['enabled' => true, 'uids' => ['x']]]))->hasContentTriggers());
    }

    public function testTriggerValidationMessages(): void
    {
        $automation = new Automation([
            'schedule' => ['enabled' => true, 'frequency' => 'weekly'],
            'events' => ['enabled' => true, 'types' => []],
            'fields' => ['enabled' => true, 'uids' => []],
        ]);
        $automation->validateTriggers();
        self::assertSame(['Choose at least one day of the week.'], $automation->getErrors('schedule'));
        self::assertSame(['Choose at least one kind of change.'], $automation->getErrors('events'));
        self::assertSame(['Choose at least one field to watch.'], $automation->getErrors('fields'));
    }

    public function testCompleteTriggersHaveNoErrors(): void
    {
        $automation = new Automation([
            'schedule' => ['enabled' => true, 'frequency' => 'weekly', 'weekdays' => [2]],
            'events' => ['enabled' => true, 'types' => ['saved']],
            'fields' => ['enabled' => false],
        ]);
        $automation->validateTriggers();
        self::assertFalse($automation->hasErrors());
    }
}
