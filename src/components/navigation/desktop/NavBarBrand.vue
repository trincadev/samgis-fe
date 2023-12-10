<template>
  <NavBarElement class="pl-2">
    <router-link to="/">
      <img
        src="/logo.png"
        alt="GIS logo"
      />
    </router-link>
  </NavBarElement>
</template>

<script setup lang="ts">
import NavBarElement from '@/components/navigation/desktop/NavBarElement.vue'
</script>