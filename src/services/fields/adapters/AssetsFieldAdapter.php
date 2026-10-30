<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\fields\adapters;

use Craft;
use craft\base\ElementInterface;
use craft\base\FieldInterface;
use craft\elements\Asset;
use craft\fields\Assets;
use RuntimeException;
use Throwable;

/** Handles read-only context and selecting existing assets for an Assets field output. */
class AssetsFieldAdapter implements FieldAdapterInterface
{
    private const MAX_CANDIDATES = 250;

    public function getKey(): string
    {
        return 'assets';
    }

    public function isAvailableInLiteVersion(): bool
    {
        return false;
    }

    public function supports(FieldInterface $field): bool
    {
        return $field instanceof Assets;
    }

    public function getPromptConfigSchema(FieldInterface $field): array
    {
        return [
            'fields' => [
                ['key' => 'prompt', 'type' => 'multiline', 'label' => 'Prompt', 'required' => true],
            ],
        ];
    }

    public function normalizePromptConfig(array $config, FieldInterface $field): array
    {
        return [
            'prompt' => trim((string)($config['prompt'] ?? '')),
            'assets' => is_array($config['assets'] ?? null) ? $config['assets'] : [],
        ];
    }

    public function validatePromptConfig(array $config, FieldInterface $field): array
    {
        return $this->normalizePromptConfig($config, $field)['prompt'] === ''
            ? ['Prompt is required for Assets fields.']
            : [];
    }

    public function buildPromptContract(FieldInterface $field, array $promptConfig = []): array
    {
        if (!$field instanceof Assets) {
            return [];
        }

        $candidates = [];
        foreach ($this->candidateAssets($field) as $asset) {
            $candidates[] = [
                'assetId' => (int)$asset->id,
                'title' => (string)$asset->title,
                'filename' => $asset->getFilename(),
                'mimeType' => $asset->getMimeType(),
            ];
        }

        $maxSelections = $field->maxRelations !== null ? max(0, (int)$field->maxRelations) : null;
        $rules = [
            'Return JSON only.',
            'Return an object with a selectedAssetIds array.',
            'Each ID must exactly match an assetId in candidates. Do not invent assets or IDs.',
        ];
        if ($maxSelections !== null) {
            $rules[] = sprintf('Select at most %d asset(s).', $maxSelections);
        }

        return [
            'type' => 'object',
            'rules' => $rules,
            'properties' => [
                'selectedAssetIds' => [
                    'type' => 'array',
                    'items' => ['type' => 'integer'],
                ],
            ],
            'candidates' => $candidates,
            'maxSelections' => $maxSelections,
        ];
    }

    public function getContextValue(FieldInterface $field, mixed $value, array $options = []): string
    {
        $assets = $this->assetsFromValue($value);
        $metadata = is_array($options['assets']['metadata'] ?? null) ? $options['assets']['metadata'] : [];
        $parts = [];
        foreach ($assets as $asset) {
            $descriptor = [];
            $selected = $metadata !== [] ? $metadata : ['title', 'filename'];
            foreach ($selected as $key) {
                $key = trim((string)$key);
                if ($key === '') {
                    continue;
                }
                $descriptor[$key] = match ($key) {
                    'title' => $asset->title,
                    'filename' => $asset->getFilename(),
                    'alt' => $asset->alt,
                    'size' => $asset->size,
                    default => $this->safeFieldValue($asset, $key),
                };
            }
            if ($descriptor !== []) {
                $parts[] = json_encode(['assetId' => (int)$asset->id] + $descriptor, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?: '';
            }
        }
        return implode("\n", array_filter($parts, static fn(string $part): bool => $part !== ''));
    }

    public function validateSuggestion(FieldInterface $field, mixed $value): bool
    {
        if (!$field instanceof Assets) {
            return false;
        }
        $ids = $this->normalizeSuggestion($field, $value);
        if (!is_array($ids)) {
            return false;
        }
        return $field->maxRelations === null || count($ids) <= (int)$field->maxRelations;
    }

    public function normalizeSuggestion(FieldInterface $field, mixed $value): mixed
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (is_array($decoded)) {
                $value = $decoded;
            }
        }
        if (is_array($value) && array_key_exists('selectedAssetIds', $value)) {
            $value = $value['selectedAssetIds'];
        }
        if (!is_array($value)) {
            return null;
        }

