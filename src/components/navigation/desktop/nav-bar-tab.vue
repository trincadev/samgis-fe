<template>
  <router-link
    :to="props.path"
    exact
    class="flex flex-row justify-center mr-6 font-medium text-base leading-4"
    active-class="underline decoration-solid decoration-indigo-300 decoration-4 underline-offset-8"
  >
    {{ props.label }}
  </router-link>
</template>

<script setup lang="ts">
const props = defineProps<{
  path: string,
  label: string,
}>()
</script>
