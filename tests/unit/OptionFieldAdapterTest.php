<?php

declare(strict_types=1);

namespace Tests\unit;

use craft\fields\ButtonGroup;
use craft\fields\Checkboxes;
use craft\fields\Dropdown;
use craft\fields\Icon;
use craft\fields\MultiSelect;
use craft\fields\RadioButtons;
use jtdev\craftautofill\services\fields\adapters\ButtonGroupFieldAdapter;
use jtdev\craftautofill\services\fields\adapters\CheckboxesFieldAdapter;
use jtdev\craftautofill\services\fields\adapters\DropdownFieldAdapter;
use jtdev\craftautofill\services\fields\adapters\IconFieldAdapter;
use jtdev\craftautofill\services\fields\adapters\MultiSelectFieldAdapter;
use jtdev\craftautofill\services\fields\adapters\OptionFieldValueHelper;
use jtdev\craftautofill\services\fields\adapters\RadioButtonsFieldAdapter;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class OptionFieldAdapterTest extends TestCase
{
    private const OPTIONS = [
        ['value' => 'zero', 'label' => 'Zero'],
        ['value' => '1', 'label' => 'One'],
        ['value' => 'two', 'label' => 'Shared'],
        ['value' => 'three', 'label' => 'Shared'],
    ];

    #[DataProvider('singleCases')]
    public function testSingleOptionsResolveOnlyExactValuesOrUniqueLabels(mixed $input, string $expected, bool $valid): void
    {
        $field = new Dropdown(['options' => self::OPTIONS]);
        $adapter = new DropdownFieldAdapter();

        self::assertSame($expected, $adapter->normalizeSuggestion($field, $input));
        self::assertSame($valid, $adapter->validateSuggestion($field, $input));
    }

    public static function singleCases(): array
    {
        return [
            'exact value' => ['zero', 'zero', true],
            'unique label case insensitive' => ['oNe', '1', true],
            'zero string preserved' => ['0', '0', false],
            'empty' => ['', '', false],
            'unknown' => ['missing', 'missing', false],
            'ambiguous label' => ['Shared', 'Shared', false],
            'array rejected' => [['zero'], '', false],
            'object rejected' => [new \stdClass(), '', false],
        ];
    }

    #[DataProvider('multiCases')]
    public function testMultiOptionsPreserveInvalidItemsAndDeduplicate(mixed $input, array $expected, bool $valid): void
    {
        $field = new MultiSelect(['options' => self::OPTIONS]);
        $adapter = new MultiSelectFieldAdapter();

        self::assertSame($expected, $adapter->normalizeSuggestion($field, $input));
        self::assertSame($valid, $adapter->validateSuggestion($field, $input));
    }

    public static function multiCases(): array
    {
        return [
            'array values and labels' => [[0 => 'zero', 1 => 'One'], ['zero', '1'], true],
            'JSON array' => ['["zero","two"]', ['zero', 'two'], true],
            'delimited' => ['zero, One; two', ['zero', '1', 'two'], true],
            'deduplicated' => [['zero', 'Zero', 'zero'], ['zero'], true],
            'zero and empty retained safely' => [['0', '', 'zero'], ['0', 'zero'], false],
            'unknown item blocks list' => [['zero', 'missing'], ['zero', 'missing'], false],
            'ambiguous item blocks list' => [['zero', 'Shared'], ['zero', 'Shared'], false],
            'wrong object type' => [new \stdClass(), [], false],
        ];
    }

    public function testCheckboxesAcceptsMixedJsonAndValidatesCustomOptionMode(): void
    {
        $field = new Checkboxes(['options' => self::OPTIONS]);
        $adapter = new CheckboxesFieldAdapter();
        self::assertSame(['zero', '1'], $adapter->normalizeSuggestion($field, '["zero","One"]'));
        self::assertFalse($adapter->validateSuggestion($field, ['zero', 'not-an-option']));

        $field->customOptions = true;
        self::assertTrue($adapter->validateSuggestion($field, ['not-an-option']));
    }

    public function testRadioButtonsRejectsMultipleValues(): void
    {
        $field = new RadioButtons(['options' => self::OPTIONS]);
        $adapter = new RadioButtonsFieldAdapter();
        self::assertSame('', $adapter->normalizeSuggestion($field, ['zero', 'One']));
        self::assertFalse($adapter->validateSuggestion($field, ['zero', 'One']));
    }

    public function testButtonGroupUsesTheSameAmbiguityRules(): void
    {
        $field = new ButtonGroup(['options' => self::OPTIONS]);
        $adapter = new ButtonGroupFieldAdapter();
        self::assertSame('1', $adapter->normalizeSuggestion($field, 'One'));
        self::assertFalse($adapter->validateSuggestion($field, 'Shared'));
        self::assertFalse($adapter->validateSuggestion($field, ['zero']));
    }

    public function testValueHelperDoesNotGuessAnAmbiguousLabel(): void
    {
        self::assertSame('Shared', OptionFieldValueHelper::normalizeSingleCandidate('Shared', self::OPTIONS));
        self::assertSame('zero', OptionFieldValueHelper::normalizeSingleCandidate('Zero', self::OPTIONS));
    }

    public function testIconRejectsStructuredInputWithoutCastingWarnings(): void
    {
        $adapter = new IconFieldAdapter();
        $field = new Icon();
        self::assertSame('', $adapter->normalizeSuggestion($field, ['name' => 'house']));
        self::assertFalse($adapter->validateSuggestion($field, ['name' => 'house']));
    }
}
