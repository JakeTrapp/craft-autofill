<?php

/**
 * Autofill config file
 *
 * Copy this file to your project's `config/` folder as `autofill.php` to change these settings.
 * Values here aren't shown in the control panel. Like other Craft config files, the array can be
 * keyed by environment.
 */

return [
    // Seconds to wait for one AI provider response (5–600). Reasoning models may need 60–120.
    // Queue jobs are given enough time for a generation request and one repair request.
    'requestTimeout' => 30,

    // Output token limit sent to every provider (256–200000). Null uses each provider's default
    // (Anthropic: 8192). Raise this if responses are reported as cut off.
    'maxOutputTokens' => null,
];
