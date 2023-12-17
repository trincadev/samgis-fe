<template>
  <SideBarElement>
    <router-link
      :to="props.path"
      exact
      class="no-underline inline-flex items-center border-blue-400 text-xl pl-2 pr-2"
      active-class="border-b-4 bg-blue-100"
    >
    <img
      :src="props.pathImage"
      :alt="props.altImage"
      width="56"
      height="56"
    />
    <NavBarTextElement class="ml-4 hidden lg:inline">{{ props.label }}</NavBarTextElement>
    </router-link>
  </SideBarElement>
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
