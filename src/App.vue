<template>
  <div class="hidden md:inline md:mr-4 md:mb-4 md:ml-4">
    <PageLoader v-if="isLoading"/>
    <router-view v-else />
  </div>
  <div class="inline md:hidden">mobile...</div>
</template>

<script setup lang="ts">
import PageLoader from "@/components/PageLoader.vue";
import { useAuth0 } from "@auth0/auth0-vue";

const { isLoading } = useAuth0();
</script>
