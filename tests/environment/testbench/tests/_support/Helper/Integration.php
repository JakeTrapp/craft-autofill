<?php

namespace Helper;

class Integration extends \Codeception\Module
{
    public function _beforeSuite($settings = []): void
    {
        parent::_beforeSuite($settings);

        $project = getenv('DDEV_PROJECT') ?: '';
        $database = getenv('CRAFT_TEST_DB_DATABASE') ?: '';
        $identity = getenv('AUTOFILL_TEST_DB_IDENTITY') ?: '';
        $host = getenv('CRAFT_DB_SERVER') ?: '';
        if ($project !== 'craft-autofill-testbench' || $host !== 'db' || $database !== 'db_test' || $identity !== $project . ':' . $database) {
            throw new \RuntimeException('Refusing to mark a database outside the dedicated Autofill integration environment.');
        }

        $driver = getenv('CRAFT_DB_DRIVER') ?: 'mysql';
        $port = getenv('CRAFT_DB_PORT') ?: '3306';
        $user = getenv('CRAFT_DB_USER') ?: 'db';
        $password = getenv('CRAFT_DB_PASSWORD') ?: 'db';
        $pdo = new \PDO(sprintf('%s:host=%s;port=%s;dbname=%s', $driver, $host, $port, $database), $user, $password, [
            \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
        ]);
        $pdo->exec('CREATE TABLE IF NOT EXISTS autofill_test_database_marker (`identity` VARCHAR(255) NOT NULL PRIMARY KEY)');
        $statement = $pdo->prepare('INSERT IGNORE INTO autofill_test_database_marker (`identity`) VALUES (:identity)');
        $statement->execute(['identity' => $identity]);
        $storedIdentity = $pdo->query('SELECT `identity` FROM autofill_test_database_marker LIMIT 1')->fetchColumn();
        if ($storedIdentity !== $identity) {
            throw new \RuntimeException('The integration database marker does not match the expected identity.');
        }
    }
}
