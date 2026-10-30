<?php

declare(strict_types=1);

namespace modules\autofilltestbench;

use Craft;
use modules\autofilltestbench\FixtureOpenAiProvider;
use jtdev\craftautofill\AutofillPlugin;
use yii\base\Module as BaseModule;

final class Module extends BaseModule
{
    public function init(): void
    {
        Craft::setAlias('@modules/autofilltestbench', __DIR__);
        if (Craft::$app->getRequest()->getIsConsoleRequest()) {
            $this->controllerNamespace = 'modules\\autofilltestbench\\console\\controllers';
        }
        parent::init();

        Craft::$app->onInit(static function(): void {
            if (getenv('AUTOFILL_TEST_PROVIDER_FIXTURE') !== '1') {
                return;
            }

            $plugin = AutofillPlugin::getInstance();
            $plugin->getAiService()->registerProvider(new FixtureOpenAiProvider());
            $settings = $plugin->getSettings();
            $settings->testMode = false;
            $settings->modelConfigs = [[
                'uid' => 'autofill-test-fixture',
                'label' => 'Testbench fixture provider',
                'provider' => 'openai',
                'apiKeyEnv' => '$AUTOFILL_FIXTURE_API_KEY',
                'modelId' => 'testbench-fixture',
                'enabled' => true,
            ]];
        });
    }
}
