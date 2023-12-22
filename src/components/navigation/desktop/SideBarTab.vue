<template>
    <router-link
      :to="props.path"
      exact
      class="no-underline border-blue-400"
      active-class="border-b-4 bg-blue-100"
    >
    <img
      :src="props.pathImage"
      :alt="props.altImage"
      class="w-[36px] h-[36px] lg:w-[56px] lg:h-[56px]"
    /></router-link>
</template>

<script setup lang="ts">
import SideBarElement from '@/components/navigation/desktop/SideBarElement.vue'
import NavBarTextElement from '@/components/navigation/desktop/SideBarTextElement.vue'

const props = defineProps<{
  path: string,
  label: string,
  altImage: string,
  pathImage: string
}>()
</script>
