<?php

declare(strict_types=1);

namespace jtdev\craftautofill\tests\unit;

use DateTimeImmutable;
use DateTimeZone;
use jtdev\craftautofill\helpers\Schedule;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class ScheduleTest extends TestCase
{
    private DateTimeZone $tz;

    protected function setUp(): void
    {
        $this->tz = new DateTimeZone('America/Los_Angeles');
    }

    private function at(string $local): DateTimeImmutable
    {
        return new DateTimeImmutable($local, $this->tz);
    }

    private function next(array $config, string $after): ?string
    {
        $schedule = Schedule::normalize(['enabled' => true] + $config, $this->at('2026-01-01'));
        return Schedule::next($schedule, $this->at($after), $this->tz)?->setTimezone($this->tz)->format('Y-m-d H:i');
    }

    public function testNormalizeDefaultsAndCleansInput(): void
    {
        $schedule = Schedule::normalize([
            'enabled' => '1',
            'frequency' => 'nonsense',
            'times' => ['9:05', '25:00', 'abc', '09:05', ['time' => '07:30'], '13:00:00'],
            'weekdays' => ['3', 9, 1, 1, 0],
            'monthDates' => ['last', 31, 0, '15', 'x', 15],
            'ordinal' => 9,
            'ordinalWeekday' => 12,
            'minute' => 75,
        ], $this->at('2026-03-04 10:00'));

        self::assertTrue($schedule['enabled']);
        self::assertSame('daily', $schedule['frequency']);
        self::assertSame(['07:30', '09:05', '13:00'], $schedule['times']);
        self::assertSame([1, 3], $schedule['weekdays']);
        self::assertSame([15, 31, 'last'], $schedule['monthDates']);
        self::assertSame(4, $schedule['ordinal']);
        self::assertSame(7, $schedule['ordinalWeekday']);
        self::assertSame(59, $schedule['minute']);
        self::assertSame('2026-03-04', $schedule['anchorDate']);
    }

    public function testNormalizeKeepsAtLeastOneTimeAndDisabledByDefault(): void
    {
        $schedule = Schedule::normalize([]);
        self::assertFalse($schedule['enabled']);
        self::assertSame(['09:00'], $schedule['times']);
    }

    public function testMonthlyWeekdayAliasFromTheEditor(): void
    {
        $schedule = Schedule::normalize(['frequency' => 'monthlyWeekday', 'monthMode' => 'dates']);
        self::assertSame('monthly', $schedule['frequency']);
        self::assertSame('weekday', $schedule['monthMode']);
    }

    #[DataProvider('intervalProvider')]
    public function testIntervalsAreClamped(string $frequency, mixed $interval, int $expected): void
    {
        self::assertSame($expected, Schedule::normalize(['frequency' => $frequency, 'interval' => $interval])['interval']);
    }

    public static function intervalProvider(): array
    {
        return [
            'minutes off-list falls back to 15' => ['minutes', 7, 15],
            'minutes allowed value' => ['minutes', 30, 30],
            'hours minimum' => ['hours', 0, 1],
            'hours maximum' => ['hours', 40, 23],
            'days minimum' => ['days', -3, 1],
            'days maximum' => ['days', 9999, 365],
            'daily ignores interval' => ['daily', 5, 1],
        ];
    }

    public function testErrorsOnlyForEnabledIncompleteSchedules(): void
    {
        self::assertSame([], Schedule::errors(Schedule::normalize(['frequency' => 'weekly'])));
        self::assertSame(['Choose at least one day of the week.'], Schedule::errors(Schedule::normalize(['enabled' => true, 'frequency' => 'weekly'])));
        self::assertSame(['Choose at least one day of the month.'], Schedule::errors(Schedule::normalize(['enabled' => true, 'frequency' => 'monthly'])));
        self::assertSame([], Schedule::errors(Schedule::normalize(['enabled' => true, 'frequency' => 'monthlyWeekday'])));
    }

    public function testDisabledOrInvalidScheduleNeverFires(): void
    {
        self::assertNull(Schedule::next(Schedule::normalize(['frequency' => 'daily']), $this->at('2026-01-01'), $this->tz));
        self::assertNull(Schedule::next(Schedule::normalize(['enabled' => true, 'frequency' => 'weekly']), $this->at('2026-01-01'), $this->tz));
    }

    public function testEveryFewMinutes(): void
    {
        self::assertSame('2026-05-05 10:15', $this->next(['frequency' => 'minutes', 'interval' => 15], '2026-05-05 10:07'));
        // Strictly after: a time exactly on a slot moves to the next slot.
        self::assertSame('2026-05-05 10:30', $this->next(['frequency' => 'minutes', 'interval' => 15], '2026-05-05 10:15'));
        self::assertSame('2026-05-06 00:00', $this->next(['frequency' => 'minutes', 'interval' => 30], '2026-05-05 23:45'));
    }

    public function testEveryFewHoursAtAMinute(): void
    {
        self::assertSame('2026-05-05 12:20', $this->next(['frequency' => 'hours', 'interval' => 3, 'minute' => 20], '2026-05-05 10:00'));
        self::assertSame('2026-05-06 00:20', $this->next(['frequency' => 'hours', 'interval' => 3, 'minute' => 20], '2026-05-05 21:21'));
    }

    public function testHourlyIntervalDoesNotShortenAtMidnight(): void
    {
        $config = ['frequency' => 'hours', 'interval' => 5, 'minute' => 30, 'anchorDate' => '2026-05-05'];
        self::assertSame('2026-05-06 01:30', $this->next($config, '2026-05-05 20:30'));
    }

    public function testDailyWithSeveralTimes(): void
    {
        $config = ['frequency' => 'daily', 'times' => ['17:30', '08:00']];
        self::assertSame('2026-05-05 17:30', $this->next($config, '2026-05-05 08:00'));
        self::assertSame('2026-05-06 08:00', $this->next($config, '2026-05-05 18:00'));
    }

    public function testEveryFewDaysCountsFromTheAnchor(): void
    {
        $config = ['frequency' => 'days', 'interval' => 3, 'times' => ['06:00'], 'anchorDate' => '2026-05-01'];
        self::assertSame('2026-05-04 06:00', $this->next($config, '2026-05-01 07:00'));
        self::assertSame('2026-05-07 06:00', $this->next($config, '2026-05-04 06:00'));
        // Never before the anchor date.
        self::assertSame('2026-05-01 06:00', $this->next($config, '2026-04-20 00:00'));
    }

    public function testWeeklyOnChosenDays(): void
    {
        // 2026-05-05 is a Tuesday.
        $config = ['frequency' => 'weekly', 'weekdays' => [1, 5], 'times' => ['09:00']];
        self::assertSame('2026-05-08 09:00', $this->next($config, '2026-05-05 12:00'));
        self::assertSame('2026-05-11 09:00', $this->next($config, '2026-05-08 09:00'));
    }

    public function testMonthlyDatesIncludingShortMonthsAndLastDay(): void
    {
        $config = ['frequency' => 'monthly', 'monthDates' => [31], 'times' => ['10:00']];
        // February has no 31st, so it runs on the 28th rather than being skipped.
        self::assertSame('2026-02-28 10:00', $this->next($config, '2026-02-01 00:00'));
        self::assertSame('2026-03-31 10:00', $this->next($config, '2026-02-28 10:00'));
        self::assertSame('2026-04-30 10:00', $this->next(['frequency' => 'monthly', 'monthDates' => ['last'], 'times' => ['10:00']], '2026-04-02 00:00'));
        self::assertSame('2026-05-15 10:00', $this->next(['frequency' => 'monthly', 'monthDates' => [1, 15], 'times' => ['10:00']], '2026-05-02 00:00'));
    }

    public function testMonthlyOnAWeekday(): void
    {
        // First Monday of June 2026 is the 1st; last Friday of May 2026 is the 29th.
        self::assertSame('2026-06-01 09:00', $this->next(['frequency' => 'monthly', 'monthMode' => 'weekday', 'ordinal' => 1, 'ordinalWeekday' => 1, 'times' => ['09:00']], '2026-05-05 00:00'));
        self::assertSame('2026-05-29 09:00', $this->next(['frequency' => 'monthly', 'monthMode' => 'weekday', 'ordinal' => 'last', 'ordinalWeekday' => 5, 'times' => ['09:00']], '2026-05-05 00:00'));
        // Second Wednesday of May 2026 is the 13th.
        self::assertSame('2026-05-13 09:00', $this->next(['frequency' => 'monthly', 'monthMode' => 'weekday', 'ordinal' => 2, 'ordinalWeekday' => 3, 'times' => ['09:00']], '2026-05-05 00:00'));
    }

    public function testWallClockTimesSurviveDaylightSavingChanges(): void
    {
        // US DST starts 2026-03-08; 09:00 stays 09:00 local.
        $config = ['frequency' => 'daily', 'times' => ['09:00']];
        self::assertSame('2026-03-08 09:00', $this->next($config, '2026-03-07 10:00'));
        self::assertSame('2026-03-09 09:00', $this->next($config, '2026-03-08 09:30'));
    }

    public function testNextAcceptsUtcInput(): void
    {
        $schedule = Schedule::normalize(['enabled' => true, 'frequency' => 'daily', 'times' => ['09:00']]);
        $after = new DateTimeImmutable('2026-05-05 15:00', new DateTimeZone('UTC')); // 08:00 PDT
        self::assertSame('2026-05-05T16:00:00+00:00', Schedule::next($schedule, $after, $this->tz)->setTimezone(new DateTimeZone('UTC'))->format(DATE_ATOM));
    }

    public function testSpringForwardReturnsTheEarliestUpcomingSlot(): void
    {
        // A nonexistent 02:30 may be shifted or skipped, but 03:00 must run first.
        $config = ['frequency' => 'daily', 'times' => ['02:30', '03:00']];
        self::assertSame('2026-03-08 03:00', $this->next($config, '2026-03-08 01:55'));
    }

    public function testSpringForwardMovesAChosenTimeInsteadOfSkippingTheDay(): void
    {
        // 02:30 doesn't exist on 2026-03-08; the daily run happens an hour later that day.
        $daily = ['frequency' => 'daily', 'times' => ['02:30']];
        self::assertSame('2026-03-08 03:30', $this->next($daily, '2026-03-07 12:00'));
        self::assertSame('2026-03-09 02:30', $this->next($daily, '2026-03-08 03:30'));
        // A weekly Sunday run isn't lost for the whole week.
        self::assertSame('2026-03-08 03:30', $this->next(['frequency' => 'weekly', 'weekdays' => [7], 'times' => ['02:30']], '2026-03-01 12:00'));
        // Two times that land on the same moment run once.
        self::assertSame(['2026-03-08 03:30', '2026-03-09 02:30'], $this->walk(['frequency' => 'daily', 'times' => ['02:30', '03:30']], '2026-03-08 00:00', 2));
    }

    public function testRepeatingSchedulesSkipTheMissingHourAndRepeatTheExtraHour(): void
    {
        // Spring forward: 02:00-02:59 doesn't exist, so 01:45 is followed by 03:00.
        self::assertSame(['2026-03-08 01:45 PST', '2026-03-08 03:00 PDT'], $this->walk(['frequency' => 'minutes', 'interval' => 15], '2026-03-08 01:40', 2, 'Y-m-d H:i T'));
        // Fall back: 01:00-01:59 happens twice and every-15-minutes keeps running through both.
        self::assertSame(
            ['2026-11-01 01:45 PDT', '2026-11-01 01:00 PST', '2026-11-01 01:15 PST'],
            $this->walk(['frequency' => 'minutes', 'interval' => 15], '2026-11-01 01:40', 3, 'Y-m-d H:i T'),
        );
        self::assertSame(
            ['2026-11-01 01:30 PDT', '2026-11-01 01:30 PST', '2026-11-01 02:30 PST'],
            $this->walk(['frequency' => 'hours', 'interval' => 1, 'minute' => 30], '2026-11-01 01:00', 3, 'Y-m-d H:i T'),
        );
        // Chosen daily times still run once.
        self::assertSame(['2026-11-01 01:30 PDT', '2026-11-02 01:30 PST'], $this->walk(['frequency' => 'daily', 'times' => ['01:30']], '2026-10-31 12:00', 2, 'Y-m-d H:i T'));
    }

    #[DataProvider('cadenceProvider')]
    public function testGapsBetweenRunsStayOnCadenceForAWholeYear(array $config, int $expectedMinutes, int $allowedDrift): void
    {
        // Walk a year in a DST zone. Real elapsed time may differ by the DST hour, never more.
        $schedule = Schedule::normalize(['enabled' => true, 'anchorDate' => '2026-01-01'] + $config);
        $at = $this->at('2026-01-01 00:00');
        $previous = null;
        $end = $this->at('2027-01-01 00:00');
        $count = 0;
        while (($at = Schedule::next($schedule, $at, $this->tz)) !== null && $at < $end) {
            if ($previous !== null) {
                $gap = intdiv($at->getTimestamp() - $previous->getTimestamp(), 60);
                self::assertGreaterThan(0, $gap);
                self::assertLessThanOrEqual($allowedDrift, abs($gap - $expectedMinutes), sprintf('%s → %s', $previous->format('Y-m-d H:i T'), $at->format('Y-m-d H:i T')));
            }
            $previous = $at;
            $count++;
        }
        self::assertGreaterThan(0, $count);
    }

    public static function cadenceProvider(): array
    {
        return [
            'every 15 minutes' => [['frequency' => 'minutes', 'interval' => 15], 15, 0],
            'every hour' => [['frequency' => 'hours', 'interval' => 1, 'minute' => 10], 60, 0],
            'every 5 hours across midnights' => [['frequency' => 'hours', 'interval' => 5, 'minute' => 30], 300, 60],
            'every 7 hours across midnights' => [['frequency' => 'hours', 'interval' => 7, 'minute' => 0], 420, 60],
            'daily' => [['frequency' => 'daily', 'times' => ['09:00']], 1440, 60],
            'every 3 days' => [['frequency' => 'days', 'interval' => 3, 'times' => ['06:00']], 4320, 60],
            'weekly' => [['frequency' => 'weekly', 'weekdays' => [3], 'times' => ['12:00']], 10080, 60],
        ];
    }

    public function testRunCountsOverAYearMatchTheCalendar(): void
    {
        $count = fn(array $config): int => count($this->walk($config, '2026-01-01 00:00', 2000, 'Y-m-d H:i', '2027-01-01 00:00'));
        self::assertSame(365, $count(['frequency' => 'daily', 'times' => ['02:30']]), 'Spring-forward day still runs.');
        self::assertSame(730, $count(['frequency' => 'daily', 'times' => ['08:00', '20:00']]));
        self::assertSame(261, $count(['frequency' => 'weekly', 'weekdays' => [1, 2, 3, 4, 5], 'times' => ['08:00']]));
        self::assertSame(12, $count(['frequency' => 'monthly', 'monthDates' => [31], 'times' => ['10:00']]), 'Short months run on their last day.');
        self::assertSame(24, $count(['frequency' => 'monthly', 'monthDates' => [1, 'last'], 'times' => ['10:00']]));
        self::assertSame(12, $count(['frequency' => 'monthly', 'monthMode' => 'weekday', 'ordinal' => 'last', 'ordinalWeekday' => 5, 'times' => ['10:00']]));
    }

    /** @return string[] The next $n run times after $from, optionally stopping before $until. */
    private function walk(array $config, string $from, int $n, string $format = 'Y-m-d H:i', ?string $until = null): array
    {
        $schedule = Schedule::normalize(['enabled' => true] + $config, $this->at('2026-01-01'));
        $at = $this->at($from);
        $limit = $until !== null ? $this->at($until) : null;
        $out = [];
        for ($i = 0; $i < $n && ($at = Schedule::next($schedule, $at, $this->tz)) !== null; $i++) {
            if ($limit !== null && $at >= $limit) {
                break;
            }
            $out[] = $at->setTimezone($this->tz)->format($format);
        }
        return $out;
    }

    #[DataProvider('describeProvider')]
    public function testDescribe(array $config, string $expected): void
    {
        self::assertSame($expected, Schedule::describe(Schedule::normalize(['enabled' => true] + $config)));
    }

    public static function describeProvider(): array
    {
        return [
            [['frequency' => 'minutes', 'interval' => 10], 'Every 10 minutes'],
            [['frequency' => 'hours', 'interval' => 1, 'minute' => 5], 'Every hour at :05'],
            [['frequency' => 'hours', 'interval' => 4, 'minute' => 0], 'Every 4 hours at :00'],
            [['frequency' => 'daily', 'times' => ['09:00', '17:30']], 'Every day at 9:00 AM and 5:30 PM'],
            [['frequency' => 'days', 'interval' => 2, 'times' => ['00:15']], 'Every 2 days at 12:15 AM'],
            [['frequency' => 'weekly', 'weekdays' => [1, 2, 3, 4, 5], 'times' => ['08:00']], 'Weekdays at 8:00 AM'],
            [['frequency' => 'weekly', 'weekdays' => [6, 7], 'times' => ['08:00']], 'Weekends at 8:00 AM'],
            [['frequency' => 'weekly', 'weekdays' => [1, 3], 'times' => ['12:00']], 'Every Monday and Wednesday at 12:00 PM'],
            [['frequency' => 'monthly', 'monthDates' => [1, 2, 3, 11, 22, 'last'], 'times' => ['09:00']], 'Monthly on the 1st, 2nd, 3rd, 11th, 22nd and last day at 9:00 AM'],
            [['frequency' => 'monthlyWeekday', 'ordinal' => 'last', 'ordinalWeekday' => 5, 'times' => ['09:00']], 'The last Friday of every month at 9:00 AM'],
        ];
    }

    public function testDescribeIsEmptyWhenDisabled(): void
    {
        self::assertSame('', Schedule::describe(Schedule::normalize(['frequency' => 'daily'])));
    }
}
