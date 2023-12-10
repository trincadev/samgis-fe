<template>
  <PageLayout page-title="SamGIS: segment Anything applied to geodata">
    <p>SamGIS is an attempt to perform
      <a href="https://developer.ibm.com/learningpaths/get-started-artificial-intelligence/ai-basics/ai-beginners-guide">machine learning</a>
      <span>&ensp;</span>
      <a href="https://en.wikipedia.org/wiki/Image_segmentation">instance segmentation</a> on
      <a href="https://en.wikipedia.org/wiki/Geographic_data_and_information">geospatial data</a>
      even without the use of dedicated graphics cards.</p>
    <p>The user interact on a <a href="https://leafletjs.com">leaflet</a> webmap choosing areas to recognize and then
      a serverless python backend responds with a <a href="https://it.wikipedia.org/wiki/GeoJSON">geojson</a>
      containing one or more recognized polygons within the initial webmap.</p>
    <p>The backend perform machine learning inference using a <a href="https://segment-anything.com">Segment Anything</a> model using
      <a href="https://onnxruntime.ai">ONNXRuntime</a> as runtime.</p>
    <p>Check about implementation details on my <a href="https://trinca.tornidor.com/projects/samgis-sam-exporter-for-GIS">blog</a>.</p>
  </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from "@/components/PageLayout.vue";
</script>
