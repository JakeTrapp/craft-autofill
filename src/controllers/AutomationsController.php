<?php

declare(strict_types=1);

namespace jtdev\craftautofill\controllers;

use Craft;
use craft\elements\User;
use craft\helpers\Cp;
use craft\helpers\Html;
use craft\helpers\UrlHelper;
use craft\web\Controller;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\helpers\ErrorMessage;
use jtdev\craftautofill\models\Automation;
use jtdev\craftautofill\models\Workflow;
use Throwable;
use yii\web\ForbiddenHttpException;
use yii\web\NotFoundHttpException;
use yii\web\Response;

class AutomationsController extends Controller
{
    public function actionIndex(): Response
    {
        $actor = $this->authorize();
        $plugin = AutofillPlugin::getInstance();
        $service = $plugin->getAutomationService();
        $workflows = $plugin->getWorkflowService();
        $rows = [];
        $hasSchedule = false;
        foreach ($service->getAll() as $automation) {
            if (!$service->canManage($automation, $actor)) {
                continue;
            }
            $workflow = $workflows->getById((int)$automation->workflowId);
            $hasSchedule = $hasSchedule || ($automation->hasSchedule() && $automation->isActive());
            $rows[] = [
                'automation' => $automation,
                'workflow' => $workflow,
                'triggers' => $service->describeTriggers($automation, $workflow),
                'owner' => $automation->ownerId ? Craft::$app->getUsers()->getUserById($automation->ownerId) : null,
                'icon' => Cp::iconSvg($workflow ? $this->scopeIconName($workflow) : 'triangle-exclamation', null, match (true) {
                    $workflow === null => Craft::t('autofill', 'Unavailable workflow'),
                    $workflow->scope === 'asset' => Craft::t('app', 'Assets'),
                    default => Craft::t('app', 'Entries'),
                }),
            ];
        }
        $access = $plugin->getWorkflowAccess();
        $available = array_values(array_filter($workflows->getAll(), static fn(Workflow $workflow): bool =>
            !$workflow->archived && $access->canView($workflow, $actor) && $access->canConfigureScope($workflow, $actor)));
        $newItems = array_map(static fn(array $card): array => [
            'label' => $card['workflow']->name,
            'description' => $card['scopeName'],
            'icon' => $card['iconName'],
            'url' => UrlHelper::cpUrl('autofill/automations/new', ['workflow' => $card['workflow']->handle]),
        ], $this->workflowCards($available));
        return $this->renderTemplate('autofill/cp/automations/index', [
            'rows' => $rows,
            'newItems' => $newItems,
            'canCreate' => $service->canCreate($actor),
            'usingFallback' => $hasSchedule && $service->isUsingFallbackScheduler(),
        ]);
    }

