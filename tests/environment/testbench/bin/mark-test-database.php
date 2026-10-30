<?php

declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

$family = getenv('DDEV_DATABASE_FAMILY') ?: '';
$driver = $family === 'postgres' ? 'pgsql' : (getenv('CRAFT_DB_DRIVER') ?: 'mysql');
$host = getenv('CRAFT_DB_SERVER') ?: 'db';
$port = $family !== '' ? ($driver === 'pgsql' ? '5432' : '3306') : (getenv('CRAFT_DB_PORT') ?: '3306');
$database = getenv('CRAFT_TEST_DB_DATABASE') ?: '';
$identity = getenv('AUTOFILL_TEST_DB_IDENTITY') ?: '';
$project = getenv('DDEV_PROJECT') ?: '';
$user = getenv('CRAFT_DB_USER') ?: 'db';
$password = getenv('CRAFT_DB_PASSWORD') ?: 'db';

if (!preg_match('/^[a-zA-Z0-9_]+_test$/', $database) || $project === '' || $identity !== $project . ':' . $database) {
    throw new RuntimeException('Refusing to mark a database without the matching DDEV testbench identity.');
}

$pdo = new PDO(sprintf('%s:host=%s;port=%s;dbname=%s', $driver, $host, $port, $database), $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
if ($driver === 'pgsql') {
    $tables = $pdo->query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")->fetchAll(PDO::FETCH_COLUMN);
} else {
    $tables = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
}
foreach (['projectconfig', 'plugins', 'migrations'] as $requiredTable) {
    if (!in_array($requiredTable, $tables, true)) {
        throw new RuntimeException(sprintf('Refusing to mark this database because Craft table "%s" is missing.', $requiredTable));
    }
}

if (in_array('autofill_test_database_marker', $tables, true)) {
    $identityColumn = $driver === 'pgsql' ? '"identity"' : '`identity`';
    $existingIdentity = $pdo->query("SELECT $identityColumn FROM autofill_test_database_marker LIMIT 1")->fetchColumn();
    if ($existingIdentity !== $identity) {
        throw new RuntimeException('The existing test database marker does not match this DDEV project.');
    }
    fwrite(STDOUT, sprintf("Test database already marked: %s\n", $identity));
    exit(0);
}

$identityColumn = $driver === 'pgsql' ? '"identity"' : '`identity`';
$pdo->exec("CREATE TABLE autofill_test_database_marker ($identityColumn VARCHAR(255) NOT NULL PRIMARY KEY)");
$statement = $pdo->prepare("INSERT INTO autofill_test_database_marker ($identityColumn) VALUES (:identity)");
$statement->execute(['identity' => $identity]);
fwrite(STDOUT, sprintf("Marked the disposable test database: %s\n", $identity));
