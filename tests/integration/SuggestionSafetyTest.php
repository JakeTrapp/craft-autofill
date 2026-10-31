<?php

declare(strict_types=1);
namespace Tests\integration;

use Codeception\Test\Unit;
use craft\fields\PlainText;
use jtdev\craftautofill\AutofillPlugin;
use Tests\Support\TestProject;

final class SuggestionSafetyTest extends Unit
{
    public function testInvalidValuesCannotEraseExistingContentThroughEitherApplyPath(): void
    {
        $project = TestProject::create(new PlainText(['name' => 'Summary', 'handle' => 'safeSummary']));
        $project['entry']->setFieldValue('safeSummary', 'Keep this content');
        self::assertTrue(\Craft::$app->getElements()->saveElement($project['entry']));
        $plugin = AutofillPlugin::getInstance();
        foreach ([[], ['value' => null], ['value' => ''], ['value' => '   '], ['value' => ['wrong' => 'type']]] as $payload) {
            foreach (['legacy', 'workflow'] as $path) {
                $entry = TestProject::reloadEntry($project['entry']);
                try {
                    $suggestion = ['targetFieldUid' => $project['targetUid']] + $payload;
                    if ($path === 'legacy') $plugin->getEntrySuggestionApplyService()->applySuggestion((int)$project['autofill']->id, (int)$entry->id, $project['siteId'], $suggestion);
                    else $plugin->getWorkflowRuntimeService()->apply($project['autofill'], $entry, $suggestion);
                    self::fail('Invalid value accepted on ' . $path);
                } catch (\RuntimeException $e) { self::assertNotSame('', $e->getMessage()); }
                self::assertSame('Keep this content', TestProject::reloadEntry($project['entry'])->getFieldValue('safeSummary'));
            }
        }
    }

    public function testEncodedEmptyJsonCannotEraseExistingStructure(): void
    {
        $project = TestProject::create(new \craft\fields\Json(['name' => 'Data', 'handle' => 'safeJson']));
        $project['entry']->setFieldValue('safeJson', ['keep' => true]);
        self::assertTrue(\Craft::$app->getElements()->saveElement($project['entry']));
        foreach ([[], '[]', '{}'] as $value) {
            try {
                AutofillPlugin::getInstance()->getWorkflowRuntimeService()->apply($project['autofill'], TestProject::reloadEntry($project['entry']), ['targetFieldUid' => $project['targetUid'], 'value' => $value]);
                self::fail('Empty JSON erased stored data.');
            } catch (\RuntimeException $exception) { self::assertStringContainsString('cannot erase', $exception->getMessage()); }
            $stored = TestProject::reloadEntry($project['entry'])->getFieldValue('safeJson');
            $stored = $stored instanceof \JsonSerializable ? $stored->jsonSerialize() : $stored;
            self::assertTrue($stored['keep']);
        }
    }

    public function testMixedResultsPreserveRawValuesAndValidSiblingSuggestions(): void
    {
        $project = TestProject::create(new PlainText(['name' => 'Summary', 'handle' => 'mixedSummary']));
        $plugin = AutofillPlugin::getInstance();
        $result = $plugin->getAiService()->responseNormalizer->normalizeForElement(json_encode([
            ['fieldName' => 'Summary', 'value' => ['bad' => 'shape']],
            ['fieldName' => 'Title', 'value' => 'Valid title'],
        ], JSON_THROW_ON_ERROR), $project['autofill'], $project['entry']);
        self::assertTrue($result->success);
        self::assertNotEmpty($result->suggestions[0]['validationErrors']);
        self::assertSame(['bad' => 'shape'], $result->suggestions[0]['rawValue']);
        // Title isn't configured: an unknown response name must never be assigned by order.
        self::assertNotEmpty($result->suggestions[1]['validationErrors']);
        self::assertSame('', $result->suggestions[1]['targetFieldUid']);
        $result = $plugin->getAiService()->responseNormalizer->normalizeForElement(json_encode([
            ['fieldName' => 'Summary', 'value' => ['bad' => 'shape']],
            ['fieldName' => 'Summary', 'value' => 'Valid corrected value'],
        ], JSON_THROW_ON_ERROR), $project['autofill'], $project['entry']);
        self::assertSame([], $result->suggestions[1]['validationErrors']);
        $plugin->getEntrySuggestionApplyService()->applySuggestion((int)$project['autofill']->id, (int)$project['entry']->id, $project['siteId'], $result->suggestions[1]);
        self::assertSame('Valid corrected value', TestProject::reloadEntry($project['entry'])->getFieldValue('mixedSummary'));
    }
}
