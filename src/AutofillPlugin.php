<?php

namespace jtdev\craftautofill;

use Craft;
use craft\base\Model;
use craft\base\Plugin;
use craft\events\EntryTypeEvent;
use craft\events\RegisterComponentTypesEvent;
use craft\events\RegisterUrlRulesEvent;
use craft\helpers\App;
use craft\models\EntryType;
use craft\services\Entries;
use craft\services\Fields;
use craft\web\UrlManager;
use jtdev\craftautofill\fields\AutofillField;
use jtdev\craftautofill\models\Settings;
use jtdev\craftautofill\services\ai\AiRequestLogService;
use jtdev\craftautofill\services\ai\AiService;
use jtdev\craftautofill\services\entries\BulkAutofillService;
use jtdev\craftautofill\services\entries\EntrySuggestionApplyService;
use jtdev\craftautofill\services\fields\EntryTypeFieldResolverService;
use jtdev\craftautofill\services\fields\FieldAdapterService;
use jtdev\craftautofill\services\fields\FieldDiscoveryService;
use RuntimeException;
use yii\base\Event;
use yii\base\ModelEvent;

/**
 * Autofill plugin
 *
 * @method static AutofillPlugin getInstance()
 * @method Settings getSettings()
 * @method AiRequestLogService getAiRequestLogService()
 * @method AiService getAiService()
 * @method BulkAutofillService getBulkAutofillService()
 * @method EntrySuggestionApplyService getEntrySuggestionApplyService()
 * @method FieldAdapterService getFieldAdapterService()
 * @method FieldDiscoveryService getFieldDiscoveryService()
 * @method EntryTypeFieldResolverService getEntryTypeFieldResolverService()
 * @author JTDev <jake.trapp02@gmail.com>
 * @copyright JTDev
 * @license https://craftcms.github.io/license/ Craft License
 */
class AutofillPlugin extends Plugin
{
    public const EDITION_LITE = 'lite';
    public const EDITION_PRO = 'pro';

    public string $schemaVersion = '2.1.3';
    public bool $hasCpSettings = true;
    public bool $hasCpSection = true;

    public static function editions(): array
    {
        return [
            self::EDITION_LITE,
            self::EDITION_PRO,
        ];
    }

    public static function config(): array
    {
        return [
            'components' => [
                'workflowRunService' => \jtdev\craftautofill\services\workflows\WorkflowRunService::class,
                'workflowAccess' => \jtdev\craftautofill\services\permissions\WorkflowAccess::class,
                'workflowService' => \jtdev\craftautofill\services\workflows\WorkflowService::class,
                'workflowRuntimeService' => \jtdev\craftautofill\services\workflows\WorkflowRuntimeService::class,
                'aiRequestLogService' => AiRequestLogService::class,
                'aiService' => AiService::class,
                'bulkAutofillService' => BulkAutofillService::class,
                'entrySuggestionApplyService' => EntrySuggestionApplyService::class,
                'fieldAdapterService' => FieldAdapterService::class,
                'fieldDiscoveryService' => FieldDiscoveryService::class,
                'entryTypeFieldResolverService' => EntryTypeFieldResolverService::class,
            ],
        ];
    }

    public function init(): void
    {
        parent::init();

        $this->attachEventHandlers();

        // Any code that creates an element query or loads Twig should be deferred until
        // after Craft is fully initialized, to avoid conflicts with other plugins/modules
        Craft::$app->onInit(function() {
            $request = Craft::$app->getRequest();
            if (!$request->getIsConsoleRequest() && $request->getIsCpRequest() && !$request->getIsAjax()) {
                $actor = Craft::$app->getUser()->getIdentity();
                if ($actor && ($actor->admin || $actor->can('accessPlugin-autofill'))) {
                    Craft::$app->getView()->registerJs(Craft::$app->getView()->renderTemplate('autofill/cp/_notifications.js', [
                        'actorId' => (int)$actor->id, 'isPro' => $this->isProEdition(),
                    ]));
                }
            }
        });
    }

    protected function createSettingsModel(): ?Model
    {
        return Craft::createObject(Settings::class);
    }

    protected function settingsHtml(): ?string
    {
        $this->hydrateServerEnvKeysForAutosuggest();
        $settings = $this->getSettings();

        return Craft::$app->view->renderTemplate('autofill/_settings.twig', [
            'plugin' => $this,
            'settings' => $settings,
        ]);
    }

    public function getWorkflowRunService(): \jtdev\craftautofill\services\workflows\WorkflowRunService
    {
        return $this->get('workflowRunService');
    }

