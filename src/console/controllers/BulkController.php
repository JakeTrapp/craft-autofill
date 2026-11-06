<?php

declare(strict_types=1);

namespace jtdev\craftautofill\console\controllers;

use Craft;
use craft\console\Controller;
use craft\elements\Asset;
use craft\elements\Entry;
use craft\elements\User;
use craft\helpers\StringHelper;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\fields\AutofillField;
use jtdev\craftautofill\records\WorkflowRunRecord;
use RuntimeException;
use Throwable;
use yii\console\ExitCode;

class BulkController extends Controller
{
    public ?int $fieldId = null;
    public ?string $fieldSlug = null;
    public ?string $workflow = null;
    public ?string $user = null;
    public string $entryIds = '';
    public string $elementIds = '';
    public ?int $siteId = null;
    public string $userPrompt = '';
    public bool $runNow = false;
    public bool $confirmAutomatic = false;

    public function options($actionID): array
    {
        return array_merge(parent::options($actionID), ['fieldId', 'fieldSlug', 'workflow', 'user', 'entryIds', 'elementIds', 'siteId', 'userPrompt', 'runNow', 'confirmAutomatic']);
    }

    /** Both workflow handles and legacy field identifiers use the same review lifecycle. */
    public function actionRun(): int
    {
        $plugin = AutofillPlugin::getInstance();
        $previous = Craft::$app->getUser()->getIdentity();
        try {
            if (!$plugin->isProEdition()) throw new RuntimeException('Bulk Autofill requires Autofill Pro.');
            if (!$this->user) throw new RuntimeException('Specify --user with the ID, username or email of the user authorizing this run.');
            $actor = ctype_digit($this->user) ? Craft::$app->getUsers()->getUserById((int)$this->user) : Craft::$app->getUsers()->getUserByUsernameOrEmail($this->user);
            if (!$actor || $actor->getStatus() !== User::STATUS_ACTIVE) throw new RuntimeException('Select an active initiating user.');
            Craft::$app->getUser()->setIdentity($actor);
            if (!$plugin->getWorkflowAccess()->can($actor, 'bulk')) throw new RuntimeException('This user cannot run bulk Autofill.');
            if ($this->workflow && ($this->fieldId || $this->fieldSlug)) throw new RuntimeException('Use --workflow or a legacy field identifier, not both.');
            $handle = $this->workflow;
            if (!$handle) {
                if ($this->fieldId && $this->fieldSlug) throw new RuntimeException('Choose one field identifier.');
                $field = $this->fieldId ? Craft::$app->getFields()->getFieldById($this->fieldId) : Craft::$app->getFields()->getFieldByHandle((string)$this->fieldSlug);
                if (!$field instanceof AutofillField) throw new RuntimeException('Specify --workflow, --field-id or --field-slug.');
                $handle = $field->workflowHandle;
            }
            $workflow = $plugin->getWorkflowService()->getByHandle((string)$handle);
            if (!$workflow || $workflow->archived) throw new RuntimeException('The saved workflow is unavailable.');
            $automatic = array_filter($workflow->rows, static fn(array $row): bool => ($row['enabled'] ?? true) && ($row['requiresApproval'] ?? true) === false);
            if ($automatic && !$this->confirmAutomatic) throw new RuntimeException('This batch can apply fields without review. Pass --confirm-automatic=1 to acknowledge this.');
            $ids = $plugin->getBulkAutofillService()->parseEntryIds($this->elementIds ?: $this->entryIds);
            if ($ids === []) throw new RuntimeException('Provide --element-ids (or legacy --entry-ids).');
            $batch = StringHelper::UUID();
            $failed = 0;
            foreach ($ids as $id) {
                try {
                    $element = Craft::$app->getElements()->getElementById($id, $workflow->scope === 'asset' ? Asset::class : Entry::class, $this->siteId);
                    if (!$element) throw new RuntimeException('Content is unavailable.');
                    $run = $plugin->getWorkflowRunService()->start($workflow, $element, $actor, $this->userPrompt, $batch);
                    if ($this->runNow) {
                        $plugin->getWorkflowRunService()->process((int)$run->id);
                        $run = WorkflowRunRecord::findOne($run->id);
                        if ($run->status === 'failed') throw new RuntimeException($run->errorMessage);
                    }
                    $this->stdout(sprintf("[%s] %d: run %d\n", strtoupper($run->status), $id, $run->id));
                } catch (Throwable $error) {
                    $failed++;
                    $this->stderr(sprintf("[FAIL] %d: %s\n", $id, $error->getMessage()));
                }
            }
            return $failed ? ExitCode::UNSPECIFIED_ERROR : ExitCode::OK;
        } catch (Throwable $error) {
            $this->stderr($error->getMessage() . "\n");
            return ExitCode::UNSPECIFIED_ERROR;
        } finally {
            Craft::$app->getUser()->setIdentity($previous);
        }
    }
}
