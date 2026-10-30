<?php

use craft\config\GeneralConfig;

return GeneralConfig::create()
    ->allowAdminChanges(true)
    ->devMode(true)
    ->testToEmailAddress('autofill-tests@example.test');
