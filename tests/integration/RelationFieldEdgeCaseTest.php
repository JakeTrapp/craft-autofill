<?php

declare(strict_types=1);

namespace Tests\integration;

use Codeception\Test\Unit;
use Craft;
use craft\elements\Asset;
use craft\elements\Category;
use craft\elements\Entry;
use craft\elements\Tag;
use craft\fields\Assets;
use craft\fields\Categories;
use craft\fields\Entries;
use craft\fields\Link;
use craft\fields\Tags;
use craft\fieldlayoutelements\CustomField;
use craft\helpers\StringHelper;
use craft\models\CategoryGroup;
use craft\models\CategoryGroup_SiteSettings;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use craft\models\TagGroup;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\services\fields\adapters\AssetsFieldAdapter;
use jtdev\craftautofill\services\fields\adapters\CategoriesFieldAdapter;
use jtdev\craftautofill\services\fields\adapters\EntriesFieldAdapter;
use jtdev\craftautofill\services\fields\adapters\LinkFieldAdapter;
use jtdev\craftautofill\services\fields\adapters\TagsFieldAdapter;
use RuntimeException;
use Tests\Support\AssetTestProject;
use Tests\Support\TestProject;

final class RelationFieldEdgeCaseTest extends Unit
{
    public function testRelatedFieldJsonFormsNormalizeWithoutCoercingInvalidItems(): void
    {
        foreach ([
            [new Entries(), new EntriesFieldAdapter()],
            [new Categories(), new CategoriesFieldAdapter()],
            [new Tags(), new TagsFieldAdapter()],
        ] as [$field, $adapter]) {
            self::assertSame(['Alpha', 'Beta'], $adapter->normalizeSuggestion($field, ['selectedTitles' => ['Alpha', 'Beta']]));
            self::assertSame(['Alpha', 'Beta'], $adapter->normalizeSuggestion($field, '{"selectedTitles":["Alpha","Beta"]}'));
            self::assertSame(['Alpha', 'Beta'], $adapter->normalizeSuggestion($field, "Alpha, Beta"));
            self::assertFalse($adapter->validateSuggestion($field, ['selectedTitles' => ['Alpha', 0]]));
            self::assertFalse($adapter->validateSuggestion($field, ['selectedTitles' => ['Alpha', false]]));
            self::assertFalse($adapter->validateSuggestion($field, ['selectedTitles' => 'Alpha']));
            self::assertFalse($adapter->validateSuggestion($field, ['unexpected' => ['Alpha']]));
        }
    }

    public function testAssetIdsRejectZeroFalseMalformedAndDuplicateValues(): void
    {
        $field = new Assets(['maxRelations' => 2]);
        $adapter = new AssetsFieldAdapter();

        self::assertSame([12, 13], $adapter->normalizeSuggestion($field, '{"selectedAssetIds":["12",13]}'));
        self::assertNull($adapter->normalizeSuggestion($field, ['selectedAssetIds' => [0]]));
        self::assertNull($adapter->normalizeSuggestion($field, ['selectedAssetIds' => [false]]));
        self::assertNull($adapter->normalizeSuggestion($field, ['selectedAssetIds' => ['12x']]));
        self::assertNull($adapter->normalizeSuggestion($field, ['selectedAssetIds' => [12, 12.5]]));
    }

    public function testLinkRejectsWrongTypesAndDoesNotCoerceFalseOrZeroIntoDestinations(): void
    {
        $field = new Link();
        $adapter = new LinkFieldAdapter();

        self::assertFalse($adapter->validateSuggestion($field, ['type' => 'not-a-link-type', 'value' => 'https://example.test']));
        self::assertFalse($adapter->validateSuggestion($field, ['type' => 'url', 'value' => false]));
        self::assertFalse($adapter->validateSuggestion($field, ['type' => 'url', 'value' => 0]));
        self::assertFalse($adapter->validateSuggestion($field, ['type' => 'url', 'value' => ['url' => 'https://example.test']]));
    }

