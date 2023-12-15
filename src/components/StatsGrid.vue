<template>

  <dl class="grid gap-2 pt-2 p-2" v-for="item in props.statsArray" v-bind:key="item.statName">
    <div class="flex flex-col rounded-lg bg-blue-100 px-4 py-8 text-center">
      <dt class="order-last text-lg font-medium text-gray-500">{{ item.statName }}</dt>
      <dd class="text-xl font-extrabold text-blue-600 md:text-2xl">{{ item.statValue }}</dd>
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