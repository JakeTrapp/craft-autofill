<?php

declare(strict_types=1);

namespace jtdev\craftautofill\mcp;

use Craft;
use craft\elements\User;
use craft\mcp\attributes\RequiresPermission;
use jtdev\craftautofill\services\agents\AgentApi;
use Mcp\Capability\Attribute\McpTool;
use Mcp\Capability\Attribute\Schema;
use Mcp\Exception\ToolCallException;
use Mcp\Schema\ToolAnnotations;
use RuntimeException;
use Throwable;

/**
 * Autofill’s tools for Craft’s built-in MCP server (Craft 5.12+).
 *
 * This class only adapts MCP calls to {@see AgentApi}, which holds the rules, so the same behavior can be exposed
 * through other transports (such as Craft 6’s MCP server) later.
 */
class AutofillTools
{
    private const TARGET_SCHEMA = [
        'type' => 'object',
        'description' => 'The entry type or asset volume the workflow fills, by handle: {"entryType": "article"} or {"volume": "images"}. See autofill_targets_list.',
        'properties' => [
            'entryType' => ['type' => 'string'],
            'volume' => ['type' => 'string'],
        ],
        // Extra keys, such as the name autofill_workflows_get returns, are ignored so workflows can be sent back as read.
        'additionalProperties' => true,
    ];

    private const OUTPUT_SCHEMA = [
        'type' => 'object',
        'properties' => [
            'field' => ['type' => 'string', 'description' => 'Field handle, or title/slug/enabled/postDate/expiryDate (entries) or title/alt (assets).'],
            'instructions' => ['type' => 'string', 'description' => 'What the AI should write in this field.'],
            'includeCurrentValue' => ['type' => 'boolean', 'description' => 'Show the AI the field’s current value. Default true.'],
            'onlyFillEmpty' => ['type' => 'boolean', 'description' => 'Only suggest a value when the field is empty. Default false.'],
            'enabled' => ['type' => 'boolean', 'description' => 'Default true.'],
            'options' => ['type' => 'object', 'description' => 'Field-type options (related, link, assets, seomatic). See autofill_fields_list.', 'additionalProperties' => true],
        ],
        'required' => ['field'],
        'additionalProperties' => true,
    ];

    private const CONTEXT_SCHEMA = [
        'type' => 'object',
        'properties' => [
            'field' => ['type' => 'string', 'description' => 'Field handle the AI reads but never changes, or "file" for an asset’s own file.'],
            'instructions' => ['type' => 'string', 'description' => 'Optional note on how to use this field.'],
            'enabled' => ['type' => 'boolean'],
            'options' => ['type' => 'object', 'description' => 'For Assets fields and files: {"assets": {"includeFile": true, "maxFiles": 3, "metadata": ["title", "alt"]}}.', 'additionalProperties' => true],
        ],
        'required' => ['field'],
        'additionalProperties' => true,
    ];

    private const WORKFLOW_PROPERTIES = [
        'name' => ['type' => 'string'],
        'handle' => ['type' => 'string', 'description' => 'Optional on create; generated from the name.'],
        'description' => ['type' => 'string', 'description' => 'Shown to editors. Up to 1,000 characters.'],
        'target' => self::TARGET_SCHEMA,
        'instructions' => ['type' => 'string', 'description' => 'Instructions that apply to every output, such as tone and audience.'],
        'model' => ['type' => ['string', 'null'], 'description' => 'Model UID or label from autofill_guide. Empty uses the default model.'],
        'visibility' => ['type' => 'string', 'enum' => ['private', 'public'], 'description' => 'private: only you see and review its results. public: shared with people who have permission. New workflows are private.'],
        'allowEditorInstructions' => ['type' => 'boolean', 'description' => 'Let editors (and autofill_run) add extra instructions per run.'],
        'showOnSidebar' => ['type' => 'boolean', 'description' => 'Show the workflow’s button in the entry sidebar.'],
        'buttonLabel' => ['type' => 'string'],
        'outputs' => ['type' => 'array', 'items' => self::OUTPUT_SCHEMA, 'description' => 'Fields the AI fills. Replaces the review-required outputs; automatic outputs are always kept.'],
        'context' => ['type' => 'array', 'items' => self::CONTEXT_SCHEMA, 'description' => 'Fields the AI reads for information. Replaces the current context fields.'],
    ];

