<?php

declare(strict_types=1);

namespace jtdev\craftautofill\models;

use craft\base\Model;
use jtdev\craftautofill\helpers\Schedule;

class Automation extends Model
{
    public const ENTRY_EVENTS = ['created', 'saved', 'live', 'statusChanged'];
    public const ASSET_EVENTS = ['created', 'replaced', 'saved'];
    public const DELAYS = [0, 1, 5, 15, 60];

    public ?int $id = null;
    public string $uid = '';
    public string $name = '';
    public ?int $workflowId = null;
    public ?int $ownerId = null;
    public ?int $runAsId = null;
    public bool $enabled = true;
    public ?string $pausedReason = null;
    /** @var array<string, mixed> */
    public array $schedule = [];
    /** @var array{enabled:bool,types:string[],delay:int} */
    public array $events = ['enabled' => false, 'types' => [], 'delay' => 0];
    /** @var array{enabled:bool,uids:string[],delay:int} */
    public array $fields = ['enabled' => false, 'uids' => [], 'delay' => 0];
    /** @var array<string, mixed>|null Craft element condition config. */
    public ?array $condition = null;
    /** Run when any condition rule matches, instead of all of them. */
    public bool $matchAny = false;
    /** Entries only: skip anything that isn't live, whatever the rules say. */
    public bool $onlyLive = false;
    /** @var int[] */
    public array $siteIds = [];
    public string $userPrompt = '';
    public ?int $privateOwnerId = null;
    public ?int $maxRuns = null;
    public ?int $maxItemsPerRun = null;
    public ?int $minMinutesBetweenRuns = null;
    public ?string $acknowledgedAutomaticHash = null;
    /** The workflow definition this automation was last saved against. */
    public ?string $acknowledgedWorkflowHash = null;
    public int $runCount = 0;
    public ?\DateTime $nextRunAt = null;
    public ?\DateTime $lastRunAt = null;
    public ?string $lastBatchUid = null;
    /** @var array{started?:int,skipped?:int,failed?:int,trigger?:string}|null */
    public ?array $lastRunSummary = null;
    public ?\DateTime $dateCreated = null;

    public function init(): void
    {
        parent::init();
        $this->normalizeTriggers();
    }

    public function normalizeTriggers(): void
    {
        $this->schedule = Schedule::normalize($this->schedule);
        $delay = static fn(mixed $value): int => in_array((int)$value, self::DELAYS, true) ? (int)$value : 0;
        $this->events = [
            'enabled' => filter_var($this->events['enabled'] ?? false, FILTER_VALIDATE_BOOLEAN),
            'types' => array_values(array_unique(array_intersect(array_map('strval', (array)($this->events['types'] ?? [])), array_merge(self::ENTRY_EVENTS, self::ASSET_EVENTS)))),
            'delay' => $delay($this->events['delay'] ?? 0),
        ];
        $this->fields = [
            'enabled' => filter_var($this->fields['enabled'] ?? false, FILTER_VALIDATE_BOOLEAN),
            'uids' => array_values(array_unique(array_filter(array_map('strval', (array)($this->fields['uids'] ?? []))))),
            'delay' => $delay($this->fields['delay'] ?? 0),
        ];
        $this->siteIds = array_values(array_unique(array_filter(array_map('intval', $this->siteIds), static fn(int $id): bool => $id > 0)));
        foreach (['maxRuns', 'maxItemsPerRun', 'minMinutesBetweenRuns'] as $limit) {
            $this->$limit = $this->$limit === null || (int)$this->$limit <= 0 ? null : (int)$this->$limit;
        }
    }

    public function rules(): array
    {
        return [
            [['name'], 'trim'],
            [['name', 'workflowId'], 'required'],
            [['name'], 'string', 'max' => 255],
            [['userPrompt'], 'string', 'max' => 5000],
            [['maxRuns', 'maxItemsPerRun', 'minMinutesBetweenRuns'], 'integer', 'min' => 1, 'max' => 1000000],
            [['schedule'], 'validateTriggers'],
            [['siteIds'], 'required', 'message' => 'Choose at least one site.'],
        ];
    }

    public function validateTriggers(): void
    {
        foreach (Schedule::errors($this->schedule) as $error) {
            $this->addError('schedule', $error);
        }
        if ($this->events['enabled'] && $this->events['types'] === []) {
            $this->addError('events', 'Choose at least one kind of change.');
        }
        if ($this->fields['enabled'] && $this->fields['uids'] === []) {
            $this->addError('fields', 'Choose at least one field to watch.');
        }
    }

    public function hasSchedule(): bool
    {
        return (bool)($this->schedule['enabled'] ?? false);
    }

    public function hasContentTriggers(): bool
    {
        return $this->events['enabled'] || $this->fields['enabled'];
    }

    public function isPaused(): bool
    {
        return $this->pausedReason !== null && $this->pausedReason !== '';
    }

    public function isActive(): bool
    {
        return $this->enabled && !$this->isPaused();
    }
}
