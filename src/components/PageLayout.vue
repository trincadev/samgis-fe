<template>
  <div class="flex flex-col items-center h-full w-full">
    <NavBar />
    <div class="flex flex-1 flex-basis flex-col items-center h-full w-full max-w-9xl">
      <slot />
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/navigation/desktop/nav-bar.vue";
import Footer from "@/components/page-footer.vue"
</script>
