<template>
  <PageLayout page-title="Callback" v-if="!error"/>
  <PageLayout page-title="That's an error!">
    <span>error: {{ error }}</span>
  </PageLayout>
</template>

<script setup>
import PageLayout from "@/components/PageLayout.vue";
import { useAuth0 } from "@auth0/auth0-vue";
import {onMounted, onUpdated} from "vue";

const { error } = useAuth0();

onMounted(() => {
  try {
    console.log("mounted error:", typeof error, error)
  } catch (e) {
    console.log("mounted e (catch):", typeof e, e)
  }
})
onUpdated(() => {
  try {
    console.log("onUpdated error:", typeof error, error)
  } catch (e) {
    console.log("onUpdated e (catch):", typeof e, e)
  }
})
</script>
