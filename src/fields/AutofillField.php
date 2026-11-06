<?php

declare(strict_types=1);

namespace jtdev\craftautofill\fields;

use Craft;
use craft\base\ElementInterface;
use craft\base\Field;
use craft\base\FieldInterface;
use craft\elements\Asset;
use craft\elements\Entry;
use craft\models\EntryType;
use jtdev\craftautofill\AutofillPlugin;

class AutofillField extends Field
{
    public string $entryTypeUid = '';
    public string $modelConfigUid = '';
    public string $workflowHandle = '';
    public string $scope = 'entry';
    public string $volumeUid = '';
    public string $globalPrompt = '';
    public string $actionButtonLabel = '';
    public bool $showUserPromptInput = true;

    /**
     * @var array<int, array<string, mixed>>
     */
    public array $rows = [];

    /**
     * @var array<int, array<string, mixed>>
     */
    public array $contextRows = [];

    public static function displayName(): string
    {
        return Craft::t('autofill', 'Autofill');
    }

    public static function icon(): string
    {
        return 'wand-magic-sparkles';
    }

    public static function phpType(): string
    {
        return 'array|null';
    }

    public static function dbType(): array|string|null
    {
        return null;
    }

    public static function isRequirable(): bool
    {
        return false;
    }

    public function init(): void
    {
        parent::init();
        $this->globalPrompt = trim($this->globalPrompt);
        $this->workflowHandle = trim($this->workflowHandle);
        $this->actionButtonLabel = trim($this->actionButtonLabel);
        $this->showUserPromptInput = $this->toBool($this->showUserPromptInput);
        $this->rows = $this->normalizeRows($this->rows);
        $this->contextRows = $this->normalizeContextRows($this->contextRows);
    }

    protected function defineRules(): array
    {
        $rules = parent::defineRules();
        $rules[] = [['entryTypeUid', 'modelConfigUid', 'globalPrompt', 'actionButtonLabel', 'workflowHandle'], 'string'];
        $rules[] = ['showUserPromptInput', 'boolean'];
        $rules[] = ['globalPrompt', 'filter', 'filter' => 'trim'];
        $rules[] = ['actionButtonLabel', 'filter', 'filter' => 'trim'];
        $rules[] = ['rows', 'validateLegacyConfiguration', 'when' => fn(): bool => $this->workflowHandle === ''];

        return $rules;
    }

    public function settingsAttributes(): array
    {
        return $this->workflowHandle !== '' ? ['workflowHandle'] : parent::settingsAttributes();
    }

    public function getSettingsHtml(): ?string
    {
        if ($this->workflowHandle !== '' || ($this->entryTypeUid === '' && $this->rows === [] && $this->contextRows === [])) {
            return Craft::$app->getView()->renderTemplate('autofill/fields/autofill/reference-settings', [
                'field' => $this,
                'workflowOptions' => array_map(
                    static fn($workflow): array => ['label' => $workflow->name, 'value' => $workflow->handle],
                    AutofillPlugin::getInstance()->getWorkflowService()->getAll(),
                ),
            ]);
        }

        $selectedEntryType = $this->getSelectedEntryType();
        $supportedFields = $selectedEntryType
            ? AutofillPlugin::getInstance()->getFieldDiscoveryService()->getSupportedEntryTypeFields($selectedEntryType)
            : [];
        $supportedFields = $this->mergeMissingSelectedFields($supportedFields);

        return Craft::$app->getView()->renderTemplate('autofill/fields/autofill/settings.twig', [
            'field' => $this,
            'entryTypeOptions' => $this->getEntryTypeOptions(),
            'modelConfigOptions' => $this->getModelConfigOptions(),
            'supportedFields' => $supportedFields,
            'rows' => $this->rows,
            'contextRows' => $this->contextRows,
            'isProEdition' => AutofillPlugin::getInstance()->isProEdition(),
        ]);
    }

    public function normalizeValue(mixed $value, ?ElementInterface $element): mixed
    {
        return null;
    }

