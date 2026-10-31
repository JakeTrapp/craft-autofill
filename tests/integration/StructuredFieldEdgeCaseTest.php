<?php

declare(strict_types=1);

namespace Tests\integration;

use Codeception\Test\Unit;
use craft\fields\Addresses;
use craft\fields\Json;
use craft\fields\Table;
use jtdev\craftautofill\AutofillPlugin;
use Tests\Support\TestProject;

final class StructuredFieldEdgeCaseTest extends Unit
{
    private function table(): Table
    {
        return new Table(['name' => 'Facts', 'handle' => 'facts', 'minRows' => 1, 'maxRows' => 2, 'columns' => [
            'col1' => ['heading' => 'Label', 'handle' => 'label', 'type' => 'singleline'],
            'col2' => ['heading' => 'Amount', 'handle' => 'amount', 'type' => 'number'],
            'col3' => ['heading' => 'Active', 'handle' => 'active', 'type' => 'lightswitch'],
        ]]);
    }

    public function testJsonAcceptsObjectsArraysAndEncodedJsonWithoutChangingNestedTypes(): void
    {
        $field = new Json();
        $adapter = AutofillPlugin::getInstance()->getFieldAdapterService()->getAdapterForField($field);
        foreach ([['zero' => 0, 'false' => false, 'nested' => ['text' => '雪']], '[{"x":1}]', '{}', '[]'] as $value) {
            self::assertTrue($adapter->validateSuggestion($field, $value));
            self::assertIsArray(json_decode($adapter->normalizeSuggestion($field, $value), true, 512, JSON_THROW_ON_ERROR));
        }
        foreach (['{bad', 'null', 'false', '123', null, 12, false] as $value) {
            self::assertFalse($adapter->validateSuggestion($field, $value));
        }
    }

    public function testTableRejectsLossyRowsCellsUnknownColumnsAndRowLimits(): void
    {
        $field = $this->table();
        $adapter = AutofillPlugin::getInstance()->getFieldAdapterService()->getAdapterForField($field);
        $valid = ['rows' => [['label' => 'Zero', 'amount' => '0', 'active' => false]]];
        self::assertTrue($adapter->validateSuggestion($field, $valid));
        $rows = $adapter->normalizeSuggestion($field, $valid);
        self::assertSame(0, $rows[0]['col2']);
        self::assertFalse($rows[0]['col3']);
        foreach ([
            ['rows' => [['label' => 'Good'], 'not a row']],
            ['rows' => [['label' => 'Bad', 'amount' => '12 widgets']]],
            ['rows' => [['label' => 'Bad', 'amount' => ['x' => 1]]]],
            ['rows' => [['label' => 'Bad', 'active' => 'maybe']]],
            ['rows' => [['label' => 'Bad', 'unknown' => 'discarded']]],
            ['rows' => []],
            ['rows' => [['label' => '1'], ['label' => '2'], ['label' => '3']]],
            '{not JSON',
        ] as $value) self::assertFalse($adapter->validateSuggestion($field, $value), json_encode($value));
    }

    public function testTableDatesEmailsAndSelectionsRejectInvalidCells(): void
    {
        $field = new Table(['columns' => [
            'col1' => ['heading' => 'Date', 'handle' => 'date', 'type' => 'date'],
            'col2' => ['heading' => 'Email', 'handle' => 'email', 'type' => 'email'],
            'col3' => ['heading' => 'Time', 'handle' => 'time', 'type' => 'time'],
        ]]);
        $adapter = AutofillPlugin::getInstance()->getFieldAdapterService()->getAdapterForField($field);
        self::assertTrue($adapter->validateSuggestion($field, [['date' => '2024-02-29', 'email' => 'editor@example.com', 'time' => '23:59']]));
        foreach ([['date' => '2025-02-29'], ['date' => '03/04/25'], ['email' => 'not-email'], ['time' => '25:00']] as $row) {
            self::assertFalse($adapter->validateSuggestion($field, [$row]));
        }
    }

    public function testCkeditorAcceptsTextAndScalarConversionsButRejectsStructuredValues(): void
    {
        $field = new \craft\ckeditor\Field();
        $adapter = AutofillPlugin::getInstance()->getFieldAdapterService()->getAdapterForField($field);
        foreach (['<p>Text &amp; <strong>markup</strong></p>', '雪', 0, false] as $value) self::assertTrue($adapter->validateSuggestion($field, $value));
        self::assertSame('false', $adapter->normalizeSuggestion($field, false));
        foreach ([null, ['html' => '<p>Wrong shape</p>'], (object)['text' => 'x']] as $value) self::assertFalse($adapter->validateSuggestion($field, $value));
    }

    public function testSeomaticRejectsUnsupportedKeysAndMalformedKnownValues(): void
    {
        $field = new \nystudio107\seomatic\fields\SeoSettings();
        $adapter = AutofillPlugin::getInstance()->getFieldAdapterService()->getAdapterForField($field);
        self::assertTrue($adapter->validateSuggestion($field, ['seoTitle' => 'Title', 'siteNamePosition' => 'after']));
        foreach ([['seoTitle' => ['invalid']], ['siteNamePosition' => 'somewhere'], ['seoTitle' => 'Good', 'unknown' => 'bad'], [], 'not-json'] as $value) self::assertFalse($adapter->validateSuggestion($field, $value));
    }

    public function testAddressesRejectMalformedRowsCountriesAndLimits(): void
    {
        $field = new Addresses(['maxAddresses' => 1]);
        $adapter = AutofillPlugin::getInstance()->getFieldAdapterService()->getAdapterForField($field);
        $valid = ['countryCode' => 'US', 'addressLine1' => '10 Main St', 'locality' => 'Boston'];
        self::assertTrue($adapter->validateSuggestion($field, $valid));
        foreach ([['countryCode' => 'ZZ'], ['countryCode' => 'US', 'addressLine1' => ['bad']], ['addresses' => [$valid, 'bad']], ['addresses' => [$valid, $valid]], ['countryCode' => 'US', 'unknown' => 'bad'], 'not-json'] as $value) self::assertFalse($adapter->validateSuggestion($field, $value));
    }

    public function testAddressSurvivesCraftSaveAndReload(): void
    {
        $project = TestProject::create(new Addresses(['name' => 'Addresses', 'handle' => 'edgeAddresses', 'maxAddresses' => 1]));
        $adapter = AutofillPlugin::getInstance()->getFieldAdapterService()->getAdapterForField($project['target']);
        $adapter->applySuggestionToEntry($project['target'], $project['entry'], ['countryCode' => 'US', 'addressLine1' => '10 Main St', 'locality' => 'Boston', 'administrativeArea' => 'MA', 'postalCode' => '02108']);
        self::assertTrue(\Craft::$app->getElements()->saveElement($project['entry'], false));
        $address = TestProject::reloadEntry($project['entry'])->getFieldValue('edgeAddresses')->one();
        self::assertNotNull($address);
        self::assertSame('US', $address->countryCode);
        self::assertSame('10 Main St', $address->addressLine1);
    }
}
