<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { Button, Checkbox, Input, Textarea } from '@verbb/plugin-kit-vue/components';
import HelpTip from './HelpTip.vue';
import SortableFields from './SortableFields.vue';
import NativeFieldPicker from './NativeFieldPicker.vue';

type FieldOption = { iconSvg?: string; uid: string; name: string; handle?: string; adapter?: string; availableInLiteVersion?: boolean; contextOnly?: boolean };
type Workflow = {
  id: number | null; uid?: string; handle: string; name: string; scope: 'entry' | 'asset';
  entryTypeUid: string; volumeUid: string; modelConfigUid: string; globalPrompt: string;
  actionButtonLabel: string; showUserPromptInput: boolean; showOnSidebar: boolean;
  rows: any[]; contextRows: any[];
};
const page = ref<HTMLElement>();
const activePanel = ref<'context' | 'output' | null>(null);
const pickerMode = ref<'context' | 'output' | null>(null);
const pickerAnchor = ref<HTMLElement>();
const fieldSearch = ref('');
const fieldSearchInput = ref<HTMLInputElement>();
let pendingFieldFocus: 'context' | 'output' | null = null;
let headerObserver: ResizeObserver | undefined;
function resetPanelOnOutsideClick(event: PointerEvent) {
  if (pickerMode.value) return;
  if (!(event.target instanceof Element) || !event.target.closest('.af-builder-panel')) selectPanel(null);
}
onMounted(() => {
  if (!isList) document.addEventListener('pointerdown', resetPanelOnOutsideClick);
  const header = document.querySelector('#header');
  if (header) {
    headerObserver = new ResizeObserver(() => page.value?.style.setProperty('--af-header-offset', `${header.getBoundingClientRect().height}px`));
    headerObserver.observe(header);
  }
});
onBeforeUnmount(() => {
  headerObserver?.disconnect();
  document.removeEventListener('pointerdown', resetPanelOnOutsideClick);
});
const props = defineProps<{ options: any }>();
const opts = props.options || {};
const isList = opts.screen === 'list';
const workflow = reactive<Workflow>(opts.workflow || {
  id: null, handle: '', name: '', scope: 'entry', entryTypeUid: '', volumeUid: '', modelConfigUid: '',
  globalPrompt: '', actionButtonLabel: '', showUserPromptInput: true, showOnSidebar: false,
  rows: [], contextRows: [],
});
const workflows = ref<any[]>(opts.workflows || []);
const fields = ref<FieldOption[]>([]);
const fieldsLoaded = ref(false);
const metadataFields = ref<Array<{ key: string; label: string }>>(opts.metadataFields || []);
const busy = ref(false);
const status = ref('');
const errors = ref<Record<string, string[]>>({});
const targetOptions = computed(() => fields.value.filter(field => !field.contextOnly));
const contextOptions = computed(() => fields.value);
const pickerFields = computed(() => (pickerMode.value === 'context' ? contextOptions.value : targetOptions.value).filter(field =>
  `${field.name} ${field.handle || ''}`.toLowerCase().includes(fieldSearch.value.trim().toLowerCase()),
));
const pickerGroups = computed(() => [
  { label: 'Built-in fields', fields: pickerFields.value.filter(field => field.uid.startsWith('__')) },
  { label: 'Custom fields', fields: pickerFields.value.filter(field => !field.uid.startsWith('__')) },
].filter(group => group.fields.length));
const currentScopeUid = computed(() => workflow.scope === 'entry' ? workflow.entryTypeUid : workflow.volumeUid);
const search = ref('');
const scopeFilter = ref('');
const filteredWorkflows = computed(() => workflows.value.filter(item =>
  (!scopeFilter.value || item.scope === scopeFilter.value) &&
  `${item.name} ${item.handle} ${item.entryTypeName || ''} ${item.volumeName || ''}`.toLowerCase().includes(search.value.toLowerCase().trim()),
));
function unavailableField(uid: string) {
  return !!currentScopeUid.value && fieldsLoaded.value && !fields.value.some(field => field.uid === uid);
}
function needsInstructions(row: any) {
  return row.enabled !== false && !row.prompt?.trim();
}
function fieldIcon(uid: string) {
  return fields.value.find(field => field.uid === uid)?.iconSvg || '';
}
function fieldName(uid: string, fallback: string) {
  return fields.value.find(field => field.uid === uid)?.name || (uid ? 'Unavailable field' : fallback);
}


