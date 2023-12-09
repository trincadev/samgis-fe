<template>
  <PageLayout>
    <div class="flex flex-col flex-shrink-0 w-full p-12 flex-1">
      <h1 id="page-title" class="mt-0 text-white">Profile Page</h1>
      <div class="text-2xl leading-10">
        <p id="flex flex-col">
          <span
            >You can use the <strong>ID Token</strong> to get the profile
            information of an authenticated user.</span
          >
          <span
            ><strong
              >Only authenticated users can access this page.</strong
            ></span
          >
        </p>
        <div class="profile-grid">
          <div class="profile__header">
            <img :src="user.picture" alt="Profile" class="profile__avatar" />
            <div class="profile__headline">
              <h2 class="profile__title">{{ user.name }}</h2>
              <span class="profile__description">{{ user.email }}</span>
            </div>
          </div>
          <div class="profile__details">
            <CodeSnippet title="Decoded ID Token" :code="code" />
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import CodeSnippet from "@/components/code-snippet.vue";
import PageLayout from "@/components/PageLayout.vue";
import { useAuth0 } from "@auth0/auth0-vue";

const { user } = useAuth0();

const code = user ? JSON.stringify(user.value, null, 2) : "";
</script>
