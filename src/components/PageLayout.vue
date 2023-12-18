<template>
  <div class="">
    <!-- Sidebar -->
    <SideBar />

    <main class="h-auto ml-24 lg:ml-64">
      <!-- style 'z-index: 1001' here is needed to avoid override from leafletjs css -->
      <h1 class="fixed top-0 h-10 md:h-16 w-full bg-gray-200 pl-2 pt-2 md:pt-4" style="z-index: 9999">{{  props.pageTitle }}</h1>
      <div class="pt-12 md:pt-20 pb-6">
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
import { useAuth0 } from '@auth0/auth0-vue'
import SideBar from '@/components/navigation/desktop/SideBar.vue'
import PageFooterHyperlink from "@/components/PageFooterHyperlink.vue";

const { isAuthenticated } = useAuth0();

const props = defineProps<{
  pageTitle: string
}>()
</script>
