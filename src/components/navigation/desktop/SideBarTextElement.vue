<template>
  <SideBarElement>
    <div class="text-xl pl-2 pr-2 pt-4 pb-2 font-semibold cursor-pointer leading-10">
      <slot></slot>
    </div>
  </SideBarElement>
</template>

<script setup lang="ts">
import SideBarElement from '@/components/navigation/desktop/SideBarElement.vue'
</script>
