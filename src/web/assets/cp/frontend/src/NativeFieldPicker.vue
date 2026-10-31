<script setup lang="ts">
import { nextTick, onBeforeUnmount, shallowRef, watch } from 'vue';
const props = defineProps<{ open: boolean; anchor?: HTMLElement; label: string }>();
const emit = defineEmits<{ close: []; show: []; hidden: [] }>();
const host = shallowRef<HTMLElement>();
let hud: any;
watch(() => props.open, async open => {
  if (open && props.anchor) {
    await nextTick();
    if (!props.open) return;
    hud = new (window as any).Garnish.HUD(props.anchor, {
      hudClass: 'hud fld-library-hud af-native-field-picker-hud',
      orientations: ['right', 'bottom', 'left'],
      showOnInit: false,
      listenToMainResize: true,
      onHide: () => emit('close'),
    });
    host.value = hud.$main[0];
    hud.$hud.attr({ role: 'dialog', 'aria-label': props.label });
    await nextTick();
    if (!props.open || !hud) return;
    hud.show();
    emit('show');
  } else if (hud) {
    const closing = hud;
    hud = undefined;
    closing.hide();
    host.value = undefined;
    await nextTick();
    closing.destroy();
    emit('hidden');
  }
});
onBeforeUnmount(() => { hud?.hide(); hud?.destroy(); });
</script>

<template><Teleport v-if="host" :to="host"><slot /></Teleport></template>
