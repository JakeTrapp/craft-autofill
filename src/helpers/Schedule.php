<?php

declare(strict_types=1);

namespace jtdev\craftautofill\helpers;

use DateTimeImmutable;
use DateTimeInterface;
use DateTimeZone;

/**
 * Normalizes, validates, describes, and computes the next time of an automation schedule.
 * Times are wall-clock times in the site's time zone, so DST changes don't shift them.
 */
final class Schedule
{
    public const FREQUENCIES = ['minutes', 'hours', 'daily', 'days', 'weekly', 'monthly'];
    public const MINUTE_INTERVALS = [5, 10, 15, 20, 30];
    private const SEARCH_DAYS = 400;

    /** @return array<string, mixed> */
    public static function normalize(array $config, ?DateTimeInterface $now = null): array
    {
        // The editor offers monthly-by-weekday as its own choice.
        if (($config['frequency'] ?? null) === 'monthlyWeekday') {
            $config['frequency'] = 'monthly';
            $config['monthMode'] = 'weekday';
        }
        $frequency = in_array($config['frequency'] ?? null, self::FREQUENCIES, true) ? $config['frequency'] : 'daily';
        $times = [];
        foreach ((array)($config['times'] ?? []) as $time) {
            if (is_array($time)) {
                $time = $time['time'] ?? '';
            }
            $time = trim((string)$time);
            if (preg_match('/^(\d{1,2}):(\d{2})(?::\d{2})?$/', $time, $m) && (int)$m[1] < 24 && (int)$m[2] < 60) {
                $times[] = sprintf('%02d:%02d', (int)$m[1], (int)$m[2]);
            }
        }
        $times = array_values(array_unique($times));
        sort($times);
        $weekdays = array_values(array_unique(array_filter(array_map('intval', (array)($config['weekdays'] ?? [])), static fn(int $d): bool => $d >= 1 && $d <= 7)));
        sort($weekdays);
        $dates = [];
        foreach ((array)($config['monthDates'] ?? []) as $date) {
            if ($date === 'last') {
                $dates[] = 'last';
            } elseif ((int)$date >= 1 && (int)$date <= 31) {
                $dates[] = (int)$date;
            }
        }
        $dates = array_values(array_unique($dates, SORT_REGULAR));
        usort($dates, static fn($a, $b): int => ($a === 'last' ? 32 : $a) <=> ($b === 'last' ? 32 : $b));
        $ordinal = ($config['ordinal'] ?? 1) === 'last' ? 'last' : max(1, min(4, (int)($config['ordinal'] ?? 1)));
        $interval = (int)($config['interval'] ?? 1);
        $interval = match ($frequency) {
            'minutes' => in_array($interval, self::MINUTE_INTERVALS, true) ? $interval : 15,
            'hours' => max(1, min(23, $interval)),
            'days' => max(1, min(365, $interval)),
            default => 1,
        };
        $anchor = (string)($config['anchorDate'] ?? '');
        if (!preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $anchor, $date) || !checkdate((int)$date[2], (int)$date[3], (int)$date[1])) {
            $anchor = ($now ?? new DateTimeImmutable('now', self::timeZone()))->format('Y-m-d');
        }
        return [
            'enabled' => filter_var($config['enabled'] ?? false, FILTER_VALIDATE_BOOLEAN),
            'frequency' => $frequency,
            'interval' => $interval,
            'minute' => max(0, min(59, (int)($config['minute'] ?? 0))),
            'times' => $times ?: ['09:00'],
            'weekdays' => $weekdays,
            'monthMode' => ($config['monthMode'] ?? 'dates') === 'weekday' ? 'weekday' : 'dates',
            'monthDates' => $dates,
            'ordinal' => $ordinal,
            'ordinalWeekday' => max(1, min(7, (int)($config['ordinalWeekday'] ?? 1))),
            'anchorDate' => $anchor,
        ];
    }

    /** @return string[] Problems a person needs to fix. */
    public static function errors(array $schedule): array
    {
        if (!($schedule['enabled'] ?? false)) {
            return [];
        }
        $errors = [];
        if ($schedule['frequency'] === 'weekly' && $schedule['weekdays'] === []) {
            $errors[] = 'Choose at least one day of the week.';
        }
        if ($schedule['frequency'] === 'monthly' && $schedule['monthMode'] === 'dates' && $schedule['monthDates'] === []) {
            $errors[] = 'Choose at least one day of the month.';
        }
        return $errors;
    }

    /** Returns the first scheduled time strictly after $after, or null if the schedule never fires. */
    public static function next(array $schedule, DateTimeInterface $after, ?DateTimeZone $timeZone = null): ?DateTimeImmutable
    {
        if (!($schedule['enabled'] ?? false) || self::errors($schedule) !== []) {
            return null;
        }
        $timeZone ??= self::timeZone();
        $after = DateTimeImmutable::createFromInterface($after);
        $day = $after->setTimezone($timeZone)->setTime(0, 0);
        // Count calendar days in UTC so a 23- or 25-hour local day doesn't change the schedule's phase.
        $calendarZone = new DateTimeZone('UTC');
        $anchor = new DateTimeImmutable($schedule['anchorDate'], $calendarZone);
        for ($i = 0; $i <= self::SEARCH_DAYS; $i++, $day = $day->modify('+1 day')) {
            $daysFromAnchor = (int)$anchor->diff(new DateTimeImmutable($day->format('Y-m-d'), $calendarZone))->format('%r%a');
            foreach (self::slotsForDay($schedule, $day, $timeZone, $daysFromAnchor) as $slot) {
                if ($slot > $after) {
                    return $slot;
                }
            }
        }
        return null;
    }

    /** @return DateTimeImmutable[] Ascending times on the given local day. */
    private static function slotsForDay(array $schedule, DateTimeImmutable $day, DateTimeZone $timeZone, int $daysFromAnchor): array
    {
        // A wall time that doesn't exist (clocks spring forward) is null; PHP would move it an hour later.
        $at = static function(int $hour, int $minute) use ($day, $timeZone): ?DateTimeImmutable {
            $localTime = sprintf('%s %02d:%02d:00', $day->format('Y-m-d'), $hour, $minute);
            $slot = new DateTimeImmutable($localTime, $timeZone);
            return $slot->format('Y-m-d H:i:s') === $localTime ? $slot : null;
        };
        // Chosen times run once a day. One that falls in the skipped hour runs when the clocks have jumped,
        // as PHP places it (02:30 runs at 03:30), rather than skipping the day.
        $times = static function() use ($schedule, $day, $timeZone): array {
            $slots = array_map(static fn(string $time): DateTimeImmutable => new DateTimeImmutable($day->format('Y-m-d') . ' ' . $time . ':00', $timeZone), $schedule['times']);
            return self::sorted($slots);
        };
        // Repeating slots skip a nonexistent time (the next slot covers it) and run again in a repeated hour
        // when clocks fall back, so the gap between runs never grows.
        $repeating = static function(array $slots): array {
            $all = [];
            foreach (array_filter($slots) as $slot) {
                $all[] = $slot;
                $repeat = $slot->setTimestamp($slot->getTimestamp() + 3600);
                if ($repeat->format('Y-m-d H:i') === $slot->format('Y-m-d H:i')) {
                    $all[] = $repeat;
                }
            }
            return self::sorted($all);
        };
        switch ($schedule['frequency']) {
            case 'minutes':
                $slots = [];
                for ($minute = 0; $minute < 1440; $minute += $schedule['interval']) {
                    $slots[] = $at(intdiv($minute, 60), $minute % 60);
                }
                return $repeating($slots);
            case 'hours':
                $slots = [];
                $interval = $schedule['interval'];
                $firstHour = ((-$daysFromAnchor * 24) % $interval + $interval) % $interval;
                for ($hour = $firstHour; $hour < 24; $hour += $interval) {
                    $slots[] = $at($hour, $schedule['minute']);
                }
                // Only "every hour" repeats the fall-back hour; longer intervals keep their wall-clock times.
                return $interval === 1 ? $repeating($slots) : self::sorted(array_filter($slots));
            case 'daily':
                return $times();
            case 'days':
                return $daysFromAnchor >= 0 && $daysFromAnchor % $schedule['interval'] === 0 ? $times() : [];
            case 'weekly':
                return in_array((int)$day->format('N'), $schedule['weekdays'], true) ? $times() : [];
            case 'monthly':
                return self::matchesMonthDay($schedule, $day) ? $times() : [];
        }
        return [];
    }

    /**
     * @param DateTimeImmutable[] $slots
     * @return DateTimeImmutable[] Distinct moments in time order.
     */
    private static function sorted(array $slots): array
    {
        $byTime = [];
        foreach ($slots as $slot) {
            $byTime[$slot->getTimestamp()] = $slot;
        }
        ksort($byTime);
        return array_values($byTime);
    }

    private static function matchesMonthDay(array $schedule, DateTimeImmutable $day): bool
    {
        $date = (int)$day->format('j');
        $last = (int)$day->format('t');
        if ($schedule['monthMode'] === 'weekday') {
            if ((int)$day->format('N') !== $schedule['ordinalWeekday']) {
                return false;
            }
            return $schedule['ordinal'] === 'last' ? $date + 7 > $last : (int)ceil($date / 7) === $schedule['ordinal'];
        }
        foreach ($schedule['monthDates'] as $wanted) {
            // A date past the end of a short month runs on its last day instead of being skipped.
            if ($wanted === 'last' ? $date === $last : ($date === $wanted || ($date === $last && $wanted > $last))) {
                return true;
            }
        }
        return false;
    }

    public static function describe(array $schedule): string
    {
        if (!($schedule['enabled'] ?? false)) {
            return '';
        }
        $times = self::timeList($schedule['times']);
        $days = ['', self::t('Monday'), self::t('Tuesday'), self::t('Wednesday'), self::t('Thursday'), self::t('Friday'), self::t('Saturday'), self::t('Sunday')];
        $ordinals = ['', self::t('first'), self::t('second'), self::t('third'), self::t('fourth')];
        return match ($schedule['frequency']) {
            'minutes' => self::t('Every {n} minutes', ['n' => $schedule['interval']]),
            'hours' => $schedule['interval'] === 1
                ? self::t('Every hour at :{minute}', ['minute' => sprintf('%02d', $schedule['minute'])])
                : self::t('Every {n} hours at :{minute}', ['n' => $schedule['interval'], 'minute' => sprintf('%02d', $schedule['minute'])]),
            'daily' => self::t('Every day at {times}', ['times' => $times]),
            'days' => self::t('Every {n} days at {times}', ['n' => $schedule['interval'], 'times' => $times]),
            'weekly' => self::t('{days} at {times}', ['days' => self::weekdayPhrase($schedule['weekdays'], $days), 'times' => $times]),
            'monthly' => $schedule['monthMode'] === 'weekday'
                ? self::t('The {ordinal} {weekday} of every month at {times}', [
                    'ordinal' => $schedule['ordinal'] === 'last' ? self::t('last') : $ordinals[$schedule['ordinal']],
                    'weekday' => $days[$schedule['ordinalWeekday']],
                    'times' => $times,
                ])
                : self::t('Monthly on the {dates} at {times}', [
                    'dates' => self::list(array_map(static fn($d): string => $d === 'last' ? self::t('last day') : self::ordinalSuffix($d), $schedule['monthDates'])),
                    'times' => $times,
                ]),
            default => '',
        };
    }

    /** Translates when Craft is running; unit tests get the English source with parameters filled in. */
    public static function t(string $message, array $params = []): string
    {
        if (self::app() !== null) {
            return \Craft::t('autofill', $message, $params);
        }
        return strtr($message, array_combine(array_map(static fn($key): string => '{' . $key . '}', array_keys($params)), array_map('strval', $params)) ?: []);
    }

    /** The Craft application, or null in unit tests that run without one. */
    private static function app(): \craft\web\Application|\craft\console\Application|null
    {
        if (!class_exists(\Craft::class, false)) {
            return null;
        }
        /** @var \craft\web\Application|\craft\console\Application|null $app */
        $app = \Craft::$app;
        return $app;
    }

    public static function timeZone(): DateTimeZone
    {
        // Unit tests run without a Craft application.
        $app = self::app();
        return new DateTimeZone($app !== null ? $app->getTimeZone() : date_default_timezone_get());
    }

    private static function weekdayPhrase(array $weekdays, array $names): string
    {
        if ($weekdays === [1, 2, 3, 4, 5]) {
            return self::t('Weekdays');
        }
        if ($weekdays === [6, 7]) {
            return self::t('Weekends');
        }
        if (count($weekdays) === 7) {
            return self::t('Every day');
        }
        return self::t('Every {days}', ['days' => self::list(array_map(static fn(int $d): string => $names[$d], $weekdays))]);
    }

    private static function timeList(array $times): string
    {
        // Use the viewer's locale when Craft is running; unit tests fall back to a 12-hour clock.
        $formatter = self::app()?->getFormatter();
        $timeZone = self::timeZone();
        return self::list(array_map(static function(string $time) use ($formatter, $timeZone): string {
            if ($formatter !== null) {
                return $formatter->asTime(new DateTimeImmutable('2000-01-01 ' . $time, $timeZone), \craft\i18n\Locale::LENGTH_SHORT);
            }
            [$h, $m] = array_map('intval', explode(':', $time));
            return sprintf('%d:%02d %s', $h % 12 ?: 12, $m, $h < 12 ? 'AM' : 'PM');
        }, $times));
    }

    private static function ordinalSuffix(int $n): string
    {
        $suffix = in_array($n % 100, [11, 12, 13], true) ? 'th' : (['th', 'st', 'nd', 'rd'][$n % 10] ?? 'th');
        return $n . $suffix;
    }

    private static function list(array $items): string
    {
        if (count($items) <= 1) {
            return (string)($items[0] ?? '');
        }
        $last = array_pop($items);
        return self::t('{items} and {last}', ['items' => implode(', ', $items), 'last' => $last]);
    }
}
