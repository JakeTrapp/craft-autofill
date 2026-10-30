<?php

declare(strict_types=1);

namespace Tests\integration;

use Codeception\Test\Unit;
use Craft;
use craft\elements\Asset;
use craft\fields\Assets;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\fields\AutofillField;
use jtdev\craftautofill\models\Workflow;
use jtdev\craftautofill\services\assets\AssetInputService;
use RuntimeException;
use Tests\Support\AssetTestProject;
use Tests\Support\TestProject;

final class AssetWorkflowTest extends Unit
{
    public function testAssetWorkflowSavesNativeAltAndCustomCaption(): void
    {
        $fixture = AssetTestProject::createVolumeWithAssets(['one.txt' => 'first content']);
        try {
            $asset = $fixture['assets'][0];
            $captionField = $fixture['volume']->getFieldLayout()->getCustomFields()[0];
            $captionUid = (string)($captionField->layoutElement->uid ?? $captionField->uid);
            $workflow = new Workflow([
                'handle' => 'asset-content-workflow',
                'name' => 'Asset content workflow',
                'scope' => 'asset',
                'volumeUid' => (string)$fixture['volume']->uid,
                'rows' => [
                    ['targetFieldUid' => '__native__:alt', 'prompt' => 'Write descriptive alt text.', 'overrideCurrentValue' => true],
                    ['targetFieldUid' => $captionUid, 'prompt' => 'Write a short caption.', 'overrideCurrentValue' => true],
                ],
            ]);
            $service = AutofillPlugin::getInstance()->getWorkflowService();
            self::assertTrue($service->saveWorkflow($workflow), implode(' ', $workflow->getFirstErrors()));
            $definition = $service->asField($workflow);
            $runtime = AutofillPlugin::getInstance()->getWorkflowRuntimeService();
            $runtime->assertScope($workflow, $asset);

            $runtime->apply($definition, $asset, ['targetFieldUid' => '__native__:alt', 'value' => 'A red bicycle leaning against a brick wall.']);
            $reloaded = Asset::find()->id($asset->id)->one();
            self::assertInstanceOf(Asset::class, $reloaded);
            self::assertSame('A red bicycle leaning against a brick wall.', $reloaded->alt);

            $runtime->apply($definition, $reloaded, ['targetFieldUid' => $captionUid, 'value' => 'A bicycle beside a brick wall.']);
            $reloaded = Asset::find()->id($asset->id)->one();
            self::assertInstanceOf(Asset::class, $reloaded);
            self::assertSame('A bicycle beside a brick wall.', $reloaded->getFieldValue($captionField->handle));
        } finally {
            AssetTestProject::cleanup($fixture);
        }
    }

    public function testAssetInputReadsOnlyFirstConfiguredFilesInFieldOrder(): void
    {
        $fixture = AssetTestProject::createVolumeWithAssets([
            'first.txt' => 'first payload',
            'second.txt' => 'second payload',
        ]);
        try {
            $assetsField = new Assets([
                'name' => 'Input files',
                'handle' => 'inputFiles',
                'sources' => ['volume:' . $fixture['volume']->uid],
                'maxRelations' => 5,
            ]);
            $project = TestProject::create($assetsField);
            $project['entry']->setFieldValue('inputFiles', array_map(static fn(Asset $asset): int => (int)$asset->id, $fixture['assets']));
            self::assertTrue(Craft::$app->getElements()->saveElement($project['entry']));
            $entry = TestProject::reloadEntry($project['entry']);

            AssetTestProject::loginAsAdmin();
            $definition = new AutofillField();
            $definition->rows = [[
                'targetFieldUid' => $project['targetUid'],
                'prompt' => 'Choose source files.',
                'includeCurrentFieldValue' => true,
                'assets' => ['metadata' => ['filename'], 'includeFile' => true, 'maxFiles' => 1],
            ]];
            $inputs = (new AssetInputService())->collect($definition, $entry);

            self::assertCount(1, $inputs['files']);
            self::assertSame('first.txt', $inputs['files'][0]['filename']);
            self::assertSame('first payload', base64_decode($inputs['files'][0]['data'], true));
            self::assertCount(1, $inputs['metadata'][$project['targetUid']]);
            self::assertSame('first.txt', $inputs['metadata'][$project['targetUid']][0]['filename']);
        } finally {
            AssetTestProject::cleanup($fixture);
        }
    }

    public function testAssetWorkflowRejectsAnAssetFromAnotherVolume(): void
    {
        $firstFixture = AssetTestProject::createVolumeWithAssets(['first.txt' => 'first']);
        $secondFixture = AssetTestProject::createVolumeWithAssets(['second.txt' => 'second']);
        try {
            $workflow = new Workflow([
                'handle' => 'volume-scoped-workflow',
                'name' => 'Volume scoped workflow',
                'scope' => 'asset',
                'volumeUid' => (string)$firstFixture['volume']->uid,
            ]);
            $service = AutofillPlugin::getInstance()->getWorkflowRuntimeService();
            $service->assertScope($workflow, $firstFixture['assets'][0]);
            try {
                $service->assertScope($workflow, $secondFixture['assets'][0]);
                self::fail('The workflow unexpectedly accepted an asset from another volume.');
            } catch (RuntimeException $exception) {
                self::assertStringContainsString('does not support', $exception->getMessage());
            }
        } finally {
            AssetTestProject::cleanup($firstFixture);
            AssetTestProject::cleanup($secondFixture);
        }
    }
}
