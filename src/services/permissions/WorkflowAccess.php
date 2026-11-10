<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\permissions;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\elements\Asset;
use craft\elements\Entry;
use craft\elements\User;
use craft\models\FieldLayout;
use jtdev\craftautofill\models\Workflow;
use RuntimeException;

/** Workflow sharing never replaces Craft's content and field authorization. */
class WorkflowAccess extends Component
{
    public static function permissionDefinitions(): array
    {
        $labels = [
            'view' => 'View own workflows', 'viewOthers' => 'View other users’ public workflows',
            'create' => 'Create workflows', 'edit' => 'Edit own workflows',
            'editOthers' => 'Edit other users’ public workflows', 'run' => 'Run workflows',
            'bulk' => 'Run bulk Autofill', 'review' => 'Review and apply results',
            'reviewOthers' => 'Review other users’ public results',
            'automatic' => 'Configure automatic application', 'delete' => 'Archive own workflows',
            'deleteOthers' => 'Archive other users’ public workflows',
        ];
        $permissions = [];
        foreach ($labels as $key => $label) {
            $permissions['autofill-' . $key] = ['label' => $label];
        }
        return $permissions;
    }

    public function can(User $user, string $capability): bool
    {
        return (bool)$user->admin || ($user->can('accessPlugin-autofill') && $user->can('autofill-' . $capability));
    }

    public function owns(Workflow $workflow, User $user): bool
    {
        return $workflow->ownerId !== null && $workflow->ownerId === (int)$user->id;
    }

    public function canView(Workflow $workflow, User $user): bool
    {
        if ($user->admin) return true;
        return $this->owns($workflow, $user)
            ? $this->can($user, 'view')
            : $workflow->visibility === 'public' && $this->can($user, 'viewOthers');
    }

    public function canEdit(Workflow $workflow, User $user): bool
    {
        if ($user->admin) return true;
        if ($workflow->adminManaged || $workflow->archived || !$this->canView($workflow, $user)) return false;
        return $this->can($user, $this->owns($workflow, $user) ? 'edit' : 'editOthers');
    }

    public function assertCanRun(Workflow $workflow, ElementInterface $element, User $user): void
    {
        if (!$this->canView($workflow, $user) || !$this->can($user, 'run') || $workflow->archived) {
            throw new RuntimeException('You do not have permission to run this workflow.');
        }
        if (!Craft::$app->getElements()->canView($element, $user) || !Craft::$app->getElements()->canSave($element, $user)) {
            throw new RuntimeException('You do not have permission to change this content.');
        }
    }

    public function canConfigureScope(Workflow $workflow, User $user): bool
    {
        if ($user->admin) return true;
        if ($workflow->scope === 'asset') {
            $volume = Craft::$app->getVolumes()->getVolumeByUid($workflow->volumeUid);
            return $volume !== null && $user->can("viewAssets:$volume->uid") && ($user->can("saveAssets:$volume->uid") || $user->can("savePeerAssets:$volume->uid"));
        }
        foreach (Craft::$app->getEntries()->getAllSections() as $section) {
            foreach ($section->getEntryTypes() as $type) {
                if ((string)$type->uid === $workflow->entryTypeUid && $user->can("viewEntries:$section->uid") && $user->can("saveEntries:$section->uid")) {
                    return true;
                }
            }
        }
        return false;
    }

