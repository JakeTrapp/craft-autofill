<?php

declare(strict_types=1);

namespace Tests\integration;

use Codeception\Test\Unit;
use craft\fields\Json;
use craft\fields\Money;
use craft\fields\PlainText;
use craft\fields\Table;
use jtdev\craftautofill\AutofillPlugin;
use Tests\Support\TestProject;

final class SuggestionPersistenceTest extends Unit
{
    public function testLegacyApplyRejectsAnOutputOutsideTheEntryLayout(): void
    {
        $source = TestProject::create(new PlainText(['name' => 'Source output', 'handle' => 'sourceOutput']));
        $other = TestProject::create(new PlainText(['name' => 'Other output', 'handle' => 'otherOutput']));
        try {
            AutofillPlugin::getInstance()->getEntrySuggestionApplyService()->applySuggestion(
                (int)$source['autofill']->id,
                (int)$other['entry']->id,
                $other['siteId'],
                ['targetFieldUid' => $source['targetUid'], 'value' => 'Must not be saved'],
            );
            self::fail('An output from another layout was accepted.');
        } catch (\RuntimeException $exception) {
            self::assertStringContainsString('not part of this content layout', $exception->getMessage());
        }
        self::assertNull(TestProject::reloadEntry($other['entry'])->getFieldValue('otherOutput'));
    }

    public function testAiResponseIsNormalizedAppliedAndReloadedFromCraft(): void
    {
        $project = TestProject::create(new PlainText([
            'name' => 'Summary',
            'handle' => 'summary',
        ]), AutofillPlugin::EDITION_LITE);

        $normalized = AutofillPlugin::getInstance()->getAiService()->normalizeAutofillResponse(
            '[{"fieldName":"Summary","value":"This came from the AI response."}]',
            (int)$project['autofill']->id,
            (int)$project['entry']->id,
            $project['siteId'],
        );

        self::assertTrue($normalized->success);
        self::assertSame([], $normalized->suggestions[0]['validationErrors']);

        AutofillPlugin::getInstance()->getEntrySuggestionApplyService()->applySuggestion(
            (int)$project['autofill']->id,
            (int)$project['entry']->id,
            $project['siteId'],
            $normalized->suggestions[0],
        );

        $reloaded = TestProject::reloadEntry($project['entry']);
        self::assertSame('This came from the AI response.', $reloaded->getFieldValue('summary'));
    }

    public function testJsonStructureSurvivesARealCraftSave(): void
    {
        $project = TestProject::create(new Json([
            'name' => 'Structured Data',
            'handle' => 'structuredData',
        ]), AutofillPlugin::EDITION_LITE);

        $result = AutofillPlugin::getInstance()->getAiService()->normalizeAutofillResponse(
            '[{"fieldName":"Structured Data","value":{"headline":"Stored","scores":[3,5,8]}}]',
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

        $stored = TestProject::reloadEntry($project['entry'])->getFieldValue('structuredData');
        $stored = $stored instanceof \JsonSerializable ? $stored->jsonSerialize() : $stored;
        self::assertSame('Stored', $stored['headline']);
        self::assertSame([3, 5, 8], $stored['scores']);
    }

    public function testTableRowsSurviveARealCraftSaveInPro(): void
    {
        $project = TestProject::create(new Table([
            'name' => 'Facts',
            'handle' => 'facts',
            'columns' => [
                'col1' => ['heading' => 'Label', 'handle' => 'label', 'type' => 'singleline'],
                'col2' => ['heading' => 'Amount', 'handle' => 'amount', 'type' => 'number'],
            ],
            'minRows' => 1,
        ]));

        $result = AutofillPlugin::getInstance()->getAiService()->normalizeAutofillResponse(
            '[{"fieldName":"Facts","value":{"rows":[{"label":"Visitors","amount":12}]}}]',
            (int)$project['autofill']->id,
            (int)$project['entry']->id,
            $project['siteId'],
        );
        self::assertSame([], $result->suggestions[0]['validationErrors']);
        AutofillPlugin::getInstance()->getEntrySuggestionApplyService()->applySuggestion(
            (int)$project['autofill']->id,
            (int)$project['entry']->id,
            $project['siteId'],
            $result->suggestions[0],
        );

        $rows = TestProject::reloadEntry($project['entry'])->getFieldValue('facts');
        self::assertSame('Visitors', $rows[0]['col1']);
        self::assertSame(12.0, (float)$rows[0]['col2']);
    }

    public function testMoneyValueSurvivesARealCraftSaveInPro(): void
    {
        $project = TestProject::create(new Money([
            'name' => 'Budget',
            'handle' => 'budget',
            'currency' => 'USD',
        ]));

        $result = AutofillPlugin::getInstance()->getAiService()->normalizeAutofillResponse(
            '[{"fieldName":"Budget","value":"123.45"}]',
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

        $money = TestProject::reloadEntry($project['entry'])->getFieldValue('budget');
        self::assertSame('USD', $money->getCurrency()->getCode());
        self::assertSame('12345', $money->getAmount());
    }

    public function testNativeTitleAlsoUsesCraftPersistence(): void
    {
        $project = TestProject::create(new PlainText([
            'name' => 'Unused Target',
            'handle' => 'unusedTarget',
        ]), AutofillPlugin::EDITION_LITE);

        AutofillPlugin::getInstance()->getEntrySuggestionApplyService()->applySuggestion(
            (int)$project['autofill']->id,
            (int)$project['entry']->id,
            $project['siteId'],
            [
                'targetFieldUid' => '__native__:title',
                'matchedHandle' => 'title',
                'value' => 'Saved native title',
            ],
        );

        self::assertSame('Saved native title', TestProject::reloadEntry($project['entry'])->title);
    }

    public function testDirectApplyKeepsCurrentAdvisoryValidationBehavior(): void
    {
        $project = TestProject::create(new PlainText([
            'name' => 'Advisory Value',
            'handle' => 'advisoryValue',
        ]), AutofillPlugin::EDITION_LITE);
        $project['entry']->setFieldValue('advisoryValue', 'Existing value');
        self::assertTrue(\Craft::$app->getElements()->saveElement($project['entry']));

        $result = AutofillPlugin::getInstance()->getAiService()->normalizeAutofillResponse(
            '[{"fieldName":"Advisory Value"}]',
            (int)$project['autofill']->id,
            (int)$project['entry']->id,
            $project['siteId'],
        );
        self::assertContains('Suggestion is missing a value.', $result->suggestions[0]['validationErrors']);

        AutofillPlugin::getInstance()->getEntrySuggestionApplyService()->applySuggestion(
            (int)$project['autofill']->id,
            (int)$project['entry']->id,
            $project['siteId'],
            $result->suggestions[0],
        );

        self::assertNull(TestProject::reloadEntry($project['entry'])->getFieldValue('advisoryValue'));
    }
}
