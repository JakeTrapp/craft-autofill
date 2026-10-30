<?php

declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

$ddevFamily = getenv('DDEV_DATABASE_FAMILY') ?: '';
$driver = $ddevFamily === 'postgres' ? 'pgsql' : (getenv('CRAFT_DB_DRIVER') ?: 'mysql');
$host = getenv('CRAFT_DB_SERVER') ?: 'db';
$port = $ddevFamily !== '' ? ($driver === 'pgsql' ? '5432' : '3306') : (getenv('CRAFT_DB_PORT') ?: ($driver === 'pgsql' ? '5432' : '3306'));
$database = getenv('CRAFT_TEST_DB_DATABASE') ?: 'db_test';
$user = getenv('CRAFT_DB_USER') ?: 'db';
$password = getenv('CRAFT_DB_PASSWORD') ?: 'db';
$project = getenv('DDEV_PROJECT') ?: '';
$identity = getenv('AUTOFILL_TEST_DB_IDENTITY') ?: '';

if ($project !== 'craft-autofill-testbench' || $host !== 'db' || !preg_match('/^[a-zA-Z0-9_]+_test$/', $database) || $identity !== $project . ':' . $database) {
    throw new RuntimeException('Refusing to reset a database without the matching DDEV testbench identity.');
}

$adminDatabase = $driver === 'pgsql' ? 'postgres' : (getenv('CRAFT_DB_DATABASE') ?: 'db');
$manualDatabase = getenv('CRAFT_DB_DATABASE') ?: 'db';
$expectedManualDatabase = 'db';
if ($manualDatabase !== $expectedManualDatabase || $database === $manualDatabase) {
    throw new RuntimeException('Refusing to recreate the test database unless the manual site remains on the separate "db" database.');
}
$adminUser = $driver === 'pgsql' ? $user : 'root';
$adminPassword = $driver === 'pgsql' ? $password : 'root';
$pdo = new PDO(sprintf('%s:host=%s;port=%s;dbname=%s', $driver, $host, $port, $adminDatabase), $adminUser, $adminPassword, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);

$check = new PDO(sprintf('%s:host=%s;port=%s;dbname=%s', $driver, $host, $port, $adminDatabase), $adminUser, $adminPassword, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);
if ($driver === 'pgsql') {
    $exists = $check->prepare('SELECT 1 FROM pg_database WHERE datname = :database');
    $exists->execute(['database' => $database]);
    $databaseExists = (bool)$exists->fetchColumn();
} else {
    $exists = $check->prepare('SELECT 1 FROM information_schema.schemata WHERE schema_name = :database');
    $exists->execute(['database' => $database]);
    $databaseExists = (bool)$exists->fetchColumn();
}

if ($databaseExists) {
    $existing = new PDO(sprintf('%s:host=%s;port=%s;dbname=%s', $driver, $host, $port, $database), $adminUser, $adminPassword, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    try {
        $identityColumn = $driver === 'pgsql' ? '"identity"' : '`identity`';
        $marker = $existing->query("SELECT $identityColumn FROM autofill_test_database_marker LIMIT 1")->fetchColumn();
    } catch (Throwable $exception) {
        throw new RuntimeException('Refusing to reset an unmarked database. Run testbench/bin/mark-test-database once after confirming this is the disposable test database.', 0, $exception);
    }
    if ($marker !== $identity) {
        throw new RuntimeException('Refusing to reset a database with a mismatched identity marker.');
    }
}

if ($driver === 'pgsql') {
    $statement = $pdo->prepare('SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = :database AND pid <> pg_backend_pid()');
    $statement->execute(['database' => $database]);
    $pdo->exec(sprintf('DROP DATABASE IF EXISTS "%s"', $database));
    $pdo->exec(sprintf('CREATE DATABASE "%s"', $database));
    $testDb = new PDO(sprintf('%s:host=%s;port=%s;dbname=%s', $driver, $host, $port, $database), $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $testDb->exec('CREATE TABLE autofill_test_database_marker ("identity" VARCHAR(255) NOT NULL PRIMARY KEY)');
    $markerInsert = $testDb->prepare('INSERT INTO autofill_test_database_marker ("identity") VALUES (:identity)');
    $markerInsert->execute(['identity' => $identity]);
} else {
    $pdo->exec(sprintf('DROP DATABASE IF EXISTS `%s`', $database));
    $pdo->exec(sprintf('CREATE DATABASE `%s` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci', $database));
    $pdo->exec(sprintf("GRANT ALL PRIVILEGES ON `%s`.* TO 'db'@'%%'", $database));
    $pdo->exec('FLUSH PRIVILEGES');
    $testDb = new PDO(sprintf('%s:host=%s;port=%s;dbname=%s', $driver, $host, $port, $database), $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $testDb->exec('CREATE TABLE autofill_test_database_marker (`identity` VARCHAR(255) NOT NULL PRIMARY KEY)');
    $markerInsert = $testDb->prepare('INSERT INTO autofill_test_database_marker (`identity`) VALUES (:identity)');
    $markerInsert->execute(['identity' => $identity]);
}

fwrite(STDOUT, sprintf("Fresh test database created: %s\n", $database));