function usedPlacement(uid: string): string {
  if (workflow.contextRows.some(row => row.fieldUid === uid)) return 'Already in context';
  if (workflow.rows.some(row => row.targetFieldUid === uid)) return 'Already in outputs';
  return '';
}

function bool(value: unknown, fallback = true) { return value === undefined || value === null ? fallback : value === true || value === 1 || value === '1'; }
function freshRow() {
  return { targetFieldUid: '', prompt: '', requiresApproval: true, includeCurrentFieldValue: true, overrideCurrentValue: true, enabled: true,
    seomatic: { includeSeoTitle: true, includeSiteNamePosition: true, includeSeoDescription: true, includeSeoKeywords: true },
    related: { mode: 'topN', topN: 25, forceUseCurrentValues: false },
    link: { entry: { mode: 'topN', count: 10 }, category: { mode: 'topN', count: 10 }, asset: { mode: 'topN', count: 10 } },
    assets: { metadata: ['title', 'filename'], includeFile: false, maxFiles: 3 } };
}
function normalizeState() {
  workflow.rows = (workflow.rows || []).map((row: any) => ({ ...freshRow(), ...row,
    seomatic: { ...freshRow().seomatic, ...(row.seomatic || {}) },
    related: { ...freshRow().related, ...(row.related || {}) },
    link: { ...freshRow().link, ...(row.link || {}) },
    assets: { ...freshRow().assets, ...(row.assets || {}) },
  }));
  workflow.contextRows = (workflow.contextRows || []).map((row: any) => ({ fieldUid: '', prompt: '', enabled: true, ...row,
    assets: { metadata: ['title', 'filename'], includeFile: false, maxFiles: 1, ...(row.assets || {}) },
  }));
}
normalizeState();
const expandedOutputs = reactive(new Set<any>());
const expandedContexts = reactive(new Set<any>());
workflow.rows.forEach((row, index) => { if (!workflow.id || index === 0) expandedOutputs.add(row); });
workflow.contextRows.forEach(row => { if (!workflow.id) expandedContexts.add(row); });
function toggleField(panel: 'context' | 'output', row: any) {
  const expanded = panel === 'context' ? expandedContexts : expandedOutputs;
  const wasOpen = activePanel.value === panel && expanded.has(row);
  selectPanel(panel);
  if (wasOpen) expanded.delete(row);
  else expanded.add(row);
}
function selectPanel(panel: 'context' | 'output' | null) {
  activePanel.value = panel;
  if (panel !== 'output') expandedOutputs.clear();
  if (panel !== 'context') expandedContexts.clear();
}
async function revealNewField(panel: 'context' | 'output') {
  await nextTick();
  const section = page.value?.querySelector(panel === 'context' ? '#workflow-source' : '#workflow-outputs');
  const card = section?.querySelector<HTMLElement>('.af-sort-item:last-child');
  card?.scrollIntoView({ behavior: 'instant', block: 'nearest' });
  card?.querySelector<HTMLElement>('pk-textarea, textarea')?.focus({ preventScroll: true });
}
function openFieldPicker(mode: 'context' | 'output', event: Event) {
  pickerAnchor.value = event.currentTarget as HTMLElement;
  selectPanel(mode);
  fieldSearch.value = '';
  pickerMode.value = mode;
}
function addOutput(event: Event) { openFieldPicker('output', event); }
function addContext(event: Event) { openFieldPicker('context', event); }
function chooseField(field: FieldOption) {
  const mode = pickerMode.value;
  if (!mode || usedPlacement(field.uid)) return;
  selectPanel(mode);
  if (mode === 'output') {
    workflow.rows.push({ ...freshRow(), targetFieldUid: field.uid });
    expandedOutputs.add(workflow.rows[workflow.rows.length - 1]);
  } else {
    workflow.contextRows.push({ fieldUid: field.uid, prompt: '', enabled: true, assets: { metadata: ['title', 'filename'], includeFile: false, maxFiles: 1 } });
    expandedContexts.add(workflow.contextRows[workflow.contextRows.length - 1]);
  }
  pendingFieldFocus = mode;
  pickerMode.value = null;
}
function finishFieldPicker() {
  if (!pendingFieldFocus) return;
  const mode = pendingFieldFocus;
  pendingFieldFocus = null;
  void revealNewField(mode);
}
function suggestedHandle(name: string) {
  const value = name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return value && !/^[a-z]/.test(value) ? `workflow-${value}` : value;
}
watch(() => workflow.name, (name, previous) => {
  if (!workflow.id && (!workflow.handle || workflow.handle === suggestedHandle(previous))) workflow.handle = suggestedHandle(name);
});
function hasAdapterOptions(row: any) { return ['seomatic', 'entries', 'categories', 'tags', 'link', 'assets'].includes(adapterFor(row.targetFieldUid)); }
function adapterFor(uid: string) { return fields.value.find(field => field.uid === uid)?.adapter || ''; }
function canShowRelated(row: any) { return ['entries', 'categories', 'tags'].includes(adapterFor(row.targetFieldUid)); }
function selectedContextIsAssets(row: any) { return adapterFor(row.fieldUid) === 'assets' || row.fieldUid === '__asset__:file'; }
function rowError(path: string) { return errors.value[path]?.[0] || ''; }


