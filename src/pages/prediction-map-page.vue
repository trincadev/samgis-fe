<template>
    <PageLayout>
        <div class="content-layout">
            <h1 id="page-title" class="content__title">Predictions Map Page</h1>
            <div class="content__body">
                <p id="page-description">
                    <span>This page displays predictions made with a remote machine learning model living within an AWS Lambda.</span>
                </p>

                <div id="map-container-md">
                    <PredictionMap :center='[46.144436, 9.377447]' :mapName="mapName" zoom=15 />
                </div>
            </div>
        </div>
    </PageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PredictionMap from '@/components/page-prediction-map.vue';
import PageLayout from "@/components/page-layout.vue";

const mapName = ref("prediction-map");
</script>
