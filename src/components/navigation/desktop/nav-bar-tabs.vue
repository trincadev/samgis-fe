<template>
  <div class="flex items-center justify-end flex-1">
      <NavBarTab path="/blog" label="My blog and website" />
      <NavBarTab path="/docs" label="SamGIS Documentation" />
    <template v-if="isAuthenticated">
      <NavBarTab path="/prediction-map" label="Prediction Map" />
      <NavBarTab path="/profile" label="Profile" />
    </template>
  </div>
</template>

<script setup lang="ts">
import NavBarTab from "@/components/navigation/desktop/nav-bar-tab.vue";
import { useAuth0 } from "@auth0/auth0-vue";

const { isAuthenticated } = useAuth0();
</script>
