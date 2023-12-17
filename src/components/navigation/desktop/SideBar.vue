<template>
  <aside class="fixed left-0 top-0 z-40 h-screen border-r px-2 w-28 xl:w-72" aria-label="Sidenav" id="drawer-navigation">
    <SideBarBrand class="mt-4 mx-2"/>
    <div class="h-full">
      <ul class="mt-5 space-y-2 border-t border-gray-200">
        <li><SideBarTab path="/" label="Home" alt-image="Home" path-image="/home-page.svg" /></li>
        <li><SideBarTab path="/blog" label="My blog" alt-image="my blog" path-image="/blog.jpg"/></li>
        <li><SideBarTab path="/docs" label="SamGIS Documentation" alt-image="samgis docs" path-image="api-docs.svg"/></li>
        <template v-if="isAuthenticated">
          <li><SideBarTab path="/prediction-map" label="Prediction Map" alt-image="prediction map" path-image="/prediction-map-bw.svg" /></li>
          <li><SideBarTab path="/profile" label="User Profile" alt-image="user profile" path-image="/user-profile.svg" /></li>
        </template>
      </ul>
    </div>
    <ul class="absolute bottom-4 z-20 lg:flex">
      <li>
        <SideBarElement>
          <LoginButton v-if="!isAuthenticated" class="w-20 xl:w-56" />
          <LogoutButton v-else class="w-20 xl:w-56" />
        </SideBarElement>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import LogoutButton from '@/components/buttons/LogoutButton.vue'
import LoginButton from '@/components/buttons/LoginButton.vue'
import SideBarTab from '@/components/navigation/desktop/SideBarTab.vue'
import SideBarBrand from '@/components/navigation/desktop/SideBarBrand.vue'
import SideBarElement from '@/components/navigation/desktop/SideBarElement.vue'

const { isAuthenticated } = useAuth0();
</script>