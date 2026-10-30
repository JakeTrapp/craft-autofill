<?php

declare(strict_types=1);

namespace jtdev\craftautofill\models;

use craft\base\Model;

class Workflow extends Model
{
    public ?int $id = null;
    public string $uid = '';
    public string $handle = '';
    public string $name = '';
    public string $scope = 'entry';
    public string $entryTypeUid = '';
    public string $volumeUid = '';
    public string $modelConfigUid = '';
    public string $globalPrompt = '';
    public string $actionButtonLabel = '';
    public bool $showUserPromptInput = true;
    public bool $showOnSidebar = false;

    /** @var array<int, array<string, mixed>> */
    public array $rows = [];

    /** @var array<int, array<string, mixed>> */
    public array $contextRows = [];

    public function rules(): array
    {
        return [
            [['handle', 'name', 'scope', 'entryTypeUid', 'volumeUid', 'modelConfigUid', 'globalPrompt', 'actionButtonLabel'], 'string'],
            [['handle', 'name', 'scope'], 'required'],
            [['id', 'uid'], 'safe'],
            [['handle'], 'match', 'pattern' => '/^[a-zA-Z][a-zA-Z0-9_-]*$/'],
            [['scope'], 'in', 'range' => ['entry', 'asset']],
            [['showUserPromptInput', 'showOnSidebar'], 'boolean'],
            [['rows', 'contextRows'], 'validateArrayConfig'],
            [['entryTypeUid', 'volumeUid'], 'validateScopeTarget'],
        ];
    }

    public function validateArrayConfig(string $attribute): void
    {
        if (!is_array($this->$attribute)) {
            $this->addError($attribute, 'Workflow configuration must be an array.');
        }
    }

    public function validateScopeTarget(): void
    {
        if ($this->scope === 'entry' && trim($this->entryTypeUid) === '') {
            $this->addError('entryTypeUid', 'Select an entry type for this workflow.');
        }

        if ($this->scope === 'asset' && trim($this->volumeUid) === '') {
            $this->addError('volumeUid', 'Select an asset volume for this workflow.');
        }
    }
}
