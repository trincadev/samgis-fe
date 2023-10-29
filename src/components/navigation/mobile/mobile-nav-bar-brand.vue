<template>
  <div @click="mobileMenuStore.closeMobileMenu" class="mobile-nav-bar__brand">
    <router-link to="/">
      <img
        class="mobile-nav-bar__logo"
        src="https://upload.wikimedia.org/wikiversity/en/6/6c/GIS_Layers.png"
        alt="GIS logo"
        width="82"
        height="24"
      />
    </router-link>
  </div>
</template>

<script setup>
import { mobileMenuStore } from "./mobile-menu.store.js";
</script>
