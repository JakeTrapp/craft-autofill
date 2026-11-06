<?php

declare(strict_types=1);

namespace Tests\integration;

use Codeception\Test\Unit;
use Craft;
use craft\base\Model;
use craft\fields\PlainText;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\models\ai\AiGenerationRequest;
use jtdev\craftautofill\records\AiRequestLogRecord;
use jtdev\craftautofill\services\ai\AiProviderInterface;
use jtdev\craftautofill\services\ai\providers\openai\OpenAiProvider;
use Tests\Support\TestProject;

final class PartialGenerationSafetyTest extends Unit
{
    private const MODEL_UID = 'partial-generation-safety-model';
    public const RAW_RESPONSE = '{"suggestions":[{"fieldName":"Safety Target","value":{"malformed":true}},{"fieldName":"Title","value":"Generated native title"}]}';

    public function testRuntimeReturnsValidAndInvalidSiblingsAndLogsOriginalRawOutput(): void
    {
        $project = TestProject::create(new PlainText([
            'name' => 'Safety Target',
            'handle' => 'safetyTarget',
        ]));
        [$settings, $previousConfigs, $provider] = $this->registerFixtureProvider();

        try {
            $definition = $this->addNativeTitleOutput($project['autofill']);
            $suggestions = AutofillPlugin::getInstance()->getWorkflowRuntimeService()->generate(
                $definition,
                $project['entry'],
                'Generate the requested values.',
            );

            self::assertSame(1, $provider->calls);
            self::assertCount(2, $suggestions);
            self::assertNotEmpty($suggestions[0]['validationErrors']);
            self::assertSame('Generated native title', $suggestions[1]['value']);
            self::assertSame([], $suggestions[1]['validationErrors']);

            $log = $this->latestLogForEntry((int)$project['entry']->id);
            self::assertNotNull($log);
            self::assertSame(self::RAW_RESPONSE, $log->responseRawText);
            self::assertFalse((bool)$log->success);
            $payload = json_decode((string)$log->responsePayloadJson, true, 512, JSON_THROW_ON_ERROR);
            self::assertNotEmpty($payload['suggestions'][0]['validationErrors'] ?? []);
            self::assertSame([], $payload['suggestions'][1]['validationErrors'] ?? null);
        } finally {
            $this->restoreFixtureProvider($settings, $previousConfigs);
        }
    }

    public function testCompletelyMalformedJsonIsLoggedAndDoesNotChangeContent(): void
    {
        $project = TestProject::create(new PlainText(['name' => 'Safety Target', 'handle' => 'badJsonTarget']));
        [$settings, $previousConfigs, $provider] = $this->registerFixtureProvider();
        $provider->response = '{broken JSON';
        try {
            try {
                AutofillPlugin::getInstance()->getWorkflowRuntimeService()->generate($this->addNativeTitleOutput($project['autofill']), $project['entry'], 'Generate');
                self::fail('Malformed JSON was accepted.');
            } catch (\RuntimeException $exception) { self::assertStringContainsString('JSON', $exception->getMessage()); }
            $log = $this->latestLogForEntry((int)$project['entry']->id);
            self::assertSame('{broken JSON', $log->responseRawText);
            self::assertFalse((bool)$log->success);
            self::assertNull(TestProject::reloadEntry($project['entry'])->getFieldValue('badJsonTarget'));
        } finally { $this->restoreFixtureProvider($settings, $previousConfigs); }
    }

