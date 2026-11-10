<?php

declare(strict_types=1);

namespace jtdev\craftautofill\models\ai;

use craft\base\Model;
use craft\helpers\App;

/** Shared settings shape for a configured provider/model pair. */
class AiModelConfig extends Model
{
    public const DEFAULT_TIMEOUT = 30;
    public const MIN_TIMEOUT = 5;
    public const MAX_TIMEOUT = 600;
    public const MIN_OUTPUT_TOKENS = 256;
    public const MAX_OUTPUT_TOKENS = 200000;

    public string $uid = '';
    public string $label = '';
    public string $provider = 'openai';
    public string $apiKeyEnv = '';
    public string $modelId = '';
    public ?string $reasoningEffort = null;
    public bool $enabled = true;
    /** Seconds to wait for one provider response. Filled from the global `requestTimeout` setting. */
    public int $timeout = self::DEFAULT_TIMEOUT;
    /** Filled from the global `maxOutputTokens` setting. Null uses the provider's default output limit. */
    public ?int $maxOutputTokens = null;

    public function rules(): array
    {
        return [
            [['provider', 'apiKeyEnv', 'modelId'], 'required'],
            [['uid', 'label', 'provider', 'apiKeyEnv', 'modelId', 'reasoningEffort'], 'string'],
            ['provider', 'in', 'range' => ['openai', 'anthropic', 'deepseek', 'gemini']],
            ['enabled', 'boolean'],
            ['timeout', 'integer', 'min' => self::MIN_TIMEOUT, 'max' => self::MAX_TIMEOUT],
            ['maxOutputTokens', 'integer', 'min' => self::MIN_OUTPUT_TOKENS, 'max' => self::MAX_OUTPUT_TOKENS],
        ];
    }

    public function getParsedApiKey(): string
    {
        $value = App::parseEnv($this->apiKeyEnv);
        return is_string($value) ? trim($value) : '';
    }

    /** API keys must be stored as `$ENV_VAR` references so secrets never reach project config. */
    public static function isEnvReference(string $value): bool
    {
        return preg_match('/^\$[A-Za-z_][A-Za-z0-9_]*$/', trim($value)) === 1;
    }
}