async function requestJson(url: string, body?: any) {
  const response = await fetch(url, {
    method: body === undefined ? 'GET' : 'POST',
    headers: body === undefined ? { Accept: 'application/json' } : { 'Content-Type': 'application/json', Accept: 'application/json', 'X-CSRF-Token': window.Craft?.csrfTokenValue || '' },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: 'same-origin',
  });
  const json = await response.json();
  if (!response.ok || json.success === false) throw Object.assign(new Error(json.error || `Request failed (${response.status})`), { payload: json });
  return json;
}
async function loadFields() {
  fields.value = [];
  fieldsLoaded.value = false;
  if (!currentScopeUid.value || !opts.fieldsUrl) return;
  try {
    const result = await requestJson(opts.fieldsUrl, { scope: workflow.scope, entryTypeUid: workflow.entryTypeUid, volumeUid: workflow.volumeUid });
    fields.value = Array.isArray(result.fields) ? result.fields : [];
    fieldsLoaded.value = true;
    metadataFields.value = Array.isArray(result.metadataFields) ? result.metadataFields : [];
  } catch (error: any) {
    status.value = error.message || 'Could not load fields for this scope.';
  }
}
watch(currentScopeUid, loadFields, { immediate: true });

async function save() {
  busy.value = true; errors.value = {}; status.value = '';
  try {
    const payload = JSON.parse(JSON.stringify(workflow));
    payload.rows = payload.rows.map((row: any) => ({ ...row,
      requiresApproval: bool(row.requiresApproval), includeCurrentFieldValue: bool(row.includeCurrentFieldValue),
      overrideCurrentValue: bool(row.overrideCurrentValue), enabled: bool(row.enabled),
      seomatic: Object.fromEntries(Object.entries(row.seomatic || {}).map(([key, value]) => [key, bool(value)])),
      related: { ...row.related, forceUseCurrentValues: bool(row.related?.forceUseCurrentValues, false) },
    }));
    payload.contextRows = payload.contextRows.map((row: any) => ({ ...row, enabled: bool(row.enabled) }));
    const result = await requestJson(opts.saveUrl, { workflow: payload });
    (window.Craft as any)?.cp?.displayNotice('Workflow saved.');
    if (result.workflow) {
      const outputIndexes = workflow.rows.map((row, index) => expandedOutputs.has(row) ? index : -1);
      const contextIndexes = workflow.contextRows.map((row, index) => expandedContexts.has(row) ? index : -1);
      Object.assign(workflow, result.workflow);
      expandedOutputs.clear(); expandedContexts.clear();
      outputIndexes.forEach(index => { if (workflow.rows[index]) expandedOutputs.add(workflow.rows[index]); });
      contextIndexes.forEach(index => { if (workflow.contextRows[index]) expandedContexts.add(workflow.contextRows[index]); });
    }
    window.history.replaceState({}, '', result.editUrl || opts.editUrl || window.location.href);
  } catch (error: any) {
    const details = error.payload?.errors;
    if (details && typeof details === 'object') errors.value = details;
    status.value = error.message || 'Could not save this workflow.';
  } finally { busy.value = false; }
}

async function removeWorkflow(item: any) {
  if (!window.confirm(`Delete “${item.name}”? Fields that reference this handle will no longer show Autofill until a workflow with the same handle exists.`)) return;
  try {
    await requestJson(opts.deleteUrl, { id: item.id });
    workflows.value = workflows.value.filter(entry => entry.id !== item.id);
  } catch (error: any) { status.value = error.message || 'Could not delete workflow.'; }
}