    public function getWorkflowAccess(): \jtdev\craftautofill\services\permissions\WorkflowAccess
    {
        return $this->get('workflowAccess');
    }

    public function getWorkflowService(): \jtdev\craftautofill\services\workflows\WorkflowService
    {
        return $this->get('workflowService');
    }

    public function getWorkflowRuntimeService(): \jtdev\craftautofill\services\workflows\WorkflowRuntimeService
    {
        return $this->get('workflowRuntimeService');
    }

    public function getAiService(): AiService
    {
        return $this->get('aiService');
    }

    public function getAiRequestLogService(): AiRequestLogService
    {
        return $this->get('aiRequestLogService');
    }

    public function getBulkAutofillService(): BulkAutofillService
    {
        return $this->get('bulkAutofillService');
    }

    public function getFieldAdapterService(): FieldAdapterService
    {
        return $this->get('fieldAdapterService');
    }

    public function getEntrySuggestionApplyService(): EntrySuggestionApplyService
    {
        return $this->get('entrySuggestionApplyService');
    }

    public function getFieldDiscoveryService(): FieldDiscoveryService
    {
        return $this->get('fieldDiscoveryService');
    }

    public function getEntryTypeFieldResolverService(): EntryTypeFieldResolverService
    {
        return $this->get('entryTypeFieldResolverService');
    }

    public function getCpNavItem(): ?array
    {
        $item = parent::getCpNavItem();
        if ($item === null) {
            return null;
        }

        $item['url'] = 'autofill';
        $item['subnav'] = [
            'bulk' => [
                'label' => Craft::t('autofill', 'Bulk Autofill'),
                'url' => 'autofill/bulk',
            ],
            'logs' => [
                'label' => Craft::t('autofill', 'Logs'),
                'url' => 'autofill/logs',
            ],
        ];

        $actor = Craft::$app->getUser()->getIdentity();
        if ($this->isProEdition()) {
            $readyCount = $actor ? $this->getWorkflowRunService()->actionableCount($actor) : 0;
            $item['badgeCount'] = $readyCount;
            $item['subnav'] = ['inbox' => ['label' => 'Inbox', 'url' => 'autofill/inbox', 'badgeCount' => $readyCount]] + $item['subnav'];
        } else {
            unset($item['subnav']['bulk']);
        }
        if ($actor && !$this->getWorkflowAccess()->can($actor, 'bulk')) unset($item['subnav']['bulk']);
        if (!Craft::$app->getUser()->getIsAdmin()) unset($item['subnav']['logs']);
        if (Craft::$app->getUser()->getIdentity() !== null) {
            $item['subnav'] = ['workflows' => ['label' => 'Workflows', 'url' => 'autofill/workflows']] + $item['subnav'];
        }
        return $item;
    }

    public function isProEdition(): bool
    {
        return $this->is(self::EDITION_PRO);
    }

    /**
     * @return array<int, array{label:string,data:array<int, array{name:string,hint:string}>}>
     */
    public function getEnvSuggestionsForAutosuggest(): array
    {
        $this->hydrateServerEnvKeysForAutosuggest();

        $security = Craft::$app->getSecurity();
        $suggestions = [];

        foreach (array_keys($_SERVER) as $key) {
            if (!is_string($key) || $key === '' || str_starts_with($key, 'HTTP_')) {
                continue;
            }

            $value = App::env($key);
            if (!is_scalar($value)) {
                continue;
            }

            $suggestions[$key] = [
                'name' => '$' . $key,
                'hint' => $security->redactIfSensitive($key, Craft::getAlias((string)$value, false)),
            ];
        }

        ksort($suggestions, SORT_NATURAL | SORT_FLAG_CASE);

        return [
            [
                'label' => Craft::t('app', 'Environment Variables'),
                'data' => array_values($suggestions),
            ],
        ];
    }

