import { expect, test } from '@playwright/test';
import fs from 'node:fs';

type BrowserFixture = {
  username: string;
  password: string;
  managerUsername: string;
  managerPassword: string;
  protectedWorkflowHandle: string;
  editorUsername: string;
  editorPassword: string;
  entryId: number;
  siteId: number;
  autofillFieldId: number;
  entryTypeId: number;
  entryTypeUid: string;
  editorPath: string;
  targetFieldHandle: string;
  outputFields: Array<{ name: string; handle: string }>;
  assetId: number;
  bulkAsset: { id: number; path: string };
  archiveAsset: { id: number; path: string };
  assetEditorPath: string;
  assetCaptionFieldHandle: string;
};

function fixture(): BrowserFixture {
  const path = process.env.AUTOFILL_BROWSER_FIXTURE;
  if (!path || !fs.existsSync(path)) {
    throw new Error('Set AUTOFILL_BROWSER_FIXTURE to the JSON produced by `craft autofill-testbench/seed/browser` in the disposable db_test database.');
  }
  return JSON.parse(fs.readFileSync(path, 'utf8')) as BrowserFixture;
}

async function login(page: import('@playwright/test').Page, data: BrowserFixture) {
  await page.goto('/admin/login');
  await page.getByLabel('Username or Email').first().fill(data.username);
  await page.getByLabel('Password', { exact: true }).first().fill(data.password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).not.toHaveURL(/\/admin\/login(?:\/|$)/);
}

async function expectRunReady(page: import('@playwright/test').Page, runId: number) {
  await expect.poll(() => page.evaluate(async runId => {
    const { data } = await (window as any).Craft.sendActionRequest('POST', 'autofill/workflow-run/status', { data: { runId } });
    if (!data.success || data.run.status === 'failed') throw new Error(data.error || data.run?.error);
    return data.run.status;
  }, runId), { timeout: 10000 }).toBe('ready');
}

