<?php

declare(strict_types=1);

namespace jtdev\craftautofill\tests\unit;

use jtdev\craftautofill\models\ai\AiGenerationRequest;
use jtdev\craftautofill\services\ai\AiResponseNormalizer;
use PHPUnit\Framework\TestCase;

final class AiResponseNormalizerTest extends TestCase
{
    public function testProviderNeutralOutputTextIsDecoded(): void
    {
        $request = new AiGenerationRequest(['modelConfigUid' => 'fixture-model']);
        $result = (new AiResponseNormalizer())->normalize([
            'output_text' => '[{"fieldName":"Summary","value":"Saved text"}]',
            'confidence' => 0.85,
        ], $request);

        self::assertTrue($result->success);
        self::assertSame('Saved text', $result->suggestions[0]['value']);
        self::assertSame(0.85, $result->confidence);
    }

    public function testNestedResponsesContentRemainsSupported(): void
    {
        $request = new AiGenerationRequest(['modelConfigUid' => 'fixture-model']);
        $result = (new AiResponseNormalizer())->normalize([
            'output' => [['content' => [['text' => '{"answer":42}']]]],
        ], $request);

        self::assertTrue($result->success);
        self::assertSame(42, $result->suggestions['answer']);
    }

    public function testInvalidProviderOutputDoesNotInventSuggestions(): void
    {
        $result = (new AiResponseNormalizer())->normalize(
            ['output_text' => 'not json'],
            new AiGenerationRequest(['modelConfigUid' => 'fixture-model']),
        );

        self::assertFalse($result->success);
        self::assertSame([], $result->suggestions);
        self::assertSame('Provider output was not valid JSON.', $result->error);
    }
}
