# Release Notes for Autofill

## 2.1.0 - 2026-11-09

### Added

- Added the `requestTimeout` and `maxOutputTokens` config settings, which can be set in `config/autofill.php`. Requests time out after 30 seconds by default.

### Changed

- The review dialog shows how many suggestions were applied and how many already matched saved values. Queued runs show that they are waiting for the Craft queue.
- Model prompts identify output fields by their unique IDs so fields with the same label can be distinguished.
- Provider timeouts now come from the `requestTimeout` setting instead of Craft’s Guzzle settings, and timeout errors explain how to raise the limit.
- Anthropic requests allow up to 8,192 output tokens by default, up from 4,096.
- Bulk Autofill prepares runs in a queue job, so large selections no longer depend on the request time limit. Items that can’t start appear under Failed in the Inbox.
- Notification badges show “10+” instead of counting every ready run, which keeps control panel pages fast after large batches.
- Applying a suggestion validates the changed field and updates the search index.
- API keys must be stored as environment variable references, such as `$OPENAI_API_KEY`. Existing literal keys keep working, but plugin settings can’t be saved until they are moved to `.env`.
- Archived workflows no longer count toward the Autofill Lite workflow limit. Autofill Lite can’t restore archived workflows.
- Unexpected server errors are logged and replaced with a general message instead of showing internal details.
- Uninstalling Autofill removes its workflows, runs and request logs.

### Fixed

- Fixed workflows reading, showing, or applying suggestions to custom fields on tabs that are hidden from the current user.
- Fixed automatic suggestions for Assets fields overwriting edits to selections beyond the configured AI input limit.
- Fixed Date suggestions accepting values outside configured bounds and relationship suggestions accepting fewer than the required number of selections.
- Fixed “Only fill empty fields” handling for existing values, including zero and false, when current values are excluded from the prompt.
- Fixed asset metadata replacing the output field’s current value in prompts for asset workflows.
- Fixed SEOmatic prompts, settings, and review showing disabled sections, and preserved existing SEO metadata outside the suggested patch.
- Fixed runs staying “Running” forever after a queue worker timed out or stopped, which blocked new runs and workflow edits. Runs that stop responding are now marked as failed. Runs queued for more than 24 hours without starting are also marked as failed.
- Fixed regenerated runs sometimes staying queued when Craft uses a non-database queue driver.
- Fixed responses that hit the output token limit failing with a parse error instead of saying they were cut off.
- Fixed Autofill Lite blocking new workflows after the only workflow was archived.
- Fixed the legacy field-based apply endpoint skipping the review permission and “Only fill empty fields” setting.
- Fixed runs for permanently deleted content remaining in the Inbox.

## 2.0.0 - 2026-11-07

### Added

- Added a workflow editor in the control panel for configuring entry types and asset volumes. Workflows have separate context and output fields, field-specific instructions, optional editor input, model overrides, and per-field review and overwrite settings.
- Added sidebar launchers for entries and assets. Multiple matching workflows can appear in the sidebar, and an Autofill field can launch a workflow inline by its handle.
- Added Anthropic, DeepSeek, and Google Gemini as model providers alongside OpenAI.
- Added support for Assets fields as context and output in both Lite and Pro. Context can include selected metadata and supported files, with a configurable asset count. Asset workflows can suggest titles, alt text, and supported custom field values.
- Added workflow ownership and sharing. New workflows are private by default, and separate permissions govern creating, editing, running, reviewing, and configuring automatic application.
- Added background runs with saved status and review results in both editions. Pending suggestions reopen on the original entry, draft, or asset, and editors can accept or reject each field separately.
- Added the Pro Inbox with status filters, in-app notifications for results ready to review, and navigation to the next item from the content editor.
- Added run regeneration and dismissal with retained history. Workflows with run history can be archived, and authorized reviewers can still access pending results.

### Changed

