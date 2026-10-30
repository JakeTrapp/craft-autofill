<?php

declare(strict_types=1);

namespace jtdev\craftautofill\models\ai;

use craft\base\Model;

class AiGenerationRequest extends Model
{
    public string $modelConfigUid = '';
    // Provider-ready conversation payload built by field adapters + prompt builder.
    public array $messages = [];
    // Read-only source/dependency values used to construct messages.
    public array $context = [];
    /** @var array<int, array<string,mixed>> Transient file inputs, data is base64. */
    public array $fileInputs = [];

    public function rules(): array
    {
        return [
            ['modelConfigUid', 'required'],
            ['modelConfigUid', 'string'],
            [['messages', 'context', 'fileInputs'], 'safe'],
        ];
    }

    /** A request representation safe to persist. File content is never returned. */
    public function safeLogPayload(): array
    {
        $files = [];
        foreach ($this->fileInputs as $file) {
            if (!is_array($file)) {
                continue;
            }
            $files[] = [
                'assetId' => (int)($file['assetId'] ?? 0),
                'filename' => (string)($file['filename'] ?? ''),
                'mimeType' => (string)($file['mimeType'] ?? ''),
            ];
        }

        return [
            'modelConfigUid' => $this->modelConfigUid,
            'messages' => $this->messages,
            'context' => $this->context,
            'fileInputs' => $files,
        ];
    }
}
