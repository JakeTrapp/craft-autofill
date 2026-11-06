<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\permissions;

use Craft;
use craft\base\ElementInterface;

/** Candidate queries must honor the same actor in HTTP and queue execution. */
final class RelatedElementAccess
{
    public static function canRead(ElementInterface $element): bool
    {
        if (Craft::$app === null || !Craft::$app->has('user')) return true;
        $actor = Craft::$app->getUser()->getIdentity();
        return $actor === null || Craft::$app->getElements()->canView($element, $actor);
    }
}
