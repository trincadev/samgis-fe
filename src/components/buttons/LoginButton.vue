<template>
  <ButtonComponent :click="handleLogin" class="bg-green-400">
    <img
      alt="login"
      class="opacity-75"
      src="/login.svg"
      width="48"
      height="48"
    />
  </ButtonComponent>
</template>

<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'

import NavBarTextElement from '@/components/navigation/desktop/SideBarTextElement.vue'

const { loginWithRedirect } = useAuth0();

const handleLogin = () => {
  loginWithRedirect({
    appState: {
      target: "/profile",
    },
    authorizationParams: {
      prompt: "login",
    }
  });
};
</script>