    protected function inputHtml(mixed $value, ?ElementInterface $element, bool $inline): string
    {
        if ($this->workflowHandle !== '') {
            $workflow = AutofillPlugin::getInstance()->getWorkflowService()->getByHandle($this->workflowHandle);
            if ($workflow === null || $workflow->archived) {
                return '';
            }

            if ($workflow->scope === 'entry') {
                if (!$element instanceof Entry || (string)$element->getType()->uid !== $workflow->entryTypeUid) {
                    return '';
                }
            } elseif ($workflow->scope === 'asset') {
                if (!$element instanceof Asset || $element->getVolume()->uid !== $workflow->volumeUid) {
                    return '';
                }
            } else {
                return '';
            }

            $actor = Craft::$app->getUser()->getIdentity();
            if ($actor === null && !Craft::$app->getRequest()->getIsConsoleRequest()) return '';
            if ($actor !== null && !AutofillPlugin::getInstance()->getWorkflowAccess()->canView($workflow, $actor)) return '';
            $field = AutofillPlugin::getInstance()->getWorkflowService()->asField($workflow);
            $field->id = $this->id;
            $field->uid = $this->uid;
            $field->handle = $this->handle;
            return Craft::$app->getView()->renderTemplate('autofill/fields/autofill/input.twig', [
                'field' => $field,
                'element' => $element,
                'testMode' => AutofillPlugin::getInstance()->getSettings()->testMode,
            ]);
        }

        if ($this->entryTypeUid === '' && $this->rows === [] && $this->contextRows === []) {
            return '';
        }

        return Craft::$app->getView()->renderTemplate('autofill/fields/autofill/input.twig', [
            'field' => $this,
            'element' => $element,
            'testMode' => AutofillPlugin::getInstance()->getSettings()->testMode,
        ]);
    }

    public function validateRows(): void
    {
        $this->rows = $this->normalizeRows($this->rows);
        $this->rows = $this->canonicalizeRowFieldSelections($this->rows);

        foreach ($this->rows as $index => $row) {
            $rowNumber = $index + 1;
            $targetFieldUid = (string)($row['targetFieldUid'] ?? '');

            if ($targetFieldUid === '') {
                $this->addError('rows', sprintf('Row %d must select a target field.', $rowNumber));
            }

            if ((string)($row['prompt'] ?? '') === '') {
                $this->addError('rows', sprintf('Row %d must include a prompt.', $rowNumber));
            }

            if ($this->shouldBlockProOnlyFieldUid($targetFieldUid)) {
                $this->addError('rows', sprintf(
                    'Row %d targets a field type that requires Autofill Pro.',
                    $rowNumber
                ));
            }
        }
    }

    public function validateLegacyConfiguration(): void
    {
        $this->validateRows();
        $this->validateContextRows();
        $this->validateUniqueFieldSelections();
        $this->validateEntryTypeUid();
        $this->validateModelConfigUid();
    }

    public function validateContextRows(): void
    {
        $this->contextRows = $this->normalizeContextRows($this->contextRows);
        $this->contextRows = $this->canonicalizeContextFieldSelections($this->contextRows);

        foreach ($this->contextRows as $index => $row) {
            $rowNumber = $index + 1;
            if ($row['fieldUid'] === '') {
                $this->addError('contextRows', sprintf('Context row %d must select a field.', $rowNumber));
            }

            if ($this->shouldBlockProOnlyFieldUid($row['fieldUid'])) {
                $this->addError('contextRows', sprintf(
                    'Context row %d uses a field type that requires Autofill Pro.',
                    $rowNumber
                ));
            }
        }
    }

    public function validateUniqueFieldSelections(): void
    {
        $this->rows = $this->normalizeRows($this->rows);
        $this->contextRows = $this->normalizeContextRows($this->contextRows);

        $seen = [];

        foreach ($this->rows as $index => $row) {
            $uid = (string)($row['targetFieldUid'] ?? '');
            if ($uid === '') {
                continue;
            }

            if (isset($seen[$uid])) {
                $this->addError('rows', sprintf(
                    'Field selection conflict: row %d uses a field that is already selected in %s.',
                    $index + 1,
                    $seen[$uid]
                ));
                continue;
            }

            $seen[$uid] = sprintf('row %d', $index + 1);
        }

        foreach ($this->contextRows as $index => $row) {
            $uid = $row['fieldUid'];
            if ($uid === '') {
                continue;
            }

            if (isset($seen[$uid])) {
                $this->addError('contextRows', sprintf(
                    'Field selection conflict: context row %d uses a field that is already selected in %s.',
                    $index + 1,
                    $seen[$uid]
                ));
                continue;
            }

            $seen[$uid] = sprintf('context row %d', $index + 1);
        }
    }