function updateValue(target: any, key: string, event: Event, numeric = false) {
  const value = (event.target as HTMLElement & { value?: string | number }).value;
  target[key] = numeric ? Number(value) : String(value ?? '');
}
</script>


<template>
  <main ref="page" class="af-page" :class="{ 'af-editor': !isList }">
    <template v-if="isList">
      <div v-if="status" class="af-banner af-banner--error" role="alert">{{ status }}</div>
      <section class="af-workflow-list">
        <div class="af-workflow-list-tools">
          <div class="texticon search icon"><input class="text fullwidth" type="search" aria-label="Search workflows" placeholder="Search workflows" v-model="search" /></div>
          <div class="select"><select aria-label="Content type" v-model="scopeFilter"><option value="">All workflows</option><option value="entry">Entries</option><option value="asset">Assets</option></select></div>
        </div>
        <div v-if="filteredWorkflows.length" class="af-table-wrap">
          <table class="data fullwidth af-workflow-table">
            <thead><tr><th>Name</th><th>Applies to</th><th><span class="visually-hidden">Actions</span></th></tr></thead>
            <tbody>
              <tr v-for="item in filteredWorkflows" :key="item.id">
                <td><a :href="`${opts.editBaseUrl}/${encodeURIComponent(item.handle)}`">{{ item.name }}</a></td>
                <td>{{ item.scope === 'asset' ? item.volumeName || 'Unavailable volume' : item.entryTypeName || 'Unavailable entry type' }} <span class="af-list-scope">· {{ item.scope === 'asset' ? 'Assets' : 'Entries' }}</span></td>
                <td><details class="af-menu"><summary :aria-label="`Actions for ${item.name}`">•••</summary><div class="af-menu-content"><a :href="`${opts.editBaseUrl}/${encodeURIComponent(item.handle)}`">Edit workflow</a><button type="button" class="af-danger" @click="removeWorkflow(item)">Delete workflow</button></div></details></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="af-empty"><p>{{ workflows.length ? 'No matching workflows.' : 'No workflows yet.' }}</p><button v-if="workflows.length" type="button" class="btn" @click="search = ''; scopeFilter = ''">Clear filters</button></div>
      </section>
    </template>

    <template v-else>
      <Teleport to="#autofill-workflow-actions">
        <button type="button" class="btn submit" :disabled="busy" @click="save">{{ busy ? 'Saving…' : 'Save workflow' }}</button>
      </Teleport>
      <div v-if="status" class="af-banner af-banner--error" role="alert">{{ status }}</div>
      <div v-if="Object.keys(errors).length" class="af-banner af-banner--error" role="alert"><ul style="margin:0;padding-left:18px"><li v-for="(messages, attribute) in errors" :key="attribute">{{ messages.join(' ') }}</li></ul></div>

      <section class="af-card" id="workflow-basics">
        <div class="af-section-title"><span class="af-step">1</span><div><h2>Basics</h2></div></div>
        <div class="af-grid">
          <div><Input class="af-control" label="Name" :value="workflow.name" placeholder="For example, Product descriptions" autocomplete="off" @input="updateValue(workflow, 'name', $event)"></Input><span v-if="rowError('name')" class="af-error">{{ rowError('name') }}</span></div>

          <label><span class="af-label">Applies to</span><div class="select fullwidth"><select v-model="workflow.scope"><option value="entry">Entries</option><option value="asset">Assets</option></select></div></label>
          <label v-if="workflow.scope === 'entry'"><span class="af-label">Entry type</span><div class="select fullwidth"><select v-model="workflow.entryTypeUid"><option value="">Select an entry type</option><option v-for="entryType in opts.entryTypes" :key="entryType.uid" :value="entryType.uid">{{ entryType.name }}</option></select></div><span v-if="rowError('entryTypeUid')" class="af-error">{{ rowError('entryTypeUid') }}</span></label>
          <label v-else><span class="af-label">Asset volume</span><div class="select fullwidth"><select v-model="workflow.volumeUid"><option value="">Select an asset volume</option><option v-for="volume in opts.volumes" :key="volume.uid" :value="volume.uid">{{ volume.name }}</option></select></div><span v-if="rowError('volumeUid')" class="af-error">{{ rowError('volumeUid') }}</span></label>

        </div>
        <details class="af-advanced" :open="!!errors.handle"><summary>Advanced</summary><div class="af-grid">          <div><Input class="af-control code" label="Handle" :value="workflow.handle" placeholder="product-descriptions" autocomplete="off" @input="updateValue(workflow, 'handle', $event)"></Input><span class="af-inline-help"><HelpTip label="About workflow handles" text="For new workflows, this is filled from the name. Autofill fields connect to this handle. Changing it can leave existing fields disconnected until their references are updated." /></span><span v-if="rowError('handle')" class="af-error">{{ rowError('handle') }}</span></div>          <label class="af-full"><span class="af-label">Model configuration</span><div class="select fullwidth"><select v-model="workflow.modelConfigUid"><option value="">Use the default configured model</option><option v-for="model in opts.modelConfigs" :key="model.uid" :value="model.uid">{{ model.label || model.modelId || model.provider }}</option></select></div></label></div></details>
      </section>
      <div class="af-builder" :class="`af-builder--${activePanel}`">
      <section class="af-card af-builder-panel" id="workflow-source" @click="selectPanel('context')" :class="{ 'af-panel--active': activePanel === 'context' }">
        <div class="af-panel-header"><h2><button type="button" class="af-panel-tab" :aria-expanded="activePanel === 'context'" @click="selectPanel('context')"><svg class="af-role-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M10 5C7 3 4 3 2 4v12c2-1 5-1 8 1 3-2 6-2 8-1V4c-2-1-5-1-8 1Zm0 0v12" /></svg>Context <span class="af-field-count">{{ workflow.contextRows.length }}</span></button><HelpTip label="About context fields" text="These fields supply information to the model. Autofill does not change their values. Select a field to edit its instructions." /></h2><Button variant="secondary" :disabled="!currentScopeUid" @click="addContext">Add field</Button></div>
        <p v-if="activePanel !== 'context' && workflow.globalPrompt?.trim()" class="af-shared-preview"><span>Shared instructions</span>{{ workflow.globalPrompt }}</p>
        <div v-show="activePanel === 'context'" class="af-shared-instructions"><Textarea class="af-control" label="Shared instructions (optional)" rows="2" :value="workflow.globalPrompt" placeholder="Shared tone, quality, or compliance instructions" @input="updateValue(workflow, 'globalPrompt', $event)"></Textarea><span v-if="rowError('globalPrompt')" class="af-error">{{ rowError('globalPrompt') }}</span></div>

        <p v-if="!currentScopeUid" class="af-muted">Choose a scope above to load context fields.</p>
        <SortableFields :items="workflow.contextRows" label="context" @reorder="(from, to) => workflow.contextRows.splice(to, 0, workflow.contextRows.splice(from, 1)[0])" @remove="index => workflow.contextRows.splice(index, 1)">
        <template #default="{ row, index }">
        <details class="af-row" :class="{ 'af-field--error': unavailableField(row.fieldUid) }" :open="activePanel === 'context' && expandedContexts.has(row)">
          <summary class="af-row-head af-context-summary" @click.prevent.stop="toggleField('context', row)"><span v-if="fieldIcon(row.fieldUid)" class="cp-icon medium af-field-type-icon" aria-hidden="true" v-html="fieldIcon(row.fieldUid)"></span><div class="af-field-heading"><strong>{{ fieldName(row.fieldUid, 'Unassigned context field') }}</strong><span v-if="unavailableField(row.fieldUid)" class="af-field-status af-field-status--error">Unavailable</span><span v-else-if="row.prompt?.trim()" class="af-instruction-preview">{{ row.prompt }}</span></div></summary>
          <div class="af-row-body">
            <p v-if="unavailableField(row.fieldUid)" class="af-error">This field is unavailable in the selected layout. Remove this card and add a replacement field.</p>
            <div class="af-grid">
              <div><Textarea class="af-control" label="Instructions (optional)" rows="2" :value="row.prompt" placeholder="How should the model interpret this field?" @input="updateValue(row, 'prompt', $event)"></Textarea></div>
            </div>
            <details class="af-advanced"><summary>Advanced</summary>
            <div class="af-toggle-list" style="margin-top:12px"><Checkbox class="af-toggle" :checked="row.enabled" @update:checked="row.enabled = $event">Row enabled</Checkbox></div>
            <div v-if="selectedContextIsAssets(row)" class="af-card" style="margin-top:14px">
              <strong>Asset content</strong>
              <details class="af-format-help"><summary>Supported formats and file limits</summary><p>Reads the first N selected assets in field order, up to the per-field limit below (1–20). Content support depends on the provider and model: JPEG, PNG, GIF, WebP, text/*, JSON, XML, and RTF are supported; PDFs are supported except with DeepSeek. Unsupported content stops the whole run. Each file is limited to 10 MiB, with a 20 MiB combined limit.</p></details>
              <div class="af-grid">
                <Checkbox class="af-toggle" :checked="row.assets.includeFile" @update:checked="row.assets.includeFile = $event">Include file content</Checkbox>
                <div><Input class="af-control" label="Maximum assets" type="number" min="1" max="20" :value="row.assets.maxFiles" @input="updateValue(row.assets, 'maxFiles', $event, true)"></Input></div>
              </div>
              <div class="af-toggle-list" style="margin-top:10px">
                <span class="af-label">Metadata</span>
                <Checkbox v-for="metadata in metadataFields" :key="metadata.key" class="af-toggle" :checked="row.assets.metadata.includes(metadata.key)" @update:checked="(checked: boolean) => row.assets.metadata = checked ? [...new Set([...row.assets.metadata, metadata.key])] : row.assets.metadata.filter((item: string) => item !== metadata.key)">{{ metadata.label }}</Checkbox>
              </div>
            </div>
            </details>
          </div>
        </details>
        </template></SortableFields>
      </section>

      <section class="af-card af-builder-panel" id="workflow-outputs" @click="selectPanel('output')" :class="{ 'af-panel--active': activePanel === 'output' }">
        <div class="af-panel-header"><h2><button type="button" class="af-panel-tab" :aria-expanded="activePanel === 'output'" @click="selectPanel('output')"><svg class="af-role-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m4 12 9-9 4 4-9 9-5 1 1-5Zm7-7 4 4M4 12l4 4" /></svg>Output fields <span class="af-field-count">{{ workflow.rows.length }}</span></button><HelpTip label="About output fields" text="Choose the fields Autofill will write, then give each one instructions. Drag the handles to reorder fields. Review and replacement rules are under Advanced." /></h2><Button variant="secondary" :disabled="!currentScopeUid" @click="addOutput">Add field</Button></div>
        <p v-if="!currentScopeUid" class="af-inline-note">Choose an entry type or asset volume in Basics to see its fields.</p>
        <SortableFields :items="workflow.rows" label="output" @reorder="(from, to) => workflow.rows.splice(to, 0, workflow.rows.splice(from, 1)[0])" @remove="index => workflow.rows.splice(index, 1)">
        <template #default="{ row, index }">
        <details class="af-output" :class="{ 'af-output--disabled': !row.enabled, 'af-field--error': unavailableField(row.targetFieldUid), 'af-field--attention': !unavailableField(row.targetFieldUid) && needsInstructions(row) }" :open="activePanel === 'output' && expandedOutputs.has(row)">
          <summary class="af-output-summary" @click.prevent.stop="toggleField('output', row)"><span v-if="fieldIcon(row.targetFieldUid)" class="cp-icon medium af-field-type-icon" aria-hidden="true" v-html="fieldIcon(row.targetFieldUid)"></span><span class="af-field-heading"><strong>{{ fieldName(row.targetFieldUid, 'Unassigned output field') }}</strong><span v-if="unavailableField(row.targetFieldUid)" class="af-field-status af-field-status--error">Unavailable</span><span v-else-if="needsInstructions(row)" class="af-field-status af-field-status--attention">Needs instructions</span><span v-else-if="row.prompt?.trim()" class="af-instruction-preview">{{ row.prompt }}</span></span></summary>
          <div class="af-row-body">
            <p v-if="unavailableField(row.targetFieldUid)" class="af-error">This field is unavailable in the selected layout. Remove this card and add a replacement field.</p>
            <div class="af-prompt"><Textarea class="af-control" label="Instructions" :value="row.prompt" rows="2" placeholder="For example, Write a concise product summary using only facts from the source information." @input="updateValue(row, 'prompt', $event)"></Textarea></div>
            <p v-if="!unavailableField(row.targetFieldUid) && needsInstructions(row)" class="af-attention-note">Add instructions so Autofill knows what to write.</p>
            <details class="af-advanced"><summary>Advanced</summary>
            <div class="af-behavior-grid">
              <div><span class="af-label-line"><label class="af-label" :for="`af-review-${index}`">Apply suggestions</label><HelpTip label="About review requirements" text="Review before applying lets an editor inspect and edit the suggestion. Automatic application saves eligible suggestions without opening the review dialog." /></span><div class="select fullwidth"><select :id="`af-review-${index}`" :value="row.requiresApproval ? 'review' : 'automatic'" @change="row.requiresApproval = ($event.target as HTMLSelectElement).value === 'review'"><option value="review">Review before applying</option><option value="automatic">Apply automatically</option></select></div></div>
              <div><span class="af-label-line"><label class="af-label" :for="`af-existing-${index}`">Existing content</label><HelpTip label="About replacing existing content" text="Only fill empty fields preserves existing content. Replace existing content allows an accepted or automatically applied suggestion to change it." /></span><div class="select fullwidth"><select :id="`af-existing-${index}`" :value="row.overrideCurrentValue ? 'replace' : 'empty'" @change="row.overrideCurrentValue = ($event.target as HTMLSelectElement).value === 'replace'"><option value="empty">Only fill empty fields</option><option value="replace">Replace existing content</option></select></div></div>
            </div>
            <div class="af-row-options"><div class="af-label-line"><Checkbox class="af-toggle" :checked="row.includeCurrentFieldValue" @update:checked="row.includeCurrentFieldValue = $event">Use the current value as context</Checkbox><HelpTip label="About current values as context" text="Includes this field's current content in the AI instructions. This is separate from whether Autofill may replace the value." /></div><Checkbox class="af-toggle" :checked="row.enabled" @update:checked="row.enabled = $event">Output enabled</Checkbox></div>
            <details v-if="hasAdapterOptions(row)" class="af-format-help"><summary>Field-specific options</summary>
              <div v-if="adapterFor(row.targetFieldUid) === 'seomatic'" class="af-toggle-list">
                <strong>SEO prompt includes</strong>
                <Checkbox class="af-toggle" :checked="row.seomatic.includeSeoTitle" @update:checked="row.seomatic.includeSeoTitle = $event">SEO title and source</Checkbox>
                <Checkbox class="af-toggle" :checked="row.seomatic.includeSiteNamePosition" @update:checked="row.seomatic.includeSiteNamePosition = $event">Site name position and source</Checkbox>
                <Checkbox class="af-toggle" :checked="row.seomatic.includeSeoDescription" @update:checked="row.seomatic.includeSeoDescription = $event">SEO description and source</Checkbox>
                <Checkbox class="af-toggle" :checked="row.seomatic.includeSeoKeywords" @update:checked="row.seomatic.includeSeoKeywords = $event">SEO keywords and source</Checkbox>
              </div>
              <div v-if="canShowRelated(row)" class="af-grid" style="margin-top:14px">
                <label><span class="af-label">Related selection</span><div class="select fullwidth"><select v-model="row.related.mode"><option value="topN">Top N</option><option value="all">All</option></select></div></label>
                <div v-if="row.related.mode === 'topN'"><Input class="af-control" label="Top N" type="number" min="1" max="500" :value="row.related.topN" @input="updateValue(row.related, 'topN', $event, true)"></Input></div>
                <Checkbox class="af-toggle" :checked="row.related.forceUseCurrentValues" @update:checked="row.related.forceUseCurrentValues = $event">Keep selected related items first</Checkbox>
              </div>
              <div v-if="adapterFor(row.targetFieldUid) === 'link'" class="af-card">
                <strong>Link candidate scope</strong>
                <div v-for="type in ['entry', 'category', 'asset']" :key="type" class="af-grid" style="margin-top:12px">
                  <label><span class="af-label">{{ type }} links</span><div class="select fullwidth"><select v-model="row.link[type].mode"><option value="topN">Top N</option><option value="mostRecent">Most recent</option><option value="all">All</option><option value="none">None</option></select></div></label>
                  <div v-if="!['all','none'].includes(row.link[type].mode)"><Input class="af-control" label="Candidate count" type="number" min="1" max="250" :value="row.link[type].count" @input="updateValue(row.link[type], 'count', $event, true)"></Input></div>
                </div>
              </div>
              <div v-if="adapterFor(row.targetFieldUid) === 'assets'" class="af-card">
                <strong>Asset context</strong>
                <details class="af-format-help"><summary>Supported formats and file limits</summary><p>Reads the first N selected assets in field order, up to the per-field limit below (1–20). Content support depends on the provider and model: JPEG, PNG, GIF, WebP, text/*, JSON, XML, and RTF are supported; PDFs are supported except with DeepSeek. Unsupported content stops the whole run. Each file is limited to 10 MiB, with a 20 MiB combined limit.</p></details>
                <div class="af-grid">
                  <Checkbox class="af-toggle" :checked="row.assets.includeFile" @update:checked="row.assets.includeFile = $event">Include file content</Checkbox>
                  <div><Input class="af-control" label="Maximum assets" type="number" min="1" max="20" :value="row.assets.maxFiles" @input="updateValue(row.assets, 'maxFiles', $event, true)"></Input></div>
                </div>
                <div class="af-toggle-list" style="margin-top:10px">
                  <span class="af-label">Metadata</span>
                  <Checkbox v-for="metadata in metadataFields" :key="metadata.key" class="af-toggle" :checked="row.assets.metadata.includes(metadata.key)" @update:checked="(checked: boolean) => row.assets.metadata = checked ? [...new Set([...row.assets.metadata, metadata.key])] : row.assets.metadata.filter((item: string) => item !== metadata.key)">{{ metadata.label }}</Checkbox>
                </div>
              </div>

            </details>
            </details>
          </div>
        </details>
        </template></SortableFields>
        <p v-if="!workflow.rows.length" class="af-inline-note">Add an output field to tell Autofill what to write.</p>
      </section>
      </div>
      <details class="af-card af-editor-options" id="workflow-placement">
        <summary>Editor options <HelpTip label="About editor options" text="Customize the Autofill button, sidebar placement, and whether editors can add instructions at run time." /></summary>
        <div class="af-grid"><div><Input class="af-control" label="Action button label" :value="workflow.actionButtonLabel" placeholder="Autofill" @input="updateValue(workflow, 'actionButtonLabel', $event)"></Input></div><div class="af-placement-options"><Checkbox class="af-toggle" :checked="workflow.showUserPromptInput" @update:checked="workflow.showUserPromptInput = $event">Let editors add a prompt</Checkbox><div class="af-label-line"><Checkbox class="af-toggle" :checked="workflow.showOnSidebar" @update:checked="workflow.showOnSidebar = $event">{{ workflow.scope === 'entry' ? 'Show this workflow in the entry sidebar' : 'Show this workflow in the asset sidebar' }}</Checkbox><HelpTip label="About sidebar placement" text="Shows the workflow on matching content editors, independently of any inline Autofill field. Both placements can be used together." /></div></div></div>
        <div class="af-placement-help"><HelpTip label="About inline placement" text="To place Autofill beside a particular field, add an Autofill field to the layout and reference this workflow’s handle." /></div>
      </details>
      <NativeFieldPicker :open="pickerMode !== null" :anchor="pickerAnchor" :label="pickerMode === 'context' ? 'Add context field' : 'Add output field'" @close="pickerMode = null" @show="fieldSearchInput?.focus()" @hidden="finishFieldPicker">
        <div class="fld-library af-native-field-picker">
          <div class="texticon search icon"><input ref="fieldSearchInput" v-model="fieldSearch" class="text fullwidth" type="search" aria-label="Search fields" placeholder="Search" autocomplete="off" /></div>
          <div class="fld-field-library">
            <div v-for="group in pickerGroups" :key="group.label" class="fld-field-group">
              <h6>{{ group.label }}</h6>
              <button v-for="field in group.fields" :key="field.uid" type="button" class="fld-element fld-field af-native-field-choice" :disabled="!!usedPlacement(field.uid)" @click="chooseField(field)">
                <span v-if="field.iconSvg" class="cp-icon medium" aria-hidden="true" v-html="field.iconSvg"></span>
                <span class="field-name"><span class="fld-element-label"><h4>{{ field.name }}{{ pickerMode === 'output' && field.availableInLiteVersion === false ? ' · Pro' : '' }}</h4></span><span v-if="usedPlacement(field.uid) || field.handle" class="fld-attribute"><span class="smalltext light fld-attribute-label" :class="{ code: !usedPlacement(field.uid) }">{{ usedPlacement(field.uid) || field.handle }}</span></span></span>
              </button>
            </div>
            <p v-if="!pickerFields.length" class="light">{{ fieldSearch ? 'No matching fields.' : 'No fields available for this content type.' }}</p>
          </div>
        </div>
      </NativeFieldPicker>
    </template>
  </main>
</template>
