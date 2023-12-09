<template>
  <div class="page-layout">
    <NavBar />
    <div class="page-layout__content">
      <slot />
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/navigation/desktop/nav-bar.vue";
import Footer from "@/components/page-footer.vue"
</script>
