<template>
  <PageLayout>
    <h1 class="white_background">GIS machine learning POC</h1>
    <h2 class="white_background">In this project I use the <a class="white_background underlined" href="https://github.com/opengeos/segment-geospatial/">segment-geospatial</a> project build in an AWS Lambda.</h2>
  </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from "@/components/page-layout.vue";
</script>

<style>
.underlined {
  text-decoration: underline;
}
.white_background {
  background-color: white;
  color: black;
}
</style>