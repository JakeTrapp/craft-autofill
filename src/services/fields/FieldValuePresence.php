<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\fields;

use craft\base\ElementInterface;
use craft\base\FieldInterface;
use craft\helpers\StringHelper;

final class FieldValuePresence
{
    public static function isEmpty(mixed $value, ElementInterface $element, ?FieldInterface $field = null): bool
    {
        if ($value === null || (is_string($value) && StringHelper::trim($value) === '')) {
            return true;
        }

        return $field?->isValueEmpty($value, $element) ?? false;
    }
}
