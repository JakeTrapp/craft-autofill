<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { Button, Checkbox, Input, Textarea } from '@verbb/plugin-kit-vue/components';

type FieldOption = { uid: string; name: string; handle?: string; adapter?: string; availableInLiteVersion?: boolean; contextOnly?: boolean };
type Workflow = {
  id: number | null; uid?: string; handle: string; name: string; scope: 'entry' | 'asset';
  entryTypeUid: string; volumeUid: string; modelConfigUid: string; globalPrompt: string;
  actionButtonLabel: string; showUserPromptInput: boolean; showOnSidebar: boolean;
  rows: any[]; contextRows: any[];
};
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
const metadataFields = ref<Array<{ key: string; label: string }>>(opts.metadataFields || []);
const busy = ref(false);
const status = ref('');
const statusKind = ref<'error' | 'success'>('error');
const errors = ref<Record<string, string[]>>({});
const targetOptions = computed(() => fields.value.filter(field => !field.contextOnly));
const contextOptions = computed(() => fields.value);
const currentScopeUid = computed(() => workflow.scope === 'entry' ? workflow.entryTypeUid : workflow.volumeUid);

function optionLabel(field: FieldOption) {
  return field.handle ? `${field.name} (${field.handle})` : field.name;
}
function withSelected(options: FieldOption[], selected: string): FieldOption[] {
  if (!selected || options.some(option => option.uid === selected)) return options;
  return [{ uid: selected, name: `Saved field (${selected.slice(0, 8)})`, adapter: '' }, ...options];
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
  if (workflow.rows.length === 0) workflow.rows.push(freshRow());
}
normalizeState();
function adapterFor(uid: string) { return fields.value.find(field => field.uid === uid)?.adapter || ''; }
function canShowRelated(row: any) { return ['entries', 'categories', 'tags'].includes(adapterFor(row.targetFieldUid)); }
function selectedContextIsAssets(row: any) { return adapterFor(row.fieldUid) === 'assets' || row.fieldUid === '__asset__:file'; }
function rowError(path: string) { return errors.value[path]?.[0] || ''; }
function moveRow(index: number, direction: number) {
  const next = index + direction;
  if (next < 0 || next >= workflow.rows.length) return;
  const [row] = workflow.rows.splice(index, 1);
  workflow.rows.splice(next, 0, row);
}
function addContext() { workflow.contextRows.push({ fieldUid: '', prompt: '', enabled: true, assets: { metadata: ['title', 'filename'], includeFile: false, maxFiles: 1 } }); }

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
  if (!currentScopeUid.value || !opts.fieldsUrl) return;
  try {
    const result = await requestJson(opts.fieldsUrl, { scope: workflow.scope, entryTypeUid: workflow.entryTypeUid, volumeUid: workflow.volumeUid });
    fields.value = Array.isArray(result.fields) ? result.fields : [];
    metadataFields.value = Array.isArray(result.metadataFields) ? result.metadataFields : [];
  } catch (error: any) {
    statusKind.value = 'error'; status.value = error.message || 'Could not load fields for this scope.';
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
    statusKind.value = 'success'; status.value = 'Workflow saved.';
    if (result.workflow) Object.assign(workflow, result.workflow);
    window.history.replaceState({}, '', result.editUrl || opts.editUrl || window.location.href);
  } catch (error: any) {
    const details = error.payload?.errors;
    if (details && typeof details === 'object') errors.value = details;
    statusKind.value = 'error'; status.value = error.message || 'Could not save this workflow.';
  } finally { busy.value = false; }
}

async function removeWorkflow(item: any) {
  if (!window.confirm(`Delete “${item.name}”? Fields that reference this handle will no longer show Autofill until a workflow with the same handle exists.`)) return;
  try {
    await requestJson(opts.deleteUrl, { id: item.id });
    workflows.value = workflows.value.filter(entry => entry.id !== item.id);
  } catch (error: any) { statusKind.value = 'error'; status.value = error.message || 'Could not delete workflow.'; }
}

function updateValue(target: any, key: string, event: Event, numeric = false) {
  const value = (event.target as HTMLElement & { value?: string | number }).value;
  target[key] = numeric ? Number(value) : String(value ?? '');
}
</script>

