<?php

declare(strict_types=1);

namespace jtdev\craftautofill\models\ai;

use craft\base\Model;
use craft\helpers\App;

/** Shared settings shape for a configured provider/model pair. */
class AiModelConfig extends Model
{
    public string $uid = '';
    public string $label = '';
    public string $provider = 'openai';
    public string $apiKeyEnv = '';
    public string $modelId = '';
    public ?string $reasoningEffort = null;
    public bool $enabled = true;

    public function rules(): array
    {
        return [
            [['provider', 'apiKeyEnv', 'modelId'], 'required'],
            [['uid', 'label', 'provider', 'apiKeyEnv', 'modelId', 'reasoningEffort'], 'string'],
            ['provider', 'in', 'range' => ['openai', 'anthropic', 'deepseek', 'gemini']],
            ['enabled', 'boolean'],
        ];
    }

    public function getParsedApiKey(): string
    {
        return trim(App::parseEnv($this->apiKeyEnv));
    }
}
