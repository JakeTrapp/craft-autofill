<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\ai\providers\anthropic;

use craft\base\Model;
use jtdev\craftautofill\models\ai\AiGenerationRequest;
use jtdev\craftautofill\models\ai\AiModelConfig;
use jtdev\craftautofill\services\ai\AiProviderInterface;
use jtdev\craftautofill\services\ai\providers\AbstractHttpProvider;
use RuntimeException;

class AnthropicProvider extends AbstractHttpProvider implements AiProviderInterface
{
    public function getProviderKey(): string { return 'anthropic'; }
    protected function getEndpoint(AiModelConfig $config): string { return 'https://api.anthropic.com/v1/messages'; }

    protected function getHeaders(AiModelConfig $config): array
    {
        $key = $config->getParsedApiKey();
        if ($key === '') throw new RuntimeException('Anthropic API key environment variable resolved to an empty value.');
        return ['x-api-key' => $key, 'anthropic-version' => '2023-06-01'];
    }

    protected function isImage(string $mimeType): bool
    {
        return in_array(strtolower($mimeType), ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], true);
    }

    public function buildPayload(AiGenerationRequest $request, AiModelConfig $config): array
    {
        $system = [];
        $messages = [];
        foreach ($request->messages as $message) {
            $role = (string)($message['role'] ?? 'user');
            $content = $message['content'] ?? '';
            if ($role === 'system') {
                $system[] = is_string($content) ? $content : json_encode($content, JSON_UNESCAPED_SLASHES);
            } else {
                $messages[] = ['role' => $role === 'assistant' ? 'assistant' : 'user', 'content' => is_array($content) ? $content : (string)$content];
            }
        }

        foreach ($request->fileInputs as $file) {
            $mime = strtolower((string)$file['mimeType']);
            if ($this->isImage($mime)) {
                $part = ['type' => 'image', 'source' => ['type' => 'base64', 'media_type' => $mime, 'data' => (string)$file['data']]];
            } elseif ($mime === 'application/pdf') {
                $part = ['type' => 'document', 'source' => ['type' => 'base64', 'media_type' => 'application/pdf', 'data' => (string)$file['data']]];
            } elseif ($this->isText($mime)) {
                $part = ['type' => 'text', 'text' => "File: {$file['filename']}\n" . $this->decodedText($file)];
            } else {
                throw new RuntimeException(sprintf('Anthropic input does not support file type "%s" as content.', $mime));
            }
            $this->appendPart($messages, $part);
        }

        $payload = ['model' => $config->modelId, 'max_tokens' => 4096, 'messages' => $messages];
        if ($system !== []) $payload['system'] = implode("\n\n", $system);
        return $payload;
    }

    public function generate(AiGenerationRequest $request, Model $providerConfig): array
    {
        if (!$providerConfig instanceof AiModelConfig || $providerConfig->provider !== 'anthropic') throw new RuntimeException('Anthropic provider requires an Anthropic model configuration.');
        if (!$request->validate() || !$providerConfig->validate()) throw new RuntimeException('Anthropic request or configuration is invalid.');
        $raw = $this->postJson($request, $providerConfig);
        $text = '';
        foreach (($raw['content'] ?? []) as $part) if (is_array($part) && is_string($part['text'] ?? null)) $text .= $part['text'];
        $usage = is_array($raw['usage'] ?? null) ? [
            'input_tokens' => $raw['usage']['input_tokens'] ?? 0,
            'output_tokens' => $raw['usage']['output_tokens'] ?? 0,
            'total_tokens' => (int)($raw['usage']['input_tokens'] ?? 0) + (int)($raw['usage']['output_tokens'] ?? 0),
        ] : [];
        return $this->envelope($raw, $text, $usage, is_string($raw['id'] ?? null) ? $raw['id'] : null, 'anthropic');
    }

    private function appendPart(array &$messages, array $part): void
    {
        for ($i = count($messages) - 1; $i >= 0; $i--) {
            if (($messages[$i]['role'] ?? '') !== 'user') continue;
            $content = $messages[$i]['content'] ?? '';
            $messages[$i]['content'] = is_array($content) ? $content : [['type' => 'text', 'text' => (string)$content]];
            $messages[$i]['content'][] = $part;
            return;
        }
        $messages[] = ['role' => 'user', 'content' => [$part]];
    }
}
