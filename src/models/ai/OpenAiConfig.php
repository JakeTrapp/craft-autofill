<?php

declare(strict_types=1);

namespace jtdev\craftautofill\models\ai;

/** @deprecated Use AiModelConfig; retained for existing callers. */
class OpenAiConfig extends AiModelConfig
{
    public string $provider = 'openai';

    public function rules(): array
    {
        return array_merge(parent::rules(), [
            ['reasoningEffort', 'in', 'range' => ['low', 'medium', 'high'], 'skipOnEmpty' => true],
        ]);
    }
}