    public function __construct(private readonly AgentApi $api)
    {
    }

    /** @return array<string, mixed> */
    #[McpTool(
        name: 'autofill_guide',
        description: 'Start here. Explains how Autofill works, the rules for agents, this site’s edition, models and test mode, and what you’re allowed to do.',
        annotations: new ToolAnnotations(readOnlyHint: true),
    )]
    #[RequiresPermission('accessPlugin-autofill')]
    public function guide(): array
    {
        return $this->call(fn(User $actor): array => $this->api->guide($actor));
    }

    /** @return array<string, mixed> */
    #[McpTool(
        name: 'autofill_targets_list',
        description: 'Lists the entry types and asset volumes you can build Autofill workflows for.',
        annotations: new ToolAnnotations(readOnlyHint: true),
    )]
    #[RequiresPermission('accessPlugin-autofill')]
    public function targets(): array
    {
        return $this->call(fn(User $actor): array => $this->api->targets($actor));
    }

    /** @return array<string, mixed> */
    #[McpTool(
        name: 'autofill_fields_list',
        description: 'Lists the fields of an entry type or volume that a workflow can fill (outputs) or read (context), with each field’s kind and options. Provide entryType or volume.',
        annotations: new ToolAnnotations(readOnlyHint: true),
    )]
    #[RequiresPermission('accessPlugin-autofill')]
    public function fields(?string $entryType = null, ?string $volume = null): array
    {
        return $this->call(fn(User $actor): array => $this->api->fieldsFor($actor, array_filter(['entryType' => $entryType, 'volume' => $volume])));
    }

    /** @return array<string, mixed> */
    #[McpTool(
        name: 'autofill_workflows_list',
        description: 'Lists the Autofill workflows you can see.',
        annotations: new ToolAnnotations(readOnlyHint: true),
    )]
    #[RequiresPermission('accessPlugin-autofill')]
    public function workflows(bool $includeArchived = false): array
    {
        return $this->call(fn(User $actor): array => ['workflows' => $this->api->workflows($actor, $includeArchived)]);
    }

    /** @return array<string, mixed> */
    #[McpTool(
        name: 'autofill_workflows_get',
        description: 'Gets a workflow’s full configuration, in the same shape autofill_workflows_update accepts: read it, change what you need, and send it back.',
        annotations: new ToolAnnotations(readOnlyHint: true),
    )]
    #[RequiresPermission('accessPlugin-autofill')]
    public function workflow(string $handle): array
    {
        return $this->call(fn(User $actor): array => ['workflow' => $this->api->workflow($actor, $handle)]);
    }

    /**
     * @param array<string, mixed> $workflow
     * @return array<string, mixed>
     */
    #[McpTool(
        name: 'autofill_workflows_create',
        description: 'Creates a private workflow. Requires name, target and at least one output with instructions. Every output requires review by a person before anything is saved to content.',
    )]
    #[RequiresPermission('accessPlugin-autofill')]
    public function create(
        #[Schema(definition: ['type' => 'object', 'properties' => self::WORKFLOW_PROPERTIES, 'required' => ['name', 'target', 'outputs'], 'additionalProperties' => true])]
        array $workflow,
    ): array {
        return $this->call(fn(User $actor): array => $this->api->createWorkflow($actor, $workflow));
    }

    /**
     * @param array<string, mixed> $changes
     * @return array<string, mixed>
     */
    #[McpTool(
        name: 'autofill_workflows_update',
        description: 'Updates a workflow. Send only the properties to change; outputs and context replace the current lists. Outputs that apply automatically are managed by people and always kept.',
    )]
    #[RequiresPermission('accessPlugin-autofill')]
    public function update(
        string $handle,
        #[Schema(definition: ['type' => 'object', 'properties' => self::WORKFLOW_PROPERTIES, 'additionalProperties' => true])]
        array $changes,
    ): array {
        return $this->call(fn(User $actor): array => $this->api->updateWorkflow($actor, $handle, $changes));
    }

    /** @return array<string, mixed> */
    #[McpTool(
        name: 'autofill_workflows_archive',
        description: 'Archives a workflow, or restores it with archived: false. Archived workflows can’t run, and their pending results stay reviewable. Administrators only.',
        annotations: new ToolAnnotations(destructiveHint: true, idempotentHint: true),
    )]
    #[RequiresPermission('accessPlugin-autofill')]
    public function archive(string $handle, bool $archived = true): array
    {
        return $this->call(fn(User $actor): array => $this->api->setArchived($actor, $handle, $archived));
    }

    /** @return array<string, mixed> */
    #[McpTool(
        name: 'autofill_prompt_preview',
        description: 'Shows the exact prompt a workflow would send for an entry or asset, without calling the AI. Use it to check instructions before running.',
        annotations: new ToolAnnotations(readOnlyHint: true),
    )]
    #[RequiresPermission('accessPlugin-autofill')]
    public function preview(string $workflow, int $elementId, ?int $siteId = null, string $instructions = ''): array
    {
        return $this->call(fn(User $actor): array => $this->api->previewPrompt($actor, $workflow, $elementId, $siteId, $instructions));
    }

    /**
     * @param list<int> $elementIds
     * @return array<string, mixed>
     */
    #[McpTool(
        name: 'autofill_run',
        description: 'Runs a workflow on entries or assets (by ID). Results wait for a person to review them in the control panel. Outputs set to apply automatically also wait for review, unless the site allows agent runs to apply them (see autofill_guide). Set wait: true with one item to process it now and get its results back.',
    )]
    #[RequiresPermission('accessPlugin-autofill')]
    public function run(
        string $workflow,
        #[Schema(definition: ['type' => 'array', 'items' => ['type' => 'integer'], 'minItems' => 1, 'maxItems' => AgentApi::MAX_ELEMENTS_PER_RUN, 'description' => 'Entry or asset IDs, depending on the workflow’s target.'])]
        array $elementIds,
        ?int $siteId = null,
        #[Schema(description: 'Extra instructions for this run only. Only allowed when the workflow allows editor instructions.')]
        string $instructions = '',
        bool $wait = false,
    ): array {
        return $this->call(fn(User $actor): array => $this->api->run($actor, $workflow, $elementIds, $siteId, $instructions, $wait));
    }

    /** @return array<string, mixed> */
    #[McpTool(
        name: 'autofill_runs_list',
        description: 'Lists recent runs you can see, newest first. Filter by workflow handle, status (queued, running, ready, completed, failed, cancelled) or element ID.',
        annotations: new ToolAnnotations(readOnlyHint: true),
    )]
    #[RequiresPermission('accessPlugin-autofill')]
    public function runs(?string $workflow = null, ?string $status = null, ?int $elementId = null, int $limit = 20): array
    {
        return $this->call(fn(User $actor): array => ['runs' => $this->api->runs($actor, ['workflow' => $workflow, 'status' => $status, 'elementId' => $elementId, 'limit' => $limit])]);
    }

    /** @return array<string, mixed> */
    #[McpTool(
        name: 'autofill_runs_get',
        description: 'Gets a run’s status and results: each field’s suggested value, whether it’s pending review, accepted or rejected, and any problems. Share reviewUrl so a person can review it.',
        annotations: new ToolAnnotations(readOnlyHint: true),
    )]
    #[RequiresPermission('accessPlugin-autofill')]
    public function runDetail(int $id): array
    {
        return $this->call(fn(User $actor): array => ['run' => $this->api->runDetail($actor, $id)]);
    }

    /** @return array<string, mixed> */
    #[McpTool(
        name: 'autofill_runs_cancel',
        description: 'Cancels a queued or running run. Results that are ready for review can only be handled by people.',
        annotations: new ToolAnnotations(destructiveHint: true),
    )]
    #[RequiresPermission('accessPlugin-autofill')]
    public function cancel(int $id): array
    {
        return $this->call(fn(User $actor): array => ['run' => $this->api->cancelRun($actor, $id)]);
    }

    /**
     * @param callable(User): array<string, mixed> $operation
     * @return array<string, mixed>
     */
    private function call(callable $operation): array
    {
        $actor = Craft::$app->getUser()->getIdentity();
        if (!$actor instanceof User) {
            throw new ToolCallException('Authentication is required.');
        }
        try {
            return $operation($actor);
        } catch (ToolCallException $exception) {
            throw $exception;
        } catch (RuntimeException $exception) {
            throw new ToolCallException($exception->getMessage(), previous: $exception);
        } catch (Throwable $exception) {
            Craft::error($exception, __METHOD__);
            throw new ToolCallException('Autofill couldn’t complete this request. Check the Craft logs for details.', previous: $exception);
        }
    }
}
