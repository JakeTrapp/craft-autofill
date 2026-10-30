<?php

declare(strict_types=1);

namespace Tests\integration;

use Codeception\Test\Unit;
use jtdev\craftautofill\AutofillPlugin;
use Tests\Support\TestProject;

final class OptionalFieldPersistenceTest extends Unit
{
    public function testCkeditorHtmlSurvivesARealCraftSave(): void
    {
        $project = TestProject::create(new \craft\ckeditor\Field([
            'name' => 'Article Body',
            'handle' => 'articleBody',
        ]), AutofillPlugin::EDITION_LITE);

        $result = AutofillPlugin::getInstance()->getAiService()->normalizeAutofillResponse(
            '[{"fieldName":"Article Body","value":"<p>Stored <strong>rich text</strong>.</p>"}]',
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

        $stored = TestProject::reloadEntry($project['entry'])->getFieldValue('articleBody');
        self::assertStringContainsString('<strong>rich text</strong>', (string)$stored);
    }

    public function testSeomaticPatchSurvivesARealCraftSave(): void
    {
        $project = TestProject::create(new \nystudio107\seomatic\fields\SeoSettings([
            'name' => 'SEO',
            'handle' => 'seo',
        ]), AutofillPlugin::EDITION_LITE);

        $result = AutofillPlugin::getInstance()->getAiService()->normalizeAutofillResponse(
            '[{"fieldName":"SEO","value":{"seoTitle":"Stored SEO title","seoDescription":"Stored SEO description"}}]',
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

        $entry = TestProject::reloadEntry($project['entry']);
        $adapter = AutofillPlugin::getInstance()->getFieldAdapterService()->getAdapterForField($project['target']);
        $stored = $adapter->getContextValue($project['target'], $entry->getFieldValue('seo'));
        self::assertStringContainsString('Stored SEO title', $stored);
        self::assertStringContainsString('Stored SEO description', $stored);
    }
}
