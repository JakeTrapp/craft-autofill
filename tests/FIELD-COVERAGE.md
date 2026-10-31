# Field edge-case coverage

This is a review guide to the tests, not a promise that every possible input or Craft configuration has been tested. All AI responses are deterministic fixtures; no live provider calls are needed.

## Shared safety rules

- Accept field-specific, unambiguous conversions. Preserve `false` and `0` as actual values.
- Missing/null values are invalid. Empty results cannot erase existing content, including encoded empty JSON structures.
- Validate the raw response before normalization can discard malformed pieces. Validate submitted corrections again on the server.
- Never guess a field from its position in the response, guess between duplicate relationship titles, or silently discard invalid selections/cells.
- Invalid suggestions stay reviewable with the original returned value and an explanation. Valid siblings remain usable.
- Existing editable review controls can correct a value. Read-only table, icon, and link previews remain read-only and cannot accept an invalid result.

## Per-field guide

| Field | Accepted example / conversion | Rejected or boundary examples | Why this matters |
|---|---|---|---|
| Plain text | Trimmed text; `0` → `"0"`; `false` → `"false"` | Objects, arrays, null; character/byte limits including Unicode | Avoids saving “Array” or losing false/zero |
| Lightswitch | Boolean; explicit `"false"`, `"yes"`, `0`, `1` | `"maybe"`, empty text, other numbers | Unknown answers must not silently become false |
| Number | Numeric strings and zero | Nonnumeric/nonfinite values; configured min/max, step, decimal precision | Prevents unwanted rounding or invalid numbers |
| Range | Values at min/max and valid steps | Off-step, outside bounds, arrays/nonfinite values | Respects the actual slider configuration |
| Money | Decimal amount and zero | Malformed amount, structured input, nonzero excess currency precision | Protects amounts from parser errors and unintended conversion |
| Date | Complete date; date/time with explicit ISO offset | Impossible dates, ambiguous/relative/incomplete dates | Protects calendar values and prevents date-only timezone shifts |
| Time | Valid clock values within configured limits | Invalid clock values, outside limits, wrong minute increment | Ensures the saved time matches the configured input |
| Color | Valid permitted palette/custom hex values | Malformed hex; non-palette value when custom colors are disabled | Keeps generated colors selectable in Craft |
| Email | Bare email or exact supported mailto wrapper | Invalid address, arbitrary surrounding prose | Does not guess an email from a paragraph |
| Country | Known country code or localized name | Unknown codes, arrays and malformed objects | Does not invent a country code |
| Dropdown | Exact option value or unique matching label | Unknown/ambiguous labels, multiple selections, wrong shapes | Keeps values inside configured options |
| Radio buttons | Exact option value or unique matching label | Unknown or ambiguous selections | Preserves one valid choice |
| Button group | Exact option value or unique matching label | Multiple/unknown choices | Avoids selecting a default from an invalid answer |
| Checkboxes | Supported list/JSON forms; deduplicated valid values | Unknown members or malformed list items | Does not silently drop the bad part of a selection |
| Multi-select | Supported list/JSON forms; unique values | Unknown members, wrong shapes | Preserves the intended set of selections |
| Icon | Supported icon identifier | Arrays/objects and malformed identifiers | Avoids unsafe string coercion |
| JSON | Objects/arrays, including encoded JSON; nested false/zero/Unicode | Malformed JSON and scalar JSON; empty structure overwriting existing data | Keeps structure and scalar types intact |
| Table | Row wrapper/list forms, known columns, numeric zero and false | Invalid rows/cells, unknown columns, row limits, invalid dates/times/emails | Prevents silently losing bad rows or cells |
| CKEditor | Text/HTML fragments and safe scalar strings | Structured objects/arrays and null | Preserves rich text instead of coercing an object |
| SEOmatic | Supported SEO patch keys and valid site-name position | Unsupported keys, structured values where text is expected, invalid position | Prevents misleading partial patches |
| Addresses | Supported address object/list and country data | Invalid countries, malformed rows, unsupported keys, max-address limits | Prevents truncated or partially discarded addresses |
| Entries | Exact available title in configured sections | Missing/deleted/wrong-source or ambiguous title; over limit; mixed invalid selections | Does not select a different entry by guessing |
| Categories | Available title in configured group | Missing/deleted/wrong-group title | Respects category-source boundaries |
| Tags | Available title in configured group | Missing/deleted/wrong-group title | Respects tag-source boundaries |
| Assets | Available asset IDs in configured volume | Invalid/malformed/unavailable/wrong-volume IDs and over-limit selections | Prevents unintended asset relationships |
| Link | Supported URL or configured element destination | Unknown/blank explicit type, malformed values, wrong-source or ambiguous element | Does not reinterpret a broken destination as a different link type |

## Where the checks live

| Layer | Test files | What it establishes |
|---|---|---|
| Fast option/JSON/provider checks | `unit/OptionFieldAdapterTest.php`, `unit/AiResponseNormalizerTest.php`, `unit/ProviderContractTest.php` | Value shapes, ambiguous options, provider envelopes, missing-key behavior, request formatting |
| Scalar field cases and persistence | `integration/ScalarFieldEdgeCaseTest.php` | Ten scalar adapters, boundaries/conversions, save and reload for each |
| Option field persistence | `integration/OptionFieldEdgeCaseTest.php` | Save/reload of dropdown, radio, button group, checkboxes, multi-select, icon |
| Relationship cases and persistence | `integration/RelationFieldEdgeCaseTest.php` | Entry/category/tag/asset/link sources, ambiguity, unavailable targets and save/reload |
| Structured field cases | `integration/StructuredFieldEdgeCaseTest.php`, `SuggestionPersistenceTest.php`, `OptionalFieldPersistenceTest.php` | JSON/table/CKEditor/SEO/address cases and real Craft persistence |
| Shared application safety | `integration/SuggestionSafetyTest.php` | Both apply paths reject unsafe values; existing data survives; original returned values are retained |
| Mixed results and logs | `integration/PartialGenerationSafetyTest.php` | Deterministic generation, partial success and diagnostic logging |
| Editor review | `browser/workflow.spec.ts` | Original returned value, correction/revalidation, valid sibling acceptance, read-only invalid table and persistence |

## Visual examples

A browser run writes three representative screenshots to the ignored `browser/artifacts/` folder:

1. `review-invalid-editable.png`: malformed text result, original object visible, acceptance blocked until edited.
2. `review-valid-sibling.png`: the valid dropdown suggestion remains usable in the same response.
3. `review-invalid-readonly.png`: invalid numeric table cell, original result visible, acceptance disabled, no JSON editing fallback.

These examples use the isolated `db_test` site. They do not change the manual demo workflows.

## Limits

The suite covers representative edge cases and save/reload for every adapter. It is not exhaustive across every option, rich-text configuration, language, multisite setup, plugin version, simultaneous edit, or real model response. No screenshot-per-case collection is intended. Add focused cases when a new bug or supported shape is discovered.