    /** Field conditions may depend on the actual content, so check again when a run executes. */
    public function canUseField(Workflow $workflow, string $uid, User $user, ?ElementInterface $element = null, bool $write = false): bool
    {
        if (str_starts_with($uid, '__native__:')) {
            $native = substr($uid, 11);
            // Craft 5 authorizes canonical and draft saves through the target element.
            // Do not invent a separate publishing permission that Craft does not expose.
            if ($write && $element !== null && !Craft::$app->getElements()->canSave($element, $user)) return false;
            return in_array($native, $workflow->scope === 'asset' ? ['title', 'alt'] : ['title', 'slug', 'enabled', 'postDate', 'expiryDate'], true);
        }
        if ($uid === '__asset__:file') return !$write && $workflow->scope === 'asset';
        $layout = $element?->getFieldLayout() ?? ($workflow->scope === 'asset'
            ? Craft::$app->getVolumes()->getVolumeByUid($workflow->volumeUid)?->getFieldLayout()
            : Craft::$app->getEntries()->getEntryTypeByUid($workflow->entryTypeUid)?->getFieldLayout());
        if ($layout === null) return false;
        $fields = $element === null ? $layout->getCustomFields() : $this->visibleCustomFields($layout, $element, $user);
        foreach ($fields as $field) {
            if ((string)($field->layoutElement->uid ?? $field->uid) !== $uid) continue;
            $layoutElement = $field->layoutElement;
            if ($layoutElement === null) return true;
            if ($element === null) {
                if ($user->admin) return true;
                $condition = $layoutElement->getUserCondition();
                if ($condition !== null && !$condition->matchElement($user)) return false;
                foreach ($layout->getTabs() as $tab) {
                    if (!in_array($layoutElement, $tab->getElements(), true)) continue;
                    $condition = $tab->getUserCondition();
                    if ($condition !== null && !$condition->matchElement($user)) return false;
                    break;
                }
            }
            if ($write && method_exists($layoutElement, 'getEditCondition')) {
                $condition = $layoutElement->getEditCondition();
                if ($condition !== null && !$condition->matchElement($user)) return false;
            }
            if ($write && $element !== null && method_exists($layoutElement, 'getElementEditCondition')) {
                $condition = $layoutElement->getElementEditCondition();
                if ($condition !== null && !$condition->matchElement($element)) return false;
            }
            return true;
        }
        return false;
    }

    private function visibleCustomFields(FieldLayout $layout, ElementInterface $element, User $user): array
    {
        $session = Craft::$app->getUser();
        $previous = $session->getIdentity();
        if ($previous === $user) return $layout->getVisibleCustomFields($element);

        $session->setIdentity($user);
        try {
            return $layout->getVisibleCustomFields($element);
        } finally {
            $session->setIdentity($previous);
        }
    }

    public function assertCanSave(Workflow $workflow, ?Workflow $previous, User $user): void
    {
        if ($previous === null ? !$this->can($user, 'create') : !$this->canEdit($previous, $user)) {
            throw new RuntimeException('You do not have permission to change this workflow.');
        }
        if (!$user->admin && ($workflow->ownerId !== ($previous?->ownerId ?? (int)$user->id)
            || $workflow->adminManaged !== ($previous?->adminManaged ?? false))) {
            throw new RuntimeException('Only administrators may transfer ownership or administrator protection.');
        }
        if (!$this->canConfigureScope($workflow, $user)) {
            throw new RuntimeException('You do not have permission to configure this content scope.');
        }
        foreach ($workflow->rows as $row) {
            if (!$this->canUseField($workflow, (string)($row['targetFieldUid'] ?? ''), $user, write: true)) {
                throw new RuntimeException('An output field is unavailable to you.');
            }
        }
        foreach ($workflow->contextRows as $row) {
            if (!$this->canUseField($workflow, (string)($row['fieldUid'] ?? ''), $user)) {
                throw new RuntimeException('A context field is unavailable to you.');
            }
        }
        if (!$this->can($user, 'automatic')) {
            $oldAutomatic = $this->automaticRows($previous?->rows ?? []);
            $newAutomatic = $this->automaticRows($workflow->rows);
            if ($oldAutomatic !== $newAutomatic) {
                throw new RuntimeException('Automatic output fields are read-only without permission to configure automatic application.');
            }
            // Protected rows must not be removed, converted to review-only, or reordered through another form.
            foreach ($oldAutomatic as $uid => $row) {
                $current = array_values(array_filter($workflow->rows, static fn(array $item): bool => ($item['targetFieldUid'] ?? '') === $uid));
                if (count($current) !== 1 || $current[0] != $row) {
                    throw new RuntimeException('Automatic output fields are read-only.');
                }
            }
            if ($oldAutomatic !== [] && [$workflow->scope, $workflow->entryTypeUid, $workflow->volumeUid] !== [$previous->scope, $previous->entryTypeUid, $previous->volumeUid]) {
                throw new RuntimeException('The scope of automatic output fields cannot be changed.');
            }
        }
    }

    private function automaticRows(array $rows): array
    {
        $result = [];
        foreach ($rows as $row) {
            if (array_key_exists('requiresApproval', $row) && !is_bool($row['requiresApproval'])) throw new RuntimeException('Review requirements must be booleans.');
            if (($row['requiresApproval'] ?? true) === false) $result[(string)($row['targetFieldUid'] ?? '')] = $row;
        }
        ksort($result);
        return $result;
    }
}
