<template>
  <PageLayout>

    <div class="bg-white text-black">
      <h1 class="bg-white text-black">SamGIS: segment Anything applied to geodata</h1>
      <h4 class="bg-white text-black">
        <p>SamGIS is an attempt to perform
          <a class="bg-white text-black underline" href="https://developer.ibm.com/learningpaths/get-started-artificial-intelligence/ai-basics/ai-beginners-guide">machine learning</a>
          <span>&ensp;</span>
          <a class="bg-white text-black underline" href="https://en.wikipedia.org/wiki/Image_segmentation">instance segmentation</a> on
          <a class="bg-white text-black underline" href="https://en.wikipedia.org/wiki/Geographic_data_and_information">geospatial data</a>
          even without the use of dedicated graphics cards.</p>
        <p>The user interact on a <a class="bg-white text-black underline" href="https://leafletjs.com">leaflet</a> webmap choosing areas to recognize and then
        a serverless python backend responds with a <a class="bg-white text-black underline" href="https://it.wikipedia.org/wiki/GeoJSON">geojson</a>
        containing one or more recognized polygons within the initial webmap.</p>
        <p>The backend perform machine learning inference using a <a class="bg-white text-black" href="https://segment-anything.com">Segment Anything</a> model using
        <a class="bg-white text-black underline" href="https://onnxruntime.ai">ONNXRuntime</a> as runtime.</p>
        <p>Check about implementation details on my <a class="bg-white text-black underline" href="https://trinca.tornidor.com/projects/samgis-sam-exporter-for-GIS">blog</a>.</p>
      </h4>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from "@/components/page-layout.vue";
</script>
