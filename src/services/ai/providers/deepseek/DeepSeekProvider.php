<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\ai\providers\deepseek;

use craft\base\Model;
use jtdev\craftautofill\models\ai\AiGenerationRequest;
use jtdev\craftautofill\models\ai\AiModelConfig;
use jtdev\craftautofill\services\ai\AiProviderInterface;
use jtdev\craftautofill\services\ai\providers\AbstractHttpProvider;
use RuntimeException;

class DeepSeekProvider extends AbstractHttpProvider implements AiProviderInterface
{
    public function getProviderKey(): string { return 'deepseek'; }
    protected function getEndpoint(AiModelConfig $config): string { return 'https://api.deepseek.com/chat/completions'; }

    protected function getHeaders(AiModelConfig $config): array
    {
        $key = $config->getParsedApiKey();
        if ($key === '') throw new RuntimeException('DeepSeek API key environment variable resolved to an empty value.');
        return ['Authorization' => 'Bearer ' . $key];
    }

    public function buildPayload(AiGenerationRequest $request, AiModelConfig $config): array
    {
        $messages = $request->messages;
        foreach ($request->fileInputs as $file) {
            $mime = strtolower((string)$file['mimeType']);
            if (!in_array($mime, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], true)) {
                if ($this->isText($mime)) {
                    $this->appendText($messages, "File: {$file['filename']}\n" . $this->decodedText($file));
                    continue;
                }
                throw new RuntimeException(sprintf('DeepSeek currently accepts image inputs as JPEG, PNG, GIF, or WebP. It cannot read "%s" as file content.', $mime));
            }
            $this->appendPart($messages, ['type' => 'image_url', 'image_url' => ['url' => $this->dataUrl($file)]]);
        }

        $payload = [
            'model' => $config->modelId,
            'messages' => $messages,
            'response_format' => ['type' => 'json_object'],
        ];
        if ($config->reasoningEffort !== null && $config->reasoningEffort !== '') {
            $payload['reasoning_effort'] = $config->reasoningEffort;
        }
        if ($config->maxOutputTokens !== null) {
            $payload['max_tokens'] = $config->maxOutputTokens;
        }
        return $payload;
    }

    public function generate(AiGenerationRequest $request, Model $providerConfig): array
    {
        if (!$providerConfig instanceof AiModelConfig || $providerConfig->provider !== 'deepseek') throw new RuntimeException('DeepSeek provider requires a DeepSeek model configuration.');
        if (!$request->validate() || !$providerConfig->validate()) throw new RuntimeException('DeepSeek request or configuration is invalid.');
        $raw = $this->postJson($request, $providerConfig);
        $this->assertNotTruncated(($raw['choices'][0]['finish_reason'] ?? '') === 'length', $providerConfig);
        $choice = $raw['choices'][0]['message']['content'] ?? '';
        $text = is_string($choice) ? $choice : $this->contentText($choice);
        $usage = is_array($raw['usage'] ?? null) ? [
            'input_tokens' => $raw['usage']['prompt_tokens'] ?? 0,
            'output_tokens' => $raw['usage']['completion_tokens'] ?? 0,
            'total_tokens' => $raw['usage']['total_tokens'] ?? 0,
        ] : [];
        return $this->envelope($raw, $text, $usage, is_string($raw['id'] ?? null) ? $raw['id'] : null, 'deepseek');
    }

    private function appendPart(array &$messages, array $part): void
    {
        foreach ($messages as &$message) {
            if (($message['role'] ?? '') !== 'user') continue;
            $content = $message['content'] ?? '';
            $message['content'] = is_array($content) ? $content : [['type' => 'text', 'text' => (string)$content]];
            $message['content'][] = $part;
            return;
        }
        $messages[] = ['role' => 'user', 'content' => [$part]];
    }

    private function appendText(array &$messages, string $text): void
    {
        $this->appendPart($messages, ['type' => 'text', 'text' => $text]);
    }

    private function contentText(mixed $content): string
    {
        if (!is_array($content)) return '';
        $text = '';
        foreach ($content as $part) if (is_array($part) && is_string($part['text'] ?? null)) $text .= $part['text'];
        return $text;
    }
}
