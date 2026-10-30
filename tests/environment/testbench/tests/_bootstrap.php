<?php

declare(strict_types=1);

use craft\test\TestSetup;

ini_set('date.timezone', 'UTC');
date_default_timezone_set('UTC');

const CRAFT_TESTS_PATH = __DIR__;
const CRAFT_ROOT_PATH = __DIR__ . '/..';
const CRAFT_STORAGE_PATH = __DIR__ . '/_craft/storage';
const CRAFT_TEMPLATES_PATH = __DIR__ . '/_craft/templates';
const CRAFT_CONFIG_PATH = __DIR__ . '/_craft/config';
const CRAFT_MIGRATIONS_PATH = __DIR__ . '/_craft/migrations';
const CRAFT_TRANSLATIONS_PATH = __DIR__ . '/_craft/translations';
define('CRAFT_VENDOR_PATH', dirname(__DIR__) . '/vendor');

require CRAFT_VENDOR_PATH . '/autoload.php';
TestSetup::configureCraft();
