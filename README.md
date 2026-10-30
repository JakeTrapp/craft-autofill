# Autofill

Autofill adds an AI-assisted field type to Craft CMS that helps editors generate, review, and apply field suggestions from entry content. Configure the fields you want Autofill to manage, add prompts and optional global context, then let editors generate suggested values from the entry edit page.

Full documentation is available at [jtdevelop.com/development/plugins/autofill](https://www.jtdevelop.com/development/plugins/autofill).

## Requirements

Autofill requires Craft CMS 5.0.0 or later and PHP 8.2 or later.

## Installation

You can install this plugin from the Plugin Store or with Composer.

#### From the Plugin Store

Go to the Plugin Store in your project’s Control Panel and search for “Autofill”. Then press “Install”.

#### With Composer

Open your terminal and run the following commands:

```bash
# go to the project directory
cd /path/to/my-project.test

# tell Composer to load the plugin
composer require jt-dev/craft-autofill

# tell Craft to install the plugin
./craft plugin/install autofill
```

## Development testing

Run unit and Craft integration suites separately:

```bash
composer test:unit
composer test:integration
npm run test:browser
```

The ignored Craft runtime is generated from tracked setup recipes. Integration tests use a DDEV MySQL 8 database with an identity marker. They refuse unmarked databases and never reset the normal site database. See [`tests/README.md`](tests/README.md) for setup and safety details.

Release archives exclude test sources and the generated site. Composer consumers do not inherit this plugin's development dependencies or run its test scripts. The compiled control-panel interface ships with the plugin and needs no Node build on customer sites.

## Workflows

Administrators manage configurations under **Autofill → Workflows**. Each workflow targets one entry type or asset volume and defines output instructions, read-only context, model selection, and review rules. Workflow definitions stay in the site's database and can be edited on the live site.

Autofill fields reference a workflow by handle. You can deploy a field before its workflow exists: its control appears when a matching workflow is created. A workflow may also appear in the editor sidebar independently of inline fields. Lite supports one workflow.

Existing field configurations are converted through Craft's normal plugin migration process. Original settings are retained in the workflow table as migration snapshots. Back up the database and project config before deploying an update, as with other Craft schema changes.

Images and supported document files come from existing Craft assets. Select metadata and optional file content in the workflow's context rows. Configuring an asset workflow lets you generate that asset's configured fields, such as alt text or a caption. Using attached assets as context does not modify them.