async function addWorkflowField(page: import('@playwright/test').Page, kind: 'context' | 'output', name: string) {
  const section = page.locator(kind === 'context' ? '#workflow-source' : '#workflow-outputs');
  const count = await section.locator('.af-sort-item').count();
  await section.getByRole('button', { name: 'Add', exact: true }).click();
  const picker = page.getByRole('dialog', { name: kind === 'context' ? 'Add context field' : 'Add output field' });
  await expect(picker).toBeVisible();
  await expect(section.locator('.af-sort-item')).toHaveCount(count);
  await picker.getByRole('searchbox', { name: 'Search fields' }).fill(name);
  const heading = page.getByRole('heading', { name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?: · Pro)?$`) });
  await picker.getByRole('button').filter({ has: heading }).click();
  await expect(picker).toBeHidden();
  await expect(section.locator('.af-sort-item')).toHaveCount(count + 1);
}

test('create workflow, configure field, generate, review, and persist', async ({ page }) => {
  const data = fixture();
  const runSuffix = Date.now().toString(36);
  const workflowHandle = `browser-review-${runSuffix}`;
  const autofillFieldHandle = `browserWorkflowField${runSuffix}`;
  const autofillFieldName = `Browser workflow ${runSuffix}`;
  await login(page, data);

  await page.goto('/admin/autofill/workflows/new');
  await expect(page.getByRole('heading', { name: 'New workflow', exact: true })).toBeVisible();
  await page.getByLabel('Name', { exact: true }).fill('Browser review workflow');
  const description = 'Generate and review copy for this entry type.';
  await page.getByLabel('Description (optional)').fill(description);
  await page.locator('.af-settings-disclosure > summary').click();
  await page.getByLabel('Handle', { exact: true }).fill(workflowHandle);
  await page.getByRole('combobox', { name: 'Entry type' }).selectOption(data.entryTypeUid);
  const outputFields = [{ name: 'Browser generated summary', handle: data.targetFieldHandle }, ...data.outputFields];
  for (const field of outputFields) {
    await addWorkflowField(page, 'output', field.name);
    await page.locator('#workflow-outputs .af-output').last().getByRole('textbox', { name: 'Instructions', exact: true }).fill(`Generate a valid ${field.name} value.`);
  }
  await page.getByLabel('Action button label', { exact: true }).fill('Generate test summary');
  const showOnSidebar = page.getByRole('checkbox', { name: 'Show this workflow in the entry sidebar' });
  await showOnSidebar.press('Space');
  await expect(showOnSidebar).toBeChecked();
  await page.locator('#header').getByRole('button', { name: 'Save workflow' }).click();
  await expect(page.getByText('Workflow saved.', { exact: true })).toBeVisible();
  await page.goto(`/admin/autofill/workflows/edit/${workflowHandle}`);
  await expect(page.getByLabel('Description (optional)')).toHaveValue(description);
  await page.locator('.af-settings-disclosure > summary').click();
  await expect(page.getByRole('checkbox', { name: 'Show this workflow in the entry sidebar' })).toBeChecked();

  const fieldType = encodeURIComponent('jtdev\\craftautofill\\fields\\AutofillField');
  await page.goto(`/admin/settings/fields/new?type=${fieldType}`);
  await page.getByRole('textbox', { name: /^Name/ }).fill(autofillFieldName);
  await page.getByRole('textbox', { name: /^Handle/ }).fill(autofillFieldHandle);
  const workflowReference = page.getByRole('combobox', { name: 'Workflow' });
  await expect(workflowReference).toBeVisible();
  await workflowReference.fill(workflowHandle);
  await page.locator('button[type="submit"].submit').first().click();
  await expect(page.getByText(autofillFieldName, { exact: true }).first()).toBeVisible();

  await page.goto(`/admin/settings/entry-types/${data.entryTypeId}`);
  await page.locator('.fld-tab .fld-add-btn').first().click();
  const fieldSearch = page.locator('.fld-field-library .search input').first();
  await expect(fieldSearch).toBeVisible();
  await fieldSearch.fill(autofillFieldName);
  const libraryField = page.locator(`.fld-field-library [data-default-handle="${autofillFieldHandle}"]`);
  await expect(libraryField).toBeVisible();
  await libraryField.click();
  await expect(page.locator(`.fld-tabcontent [data-default-handle="${autofillFieldHandle}"]`)).toHaveCount(1);
  await page.keyboard.press('Escape');
  await page.locator('button[type="submit"].submit').first().click();
  await expect(page).toHaveURL(/\/admin\/settings\/entry-types/);

  await page.goto(data.editorPath);
  const workflowRuntimes = page.locator(`[data-autofill-runtime][data-autofill-config*='"workflowHandle":"${workflowHandle}"']`);
  await expect(workflowRuntimes.first()).toBeVisible();
  await expect(workflowRuntimes).toHaveCount(2);
  const workflowConfig = JSON.parse((await workflowRuntimes.first().getAttribute('data-autofill-config')) ?? '{}') as { startRunActionUrl?: string };
  const workflowEndpoint = new URL(workflowConfig.startRunActionUrl ?? '', page.url());
  const workflowGenerateAction = workflowEndpoint.searchParams.get('action') ?? workflowEndpoint.searchParams.get('p') ?? workflowEndpoint.pathname;
  let workflowGenerateRequests = 0;
  page.on('request', request => {
    const url = new URL(request.url());
    const action = url.searchParams.get('action') ?? url.searchParams.get('p') ?? url.pathname;
    if (action === workflowGenerateAction) workflowGenerateRequests++;
  });
  const reviewRows = [{ name: 'Browser generated summary', handle: data.targetFieldHandle }, ...data.outputFields];
  const title = page.locator('input[name="title"]');
  await title.fill('Browser E2E updated title');
  const inlineRuntime = workflowRuntimes.first();
  await inlineRuntime.locator('[data-autofill-generate]').click();
  await expect(inlineRuntime.locator('[data-autofill-generate]')).toHaveText('Review results', { timeout: 30000 });
  await inlineRuntime.locator('[data-autofill-generate]').click();
  const modal = page.locator('[data-autofill-review-modal]:not([hidden])');
  await expect(modal).toHaveCount(1);
  await expect(modal).toHaveJSProperty('open', true);
  await expectCurrentReview(modal, reviewRows[0], 0, reviewRows.length);
  await expect(title).toHaveValue('Browser E2E updated title');
  fs.mkdirSync('tests/browser/artifacts', { recursive: true });
  await page.screenshot({ path: 'tests/browser/artifacts/entry-workflow-review.png', fullPage: true });
  const inlineReload = page.waitForEvent('framenavigated', { predicate: frame => frame === page.mainFrame() });
  await modal.locator('[data-autofill-close]').click();
  await inlineReload;
  await expect(title).toHaveValue('Browser E2E updated title');

  const sidebar = page.getByRole('region', { name: 'Autofill workflows' });
  const sidebarRuntime = sidebar.locator(workflowRuntimes);
  await expect(sidebarRuntime.locator('[data-autofill-sidebar-body]')).toBeHidden();
  await expect(sidebarRuntime.locator('[data-autofill-generate]')).toHaveText('Review');
  await expect(sidebarRuntime.getByRole('button', { name: 'Regenerate results for Browser review workflow' })).toBeVisible();
  await expect(sidebarRuntime.getByRole('button', { name: 'Dismiss run for Browser review workflow' })).toBeVisible();
  await sidebarRuntime.locator('[data-autofill-toggle]').click();
  await expect(sidebarRuntime.getByText(description, { exact: true })).toBeVisible();
  await expect(sidebarRuntime.locator('[data-autofill-user-prompt]')).toBeVisible();
  await sidebarRuntime.locator('[data-autofill-toggle]').click();
  await expect(sidebarRuntime.locator('[data-autofill-sidebar-body]')).toBeHidden();
  await sidebarRuntime.locator('[data-autofill-generate]').click();
  const sidebarModal = page.locator('[data-autofill-review-modal]:not([hidden])');
  await expect(sidebarModal).toHaveCount(1);
  await expect(sidebarModal).toHaveJSProperty('open', true);
  const sidebarReload = page.waitForEvent('framenavigated', { predicate: frame => frame === page.mainFrame() });
  for (let index = 0; index < reviewRows.length; index++) {
    await expectCurrentReview(sidebarModal, reviewRows[index], index, reviewRows.length);
    await sidebarModal.locator('[data-autofill-accept]').click();
  }
  await sidebarReload;

  await expect(page.locator('input[name="title"]')).toHaveValue('Browser E2E updated title');
  await expect(page.locator(`[name="fields[${data.targetFieldHandle}]"]`).first()).toHaveValue('Fixture generated value for Browser generated summary');
  const lightswitch = data.outputFields.find(field => field.name === 'Browser enabled');
  const dropdown = data.outputFields.find(field => field.name === 'Browser status');
  const jsonField = data.outputFields.find(field => field.name === 'Browser JSON');
  const table = data.outputFields.find(field => field.name === 'Browser table');
  const richText = data.outputFields.find(field => field.name === 'Browser rich text');
  if (lightswitch) await expect(page.locator(`input[type="hidden"][name="fields[${lightswitch.handle}]"]`)).toHaveValue('1');
  if (dropdown) await expect(page.locator(`select[name="fields[${dropdown.handle}]"]`)).toHaveValue('base64:cmVhZHk=');
  if (jsonField) await expect(page.locator(`textarea[name="fields[${jsonField.handle}]"]`)).toHaveValue(/"nested"\s*:\s*\{\s*"valid"\s*:\s*true\s*\}/);
  if (table) {
    const tableInputs = page.locator(`[name^="fields[${table.handle}]"]`);
    await expect.poll(async () => tableInputs.evaluateAll(elements =>
      elements.some(element => (element as HTMLInputElement).value === 'Fixture table value'),
    )).toBe(true);
  }
  if (richText) await expect(page.locator(`textarea[name="fields[${richText.handle}]"]`)).toHaveValue(/Fixture generated value for Browser rich text/);
  expect(workflowGenerateRequests).toBe(1);
});

async function expectCurrentReview(modal: import('@playwright/test').Locator, field: { name: string }, index: number, total: number) {
  await expect(modal.locator('[data-autofill-review-status]')).toHaveText(`${index + 1} of ${total}`);
  await expect(modal.locator('[data-autofill-review-field]')).toContainText(field.name);
  const editor = modal.locator('[data-autofill-review-editor]');
  if (field.name === 'Browser enabled') {
    await expect(editor.locator('[data-autofill-review-input="lightswitch"]')).toHaveAttribute('aria-checked', 'true');
  } else if (field.name === 'Browser status') {
    await expect(editor.locator('select[data-autofill-review-input="dropdown"]')).toHaveValue('ready');
  } else if (field.name === 'Browser table') {
    await expect(editor.locator('[data-autofill-review-input="table-preview"]')).toContainText('Fixture table value');
  } else if (field.name === 'Browser JSON') {
    await expect(editor.locator('textarea[data-autofill-review-input="textarea"]')).toHaveValue(/"nested"\s*:\s*\{\s*"valid"\s*:\s*true\s*\}/);
  } else if (field.name === 'Browser rich text') {
    await expect(editor.locator('[data-autofill-review-input="richtext"]')).toContainText('Fixture generated value for Browser rich text');
  } else {
    await expect(editor.locator('textarea[data-autofill-review-input="textarea"], input[data-autofill-review-input="text"]')).toHaveValue(/Fixture generated value/);
  }
}

test('asset workflow generates and persists alt text and caption', async ({ page }) => {
  const data = fixture();
  await login(page, data);
  await page.goto(data.assetEditorPath);
  const assetThumbnail = page.locator('#thumb-container img').first();
  await expect.poll(() => assetThumbnail.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  const assetRuntime = page.locator('[data-autofill-runtime]').first();
  await expect(assetRuntime).toBeVisible();
  const assetInstanceId = await assetRuntime.getAttribute('data-autofill-instance-id');
  await assetRuntime.locator('[data-autofill-generate]').click();
  await expect(assetRuntime.locator('[data-autofill-generate]')).toHaveText('Review results', { timeout: 30000 });
  await assetRuntime.locator('[data-autofill-generate]').click();

  const modal = page.locator(`[data-autofill-review-modal][data-autofill-instance-id="${assetInstanceId}"]`);
  await expect(modal).toHaveJSProperty('open', true);
  await expect(modal.locator('[data-autofill-review-field]')).toContainText(/alt/i);
  await expect(modal.locator('[data-autofill-review-editor] textarea, [data-autofill-review-editor] input').first()).toHaveValue(/Fixture generated value/);
  fs.mkdirSync('tests/browser/artifacts', { recursive: true });
  await page.screenshot({ path: 'tests/browser/artifacts/asset-workflow-review.png', fullPage: true });
  await modal.locator('[data-autofill-accept]').click();
  await expect(modal.locator('[data-autofill-review-field]')).toContainText(/caption/i);
  await expect(modal.locator('[data-autofill-review-editor] textarea, [data-autofill-review-editor] input').first()).toHaveValue(/Fixture generated value/);
  const assetReload = page.waitForEvent('framenavigated', { predicate: frame => frame === page.mainFrame() });
  await modal.locator('[data-autofill-accept]').click();
  await assetReload;
  await expect(modal).toBeHidden();

  await expect(page.locator('#thumb-container img').first()).toHaveAttribute('alt', 'Fixture generated value for Alt text');
  await expect(page.locator(`[name="fields[${data.assetCaptionFieldHandle}]"]`).first()).toHaveValue(/Fixture generated value/);
});

test('does not start a workflow when Craft rejects the save-first request', async ({ page }) => {
  const data = fixture();
  await login(page, data);
  await page.goto(data.editorPath);

  const title = page.locator('input[name="title"]');
  await title.fill('Keep this unsaved title after rejection');
  const runtime = page.locator('[data-autofill-runtime]').first();
  const config = JSON.parse((await runtime.getAttribute('data-autofill-config')) ?? '{}') as { startRunActionUrl?: string };
  const generateEndpoint = new URL(config.startRunActionUrl ?? '', page.url());
  const generateAction = generateEndpoint.searchParams.get('action') ?? generateEndpoint.searchParams.get('p') ?? generateEndpoint.pathname;
  expect(generateAction).toContain('workflow-run/start');
  let saveRequests = 0;
  let generateRequests = 0;

  page.on('request', request => {
    const url = new URL(request.url());
    const action = url.searchParams.get('action') ?? url.searchParams.get('p') ?? url.pathname;
    if (action === generateAction) generateRequests++;
  });
  await page.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    const action = url.searchParams.get('action');
    const bodyAction = new URLSearchParams(request.postData() ?? '').get('action');
    const isEntrySave = request.method() === 'POST' && (
      action === 'elements/save' || bodyAction === 'elements/save' || url.pathname.endsWith('/actions/elements/save')
    );
    if (!isEntrySave) return route.continue();

    saveRequests++;
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'Fixture save rejected.' }),
    });
  });

  await runtime.locator('[data-autofill-generate]').click();
  await expect(runtime.locator('[data-autofill-run-status]')).toContainText('Fixture save rejected. Autofill was not started.');
  await expect(title).toHaveValue('Keep this unsaved title after rejection');
  await expect(page).toHaveURL(data.editorPath);
  await expect.poll(() => saveRequests).toBe(1);
  expect(generateRequests).toBe(0);
  await expect(page.locator('[data-autofill-review-modal]:not([hidden])')).toHaveCount(0);
});

test('non-admin entry editor cannot open workflow management', async ({ page }) => {
  const data = fixture();
  await page.goto('/admin/login');
  await page.getByLabel('Username or Email').first().fill(data.editorUsername);
  await page.getByLabel('Password', { exact: true }).first().fill(data.editorPassword);
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).not.toHaveURL(/\/admin\/login(?:\/|$)/);
  await page.goto(data.editorPath);
  const response = await page.goto('/admin/autofill/workflows');
  expect(response?.status()).toBe(403);
});


test('field picker blocks duplicates across panels and supports keyboard reordering', async ({ page }) => {
  const data = fixture();
  await login(page, data);
  await page.goto('/admin/autofill/workflows/new');
  await page.getByRole('combobox', { name: 'Entry type' }).selectOption(data.entryTypeUid);
  await addWorkflowField(page, 'context', 'Title');

  const outputs = page.locator('#workflow-outputs');
  await outputs.getByRole('button', { name: 'Add', exact: true }).click();
  const picker = page.getByRole('dialog', { name: 'Add output field' });
  await picker.getByRole('searchbox', { name: 'Search fields' }).fill('Title');
  await expect(picker.getByRole('button', { name: 'Title Already in context', exact: true })).toBeDisabled();
  await picker.getByRole('searchbox').press('Escape');
  await expect(picker).toBeHidden();
  await expect(outputs.locator('.af-sort-item')).toHaveCount(0);

  await addWorkflowField(page, 'output', 'Browser generated summary');
  await expect(outputs.getByRole('textbox', { name: 'Instructions', exact: true })).toBeFocused();
  await expect(outputs.getByText('Needs instructions', { exact: true })).toBeVisible();
  await outputs.getByRole('textbox', { name: 'Instructions', exact: true }).fill('Write a short summary.');
  await expect(outputs.getByText('Needs instructions', { exact: true })).toHaveCount(0);
  await addWorkflowField(page, 'output', 'Browser enabled');
  await outputs.locator('.af-output').last().getByRole('textbox', { name: 'Instructions', exact: true }).fill('Set the state.');
  await outputs.getByRole('button', { name: 'Reorder output field 2', exact: true }).press('ArrowUp');
  await expect(outputs.locator('.af-output-summary').first()).toContainText('Browser enabled');
  await expect(outputs.getByRole('combobox', { name: 'Field', exact: true })).toHaveCount(0);

  await page.locator('#workflow-source').getByRole('button', { name: 'Add', exact: true }).click();
  const contextPicker = page.getByRole('dialog', { name: 'Add context field' });
  await contextPicker.getByRole('searchbox').fill('Browser generated summary');
  await expect(contextPicker.getByRole('button', { name: 'Browser generated summary Already in outputs', exact: true })).toBeDisabled();
  await contextPicker.getByRole('searchbox').press('Escape');
  await expect(outputs.locator('.af-output[open]')).toHaveCount(0);
});

test('Autofill sidebar stays expanded on each management page', async ({ page }) => {
  await login(page, fixture());
  await page.goto('/admin/autofill');
  await expect(page).toHaveURL(/\/admin\/autofill\/workflows$/);
  for (const name of ['Bulk Autofill', 'Logs', 'Workflows']) {
    await page.getByRole('link', { name, exact: true }).click();
    const subnav = page.locator('#nav-autofill-subnav');
    await expect(subnav).toHaveAttribute('data-state', 'expanded');
    await expect(subnav.locator('[aria-current="page"]')).toHaveText(name);
  }
});

test('mixed invalid results can be corrected or skipped without losing valid suggestions', async ({ page }) => {
  const data = fixture();
  await login(page, data);
  await page.goto('/admin/autofill/workflows/new');
  const workflowName = `Edge review ${Date.now()}`;
  await page.getByLabel('Name', { exact: true }).fill(workflowName);
  await page.getByRole('combobox', { name: 'Entry type' }).selectOption(data.entryTypeUid);
  for (const name of ['Browser generated summary', 'Browser status', 'Browser table']) {
    await addWorkflowField(page, 'output', name);
    await page.locator('#workflow-outputs .af-output').last().getByRole('textbox', { name: 'Instructions', exact: true }).fill(`Generate ${name}.`);
  }
  await page.locator('.af-settings-disclosure > summary').click();
  await page.getByRole('checkbox', { name: 'Show this workflow in the entry sidebar' }).press('Space');
  await page.locator('#header').getByRole('button', { name: 'Save workflow' }).click();
  await expect(page.getByText('Workflow saved.', { exact: true })).toBeVisible();
  await page.goto(data.editorPath);
  const sidebar = page.getByRole('region', { name: 'Autofill workflows' });
  const runtime = sidebar.locator('[data-autofill-runtime]').filter({
    has: page.getByRole('button', { name: workflowName, exact: true }),
  });
  await expect(runtime.locator('[data-autofill-sidebar-body]')).toBeHidden();
  await expect(runtime.locator('[data-autofill-generate]')).toBeVisible();
  await runtime.locator('[data-autofill-toggle]').click();
  await expect(sidebar.locator('[data-autofill-toggle][aria-expanded="true"]')).toHaveCount(1);
  await runtime.locator('[data-autofill-user-prompt]').fill('AUTOFILL_EDGE_REVIEW_FIXTURE');
  await runtime.locator('[data-autofill-generate]').click();
  await expect(runtime.locator('[data-autofill-generate]')).toHaveText('Review', { timeout: 30000 });
  await runtime.locator('[data-autofill-generate]').click();
  const modal = page.locator('[data-autofill-review-modal]:not([hidden])');
  await expect(modal).toHaveCount(1);
  await expect(modal.locator('[data-autofill-review-errors]')).toContainText('not valid');
  await expect(modal.locator('[data-autofill-review-raw-value]')).toContainText('unexpected');
  await expect(modal.locator('[data-autofill-accept]')).toBeDisabled();
  await page.screenshot({ path: 'tests/browser/artifacts/review-invalid-editable.png', fullPage: true });
  await modal.locator('[data-autofill-review-editor] textarea').fill('Editor corrected this summary.');
  await expect(modal.locator('[data-autofill-accept]')).toHaveText('Check & apply');
  await modal.locator('[data-autofill-accept]').click();
  await expect(modal.locator('[data-autofill-review-field]')).toContainText('Browser status');
  await expect(modal.locator('[data-autofill-accept]')).toBeEnabled();
  await page.screenshot({ path: 'tests/browser/artifacts/review-valid-sibling.png', fullPage: true });
  await modal.locator('[data-autofill-accept]').click();
  await expect(modal.locator('[data-autofill-review-field]')).toContainText('Browser table');
  await expect(modal.locator('[data-autofill-review-errors]')).toContainText('read-only');
  await expect(modal.locator('[data-autofill-review-raw-value]')).toContainText('not a number');
  await expect(modal.locator('[data-autofill-accept]')).toBeDisabled();
  await expect(modal.locator('[data-autofill-review-editor] textarea, [data-autofill-review-editor] input')).toHaveCount(0);
  await page.screenshot({ path: 'tests/browser/artifacts/review-invalid-readonly.png', fullPage: true });
  await modal.locator('[data-autofill-close]').click();
  await expect(page.locator(`[name="fields[${data.targetFieldHandle}]"]`).first()).toHaveValue('Editor corrected this summary.');
  const dropdown = data.outputFields.find(field => field.name === 'Browser status')!;
  await expect(page.locator(`select[name="fields[${dropdown.handle}]"]`)).toHaveValue('base64:cXVldWVk');
});

test('Pro inbox and workflow-based asset bulk screen render', async ({ page }) => {
  const data = fixture();
  await login(page, data);
  await page.goto('/admin/autofill/workflows/new');
  await page.getByRole('combobox', { name: 'Content', exact: true }).selectOption('asset');
  await page.locator('.af-settings-disclosure > summary').click();
  await expect(page.getByRole('checkbox', { name: 'Show this workflow in the asset sidebar' })).toBeChecked();
  const volume = page.getByRole('combobox', { name: 'Asset volume' });
  await volume.selectOption({ index: 1 });
  await addWorkflowField(page, 'context', 'This asset’s file');
  const assetContext = page.locator('#workflow-source .af-sort-item').last();
  await assetContext.getByText('Advanced', { exact: true }).click();
  await expect(assetContext.getByRole('checkbox', { name: 'Include file content' })).toBeChecked();

  await page.goto(data.assetEditorPath);
  const config = JSON.parse((await page.locator('[data-autofill-runtime]').first().getAttribute('data-autofill-config')) ?? '{}');
  await page.goto(`/admin/autofill/bulk?workflow=${encodeURIComponent(config.workflowHandle)}`);
  await expect(page.getByRole('heading', { name: 'Bulk Autofill', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Browser asset workflow', exact: true })).toBeVisible();
  await expect(page.locator('form:visible input[name="workflowHandle"]')).toHaveValue(config.workflowHandle);
  await expect(page.getByRole('button', { name: 'Select assets', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Change workflow', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Select assets', exact: true })).toBeHidden();
  const card = page.locator(`article[data-workflow="${config.workflowHandle}"]`);
  await expect(card.getByText('Generate accessible alt text and captions.', { exact: true })).toBeVisible();
  await card.getByText('More information', { exact: true }).click();
  await expect(card.getByText('Changes require review', { exact: true })).toBeVisible();
  await card.getByRole('button', { name: 'Select workflow', exact: true }).click();
  await expect(page.locator('form:visible input[name="workflowHandle"]')).toHaveValue(config.workflowHandle);
  await expect(page.getByRole('button', { name: 'Select assets', exact: true })).toBeVisible();
  await page.goto('/admin/autofill/inbox?status=completed');
  await expect(page.getByRole('heading', { name: 'Autofill inbox', exact: true })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Workflow', exact: true })).toBeVisible();
});

test('bulk asset generation persists results and supports review from the inbox', async ({ page }) => {
  const data = fixture();
  await login(page, data);
  await page.goto(data.bulkAsset.path);
  const originalAlt = await page.locator('#thumb-container img').first().getAttribute('alt');
  const config = JSON.parse((await page.locator('[data-autofill-runtime]').first().getAttribute('data-autofill-config')) ?? '{}');
  const runId = await page.evaluate(async ({ handle, assetId, siteId }) => {
    const craft = (window as any).Craft;
    const { data } = await craft.sendActionRequest('POST', 'autofill/bulk/queue', { data: { workflowHandle: handle, elementIds: [assetId], siteId } });
    if (!data.success || data.runIds.length !== 1) throw new Error(JSON.stringify(data));
    await craft.sendActionRequest('POST', 'queue/run');
    return data.runIds[0] as number;
  }, { handle: config.workflowHandle, assetId: data.bulkAsset.id, siteId: data.siteId });
  await expectRunReady(page, runId);
  await page.goto('/admin/autofill');
  await expect(page).toHaveURL(/\/admin\/autofill\/inbox$/);
  await expect(page.getByRole('columnheader', { name: 'Started by' })).toBeVisible();
  const row = page.getByRole('row').filter({
    has: page.locator(`[href$="/autofill/inbox/${runId}"]`),
  });
  await expect(row).toContainText('Browser asset workflow');
  await expect(row.getByRole('cell', { name: data.username, exact: true })).toBeVisible();
  await expect(row.getByText('Review', { exact: true })).toBeVisible();
  await expect(row.getByRole('link', { name: 'View results' })).toHaveCount(0);
  await expect(row).toBeVisible();
  await page.screenshot({ path: 'tests/browser/artifacts/workflow-inbox.png', fullPage: true });
  page.once('dialog', dialog => dialog.dismiss());
  await row.getByRole('button', { name: /^Dismiss run/ }).click();
  await expect(row).toBeVisible();
  await row.getByRole('cell', { name: 'Browser asset workflow', exact: true }).click();
  // Inbox links open the real asset editor and its review immediately.
  await expect(page).toHaveURL(new RegExp(data.bulkAsset.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:\\?|$)'));
  const modal = page.locator('[data-autofill-review-modal]:not([hidden])');
  await expect(modal).toHaveJSProperty('open', true);
  await expect(page).not.toHaveURL(/autofillRun=/);
  const closeReload = page.waitForEvent('framenavigated', { predicate: frame => frame === page.mainFrame() });
  await modal.locator('[data-autofill-close]').click();
  await closeReload;
  await expect(modal).toHaveCount(0);
  const runtime = page.locator('[data-autofill-runtime]').first();
  await expect(runtime.locator('[data-autofill-generate]')).toHaveText('Review results');
  await runtime.locator('[data-autofill-generate]').click();
  await expect(modal).toHaveJSProperty('open', true);
  let rejectedSecurityToken = false;
  await page.route(url => (url.searchParams.get('p') ?? url.pathname).endsWith('/autofill/workflow-run/decide'), async route => {
    rejectedSecurityToken = true;
    await route.fulfill({ status: 400, json: { message: 'Unable to verify your data submission.' } });
  }, { times: 1 });
  await modal.locator('[data-autofill-reject]').click();
  await expect(modal.locator('[data-autofill-review-field]')).toContainText(/caption/i);
  expect(rejectedSecurityToken).toBe(true);
  const reload = page.waitForEvent('framenavigated', { predicate: frame => frame === page.mainFrame() });
  await modal.locator('[data-autofill-accept]').click();
  await reload;
  await expect(page.locator('#thumb-container img').first()).toHaveAttribute('alt', originalAlt ?? '');
  await expect(page.locator(`[name="fields[${data.assetCaptionFieldHandle}]"]`).first()).toHaveValue(/Fixture generated value/);
});


test('non-admin manager can edit shared instructions but automatic outputs stay protected', async ({ page }) => {
  const data = fixture();
  await login(page, { ...data, username: data.managerUsername, password: data.managerPassword });
  await page.goto(`/admin/autofill/workflows/edit/${data.protectedWorkflowHandle}`);
  const outputs = page.locator('#workflow-outputs .af-output');
  await outputs.first().locator('summary').first().click();
  await expect(outputs.first().getByRole('textbox', { name: 'Instructions', exact: true })).toBeDisabled();
  await expect(page.locator('#workflow-outputs .af-remove-field').first()).toBeDisabled();
  await page.locator('#workflow-source').click();
  await page.getByRole('textbox', { name: 'Shared instructions (optional)' }).fill('Allowed shared instruction change.');
  await outputs.nth(1).locator('summary').first().click();
  await outputs.nth(1).getByRole('textbox', { name: 'Instructions', exact: true }).fill('Updated review instructions.');
  await page.locator('#header').getByRole('button', { name: 'Save workflow' }).click();
  await expect(page.getByText('Workflow saved.', { exact: true })).toBeVisible();
  await page.reload();
  await outputs.first().locator('summary').first().click();
  await expect(outputs.first().getByRole('textbox', { name: 'Instructions', exact: true })).toHaveValue('Protected automatic instructions');
  await outputs.nth(1).locator('summary').first().click();
  await expect(outputs.nth(1).getByRole('textbox', { name: 'Instructions', exact: true })).toHaveValue('Updated review instructions.');
});

test('sharing makes a private workflow discoverable to another workflow manager', async ({ page, browser, baseURL }) => {
  const data = fixture();
  const name = `Sharing fixture ${Date.now()}`;
  await login(page, data);
  await page.goto('/admin/autofill/workflows/new');
  await page.getByLabel('Name', { exact: true }).fill(name);
  await page.getByRole('combobox', { name: 'Entry type' }).selectOption(data.entryTypeUid);
  await addWorkflowField(page, 'output', 'Browser generated summary');
  await page.getByRole('textbox', { name: 'Instructions', exact: true }).fill('Write a summary.');
  await expect(page.getByRole('switch', { name: 'Share' })).not.toBeChecked();
  await page.getByRole('button', { name: 'Save workflow', exact: true }).click();
  await expect(page.getByText('Workflow saved.', { exact: true })).toBeVisible();

  const manager = await browser.newPage({ baseURL });
  try {
    await login(manager, { ...data, username: data.managerUsername, password: data.managerPassword });
    await manager.goto('/admin/autofill/workflows');
    const table = manager.locator('#autofill-workflows-admin-table');
    await expect(table.getByRole('link', { name: 'Protected automatic outputs', exact: true })
      .and(manager.locator(`[href$="/${data.protectedWorkflowHandle}"]`))).toBeVisible();
    await expect(table.getByRole('link', { name, exact: true })).toHaveCount(0);

    await page.getByRole('switch', { name: 'Share' }).click();
    await expect(page.getByRole('switch', { name: 'Share' })).toBeChecked();
    await page.getByRole('button', { name: 'Save workflow', exact: true }).click();
    await expect(page.getByText('Workflow saved.', { exact: true })).toBeVisible();

    await manager.reload();
    await expect(table.getByRole('row').filter({ has: manager.getByRole('link', { name, exact: true }) })).toContainText('Public');
  } finally {
    await manager.close();
  }
});


test('native management tables search workflows, inbox results, and logs', async ({ page }) => {
  await login(page, fixture());
  for (const screen of [
    { path: 'workflows', id: 'workflows', query: 'Browser asset workflow', column: 'Visibility' },
    { path: 'inbox?status=completed', id: 'inbox', query: 'Browser asset workflow', column: 'Status' },
    { path: 'logs', id: 'logs', query: 'Success', column: 'Provider' },
  ]) {
    await page.goto(`/admin/autofill/${screen.path}`);
    const table = page.locator(`#autofill-${screen.id}-admin-table`);
    await expect(table.getByRole('columnheader', { name: screen.column, exact: true })).toBeVisible();
    const rows = table.locator('tbody tr[item-index]');
    await expect(rows.first()).toBeVisible();
    const search = table.getByRole('textbox');
    await search.fill('no-matching-autofill-record-xyz');
    await expect(rows).toHaveCount(0);
    await search.fill(screen.query);
    await expect(rows.first()).toContainText(screen.query);
    if (screen.id !== 'logs') {
      for (const row of await rows.all()) await expect(row).toContainText(screen.query);
    } else {
      const details = rows.first().getByTitle('Details', { exact: true });
      const rawResponse = table.getByRole('textbox', { name: 'Response raw text', exact: true });
      await details.click();
      await expect(rawResponse).toHaveValue(/"suggestions"/);
      await expect(rawResponse).not.toBeEditable();
      await details.click();
      await expect(rawResponse).toBeHidden();
    }
  }
});


