<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
const props = defineProps<{ items: any[]; label: string; locked?: any[]; readonly?: boolean }>();
const emit = defineEmits<{ reorder: [from: number, to: number]; remove: [index: number] }>();
const root = ref<HTMLElement>();
const dragging = ref(-1);
const destination = ref(-1);
const announcement = ref('');
const keys = new WeakMap<object, number>();
let sequence = 0;
function itemKey(item: object) {
  if (!keys.has(item)) keys.set(item, ++sequence);
  return keys.get(item);
}
let startY = 0;
let moved = false;
function start(event: PointerEvent, index: number) {
  if (props.readonly || props.locked?.includes(props.items[index])) return;
  if (event.button !== 0 || props.items.length < 2) return;
  event.preventDefault();
  startY = event.clientY;
  moved = false;
  dragging.value = index;
  destination.value = index;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
}
function move(event: PointerEvent) {
  if (dragging.value < 0) return;
  if (Math.abs(event.clientY - startY) < 5 && !moved) return;
  moved = true;
  const rows = [...(root.value?.querySelectorAll<HTMLElement>(':scope > .af-sort-item') || [])];
  const others = rows.filter((_, index) => index !== dragging.value);
  destination.value = others.filter(row => {
    const bounds = row.getBoundingClientRect();
    return event.clientY > bounds.top + bounds.height / 2;
  }).length;
  if (event.clientY < 100) window.scrollBy(0, -12);
  if (event.clientY > window.innerHeight - 70) window.scrollBy(0, 12);
}
function reorder(from: number, to: number) {
  if (props.readonly || props.locked?.includes(props.items[from])) return;
  if (from === to || to < 0 || to >= props.items.length) return;
  emit('reorder', from, to);
  announcement.value = `Field moved to position ${to + 1} of ${props.items.length}.`;
}
function finish() {
  if (moved && dragging.value >= 0) reorder(dragging.value, destination.value);
  cancel();
}
function cancel() { dragging.value = -1; destination.value = -1; moved = false; }
function marker(index: number) {
  if (dragging.value < 0 || destination.value === dragging.value) return false;
  return destination.value < dragging.value ? index === destination.value : index === destination.value + 1;
}
onBeforeUnmount(cancel);
</script>

<template>
  <div ref="root" class="af-sortable" :class="{ 'af-sorting': dragging >= 0 }">
    <p class="visually-hidden" aria-live="polite">{{ announcement }}</p>
    <div v-for="(row, index) in items" :key="itemKey(row)" class="af-sort-item" :class="{ 'af-sort-item--dragging': dragging === index, 'af-drop-before': marker(index), 'af-drop-after': dragging >= 0 && destination === items.length - 1 && destination !== dragging && index === items.length - 1 }">
      <button type="button" class="af-drag-handle" :disabled="readonly || locked?.includes(row)" :aria-label="`Reorder ${label} field ${index + 1}`" title="Drag to reorder. Use Up or Down arrows to move with the keyboard." @pointerdown="start($event, index)" @pointermove="move" @pointerup="finish" @pointercancel="cancel" @lostpointercapture="cancel" @keydown.up.prevent="reorder(index, index - 1)" @keydown.down.prevent="reorder(index, index + 1)"><svg width="12" height="18" viewBox="0 0 12 18" aria-hidden="true"><circle v-for="(point, i) in [[3,4],[9,4],[3,9],[9,9],[3,14],[9,14]]" :key="i" :cx="point[0]" :cy="point[1]" r="1.4" fill="currentColor" /></svg></button>
      <slot :row="row" :index="index" />
      <button type="button" class="af-remove-field" :disabled="readonly || locked?.includes(row)" :aria-label="`Remove ${label} field ${index + 1}`" title="Remove field" @click="emit('remove', index)">×</button>
    </div>
  </div>
</template>
