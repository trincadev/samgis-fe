<template>
    <ButtonComponent :click="handleLogout" class="bg-purple-400">
      <img
        alt="logout"
        class="opacity-75"
        src="/logout.svg"
        width="48"
        height="48"
      />
    </ButtonComponent>
</template>

<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import NavBarTextElement from '@/components/navigation/desktop/SideBarTextElement.vue'

const { logout } = useAuth0();

const handleLogout = () =>
  logout({
    logoutParams: {
      returnTo: window.location.origin,
    }
  });
</script>
