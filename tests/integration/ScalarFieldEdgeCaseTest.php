<?php

declare(strict_types=1);

namespace Tests\integration;

use Codeception\Test\Unit;
use Craft;
use craft\fields\Color;
use craft\fields\Country;
use craft\fields\Date;
use craft\fields\Email;
use craft\fields\Lightswitch;
use craft\fields\Money;
use craft\fields\Number;
use craft\fields\PlainText;
use craft\fields\Range;
use craft\fields\Time;
use jtdev\craftautofill\services\fields\adapters\ColorFieldAdapter;
use jtdev\craftautofill\services\fields\adapters\CountryFieldAdapter;
use jtdev\craftautofill\services\fields\adapters\DateFieldAdapter;
use jtdev\craftautofill\services\fields\adapters\EmailFieldAdapter;
use jtdev\craftautofill\services\fields\adapters\LightswitchFieldAdapter;
use jtdev\craftautofill\services\fields\adapters\MoneyFieldAdapter;
use jtdev\craftautofill\services\fields\adapters\NumberFieldAdapter;
use jtdev\craftautofill\services\fields\adapters\PlainTextFieldAdapter;
use jtdev\craftautofill\services\fields\adapters\RangeFieldAdapter;
use jtdev\craftautofill\services\fields\adapters\TimeFieldAdapter;
use Tests\Support\TestProject;

final class ScalarFieldEdgeCaseTest extends Unit
{
    public function testPlainTextAcceptsScalarValuesWithoutLosingFalseOrZero(): void
    {
        $adapter = new PlainTextFieldAdapter();
        $field = new PlainText();
        $cases = [
            'trim text' => ['  hello  ', true, 'hello'],
            'zero remains text' => [0, true, '0'],
            'false remains text' => [false, true, 'false'],
            'true remains text' => [true, true, 'true'],
            'float remains text' => [12.5, true, '12.5'],
            'array rejected' => [[], false, ''],
            'null rejected' => [null, false, ''],
            'object rejected' => [new \stdClass(), false, ''],
        ];

        foreach ($cases as $label => [$value, $valid, $normalized]) {
            self::assertSame($valid, $adapter->validateSuggestion($field, $value), $label);
            self::assertSame($normalized, $adapter->normalizeSuggestion($field, $value), $label);
        }
    }

    public function testPlainTextHonorsCharacterAndByteLimits(): void
    {
        $adapter = new PlainTextFieldAdapter();
        $charLimited = new PlainText(['charLimit' => 2]);
        self::assertTrue($adapter->validateSuggestion($charLimited, 'é🙂'));
        self::assertFalse($adapter->validateSuggestion($charLimited, 'é🙂x'));

        $byteLimited = new PlainText(['byteLimit' => 6]);
        self::assertTrue($adapter->validateSuggestion($byteLimited, 'é🙂'));
        self::assertFalse($adapter->validateSuggestion($byteLimited, 'é🙂x'));

        $trimmed = new PlainText(['charLimit' => 3]);
        self::assertTrue($adapter->validateSuggestion($trimmed, ' abc '));
        self::assertFalse($adapter->validateSuggestion($trimmed, ' abcd '));
    }

    public function testLightswitchNeverGuessesFromUnknownValues(): void
    {
        $adapter = new LightswitchFieldAdapter();
        $field = new Lightswitch();
        $cases = [
            'boolean false' => [false, true, false],
            'boolean true' => [true, true, true],
            'numeric zero' => [0, true, false],
            'numeric one' => [1, true, true],
            'decimal zero' => [0.0, true, false],
            'explicit yes' => [' YES ', true, true],
            'explicit no' => ['no', true, false],
            'explicit off' => ['off', true, false],
            'ambiguous text' => ['enabled maybe', false, null],
            'other number' => [2, false, null],
            'empty' => ['', false, null],
        ];

        foreach ($cases as $label => [$value, $valid, $normalized]) {
            self::assertSame($valid, $adapter->validateSuggestion($field, $value), $label);
            self::assertSame($normalized, $adapter->normalizeSuggestion($field, $value), $label);
        }
    }

