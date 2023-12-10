<template>
  <div class="animate-spin h-20 w-20 m-auto">
    <img :src="loadingImg" alt="Loading..." />
  </div>
</template>

<script setup lang="ts">
const loadingImg = "/loader.svg";
</script>
