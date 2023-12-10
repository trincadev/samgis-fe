<template>
  <ButtonComponent :click="handleLogin" class="bg-green-400">LogIn</ButtonComponent>
</template>

<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'

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