    public function testNumberPreservesZeroAndRejectsNonNumericValues(): void
    {
        $adapter = new NumberFieldAdapter();
        $field = new Number(['min' => -100, 'decimals' => 2]);
        $cases = [
            'zero' => [0, true, 0.0],
            'decimal string with surrounding whitespace' => [' -12.50 ', true, -12.5],
            'numeric string' => ['12.5', true, 12.5],
            'units rejected' => ['12 kg', false, null],
            'array rejected' => [[], false, null],
        ];

        foreach ($cases as $label => [$value, $valid, $normalized]) {
            self::assertSame($valid, $adapter->validateSuggestion($field, $value), $label);
            self::assertSame($normalized, $adapter->normalizeSuggestion($field, $value), $label);
        }
    }

    public function testNumberHonorsConfiguredBoundsStepAndDecimalPrecision(): void
    {
        $adapter = new NumberFieldAdapter();
        $field = new Number(['min' => 0, 'max' => 10, 'step' => 0.25, 'decimals' => 2]);
        foreach ([0, '0.25', '10'] as $value) self::assertTrue($adapter->validateSuggestion($field, $value));
        foreach ([-0.25, 10.25, 0.3, 1.234] as $value) self::assertFalse($adapter->validateSuggestion($field, $value));
    }

    public function testRangeHonorsBoundsAndStepAtBothEdges(): void
    {
        $field = new Range(['min' => 0, 'max' => 10, 'step' => 2]);
        $adapter = new RangeFieldAdapter();
        foreach ([0, '2', 10] as $value) self::assertTrue($adapter->validateSuggestion($field, $value));
        foreach ([-2, 11, 3, 'three'] as $value) self::assertFalse($adapter->validateSuggestion($field, $value));
    }

    public function testMoneyAcceptsMajorUnitAmountsAndRejectsCurrencyGuessing(): void
    {
        $field = new Money(['currency' => 'USD', 'min' => 0, 'max' => 10000]);
        $adapter = new MoneyFieldAdapter();
        self::assertTrue($adapter->validateSuggestion($field, '12.34'));
        self::assertTrue($adapter->validateSuggestion($field, 0));
        self::assertFalse($adapter->validateSuggestion($field, '12.349'));
        self::assertSame('', $adapter->normalizeSuggestion($field, '12.349'));
        self::assertTrue($adapter->validateSuggestion($field, '12.340'));
        self::assertSame('12.34', $adapter->normalizeSuggestion($field, '12.340'));
        self::assertFalse($adapter->validateSuggestion($field, '$12.34'));
        self::assertFalse($adapter->validateSuggestion($field, ['unexpected' => '12.34']));
    }

    public function testDateRequiresCompleteFieldSpecificIsoValues(): void
    {
        $adapter = new DateFieldAdapter();
        $dateField = new Date(['showTime' => false]);
        self::assertTrue($adapter->validateSuggestion($dateField, '2026-02-28'));
        self::assertFalse($adapter->validateSuggestion($dateField, '2026-02-30'));
        self::assertFalse($adapter->validateSuggestion($dateField, 'tomorrow'));
        self::assertSame('2026-02-28', $adapter->normalizeSuggestion($dateField, '2026-02-28'));

        $dateTimeField = new Date(['showTime' => true]);
        self::assertTrue($adapter->validateSuggestion($dateTimeField, '2026-05-10T14:30:00-05:00'));
        self::assertFalse($adapter->validateSuggestion($dateTimeField, '2026-05-10'));
        self::assertFalse($adapter->validateSuggestion($dateTimeField, '2026-05-10T14:30:00'));
    }

    public function testIsoUtcZIsAnUnambiguousDateTimeOffset(): void
    {
        $field = new Date(['showTime' => true]);
        $adapter = new DateFieldAdapter();
        self::assertTrue($adapter->validateSuggestion($field, '2026-10-31T10:20:30Z'));
        self::assertSame('2026-10-31T10:20:30+00:00', $adapter->normalizeSuggestion($field, '2026-10-31T10:20:30Z'));
    }

    public function testTimeHonorsValidClockBoundsAndMinuteIncrement(): void
    {
        $field = new Time(['min' => '09:00', 'max' => '17:00', 'minuteIncrement' => 15]);
        $adapter = new TimeFieldAdapter();
        self::assertTrue($adapter->validateSuggestion($field, '09:00'));
        self::assertTrue($adapter->validateSuggestion($field, '17:00'));
        self::assertFalse($adapter->validateSuggestion($field, '08:45'));
        self::assertFalse($adapter->validateSuggestion($field, '17:15'));
        self::assertFalse($adapter->validateSuggestion($field, '09:07'));
        self::assertFalse($adapter->validateSuggestion($field, 'tomorrow'));
    }

