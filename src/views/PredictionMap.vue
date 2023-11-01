<template>
    <PageLayout>
        <div class="content-layout">
            <h1 id="page-title" class="content__title">Predictions Map Page</h1>
            <div class="content__body">
                <p id="page-description">
                    <span>This page displays predictions made with a remote machine learning model living within an AWS Lambda.</span>
                </p>

                <div id="map-container-md">
                    <PredictionMap :center='[46.144436, 9.377447]' :mapName="mapName" zoom=15 :accessToken="accessToken"/>
                </div>
            </div>
        </div>
    </PageLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuth0 } from "@auth0/auth0-vue";

import PredictionMap from '@/components/page-prediction-map.vue';
import PageLayout from "@/components/page-layout.vue";

const mapName = ref("prediction-map");
const accessToken = ref("placeholder");

const getAccessToken = async () => {
  const { getAccessTokenSilently } = useAuth0();
  accessToken.value = await getAccessTokenSilently();
};

onMounted( async() => {
    await getAccessToken()
})
</script>
