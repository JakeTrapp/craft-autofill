# Autofill

Autofill brings AI into Craft CMS, configured around the way your team works. Create workflows for your entries and assets, give them the right context, and let editors generate field suggestions with a click.

Think of each workflow as a skill that teaches AI how to fill out a specific entry type or asset.

You decide what each workflow reads, which fields it can fill, and what needs review. Editors stay in Craft and keep control of the content they publish.

## Built for your content

A workflow is a reusable set of instructions for a specific entry type or asset volume. Choose the fields Autofill should fill, add instructions for each one, and give the model context from existing content. Shared instructions keep guidance consistent, while optional per-run instructions let editors add details for the task at hand.

Choose which fields and asset details to send as context. Autofill can also use supported image and document files from existing Craft assets when the model supports them. Context fields are read-only. To suggest alt text or a caption for an asset, create a workflow for that asset volume.

[Learn about workflows and launchers](https://www.jtdevelop.com/development/plugins/autofill#autofill-fields) · [See asset inputs and outputs](https://www.jtdevelop.com/development/plugins/autofill#asset-inputs) · [View supported fields](https://www.jtdevelop.com/development/plugins/autofill#supported-fields)

## Review on your terms

Give editors a workflow in the entry or asset sidebar, an Autofill field in the content layout, or both. They can run it with a click and keep working while Craft's queue handles generation.

When suggestions are ready, editors can review them on the original content, edit supported values, and accept or reject each suggestion. Choose which outputs require review and which eligible outputs can apply automatically. Closing a review leaves undecided suggestions ready for later.

[See how editors use Autofill](https://www.jtdevelop.com/development/plugins/autofill#editor-workflow)

## Do more with bulk

Autofill Pro runs a workflow across multiple entries or assets, helping teams fill in missing content or update a collection without opening each item to start a run. The inbox brings results together and takes reviewers back to the original content to make their decisions.

[Explore bulk Autofill](https://www.jtdevelop.com/development/plugins/autofill#bulk-autofill)

## Share with the right people

New workflows are private by default. Share a workflow with users who have the appropriate Autofill and Craft permissions. Separate permissions control who can create, edit, run, and review workflows and configure automatic application.

Lite includes one saved workflow, background generation, and single-item review. Pro adds multiple workflows, bulk generation, a review inbox, and additional supported field types.

[Permissions and sharing](https://www.jtdevelop.com/development/plugins/autofill#permissions) · [Compare Lite and Pro](https://www.jtdevelop.com/development/plugins/autofill#lite-vs-pro-edition)

## Set up with your AI agent

AI agents such as Claude, ChatGPT and Cursor can set up and run Autofill through Craft’s MCP server.

[Set up AI agents](https://www.jtdevelop.com/development/plugins/autofill#ai-agents-mcp)

## Get started

Autofill requires Craft CMS 5.12.1 or later, PHP 8.2 or later, an enabled AI model, and a working Craft queue. It supports OpenAI, Anthropic, DeepSeek, and Google Gemini model configurations.

Install Autofill from the Craft Plugin Store, or run:

```bash
composer require jt-dev/craft-autofill
./craft plugin/install autofill
```

### Request limits

AI requests time out after 30 seconds by default. To change this, or to raise the output token limit, copy [`src/config.php`](src/config.php) to `config/autofill.php` in your project:

```php
return [
    'requestTimeout' => 90,     // seconds, 5–600
    'maxOutputTokens' => 16000, // null uses the provider default
];
```

[Read the documentation](https://www.jtdevelop.com/development/plugins/autofill) for setup and examples. Updating an existing installation? See the [upgrade notes](UPGRADING.md).