<template>
  <main class="af-page">
    <template v-if="isList">
      <header class="af-page-header">
        <div><h1>Workflows</h1><p class="af-muted">Create and manage Autofill configurations for entries and assets.</p></div>
        <a class="btn submit" :href="opts.newUrl">New workflow</a>
      </header>
      <div v-if="status" class="af-banner af-banner--error" role="alert">{{ status }}</div>
      <section class="af-card">
        <div v-if="workflows.length" class="af-table-wrap">
          <table class="af-table">
            <thead><tr><th>Name</th><th>Handle</th><th>Scope</th><th>Sidebar</th><th></th></tr></thead>
            <tbody>
              <tr v-for="item in workflows" :key="item.id">
                <td><a class="af-link" :href="`${opts.editBaseUrl}/${encodeURIComponent(item.handle)}`">{{ item.name }}</a></td>
                <td><code>{{ item.handle }}</code></td>
                <td>{{ item.scope === 'asset' ? item.volumeName || 'Asset volume' : item.entryTypeName || 'Entry type' }}</td>
                <td>{{ item.showOnSidebar ? 'Shown' : 'Hidden' }}</td>
                <td class="af-actions"><a class="btn small" :href="`${opts.editBaseUrl}/${encodeURIComponent(item.handle)}`">Edit</a><Button size="sm" variant="outline" @click="removeWorkflow(item)">Delete</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="af-muted">No workflows yet. Create one to configure generation for an entry type or asset volume.</p>
      </section>
    </template>

    <template v-else>
      <header class="af-page-header">
        <div><h1>{{ workflow.id ? 'Edit workflow' : 'New workflow' }}</h1><p class="af-muted">Configure generation, context, and review behavior.</p></div>
        <a class="btn" :href="opts.listUrl">Back to workflows</a>
      </header>
      <div v-if="status" class="af-banner" :class="statusKind === 'success' ? 'af-banner--success' : 'af-banner--error'" role="status">{{ status }}</div>
      <div v-if="Object.keys(errors).length" class="af-banner af-banner--error" role="alert">
        <ul style="margin:0;padding-left:18px"><li v-for="(messages, attribute) in errors" :key="attribute">{{ messages.join(' ') }}</li></ul>
      </div>

      <section class="af-card">
        <h2>Workflow details</h2>
        <div class="af-grid">
          <div><Input class="af-control" label="Name" :value="workflow.name" autocomplete="off" @input="updateValue(workflow, 'name', $event)"></Input><span v-if="rowError('name')" class="af-error">{{ rowError('name') }}</span></div>
          <div><Input class="af-control code" label="Handle" :value="workflow.handle" autocomplete="off" @input="updateValue(workflow, 'handle', $event)"></Input><span class="af-muted">Fields reference workflows by handle.</span><span v-if="rowError('handle')" class="af-error">{{ rowError('handle') }}</span></div>
          <label><span class="af-label">Applies to</span><select class="select fullwidth" v-model="workflow.scope"><option value="entry">Entries</option><option value="asset">Assets</option></select></label>
          <label v-if="workflow.scope === 'entry'"><span class="af-label">Entry type</span><select class="select fullwidth" v-model="workflow.entryTypeUid"><option value="">Select an entry type</option><option v-for="entryType in opts.entryTypes" :key="entryType.uid" :value="entryType.uid">{{ entryType.name }}</option></select><span v-if="rowError('entryTypeUid')" class="af-error">{{ rowError('entryTypeUid') }}</span></label>
          <label v-else><span class="af-label">Asset volume</span><select class="select fullwidth" v-model="workflow.volumeUid"><option value="">Select an asset volume</option><option v-for="volume in opts.volumes" :key="volume.uid" :value="volume.uid">{{ volume.name }}</option></select><span v-if="rowError('volumeUid')" class="af-error">{{ rowError('volumeUid') }}</span></label>
          <label><span class="af-label">Model configuration</span><select class="select fullwidth" v-model="workflow.modelConfigUid"><option value="">Use the default configured model</option><option v-for="model in opts.modelConfigs" :key="model.uid" :value="model.uid">{{ model.label || model.modelId || model.provider }}</option></select><span class="af-muted">Credentials stay in plugin settings.</span></label>
          <div><Input class="af-control" label="Action button label" :value="workflow.actionButtonLabel" placeholder="Autofill" @input="updateValue(workflow, 'actionButtonLabel', $event)"></Input></div>
        </div>
        <div class="af-toggle-list" style="margin-top:16px">
          <Checkbox class="af-toggle" :checked="workflow.showUserPromptInput" @update:checked="workflow.showUserPromptInput = $event">Let editors add a prompt</Checkbox>
          <Checkbox class="af-toggle" v-if="workflow.scope === 'entry'" :checked="workflow.showOnSidebar" @update:checked="workflow.showOnSidebar = $event">Show this workflow in the entry sidebar</Checkbox>
          <Checkbox class="af-toggle" v-else :checked="workflow.showOnSidebar" @update:checked="workflow.showOnSidebar = $event">Show this workflow in the asset sidebar</Checkbox>
        </div>
      </section>

      <section class="af-card">
        <div class="af-page-header"><div><h2>Output fields</h2><p class="af-muted">Rows run in order. Each row describes one output.</p></div><Button variant="secondary" @click="workflow.rows.push(freshRow())">Add output field</Button></div>
        <p v-if="!currentScopeUid" class="af-muted">Choose a scope above to load its available fields.</p>
        <article v-for="(row, index) in workflow.rows" :key="index" class="af-row">
          <div class="af-row-head"><strong>Output {{ index + 1 }}</strong><div class="af-actions"><Button size="sm" variant="secondary" :disabled="index === 0" aria-label="Move up" @click="moveRow(index, -1)">Move up</Button><Button size="sm" variant="secondary" :disabled="index === workflow.rows.length - 1" aria-label="Move down" @click="moveRow(index, 1)">Move down</Button><Button size="sm" variant="ghost" @click="workflow.rows.splice(index, 1)">Remove</Button></div></div>
          <div class="af-row-body">
            <div class="af-grid">
              <label><span class="af-label">Target field</span><select class="select fullwidth" v-model="row.targetFieldUid"><option value="">Select a field</option><option v-for="field in withSelected(targetOptions, row.targetFieldUid)" :key="field.uid" :value="field.uid">{{ optionLabel(field) }}{{ field.availableInLiteVersion === false ? ' · Pro' : '' }}</option></select></label>
              <div><Textarea class="af-control" label="Prompt" :value="row.prompt" rows="2" placeholder="Describe how this field should be generated" @input="updateValue(row, 'prompt', $event)"></Textarea></div>
            </div>
            <details style="margin-top:14px"><summary>Advanced settings</summary>
              <div class="af-toggle-list" style="margin:12px 0">
                <Checkbox class="af-toggle" :checked="row.requiresApproval" @update:checked="row.requiresApproval = $event">Requires editor approval</Checkbox>
                <Checkbox class="af-toggle" :checked="row.includeCurrentFieldValue" @update:checked="row.includeCurrentFieldValue = $event">Include current value in prompt</Checkbox>
                <Checkbox class="af-toggle" :checked="row.overrideCurrentValue" @update:checked="row.overrideCurrentValue = $event">Override current value</Checkbox>
                <Checkbox class="af-toggle" :checked="row.enabled" @update:checked="row.enabled = $event">Row enabled</Checkbox>
              </div>
              <div v-if="adapterFor(row.targetFieldUid) === 'seomatic'" class="af-toggle-list">
                <strong>SEO prompt includes</strong>
                <Checkbox class="af-toggle" :checked="row.seomatic.includeSeoTitle" @update:checked="row.seomatic.includeSeoTitle = $event">SEO title and source</Checkbox>
                <Checkbox class="af-toggle" :checked="row.seomatic.includeSiteNamePosition" @update:checked="row.seomatic.includeSiteNamePosition = $event">Site name position and source</Checkbox>
                <Checkbox class="af-toggle" :checked="row.seomatic.includeSeoDescription" @update:checked="row.seomatic.includeSeoDescription = $event">SEO description and source</Checkbox>
                <Checkbox class="af-toggle" :checked="row.seomatic.includeSeoKeywords" @update:checked="row.seomatic.includeSeoKeywords = $event">SEO keywords and source</Checkbox>
              </div>
              <div v-if="canShowRelated(row)" class="af-grid" style="margin-top:14px">
                <label><span class="af-label">Related selection</span><select class="select fullwidth" v-model="row.related.mode"><option value="topN">Top N</option><option value="all">All</option></select></label>
                <div v-if="row.related.mode === 'topN'"><Input class="af-control" label="Top N" type="number" min="1" max="500" :value="row.related.topN" @input="updateValue(row.related, 'topN', $event, true)"></Input></div>
                <Checkbox class="af-toggle" :checked="row.related.forceUseCurrentValues" @update:checked="row.related.forceUseCurrentValues = $event">Keep selected related items first</Checkbox>
              </div>
              <div v-if="adapterFor(row.targetFieldUid) === 'link'" class="af-card">
                <strong>Link candidate scope</strong>
                <div v-for="type in ['entry', 'category', 'asset']" :key="type" class="af-grid" style="margin-top:12px">
                  <label><span class="af-label">{{ type }} links</span><select class="select fullwidth" v-model="row.link[type].mode"><option value="topN">Top N</option><option value="mostRecent">Most recent</option><option value="all">All</option><option value="none">None</option></select></label>
                  <div v-if="!['all','none'].includes(row.link[type].mode)"><Input class="af-control" label="Candidate count" type="number" min="1" max="250" :value="row.link[type].count" @input="updateValue(row.link[type], 'count', $event, true)"></Input></div>
                </div>
              </div>
              <div v-if="adapterFor(row.targetFieldUid) === 'assets'" class="af-card">
                <strong>Asset context</strong>
                <p class="af-muted">Reads the first N selected assets in field order, up to the per-field limit below (1–20). Content support depends on the provider and model: JPEG, PNG, GIF, WebP, text/*, JSON, XML, and RTF are supported; PDFs are supported except with DeepSeek. Unsupported content stops the whole run. Each file is limited to 10 MiB, with a 20 MiB combined limit.</p>
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
        </article>
      </section>

      <section class="af-card">
        <h2>Global instructions and context</h2>
        <div><Textarea class="af-control" label="Global prompt" rows="3" :value="workflow.globalPrompt" placeholder="Shared tone, quality, or compliance instructions" @input="updateValue(workflow, 'globalPrompt', $event)"></Textarea><span v-if="rowError('globalPrompt')" class="af-error">{{ rowError('globalPrompt') }}</span></div>
        <div class="af-page-header" style="margin:20px 0 8px"><div><h2>Read-only context fields</h2><p class="af-muted">These values inform generation and are never output targets.</p></div><Button variant="secondary" @click="addContext">Add context field</Button></div>
        <p v-if="!currentScopeUid" class="af-muted">Choose a scope above to load context fields.</p>
        <article v-for="(row, index) in workflow.contextRows" :key="`ctx-${index}`" class="af-row">
          <div class="af-row-head"><strong>Context {{ index + 1 }}</strong><Button size="sm" variant="ghost" @click="workflow.contextRows.splice(index, 1)">Remove</Button></div>
          <div class="af-row-body">
            <div class="af-grid">
              <label><span class="af-label">Context field</span><select class="select fullwidth" v-model="row.fieldUid"><option value="">Select a field</option><option v-for="field in withSelected(contextOptions, row.fieldUid)" :key="field.uid" :value="field.uid">{{ optionLabel(field) }}</option></select></label>
              <div><Textarea class="af-control" label="Context prompt (optional)" rows="2" :value="row.prompt" placeholder="How should the model interpret this field?" @input="updateValue(row, 'prompt', $event)"></Textarea></div>
            </div>
            <div class="af-toggle-list" style="margin-top:12px"><Checkbox class="af-toggle" :checked="row.enabled" @update:checked="row.enabled = $event">Row enabled</Checkbox></div>
            <div v-if="selectedContextIsAssets(row)" class="af-card" style="margin-top:14px">
              <strong>Asset content</strong>
              <p class="af-muted">Reads the first N selected assets in field order, up to the per-field limit below (1–20). Content support depends on the provider and model: JPEG, PNG, GIF, WebP, text/*, JSON, XML, and RTF are supported; PDFs are supported except with DeepSeek. Unsupported content stops the whole run. Each file is limited to 10 MiB, with a 20 MiB combined limit.</p>
              <div class="af-grid">
                <Checkbox class="af-toggle" :checked="row.assets.includeFile" @update:checked="row.assets.includeFile = $event">Include file content</Checkbox>
                <div><Input class="af-control" label="Maximum assets" type="number" min="1" max="20" :value="row.assets.maxFiles" @input="updateValue(row.assets, 'maxFiles', $event, true)"></Input></div>
              </div>
              <div class="af-toggle-list" style="margin-top:10px">
                <span class="af-label">Metadata</span>
                <Checkbox v-for="metadata in metadataFields" :key="metadata.key" class="af-toggle" :checked="row.assets.metadata.includes(metadata.key)" @update:checked="(checked: boolean) => row.assets.metadata = checked ? [...new Set([...row.assets.metadata, metadata.key])] : row.assets.metadata.filter((item: string) => item !== metadata.key)">{{ metadata.label }}</Checkbox>
              </div>
            </div>
          </div>
        </article>
      </section>
      <footer class="af-footer"><a class="btn" :href="opts.listUrl">Cancel</a><Button variant="primary" :loading="busy" :disabled="busy" @click="save">{{ busy ? 'Saving…' : 'Save workflow' }}</Button></footer>
    </template>
  </main>
</template>
