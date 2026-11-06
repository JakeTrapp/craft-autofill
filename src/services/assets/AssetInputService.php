<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\assets;

use Craft;
use craft\base\ElementInterface;
use craft\elements\Asset;
use craft\elements\User;
use craft\fields\Assets;
use jtdev\craftautofill\fields\AutofillField;
use RuntimeException;
use Throwable;

/** Collects configured asset metadata and file content for an Autofill request. */
class AssetInputService
{
    private const DEFAULT_MAX_FILES = 3;
    private const MAX_FILE_COUNT = 20;
    private const MAX_FILE_BYTES = 10 * 1024 * 1024;
    private const MAX_TOTAL_BYTES = 20 * 1024 * 1024;

    /**
     * @return array{files: array<int, array{assetId:int,filename:string,mimeType:?string,data:string}>, metadata: array<string, mixed>}
     */
    public function collect(AutofillField $definition, ElementInterface $element, bool $includeContents = true, ?User $user = null): array
    {
        $user ??= Craft::$app->getUser()->getIdentity();
        $files = [];
        $metadata = [];
        $seenAssetIds = [];
        $totalBytes = 0;

        foreach ($definition->contextRows as $row) {
            if (!($row['enabled'] ?? true)) { continue; }
            $uid = trim((string)($row['fieldUid'] ?? ''));
            $options = is_array($row['assets'] ?? null) ? $row['assets'] : [];
            if (!$includeContents) { $options['includeFile'] = false; }
            if ($uid === '' || $uid === '__asset__:file') {
                if ($uid === '__asset__:file' && $element instanceof Asset) {
                    $this->collectAssets($uid, [$element], $options, $files, $metadata, $seenAssetIds, $totalBytes, $user);
                }
                continue;
            }

            $sourceField = $this->resolveField($element, $uid);
            if (!$sourceField instanceof Assets) {
                continue;
            }

            $this->collectAssets(
                $uid,
                $this->assetsFromValue($element->getFieldValue($sourceField->handle)),
                $options,
                $files,
                $metadata,
                $seenAssetIds,
                $totalBytes,
                $user,
            );
        }

        foreach ($definition->rows as $row) {
            if (!($row['enabled'] ?? true)) { continue; }
            if (!(bool)($row['includeCurrentFieldValue'] ?? false)) {
                continue;
            }
            $uid = trim((string)($row['targetFieldUid'] ?? ''));
            $options = is_array($row['assets'] ?? null) ? $row['assets'] : [];
            if (!$includeContents) { $options['includeFile'] = false; }
            $sourceField = $uid !== '' ? $this->resolveField($element, $uid) : null;
            if ($element instanceof Asset && !$sourceField instanceof Assets && $options !== []) {
                $this->collectAssets(
                    $uid !== '' ? $uid : '__asset__:file',
                    [$element],
                    $options,
                    $files,
                    $metadata,
                    $seenAssetIds,
                    $totalBytes,
                    $user,
                );
                continue;
            }
            if (!$sourceField instanceof Assets) {
                continue;
            }

            $this->collectAssets(
                $uid,
                $this->assetsFromValue($element->getFieldValue($sourceField->handle)),
                $options,
                $files,
                $metadata,
                $seenAssetIds,
                $totalBytes,
                $user,
            );
        }

        return ['files' => $files, 'metadata' => $metadata];
    }

    /** @param array<string,mixed> $options */
    private function collectAssets(
        string $uid,
        array $assets,
        array $options,
        array &$files,
        array &$metadata,
        array &$seenAssetIds,
        int &$totalBytes,
        ?User $user = null,
    ): void {
        $selectedMetadata = $this->selectedMetadata($options);
        $includeFile = (bool)($options['includeFile'] ?? false);
        $maxFiles = max(1, min(self::MAX_FILE_COUNT, (int)($options['maxFiles'] ?? self::DEFAULT_MAX_FILES)));
        $descriptors = [];
        $sourcePosition = 0;

        foreach ($assets as $asset) {
            if (!$asset instanceof Asset) {
                continue;
            }
            if ($sourcePosition >= $maxFiles) { break; }
            $this->assertCanView($asset, $user);
            $descriptor = ['assetId' => (int)$asset->id];
            foreach ($selectedMetadata as $metadataKey) {
                $descriptor[$metadataKey] = $this->metadataValue($asset, $metadataKey, $user);
            }
            $descriptors[] = $descriptor;

            $withinConfiguredLimit = $sourcePosition < $maxFiles;
            $sourcePosition++;
            if (!$includeFile || !$withinConfiguredLimit || isset($seenAssetIds[(int)$asset->id])) {
                continue;
            }

            $copyPath = null;
            try {
                $copyPath = $asset->getCopyOfFile();
                $size = filesize($copyPath);
                if ($size === false) {
                    throw new RuntimeException(sprintf('Could not read file content for asset "%s".', $asset->getFilename()));
                }
                if ($size > self::MAX_FILE_BYTES) {
                    throw new RuntimeException(sprintf('Asset "%s" exceeds the 10 MiB per-file input limit.', $asset->getFilename()));
                }
                if ($totalBytes + $size > self::MAX_TOTAL_BYTES) {
                    throw new RuntimeException('Configured asset files exceed the 20 MiB combined input limit.');
                }

                $contents = file_get_contents($copyPath);
                if ($contents === false) {
                    throw new RuntimeException(sprintf('Could not read file content for asset "%s".', $asset->getFilename()));
                }

                $files[] = [
                    'assetId' => (int)$asset->id,
                    'filename' => $asset->getFilename(),
                    'mimeType' => $asset->getMimeType(),
                    'data' => base64_encode($contents),
                ];
                $totalBytes += $size;
                $seenAssetIds[(int)$asset->id] = true;
            } catch (Throwable $exception) {
                if ($exception instanceof RuntimeException) {
                    throw $exception;
                }
                throw new RuntimeException(sprintf('Could not read file content for asset "%s".', $asset->getFilename()), 0, $exception);
            } finally {
                if (is_string($copyPath) && $copyPath !== '' && is_file($copyPath)) {
                    @unlink($copyPath);
                }
            }
        }

        if ($descriptors !== []) {
            $metadata[$uid] = array_merge($metadata[$uid] ?? [], $descriptors);
        }
    }

