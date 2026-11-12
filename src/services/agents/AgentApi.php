<?php

declare(strict_types=1);

namespace jtdev\craftautofill\services\agents;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\elements\Asset;
use craft\elements\Entry;
use craft\elements\User;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\helpers\UrlHelper;
use craft\models\EntryType;
use craft\models\Volume;
use jtdev\craftautofill\AutofillPlugin;
use jtdev\craftautofill\models\Workflow;
use jtdev\craftautofill\records\WorkflowRunRecord;
use RuntimeException;

/**
 * What AI agents can do with Autofill, independent of how they connect (Craft’s MCP server today).
 *
 * Agents work as the signed-in user, within Autofill’s permissions and edition limits, and refer to fields by handle.
 * People keep control of content: every output an agent creates requires review, agents can’t touch outputs that
 * apply automatically, and nothing here accepts, rejects or dismisses results waiting for review.
 */
class AgentApi extends Component
{
    public const MAX_ELEMENTS_PER_RUN = 25;

    private const OUTPUT_DEFAULTS = [
        'requiresApproval' => true,
        'includeCurrentFieldValue' => true,
        'overrideCurrentValue' => true,
        'enabled' => true,
        'seomatic' => ['includeSeoTitle' => true, 'includeSiteNamePosition' => true, 'includeSeoDescription' => true, 'includeSeoKeywords' => true],
        'related' => ['mode' => 'topN', 'topN' => 25, 'forceUseCurrentValues' => false],
        'link' => ['entry' => ['mode' => 'topN', 'count' => 10], 'category' => ['mode' => 'topN', 'count' => 10], 'asset' => ['mode' => 'topN', 'count' => 10]],
        'assets' => ['metadata' => ['title', 'filename'], 'includeFile' => false, 'maxFiles' => 3],
    ];

    /** Option groups that apply to each kind of field. Others are kept at their defaults and not shown. */
    private const OPTION_GROUPS = [
        'seomatic' => ['seomatic'],
        'categories' => ['related'],
        'entries' => ['related'],
        'tags' => ['related'],
        'link' => ['link'],
        'assets' => ['assets'],
    ];

    /**
     * Explains Autofill and what this user can do with it.
     *
     * @return array<string, mixed>
     */
    public function guide(User $actor): array
    {
        $plugin = AutofillPlugin::getInstance();
        $access = $plugin->getWorkflowAccess();
        $settings = $plugin->getSettings();
        $can = static fn(string $capability): bool => $access->can($actor, $capability);
        $visible = array_filter($plugin->getWorkflowService()->getAll(), static fn(Workflow $workflow): bool => !$workflow->archived && $access->canView($workflow, $actor));

        return [
            'about' => 'Autofill fills Craft entry and asset fields with AI suggestions. A workflow targets one entry type or asset volume. Its outputs are the fields the AI writes, each with its own instructions. Its context fields are read for information but never changed. Running a workflow on an entry or asset creates a run; when the run is ready, its results wait for a person to review, edit, accept or reject them in the control panel.',
            'howToStart' => [
                'Call autofill_targets_list to see which entry types and volumes you can configure.',
                'Call autofill_fields_list for a target to see which fields can be outputs or context, and the values they accept.',
                'Create a workflow with autofill_workflows_create, or adjust an existing one: read it with autofill_workflows_get, change what you need, and send it back with autofill_workflows_update.',
                'Find entries or assets to run on with Craft’s elements_list tool (for example criteria {"type": "<entry type handle>"}), then check your instructions with autofill_prompt_preview.',
                'Run it with autofill_run, then read results with autofill_runs_get. Share the reviewUrl so a person can review them.',
            ],
            'rules' => [
                'Every output you create requires review by a person before anything is saved to content. You can’t turn that off.',
                'Outputs that apply automatically were set up by a person. You can read them but not add, change or remove them.',
                $settings->allowAgentAutomaticOutputs
                    ? 'This site lets your runs apply outputs that are set to apply automatically, so those fields are saved to content without review.'
                    : 'On your runs, outputs that are set to apply automatically also wait for review. Nothing you run is saved to content until a person accepts it.',
                'You can’t accept, reject or dismiss results waiting for review. You can cancel runs you started while they’re still queued or running.',
                'Refer to fields by handle. Native fields are title, slug, enabled, postDate and expiryDate for entries, and title, alt and file (context only) for assets.',
                'Instructions you write are sent to the AI provider along with the content being filled.',
            ],
            'site' => [
                'edition' => $plugin->isProEdition() ? 'pro' : 'lite',
                'editionLimits' => $plugin->isProEdition() ? null : 'Autofill Lite allows one active workflow, runs one entry or asset at a time, and doesn’t support every field type. Fields marked liteAvailable: false need Autofill Pro.',
                'testMode' => $settings->testMode,
                'agentRunsApplyAutomaticOutputs' => $settings->allowAgentAutomaticOutputs,
                'models' => $this->models(),
                'activeWorkflows' => count($visible),
                'maxElementsPerRun' => $plugin->isProEdition() ? self::MAX_ELEMENTS_PER_RUN : 1,
            ],
            'you' => [
                'canCreateWorkflows' => $can('create'),
                'canEditWorkflows' => $can('edit') || $can('editOthers'),
                'canRunWorkflows' => $can('run'),
                'canRunOnSeveralItems' => $plugin->isProEdition() && $can('bulk'),
                'canArchiveWorkflows' => (bool)$actor->admin,
            ],
        ];
    }

