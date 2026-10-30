<?php

declare(strict_types=1);

namespace modules\autofilltestbench;

use craft\base\Model;
use jtdev\craftautofill\models\ai\AiGenerationRequest;
use jtdev\craftautofill\services\ai\AiProviderInterface;
use RuntimeException;

/** Deterministic provider available only inside the disposable testbench Craft app. */
final class FixtureOpenAiProvider implements AiProviderInterface
{
    public function getProviderKey(): string
    {
        return 'openai';
    }

    public function generate(AiGenerationRequest $request, Model $providerConfig): array
    {
        $prompt = '';
        foreach ($request->messages as $message) {
            if (($message['role'] ?? '') === 'user') {
                $prompt = (string)($message['content'] ?? '');
                break;
            }
        }

        if (preg_match('/GENERATION_ROWS_JSON\s*\n(.*?)\n\nRESPONSE_FORMAT_JSON/s', $prompt, $matches) !== 1) {
            throw new RuntimeException('The fixture provider could not find generation rows in the request.');
        }
        $rows = json_decode($matches[1], true);
        if (!is_array($rows)) {
            throw new RuntimeException('The fixture provider received malformed generation rows.');
        }

        $suggestions = [];
        foreach ($rows as $row) {
            if (!is_array($row)) {
                continue;
            }
            $name = trim((string)($row['targetFieldName'] ?? ''));
            if ($name === '') {
                continue;
            }
            $contract = is_array($row['fieldContract'] ?? null) ? $row['fieldContract'] : [];
            $value = 'Fixture generated value for ' . $name;
            if (isset($contract['properties']['selectedAssetIds']['type'])) {
                $candidateIds = array_column($contract['candidates'] ?? [], 'assetId');
                $value = ['selectedAssetIds' => array_slice($candidateIds, 0, 1)];
            } elseif (($contract['format'] ?? null) === 'table') {
                $tableRow = [];
                foreach ($contract['columns'] ?? [] as $column) {
                    if (!is_array($column) || !isset($column['key'])) {
                        continue;
                    }
                    $tableRow[(string)$column['key']] = match ($column['valueKind'] ?? $column['type'] ?? 'string') {
                        'number', 'integer', 'float' => 42,
                        'boolean' => true,
                        default => 'Fixture table value',
                    };
                }
                $value = ['rows' => [$tableRow]];
            } elseif (($contract['format'] ?? null) === 'json') {
                $value = ['source' => 'fixture', 'nested' => ['valid' => true]];
            } elseif (($contract['type'] ?? null) === 'boolean') {
                $value = true;
            } elseif (is_array($contract['options'] ?? null) && isset($contract['options'][0]['value'])) {
                $value = (string)$contract['options'][0]['value'];
            }
            $suggestions[] = ['fieldName' => $name, 'value' => $value];
        }

        return [
            'output_text' => json_encode(['suggestions' => $suggestions], JSON_THROW_ON_ERROR),
            'usage' => ['input_tokens' => 1, 'output_tokens' => 1, 'total_tokens' => 2],
            'id' => 'fixture-provider-response',
            'providerRaw' => ['fixture' => true],
        ];
    }
}
