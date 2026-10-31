# Release Notes for Autofill
## Unreleased
- Moved generation definitions into live-editable, administrator-managed workflows with handle-based field references and automatic conversion of existing configurations.
- Added a Vue and Verbb Plugin Kit workflow editor and list, independent sidebar controls, and a Plugin Kit suggestion review dialog.
- Required saving editor changes before generation so Autofill uses persisted content.
- Added built-in Anthropic, DeepSeek, and Google Gemini model configurations alongside OpenAI.
- Added asset-volume workflows, selected asset metadata and file inputs, configurable file counts, and clear unsupported-input errors. File content and temporary access links are excluded from request logs.
- Added separate root unit, Craft integration, and Playwright browser suites, with a generated disposable Craft environment and release-package exclusions.
- Simplified the workflows list and moved workflow actions into Craft's page header.
- Improved workflow editing with side-by-side context and output panels, drag-and-drop ordering, compact instruction previews, field-type icons, and optional settings under Advanced.
- Added Craft-native field selection pop-ups that create a card only after a field is selected and prevent duplicate assignments across context and outputs.
- Added clearer dropdown controls, light help tooltips, distinct panel heading accents, and separate selection, warning, and error states.
- Fixed new workflows starting with an unusable blank output card and Autofill's sidebar submenu collapsing on Bulk Autofill and Logs.
- Revalidated suggestions and editor corrections on the server before saving. Missing, null, and empty results can no longer erase existing content.
- Preserved invalid returned values and validation details for review and logging. Supported editors can correct invalid values; invalid read-only results cannot be accepted, and valid suggestions in the same response remain usable, including during bulk runs.
- Tightened field-specific validation and safe conversions for option labels, numeric limits and precision, text limits, dates and times, countries, addresses, structured data, and relationship sources. Ambiguous values and malformed rows or selections are rejected instead of guessed, truncated, or silently discarded.
- Fixed date-only values shifting across time zones, country-name lookup, currency values being rounded during conversion, and missing API-key environment variables causing a PHP error.
- Expanded edge-case and Craft persistence coverage across all 26 field adapters, with a per-field coverage guide and browser checks for editable and read-only failures.

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