    private function attachEventHandlers(): void
    {
        Event::on(\craft\services\UserPermissions::class, \craft\services\UserPermissions::EVENT_REGISTER_PERMISSIONS,
            static function(\craft\events\RegisterUserPermissionsEvent $event): void {
                $event->permissions[] = [
                    'heading' => 'Autofill',
                    'permissions' => \jtdev\craftautofill\services\permissions\WorkflowAccess::permissionDefinitions(),
                ];
            }
        );
        Event::on(\craft\base\Element::class, \craft\base\Element::EVENT_DEFINE_SIDEBAR_HTML,
            static function(\craft\events\DefineHtmlEvent $event): void {
                $element = $event->sender;
                if ($event->static || (!$element instanceof \craft\elements\Entry && !$element instanceof \craft\elements\Asset)) {
                    return;
                }
                $plugin = self::getInstance();
                $actor = Craft::$app->getUser()->getIdentity();
                if ($actor === null) return;
                $rendered = [];
                $sidebarHtml = '';
                // Inbox links reopen the exact saved run on its original editor,
                // even if the live workflow is archived or no longer attached.
                $requestedRunId = (int)Craft::$app->getRequest()->getQueryParam('autofillRun', 0);
                if ($requestedRunId && $element->id && Craft::$app->getDb()->tableExists(\jtdev\craftautofill\records\WorkflowRunRecord::tableName())) {
                    $service = $plugin->getWorkflowRunService();
                    $run = \jtdev\craftautofill\records\WorkflowRunRecord::findOne($requestedRunId);
                    if ($run && (int)$run->elementId === (int)$element->id && (int)$run->siteId === (int)$element->siteId && $service->canView($run, $actor)) {
                        $snapshot = new \jtdev\craftautofill\models\Workflow(\craft\helpers\Json::decode($run->definitionJson));
                        $snapshot->showUserPromptInput = false;
                        $rendered[$run->workflowId] = true;
                        $sidebarHtml .= Craft::$app->getView()->renderTemplate('autofill/fields/autofill/input', [
                            'field' => $plugin->getWorkflowService()->asField($snapshot), 'element' => $element,
                            'sidebar' => true, 'workflowDescription' => $snapshot->description,
                            'testMode' => false, 'selectedRunId' => (int)$run->id,
                            'autoOpenReview' => true, 'inboxReview' => true,
                            'nextReviewRunId' => $service->nextForReview($run, $actor)?->id,
                        ]);
                    }
                }
                foreach ($plugin->getWorkflowService()->getAll() as $workflow) {
                    if ($workflow->archived || isset($rendered[$workflow->id])) {
                        continue;
                    }
                    try {
                        $plugin->getWorkflowRuntimeService()->assertScope($workflow, $element);
                        $plugin->getWorkflowRuntimeService()->assertCanSave($element);
                        $actor = Craft::$app->getUser()->getIdentity();
                        if ($actor === null) continue;
                        $plugin->getWorkflowAccess()->assertCanRun($workflow, $element, $actor);
                    } catch (\Throwable) {
                        continue;
                    }
                    foreach ($element->getFieldLayout()?->getCustomFields() ?? [] as $inlineField) {
                        if ($inlineField instanceof AutofillField && $inlineField->workflowHandle === $workflow->handle) $rendered[$workflow->id] = true;
                    }
                    if (!$workflow->showOnSidebar) continue;
                    $rendered[$workflow->id] = true;
                    $field = $plugin->getWorkflowService()->asField($workflow);
                    $sidebarHtml .= Craft::$app->getView()->renderTemplate('autofill/fields/autofill/input', [
                        'field' => $field, 'element' => $element, 'sidebar' => true,
                        'workflowDescription' => $workflow->description, 'testMode' => $plugin->getSettings()->testMode,
                    ]);
                }
                if ($element->id && Craft::$app->getDb()->tableExists(\jtdev\craftautofill\records\WorkflowRunRecord::tableName())) {
                    foreach ($plugin->getWorkflowRunService()->pendingForElement((int)$element->id, (int)$element->siteId, $actor) as $run) {
                        if (isset($rendered[$run->workflowId])) continue;
                        $snapshot = new \jtdev\craftautofill\models\Workflow(\craft\helpers\Json::decode($run->definitionJson));
                        $snapshot->showUserPromptInput = false;
                        $rendered[$run->workflowId] = true;
                        $sidebarHtml .= Craft::$app->getView()->renderTemplate('autofill/fields/autofill/input', [
                            'field' => $plugin->getWorkflowService()->asField($snapshot), 'element' => $element,
                            'sidebar' => true, 'workflowDescription' => $snapshot->description,
                            'testMode' => false, 'selectedRunId' => (int)$run->id,
                        ]);
                    }
                }
                if ($sidebarHtml !== '') {
                    $event->html .= Craft::$app->getView()->renderTemplate('autofill/cp/_sidebar', ['content' => $sidebarHtml]);
                }
            }
        );
        Event::on(
            UrlManager::class,
            UrlManager::EVENT_REGISTER_CP_URL_RULES,
            static function(RegisterUrlRulesEvent $event): void {
                $event->rules['autofill'] = 'autofill/workflows/root';
                $event->rules['autofill/workflows'] = 'autofill/workflows/index';
                $event->rules['autofill/workflows/new'] = 'autofill/workflows/edit';
                $event->rules['autofill/workflows/edit/<handle:[a-zA-Z][a-zA-Z0-9_-]*>'] = 'autofill/workflows/edit';
                $event->rules['autofill/workflows/<handle:[a-zA-Z][a-zA-Z0-9_-]*>'] = 'autofill/workflows/edit';
                $event->rules['autofill/inbox'] = 'autofill/inbox/index';
                $event->rules['autofill/inbox/<runId:\d+>'] = 'autofill/inbox/review';
                $event->rules['autofill/bulk'] = 'autofill/bulk/index';
                $event->rules['autofill/logs'] = 'autofill/logs/index';
            }
        );

        // Craft's garbage collection also fails runs whose queue worker died, so they don't block new runs.
        Event::on(\craft\services\Gc::class, \craft\services\Gc::EVENT_RUN, static function(): void {
            self::getInstance()->getWorkflowRunService()->failStaleRuns();
        });

        Event::on(
            Fields::class,
            Fields::EVENT_REGISTER_FIELD_TYPES,
            static function(RegisterComponentTypesEvent $event): void {
                $event->types[] = AutofillField::class;
            }
        );

        Event::on(
            EntryType::class,
            EntryType::EVENT_BEFORE_VALIDATE,
            static function(ModelEvent $event): void {
                $entryType = $event->sender;
                if (!$entryType instanceof EntryType) {
                    return;
                }

                self::addAutofillEntryTypeCompatibilityErrors($entryType);
            }
        );

        Event::on(
            Entries::class,
            Entries::EVENT_BEFORE_SAVE_ENTRY_TYPE,
            static function(EntryTypeEvent $event): void {
                $messages = self::addAutofillEntryTypeCompatibilityErrors($event->entryType);
                if ($messages !== []) {
                    throw new RuntimeException(implode(' ', $messages));
                }
            }
        );
    }