    public function testColorRequiresPaletteMembershipUnlessCustomColorsAreEnabled(): void
    {
        $field = new Color(['allowCustomColors' => false, 'palette' => [['color' => '#123456', 'label' => 'Navy']]]);
        $adapter = new ColorFieldAdapter();
        self::assertTrue($adapter->validateSuggestion($field, '#123456'));
        self::assertFalse($adapter->validateSuggestion($field, '#abcdef'));
        self::assertFalse($adapter->validateSuggestion($field, 'blue'));

        $custom = new Color(['allowCustomColors' => true]);
        self::assertTrue($adapter->validateSuggestion($custom, '#abcdef'));
        self::assertFalse($adapter->validateSuggestion($custom, 'not-a-color'));
    }

    public function testEmailAcceptsBareAndExactMailtoValuesOnly(): void
    {
        $adapter = new EmailFieldAdapter();
        $field = new Email();
        self::assertTrue($adapter->validateSuggestion($field, 'person@example.com'));
        self::assertSame('person@example.com', $adapter->normalizeSuggestion($field, '[person](mailto:person@example.com)'));
        self::assertFalse($adapter->validateSuggestion($field, 'Contact person@example.com today'));
        self::assertFalse($adapter->validateSuggestion($field, 'mailto:person@example.com blah'));
        self::assertFalse($adapter->validateSuggestion($field, 'not-an-email'));
    }

    public function testCountryAcceptsKnownCodesAndNamesButRejectsMalformedPayloads(): void
    {
        $adapter = new CountryFieldAdapter();
        $field = new Country();
        // Country validity and localized names come from Craft's address
        // repository, available in the integration environment.
        self::assertSame('US', $adapter->normalizeSuggestion($field, 'us'));
        self::assertTrue($adapter->validateSuggestion($field, 'United States'));
        self::assertSame('US', $adapter->normalizeSuggestion($field, 'United States'));
        self::assertFalse($adapter->validateSuggestion($field, []));
    }

    public function testAcceptedSuggestionsSurviveCraftSaveAndReloadForEveryScalarAdapter(): void
    {
        $cases = [
            [new PlainText(['name' => 'Text']), new PlainTextFieldAdapter(), 'A concise sentence.', 'A concise sentence.'],
            [new PlainText(['name' => 'Text zero']), new PlainTextFieldAdapter(), 0, '0'],
            [new PlainText(['name' => 'Text false']), new PlainTextFieldAdapter(), false, 'false'],
            [new Lightswitch(['name' => 'Switch']), new LightswitchFieldAdapter(), false, 'false'],
            [new Number(['name' => 'Number', 'min' => -10, 'max' => 10, 'decimals' => 2]), new NumberFieldAdapter(), 0, '0'],
            [new Range(['name' => 'Range', 'min' => 0, 'max' => 10, 'step' => 2]), new RangeFieldAdapter(), 10, '10'],
            [new Money(['name' => 'Money', 'currency' => 'USD', 'min' => 0, 'max' => 10000]), new MoneyFieldAdapter(), '12.34', '12.34'],
            [new Date(['name' => 'Date', 'showTime' => false]), new DateFieldAdapter(), '2026-02-28', '2026-02-28'],
            [new Time(['name' => 'Time', 'min' => '09:00', 'max' => '17:00', 'minuteIncrement' => 15]), new TimeFieldAdapter(), '09:15', '09:15:00'],
            [new Color(['name' => 'Color', 'allowCustomColors' => true]), new ColorFieldAdapter(), '#123456', '#123456'],
            [new Email(['name' => 'Email']), new EmailFieldAdapter(), 'person@example.com', 'person@example.com'],
            [new Country(['name' => 'Country']), new CountryFieldAdapter(), 'US', 'US'],
        ];

        foreach ($cases as [$field, $adapter, $suggestion, $expected]) {
            $project = TestProject::create($field);
            self::assertTrue($adapter->validateSuggestion($project['target'], $suggestion), $field->name . ' suggestion should validate');
            $adapter->applySuggestionToEntry($project['target'], $project['entry'], $suggestion);
            self::assertTrue(Craft::$app->getElements()->saveElement($project['entry']), $field->name . ' entry should save');

            $reloaded = TestProject::reloadEntry($project['entry']);
            self::assertSame(
                $expected,
                $adapter->getContextValue($project['target'], $reloaded->getFieldValue((string)$project['target']->handle)),
                $field->name . ' value should survive save and reload',
            );
        }
    }
}
