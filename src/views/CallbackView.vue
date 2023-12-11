<template>
  <PageLayout page-title="That's an error!" v-if="error">
    <div class="flex flex-col flex-shrink-0 w-full p-12 flex-1">
      <div class="text-2xl leading-10">
        <p id="flex flex-col">
          <span>{{ error.message }}</span>
        </p>
      </div>
    </div>
  </PageLayout>
  <PageLayout page-title="" v-else />
</template>

<script setup>
import PageLayout from "@/components/PageLayout.vue";
import { useAuth0 } from "@auth0/auth0-vue";

const { error } = useAuth0();
</script>