    /**
     * @return string[]
     */
    private static function addAutofillEntryTypeCompatibilityErrors(EntryType $entryType): array
    {
        $expectedEntryTypeUid = trim((string)($entryType->uid ?? ''));
        if ($expectedEntryTypeUid === '') {
            return [];
        }

        $fieldLayout = $entryType->getFieldLayout();
        $messages = [];
        foreach ($fieldLayout->getCustomFields() as $field) {
            if (!$field instanceof AutofillField) {
                continue;
            }

            if ($field->workflowHandle !== '') {
                $workflow = self::getInstance()->getWorkflowService()->getByHandle($field->workflowHandle);
                if ($workflow === null) {
                    continue;
                }
                $configuredEntryTypeUid = $workflow->scope === 'entry' ? $workflow->entryTypeUid : '__asset__';
            } else {
                $configuredEntryTypeUid = trim($field->entryTypeUid);
            }
            if ($configuredEntryTypeUid === $expectedEntryTypeUid) {
                continue;
            }

            $fieldLabel = trim((string)($field->name ?? ''));
            $message = $fieldLabel !== ''
                ? sprintf(
                    'Autofill field "%s" is configured for a different entry type and cannot be added here.',
                    $fieldLabel
                )
                : 'An Autofill field is configured for a different entry type and cannot be added here.';

            $messages[] = $message;

            if (!in_array($message, $entryType->getErrors('fieldLayout'), true)) {
                $entryType->addError('fieldLayout', $message);
            }

            if (!in_array($message, $fieldLayout->getErrors('customFields'), true)) {
                $fieldLayout->addError('customFields', $message);
            }
        }

        return $messages;
    }

    /**
     * Craft's env autosuggest sources variables from $_SERVER keys.
     * Mirror keys from other env sources so plugin settings autosuggest is reliable.
     */
    private function hydrateServerEnvKeysForAutosuggest(): void
    {
        $candidates = [];

        if (is_array($_ENV)) {
            foreach ($_ENV as $key => $value) {
                if (!is_string($key) || $key === '' || !is_scalar($value)) {
                    continue;
                }
                $candidates[$key] = (string)$value;
            }
        }

        $all = getenv();
        if (is_array($all)) {
            foreach ($all as $key => $value) {
                if (!is_string($key) || $key === '' || !is_scalar($value)) {
                    continue;
                }
                $candidates[$key] = (string)$value;
            }
        }

        foreach ($candidates as $key => $value) {
            if (!array_key_exists($key, $_SERVER)) {
                $_SERVER[$key] = $value;
            }
        }
    }
}
