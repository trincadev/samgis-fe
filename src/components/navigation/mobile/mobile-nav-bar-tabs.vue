<template>
  <div class="mobile-nav-bar__tabs">
    <template v-if="isAuthenticated">
      <MobileNavBarTab path="/prediction-map" label="Prediction Map" />
      <MobileNavBarTab path="/profile" label="Profile" />
    </template>
  </div>
</template>

<script setup lang="ts">
import MobileNavBarTab from "@/components/navigation/mobile/mobile-nav-bar-tab.vue";
import { useAuth0 } from "@auth0/auth0-vue";

const { isAuthenticated } = useAuth0();
</script>

<style scoped></style>
