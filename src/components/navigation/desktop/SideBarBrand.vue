<template>
  <SideBarElement>
    <router-link class="no-underline inline-flex items-center" to="/">
      <img
        src="/icon.svg"
        alt="SamGIS logo"
        width="56"
        height="56"
      />
      <NavBarTextElement class="ml-4 lg:hidden xl:inline">SamGIS</NavBarTextElement>
    </router-link>
  </SideBarElement>
</template>

<script setup lang="ts">
import SideBarElement from '@/components/navigation/desktop/SideBarElement.vue'
import NavBarTextElement from '@/components/navigation/desktop/SideBarTextElement.vue'
</script>