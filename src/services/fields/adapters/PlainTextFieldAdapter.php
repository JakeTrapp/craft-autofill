<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\fields\adapters;

use craft\base\ElementInterface;
use craft\base\FieldInterface;
use craft\elements\Entry;
use craft\fields\PlainText;
use RuntimeException;

class PlainTextFieldAdapter implements FieldAdapterInterface
{
    public function getKey(): string
    {
        return 'plainText';
    }

    public function isAvailableInLiteVersion(): bool
    {
        return true;
    }

    public function supports(FieldInterface $field): bool
    {
        return $field instanceof PlainText;
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
            $errors[] = 'Prompt is required for Plain Text fields.';
        }

        return $errors;
    }

    public function buildPromptContract(FieldInterface $field, array $promptConfig = []): array
    {
        return [
            'type' => 'string',
            'rules' => [
                'Return a plain text string only.',
                'Do not return markdown, HTML, or explanations.',
            ],
        ];
    }

    public function getContextValue(FieldInterface $field, mixed $value, array $options = []): string
    {
        if (is_string($value)) {
            return trim($value);
        }

        if (is_scalar($value)) {
            return $this->stringifyScalar($value);
        }

        return '';
    }

    public function validateSuggestion(FieldInterface $field, mixed $value): bool
    {
        if (!$field instanceof PlainText || !is_scalar($value)) {
            return false;
        }

        $text = $this->normalizeSuggestion($field, $value);
        if ($field->charLimit !== null && mb_strlen($text, 'UTF-8') > $field->charLimit) {
            return false;
        }

        return $field->byteLimit === null || strlen($text) <= $field->byteLimit;
    }

    public function normalizeSuggestion(FieldInterface $field, mixed $value): mixed
    {
        if (is_string($value)) {
            return trim($value);
        }

        if (is_scalar($value)) {
            return $this->stringifyScalar($value);
        }

        return '';
    }

    private function stringifyScalar(bool|int|float|string $value): string
    {
        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        return trim((string)$value);
    }

    public function applySuggestionToEntry(FieldInterface $field, ElementInterface $entry, mixed $value): mixed
    {
        $normalized = $this->normalizeSuggestion($field, $value);
        $handle = (string)($field->handle ?? '');
        if ($handle === '') {
            throw new RuntimeException('Could not resolve field handle for plain text suggestion apply.');
        }

        $entry->setFieldValue($handle, $normalized);
        return $normalized;
    }
}
