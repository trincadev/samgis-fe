<template>
  <footer class="page-footer">
    <div class="page-footer-grid">
      <div class="page-footer-grid__info">
        <div class="page-footer-info__message">
          <p class="page-footer-message__headline">
            <span>An inference machine learning POC applied to GIS thanks to </span>
            <PageFooterHyperlink path="https://samgeo.gishub.org/">
              Segment Geospatial
            </PageFooterHyperlink>
          </p>
          <p>
            <PageFooterHyperlink path="https://github.com/opengeos/segment-geospatial/">
                Segment Geospatial - github
            </PageFooterHyperlink>
          </p>
        </div>
      </div>
      
    </div>
  </footer>
</template>

<script setup lang="ts">
import PageFooterHyperlink from "@/components/page-footer-hyperlink.vue";
</script>