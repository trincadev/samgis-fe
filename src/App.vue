<template>
  <div class="">
    <PageLoader v-if="isLoading" />
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import PageLoader from "@/components/PageLoader.vue";
import { useAuth0 } from "@auth0/auth0-vue";

const { isLoading } = useAuth0();
</script>
