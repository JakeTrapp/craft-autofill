<?php

declare(strict_types=1);

namespace Tests\integration;

use Codeception\Test\Unit;
use craft\fields\ButtonGroup;
use craft\fields\Checkboxes;
use craft\fields\Dropdown;
use craft\fields\Icon;
use craft\fields\MultiSelect;
use craft\fields\RadioButtons;
use jtdev\craftautofill\AutofillPlugin;
use Tests\Support\TestProject;

final class OptionFieldEdgeCaseTest extends Unit
{
    public function testOptionFieldAdaptersPersistValuesAcrossSaveAndReload(): void
    {
        $fixtures = [
            [new Dropdown(['options' => self::OPTIONS]), 'One', '1'],
            [new Checkboxes(['options' => self::OPTIONS]), ['zero', 'Two'], ['zero', 'two']],
            [new MultiSelect(['options' => self::OPTIONS]), '["zero","Two"]', ['zero', 'two']],
            [new RadioButtons(['options' => self::OPTIONS]), 'Two', 'two'],
            [new ButtonGroup(['options' => self::OPTIONS]), 'One', '1'],
            [new Icon(['includeProIcons' => true]), 'house', 'house'],
        ];

        $failures = [];
        foreach ($fixtures as [$field, $suggestion, $expected]) {
            try {
                $project = TestProject::create($field);
                $adapter = AutofillPlugin::getInstance()->getFieldAdapterService()->getAdapterForField($project['target']);
                self::assertNotNull($adapter, $field::class . ' adapter missing');
                self::assertTrue($adapter->validateSuggestion($project['target'], $suggestion), $field::class . ' rejected fixture suggestion');
                $adapter->applySuggestionToEntry($project['target'], $project['entry'], $suggestion);
                self::assertTrue(
                    \Craft::$app->getElements()->saveElement($project['entry']),
                    $field::class . ' failed to save: ' . implode(' ', $project['entry']->getErrorSummary(true)),
                );

                $reloaded = TestProject::reloadEntry($project['entry']);
                $stored = $reloaded->getFieldValue((string)$project['target']->handle);
                if (is_array($expected)) {
                    $stored = array_map(static fn($option) => $option->value, iterator_to_array($stored));
                } elseif ($stored instanceof \craft\fields\data\SingleOptionFieldData) {
                    $stored = $stored->value;
                } elseif ($stored instanceof \craft\fields\data\IconData) {
                    $stored = $stored->name;
                }
                self::assertSame($expected, $stored, $field::class . ' stored value');
            } catch (\Throwable $exception) {
                $failures[] = $field::class . ': ' . $exception->getMessage();
            }
        }

        self::assertSame([], $failures, implode("\n", $failures));
    }

    private const OPTIONS = [
        ['value' => 'zero', 'label' => 'Zero'],
        ['value' => '1', 'label' => 'One'],
        ['value' => 'two', 'label' => 'Two'],
    ];
}
