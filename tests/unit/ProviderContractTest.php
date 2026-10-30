<?php

declare(strict_types=1);

namespace jtdev\craftautofill\tests\unit;

use GuzzleHttp\Client;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use GuzzleHttp\Psr7\Response;
use jtdev\craftautofill\models\ai\AiGenerationRequest;
use jtdev\craftautofill\models\ai\AiModelConfig;
use jtdev\craftautofill\models\ai\OpenAiConfig;
use jtdev\craftautofill\services\ai\providers\anthropic\AnthropicProvider;
use jtdev\craftautofill\services\ai\providers\deepseek\DeepSeekProvider;
use jtdev\craftautofill\services\ai\providers\gemini\GeminiProvider;
use jtdev\craftautofill\services\ai\providers\openai\OpenAiProvider;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use RuntimeException;

trait UsesMockHttp
{
    /** @var list<Response> */
    public array $mockResponses = [];
    /** @var list<array<string, mixed>> */
    public array $history = [];

    protected function createClient(): ClientInterface
    {
        $stack = HandlerStack::create(new MockHandler($this->mockResponses));
        $stack->push(Middleware::history($this->history));
        return new Client(['handler' => $stack]);
    }
}

final class MockOpenAiProvider extends OpenAiProvider { use UsesMockHttp; }
final class MockAnthropicProvider extends AnthropicProvider { use UsesMockHttp; }
final class MockDeepSeekProvider extends DeepSeekProvider { use UsesMockHttp; }
final class MockGeminiProvider extends GeminiProvider { use UsesMockHttp; }

final class ProviderContractTest extends TestCase
{
    public function testOpenAiAndLegacyConfigUseCompatibleDefaults(): void
    {
        $old = new OpenAiConfig(['uid' => 'legacy', 'apiKeyEnv' => 'test-key', 'modelId' => 'gpt-manual']);
        self::assertSame('openai', $old->provider);
        self::assertTrue($old->validate(), json_encode($old->getErrors()));

        $generic = new AiModelConfig(['uid' => 'anthropic', 'provider' => 'anthropic', 'apiKeyEnv' => 'test-key', 'modelId' => 'custom-model']);
        self::assertTrue($generic->validate(), json_encode($generic->getErrors()));
        self::assertSame('custom-model', $generic->modelId);
    }

    #[DataProvider('providerPayloads')]
    public function testProviderBuildsNativeImagePayload(string $class, string $provider, string $expectedType): void
    {
        $adapter = new $class();
        $payload = $adapter->buildPayload($this->requestWithFile('image/png'), $this->config($provider));
        $encoded = json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES);

