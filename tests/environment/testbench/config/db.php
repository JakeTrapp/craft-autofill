<?php

use craft\helpers\App;

$ddevFamily = getenv('DDEV_DATABASE_FAMILY') ?: '';
$driver = $ddevFamily === 'postgres' ? 'pgsql' : (App::env('CRAFT_DB_DRIVER') ?: 'mysql');
$server = App::env('CRAFT_DB_SERVER') ?: 'db';
$port = $ddevFamily !== '' ? ($driver === 'pgsql' ? '5432' : '3306') : (App::env('CRAFT_DB_PORT') ?: ($driver === 'pgsql' ? '5432' : '3306'));
$database = App::env('CRAFT_DB_DATABASE') ?: 'db';

return [
    'dsn' => sprintf('%s:host=%s;port=%s;dbname=%s', $driver, $server, $port, $database),
    'user' => App::env('CRAFT_DB_USER') ?: 'db',
    'password' => App::env('CRAFT_DB_PASSWORD') ?: 'db',
    'charset' => $driver === 'pgsql' ? 'utf8' : 'utf8mb4',
    'schema' => App::env('CRAFT_DB_SCHEMA') ?: 'public',
    'tablePrefix' => App::env('CRAFT_DB_TABLE_PREFIX') ?: '',
];
