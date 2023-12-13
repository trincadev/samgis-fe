<template>
  <div class="">
    <!-- Sidebar -->
    <SideBar />

    <main class="h-auto ml-72">
      <div class="mb-4 grid grid-cols-1 gap-4 py-16 pl-2">
        <!-- style 'z-index: 1001' here is needed to avoid override from leafletjs css -->
        <h1 class="fixed top-0 h-16 w-full bg-gray-200 pl-2 pt-4" style="z-index: 1001">{{  props.pageTitle }}</h1>
        <div class="pt-4">
        <slot></slot>
        </div>
      </div>

      <div class="fixed bottom-0 w-full text-black pl-2">
        <Footer></Footer>
      </div>
    </main>
  </div>

</template>

<script setup lang="ts">
import Footer from "@/components/PageFooter.vue"
import { useAuth0 } from '@auth0/auth0-vue'
import LogoutButton from '@/components/buttons/LogoutButton.vue'
import LoginButton from '@/components/buttons/LoginButton.vue'
import SideBarTab from '@/components/navigation/desktop/SideBarTab.vue'
import SideBarBrand from '@/components/navigation/desktop/SideBarBrand.vue'
import SideBar from '@/components/navigation/desktop/SideBar.vue'

const { isAuthenticated } = useAuth0();

const props = defineProps<{
  pageTitle: string
}>()
</script>
