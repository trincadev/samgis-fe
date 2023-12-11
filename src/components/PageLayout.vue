<template>
  <div class="flex flex-col items-center h-full w-full">
    <NavBar />
    <div class="items-center h-full w-full pt-20">
      <h1 class="fixed w-full bg-white font-bold -mt-2.5 pt-4 pb-4" style="z-index: 1001" id="page-title">{{  props.pageTitle }}</h1>
      <div class="mt-12 leading-10">
        <slot />
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/navigation/desktop/NavBar.vue";
import Footer from "@/components/PageFooter.vue"

const props = defineProps<{
  pageTitle: string
}>()
</script>
