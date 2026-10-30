<?php

use modules\autofilltestbench\Module;

return [
    'id' => getenv('CRAFT_APP_ID') ?: 'autofill-testbench',
    'modules' => ['autofill-testbench' => Module::class],
    'bootstrap' => ['autofill-testbench'],
    'components' => [
        'projectConfig' => [
            'class' => craft\services\ProjectConfig::class,
            'writeYamlAutomatically' => false,
        ],
    ],
];
