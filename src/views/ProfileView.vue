<template>
  <PageLayout page-title="Profile page">
    <div>
      <div>
        <p id="flex flex-col">
          <span>You can use the <strong>ID Token</strong> to get the profile
            information of an authenticated user. </span>
          <span><strong>Only authenticated users can access this page.</strong></span>
        </p>
        <div class="flex flex-col mt-6">
          <div class="grid grid-cols-[auto_1fr] gap-x-4">
            <img :src="user.picture" alt="Profile" class="border-1 rounded-sm h-15 w-15" />
            <div class="flex flex-col justify-around">
              <h2 class="mt-0 mb-0 text-white">{{ user.name }}</h2>
              <span class="text-xl">{{ user.email }}</span>
            </div>
          </div>
          <div class="mt-4">
            <CodeSnippet title="Decoded ID Token" :code="code" />
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import CodeSnippet from "@/components/CodeSnippet.vue";
import PageLayout from "@/components/PageLayout.vue";
import { useAuth0 } from "@auth0/auth0-vue";

const { user } = useAuth0();

const code = user ? JSON.stringify(user.value, null, 2) : "";
</script>
