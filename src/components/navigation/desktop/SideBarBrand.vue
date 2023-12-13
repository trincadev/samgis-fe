<template>
  <SideBarElement class="pl-2">
    <router-link to="/">
      <img
        src="/logo.png"
        alt="GIS logo"
      />
    </router-link>
  </SideBarElement>
</template>

<script setup lang="ts">
import SideBarElement from '@/components/navigation/desktop/SideBarElement.vue'
</script>