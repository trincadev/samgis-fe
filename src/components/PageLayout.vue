<template>
  <div class="flex flex-col items-center h-full w-full">
    <NavBar />
    <div class="items-center h-full w-full max-w-9xl p-12">
      <div class="flex flex-col flex-shrink-0 w-full flex-1 m-8 leading-10">
        <slot />
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/navigation/desktop/NavBar.vue";
import Footer from "@/components/PageFooter.vue"
</script>