    public function testBulkRunSkipsInvalidOutputAndAppliesValidSibling(): void
    {
        $project = TestProject::create(new PlainText([
            'name' => 'Safety Target',
            'handle' => 'safetyTargetBulk',
        ]));
        [$settings, $previousConfigs, $provider] = $this->registerFixtureProvider();

        try {
            $definition = $this->addNativeTitleOutput($project['autofill']);
            self::assertTrue(Craft::$app->getFields()->saveField($definition), implode(' ', $definition->getErrorSummary(true)));

            AutofillPlugin::getInstance()->getWorkflowService()->migrateLegacyFields();
            $result = AutofillPlugin::getInstance()->getBulkAutofillService()->runForEntry(
                (int)$definition->id,
                null,
                (int)$project['entry']->id,
                $project['siteId'],
                'Generate the requested values.',
                'partial-safety-test',
                (int)\craft\elements\User::find()->admin()->one()->id,
            );

            self::assertSame(1, $provider->calls, 'Generation should make one provider call; applying siblings must not trigger another.');
            self::assertFalse($result['success']);
            self::assertSame(1, $result['suggestionsApplied']);
            self::assertStringContainsString('Safety Target', (string)$result['error']);

            $reloaded = TestProject::reloadEntry($project['entry']);
            self::assertSame('Generated native title', $reloaded->title);
            self::assertNull($reloaded->getFieldValue('safetyTargetBulk'));

            $log = $this->latestLogForEntry((int)$project['entry']->id);
            self::assertNotNull($log);
            self::assertSame(self::RAW_RESPONSE, $log->responseRawText);
            self::assertFalse((bool)$log->success);
            $payload = json_decode((string)$log->responsePayloadJson, true, 512, JSON_THROW_ON_ERROR);
            self::assertNotEmpty($payload['suggestions'][0]['validationErrors'] ?? []);
            self::assertSame([], $payload['suggestions'][1]['validationErrors'] ?? null);
        } finally {
            $this->restoreFixtureProvider($settings, $previousConfigs);
        }
    }

    /** @return array{0:object,1:array,2:PartialRawResponseProvider} */
    private function registerFixtureProvider(): array
    {
        $plugin = AutofillPlugin::getInstance();
        $settings = $plugin->getSettings();
        $previousConfigs = $settings->modelConfigs;
        $settings->modelConfigs = [[
            'uid' => self::MODEL_UID,
            'provider' => 'openai',
            'apiKeyEnv' => '$OPENAI_API_KEY',
            'modelId' => 'partial-safety-fixture-model',
            'enabled' => true,
        ]];
        $provider = new PartialRawResponseProvider();
        $plugin->getAiService()->registerProvider($provider);

        return [$settings, $previousConfigs, $provider];
    }

    private function restoreFixtureProvider(object $settings, array $previousConfigs): void
    {
        $settings->modelConfigs = $previousConfigs;
        AutofillPlugin::getInstance()->getAiService()->registerProvider(new OpenAiProvider());
    }

    private function addNativeTitleOutput(\jtdev\craftautofill\fields\AutofillField $definition): \jtdev\craftautofill\fields\AutofillField
    {
        $definition->modelConfigUid = self::MODEL_UID;
        $definition->rows[] = [
            'targetFieldUid' => '__native__:title',
            'prompt' => 'Write a title.',
            'requiresApproval' => false,
            'overrideCurrentValue' => true,
            'enabled' => true,
        ];

        return $definition;
    }

    private function latestLogForEntry(int $entryId): ?AiRequestLogRecord
    {
        $record = AiRequestLogRecord::find()
            ->where(['entryId' => $entryId])
            ->orderBy(['id' => SORT_DESC])
            ->one();

        return $record instanceof AiRequestLogRecord ? $record : null;
    }
}

final class PartialRawResponseProvider implements AiProviderInterface
{
    public int $calls = 0;
    public string $response = PartialGenerationSafetyTest::RAW_RESPONSE;

    public function getProviderKey(): string
    {
        return 'openai';
    }

    public function generate(AiGenerationRequest $request, Model $providerConfig): array
    {
        $this->calls++;

        return [
            'output_text' => $this->response,
            'usage' => ['input_tokens' => 3, 'output_tokens' => 5, 'total_tokens' => 8],
            'id' => 'partial-safety-fixture-response',
            'providerRaw' => ['fixture' => true],
        ];
    }
}
