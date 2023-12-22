<template>
  <div class="relative min-h-screen lg:flex">
    <!-- Sidebar -->
    <SideBar />

    <main id="content" class="flex-1 z-1 pb-12 ml-[3.3rem] lg:ml-0 mr-4 overflow-y-auto lg:space-y-6 md:pl-1 lg:h-screen">
      <header class="hidden md:flex md:mb-1 portrait:flex portrait:mb-1 items-center justify-between h-6 portrait:md:h-16 bg-gray-200 border-b sd:h-10">
        <h1 class="hidden portrait:md:block">{{  props.pageTitle }}</h1>
        <h2 class="block text-sm font-bold portrait:sd:hidden">{{  props.pageTitle }}</h2>
      </header>

      <div class="">
        <slot></slot>
      </div>

      <div class="bottom-0 w-full text-black">
        <Footer></Footer>
      </div>
    </main>
  </div>

</template>

<script setup lang="ts">
import Footer from "@/components/PageFooter.vue"
import SideBar from '@/components/navigation/desktop/SideBar.vue'

const props = defineProps<{
  pageTitle: string
}>()
</script>
