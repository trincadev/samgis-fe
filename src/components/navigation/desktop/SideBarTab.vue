<template>
  <div class="pt-4 pb-4 p-2">
    <router-link
      :to="props.path"
      exact
      class="no-underline border-blue-400 text-xl p-2"
      active-class="border-b-4 bg-blue-100 p-2"
    >
      {{ props.label }}
    </router-link>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  path: string,
  label: string,
}>()
</script>
