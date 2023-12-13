<template>
  <PageLayout page-title="Callback" v-if="!error"/>
  <PageLayout page-title="That's an error!">
    <span>{{ error.message }}</span>
  </PageLayout>
</template>

<script setup>
import PageLayout from "@/components/PageLayout.vue";
import { useAuth0 } from "@auth0/auth0-vue";

const { error } = useAuth0();
</script>
