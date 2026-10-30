<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\ai\providers\gemini;

use craft\base\Model;
use jtdev\craftautofill\models\ai\AiGenerationRequest;
use jtdev\craftautofill\models\ai\AiModelConfig;
use jtdev\craftautofill\services\ai\AiProviderInterface;
use jtdev\craftautofill\services\ai\providers\AbstractHttpProvider;
use RuntimeException;

class GeminiProvider extends AbstractHttpProvider implements AiProviderInterface
{
    public function getProviderKey(): string { return 'gemini'; }

    protected function getEndpoint(AiModelConfig $config): string
    {
        return 'https://generativelanguage.googleapis.com/v1beta/models/' . rawurlencode($config->modelId) . ':generateContent';
    }

    protected function getHeaders(AiModelConfig $config): array
    {
        $key = $config->getParsedApiKey();
        if ($key === '') throw new RuntimeException('Gemini API key environment variable resolved to an empty value.');
        return ['x-goog-api-key' => $key];
    }

    public function buildPayload(AiGenerationRequest $request, AiModelConfig $config): array
    {
        $system = [];
        $contents = [];
        foreach ($request->messages as $message) {
            $role = (string)($message['role'] ?? 'user');
            $text = $message['content'] ?? '';
            if ($role === 'system') {
                $system[] = ['text' => is_string($text) ? $text : json_encode($text, JSON_UNESCAPED_SLASHES)];
                continue;
            }
            $contents[] = ['role' => $role === 'assistant' ? 'model' : 'user', 'parts' => is_array($text) ? $text : [['text' => (string)$text]]];
        }

        foreach ($request->fileInputs as $file) {
            $mime = strtolower((string)$file['mimeType']);
            if (!$this->isImage($mime) && $mime !== 'application/pdf' && !$this->isText($mime)) {
                throw new RuntimeException(sprintf('Gemini does not support "%s" as readable file content through inline asset input.', $mime));
            }
            if ($this->isText($mime)) {
                $part = ['text' => "File: {$file['filename']}\n" . $this->decodedText($file)];
            } else {
                $part = ['inlineData' => ['mimeType' => $mime, 'data' => (string)$file['data']]];
            }
            $this->appendPart($contents, $part);
        }

        $payload = [
            'contents' => $contents,
            'generationConfig' => ['responseMimeType' => 'application/json'],
        ];
        if ($system !== []) $payload['systemInstruction'] = ['parts' => $system];
        return $payload;
    }

    public function generate(AiGenerationRequest $request, Model $providerConfig): array
    {
        if (!$providerConfig instanceof AiModelConfig || $providerConfig->provider !== 'gemini') throw new RuntimeException('Gemini provider requires a Gemini model configuration.');
        if (!$request->validate() || !$providerConfig->validate()) throw new RuntimeException('Gemini request or configuration is invalid.');
        $raw = $this->postJson($request, $providerConfig);
        $text = '';
        foreach (($raw['candidates'][0]['content']['parts'] ?? []) as $part) if (is_array($part) && is_string($part['text'] ?? null)) $text .= $part['text'];
        $usage = is_array($raw['usageMetadata'] ?? null) ? [
            'input_tokens' => $raw['usageMetadata']['promptTokenCount'] ?? 0,
            'output_tokens' => $raw['usageMetadata']['candidatesTokenCount'] ?? 0,
            'total_tokens' => $raw['usageMetadata']['totalTokenCount'] ?? 0,
        ] : [];
        $id = $raw['responseId'] ?? null;
        return $this->envelope($raw, $text, $usage, is_string($id) ? $id : null, 'gemini');
    }

    private function appendPart(array &$contents, array $part): void
    {
        for ($i = count($contents) - 1; $i >= 0; $i--) {
            if (($contents[$i]['role'] ?? '') !== 'user') continue;
            $contents[$i]['parts'][] = $part;
            return;
        }
        $contents[] = ['role' => 'user', 'parts' => [$part]];
    }
}
