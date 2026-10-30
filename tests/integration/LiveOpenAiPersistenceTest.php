<?php

declare(strict_types=1);

namespace Tests\integration;

use Codeception\Attribute\Group;
use Codeception\Test\Unit;
use craft\fields\PlainText;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\models\ai\AiGenerationRequest;
use jtdev\craftautofill\models\ai\OpenAiConfig;
use Tests\Support\TestProject;

#[Group('live')]
final class LiveOpenAiPersistenceTest extends Unit
{
    public function testLiveResponseCanBeSavedAndReloadedFromCraft(): void
    {
        if (getenv('AUTOFILL_RUN_LIVE_TESTS') !== '1' || trim((string)getenv('OPENAI_API_KEY')) === '') {
            self::markTestSkipped('Set AUTOFILL_RUN_LIVE_TESTS=1 and OPENAI_API_KEY to run this test.');
        }

        $project = TestProject::create(new PlainText([
            'name' => 'Live Summary',
            'handle' => 'liveSummary',
        ]), AutofillPlugin::EDITION_LITE);
        $request = new AiGenerationRequest([
            'modelConfigUid' => 'live-openai',
            'messages' => [[
                'role' => 'user',
                'content' => 'Return a JSON object with one key named suggestion. Its value must be an object with fieldName set to Live Summary and value set to exactly live-provider-value.',
            ]],
        ]);
        $config = new OpenAiConfig([
            'uid' => 'live-openai',
            'label' => 'Live OpenAI smoke test',
            'provider' => 'openai',
            'apiKeyEnv' => '$OPENAI_API_KEY',
            'modelId' => getenv('OPENAI_MODEL') ?: 'gpt-4.1-mini',
        ]);

        $providerResult = AutofillPlugin::getInstance()->getAiService()->generateFromRequest($request, $config);
        self::assertTrue($providerResult->success, $providerResult->error ?? 'OpenAI normalization failed.');
        self::assertArrayHasKey('suggestion', $providerResult->suggestions);

        $result = AutofillPlugin::getInstance()->getAiService()->normalizeAutofillResponse(
            json_encode([$providerResult->suggestions['suggestion']], JSON_THROW_ON_ERROR),
            (int)$project['autofill']->id,
            (int)$project['entry']->id,
            $project['siteId'],
        );
        AutofillPlugin::getInstance()->getEntrySuggestionApplyService()->applySuggestion(
            (int)$project['autofill']->id,
            (int)$project['entry']->id,
            $project['siteId'],
            $result->suggestions[0],
        );

        self::assertSame('live-provider-value', TestProject::reloadEntry($project['entry'])->getFieldValue('liveSummary'));
    }
}
