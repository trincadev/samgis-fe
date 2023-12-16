<template>
  <SideBarElement>
    <router-link class="no-underline inline-flex items-center p-2" to="/">
      <img
        src="/icon.svg"
        alt="GIS logo"
        width="64"
        height="64"
      />
      <NavBarTextElement>SamGIS</NavBarTextElement>
    </router-link>
  </SideBarElement>
</template>

<script setup lang="ts">
import SideBarElement from '@/components/navigation/desktop/SideBarElement.vue'
import NavBarTextElement from '@/components/navigation/desktop/SideBarTextElement.vue'
</script>