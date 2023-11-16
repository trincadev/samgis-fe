<template>
  <footer class="page-footer">
    <div class="page-footer-grid">
      <div class="page-footer-grid__info">
        <div class="page-footer-info__message">
          <p class="page-footer-message__headline">
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
import PageFooterHyperlink from "@/components/page-footer-hyperlink.vue";
</script>