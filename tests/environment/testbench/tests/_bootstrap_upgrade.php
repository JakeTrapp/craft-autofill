<?php

declare(strict_types=1);

// Two processes deliberately load different plugin sources against the same
// disposable database. Composer continues supplying Craft and its dependencies.
if (getenv('AUTOFILL_UPGRADE_STAGE') === 'legacy') {
    $legacy = dirname(__DIR__) . '/.upgrade-legacy/src/';
    if (!is_file($legacy . 'AutofillPlugin.php')) {
        throw new RuntimeException('Missing local 1.0.7 source for the upgrade rehearsal.');
    }
    spl_autoload_register(static function(string $class) use ($legacy): void {
        $prefix = 'jtdev\\craftautofill\\';
        if (!str_starts_with($class, $prefix)) return;
        $file = $legacy . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
        if (is_file($file)) require $file;
    }, true, true);
}

require __DIR__ . '/_bootstrap.php';
