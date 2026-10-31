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

        return [
            'type' => 'string',
            'format' => $includesTime ? 'date-time' : 'date',
            'rules' => [
                $includesTime
                    ? 'Return a valid ISO 8601 date-time string, including time and timezone offset (e.g. 2026-05-10T14:30:00-05:00).'
                    : 'Return a valid ISO 8601 date string in YYYY-MM-DD format.',
                'Do not return explanatory text.',
            ],
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
        if ($value instanceof \DateTimeInterface) {
            return true;
        }

        if (!is_string($value)) {
            return false;
        }

        return $this->parseSuggestion($field, $value) !== null;
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
        $value = trim($value);
        if ($this->includesTime($field) && str_ends_with($value, 'Z')) $value = substr($value, 0, -1) . '+00:00';
        if ($value === '') {
            return null;
        }

        $format = $this->includesTime($field) ? \DateTimeInterface::ATOM : 'Y-m-d';
        $date = \DateTimeImmutable::createFromFormat('!' . $format, $value);
        $errors = \DateTimeImmutable::getLastErrors();
        if (!$date instanceof \DateTimeImmutable || ($errors !== false && ($errors['warning_count'] > 0 || $errors['error_count'] > 0))) {
            return null;
        }

        return $date->format($format) === $value ? $date : null;
    }
}
