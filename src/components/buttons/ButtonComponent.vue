<template>
  <button
    class="rounded-lg font-semibold cursor-pointer select-none text-2xl leading-10 min-w-32 p-3"
    @click="props.click"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  click: Function
}>()
</script>