    public function testEntriesSaveAndReloadAndRejectUnavailableOrAmbiguousTitles(): void
    {
        $target = TestProject::create(new Entries(['sources' => ['*']]));
        $target['entry']->title = 'Unique relation target';
        self::save($target['entry']);
        $project = TestProject::create(new Entries([
            'sources' => ['section:' . $target['entry']->getSection()->uid],
            'maxRelations' => 2,
            'showUnpermittedSections' => true,
            'showUnpermittedEntries' => true,
        ]));
        $outsider = TestProject::create(new Entries(['sources' => ['*']]));
        $outsider['entry']->title = 'Out of source entry';
        self::save($outsider['entry']);
        self::entryInSection($target['entry'], 'Second relation target', 'second-relation-target');
        self::entryInSection($target['entry'], 'Third relation target', 'third-relation-target');

        $adapter = new EntriesFieldAdapter();
        $field = $project['target'];
        self::assertFalse($adapter->validateSuggestion($field, ['selectedTitles' => ['Deleted relation target']]));
        self::assertFalse($adapter->validateSuggestion($field, ['selectedTitles' => ['Unique relation target', 'Missing second target']]));
        self::assertFalse($adapter->validateSuggestion($field, ['selectedTitles' => ['Unique relation target', 'Second relation target', 'Third relation target']]));
        $ids = $adapter->applySuggestionToEntry($field, $project['entry'], ['selectedTitles' => ['Unique relation target']]);
        self::assertSame([(int)$target['entry']->id], $ids);
        self::save($project['entry']);
        $saved = TestProject::reloadEntry($project['entry']);
        self::assertSame([(int)$target['entry']->id], array_map(static fn(Entry $e): int => (int)$e->id, $saved->getFieldValue($field->handle)->all()));

        self::entryInSection($target['entry'], 'Unique relation target', 'unique-relation-target-duplicate');
        self::assertFalse($adapter->validateSuggestion($field, ['selectedTitles' => ['Unique relation target']]));
        self::assertFalse($adapter->validateSuggestion($field, ['selectedTitles' => ['Out of source entry']]));
    }

    public function testCategoriesSaveAndReloadAndRejectWrongSourceAndDeletedTitles(): void
    {
        $siteId = (int)Craft::$app->getSites()->getPrimarySite()->id;
        $allowed = self::category('Allowed category', $siteId);
        $other = self::category('Other category', $siteId);
        $field = new Categories(['source' => 'group:' . $allowed['group']->uid, 'maxRelations' => 2]);
        $project = TestProject::create($field);
        $adapter = new CategoriesFieldAdapter();
        self::assertFalse($adapter->validateSuggestion($project['target'], ['selectedTitles' => ['Other category']]));
        self::assertFalse($adapter->validateSuggestion($project['target'], ['selectedTitles' => ['Deleted category']]));
        $ids = $adapter->applySuggestionToEntry($project['target'], $project['entry'], ['selectedTitles' => ['Allowed category']]);
        self::assertSame([(int)$allowed['category']->id], $ids);
        self::save($project['entry']);
        $saved = TestProject::reloadEntry($project['entry']);
        self::assertSame([(int)$allowed['category']->id], array_map(static fn(Category $e): int => (int)$e->id, $saved->getFieldValue($project['target']->handle)->all()));
        self::assertNotSame((int)$other['category']->id, $ids[0]);
    }

