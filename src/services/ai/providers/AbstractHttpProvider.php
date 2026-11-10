<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\ai\providers;

use Craft;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\RequestException;
use jtdev\craftautofill\models\ai\AiGenerationRequest;
use jtdev\craftautofill\models\ai\AiModelConfig;
use RuntimeException;

abstract class AbstractHttpProvider
{
    protected const CONNECT_TIMEOUT = 10;

    abstract protected function getEndpoint(AiModelConfig $config): string;

    /** @return array<string, string> */
    abstract protected function getHeaders(AiModelConfig $config): array;

    /** @return array<string, mixed> */
    abstract public function buildPayload(AiGenerationRequest $request, AiModelConfig $config): array;

    protected function createClient(): ClientInterface
    {
        return Craft::createGuzzleClient();
    }

    /** @return array<string, mixed> */
    protected function postJson(AiGenerationRequest $request, AiModelConfig $config): array
    {
        $this->validateInputs($request);
        try {
            $client = $this->createClient();
            $response = $client->request('POST', $this->getEndpoint($config), [
                'headers' => $this->getHeaders($config) + ['Content-Type' => 'application/json'],
                'json' => $this->buildPayload($request, $config),
                'http_errors' => false,
                // The response limit comes from the `requestTimeout` setting, not Craft's Guzzle config.
                'timeout' => max(AiModelConfig::MIN_TIMEOUT, $config->timeout),
                'connect_timeout' => min(static::CONNECT_TIMEOUT, max(AiModelConfig::MIN_TIMEOUT, $config->timeout)),
            ]);
        } catch (GuzzleException $exception) {
            if (defined('CURLE_OPERATION_TIMEOUTED') &&
                ($exception instanceof ConnectException || $exception instanceof RequestException) &&
                ($exception->getHandlerContext()['errno'] ?? null) === CURLE_OPERATION_TIMEOUTED) {
                throw new RuntimeException(sprintf(
                    'The %s request timed out after %d seconds. Raise `requestTimeout` in config/autofill.php, or use a faster model.',
                    $config->provider,
                    $config->timeout,
                ), previous: $exception);
            }
            throw new RuntimeException('AI provider request failed. Check connectivity and provider configuration.', previous: $exception);
        }

        $status = $response->getStatusCode();
        $body = (string)$response->getBody();
        $decoded = json_decode($body, true);
        if ($status < 200 || $status >= 300) {
            $reason = is_array($decoded) ? ($decoded['error']['message'] ?? $decoded['message'] ?? '') : '';
            $reason = $this->safeError((string)$reason, $config->getParsedApiKey());
            throw new RuntimeException(sprintf('Provider %s request failed (HTTP %d).%s', $config->provider, $status, $reason !== '' ? ' ' . $reason : ''));
        }
        if (!is_array($decoded)) {
            throw new RuntimeException(sprintf('Provider %s returned an invalid JSON response.', $config->provider));
        }

        return $decoded;
    }

    /** Truncated JSON cannot be parsed, so report the real cause instead of a parse error. */
    protected function assertNotTruncated(bool $truncated, AiModelConfig $config): void
    {
        if ($truncated) {
            throw new RuntimeException(sprintf(
                'The %s response was cut off because it reached the output token limit. Raise `maxOutputTokens` in config/autofill.php, or reduce the number of output fields.',
                $config->provider,
            ));
        }
    }

    /** @return array{output_text:string,usage:array<string,int>,id:?string,provider:string,providerRaw:array<string,mixed>} */
    protected function envelope(array $raw, string $text, array $usage, ?string $id, string $provider): array
    {
        return [
            'output_text' => $text,
            'usage' => [
                'input_tokens' => (int)($usage['input_tokens'] ?? 0),
                'output_tokens' => (int)($usage['output_tokens'] ?? 0),
                'total_tokens' => (int)($usage['total_tokens'] ?? 0),
            ],
            'id' => $id,
            'provider' => $provider,
            'providerRaw' => $raw,
        ];
    }

    protected function validateInputs(AiGenerationRequest $request): void
    {
        foreach ($request->fileInputs as $index => $file) {
            if (!is_array($file) || !isset($file['mimeType'], $file['data'])) {
                throw new RuntimeException(sprintf('File input %d is missing its MIME type or content.', $index + 1));
            }
            if (base64_decode((string)$file['data'], true) === false) {
                throw new RuntimeException(sprintf('File input %d has invalid encoded content.', $index + 1));
            }
        }
    }

    protected function isImage(string $mimeType): bool
    {
        return in_array(strtolower($mimeType), ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif', 'image/avif'], true);
    }

    protected function isText(string $mimeType): bool
    {
        return str_starts_with(strtolower($mimeType), 'text/') || in_array(strtolower($mimeType), ['application/json', 'application/xml', 'application/rtf'], true);
    }

    protected function decodedText(array $file): string
    {
        $bytes = base64_decode((string)$file['data'], true);
        return $bytes === false ? '' : $bytes;
    }

    protected function dataUrl(array $file): string
    {
        return 'data:' . strtolower((string)$file['mimeType']) . ';base64,' . (string)$file['data'];
    }

    private function safeError(string $message, string $apiKey): string
    {
        $message = trim($message);
        if ($apiKey !== '') {
            $message = str_replace($apiKey, '[redacted]', $message);
        }
        $message = preg_replace('/data:[^\s,"}]+/i', '[file data redacted]', $message) ?? '';
        $message = preg_replace('/[A-Za-z0-9+\/=]{300,}/', '[file data redacted]', $message) ?? '';
        return mb_substr($message, 0, 500);
    }
}
