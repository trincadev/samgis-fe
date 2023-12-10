<template>
  <PageLayout v-if="error">
    <div class="flex flex-col flex-shrink-0 w-full p-12 flex-1">
      <h1 id="page-title" class="mt-0 text-white">Error</h1>
      <div class="text-2xl leading-10">
        <p id="flex flex-col">
          <span>{{ error.message }}</span>
        </p>
      </div>
    </div>
  </PageLayout>
  <div class="flex flex-col items-center h-full w-full" v-else>
    <NavBar />
    <div class="flex flex-1 flex-basis flex-col items-center h-full w-full max-w-9xl" />
  </div>
</template>

<script setup>
import NavBar from "@/components/navigation/desktop/nav-bar.vue";
import PageLayout from "@/components/PageLayout.vue";
import { useAuth0 } from "@auth0/auth0-vue";

const { error } = useAuth0();
</script>
