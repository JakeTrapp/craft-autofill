<?php

use craft\config\GeneralConfig;
use craft\helpers\App;

return GeneralConfig::create()
    ->defaultWeekStartDay(1)
    ->omitScriptNameInUrls(true)
    ->allowAdminChanges(App::env('CRAFT_ALLOW_ADMIN_CHANGES') !== false)
    ->devMode(App::env('CRAFT_DEV_MODE') !== false)
    ->aliases(['@web' => App::env('PRIMARY_SITE_URL') ?: 'https://craft-autofill-testbench.ddev.site']);
