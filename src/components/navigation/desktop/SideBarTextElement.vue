<template>
  <SideBarElement>
    <div class="text-lg font-semibold leading-10">
      <slot></slot>
    </div>
  </SideBarElement>
</template>

<script setup lang="ts">
import SideBarElement from '@/components/navigation/desktop/SideBarElement.vue'
</script>
