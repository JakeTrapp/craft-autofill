import '@verbb/plugin-kit-vue/style.css';
import { createApp, h } from 'vue';
import { PluginKitProvider } from '@verbb/plugin-kit-vue';
import { Dialog } from '@verbb/plugin-kit-vue/components';
import WorkflowApp from './WorkflowApp.vue';
import './autofill-cp.css';

// Loading the Vue facade registers Plugin Kit's <pk-dialog> custom element for
// the field review surfaces, which are rendered by Twig for every launcher.
window.AutofillPluginKitDialog = Dialog;

for (const root of document.querySelectorAll<HTMLElement>('[data-autofill-vue-root]')) {
  const options = JSON.parse(root.dataset.options || '{}');
  createApp({
    setup: () => () => h(PluginKitProvider, { translationCategory: 'autofill' }, {
      default: () => h(WorkflowApp, { options }),
    }),
  }).mount(root);
}
