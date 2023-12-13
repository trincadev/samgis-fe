<template>
  <!-- style 'z-index: 1001' here is needed to avoid override from leafletjs css -->
  <ul class="bg-gray-200 fixed" style="z-index: 1001">
    <li class="float-left"><NavBarBrand /></li>
    <li class="float-left"><NavBarTab path="/" label="Home" /></li>
    <li class="float-left"><NavBarTab path="/blog" label="My blog" /></li>
    <li class="float-left"><NavBarTab path="/docs" label="SamGIS Documentation" /></li>
    <template v-if="isAuthenticated">
      <li class="float-left"><NavBarTab path="/prediction-map" label="Prediction Map" /></li>
      <li class="float-left"><NavBarTab path="/profile" label="User Profile" /></li>
    </template>

    <li class="float-right">
      <LoginButton v-if="!isAuthenticated" />
      <LogoutButton v-else />
    </li>
  </ul>
</template>

<script setup lang="ts">
import NavBarBrand from "@/components/navigation/desktop/SideBarBrand.vue";
import NavBarTab from '@/components/navigation/desktop/SideBarTab.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import LogoutButton from '@/components/buttons/LogoutButton.vue'
import LoginButton from '@/components/buttons/LoginButton.vue'

const { isAuthenticated } = useAuth0();
</script>