<template>
  <dl class="grid pt-2 pb-2 md:pt-1 md:pb-1" v-for="item in props.statsArray" v-bind:key="item.statName">
    <div class="flex flex-col bg-blue-100 text-center md:py-2 md:px-2">
      <dt class="order-last font-medium text-gray-500">{{ item.statName }}</dt>
      <dd class="text-lg font-extrabold text-blue-600">{{ item.statValue }}</dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
const props = defineProps<{
  statsArray: Array<{
    statName: string,
    statValue: string
  }>
}>()
</script>