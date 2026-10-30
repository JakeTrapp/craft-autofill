<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\ai;

use craft\base\Model;
use jtdev\craftautofill\models\ai\AiGenerationRequest;

interface AiProviderInterface
{
    public function getProviderKey(): string;

    /**
     * Sends a typed generation request and returns a provider-neutral envelope.
     * The original provider payload is retained under providerRaw for diagnostics.
     */
    public function generate(AiGenerationRequest $request, Model $providerConfig): array;
}
