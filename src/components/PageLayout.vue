<template>
  <div class="relative min-h-screen lg:flex">
    <!-- Sidebar -->
    <SideBar />

    <main id="content" class="flex-1 z-1 pb-12 ml-[3.3rem] lg:ml-0 mr-4 overflow-y-auto md:pl-1 lg:h-screen">
      <header class="hidden items-center justify-between h-10 ml-2 landscape:md:flex portrait:sd:flex portrait:md:h-12 xl:h-16 bg-gray-200 border-b">
        <h1 class="hidden sd:text-sm ml-2 md:block md:text-xl lg:text-3xl">{{  props.pageTitle }}</h1>
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
