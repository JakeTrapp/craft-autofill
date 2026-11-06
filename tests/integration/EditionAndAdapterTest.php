<?php

declare(strict_types=1);

namespace Tests\integration;

use Codeception\Test\Unit;
use craft\fields\Assets;
use craft\fields\PlainText;
use craft\fields\Table;
use jtdev\craftautofill\AutofillPlugin;
use Tests\Support\TestProject;

final class EditionAndAdapterTest extends Unit
{
    public function testExpectedAdapterRegistryIsComplete(): void
    {
        $keys = array_keys(AutofillPlugin::getInstance()->getFieldAdapterService()->getAdapters());
        sort($keys);

        self::assertSame([
            'addresses', 'assets', 'buttonGroup', 'categories', 'checkboxes', 'ckeditor', 'color', 'country',
            'date', 'dropdown', 'email', 'entries', 'icon', 'json', 'lightswitch', 'link', 'money',
            'multiSelect', 'number', 'plainText', 'radioButtons', 'range', 'seomatic', 'table', 'tags', 'time',
        ], $keys);
    }

    public function testLiteIncludesLiteAdapterAndExcludesProAdapterFromDiscovery(): void
    {
        $project = TestProject::create(new PlainText([
            'name' => 'Lite Text',
            'handle' => 'liteText',
        ]), AutofillPlugin::EDITION_LITE);

        $supported = AutofillPlugin::getInstance()
            ->getFieldDiscoveryService()
            ->getSupportedEntryTypeFields($project['entry']->getType());
        $byHandle = array_column($supported, null, 'handle');

        self::assertArrayHasKey('liteText', $byHandle);
        self::assertTrue($byHandle['liteText']['availableInLiteVersion']);
    }

    public function testTableAdapterIsMarkedProOnly(): void
    {
        $adapter = AutofillPlugin::getInstance()
            ->getFieldAdapterService()
            ->getAdapterForField(new Table());

        self::assertNotNull($adapter);
        self::assertSame('table', $adapter->getKey());
        self::assertFalse($adapter->isAvailableInLiteVersion());
    }

    public function testAssetsAdapterIsAvailableInLite(): void
    {
        $adapter = AutofillPlugin::getInstance()->getFieldAdapterService()->getAdapterForField(new Assets());
        self::assertNotNull($adapter);
        self::assertTrue($adapter->isAvailableInLiteVersion());
    }

    public function testOptionalCkeditorAndSeomaticAdaptersAreRegistered(): void
    {
        self::assertTrue(class_exists('craft\\ckeditor\\Field'));
        self::assertTrue(class_exists('nystudio107\\seomatic\\fields\\SeoSettings'));

        $service = AutofillPlugin::getInstance()->getFieldAdapterService();
        self::assertSame('ckeditor', $service->getAdapterForField(new \craft\ckeditor\Field())->getKey());
        self::assertSame('seomatic', $service->getAdapterForField(new \nystudio107\seomatic\fields\SeoSettings())->getKey());
    }
}