        self::assertStringContainsString($expectedType, $encoded);
        self::assertStringContainsString($provider === 'anthropic' || $provider === 'gemini' ? 'aW1hZ2U=' : 'data:image/png;base64,aW1hZ2U=', $encoded);
        self::assertStringNotContainsString('temporary.example', $encoded);
        if ($provider === 'openai') self::assertSame('json_object', $payload['text']['format']['type']);
        if ($provider === 'deepseek') self::assertSame('json_object', $payload['response_format']['type']);
        if ($provider === 'gemini') self::assertSame('application/json', $payload['generationConfig']['responseMimeType']);
    }

    public static function providerPayloads(): array
    {
        return [
            'OpenAI Responses' => [OpenAiProvider::class, 'openai', 'input_image'],
            'Anthropic Messages' => [AnthropicProvider::class, 'anthropic', '"type":"image"'],
            'DeepSeek Chat Completions' => [DeepSeekProvider::class, 'deepseek', 'image_url'],
            'Gemini generateContent' => [GeminiProvider::class, 'gemini', 'inlineData'],
        ];
    }

    #[DataProvider('pdfPayloads')]
    public function testOpenAiAnthropicAndGeminiEncodePdf(string $class, string $provider, string $marker): void
    {
        $payload = (new $class())->buildPayload($this->requestWithFile('application/pdf'), $this->config($provider));
        self::assertStringContainsString($marker, json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));
    }

    public static function pdfPayloads(): array
    {
        return [
            'OpenAI file part' => [OpenAiProvider::class, 'openai', 'input_file'],
            'Anthropic document block' => [AnthropicProvider::class, 'anthropic', '"type":"document"'],
            'Gemini inline document' => [GeminiProvider::class, 'gemini', 'application/pdf'],
        ];
    }

    public function testDeepSeekRejectsPdfContentInsteadOfDroppingIt(): void
    {
        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('cannot read "application/pdf"');
        (new DeepSeekProvider())->buildPayload($this->requestWithFile('application/pdf'), $this->config('deepseek'));
    }

    #[DataProvider('unsupportedImagePayloads')]
    public function testProvidersRejectImagesOutsideTheirDocumentedMimes(string $class, string $provider): void
    {
        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('image/heic');
        (new $class())->buildPayload($this->requestWithFile('image/heic'), $this->config($provider));
    }

    public static function unsupportedImagePayloads(): array
    {
        return [
            'OpenAI' => [OpenAiProvider::class, 'openai'],
            'Anthropic' => [AnthropicProvider::class, 'anthropic'],
            'DeepSeek' => [DeepSeekProvider::class, 'deepseek'],
        ];
    }

    #[DataProvider('responseFixtures')]
    public function testProviderNormalizesSuccessfulResponseAndSendsProviderAuth(string $class, string $provider, string $responseBody, string $authHeader): void
    {
        $adapter = new $class();
        $adapter->mockResponses = [new Response(200, ['Content-Type' => 'application/json'], $responseBody)];
        $result = $adapter->generate($this->request(), $this->config($provider));

        self::assertSame('{"suggestions":[]}', $result['output_text']);
        self::assertSame(12, $result['usage']['input_tokens']);
        self::assertSame(7, $result['usage']['output_tokens']);
        self::assertSame('response-1', $result['id']);
        self::assertArrayHasKey('providerRaw', $result);
        $expectedAuth = $authHeader === 'Authorization' ? 'Bearer test-secret' : 'test-secret';
        self::assertSame($expectedAuth, $adapter->history[0]['request']->getHeaderLine($authHeader));
    }

    public static function responseFixtures(): array
    {
        return [
            'OpenAI' => [MockOpenAiProvider::class, 'openai', '{"id":"response-1","output_text":"{\"suggestions\":[]}","usage":{"input_tokens":12,"output_tokens":7,"total_tokens":19}}', 'Authorization'],
            'Anthropic' => [MockAnthropicProvider::class, 'anthropic', '{"id":"response-1","content":[{"type":"text","text":"{\"suggestions\":[]}"}],"usage":{"input_tokens":12,"output_tokens":7}}', 'x-api-key'],
            'DeepSeek' => [MockDeepSeekProvider::class, 'deepseek', '{"id":"response-1","choices":[{"message":{"content":"{\"suggestions\":[]}"}}],"usage":{"prompt_tokens":12,"completion_tokens":7,"total_tokens":19}}', 'Authorization'],
            'Gemini' => [MockGeminiProvider::class, 'gemini', '{"responseId":"response-1","candidates":[{"content":{"parts":[{"text":"{\"suggestions\":[]}"}]}}],"usageMetadata":{"promptTokenCount":12,"candidatesTokenCount":7,"totalTokenCount":19}}', 'x-goog-api-key'],
        ];
    }

    public function testRequestLogsContainOnlyFileDescriptorsAndStripNestedFileSecrets(): void
    {
        $request = $this->requestWithFile('image/png');
        $request->fileInputs[0]['temporaryUrl'] = 'https://temporary.example/secret';
        $request->fileInputs[0]['metadata'] = ['base64' => 'hidden nested payload'];
        $safe = json_encode($request->safeLogPayload(), JSON_THROW_ON_ERROR);

        self::assertStringContainsString('assetId', $safe);
        self::assertStringContainsString('filename', $safe);
        self::assertStringNotContainsString('aW1hZ2U=', $safe);
        self::assertStringNotContainsString('temporary.example', $safe);
        self::assertStringNotContainsString('hidden nested payload', $safe);
    }

    public function testProviderErrorsDoNotLeakApiKeysOrInlineFileData(): void
    {
        $data = str_repeat('A', 400);
        $adapter = new MockOpenAiProvider();
        $adapter->mockResponses = [new Response(400, [], json_encode(['error' => ['message' => 'Bad key test-secret and data:image/png;base64,' . $data]], JSON_THROW_ON_ERROR))];

        try {
            $adapter->generate($this->requestWithFile('image/png'), $this->config('openai'));
            self::fail('Expected the provider error to be surfaced.');
        } catch (RuntimeException $exception) {
            self::assertStringContainsString('HTTP 400', $exception->getMessage());
            self::assertStringNotContainsString('test-secret', $exception->getMessage());
            self::assertStringNotContainsString($data, $exception->getMessage());
        }
    }

    private function request(): AiGenerationRequest
    {
        return new AiGenerationRequest([
            'modelConfigUid' => 'config-1',
            'messages' => [
                ['role' => 'system', 'content' => 'Return JSON.'],
                ['role' => 'user', 'content' => 'Fill the fields.'],
            ],
        ]);
    }

    private function requestWithFile(string $mimeType): AiGenerationRequest
    {
        $request = $this->request();
        $request->fileInputs = [[
            'assetId' => 42,
            'filename' => $mimeType === 'application/pdf' ? 'source.pdf' : 'source.png',
            'mimeType' => $mimeType,
            'data' => 'aW1hZ2U=',
        ]];
        return $request;
    }

    private function config(string $provider): AiModelConfig
    {
        return new AiModelConfig([
            'uid' => 'config-1',
            'provider' => $provider,
            'apiKeyEnv' => 'test-secret',
            'modelId' => 'manually-entered-model-id',
        ]);
    }
}