    /** @return array<int, string> */
    private function selectedMetadata(array $options): array
    {
        $raw = $options['metadata'] ?? ['title', 'filename'];
        if (!is_array($raw)) {
            return ['title', 'filename'];
        }

        $selected = [];
        foreach ($raw as $value) {
            $handle = trim((string)$value);
            if ($handle !== '' && !in_array($handle, $selected, true)) {
                $selected[] = $handle;
            }
        }
        return $selected;
    }

    private function metadataValue(Asset $asset, string $key, ?User $user = null): mixed
    {
        $user ??= Craft::$app->getRequest()->getIsConsoleRequest() ? null : Craft::$app->getUser()->getIdentity();
        $field = $asset->getFieldLayout()?->getFieldByHandle($key);
        if ($field !== null && !in_array($key, ['title', 'filename', 'alt', 'altText', 'dateCreated', 'size'], true) && $user !== null) {
            $scope = new \jtdev\craftautofill\models\Workflow(['scope' => 'asset', 'volumeUid' => (string)$asset->getVolume()->uid]);
            if (!\jtdev\craftautofill\AutofillPlugin::getInstance()->getWorkflowAccess()->canUseField($scope, (string)($field->layoutElement->uid ?? $field->uid), $user, $asset)) {
                throw new RuntimeException('A required asset metadata field is unavailable to you.');
            }
        }
        $value = match ($key) {
            'title' => $asset->title,
            'filename' => $asset->getFilename(),
            'alt', 'altText' => $asset->alt,
            'dateCreated' => $asset->dateCreated?->format(DATE_ATOM),
            'size' => $asset->size,
            default => $asset->getFieldLayout()?->getFieldByHandle($key) !== null ? $asset->getFieldValue($key) : null,
        };
        return $this->toSafeValue($value);
    }

    private function toSafeValue(mixed $value, int $depth = 0): mixed
    {
        if ($depth > 4) { return null; }
        if ($value === null || is_scalar($value)) {
            return $value;
        }
        if (is_array($value)) {
            return array_map(fn(mixed $item): mixed => $this->toSafeValue($item, $depth + 1), $value);
        }
        if ($value instanceof Asset) {
            return ['assetId' => (int)$value->id, 'title' => $value->title, 'filename' => $value->getFilename()];
        }
        if ($value instanceof \JsonSerializable) {
            try {
                return $this->toSafeValue($value->jsonSerialize(), $depth + 1);
            } catch (Throwable) {
                return null;
            }
        }
        if (is_object($value)) {
            foreach (['getText', 'getValue', 'getRawContent'] as $method) {
                if (method_exists($value, $method)) {
                    try {
                        return $this->toSafeValue($value->{$method}(), $depth + 1);
                    } catch (Throwable) {
                        return null;
                    }
                }
            }
            if ($value instanceof \Stringable) {
                return (string)$value;
            }
        }
        return null;
    }

    private function resolveField(ElementInterface $element, string $uid): ?\craft\base\FieldInterface
    {
        foreach ($element->getFieldLayout()?->getCustomFields() ?? [] as $field) {
            $layoutUid = (string)($field->layoutElement->uid ?? $field->uid ?? '');
            if ($layoutUid === $uid) {
                return $field;
            }
        }
        return null;
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
            $assets = $value->all();
            return is_array($assets) ? array_values(array_filter($assets, static fn(mixed $item): bool => $item instanceof Asset)) : [];
        }
        return [];
    }

    private function assertCanView(Asset $asset, ?User $user = null): void
    {
        $request = Craft::$app->getRequest();
        if ($user !== null) {
            if (!Craft::$app->getElements()->canView($asset, $user)) {
                throw new RuntimeException(sprintf('You do not have permission to read asset "%s".', $asset->getFilename()));
            }
            return;
        }
        if ($request instanceof \craft\web\Request) {
            $currentUser = Craft::$app->getUser()->getIdentity();
            if ($currentUser === null || !Craft::$app->getElements()->canView($asset, $currentUser)) {
                throw new RuntimeException(sprintf('You do not have permission to read asset "%s".', $asset->getFilename()));
            }
        }
    }
}
