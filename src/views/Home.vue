<template>
  <PageLayout>
    <div class="white_background">
      <h1 class="white_background">SamGIS: GIS machine learning POC</h1>
      <h4 class="white_background">In this project 
        (inspired by <a class="white_background underlined" href="https://github.com/opengeos/segment-geospatial/">segment-geospatial</a>)
        I perform inference on geospatial data by making requests to a serverless API based on a machine learning model based on
        <a class="white_background underlined" href="https://github.com/vietanhdev/samexporter/">SAM Exporter</a>.
      </h4>
      <h4 class="white_background"><a class="white_background underlined" href="https://trinca.tornidor.com/projects/samgis-sam-exporter-for-GIS">Here</a> my project presentation.</h4>
    </div>
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