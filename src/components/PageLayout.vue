<template>
  <div class="relative min-h-screen lg:flex">
    <!-- Sidebar -->
    <SideBar />

    <main id="content" class="flex-1 z-1 pb-12 ml-2 mr-4 overflow-y-auto lg:space-y-6 md:pl-1 lg:h-screen">
      <header class="hidden portrait:md:flex lg:flex pl-[3.2rem] lg:pl-0 items-center justify-between h-16 bg-gray-100 border-b sd:h-10">
        <h1>{{  props.pageTitle }}</h1>
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
