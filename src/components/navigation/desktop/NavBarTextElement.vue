<template>
  <NavBarElement>
    <div class="text-xl pl-2 pr-2 pt-4 pb-2 font-semibold cursor-pointer leading-10">
      <slot></slot>
    </div>
  </NavBarElement>
</template>

<script setup lang="ts">
import NavBarElement from '@/components/navigation/desktop/NavBarElement.vue'
</script>
