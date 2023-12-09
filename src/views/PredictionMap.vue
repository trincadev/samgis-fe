<template>
    <PageLayout>
        <div class="flex flex-col flex-shrink-0 w-full p-12 flex-1">
            <h1 id="page-title" class="mt-0 text-white">Predictions Map Page</h1>
            <div class="text-2xl leading-10">
                <p id="flex flex-col">
                    <span>This page displays predictions made with a remote machine learning model living within an AWS Lambda.</span>
                </p>

                <div id="map-container-md">
                    <!-- {"lat":46.221324377125434,"lng":9.319281622674922}, zoom:12-->
                    <PredictionMap :center='[46.187787809247155, 9.409068707518045]' :mapName="mapName" zoom=13 :accessToken="accessToken"/>
                </div>
            </div>
        </div>
    </PageLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuth0 } from "@auth0/auth0-vue";

import PredictionMap from '@/components/page-prediction-map.vue';
import PageLayout from "@/components/PageLayout.vue";

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
