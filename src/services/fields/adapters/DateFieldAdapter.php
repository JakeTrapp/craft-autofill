<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\fields\adapters;

use craft\base\ElementInterface;
use craft\base\FieldInterface;
use craft\elements\Entry;
use craft\fields\Date;
use Craft;
use RuntimeException;

class DateFieldAdapter implements FieldAdapterInterface
{
    public function getKey(): string
    {
        return 'date';
    }

    public function isAvailableInLiteVersion(): bool
    {
        return true;
    }

    public function supports(FieldInterface $field): bool
    {
        return $field instanceof Date;
    }

    public function getPromptConfigSchema(FieldInterface $field): array
    {
        return [
            'fields' => [
                [
                    'key' => 'prompt',
                    'type' => 'multiline',
                    'label' => 'Prompt',
                    'required' => true,
                ],
            ],
        ];
    }

    public function normalizePromptConfig(array $config, FieldInterface $field): array
    {
        return [
            'prompt' => trim((string)($config['prompt'] ?? '')),
        ];
    }

    public function validatePromptConfig(array $config, FieldInterface $field): array
    {
        $normalized = $this->normalizePromptConfig($config, $field);
        $errors = [];

        if ($normalized['prompt'] === '') {
            $errors[] = 'Prompt is required for Date fields.';
        }

        return $errors;
    }

    public function buildPromptContract(FieldInterface $field, array $promptConfig = []): array
    {
        $includesTime = $this->includesTime($field);
        $rules = [
            $includesTime
                ? 'Return a valid ISO 8601 date-time string, including time and timezone offset (e.g. 2026-05-10T14:30:00-05:00).'
                : 'Return a valid ISO 8601 date string in YYYY-MM-DD format.',
            'Do not return explanatory text.',
        ];
        if ($field instanceof Date && $field->min !== null) {
            $rules[] = 'The earliest allowed date is ' . $field->min->format('Y-m-d') . '.';
        }
        if ($field instanceof Date && $field->max !== null) {
            $rules[] = 'The latest allowed date is ' . $field->max->format('Y-m-d') . '.';
        }

        return [
            'type' => 'string',
            'format' => $includesTime ? 'date-time' : 'date',
            'rules' => $rules,
        ];
    }

    public function getContextValue(FieldInterface $field, mixed $value, array $options = []): string
    {
        $includesTime = $this->includesTime($field);

        if ($value instanceof \DateTimeInterface) {
            return $includesTime
                ? $value->format(\DateTimeInterface::ATOM)
                : $value->format('Y-m-d');
        }

        if (is_string($value)) {
            return trim($value);
        }

        return '';
    }

    public function validateSuggestion(FieldInterface $field, mixed $value): bool
    {
        if (!$field instanceof Date) {
            return false;
        }
        if ($value instanceof \DateTimeInterface) {
            $value = $this->normalizeSuggestion($field, $value);
        }
        $date = is_string($value) ? $this->parseSuggestion($field, $value) : null;
        if ($date === null) {
            return false;
        }

        $min = $field->min === null ? null : \DateTimeImmutable::createFromInterface($field->min)->setTime(0, 0);
        $max = $field->max === null ? null : \DateTimeImmutable::createFromInterface($field->max)->setTime(23, 59, 59);

        return ($min === null || $date >= $min) && ($max === null || $date <= $max);
    }

    public function normalizeSuggestion(FieldInterface $field, mixed $value): mixed
    {
        $includesTime = $this->includesTime($field);

        if ($value instanceof \DateTimeInterface) {
            return $includesTime
                ? $value->format(\DateTimeInterface::ATOM)
                : $value->format('Y-m-d');
        }

        if (!is_string($value)) {
            return '';
        }

        $date = $this->parseSuggestion($field, $value);
        if ($date === null) {
            return '';
        }

        return $includesTime
            ? $date->format(\DateTimeInterface::ATOM)
            : $date->format('Y-m-d');
    }

    public function applySuggestionToEntry(FieldInterface $field, ElementInterface $entry, mixed $value): mixed
    {
        $normalized = $this->normalizeSuggestion($field, $value);
        $handle = (string)($field->handle ?? '');
        if ($handle === '') {
            throw new RuntimeException('Could not resolve field handle for date suggestion apply.');
        }

        $valueToSet = $normalized;
        if (!$this->includesTime($field)) {
            // DateTimeHelper parses plain date strings as UTC before converting
            // them to Craft's timezone, which can shift date-only values back a day.
            $valueToSet = [
                'date' => $normalized,
                'timezone' => Craft::$app->getTimeZone(),
            ];
        }

        $entry->setFieldValue($handle, $valueToSet);
        return $normalized;
    }

    private function includesTime(FieldInterface $field): bool
    {
        if (!$field instanceof Date) {
            return false;
        }

        // Craft Date fields expose a `showTime` setting when time should be collected.
        return (bool)($field->showTime ?? false);
    }

    private function parseSuggestion(FieldInterface $field, string $value): ?\DateTimeImmutable
    {
        return $this->includesTime($field)
            ? self::parseDateTime($value)
            : self::parseDate(trim($value), 'Y-m-d', new \DateTimeZone(Craft::$app->getTimeZone()));
    }

    public static function parseDateTime(string $value, ?\DateTimeZone $localTimeZone = null): ?\DateTimeImmutable
    {
        $value = trim($value);
        if (str_ends_with($value, 'Z')) {
            $value = substr($value, 0, -1) . '+00:00';
        }

        return self::parseDate($value, \DateTimeInterface::ATOM)
            ?? ($localTimeZone === null ? null : self::parseDate($value, 'Y-m-d\TH:i:s', $localTimeZone));
    }

    private static function parseDate(string $value, string $format, ?\DateTimeZone $timeZone = null): ?\DateTimeImmutable
    {
        if ($value === '' || str_contains($value, "\0")) {
            return null;
        }

        $date = \DateTimeImmutable::createFromFormat('!' . $format, $value, $timeZone);
        $errors = \DateTimeImmutable::getLastErrors();
        if (!$date instanceof \DateTimeImmutable || ($errors !== false && ($errors['warning_count'] > 0 || $errors['error_count'] > 0))) {
            return null;
        }

        return $date->format($format) === $value ? $date : null;
    }
}
