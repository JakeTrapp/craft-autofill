<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\ai\providers\openai;

use craft\base\Model;
use jtdev\craftautofill\models\ai\AiGenerationRequest;
use jtdev\craftautofill\models\ai\AiModelConfig;
use jtdev\craftautofill\services\ai\AiProviderInterface;
use jtdev\craftautofill\services\ai\providers\AbstractHttpProvider;
use RuntimeException;

class OpenAiProvider extends AbstractHttpProvider implements AiProviderInterface
{
    public function getProviderKey(): string { return 'openai'; }
    protected function getEndpoint(AiModelConfig $config): string { return 'https://api.openai.com/v1/responses'; }

    protected function getHeaders(AiModelConfig $config): array
    {
        $key = $config->getParsedApiKey();
        if ($key === '') throw new RuntimeException('OpenAI API key environment variable resolved to an empty value.');
        return ['Authorization' => 'Bearer ' . $key];
    }

    protected function isImage(string $mimeType): bool
    {
        return in_array(strtolower($mimeType), ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], true);
    }

    public function buildPayload(AiGenerationRequest $request, AiModelConfig $config): array
    {
        $messages = $request->messages;
        foreach ($request->fileInputs as $file) {
            $mime = strtolower((string)$file['mimeType']);
            $content = $this->userContent($messages);
            if ($this->isImage($mime)) {
                $content[] = ['type' => 'input_image', 'image_url' => $this->dataUrl($file)];
            } elseif ($mime === 'application/pdf') {
                $content[] = ['type' => 'input_file', 'filename' => (string)$file['filename'], 'file_data' => $this->dataUrl($file)];
            } elseif ($this->isText($mime)) {
                $content[] = ['type' => 'input_text', 'text' => "File: {$file['filename']}\n" . $this->decodedText($file)];
            } else {
                throw new RuntimeException(sprintf('OpenAI input does not support file type "%s" as content.', $mime));
            }
            $this->setUserContent($messages, $content);
        }

        $payload = ['model' => $config->modelId, 'input' => $messages, 'text' => ['format' => ['type' => 'json_object']]];
        if ($config->reasoningEffort !== null && $config->reasoningEffort !== '') {
            $payload['reasoning'] = ['effort' => $config->reasoningEffort];
        }
        return $payload;
    }

    public function generate(AiGenerationRequest $request, Model $providerConfig): array
    {
        if (!$providerConfig instanceof AiModelConfig || $providerConfig->provider !== 'openai') throw new RuntimeException('OpenAI provider requires an OpenAI model configuration.');
        if (!$request->validate() || !$providerConfig->validate()) throw new RuntimeException('OpenAI request or configuration is invalid.');
        $raw = $this->postJson($request, $providerConfig);
        $text = is_string($raw['output_text'] ?? null) ? $raw['output_text'] : $this->extractOutputText($raw);
        $usage = is_array($raw['usage'] ?? null) ? $raw['usage'] : [];
        return $this->envelope($raw, $text, $usage, is_string($raw['id'] ?? null) ? $raw['id'] : null, 'openai');
    }

    private function extractOutputText(array $raw): string
    {
        foreach (($raw['output'] ?? []) as $item) {
            foreach (($item['content'] ?? []) as $part) {
                if (is_string($part['text'] ?? null)) return $part['text'];
            }
        }
        return '';
    }

    private function userContent(array &$messages): array
    {
        foreach ($messages as &$message) {
            if (($message['role'] ?? '') !== 'user') continue;
            $content = $message['content'] ?? '';
            return is_array($content) ? $content : [['type' => 'input_text', 'text' => (string)$content]];
        }
        $messages[] = ['role' => 'user', 'content' => []];
        return [];
    }

    private function setUserContent(array &$messages, array $content): void
    {
        foreach ($messages as &$message) {
            if (($message['role'] ?? '') === 'user') { $message['content'] = $content; return; }
        }
        $messages[] = ['role' => 'user', 'content' => $content];
    }
}
