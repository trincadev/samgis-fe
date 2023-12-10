<template>
  <NavBarTextElement>
    <router-link
      :to="props.path"
      exact
      class="font-medium"
      active-class="underline decoration-solid decoration-indigo-300 decoration-4 underline-offset-8"
    >
      {{ props.label }}
    </router-link>
  </NavBarTextElement>
</template>

<script setup lang="ts">
import NavBarElement from '@/components/navigation/desktop/NavBarElement.vue'
import NavBarTextElement from '@/components/navigation/desktop/NavBarTextElement.vue'

const props = defineProps<{
  path: string,
  label: string,
}>()
</script>