        $ids = [];
        foreach ($value as $id) {
            if (filter_var($id, FILTER_VALIDATE_INT) === false || (int)$id <= 0) {
                return null;
            }
            $id = (int)$id;
            if (!in_array($id, $ids, true)) {
                $ids[] = $id;
            }
        }
        return $ids;
    }

    public function applySuggestionToEntry(FieldInterface $field, ElementInterface $element, mixed $value): mixed
    {
        if (!$field instanceof Assets) {
            throw new RuntimeException('Could not apply the asset selection to a non-Assets field.');
        }
        $handle = trim((string)$field->handle);
        if ($handle === '') {
            throw new RuntimeException('Could not resolve the Assets field handle.');
        }

        $ids = $this->normalizeSuggestion($field, $value);
        if (!is_array($ids)) {
            throw new RuntimeException('Asset suggestions must contain a selectedAssetIds array of positive IDs.');
        }
        if ($field->maxRelations !== null && count($ids) > (int)$field->maxRelations) {
            throw new RuntimeException(sprintf('Select no more than %d assets for this field.', (int)$field->maxRelations));
        }

        $eligibleById = [];
        foreach ($this->candidateAssets($field, $element) as $asset) {
            $eligibleById[(int)$asset->id] = $asset;
        }
        foreach ($ids as $id) {
            if (!isset($eligibleById[$id])) {
                throw new RuntimeException(sprintf('Asset %d is outside the configured sources or unavailable to this user.', $id));
            }
        }

        $element->setFieldValue($handle, $ids);
        return $ids;
    }

    /** @return Asset[] */
    private function candidateAssets(Assets $field, ?ElementInterface $element = null): array
    {
        try {
            $sources = $field->getInputSources($element);
        } catch (Throwable) {
            $sources = $field->sources;
        }
        if ($sources === '*' || $sources === null) {
            $sources = array_map(static fn($volume): string => 'volume:' . $volume->uid, Craft::$app->getVolumes()->getAllVolumes());
        }
        if (!is_array($sources) || $sources === []) {
            return [];
        }
        $assetsById = [];
        foreach ($sources as $sourceKey) {
            $source = \craft\helpers\ElementHelper::findSource(Asset::class, (string)$sourceKey, 'field');
            if ($source === null) { continue; }
            $query = Asset::find()->limit(self::MAX_CANDIDATES);
            Craft::configure($query, $source['criteria'] ?? []);
            Craft::configure($query, $field->getInputSelectionCriteria());
            foreach ($query->all() as $asset) { $assetsById[(int)$asset->id] = $asset; }
        }
        $user = Craft::$app->getRequest()->getIsConsoleRequest() ? null : Craft::$app->getUser()->getIdentity();
        return array_values(array_filter($assetsById, static function(mixed $asset) use ($user): bool {
            return $asset instanceof Asset && ($user === null || Craft::$app->getElements()->canView($asset, $user));
        }));
    }

    /** @return Asset[] */
    private function assetsFromValue(mixed $value): array
    {
        if (is_array($value)) {
            return array_values(array_filter($value, static fn(mixed $item): bool => $item instanceof Asset));
        }
        if ($value instanceof Asset) {
            return [$value];
        }
        if (is_object($value) && method_exists($value, 'all')) {
            $items = $value->all();
            return is_array($items) ? array_values(array_filter($items, static fn(mixed $item): bool => $item instanceof Asset)) : [];
        }
        return [];
    }

    private function safeFieldValue(Asset $asset, string $handle): mixed
    {
        $value = $asset->getFieldValue($handle);
        if (is_scalar($value) || $value === null) {
            return $value;
        }
        if (is_array($value)) {
            return array_values(array_filter($value, static fn(mixed $item): bool => is_scalar($item) || $item === null));
        }
        return null;
    }
}
