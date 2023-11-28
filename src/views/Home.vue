<template>
  <PageLayout>
    <div class="white_background">
      <h1 class="white_background">SamGIS: GIS machine learning POC</h1>
      <h4 class="white_background">
        <p>SamGIS is an attempt to perform instance segmentation on geospatial data even without the 
        use of dedicated graphics cards.</p>
        <p>The user interact on a <a class="white_background underlined" href="https://leafletjs.com">leaflet</a> webmap choosing areas to recognize and
        a serverless python backend responds with a geojson containing one or more recognized polygons within the initial webmap.</p>
        <p>The backend perform machine learning inference using a Segment Anything model using 
        <a class="white_background underlined" href="https://onnxruntime.com">ONNXRuntime</a> as runtime.</p>
        <p>Check about implementation details on my <a class="white_background underlined" href="https://trinca.tornidor.com/projects/samgis-sam-exporter-for-GIS">blog</a>.</p>
      </h4>
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