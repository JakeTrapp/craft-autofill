<?php

namespace jtdev\craftautofill\models;

use craft\base\Model;
use craft\helpers\StringHelper;
use jtdev\craftautofill\models\ai\AiModelConfig;

/**
 * Autofill settings
 */
class Settings extends Model
{
    public bool $testMode = false;

    /**
     * Whether runs started by AI agents (through Craft’s MCP server) may apply outputs that are set to apply
     * automatically. When off, those outputs wait for review like every other output on an agent’s run.
     */
    public bool $allowAgentAutomaticOutputs = false;

    /**
     * Seconds to wait for one AI provider response. Set in config/autofill.php; there's no control panel setting.
     * Reasoning models may need 60–120 seconds.
     */
    public int $requestTimeout = AiModelConfig::DEFAULT_TIMEOUT;

    /**
     * Output token limit sent to every provider. Null uses each provider's default (Anthropic: 8192).
     * Set in config/autofill.php; there's no control panel setting.
     */
    public ?int $maxOutputTokens = null;

    /**
     * @var array<int, array<string, mixed>>
     */
    public array $modelConfigs = [];

    public function init(): void
    {
        parent::init();
        $this->modelConfigs = $this->normalizeModelConfigs($this->modelConfigs);
    }

    public function rules(): array
    {
        return [
            [['testMode', 'allowAgentAutomaticOutputs'], 'boolean'],
            ['requestTimeout', 'integer', 'min' => AiModelConfig::MIN_TIMEOUT, 'max' => AiModelConfig::MAX_TIMEOUT],
            ['maxOutputTokens', 'integer', 'min' => AiModelConfig::MIN_OUTPUT_TOKENS, 'max' => AiModelConfig::MAX_OUTPUT_TOKENS],
            ['modelConfigs', 'validateModelConfigs'],
        ];
    }

    public function getDefaultModelConfigUid(): ?string
    {
        foreach ($this->modelConfigs as $config) {
            if (!($config['enabled'] ?? false)) {
                continue;
            }

            $uid = (string)($config['uid'] ?? '');
            if ($uid !== '') {
                return $uid;
            }
        }

        return null;
    }

    /** The provider response wait, clamped to the supported range. Used to size queue time limits. */
    public function getMaxRequestTimeout(): int
    {
        return max(AiModelConfig::MIN_TIMEOUT, min($this->requestTimeout, AiModelConfig::MAX_TIMEOUT));
    }

    /** @return string[] Labels of rows that still store a literal API key. */
    public function getLiteralApiKeyRows(): array
    {
        $rows = [];
        foreach ($this->modelConfigs as $index => $config) {
            $value = trim((string)($config['apiKeyEnv'] ?? ''));
            if ($value !== '' && !AiModelConfig::isEnvReference($value)) {
                $rows[] = ($config['label'] ?? '') !== '' ? (string)$config['label'] : sprintf('Row %d', $index + 1);
            }
        }
        return $rows;
    }

    public function validateModelConfigs(): void
    {
        $this->modelConfigs = $this->normalizeModelConfigs($this->modelConfigs);

        foreach ($this->modelConfigs as $index => $config) {
            $provider = (string)($config['provider'] ?? 'openai');
            $rowLabel = sprintf('Model config row %d', $index + 1);

            if (!in_array($provider, ['openai', 'anthropic', 'deepseek', 'gemini'], true)) {
                $this->addError('modelConfigs', sprintf('%s has unsupported provider "%s".', $rowLabel, $provider));
                continue;
            }

            $apiKeyEnv = trim((string)($config['apiKeyEnv'] ?? ''));
            if ($apiKeyEnv !== '' && !AiModelConfig::isEnvReference($apiKeyEnv)) {
                $this->addError('modelConfigs', sprintf('%s must reference an environment variable for its API key, like $OPENAI_API_KEY. Add the key to your .env file instead of entering it here.', $rowLabel));
            }

            $modelConfig = new AiModelConfig($config);
            if (!$modelConfig->validate()) {
                foreach ($modelConfig->getFirstErrors() as $attribute => $message) {
                    $this->addError('modelConfigs', sprintf('%s (%s): %s', $rowLabel, $attribute, $message));
                }
                continue;
            }

            $allowedEfforts = match ($provider) {
                'openai' => ['', 'low', 'medium', 'high'],
                'deepseek' => ['', 'none', 'low', 'high', 'max'],
                default => [''],
            };
            $effort = strtolower(trim((string)($config['reasoningEffort'] ?? '')));
            if (!in_array($effort, $allowedEfforts, true)) {
                $this->addError('modelConfigs', sprintf('%s has unsupported reasoning effort "%s" for %s.', $rowLabel, $effort, $provider));
            }
        }
    }

    /**
     * @param mixed $rows
     * @return array<int, array<string, mixed>>
     */
    private function normalizeModelConfigs(mixed $rows): array
    {
        if (!is_array($rows)) {
            return [];
        }

        $normalized = [];

        foreach ($rows as $row) {
            if (!is_array($row)) {
                continue;
            }

            $uid = trim((string)($row['uid'] ?? ''));
            $label = trim((string)($row['label'] ?? ''));
            $provider = strtolower(trim((string)($row['provider'] ?? 'openai')));
            $apiKeyEnv = trim((string)($row['apiKeyEnv'] ?? ''));
            $modelId = trim((string)($row['modelId'] ?? ''));
            $reasoningEffort = trim((string)($row['reasoningEffort'] ?? ''));
            $enabled = $this->toBool($row['enabled'] ?? true);

            $hasMeaningfulInput = $uid !== '' || $label !== '' || $apiKeyEnv !== '' || $modelId !== '' || $reasoningEffort !== '';
            if (!$hasMeaningfulInput) {
                continue;
            }

            $normalized[] = [
                'uid' => $uid !== '' ? $uid : StringHelper::UUID(),
                'label' => $label,
                'provider' => $provider !== '' ? $provider : 'openai',
                'apiKeyEnv' => $apiKeyEnv,
                'modelId' => $modelId,
                'reasoningEffort' => $reasoningEffort !== '' ? $reasoningEffort : null,
                'enabled' => $enabled,
            ];
        }

        return $normalized;
    }

    private function toBool(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        if (is_numeric($value)) {
            return (int)$value === 1;
        }

        if (is_string($value)) {
            return in_array(strtolower($value), ['1', 'true', 'yes', 'on'], true);
        }

        return false;
    }
}