test('archived workflow leaves pending review available from the original content', async ({ page }) => {
  const data = fixture();
  await login(page, data);
  await page.goto(data.archiveAsset.path);
  const config = JSON.parse((await page.locator('[data-autofill-runtime]').first().getAttribute('data-autofill-config')) ?? '{}');
  const runId = await page.evaluate(async ({ handle, elementId, siteId }) => {
    const craft = (window as any).Craft;
    const response = await craft.sendActionRequest('POST', 'autofill/workflow-run/start', { data: { workflowHandle: handle, elementId, siteId } });
    if (!response.data.success) throw new Error(response.data.error);
    await craft.sendActionRequest('POST', 'queue/run');
    return response.data.run.id;
  }, { handle: config.workflowHandle, elementId: data.archiveAsset.id, siteId: data.siteId });
  await expectRunReady(page, runId);
  await page.goto(`/admin/autofill/workflows/edit/${config.workflowHandle}`);
  await page.getByRole('button', { name: 'Workflow actions' }).click();
  await page.getByText('Archive workflow', { exact: true }).click();
  await expect(page.getByText('This workflow is archived.', { exact: true })).toBeVisible();
  await page.goto('/admin/autofill/workflows');
  const workflowLink = page.locator(`a[href$="/autofill/workflows/edit/${config.workflowHandle}"]`);
  await expect(workflowLink).toHaveCount(0);
  await page.getByRole('link', { name: 'Archived', exact: true }).click();
  await expect(workflowLink).toBeVisible();
  await page.goto(data.archiveAsset.path);
  const recovery = page.locator(`[data-autofill-runtime][data-autofill-config*='"selectedRunId":${runId}']`);
  await expect(recovery).toHaveCount(1);
  await expect(recovery.locator('[data-autofill-generate]')).toHaveText('Review');
  await recovery.locator('[data-autofill-generate]').click();
  await expect(page.locator('[data-autofill-review-modal]:not([hidden])')).toHaveJSProperty('open', true);
  await page.screenshot({ path: 'tests/browser/artifacts/archived-workflow-review.png', fullPage: true });
  await page.goto(`/admin/autofill/workflows/edit/${config.workflowHandle}`);
  await page.getByRole('button', { name: 'Workflow actions' }).click();
  await page.getByText('Restore workflow', { exact: true }).click();
  await expect(page.getByText('Workflow restored.', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('This workflow is archived.', { exact: true })).toBeHidden();
  await expectRunReady(page, runId);
  await page.goto('/admin/autofill/inbox');
  const dismiss = page.locator(`[data-autofill-dismiss="${runId}"]`);
  await expect(dismiss).toBeVisible();
  page.once('dialog', dialog => dialog.accept());
  await dismiss.click();
  await expect(dismiss).toHaveCount(0);
});


test('mixed automatic results refresh saved fields while manual results remain pending', async ({ page }) => {
  const data = fixture();
  await login(page, data);
  await page.goto(`/admin/autofill/workflows/edit/${data.protectedWorkflowHandle}`);
  await page.locator('.af-settings-disclosure > summary').click();
  await page.getByRole('checkbox', { name: 'Show this workflow in the entry sidebar' }).press('Space');
  await page.locator('#header').getByRole('button', { name: 'Save workflow' }).click();
  await expect(page.getByText('Workflow saved.', { exact: true })).toBeVisible();
  await page.goto(data.editorPath);
  const target = page.locator(`[name="fields[${data.targetFieldHandle}]"]`).first();
  await target.fill('Before automatic refresh');
  const runtime = page.locator(`[data-autofill-runtime][data-autofill-config*='"workflowHandle":"${data.protectedWorkflowHandle}"']`);
  await runtime.locator('[data-autofill-generate]').click();
  await expect(runtime.locator('[data-autofill-generate]')).toHaveText('Review', { timeout: 30000 });
  await expect(target).toHaveValue('Fixture generated value for Browser generated summary');
  await runtime.locator('[data-autofill-generate]').click();
  const modal = page.locator('[data-autofill-review-modal]:not([hidden])');
  await expect(modal).toHaveJSProperty('open', true);
  await expect(modal.locator('[data-autofill-review-status]')).toHaveText('1 of 1');
  await expect(modal.locator('[data-autofill-review-field]')).toHaveText('Title');
});
