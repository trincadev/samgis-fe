<template>
  <NavBarTextElement>
    <button class="pb-2" @click="props.click">
      <slot></slot>
    </button>
  </NavBarTextElement>
</template>

<script setup lang="ts">
import NavBarTextElement from '@/components/navigation/desktop/NavBarTextElement.vue'

const props = defineProps<{
  click: Function
}>()
</script>