    public function testTagsSaveAndReloadAndRejectWrongSourceAndDeletedTitles(): void
    {
        $allowed = self::tagGroupWithTag('Allowed tag');
        self::tagGroupWithTag('Other tag');
        $field = new Tags(['source' => 'taggroup:' . $allowed['group']->uid, 'maxRelations' => 2]);
        $project = TestProject::create($field);
        $adapter = new TagsFieldAdapter();
        self::assertFalse($adapter->validateSuggestion($project['target'], ['selectedTitles' => ['Other tag']]));
        self::assertFalse($adapter->validateSuggestion($project['target'], ['selectedTitles' => ['Deleted tag']]));
        $ids = $adapter->applySuggestionToEntry($project['target'], $project['entry'], ['selectedTitles' => ['Allowed tag']]);
        self::assertSame([(int)$allowed['tag']->id], $ids);
        self::save($project['entry']);
        $saved = TestProject::reloadEntry($project['entry']);
        self::assertSame([(int)$allowed['tag']->id], array_map(static fn(Tag $e): int => (int)$e->id, $saved->getFieldValue($project['target']->handle)->all()));

        $normalizer = AutofillPlugin::getInstance()->getAiService()->responseNormalizer;
        $normalize = static fn(array $titles, bool $fromModel) => $normalizer->normalizeForElement(
            json_encode(['suggestions' => [['fieldName' => $project['targetUid'], 'value' => ['selectedTitles' => $titles]]]], JSON_THROW_ON_ERROR),
            $project['autofill'],
            $saved,
            $fromModel,
        );
        $partial = $normalize(['Allowed tag', 'Other tag', 'Deleted tag'], true);
        self::assertSame(['Allowed tag'], $partial->suggestions[0]['value']);
        self::assertSame([], $partial->suggestions[0]['validationErrors']);
        self::assertSame(['Other tag', 'Deleted tag'], $partial->droppedRelatedTitles[0]['titles']);
        self::assertFalse($partial->droppedRelatedTitles[0]['suggestionSkipped']);
        $missing = $normalize(['Deleted tag'], true);
        self::assertSame([], $missing->suggestions);
        self::assertTrue($missing->droppedRelatedTitles[0]['suggestionSkipped']);
        self::assertStringContainsString('Deleted tag', $normalize(['Allowed tag', 'Deleted tag'], false)->suggestions[0]['validationErrors'][0]);
    }

    public function testAssetsSaveAndReloadAndRejectWrongVolumeOrDeletedIds(): void
    {
        $allowed = AssetTestProject::createVolumeWithAssets(['allowed.txt' => 'allowed']);
        $other = AssetTestProject::createVolumeWithAssets(['other.txt' => 'other']);
        try {
            $field = new Assets(['sources' => ['volume:' . $allowed['volume']->uid], 'maxRelations' => 2]);
            $project = TestProject::create($field);
            $adapter = new AssetsFieldAdapter();
            self::assertFalse($adapter->validateSuggestion($project['target'], ['selectedAssetIds' => [(int)$other['assets'][0]->id]]));
            self::assertFalse($adapter->validateSuggestion($project['target'], ['selectedAssetIds' => [999999999]]));
            $ids = $adapter->applySuggestionToEntry($project['target'], $project['entry'], ['selectedAssetIds' => [(int)$allowed['assets'][0]->id]]);
            self::assertSame([(int)$allowed['assets'][0]->id], $ids);
            self::save($project['entry']);
            $saved = TestProject::reloadEntry($project['entry']);
            self::assertSame($ids, array_map(static fn(Asset $e): int => (int)$e->id, $saved->getFieldValue($project['target']->handle)->all()));
        } finally {
            AssetTestProject::cleanup($allowed);
            AssetTestProject::cleanup($other);
        }
    }

