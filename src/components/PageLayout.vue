<template>
  <div class="">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 z-40 h-screen w-72 border-r pr-2" aria-label="Sidenav" id="drawer-navigation">
      <SideBarBrand class="pl-4 pt-4"/>
      <div class="h-full overflow-y-auto">
        <ul class="mt-5 space-y-2 border-t border-gray-200 pt-4 pl-4">
          <li><SideBarTab path="/" label="Home" /></li>
          <li><SideBarTab path="/blog" label="My blog" /></li>
          <li><SideBarTab path="/docs" label="SamGIS Documentation" /></li>
          <template v-if="isAuthenticated">
            <li><SideBarTab path="/prediction-map" label="Prediction Map" /></li>
            <li><SideBarTab path="/profile" label="User Profile" /></li>
          </template>
        </ul>
      </div>
      <ul class="absolute bottom-4 z-20 pl-4 lg:flex">
        <li>
          <LoginButton v-if="!isAuthenticated" class="w-56" />
          <LogoutButton v-else class="w-56" />
        </li>
      </ul>
    </aside>

    <main class="h-auto ml-72">
      <div class="mb-4 grid grid-cols-1 gap-4 py-16 pl-2">
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

const { isAuthenticated } = useAuth0();

const props = defineProps<{
  pageTitle: string
}>()
</script>