    public function actionEdit(?int $automationId = null, ?Automation $automation = null): Response
    {
        $actor = $this->authorize();
        $plugin = AutofillPlugin::getInstance();
        $service = $plugin->getAutomationService();
        $access = $plugin->getWorkflowAccess();
        $request = Craft::$app->getRequest();

        if ($automation === null) {
            if ($automationId !== null) {
                $automation = $service->getById($automationId) ?? throw new NotFoundHttpException('Automation not found.');
            } else {
                $automation = new Automation(['siteIds' => [(int)Craft::$app->getSites()->getPrimarySite()->id]]);
            }
        }
        if ($automation->id !== null ? !$service->canManage($automation, $actor) : !$service->canCreate($actor)) {
            throw new ForbiddenHttpException('This automation is unavailable.');
        }

        $available = array_values(array_filter($plugin->getWorkflowService()->getAll(), static fn(Workflow $workflow): bool =>
            !$workflow->archived && $access->canView($workflow, $actor) && $access->canConfigureScope($workflow, $actor)));
        $handle = (string)$request->getQueryParam('workflow', '');
        if ($automation->id === null && $automation->workflowId === null && $handle === '' && count($available) === 1) {
            return $this->redirect(UrlHelper::cpUrl('autofill/automations/new', ['workflow' => $available[0]->handle]));
        }
        $workflow = null;
        if ($automation->workflowId !== null && ($automation->id !== null || $handle === '')) {
            $workflow = $plugin->getWorkflowService()->getById($automation->workflowId);
            // Never show details of a workflow this person can't see, e.g. after a failed save that named someone else's.
            if ($workflow !== null && !$access->canView($workflow, $actor)) {
                $workflow = null;
                $automation->workflowId = null;
            }
        }
        if ($handle !== '' && $automation->id === null) {
            foreach ($available as $candidate) {
                if ($candidate->handle === $handle) {
                    $workflow = $candidate;
                }
            }
        }

        $variables = [
            'automation' => $automation,
            'workflow' => $workflow,
            'workflowCards' => $workflow === null ? $this->workflowCards($available) : [],
            'canChangeWorkflow' => count($available) > 1,
            'isNew' => $automation->id === null,
        ];
        if ($workflow !== null) {
            if ($automation->id === null && $automation->workflowId === null) {
                $automation->workflowId = (int)$workflow->id;
                $automation->name = $automation->name ?: $workflow->name;
                $automation->onlyLive = $workflow->scope !== 'asset';
                $automation->fields['uids'] = array_values(array_column(array_filter($service->watchableFields($workflow), static fn(array $field): bool => $field['context']), 'uid'));
                $automation->events['delay'] = $automation->fields['delay'] = 5;
            }
            $condition = $service->condition($automation, $workflow);
            $condition->mainTag = 'div';
            $condition->name = 'condition';
            $condition->id = 'automation-condition';
            $condition->addRuleLabel = Craft::t('autofill', 'Add a rule');
            $sites = Craft::$app->getSites();
            $editableSiteIds = $actor->admin ? $sites->getAllSiteIds() : $sites->getEditableSiteIds();
            $siteOptions = [];
            foreach ($sites->getAllSites() as $site) {
                if (in_array((int)$site->id, $editableSiteIds, true)) {
                    $siteOptions[] = ['label' => $site->name, 'value' => (int)$site->id];
                }
            }
            $variables += [
                'conditionHtml' => $condition->getBuilderHtml(),
                'watchableFields' => $service->watchableFields($workflow),
                'siteOptions' => $siteOptions,
                'needsAcknowledgement' => ($hash = $service->automaticHash($workflow)) !== null && $hash !== $automation->acknowledgedAutomaticHash,
                'canChooseReviewer' => $workflow->visibility === 'private' && (bool)$actor->admin,
                'reviewer' => $automation->privateOwnerId ? Craft::$app->getUsers()->getUserById($automation->privateOwnerId) : null,
                'workflowOwner' => $workflow->ownerId ? Craft::$app->getUsers()->getUserById($workflow->ownerId) : null,
                'runAs' => $automation->runAsId ? Craft::$app->getUsers()->getUserById($automation->runAsId) : null,
                'owner' => $automation->ownerId ? Craft::$app->getUsers()->getUserById($automation->ownerId) : null,
                'automaticFields' => $service->automaticFieldNames($workflow),
                'scopeName' => $workflow->scope === 'asset'
                    ? Craft::$app->getVolumes()->getVolumeByUid($workflow->volumeUid)?->name
                    : Craft::$app->getEntries()->getEntryTypeByUid($workflow->entryTypeUid)?->name,
            ];
        }
        return $this->renderTemplate('autofill/cp/automations/edit', $variables);
    }

