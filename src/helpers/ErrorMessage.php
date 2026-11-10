<?php

declare(strict_types=1);

namespace jtdev\craftautofill\helpers;

use Craft;
use RuntimeException;
use Throwable;
use yii\base\UserException;

/**
 * Turns exceptions into messages that are safe to show in the control panel.
 *
 * Autofill throws RuntimeException with messages written for editors (permissions, missing content, provider
 * errors with keys redacted). Anything else, such as database or framework errors, may expose internals, so it is
 * logged and replaced with a generic message unless devMode is on.
 */
final class ErrorMessage
{
    public static function forUser(Throwable $error, string $fallback = 'Something went wrong. Check the Craft logs for details.'): string
    {
        // PDOException extends RuntimeException but carries SQL details.
        if (($error instanceof RuntimeException && !$error instanceof \PDOException) || $error instanceof UserException) {
            return $error->getMessage();
        }
        Craft::$app->getErrorHandler()->logException($error);
        return Craft::$app->getConfig()->getGeneral()->devMode ? $error->getMessage() : $fallback;
    }
}