    public function testLinkSaveAndReloadAndRejectsWrongSourceOrAmbiguousLabels(): void
    {
        $source = TestProject::create(new Entries(['sources' => ['*']]));
        $source['entry']->title = 'Eligible link entry';
        self::save($source['entry']);
        $section = $source['entry']->getSection();
        $siteSettings = array_values($section->getSiteSettings());
        $siteSettings[0]->hasUrls = true;
        $siteSettings[0]->uriFormat = '{slug}';
        $section->setSiteSettings($siteSettings);
        if (!Craft::$app->getEntries()->saveSection($section)) {
            throw new RuntimeException('Could not enable URLs for relation link fixture.');
        }
        self::save($source['entry']);
        $outsider = TestProject::create(new Entries(['sources' => ['*']]));
        $outsider['entry']->title = 'Out of source entry';
        self::save($outsider['entry']);

        $link = new Link(['types' => ['entry', 'url'], 'typeSettings' => ['entry' => ['sources' => ['section:' . $source['entry']->getSection()->uid]]]]);
        $project = TestProject::create($link);
        $adapter = new LinkFieldAdapter();
        $candidateKey = $project['target']->getLinkTypes()['entry']->normalizeValue($source['entry']);
        self::assertTrue($adapter->validateSuggestion($project['target'], ['type' => 'entry', 'candidateKey' => $candidateKey]));
        $outsiderKey = $project['target']->getLinkTypes()['entry']->normalizeValue($outsider['entry']);
        self::assertFalse($adapter->validateSuggestion($project['target'], ['type' => 'entry', 'candidateKey' => $outsiderKey]));
        $duplicate = new Entry([
            'sectionId' => $source['entry']->sectionId,
            'typeId' => $source['entry']->typeId,
            'siteId' => $source['entry']->siteId,
            'title' => 'Eligible link entry',
            'slug' => 'eligible-link-entry-duplicate',
            'enabled' => true,
        ]);
        self::save($duplicate);
        self::assertFalse($adapter->validateSuggestion($project['target'], ['type' => 'entry', 'value' => 'Eligible link entry']));
        self::assertFalse($adapter->validateSuggestion($project['target'], ['type' => 'url', 'value' => false]));
        $data = $adapter->applySuggestionToEntry($project['target'], $project['entry'], ['type' => 'url', 'value' => 'https://example.test/path']);
        self::assertSame('https://example.test/path', $data['value']);
        self::save($project['entry']);
        $saved = TestProject::reloadEntry($project['entry']);
        self::assertSame('https://example.test/path', $saved->getFieldValue($project['target']->handle)->getUrl());
        $adapter->applySuggestionToEntry($project['target'], $project['entry'], ['type' => 'entry', 'candidateKey' => $candidateKey]);
        self::save($project['entry']);
        $saved = TestProject::reloadEntry($project['entry']);
        self::assertSame((int)$source['entry']->id, (int)$saved->getFieldValue($project['target']->handle)->getElement()->id);
    }

    private static function category(string $title, int $siteId): array
    {
        $suffix = substr(str_replace('-', '', StringHelper::UUID()), 0, 8);
        $group = new CategoryGroup(['name' => 'Relation category ' . $suffix, 'handle' => 'relationCategory' . $suffix]);
        $group->setFieldLayout(new FieldLayout(['type' => Category::class]));
        $group->setSiteSettings([new CategoryGroup_SiteSettings(['siteId' => $siteId, 'hasUrls' => true, 'uriFormat' => '{slug}'])]);
        if (!Craft::$app->getCategories()->saveGroup($group)) {
            throw new RuntimeException('Could not save relation category group.');
        }
        $category = new Category(['groupId' => $group->id, 'siteId' => $siteId, 'title' => $title, 'slug' => strtolower(str_replace(' ', '-', $title))]);
        self::save($category);
        return ['group' => $group, 'category' => $category];
    }

    private static function tagGroupWithTag(string $title): array
    {
        $suffix = substr(str_replace('-', '', StringHelper::UUID()), 0, 8);
        $group = new TagGroup(['name' => 'Relation tag ' . $suffix, 'handle' => 'relationTag' . $suffix]);
        if (!Craft::$app->getTags()->saveTagGroup($group)) {
            throw new RuntimeException('Could not save relation tag group.');
        }
        $tag = new Tag(['groupId' => $group->id, 'siteId' => Craft::$app->getSites()->getPrimarySite()->id, 'title' => $title]);
        self::save($tag);
        return ['group' => $group, 'tag' => $tag];
    }

    private static function save(\craft\base\ElementInterface $element): void
    {
        if (!Craft::$app->getElements()->saveElement($element)) {
            throw new RuntimeException('Could not save relation test element: ' . implode(' ', $element->getErrorSummary(true)));
        }
    }

    private static function entryInSection(Entry $template, string $title, string $slug): Entry
    {
        $entry = new Entry([
            'sectionId' => $template->sectionId,
            'typeId' => $template->typeId,
            'siteId' => $template->siteId,
            'title' => $title,
            'slug' => $slug,
            'enabled' => true,
        ]);
        self::save($entry);
        return $entry;
    }
}
