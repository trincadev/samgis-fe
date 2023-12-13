<template>
  <NavBarTextElement>
    <button class="pb-2 w-24" @click="props.click">
      <slot></slot>
    </button>
  </NavBarTextElement>
</template>

<script setup lang="ts">
import NavBarTextElement from '@/components/navigation/desktop/SideBarTextElement.vue'

const props = defineProps<{
  click: Function
}>()
</script>