    public function validateEntryTypeUid(): void
    {
        if ($this->entryTypeUid === '') {
            return;
        }

        if ($this->getSelectedEntryType() === null) {
            $this->addError('entryTypeUid', 'Selected entry type no longer exists.');
        }
    }

    public function validateModelConfigUid(): void
    {
        if ($this->modelConfigUid === '') {
            return;
        }

        foreach (AutofillPlugin::getInstance()->getSettings()->modelConfigs as $config) {
            if (($config['uid'] ?? null) !== $this->modelConfigUid) {
                continue;
            }

            if (!($config['enabled'] ?? false)) {
                $this->addError('modelConfigUid', 'Selected model config is disabled.');
            }

            return;
        }

        $this->addError('modelConfigUid', 'Selected model config no longer exists.');
    }

    /**
     * @param mixed $rows
     * @return array<int, array<string, mixed>>
     */
    private function normalizeRows(mixed $rows): array
    {
        if (!is_array($rows)) {
            return [];
        }

        $normalized = [];

        foreach ($rows as $row) {
            if (!is_array($row)) {
                continue;
            }

            $targetFieldUid = trim((string)($row['targetFieldUid'] ?? ''));
            $prompt = trim((string)($row['prompt'] ?? ''));
            $requiresApproval = $this->toBool($row['requiresApproval'] ?? true);
            $includeCurrentFieldValue = $this->toBool($row['includeCurrentFieldValue'] ?? true);
            $overrideCurrentValue = $this->toBool($row['overrideCurrentValue'] ?? true);
            $enabled = $this->toBool($row['enabled'] ?? true);
            $seomatic = $this->normalizeSeomaticRowConfig($row['seomatic'] ?? null);
            $related = $this->normalizeRelatedRowConfig($row['related'] ?? null);
            $link = $this->normalizeLinkRowConfig($row['link'] ?? null);

            $hasMeaningfulInput = $targetFieldUid !== '' || $prompt !== '';
            if (!$hasMeaningfulInput) {
                continue;
            }

            $normalized[] = [
                'targetFieldUid' => $targetFieldUid,
                'prompt' => $prompt,
                'requiresApproval' => $requiresApproval,
                'includeCurrentFieldValue' => $includeCurrentFieldValue,
                'overrideCurrentValue' => $overrideCurrentValue,
                'enabled' => $enabled,
                'seomatic' => $seomatic,
                'related' => $related,
                'link' => $link,
                'assets' => is_array($row['assets'] ?? null) ? $row['assets'] : [],
            ];
        }

        return $normalized;
    }

    /**
     * @param mixed $rows
     * @return array<int, array{fieldUid:string, prompt:string, enabled:bool}>
     */
    private function normalizeContextRows(mixed $rows): array
    {
        if (!is_array($rows)) {
            return [];
        }

        $normalized = [];
        foreach ($rows as $row) {
            if (!is_array($row)) {
                continue;
            }

            $fieldUid = trim((string)($row['fieldUid'] ?? ''));
            $prompt = trim((string)($row['prompt'] ?? ''));
            $enabled = $this->toBool($row['enabled'] ?? true);

            if ($fieldUid === '' && $prompt === '') {
                continue;
            }

            $normalized[] = [
                'fieldUid' => $fieldUid,
                'prompt' => $prompt,
                'enabled' => $enabled,
                'assets' => is_array($row['assets'] ?? null) ? $row['assets'] : [],
            ];
        }

        return $normalized;
    }

    /**
     * @return array<int, array{label:string, value:string}>
     */
    private function getEntryTypeOptions(): array
    {
        $options = [
            ['label' => 'Select an entry type', 'value' => ''],
        ];

        foreach (Craft::$app->getEntries()->getAllSections() as $section) {
            foreach (Craft::$app->getEntries()->getEntryTypesBySectionId((int)$section->id) as $entryType) {
                $options[] = [
                    'label' => sprintf('%s -> %s', $section->name, $entryType->name),
                    'value' => (string)$entryType->uid,
                ];
            }
        }

        return $options;
    }

