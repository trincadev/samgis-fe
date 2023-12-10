<template>
  <footer class="flex flex-shrink-0 w-full mt-10 font-medium text-center text-2xl leading-10">
    <div class="grid w-full p-12 auto-cols-auto max-w-6xl">
      <div class="grid auto-cols-auto gap-2">
        <div class="text-left">
          <p class="font-medium mb-6">
            <span>An inference machine learning POC applied to GIS thanks to
              <PageFooterHyperlink path="https://github.com/vietanhdev/samexporter/">SAM Exporter</PageFooterHyperlink>
              and inspired by <PageFooterHyperlink path="https://samgeo.gishub.org/">Segment Geospatial</PageFooterHyperlink>
            </span>
          </p>
        </div>
      </div>
      
    </div>
  </footer>
</template>

<script setup lang="ts">
import PageFooterHyperlink from "@/components/PageFooterHyperlink.vue";
</script>