    /**
     * Entry types and volumes the user can build workflows for.
     *
     * @return array{entryTypes: list<array<string, mixed>>, volumes: list<array<string, mixed>>}
     */
    public function targets(User $actor): array
    {
        $access = AutofillPlugin::getInstance()->getWorkflowAccess();
        $entryTypes = [];
        foreach (Craft::$app->getEntries()->getAllSections() as $section) {
            foreach ($section->getEntryTypes() as $type) {
                $probe = new Workflow(['scope' => 'entry', 'entryTypeUid' => (string)$type->uid]);
                if (!$access->canConfigureScope($probe, $actor)) {
                    continue;
                }
                $entryTypes[(string)$type->uid] ??= ['handle' => $type->handle, 'name' => $type->name, 'sections' => []];
                $entryTypes[(string)$type->uid]['sections'][] = ['handle' => $section->handle, 'name' => $section->name];
            }
        }
        $volumes = [];
        foreach (Craft::$app->getVolumes()->getAllVolumes() as $volume) {
            if ($access->canConfigureScope(new Workflow(['scope' => 'asset', 'volumeUid' => (string)$volume->uid]), $actor)) {
                $volumes[] = ['handle' => $volume->handle, 'name' => $volume->name];
            }
        }
        return ['entryTypes' => array_values($entryTypes), 'volumes' => $volumes];
    }