    /**
     * @return array<int, array{label:string, value:string}>
     */
    private function getModelConfigOptions(): array
    {
        $options = [
            ['label' => 'Use global default (first enabled model config)', 'value' => ''],
        ];

        foreach (AutofillPlugin::getInstance()->getSettings()->modelConfigs as $config) {
            if (!($config['enabled'] ?? false)) {
                continue;
            }

            $uid = (string)($config['uid'] ?? '');
            if ($uid === '') {
                continue;
            }

            $label = trim((string)($config['label'] ?? ''));
            $options[] = [
                'label' => $label !== '' ? $label : $uid,
                'value' => $uid,
            ];
        }

        return $options;
    }

    private function getSelectedEntryType(): ?EntryType
    {
        if ($this->entryTypeUid === '') {
            return null;
        }

        foreach (Craft::$app->getEntries()->getAllEntryTypes() as $entryType) {
            if ((string)$entryType->uid === $this->entryTypeUid) {
                return $entryType;
            }
        }

        return null;
    }

    private function toBool(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        if (is_numeric($value)) {
            return (int)$value === 1;
        }

        if (is_string($value)) {
            return in_array(strtolower($value), ['1', 'true', 'yes', 'on'], true);
        }

        return false;
    }

    /**
     * @param mixed $raw
     * @return array{includeSeoTitle:bool,includeSiteNamePosition:bool,includeSeoDescription:bool,includeSeoKeywords:bool}
     */
    private function normalizeSeomaticRowConfig(mixed $raw): array
    {
        $config = is_array($raw) ? $raw : [];

        return [
            'includeSeoTitle' => $this->toBool($config['includeSeoTitle'] ?? true),
            'includeSiteNamePosition' => $this->toBool($config['includeSiteNamePosition'] ?? true),
            'includeSeoDescription' => $this->toBool($config['includeSeoDescription'] ?? true),
            'includeSeoKeywords' => $this->toBool($config['includeSeoKeywords'] ?? true),
        ];
    }

    /**
     * @param mixed $raw
     * @return array{mode:string,topN:int,forceUseCurrentValues:bool}
     */
    private function normalizeRelatedRowConfig(mixed $raw): array
    {
        $config = is_array($raw) ? $raw : [];
        $mode = strtolower(trim((string)($config['mode'] ?? 'topN')));
        if (!in_array($mode, ['all', 'topn'], true)) {
            $mode = 'topN';
        } elseif ($mode === 'topn') {
            $mode = 'topN';
        }

        $topN = (int)($config['topN'] ?? 25);
        $topN = max(1, min(500, $topN));

        return [
            'mode' => $mode,
            'topN' => $topN,
            'forceUseCurrentValues' => $this->toBool($config['forceUseCurrentValues'] ?? false),
        ];
    }

    /**
     * @param mixed $raw
     * @return array<string, array{mode:string,count:int}>
     */
    private function normalizeLinkRowConfig(mixed $raw): array
    {
        $config = is_array($raw) ? $raw : [];

        return [
            'entry' => $this->normalizeLinkTypeRowConfig($config['entry'] ?? null),
            'category' => $this->normalizeLinkTypeRowConfig($config['category'] ?? null),
            'asset' => $this->normalizeLinkTypeRowConfig($config['asset'] ?? null),
        ];
    }

    /**
     * @param mixed $raw
     * @return array{mode:string,count:int}
     */
    private function normalizeLinkTypeRowConfig(mixed $raw): array
    {
        $config = is_array($raw) ? $raw : [];
        $mode = strtolower(trim((string)($config['mode'] ?? 'topN')));
        if (!in_array($mode, ['topn', 'mostrecent', 'all', 'none'], true)) {
            $mode = 'topN';
        } else {
            $mode = match ($mode) {
                'topn' => 'topN',
                'mostrecent' => 'mostRecent',
                default => $mode,
            };
        }

        $count = (int)($config['count'] ?? 10);
        if ($count <= 0) {
            return [
                'mode' => 'none',
                'count' => 0,
            ];
        }

        $count = min(250, $count);

        return [
            'mode' => $mode,
            'count' => $count,
        ];
    }

