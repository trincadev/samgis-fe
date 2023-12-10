<template>
  <NavBarTextElement class="font-medium min-w-[100px]">
      <router-link
        :to="props.path"
        exact
        class="no-underline pl-1 pr-1"
        active-class="bg-white pb-6 pt-2 border-white pl-1 pr-1"
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