    public function actionSave(): ?Response
    {
        $this->requirePostRequest();
        $actor = $this->authorize();
        $plugin = AutofillPlugin::getInstance();
        $service = $plugin->getAutomationService();
        $request = Craft::$app->getRequest();
        $id = (int)$request->getBodyParam('automationId') ?: null;
        $previous = $id ? $service->getById($id) : null;
        if ($id && $previous === null) {
            throw new NotFoundHttpException('Automation not found.');
        }

        $workflow = $plugin->getWorkflowService()->getById((int)$request->getBodyParam('workflowId'));
        $schedule = (array)$request->getBodyParam('schedule', []);
        // Each frequency has its own interval input; keep the one for the chosen frequency.
        if (is_array($schedule['interval'] ?? null)) {
            $frequency = (string)($schedule['frequency'] ?? '');
            $schedule['interval'] = $schedule['interval'][$frequency === 'monthlyWeekday' ? 'monthly' : $frequency] ?? 1;
        }
        $reviewer = $request->getBodyParam('privateOwnerId');
        $reviewerId = is_array($reviewer) ? ((int)reset($reviewer) ?: null) : ((int)$reviewer ?: null);
        $limit = static fn(string $name): ?int => ($value = (int)$request->getBodyParam($name)) > 0 ? $value : null;
        // The editor shows content events and watched fields as one trigger with one delay.
        $changes = (array)$request->getBodyParam('changes', []);
        $changesOn = filter_var($changes['enabled'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $events = (array)$request->getBodyParam('events', []);
        $fields = (array)$request->getBodyParam('fields', []);
        $types = array_map('strval', (array)($events['types'] ?? []));
        $watch = in_array('fields', $types, true);
        $eventTypes = array_values(array_diff($types, ['fields']));
        $delay = (int)($changes['delay'] ?? 0);
        $automation = new Automation([
            'id' => $id,
            'ownerId' => $previous?->ownerId,
            'workflowId' => $workflow?->id,
            'name' => (string)$request->getBodyParam('name', ''),
            'enabled' => (bool)$request->getBodyParam('enabled', $previous?->enabled ?? true),
            'schedule' => $schedule + ['anchorDate' => $previous?->schedule['anchorDate'] ?? null],
            'events' => ['enabled' => $changesOn && ($eventTypes !== [] || !$watch), 'types' => $eventTypes, 'delay' => $delay],
            'fields' => ['enabled' => $changesOn && $watch, 'uids' => (array)($fields['uids'] ?? []), 'delay' => $delay],
            'siteIds' => (array)$request->getBodyParam('siteIds', $previous?->siteIds ?? [Craft::$app->getSites()->getPrimarySite()->id]),
            'userPrompt' => trim((string)$request->getBodyParam('userPrompt', '')),
            // Only administrators may choose a reviewer; everyone else keeps the saved one.
            'privateOwnerId' => $actor->admin ? $reviewerId : $previous?->privateOwnerId,
            'maxRuns' => $limit('maxRuns'),
            'maxItemsPerRun' => $limit('maxItemsPerRun'),
            'minMinutesBetweenRuns' => $limit('minMinutesBetweenRuns'),
            'acknowledgedAutomaticHash' => $previous?->acknowledgedAutomaticHash,
        ]);
        try {
            if ($workflow === null) {
                throw new \RuntimeException('Choose an available workflow.');
            }
            $automation->condition = $service->conditionFromPost($request->getBodyParam('condition'), $workflow);
            $automation->matchAny = $request->getBodyParam('matchAny') === '1';
            $automation->onlyLive = (bool)$request->getBodyParam('onlyLive');
            $saved = $service->save($automation, $actor, in_array($request->getBodyParam('confirmAutomatic'), ['1', 1, true, 'on'], true));
        } catch (Throwable $error) {
            $automation->addError('workflowId', ErrorMessage::forUser($error));
            $saved = false;
        }
        if (!$saved) {
            return $this->asModelFailure($automation, Craft::t('autofill', 'Couldn’t save the automation.'), 'automation');
        }
        return $this->asModelSuccess($automation, Craft::t('autofill', 'Automation saved.'), 'automation', [
            'id' => $automation->id,
        ], UrlHelper::cpUrl('autofill/automations'));
    }

    /** Turns automations on or off. Used by the list's bulk "Set Status" action and by JSON callers. */
    public function actionSetStatus(): ?Response
    {
        $this->requirePostRequest();
        $actor = $this->authorize();
        $enabled = $this->request->getRequiredBodyParam('status') === 'enabled';
        $service = AutofillPlugin::getInstance()->getAutomationService();
        $errors = [];
        $ids = $this->ids();
        foreach ($ids as $id) {
            try {
                $service->setEnabled($id, $enabled, $actor);
            } catch (Throwable $error) {
                $errors[] = ErrorMessage::forUser($error);
            }
        }
        if ($errors !== []) {
            return $this->asFailure(implode(' ', array_unique($errors)));
        }
        return $this->asSuccess($enabled
            ? Craft::t('autofill', '{count, plural, =1{Automation turned on. It now runs as you.} other{# automations turned on. They now run as you.}}', ['count' => count($ids)])
            : Craft::t('autofill', '{count, plural, =1{Automation turned off.} other{# automations turned off.}}', ['count' => count($ids)]));
    }

    public function actionRun(): ?Response
    {
        $this->requirePostRequest();
        $actor = $this->authorize();
        $service = AutofillPlugin::getInstance()->getAutomationService();
        $ids = $this->ids();
        try {
            foreach ($ids as $id) {
                $service->queueRun($id, $actor);
            }
        } catch (Throwable $error) {
            return $this->asFailure(ErrorMessage::forUser($error));
        }
        $details = count($ids) === 1
            ? ['details' => Html::a(Html::encode(Craft::t('autofill', 'View results')), UrlHelper::cpUrl('autofill/inbox', ['automation' => $ids[0]]))]
            : [];
        return $this->asSuccess(Craft::t('autofill', '{count, plural, =1{Run queued} other{# runs queued}}. Results appear in the inbox as they’re ready.', ['count' => count($ids)]), [], null, $details);
    }

    public function actionDelete(): ?Response
    {
        $this->requirePostRequest();
        $actor = $this->authorize();
        try {
            foreach ($this->ids() as $id) {
                AutofillPlugin::getInstance()->getAutomationService()->delete($id, $actor);
            }
        } catch (Throwable $error) {
            return $this->asFailure(ErrorMessage::forUser($error));
        }
        return $this->asSuccess(Craft::t('autofill', 'Automation deleted.'));
    }

    /** @return int[] IDs from `ids[]` (admin table actions) or `id`. */
    private function ids(): array
    {
        $ids = $this->request->getBodyParam('ids') ?? [$this->request->getRequiredBodyParam('id')];
        return array_values(array_unique(array_filter(array_map('intval', (array)$ids))));
    }

    private function authorize(): User
    {
        $this->requireCpRequest();
        $this->requirePermission('accessPlugin-autofill');
        $actor = Craft::$app->getUser()->getIdentity();
        if (!$actor instanceof User || !AutofillPlugin::getInstance()->getAutomationService()->canAccessSection($actor)) {
            throw new ForbiddenHttpException('Automations require Autofill Pro and permission to manage automations.');
        }
        return $actor;
    }

    private function scopeIconName(Workflow $workflow): string
    {
        if ($workflow->scope === 'asset') {
            return 'image';
        }
        return Craft::$app->getEntries()->getEntryTypeByUid($workflow->entryTypeUid)?->icon ?: 'newspaper';
    }

    /** @param Workflow[] $workflows */
    private function workflowCards(array $workflows): array
    {
        $cards = [];
        foreach ($workflows as $workflow) {
            $iconName = $this->scopeIconName($workflow);
            $scopeName = $workflow->scope === 'asset'
                ? Craft::$app->getVolumes()->getVolumeByUid($workflow->volumeUid)?->name
                : Craft::$app->getEntries()->getEntryTypeByUid($workflow->entryTypeUid)?->name;
            $cards[] = ['workflow' => $workflow, 'scopeName' => $scopeName, 'icon' => Cp::iconSvg($iconName), 'iconName' => $iconName];
        }
        return $cards;
    }
}
