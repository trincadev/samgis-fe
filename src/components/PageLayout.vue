<template>
  <div class="flex flex-col items-center h-full w-full">
    <NavBar />
    <!-- class="flex flex-col flex-shrink-0 w-full p-12 flex-1 bg-white text-black" -->
    <!-- flex flex-col flex-shrink-0 w-full p-12 flex-1 -->
    <div class="items-center h-full w-full max-w-9xl m-8 p-8">
      <slot />
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/navigation/desktop/nav-bar.vue";
import Footer from "@/components/page-footer.vue"
</script>
