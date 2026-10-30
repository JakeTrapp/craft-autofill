<?php

declare(strict_types=1);

use Dotenv\Dotenv;

define('CRAFT_BASE_PATH', __DIR__);
define('CRAFT_VENDOR_PATH', CRAFT_BASE_PATH . '/vendor');
define('CRAFT_STORAGE_PATH', CRAFT_BASE_PATH . '/storage');
define('CRAFT_TEMPLATES_PATH', CRAFT_BASE_PATH . '/templates');

require CRAFT_VENDOR_PATH . '/autoload.php';
foreach (['.env', '.env.test'] as $filename) {
    if (is_file(CRAFT_BASE_PATH . '/' . $filename)) {
        Dotenv::createUnsafeImmutable(CRAFT_BASE_PATH, $filename)->safeLoad();
    }
}

define('CRAFT_ENVIRONMENT', getenv('CRAFT_ENVIRONMENT') ?: 'dev');
define('CRAFT_DEV_MODE', filter_var(getenv('CRAFT_DEV_MODE') ?: 'true', FILTER_VALIDATE_BOOL));
