<template>
  <NavBarTextElement class="font-medium">
    <router-link
      :to="props.path"
      exact
      class="no-underline"
      active-class="bg-gray-600 text-white pb-5 pt-2 border-white"
    >
      {{ props.label }}
    </router-link>
  </NavBarTextElement>
</template>

<script setup lang="ts">
import NavBarTextElement from '@/components/navigation/desktop/NavBarTextElement.vue'

const props = defineProps<{
  path: string,
  label: string,
}>()
</script>
