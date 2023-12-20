<template>
  <div class="inline notVerySmallTablet:hidden">
    mobile
  </div>
  <div class="hidden notVerySmallTablet:inline notVerySmallTablet:mr-1 notVerySmallTablet:mb-1 notVerySmallTablet:ml-1 2md:mr-4 2md:mb-4 2md:ml-4">
    <PageLoader v-if="isLoading" />
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import PageLoader from "@/components/PageLoader.vue";
import { useAuth0 } from "@auth0/auth0-vue";

const { isLoading } = useAuth0();
</script>
