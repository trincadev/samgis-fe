<template>
    <ButtonComponent :click="handleLogout" class="bg-purple-400">LogOut</ButtonComponent>
</template>

<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'

const { logout } = useAuth0();

const handleLogout = () =>
  logout({
    logoutParams: {
      returnTo: window.location.origin,
    }
  });
</script>
