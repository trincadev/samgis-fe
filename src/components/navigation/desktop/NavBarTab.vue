<template>
  <NavBarTextElement class="font-medium min-w-[100px]">
      <router-link
        :to="props.path"
        exact
        class="no-underline pl-2 pr-2"
        active-class="bg-white pb-6 pt-2 border-white pl-2 pr-2"
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