- Moved generation settings out of Autofill fields and into saved workflows. Existing fields are migrated to reference workflows by handle. Lite allows one saved workflow per installation, including archived workflows.
- Changed Pro Bulk Autofill to run a selected workflow across entries or assets. The bulk screen previews context, outputs, and review settings before a run. Outputs that require review stay pending.
- Updated the workflow list, Inbox, and request logs to use Craft's native tables. Request logs support search, sorting, pagination, and expandable request details.
- Saved pending editor changes before starting generation so workflows read current content. Runs stay on the original draft and site.
- Added checks for content changes before applying automatic outputs. Results that already match saved values are skipped, and a run with no remaining changes completes without opening review.
- Restricted request logs to administrators. File contents and temporary access links are excluded from logs, and access to workflow fields and asset metadata is checked before use.

### Fixed

- Prevented missing, null, or empty suggestions from clearing existing field values. Invalid suggestions get one repair attempt per run using validation feedback. Valid suggestions remain available even when another field fails.
- Validated editor corrections before saving and kept invalid suggestions visible for review. Editors can correct invalid suggestions where the field supports editing.
- Kept valid Categories, Tags, and Entries selections when the model also returns unavailable or ambiguous titles. Skipped titles are recorded in the request log.
- Fixed date-only values shifting across time zones. Post Date and Expiration Date suggestions without an offset now use Craft's time zone, and edited dates include a time zone.
- Fixed country-name lookup, currency rounding during conversion, and PHP errors when API key environment variables are missing. Tightened validation for numeric limits, text limits, options, and structured field values.
- Recovered from temporary Craft security token failures during generation and review. Status checks resume, and unsaved review edits stay available to retry.

### Upgrading from 1.0.x

- Existing field configurations migrate to shared, administrator-managed workflows. Check the Craft queue and grant editors the Autofill permissions they need after upgrading.
- Bulk runs require an active initiating user. Use `--user` for CLI runs and `--confirm-automatic=1` for batches that can apply outputs automatically. Existing field and entry arguments still work with migrated workflows.
- PHP callers should update how they interpret bulk results. `queue()` returns a saved Autofill run ID in `jobId`, and `run()` can report success while suggestions still await review.

[Upgrade guide](https://www.jtdevelop.com/development/plugins/autofill#upgrade-guide) · [Autofill documentation](https://www.jtdevelop.com/development/plugins/autofill)

## 1.0.7 - 2026-07-27
- Fixed a bug that cut off plain text fields value
- Fixed change log

## 1.0.6 - 2026-07-07
- Improved the review modal to stay positioned near the active field, flip above fields near the bottom of the viewport, keep the active field highlighted during review, and attempt to open the sidebar/details panel when reviewing sidebar fields.
- Improved the review spotlight so it restores when scrolling the active field off-screen and back into view, and better highlights the field.
- Improved the review modal by removing the separate Reject button, moving Close to the right, and refreshing the entry when closed.

## 1.0.5 - 2026-07-01
- Fixed a bug where closing the Autofill modal wouldn't clear suggestions, because next/prev buttons weren't scoped to specific modals.
- Added a "Force Use Current Values" setting for related entries, merging selected values and suggestions together.

## 1.0.4 - 2026-06-30
- Added a helper method for checking whether a specific Autofill field and entry were already successfully completed.

## 1.0.3 - 2026-06-30
- Added a CP page to run Autofill in bulk, using Craft's queue system and extendable from other plugins.
- Added a CP page showing AI calls.

## 1.0.2 - 2026-06-29
- Fixed Autofill field targeting when a field's label or handle is overridden within an entry type field layout.
- Fixed frontend runtime conflicts so multiple Autofill fields can work independently on the same entry edit page.
- Added entry type compatibility validation so Autofill fields can only be added to the exact entry type they're configured for, with a clear field layout error message.

## 1.0.1 - 2026-06-16
- Changed the Free edition name to Lite throughout the plugin and documentation.

## 1.0.0 - 2026-06-15
- Initial release.
