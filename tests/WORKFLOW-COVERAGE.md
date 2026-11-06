# Workflow lifecycle coverage

These checks use deterministic providers and the marked disposable database. No paid model calls are required.

| Case | Intended outcome | Main coverage |
| --- | --- | --- |
| Private workflow and private run | Other editors cannot see them; admins can | Unit permissions; Craft recovery tests |
| Publish private workflow | Earlier private results remain private | Craft regeneration/privacy tests |
| Share a private workflow | It appears in another authorized manager's workflow list after sharing | Browser sharing test |
| Make public workflow private or archive it | Earlier public results remain accessible under current content permissions | Craft recovery; browser archived-review test |
| Edit while processing | Definition stays locked until generation finishes | Craft run-storage test |
| Change an automatic output without permission | Server rejects it; UI leaves it read-only | Unit permissions; non-admin browser test |
| Change shared instructions without automatic permission | Save succeeds without altering protected automatic rows | Unit permissions; non-admin browser test |
| Submit `0` instead of a boolean review requirement | Cannot bypass automatic-application permission | Unit permissions |
| Lite single run | Queue, restore, review and save without the Pro inbox | Craft lifecycle tests |
| Downgrade with pending Pro work | Results remain reviewable from their original content | Craft recovery test |
| Mixed automatic/manual outputs | Automatic values save; review-required siblings stay pending | Craft lifecycle tests |
| Output changes after generation starts | Automatic apply pauses for that field; warned manual acceptance remains possible | Craft recovery tests |
| Source context changes | Automatic outputs pause for review; results remain available | Craft recovery tests |
| Human edit after automatic application | Remaining dependent results show a changed-context warning | Craft mixed-run lifecycle test |
| Admin starts a private workflow | Its creator retains review access without permission to review other users' public runs | Craft recovery test |
| Private regeneration alongside public results | A separate private run is created; the public run stays unchanged | Craft recovery test |
| Upgrade actual 1.0.7 Lite/Pro installations | Field configuration becomes a public admin-managed workflow; references, edition and existing content survive; migration repeats safely | `tests/upgrade/run`, separate legacy/current processes |
| Permission revoked during generation | No automatic save using stale permissions | Craft recovery test |
| Reviewer cannot access a field | Its value is absent from the payload and actionable count | Craft recovery tests |
| Required context is unavailable | Stop before queueing or contacting a provider | Craft recovery test |
| Draft run | Saves the draft without changing canonical content | Craft recovery test |
| Dismiss queued run | No generation; edit lock releases | Craft recovery test |
| Regenerate | Preserve old history and create a new attributable run | Craft recovery test |
| Related candidates/source items | Hidden related content is excluded from candidates and cannot be supplied as source or assigned | Craft recovery tests |
| Fixed workflow input | Browser-supplied additional instructions are ignored when editor input is disabled | Craft recovery test |
| Automatic UI refresh | Clean editors refresh saved automatic fields; manual review remains pending | Browser mixed-run test |
| CLI automatic batch | Requires explicit acknowledgement and an initiating user | Craft recovery test |
| Legacy CLI field identifier | Resolves the saved workflow and retains required review | Craft recovery test |
| Bulk assets | Durable results open from inbox; reject/accept decisions persist | Browser bulk/inbox test |
| Repeat generation with identical values | Run completes without review or another actionable notification | Craft lifecycle test |
| Workflow descriptions and bulk selection | Description survives saving and appears in the editor sidebar and on bulk cards; changing workflows clears the selected form | Browser creation and bulk-screen tests |
| Craft rejects save-first request | No generation starts; unsaved content remains | Browser test |
| Inbox review link | Opens the original asset editor with review already open; closing it stays closed after reload; reopening still works | Browser bulk/inbox test |
| Compact sidebar launchers | Run and review stay available while details are collapsed; additional instructions expand independently; regenerate/dismiss icons appear for pending results | Browser creation and mixed-invalid tests |
| Native Craft management tables | Workflows, inbox and logs are searchable; log details expand to show a read-only provider response | Browser management-table test |

Browser runs also generate a few review images under `tests/browser/artifacts/`, including `workflow-inbox.png`, `archived-workflow-review.png`, and the invalid editable/read-only field examples. Those generated artifacts are ignored by Git and excluded from distribution.
