<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$port = getenv('AUTOFILL_BROWSER_DB_PORT') ?: '';
if ($port === '' || !ctype_digit($port)) {
    throw new RuntimeException('Set AUTOFILL_BROWSER_DB_PORT to the published DDEV MySQL port.');
}
$host = getenv('AUTOFILL_BROWSER_DB_HOST') ?: '127.0.0.1';
$database = 'db_test';
$identity = 'craft-autofill-testbench:db_test';
$pdo = new PDO(
    sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $host, $port, $database),
    'db',
    'db',
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION],
);
$marker = $pdo->query('SELECT `identity` FROM autofill_test_database_marker LIMIT 1')->fetchColumn();
if ($marker !== $identity) {
    throw new RuntimeException('Browser setup requires the marked disposable db_test database. Refusing to seed any other database.');
}

$environment = array_merge($_ENV, [
    'CRAFT_DB_SERVER' => $host,
    'CRAFT_DB_PORT' => $port,
    'CRAFT_DB_DATABASE' => $database,
    'CRAFT_DB_USER' => 'db',
    'CRAFT_DB_PASSWORD' => 'db',
    'CRAFT_TEST_DB_DATABASE' => $database,
    'AUTOFILL_TEST_DB_IDENTITY' => $identity,
    'PRIMARY_SITE_URL' => 'http://127.0.0.1:' . (getenv('AUTOFILL_BROWSER_PORT') ?: '8097'),
    'CRAFT_ENVIRONMENT' => 'dev',
    'CRAFT_DEV_MODE' => 'true',
    'CRAFT_ALLOW_ADMIN_CHANGES' => 'true',
    'CRAFT_SECURITY_KEY' => 'autofill-testbench-not-for-production',
    'AUTOFILL_TEST_PROVIDER_FIXTURE' => '1',
]);
$command = [PHP_BINARY, $root . '/testbench/craft', 'autofill-testbench/seed/browser'];
$process = proc_open($command, [0 => ['pipe', 'r'], 1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes, $root, $environment);
if (!is_resource($process)) {
    throw new RuntimeException('Could not start the isolated browser fixture seed command.');
}
fclose($pipes[0]);
$stdout = stream_get_contents($pipes[1]);
$stderr = stream_get_contents($pipes[2]);
fclose($pipes[1]);
fclose($pipes[2]);
$exitCode = proc_close($process);
if ($exitCode !== 0) {
    throw new RuntimeException('Could not seed the isolated browser fixture: ' . trim((string)$stderr . "\n" . (string)$stdout));
}
$jsonLine = null;
foreach (preg_split('/\R/', trim((string)$stdout)) as $line) {
    if (str_starts_with(trim($line), '{')) {
        $jsonLine = trim($line);
    }
}
if ($jsonLine === null || !is_array(json_decode($jsonLine, true))) {
    throw new RuntimeException('The browser seed command did not return fixture JSON. Output: ' . trim((string)$stdout));
}
echo $jsonLine;