    /**
     * Fields of a target that a workflow can use, with what each accepts.
     *
     * @param array<string, mixed> $target
     * @return array<string, mixed>
     */
    public function fieldsFor(User $actor, array $target): array
    {
        $probe = $this->scopeFromTarget($target);
        if (!AutofillPlugin::getInstance()->getWorkflowAccess()->canConfigureScope($probe, $actor)) {
            throw new RuntimeException('You can’t configure workflows for this target.');
        }
        $pro = AutofillPlugin::getInstance()->isProEdition();
        $fields = [];
        foreach ($this->supportedFields($probe, $actor) as $field) {
            $fields[] = array_filter([
                'handle' => $field['handle'],
                'name' => $field['name'],
                'kind' => $field['adapter'],
                'canBeOutput' => !$field['contextOnly'],
                'canBeContext' => true,
                'liteAvailable' => $pro ? null : (bool)($field['availableInLiteVersion'] ?? true),
                'options' => $this->optionsFor((string)$field['adapter']) ?: null,
            ], static fn($value): bool => $value !== null);
        }
        return [
            'target' => $this->describeTarget($probe),
            'fields' => $fields,
            'optionGroups' => [
                'related' => 'For relation fields (entries, categories, tags): mode "topN" sends the topN best-matching candidates to the AI, "all" sends every candidate; forceUseCurrentValues keeps already selected items first.',
                'assets' => 'For Assets fields used as context: includeFile sends the file itself (images) to the AI, maxFiles (1–20) limits how many, metadata lists which attributes to include (title, filename, alt, size, dateCreated, or a custom field handle).',
                'link' => 'For Link fields: per link type (entry, category, asset), mode is "topN", "mostRecent", "all" or "none", with count.',
                'seomatic' => 'For SEOmatic fields: includeSeoTitle, includeSiteNamePosition, includeSeoDescription and includeSeoKeywords choose which parts the AI suggests.',
            ],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function workflows(User $actor, bool $includeArchived = false): array
    {
        $access = AutofillPlugin::getInstance()->getWorkflowAccess();
        $list = [];
        foreach (AutofillPlugin::getInstance()->getWorkflowService()->getAll() as $workflow) {
            if (($workflow->archived && !$includeArchived) || !$access->canView($workflow, $actor)) {
                continue;
            }
            $list[] = [
                'handle' => $workflow->handle,
                'name' => $workflow->name,
                'description' => $workflow->description,
                'target' => $this->describeTarget($workflow),
                'outputs' => count($workflow->rows),
                'archived' => $workflow->archived,
                'visibility' => $workflow->visibility,
            ];
        }
        return $list;
    }

    /**
     * A workflow in the same shape autofill_workflows_update accepts.
     *
     * @return array<string, mixed>
     */
    public function workflow(User $actor, string $handle): array
    {
        return $this->describe($this->viewableWorkflow($actor, $handle), $actor);
    }

    /**
     * @param array<string, mixed> $input
     * @return array<string, mixed>
     */
    public function createWorkflow(User $actor, array $input): array
    {
        $name = trim((string)($input['name'] ?? ''));
        if ($name === '') {
            throw new RuntimeException('Give the workflow a name.');
        }
        if (!isset($input['target']) || !is_array($input['target'])) {
            throw new RuntimeException('Choose a target: {"entryType": "<handle>"} or {"volume": "<handle>"}. See autofill_targets_list.');
        }
        $workflow = $this->scopeFromTarget($input['target']);
        $workflow->name = $name;
        $workflow->handle = trim((string)($input['handle'] ?? '')) ?: $this->uniqueHandle($name);
        $workflow->visibility = 'private';
        $this->apply($workflow, $input, $actor, null);

        return $this->save($workflow, $actor, 'created');
    }

    /**
     * @param array<string, mixed> $input
     * @return array<string, mixed>
     */
    public function updateWorkflow(User $actor, string $handle, array $input): array
    {
        $workflow = $this->viewableWorkflow($actor, $handle);
        if (!AutofillPlugin::getInstance()->getWorkflowAccess()->canEdit($workflow, $actor)) {
            throw new RuntimeException('You can’t edit this workflow.');
        }
        $previous = clone $workflow;
        if (array_key_exists('name', $input)) {
            $workflow->name = trim((string)$input['name']);
        }
        if (isset($input['target'])) {
            if (!is_array($input['target'])) {
                throw new RuntimeException('target must be {"entryType": "<handle>"} or {"volume": "<handle>"}.');
            }
            $scope = $this->scopeFromTarget($input['target']);
            [$workflow->scope, $workflow->entryTypeUid, $workflow->volumeUid] = [$scope->scope, $scope->entryTypeUid, $scope->volumeUid];
        }
        $this->apply($workflow, $input, $actor, $previous);

        return $this->save($workflow, $actor, 'updated');
    }

    /**
     * @return array<string, mixed>
     */
    public function setArchived(User $actor, string $handle, bool $archived): array
    {
        if (!$actor->admin) {
            throw new RuntimeException('Only administrators can archive or restore workflows.');
        }
        $workflow = $this->viewableWorkflow($actor, $handle, includeArchived: true);
        if (!AutofillPlugin::getInstance()->getWorkflowService()->setArchived((int)$workflow->id, $archived)) {
            throw new RuntimeException('The workflow’s archive status couldn’t be changed.');
        }
        return ['handle' => $workflow->handle, 'archived' => $archived];
    }

    /**
     * Starts runs. Results wait for a person to review them.
     *
     * @param list<int> $elementIds
     * @return array<string, mixed>
     */
    public function run(User $actor, string $handle, array $elementIds, ?int $siteId, string $instructions, bool $wait = false): array
    {
        $plugin = AutofillPlugin::getInstance();
        $workflow = $this->viewableWorkflow($actor, $handle);
        $elementIds = array_values(array_unique(array_filter(array_map('intval', $elementIds), static fn(int $id): bool => $id > 0)));
        if ($elementIds === []) {
            throw new RuntimeException('Provide at least one entry or asset ID.');
        }
        $several = count($elementIds) > 1;
        if ($several && (!$plugin->isProEdition() || !$plugin->getWorkflowAccess()->can($actor, 'bulk'))) {
            throw new RuntimeException($plugin->isProEdition()
                ? 'Running a workflow on several items needs the “Run bulk Autofill” permission. Run one item at a time.'
                : 'Autofill Lite runs one entry or asset at a time.');
        }
        if ($wait && $several) {
            throw new RuntimeException('wait only works when running one item.');
        }
        if (count($elementIds) > self::MAX_ELEMENTS_PER_RUN) {
            throw new RuntimeException(sprintf('Run at most %d items per call.', self::MAX_ELEMENTS_PER_RUN));
        }
        if ($instructions !== '' && !$workflow->showUserPromptInput) {
            throw new RuntimeException('This workflow doesn’t accept extra instructions per run. Leave instructions empty, or update the workflow’s instructions instead.');
        }

        $batchUid = $several ? StringHelper::UUID() : null;
        $type = $workflow->scope === 'asset' ? Asset::class : Entry::class;
        $runWorkflow = $this->forAgentRun($workflow);
        $runs = [];
        foreach ($elementIds as $id) {
            $element = Craft::$app->getElements()->getElementById($id, $type, $siteId);
            if ($element === null) {
                $runs[] = ['elementId' => $id, 'started' => false, 'error' => sprintf('No %s with ID %d was found.', $workflow->scope === 'asset' ? 'asset' : 'entry', $id)];
                continue;
            }
            try {
                $record = $plugin->getWorkflowRunService()->start($runWorkflow, $element, $actor, $instructions, $batchUid, deferQueue: $wait);
                if ($wait && $record->wasCreated) {
                    // Process this one run now so the caller gets its results in the same call.
                    $plugin->getWorkflowRunService()->process((int)$record->id);
                    return ['runs' => [['elementId' => $id, 'started' => true, 'run' => $this->runDetail($actor, (int)$record->id)]]];
                }
                $runs[] = ['elementId' => $id, 'started' => true, 'alreadyRunning' => !$record->wasCreated, 'run' => $this->runSummary($record, $element)];
            } catch (\Throwable $exception) {
                $runs[] = ['elementId' => $id, 'started' => false, 'error' => $exception->getMessage()];
            }
        }
        return [
            'runs' => $runs,
            'next' => 'Runs are processed by the Craft queue. Check progress with autofill_runs_get; a run that stays queued means the queue isn’t running. When a run is ready, a person reviews its results at reviewUrl.',
        ];
    }

    /**
     * @param array<string, mixed> $filters
     * @return list<array<string, mixed>>
     */
    public function runs(User $actor, array $filters): array
    {
        $service = AutofillPlugin::getInstance()->getWorkflowRunService();
        $query = WorkflowRunRecord::find()->orderBy(['id' => SORT_DESC]);
        if (!empty($filters['workflow'])) {
            $query->andWhere(['workflowId' => (int)$this->viewableWorkflow($actor, (string)$filters['workflow'], includeArchived: true)->id]);
        }
        if (!empty($filters['status'])) {
            $query->andWhere(['status' => (string)$filters['status']]);
        }
        if (!empty($filters['elementId'])) {
            $query->andWhere(['elementId' => (int)$filters['elementId']]);
        }
        $limit = max(1, min(100, (int)($filters['limit'] ?? 20)));
        $list = [];
        foreach ($query->each() as $record) {
            if (!$service->canView($record, $actor)) {
                continue;
            }
            $list[] = $this->runSummary($record);
            if (count($list) >= $limit) {
                break;
            }
        }
        return $list;
    }

    /**
     * A run with its results, as the reviewer sees them.
     *
     * @return array<string, mixed>
     */
    public function runDetail(User $actor, int $id): array
    {
        $service = AutofillPlugin::getInstance()->getWorkflowRunService();
        $record = WorkflowRunRecord::findOne($id);
        if ($record === null || !$service->canView($record, $actor)) {
            throw new RuntimeException('Run not found.');
        }
        $payload = $service->payload($record, $actor);
        $results = [];
        foreach ($payload['suggestions'] as $suggestion) {
            $results[] = array_filter([
                'field' => $suggestion['matchedHandle'] ?? null,
                'fieldName' => $suggestion['displayFieldName'] ?? $suggestion['fieldName'] ?? null,
                'state' => $suggestion['state'] ?? 'pending',
                'suggestedValue' => $suggestion['value'] ?? null,
                'problems' => !empty($suggestion['validationErrors']) ? $suggestion['validationErrors'] : null,
                'appliedHow' => $suggestion['applicationMode'] ?? null,
            ], static fn($value): bool => $value !== null);
        }
        return $this->runSummary($record) + array_filter([
            'results' => $results,
            // The content or workflow changed after this run started, so its results may be out of date.
            'changedSinceRun' => !empty($payload['stale']['outputs']) || !empty($payload['stale']['context']) ? $payload['stale'] : null,
            'stateMeanings' => 'pending: waiting for a person to review. applied: accepted (or applied automatically). rejected: a person rejected it. unchanged: already matched the saved value.',
        ], static fn($value): bool => $value !== null && $value !== []);
    }

    /**
     * @return array<string, mixed>
     */
    public function cancelRun(User $actor, int $id): array
    {
        $service = AutofillPlugin::getInstance()->getWorkflowRunService();
        $record = WorkflowRunRecord::findOne($id);
        if ($record === null || !$service->canView($record, $actor)) {
            throw new RuntimeException('Run not found.');
        }
        // Results waiting for review belong to the reviewers, so agents only stop work that hasn’t finished.
        if (!in_array($record->status, ['queued', 'running'], true)) {
            throw new RuntimeException('Only queued or running runs can be cancelled. Results waiting for review are handled by people in the control panel.');
        }
        return $this->runSummary($service->cancel($id, $actor));
    }

    /**
     * The exact prompt a run would send, for checking instructions without calling the AI.
     *
     * @return array{prompt: string}
     */
    public function previewPrompt(User $actor, string $handle, int $elementId, ?int $siteId, string $instructions): array
    {
        $this->viewableWorkflow($actor, $handle);
        $runtime = AutofillPlugin::getInstance()->getWorkflowRuntimeService();
        [, $definition, $element] = $runtime->resolve($handle, $elementId, $siteId);
        return ['prompt' => $runtime->preview($definition, $element, $instructions, $actor)];
    }

    // -------------------------------------------------------------------------

    /**
     * The workflow an agent’s run uses. Unless the allowAgentAutomaticOutputs setting is on, outputs that apply
     * automatically are switched to review for this run only. The run stores this copy as its definition, so
     * processing and retries keep holding those results for review. The saved workflow isn’t changed.
     */
    private function forAgentRun(Workflow $workflow): Workflow
    {
        if (AutofillPlugin::getInstance()->getSettings()->allowAgentAutomaticOutputs) {
            return $workflow;
        }
        $copy = clone $workflow;
        $copy->rows = array_map(static fn(array $row): array => ['requiresApproval' => true] + $row, $workflow->rows);
        return $copy;
    }

    /**
     * @param array<string, mixed> $input
     */
    private function apply(Workflow $workflow, array $input, User $actor, ?Workflow $previous): void
    {
        foreach (['description' => 'description', 'instructions' => 'globalPrompt', 'buttonLabel' => 'actionButtonLabel'] as $key => $attribute) {
            if (array_key_exists($key, $input)) {
                $workflow->$attribute = trim((string)$input[$key]);
            }
        }
        if (array_key_exists('visibility', $input)) {
            $workflow->visibility = (string)$input['visibility'];
        }
        if (array_key_exists('allowEditorInstructions', $input)) {
            $workflow->showUserPromptInput = (bool)$input['allowEditorInstructions'];
        }
        if (array_key_exists('showOnSidebar', $input)) {
            $workflow->showOnSidebar = (bool)$input['showOnSidebar'];
        }
        if (array_key_exists('model', $input)) {
            $workflow->modelConfigUid = $this->resolveModel($input['model']);
        }

        $fields = $this->supportedFields($workflow, $actor);
        $byHandle = [];
        foreach ($fields as $field) {
            $byHandle[strtolower((string)$field['handle'])] = $field;
        }
        $lookup = static function(mixed $handle, string $kind) use ($byHandle): array {
            $key = strtolower(trim((string)$handle));
            $key = $key === 'file' ? '__file' : $key;
            if ($key === '' || !isset($byHandle[$key])) {
                throw new RuntimeException(sprintf('%s field “%s” isn’t available for this target. See autofill_fields_list.', $kind, (string)$handle));
            }
            return $byHandle[$key];
        };

        if (array_key_exists('outputs', $input)) {
            if (!is_array($input['outputs'])) {
                throw new RuntimeException('outputs must be a list.');
            }
            // Automatic outputs were set up by a person; keep them exactly as they are.
            $automatic = array_values(array_filter($previous?->rows ?? [], static fn(array $row): bool => ($row['requiresApproval'] ?? true) === false));
            $automaticUids = array_column($automatic, 'targetFieldUid');
            $existing = array_column($previous?->rows ?? [], null, 'targetFieldUid');
            $rows = [];
            foreach ($input['outputs'] as $index => $output) {
                if (!is_array($output)) {
                    throw new RuntimeException(sprintf('Output %d must be an object.', $index + 1));
                }
                $field = $lookup($output['field'] ?? '', 'Output');
                if ($field['contextOnly']) {
                    throw new RuntimeException(sprintf('“%s” can only be used as context.', $field['handle']));
                }
                if (in_array($field['uid'], $automaticUids, true)) {
                    // Sending an automatic output back unchanged (for example, straight from autofill_workflows_get)
                    // is fine; it's kept as it is. Changing it isn't.
                    $current = $existing[$field['uid']];
                    $unchanged = trim((string)($output['instructions'] ?? $current['prompt'] ?? '')) === trim((string)($current['prompt'] ?? ''))
                        && (!array_key_exists('includeCurrentValue', $output) || (bool)$output['includeCurrentValue'] === (bool)($current['includeCurrentFieldValue'] ?? true))
                        && (!array_key_exists('onlyFillEmpty', $output) || (bool)$output['onlyFillEmpty'] === !($current['overrideCurrentValue'] ?? true))
                        && (!array_key_exists('enabled', $output) || (bool)$output['enabled'] === (bool)($current['enabled'] ?? true));
                    if (!$unchanged) {
                        throw new RuntimeException(sprintf('“%s” applies automatically, so only a person can change it in the control panel. Send it back unchanged or leave it out; either way it’s kept as it is.', $field['handle']));
                    }
                    continue;
                }
                $instructions = trim((string)($output['instructions'] ?? ''));
                if ($instructions === '') {
                    throw new RuntimeException(sprintf('Output “%s” needs instructions.', $field['handle']));
                }
                $row = array_replace_recursive(self::OUTPUT_DEFAULTS, $existing[$field['uid']] ?? []);
                $row['targetFieldUid'] = $field['uid'];
                $row['prompt'] = $instructions;
                $row['requiresApproval'] = true;
                if (array_key_exists('includeCurrentValue', $output)) {
                    $row['includeCurrentFieldValue'] = (bool)$output['includeCurrentValue'];
                }
                if (array_key_exists('onlyFillEmpty', $output)) {
                    $row['overrideCurrentValue'] = !(bool)$output['onlyFillEmpty'];
                }
                if (array_key_exists('enabled', $output)) {
                    $row['enabled'] = (bool)$output['enabled'];
                }
                $row = $this->mergeOptions($row, $output['options'] ?? null, (string)$field['adapter'], $field['handle']);
                $rows[] = $row;
            }
            $workflow->rows = [...$rows, ...$automatic];
        }

        if (array_key_exists('context', $input)) {
            if (!is_array($input['context'])) {
                throw new RuntimeException('context must be a list.');
            }
            $existing = array_column($previous?->contextRows ?? [], null, 'fieldUid');
            $rows = [];
            foreach ($input['context'] as $index => $context) {
                if (!is_array($context)) {
                    throw new RuntimeException(sprintf('Context field %d must be an object.', $index + 1));
                }
                $field = $lookup($context['field'] ?? '', 'Context');
                $row = array_replace_recursive([
                    'enabled' => true,
                    'assets' => ['metadata' => ['title', 'filename'], 'includeFile' => $field['adapter'] === 'assets', 'maxFiles' => 1],
                ], $existing[$field['uid']] ?? []);
                $row['fieldUid'] = $field['uid'];
                $row['prompt'] = trim((string)($context['instructions'] ?? ($row['prompt'] ?? '')));
                if (array_key_exists('enabled', $context)) {
                    $row['enabled'] = (bool)$context['enabled'];
                }
                if (isset($context['options']['assets']) && is_array($context['options']['assets'])) {
                    $row['assets'] = $this->cleanAssets(array_replace($row['assets'], $context['options']['assets']));
                }
                $rows[] = $row;
            }
            $workflow->contextRows = $rows;
        }
    }

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    private function mergeOptions(array $row, mixed $options, string $adapter, string $handle): array
    {
        if ($options === null) {
            return $row;
        }
        if (!is_array($options)) {
            throw new RuntimeException(sprintf('options for “%s” must be an object.', $handle));
        }
        $allowed = self::OPTION_GROUPS[$adapter] ?? [];
        foreach ($options as $group => $values) {
            if (!in_array($group, $allowed, true) || !is_array($values)) {
                throw new RuntimeException(sprintf('“%s” doesn’t accept %s options. It accepts: %s.', $handle, (string)$group, $allowed ? implode(', ', $allowed) : 'none'));
            }
            $row[$group] = $group === 'assets' ? $this->cleanAssets(array_replace($row[$group], $values)) : array_replace_recursive($row[$group], $values);
        }
        if (isset($row['related'])) {
            if (!in_array($row['related']['mode'] ?? '', ['topN', 'all'], true)) {
                throw new RuntimeException('related.mode must be "topN" or "all".');
            }
            $row['related']['topN'] = max(1, min(500, (int)($row['related']['topN'] ?? 25)));
            $row['related']['forceUseCurrentValues'] = (bool)($row['related']['forceUseCurrentValues'] ?? false);
        }
        foreach (['entry', 'category', 'asset'] as $type) {
            if (isset($row['link'][$type])) {
                if (!in_array($row['link'][$type]['mode'] ?? '', ['topN', 'mostRecent', 'all', 'none'], true)) {
                    throw new RuntimeException("link.$type.mode must be topN, mostRecent, all or none.");
                }
                $row['link'][$type]['count'] = max(1, min(500, (int)($row['link'][$type]['count'] ?? 10)));
            }
        }
        foreach ($row['seomatic'] ?? [] as $key => $value) {
            $row['seomatic'][$key] = (bool)$value;
        }
        return $row;
    }

    /**
     * @param array<string, mixed> $assets
     * @return array<string, mixed>
     */
    private function cleanAssets(array $assets): array
    {
        return [
            'metadata' => array_values(array_filter(array_map('strval', (array)($assets['metadata'] ?? [])))),
            'includeFile' => (bool)($assets['includeFile'] ?? false),
            'maxFiles' => max(1, min(20, (int)($assets['maxFiles'] ?? 1))),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function save(Workflow $workflow, User $actor, string $verb): array
    {
        $service = AutofillPlugin::getInstance()->getWorkflowService();
        try {
            $saved = $service->saveWorkflow($workflow, actor: $actor);
        } catch (RuntimeException $exception) {
            throw new RuntimeException($exception->getMessage(), previous: $exception);
        }
        if (!$saved) {
            $messages = [];
            foreach ($workflow->getErrors() as $attribute => $errors) {
                foreach ($errors as $error) {
                    $messages[] = "$attribute: $error";
                }
            }
            throw new RuntimeException('The workflow couldn’t be saved. ' . implode(' ', array_unique($messages)));
        }
        $fresh = $service->getById((int)$workflow->id) ?? $workflow;
        return ['result' => "Workflow $verb.", 'workflow' => $this->describe($fresh, $actor)];
    }

    /**
     * @return array<string, mixed>
     */
    private function describe(Workflow $workflow, User $actor): array
    {
        $access = AutofillPlugin::getInstance()->getWorkflowAccess();
        $fields = array_column($this->supportedFields($workflow, $actor, checkAccess: false), null, 'uid');
        $name = static fn(string $uid): array => isset($fields[$uid])
            ? ['field' => $fields[$uid]['handle'], 'fieldName' => $fields[$uid]['name'], 'kind' => $fields[$uid]['adapter']]
            : ['field' => null, 'fieldName' => 'Missing field', 'kind' => null];
        $owner = $workflow->ownerId ? Craft::$app->getUsers()->getUserById($workflow->ownerId) : null;

        return [
            'handle' => $workflow->handle,
            'name' => $workflow->name,
            'description' => $workflow->description,
            'target' => $this->describeTarget($workflow),
            'instructions' => $workflow->globalPrompt,
            'model' => $workflow->modelConfigUid !== '' ? $workflow->modelConfigUid : null,
            'visibility' => $workflow->visibility,
            'allowEditorInstructions' => $workflow->showUserPromptInput,
            'showOnSidebar' => $workflow->showOnSidebar,
            'buttonLabel' => $workflow->actionButtonLabel,
            'outputs' => array_map(function(array $row) use ($name, $fields): array {
                $adapter = (string)($fields[$row['targetFieldUid'] ?? '']['adapter'] ?? '');
                $options = [];
                foreach (self::OPTION_GROUPS[$adapter] ?? [] as $group) {
                    if (isset($row[$group])) {
                        $options[$group] = $row[$group];
                    }
                }
                return $name((string)($row['targetFieldUid'] ?? '')) + array_filter([
                    'instructions' => (string)($row['prompt'] ?? ''),
                    'review' => ($row['requiresApproval'] ?? true) === false ? 'automatic (managed by people; read-only)' : 'required',
                    'includeCurrentValue' => (bool)($row['includeCurrentFieldValue'] ?? true),
                    'onlyFillEmpty' => !($row['overrideCurrentValue'] ?? true),
                    'enabled' => (bool)($row['enabled'] ?? true),
                    'options' => $options ?: null,
                ], static fn($value): bool => $value !== null);
            }, $workflow->rows),
            'context' => array_map(function(array $row) use ($name): array {
                $field = $name((string)($row['fieldUid'] ?? ''));
                return $field + [
                    'instructions' => (string)($row['prompt'] ?? ''),
                    'enabled' => (bool)($row['enabled'] ?? true),
                ] + (isset($row['assets']) && in_array($field['kind'], ['assets'], true) ? ['options' => ['assets' => $row['assets']]] : []);
            }, $workflow->contextRows),
            'archived' => $workflow->archived,
            'owner' => $owner?->getName(),
            'adminManaged' => $workflow->adminManaged,
            'youCan' => [
                'edit' => $access->canEdit($workflow, $actor),
                'run' => !$workflow->archived && $access->can($actor, 'run'),
            ],
            'editUrl' => UrlHelper::cpUrl('autofill/workflows/edit/' . rawurlencode($workflow->handle)),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function runSummary(WorkflowRunRecord $record, ?ElementInterface $element = null): array
    {
        $workflow = AutofillPlugin::getInstance()->getWorkflowService()->getById((int)$record->workflowId);
        $element ??= Craft::$app->getElements()->getElementById((int)$record->elementId, $record->elementType === 'asset' ? Asset::class : Entry::class, (int)$record->siteId);
        $suggestions = $record->suggestionsJson ? Json::decode($record->suggestionsJson) : [];
        $count = static fn(string $state): int => count(array_filter($suggestions, static fn(array $item): bool => ($item['state'] ?? '') === $state));

        return array_filter([
            'id' => (int)$record->id,
            'status' => $record->status,
            'workflow' => $workflow?->handle,
            'element' => $element ? ['id' => (int)$element->id, 'type' => $record->elementType, 'title' => (string)$element, 'siteId' => (int)$record->siteId] : ['id' => (int)$record->elementId],
            'resultCounts' => $suggestions ? ['pending' => $count('pending'), 'applied' => $count('applied'), 'rejected' => $count('rejected'), 'unchanged' => $count('unchanged')] : null,
            'error' => $record->errorMessage ?: null,
            'reviewUrl' => in_array($record->status, ['ready', 'completed'], true) ? UrlHelper::cpUrl('autofill/inbox/' . $record->id) : null,
            'started' => $record->dateCreated,
        ], static fn($value): bool => $value !== null);
    }

    private function viewableWorkflow(User $actor, string $handle, bool $includeArchived = false): Workflow
    {
        $workflow = AutofillPlugin::getInstance()->getWorkflowService()->getByHandle($handle);
        if ($workflow === null || !AutofillPlugin::getInstance()->getWorkflowAccess()->canView($workflow, $actor)) {
            throw new RuntimeException(sprintf('Workflow “%s” wasn’t found. See autofill_workflows_list.', $handle));
        }
        if ($workflow->archived && !$includeArchived) {
            throw new RuntimeException(sprintf('Workflow “%s” is archived.', $handle));
        }
        return $workflow;
    }

    /**
     * @param array<string, mixed> $target
     */
    private function scopeFromTarget(array $target): Workflow
    {
        if (!empty($target['entryType'])) {
            $type = Craft::$app->getEntries()->getEntryTypeByHandle((string)$target['entryType']);
            if (!$type instanceof EntryType) {
                throw new RuntimeException(sprintf('Entry type “%s” wasn’t found. See autofill_targets_list.', (string)$target['entryType']));
            }
            return new Workflow(['scope' => 'entry', 'entryTypeUid' => (string)$type->uid]);
        }
        if (!empty($target['volume'])) {
            $volume = Craft::$app->getVolumes()->getVolumeByHandle((string)$target['volume']);
            if (!$volume instanceof Volume) {
                throw new RuntimeException(sprintf('Volume “%s” wasn’t found. See autofill_targets_list.', (string)$target['volume']));
            }
            return new Workflow(['scope' => 'asset', 'volumeUid' => (string)$volume->uid]);
        }
        throw new RuntimeException('Choose a target: {"entryType": "<handle>"} or {"volume": "<handle>"}.');
    }

    /**
     * @return array<string, string>
     */
    private function describeTarget(Workflow $workflow): array
    {
        if ($workflow->scope === 'asset') {
            $volume = Craft::$app->getVolumes()->getVolumeByUid($workflow->volumeUid);
            return ['volume' => $volume?->handle ?? '(missing)', 'name' => $volume?->name ?? 'Missing volume'];
        }
        $type = Craft::$app->getEntries()->getEntryTypeByUid($workflow->entryTypeUid);
        return ['entryType' => $type?->handle ?? '(missing)', 'name' => $type?->name ?? 'Missing entry type'];
    }

    /**
     * Fields for a workflow’s target, with layout element UIDs, handles and whether each can be written.
     *
     * @return list<array<string, mixed>>
     */
    private function supportedFields(Workflow $workflow, User $actor, bool $checkAccess = true): array
    {
        $discovery = AutofillPlugin::getInstance()->getFieldDiscoveryService();
        $access = AutofillPlugin::getInstance()->getWorkflowAccess();
        if ($workflow->scope === 'asset') {
            $volume = Craft::$app->getVolumes()->getVolumeByUid($workflow->volumeUid);
            $fields = $volume ? $discovery->getSupportedVolumeFields($volume) : [];
        } else {
            $type = Craft::$app->getEntries()->getEntryTypeByUid($workflow->entryTypeUid);
            $fields = $type ? $discovery->getSupportedEntryTypeFields($type) : [];
        }
        $result = [];
        foreach ($fields as $field) {
            $uid = (string)$field['uid'];
            if ($checkAccess && !$access->canUseField($workflow, $uid, $actor)) {
                continue;
            }
            $result[] = [
                'uid' => $uid,
                'handle' => (string)$field['handle'],
                'name' => (string)$field['name'],
                'adapter' => (string)($field['adapter'] ?? ''),
                'availableInLiteVersion' => (bool)($field['availableInLiteVersion'] ?? true),
                'contextOnly' => ($field['contextOnly'] ?? false) || ($checkAccess && !$access->canUseField($workflow, $uid, $actor, write: true)),
            ];
        }
        return $result;
    }

    /**
     * @return array<string, mixed>
     */
    private function optionsFor(string $adapter): array
    {
        $options = [];
        foreach (self::OPTION_GROUPS[$adapter] ?? [] as $group) {
            $options[$group] = self::OUTPUT_DEFAULTS[$group];
        }
        return $options;
    }

    /**
     * @return list<array{uid: string, label: string, provider: string, enabled: bool}>
     */
    private function models(): array
    {
        return array_values(array_map(static fn(array $row): array => [
            'uid' => (string)($row['uid'] ?? ''),
            'label' => (string)($row['label'] ?? ''),
            'provider' => (string)($row['provider'] ?? ''),
            'enabled' => (bool)($row['enabled'] ?? false),
        ], array_filter(AutofillPlugin::getInstance()->getSettings()->modelConfigs, static fn(array $row): bool => trim((string)($row['uid'] ?? '')) !== '')));
    }

    private function resolveModel(mixed $model): string
    {
        $value = trim((string)($model ?? ''));
        if ($value === '') {
            return '';
        }
        foreach ($this->models() as $config) {
            if ($config['uid'] === $value || strcasecmp($config['label'], $value) === 0) {
                if (!$config['enabled']) {
                    throw new RuntimeException(sprintf('Model “%s” is disabled.', $value));
                }
                return $config['uid'];
            }
        }
        throw new RuntimeException(sprintf('Model “%s” wasn’t found. autofill_guide lists the available models; leave model empty to use the default.', $value));
    }

    private function uniqueHandle(string $name): string
    {
        $base = StringHelper::toKebabCase(StringHelper::toAscii($name)) ?: 'workflow';
        if (!preg_match('/^[a-z]/', $base)) {
            $base = 'workflow-' . $base;
        }
        $handle = $base;
        $service = AutofillPlugin::getInstance()->getWorkflowService();
        for ($i = 2; $service->getByHandle($handle) !== null; $i++) {
            $handle = "$base-$i";
        }
        return $handle;
    }
}
