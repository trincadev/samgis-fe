<template>
  <button @click="isOpen = !isOpen" class="fixed p-1 rounded-lg focus:outline-none hover:bg-gray-700 lg:hidden">
    <span>☰</span>
  </button>

  <aside id="sidebar" class="fixed bg-gray-200 inset-y-0 left-0 z-99999 flex flex-col w-[3.2rem] lg:w-[4.5rem] min-h-screen space-y-6 overflow-y-auto text-gray-100 transition duration-200 transform lg:translate-x-0 lg:relative lg:inset-0">
    <div class="flex flex-col items-center flex-1 space-y-6">
      <nav class="flex flex-col items-center space-y-6">
        <SideBarTab path="/" label="Home" alt-image="Home" path-image="/home-page.svg" />
        <SideBarTab path="/blog" label="My blog" alt-image="my blog" path-image="/blog.svg"/>
        <SideBarTab path="/docs" label="SamGIS Documentation" alt-image="samgis docs" path-image="api-docs.svg"/>
        <template v-if="isAuthenticated">
          <SideBarTab path="/prediction-map" label="Prediction Map" alt-image="prediction map" path-image="/prediction-map-bw.svg" />
          <SideBarTab path="/profile" label="User Profile" alt-image="user profile" path-image="/user-profile.svg" />
        </template>
      </nav>
    </div>

    <div class="flex justify-center border-gray-600 lg:py-1">
      <LoginButton v-if="!isAuthenticated" class="w-12 mb-4 lg:w-18" />
      <LogoutButton v-else class="w-12 mb-4 lg:w-18" />
    </div>
  </aside>

</template>

<script setup lang="ts">
import {ref} from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import LogoutButton from '@/components/buttons/LogoutButton.vue'
import LoginButton from '@/components/buttons/LoginButton.vue'
import SideBarTab from '@/components/navigation/desktop/SideBarTab.vue'
import SideBarBrand from '@/components/navigation/desktop/SideBarBrand.vue'
import SideBarElement from '@/components/navigation/desktop/SideBarElement.vue'

const { isAuthenticated } = useAuth0();
const isOpen = ref(false)
</script>