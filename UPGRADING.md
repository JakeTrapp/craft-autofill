# Upgrading to Autofill 2.0

This update moves Autofill configuration into saved workflows and adds background generation, workflow permissions and persistent review results. Back up the database and Craft project config before applying the plugin migrations. Try the upgrade on a copy of an existing site first.

## Existing configurations

Craft's plugin migrations convert embedded Autofill field settings into saved workflows. Existing fields reference those workflows by handle. Original settings are retained as migration snapshots. Existing workflows become public and administrator-managed, so other editors cannot change their definitions.

Public means shared with authorized control-panel users. It does not mean available to website visitors or anonymous clients. Craft's content, site, asset and field permissions still apply.

New workflows default to private and belong to their creator. Administrators can inspect, edit and transfer private workflows. Existing migration records use administrator management rather than assigning ownership to the user who happened to install the update.

## Configure permissions

Administrators retain full Autofill access. For other users, enable plugin access and the appropriate Autofill permissions in Craft's user/group settings:

| Permission | Allows |
| --- | --- |
| View own / view others | Inspect owned workflows or other users' public workflows and accessible runs |
| Create | Create workflows within allowed Craft content scopes |
| Edit own / edit others | Change owned definitions or other users' public definitions, except administrator-managed definitions |
| Run | Start generation on content the user can edit |
| Bulk | Start Pro batches |
| Review / review others | Accept or reject eligible results. Viewing or reviewing another user's public results also requires Review other users’ public results and View other users’ public workflows. |
| Configure automatic application | Enable automatic application and edit existing automatic output rows |
| Archive own / archive others | Remove eligible definitions from new-run selection |

The new permissions are not automatically granted to every existing editor. Review existing users/groups after upgrading. Creating and editing workflows are separate permissions.

Without permission to configure automatic application, automatic output rows are visible but read-only. Authorized editors can still change shared instructions, context and model selection. These shared settings can affect automatic results. This is an intentional boundary in this update.

Legacy logs are administrator-only because older rows do not reliably identify workflow/run privacy. Requests may contain source content and generated values.

## Background generation and review

Both Lite and Pro start work through Craft's queue. Configure a reliable queue worker for your deployment. Control-panel queue processing remains available when enabled by Craft, but generation must be able to continue after the initiating page closes.

The on-page button shows running status, then offers review when results are ready. Reopening the content restores pending results. Pro additionally provides an inbox, status views and entry-by-entry review navigation. Notifications stay inside Craft; no email is sent.

Opening results from the inbox takes you straight to the original entry or asset and opens its review modal. Back-to-inbox and next-item links are available in the editor sidebar.

Accepting a suggestion saves that field immediately. Rejecting records the decision without changing the content. Closing review leaves undecided fields pending. A field the reviewer cannot access is skipped for that user and remains available to an eligible reviewer.

Outputs configured for automatic application are applied independently of outputs requiring review. Bulk starts require acknowledgement when any outputs can apply without review. Single runs report automatic application afterward.

If relevant source context changed since the run started, automatic application pauses for review. A changed output pauses that output, and affects other automatic outputs when its previous value was used as context. Reviewers see a warning and may accept manually or regenerate. Applied values are not undone by dismissing or regenerating a run.

Private runs stay private after their workflow is published. Public runs stay public after their workflow becomes private. Current Craft content permissions always apply. Results retain their original draft and site; they never silently move to published content.

Private review ownership is saved separately from the person who starts generation. If an administrator runs a user's private workflow, its owner can still review those results. Transferring a workflow does not transfer access to its earlier private results.

## Lite and Pro

Lite retains a complete single-run background generation/review/save path. Its limit remains one workflow across the whole installation, including private definitions. Administrators can manage a private workflow consuming that slot. Archived workflows still count toward the limit; administrators can open the archived-workflow list and restore/reconfigure the existing definition without discarding its history.

The inbox and bulk tools require Pro. Pending results remain reviewable from their target content after a downgrade. Existing Pro field configurations are retained; changing an edition does not delete definitions or results.

## Bulk and command-line callers

The control panel selects a workflow directly and supports both entries and assets. Each item becomes a durable run. Fields are no longer required as the entry point for a bulk workflow.

For CLI execution, specify the user whose permissions authorize the work:

```bash
php craft autofill/bulk/run --workflow=product-copy --element-ids=12,34 --user=editor
```

For workflows with automatic outputs, add `--confirm-automatic=1`. `--run-now=1` processes generation immediately but still leaves review-required outputs pending. Legacy `--field-id`, `--field-slug` and `--entry-ids` identifiers remain accepted for migrated workflows. They follow the same permissions and review rules.

Old queued jobs without an initiating user fail visibly and must be requeued with a user. They do not run with implicit administrator access.

The old synchronous generation endpoint now starts a durable run. Custom integrations must use the returned run and poll status instead of expecting generated suggestions immediately. Browser-posted corrections are revalidated; target identities and review policies come from the saved run.

## History and recovery

Definitions cannot be edited while their runs or batches are queued/processing. Pending human review alone does not keep them locked. Regeneration creates a new run and retains the previous results; a private regeneration does not publish the original private run.

Definitions with run history are archived instead of deleted. Their saved results remain accessible to authorized users. Deleted or suspended owners' private workflows remain private and available to administrators for transfer. History is retained in the database; this update does not add automatic history pruning or a custom content undo system.
