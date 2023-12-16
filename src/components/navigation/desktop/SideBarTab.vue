<template>
  <SideBarElement class="pt-4 pb-4">
    <router-link
      :to="props.path"
      exact
      class="no-underline inline-flex items-center border-blue-400 text-xl p-2"
      active-class="border-b-4 bg-blue-100 p-2"
    >
    <img
      :src="props.pathImage"
      :alt="props.altImage"
      width="64"
      height="64"
    />
    <NavBarTextElement>{{ props.label }}</NavBarTextElement>
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