    /**
     * Ensures fields already selected in saved rows remain selectable, even if discovery omitted them.
     *
     * @param array<int, array<string, mixed>> $supportedFields
     * @return array<int, array<string, mixed>>
     */
    private function mergeMissingSelectedFields(array $supportedFields): array
    {
        $uidsToEnsure = [];
        foreach ($this->rows as $row) {
            $uid = trim((string)($row['targetFieldUid'] ?? ''));
            if ($uid !== '') {
                $uidsToEnsure[$uid] = true;
            }
        }

        foreach ($this->contextRows as $row) {
            $uid = trim((string)($row['fieldUid'] ?? ''));
            if ($uid !== '') {
                $uidsToEnsure[$uid] = true;
            }
        }

        if ($uidsToEnsure === []) {
            return $supportedFields;
        }

        $existingByUid = [];
        foreach ($supportedFields as $fieldMeta) {
            $uid = trim((string)($fieldMeta['uid'] ?? ''));
            if ($uid !== '') {
                $existingByUid[$uid] = true;
            }
        }

        $adapterService = AutofillPlugin::getInstance()->getFieldAdapterService();

        foreach (array_keys($uidsToEnsure) as $uid) {
            if (isset($existingByUid[$uid])) {
                continue;
            }

            $field = AutofillPlugin::getInstance()
                ->getEntryTypeFieldResolverService()
                ->resolveByEntryTypeUid($this->entryTypeUid, $uid);
            if (!$field instanceof FieldInterface) {
                continue;
            }

            $adapter = $adapterService->getAdapterForField($field);
            if ($adapter === null) {
                continue;
            }

            $supportedFields[] = AutofillPlugin::getInstance()
                ->getFieldDiscoveryService()
                ->describeSupportedField($field, $adapter->getKey(), $adapter->isAvailableInLiteVersion());
            $existingByUid[$uid] = true;
        }

        return $supportedFields;
    }

    private function shouldBlockProOnlyFieldUid(string $fieldUid): bool
    {
        if ($fieldUid === '' || AutofillPlugin::getInstance()->isProEdition()) {
            return false;
        }

        return !$this->isFieldUidAvailableInLiteVersion($fieldUid)
            && !$this->fieldUidWasAlreadySelected($fieldUid);
    }

    private function isFieldUidAvailableInLiteVersion(string $fieldUid): bool
    {
        if (str_starts_with($fieldUid, '__native__:')) {
            return true;
        }

        $field = AutofillPlugin::getInstance()
            ->getEntryTypeFieldResolverService()
            ->resolveByEntryTypeUid($this->entryTypeUid, $fieldUid);
        if (!$field instanceof FieldInterface) {
            return true;
        }

        $adapter = AutofillPlugin::getInstance()->getFieldAdapterService()->getAdapterForField($field);
        if ($adapter === null) {
            return true;
        }

        return $adapter->isAvailableInLiteVersion();
    }

    private function fieldUidWasAlreadySelected(string $fieldUid): bool
    {
        $oldSettings = $this->oldSettings ?? null;
        if (!is_array($oldSettings)) {
            return false;
        }

        foreach (($oldSettings['rows'] ?? []) as $row) {
            if (is_array($row) && (string)($row['targetFieldUid'] ?? '') === $fieldUid) {
                return true;
            }
        }

        foreach (($oldSettings['contextRows'] ?? []) as $row) {
            if (is_array($row) && (string)($row['fieldUid'] ?? '') === $fieldUid) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param array<int, array<string, mixed>> $rows
     * @return array<int, array<string, mixed>>
     */
    private function canonicalizeRowFieldSelections(array $rows): array
    {
        $resolver = AutofillPlugin::getInstance()->getEntryTypeFieldResolverService();

        foreach ($rows as $index => $row) {
            $targetFieldUid = trim((string)($row['targetFieldUid'] ?? ''));
            if ($targetFieldUid === '') {
                continue;
            }

            $rows[$index]['targetFieldUid'] = $resolver->canonicalizeByEntryTypeUid($this->entryTypeUid, $targetFieldUid);
        }

        return $rows;
    }

    /**
     * @param array<int, array<string, mixed>> $rows
     * @return array<int, array<string, mixed>>
     */
    private function canonicalizeContextFieldSelections(array $rows): array
    {
        $resolver = AutofillPlugin::getInstance()->getEntryTypeFieldResolverService();

        foreach ($rows as $index => $row) {
            $fieldUid = trim((string)($row['fieldUid'] ?? ''));
            if ($fieldUid === '') {
                continue;
            }

            $rows[$index]['fieldUid'] = $resolver->canonicalizeByEntryTypeUid($this->entryTypeUid, $fieldUid);
        }

        return $rows;
    }
}
