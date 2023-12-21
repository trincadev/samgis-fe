<template>
  <div class="relative min-h-screen lg:flex">
    <!-- Sidebar -->
    <SideBar />

    <main id="content" class="flex-1 pb-12 space-y-6 px-2 overflow-y-auto lg:h-screen md:space-y-8">
      <header class="hidden lg:flex items-center justify-between h-20 bg-gray-100 border-b sd:h-10">
        <h1>{{  props.pageTitle }}</h1>
      </header>

      <section class="">
        <slot></slot>
      </section>

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
