<?php
// Switches the disposable db_test install to Craft Pro and Autofill Pro, which the fixture users and bulk runs need.
// Run inside the DDEV web container with CRAFT_DB_DATABASE=db_test; refuses any other database.

declare(strict_types=1);

if (getenv('CRAFT_DB_DATABASE') !== 'db_test') {
    fwrite(STDERR, "Refusing to change a database other than db_test.\n");
    exit(1);
}
define('CRAFT_BASE_PATH', '/var/www/html/testbench');
define('CRAFT_VENDOR_PATH', CRAFT_BASE_PATH . '/vendor');
require CRAFT_VENDOR_PATH . '/autoload.php';
$app = require CRAFT_VENDOR_PATH . '/craftcms/cms/bootstrap/console.php';
$app->setEdition(craft\enums\CmsEdition::Pro);
$app->getPlugins()->switchEdition('autofill', 'pro');
$app->getProjectConfig()->saveModifiedConfigData();
echo "db_test is on Craft Pro and Autofill Pro.\n";
