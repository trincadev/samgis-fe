<template>
  <div class="loader">
    <img :src="loadingImg" alt="Loading..." />
  </div>
</template>

<script setup lang="ts">
const loadingImg = "/loader.svg";
</script>
