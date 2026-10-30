<?php

declare(strict_types=1);

namespace Tests\Support;

use Craft;
use craft\elements\Asset;
use craft\fieldlayoutelements\CustomField;
use craft\fields\PlainText;
use craft\fs\Local;
use craft\helpers\FileHelper;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use craft\models\Volume;
use craft\elements\User;
use RuntimeException;

final class AssetTestProject
{
    /** @return array{volume:Volume,caption:PlainText,assets:Asset[],fs:Local} */
    public static function createVolumeWithAssets(array $files = ['one.txt' => 'one', 'two.txt' => 'two'], bool $public = false): array
    {
        $suffix = substr(str_replace('-', '', StringHelper::UUID()), 0, 8);
        $rootPath = ($public ? Craft::getAlias('@webroot') : Craft::getAlias('@root')) . '/asset-fixtures/autofill-test-volume-' . $suffix;
        $fs = new Local([
            'name' => 'Autofill Test Files ' . $suffix,
            'handle' => 'autofillTestFs' . $suffix,
            // Browser fixtures use a public URL so Craft's asset preview can load under the isolated PHP server.
            'path' => $rootPath,
            'hasUrls' => $public,
            'url' => $public ? '/asset-fixtures/autofill-test-volume-' . $suffix . '/' : null,
        ]);
        if (!Craft::$app->getFs()->saveFilesystem($fs)) {
            throw new RuntimeException('Could not create the temporary asset filesystem: ' . implode(' ', $fs->getErrorSummary(true)));
        }

        $caption = new PlainText([
            'name' => 'Asset Caption ' . $suffix,
            'handle' => 'assetCaption' . $suffix,
        ]);
        if (!Craft::$app->getFields()->saveField($caption)) {
            throw new RuntimeException('Could not create the asset caption field: ' . implode(' ', $caption->getErrorSummary(true)));
        }

        $layout = new FieldLayout(['type' => Asset::class]);
        $tab = new FieldLayoutTab(['name' => 'Content']);
        $layout->setTabs([$tab]);
        $tab->setElements([new CustomField($caption)]);
        $volume = new Volume([
            'name' => 'Autofill Test Volume ' . $suffix,
            'handle' => 'autofillTestVolume' . $suffix,
            'fsHandle' => $fs->handle,
        ]);
        $volume->setFieldLayout($layout);
        if (!Craft::$app->getVolumes()->saveVolume($volume)) {
            throw new RuntimeException('Could not create the test asset volume: ' . implode(' ', $volume->getErrorSummary(true)));
        }

        $folder = Craft::$app->getAssets()->getRootFolderByVolumeId((int)$volume->id);
        if ($folder === null) {
            throw new RuntimeException('Could not create the root folder for the test asset volume.');
        }

        $assets = [];
        foreach ($files as $filename => $contents) {
            $tempPath = Craft::$app->getPath()->getTempPath() . DIRECTORY_SEPARATOR . 'autofill-' . $suffix . '-' . basename((string)$filename);
            FileHelper::writeToFile($tempPath, (string)$contents);
            $asset = new Asset([
                'tempFilePath' => $tempPath,
                'filename' => (string)$filename,
                'volumeId' => $volume->id,
                'folderId' => $folder->id,
                'siteId' => Craft::$app->getSites()->getPrimarySite()->id,
                'alt' => 'Existing alt',
            ]);
            $asset->setFieldValue((string)$caption->handle, 'Existing caption');
            if (!Craft::$app->getElements()->saveElement($asset)) {
                throw new RuntimeException('Could not save the test asset: ' . implode(' ', $asset->getErrorSummary(true)));
            }
            $assets[] = $asset;
        }

        return ['volume' => $volume, 'caption' => $caption, 'assets' => $assets, 'fs' => $fs];
    }

    public static function cleanup(array $fixture): void
    {
        $fs = $fixture['fs'] ?? null;
        if ($fs instanceof Local) {
            FileHelper::removeDirectory($fs->getRootPath());
        }
    }

    public static function loginAsAdmin(): void
    {
        $username = 'autofill-asset-test-' . substr(str_replace('-', '', StringHelper::UUID()), 0, 8);
        $user = new User([
            'username' => $username,
            'email' => $username . '@example.test',
            'admin' => true,
            'enabled' => true,
        ]);
        $user->newPassword = 'autofill-asset-test-password';
        if (!Craft::$app->getElements()->saveElement($user, false, false, false)) {
            throw new RuntimeException('Could not create the asset test administrator: ' . implode(' ', $user->getErrorSummary(true)));
        }
        Craft::$app->getUser()->setIdentity($user);
    }
}
