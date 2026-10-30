<?php

declare(strict_types=1);

namespace jtdev\craftautofill\web\assets\cp;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;

class AutofillCpAsset extends AssetBundle
{
    public function init(): void
    {
        $this->sourcePath = __DIR__ . '/dist';
        $this->depends = [CpAsset::class];
        $this->js = ['autofill-cp.js'];
        $this->jsOptions = ['type' => 'module'];
        $this->css = ['autofill-cp.css'];

        parent::init();
    }
}
