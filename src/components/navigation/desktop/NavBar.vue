<template>
  <ul class="bg-gray-200 fixed w-full z-999">
    <li class="float-left"><NavBarBrand /></li>
    <li class="float-left"><NavBarTab path="/blog" label="My blog and website" /></li>
    <li class="float-left"><NavBarTab path="/docs" label="SamGIS Documentation" /></li>
    <template v-if="isAuthenticated">
      <li class="float-left"><NavBarTab path="/prediction-map" label="Prediction Map" /></li>
      <li class="float-left"><NavBarTab path="/profile" label="Profile" /></li>
    </template>

    <li class="float-right">
      <LoginButton v-if="!isAuthenticated" />
      <LogoutButton v-else />
    </li>
  </ul>
</template>

<script setup lang="ts">
import NavBarBrand from "@/components/navigation/desktop/NavBarBrand.vue";
import NavBarTab from '@/components/navigation/desktop/NavBarTab.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import NavBarTextElement from '@/components/navigation/desktop/NavBarTextElement.vue'
import LogoutButton from '@/components/buttons/LogoutButton.vue'
import LoginButton from '@/components/buttons/LoginButton.vue'

const { isAuthenticated } = useAuth0();
</script>