<?php

declare(strict_types=1);

namespace jtdev\craftautofill\tests\unit;

use jtdev\craftautofill\models\Settings;
use PHPUnit\Framework\TestCase;

final class SettingsTest extends TestCase
{
    public function testModelRowsAreNormalizedAndFirstEnabledModelWins(): void
    {
        $settings = new Settings(['modelConfigs' => [
            ['label' => ' Test model ', 'provider' => ' OPENAI ', 'apiKeyEnv' => ' $OPENAI_API_KEY ', 'modelId' => ' gpt-test ', 'enabled' => 'yes'],
            ['label' => 'Disabled', 'provider' => 'anthropic', 'apiKeyEnv' => '$ANTHROPIC_API_KEY', 'modelId' => 'claude-manual', 'enabled' => false],
        ]]);

        self::assertNotEmpty($settings->modelConfigs[0]['uid']);
        self::assertSame('Test model', $settings->modelConfigs[0]['label']);
        self::assertSame('openai', $settings->modelConfigs[0]['provider']);
        self::assertSame($settings->modelConfigs[0]['uid'], $settings->getDefaultModelConfigUid());
        self::assertTrue($settings->validate(), json_encode($settings->getErrors()));
    }

    public function testBuiltInProvidersAndUnknownManualModelIdsValidate(): void
    {
        $rows = [];
        foreach (['openai', 'anthropic', 'deepseek', 'gemini'] as $provider) {
            $rows[] = [
                'provider' => $provider,
                'apiKeyEnv' => '$TEST_PROVIDER_KEY',
                'modelId' => 'manual-id-for-' . $provider,
                'enabled' => true,
            ];
        }
        $settings = new Settings(['modelConfigs' => $rows]);

        self::assertTrue($settings->validate(), json_encode($settings->getErrors()));
        self::assertCount(4, $settings->modelConfigs);
    }

    public function testProviderSpecificReasoningValuesAreValidated(): void
    {
        $settings = new Settings(['modelConfigs' => [[
            'provider' => 'anthropic',
            'apiKeyEnv' => '$ANTHROPIC_API_KEY',
            'modelId' => 'manual-claude-id',
            'reasoningEffort' => 'high',
        ]]]);

        self::assertFalse($settings->validate());
        self::assertStringContainsString('unsupported reasoning effort', implode(' ', $settings->getErrors('modelConfigs')));
    }
}
