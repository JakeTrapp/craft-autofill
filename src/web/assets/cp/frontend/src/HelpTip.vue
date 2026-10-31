<script setup lang="ts">
import { Tooltip } from '@verbb/plugin-kit-vue/components';
defineProps<{ text: string; label: string }>();
function dismiss(event: KeyboardEvent) {
  const tooltip = (event.currentTarget as HTMLElement).closest('pk-tooltip') as HTMLElement & { hide: () => Promise<void> };
  tooltip?.hide();
}
</script>

<template>
  <Tooltip class="af-tooltip" :content="text" placement="top">
    <button slot="trigger" type="button" class="af-help" :aria-label="label" @keydown.esc.stop="dismiss">?</button>
  </Tooltip>
</template>
