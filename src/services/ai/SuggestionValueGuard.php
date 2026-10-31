<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\ai;

use craft\base\ElementInterface;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\fields\AutofillField;
use RuntimeException;

/** Revalidates the submitted value rather than trusting client validation flags. */
final class SuggestionValueGuard
{
    public static function checked(AutofillField $definition, ElementInterface $element, string $uid, array $suggestion): mixed
    {
        if (!array_key_exists('value', $suggestion)) {
            throw new RuntimeException('Suggestion is missing a value.');
        }
        $result = AutofillPlugin::getInstance()->getAiService()->responseNormalizer->normalizeForElement(
            json_encode([['fieldName' => $uid, 'value' => $suggestion['value']]], JSON_THROW_ON_ERROR),
            $definition,
            $element,
        );
        $checked = $result->suggestions[0] ?? null;
        if (!$result->success || !is_array($checked) || ($checked['targetFieldUid'] ?? '') !== $uid) {
            throw new RuntimeException('The suggestion does not target an enabled output field.');
        }
        if ($checked['validationErrors'] !== []) {
            throw new RuntimeException(implode(' ', $checked['validationErrors']));
        }
        return $checked['value'];
    }
}
