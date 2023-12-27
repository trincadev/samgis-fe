<template>
  <PageLayout page-title="Prediction map page">
    <div>
      <div id="map-container-md">
        <!--
          {"lat":46.221324377125434,"lng":9.319281622674922}, zoom:12

          {
              "_southWest": {
                  "lat": 46.1471347810282,
                  "lng": 9.32121276855469
              },
              "_northEast": {
                  "lat": 46.228421781941776,
                  "lng": 9.49699401855469
              }
          }
        -->
        <PredictionMap
          :mapName="mapName"
          :mapBounds='[{
                    "lat": 46.235421781941776,
                    "lng": 9.49699401855469
                }, {
                    "lat": 46.1351347810282,
                    "lng": 9.32121276855469
              }]'
          :accessToken="accessToken"
          description="This page displays predictions made with a remote machine learning model living within an AWS Lambda..."
        />
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

import PredictionMap from '@/components/PagePredictionMap.vue'
import PageLayout from '@/components/PageLayout.vue'

const mapName = ref('prediction-map')
const accessToken = ref('placeholder')

const getAccessToken = async () => {
  const { getAccessTokenSilently } = useAuth0()
  accessToken.value = await getAccessTokenSilently()
}

onMounted(async () => {
  await getAccessToken()
})
</script>
