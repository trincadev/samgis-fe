<template>
  <div class="flex flex-col w-full rounded-lg mt-12 overflow-hidden">
    <h2 class="w-full font-semibold text-white bg-gray-600">{{ props.title }}</h2>
    <div class="bg-gray-300 overflow-x-auto">
      <div class="inline-block p-8">
        <pre class="m-0 text-base leading-8 whitespace-pre-wrap breaks-words">{{ props.code }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  code: string,
  title: string,
}>()
</script>
