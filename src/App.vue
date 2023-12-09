<template>
  <div v-if="isLoading" class="flex flex-col items-center h-full w-full">
    <PageLoader />
  </div>
  <router-view v-else />
</template>

<script setup lang="ts">
import PageLoader from "@/components/page-loader.vue";
import { useAuth0 } from "@auth0/auth0-vue";

const { isLoading } = useAuth0();
</script>
