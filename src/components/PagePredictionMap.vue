<template>
  <div class="h-auto">
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 border-r bg-gray-50">
      <div class="h-screen rounded-lg bg-white">

        <div>
          <div id="map" class="map-predictions" />

          <button
            class="bg-gray-300 h-14 min-w-[240px] max-w-[240px] mt-2 mb-2 bg-opacity-50"
            :disabled="promptsArrayRef.length == 0 || responseMessageRef === waitingString"
            v-if="promptsArrayRef.length == 0 || responseMessageRef === waitingString"
          >{{ responseMessageRef === waitingString ? responseMessageRef : "Empty prompt (disabled)" }}</button>
          <button
            class="bg-blue-300 h-14 min-w-[240px] max-w-[240px] mt-2 mb-2 p-2 whitespace-no-wrap overflow-hidden truncate"
            @click="sendMLRequest(map, promptsArrayRef, currentBaseMapNameRef)"
            v-else
          >
            <span v-if="responseMessageRef && responseMessageRef != '-'">{{ responseMessageRef }}</span>
            <span v-else>send ML request</span>
          </button>

          <div class="grid grid-cols-3 bg-white">
            <StatsGrid :stats-array="[
              {statName: 'current Zoom', statValue: currentZoomRef},
              {statName: 'current map name/type', statValue: currentBaseMapNameRef},
              {statName: 'prompt: points/rectangles number', statValue: promptsArrayRef.length},
            ]" />
          </div>

          <div v-if="responseMessageRef === waitingString" />
          <h1 v-else-if="responseMessageRef || responseMessageRef == '-'">{{ responseMessageRef }}</h1>
          <div v-else>
            <div class="grid grid-cols-3 bg-white">
              <StatsGrid :stats-array="[
                  {statName: 'request duration', statValue: `${durationRef.toFixed(2)}s`},
                  {statName: 'polygons number', statValue: numberOfPolygonsRef},
                  {statName: 'predicted masks number', statValue: numberOfPredictedMasksRef},
                ]" />
            </div>
          </div>

        </div>
      </div>

      <div class="h-full max-h-max rounded-lg bg-white border-dashed pl-4 pr-2">
        <h1>ML request prompt</h1>
        <div v-if="promptsArrayRef.filter(el => {return el.type === 'point'}).length > 0">
          <TableGenericComponent
            :header="['id', 'data', 'label']"
            :rows="applyFnToObjectWithinArray(promptsArrayRef.filter(el => {return el.type === 'point'}))"
            title="Points"
            row-key="id"
          />
        </div>
        <br/>
        <div v-if="promptsArrayRef.filter(el => {return el.type === 'rectangle'}).length > 0">
          <TableGenericComponent
            :header="['id', 'data_ne', 'data_sw']"
            :rows="applyFnToObjectWithinArray(promptsArrayRef.filter(el => {return el.type === 'rectangle'}))"
            title="Rectangles"
            row-key="id"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  control as LeafletControl, Evented as LEvented, geoJSON as LeafletGeoJSON, type LatLng,
  Map as LMap, map as LeafletMap, tileLayer, TileLayer as LTileLayer
} from "leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet-providers';
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { onMounted, ref, type Ref } from "vue";

import {
  durationRef,
  numberOfPolygonsRef,
  numberOfPredictedMasksRef,
  OpenStreetMap,
  prefix,
  responseMessageRef,
  Satellite,
  waitingString
} from './constants'
import {
  applyFnToObjectWithinArray,
  getExtentCurrentViewMapBBox,
  getGeoJSONRequest,
  getSelectedPointCoordinate,
  setGeomanControls,
  updateMapData
} from './helpers'
import type { IBodyLatLngPoints, IPointPrompt, IRectanglePrompt, SourceTileType } from './types'
import StatsGrid from '@/components/StatsGrid.vue'
import TableGenericComponent from '@/components/TableGenericComponent.vue'

const currentBaseMapNameRef = ref()
const currentMapBBoxRef = ref()
const currentZoomRef = ref()
const promptsArrayRef: Ref<Array<IPointPrompt | IRectanglePrompt>> = ref([])
let map: LMap
type ServiceTiles = {
    [key: SourceTileType]: LTileLayer;
};

const props = defineProps<{
  accessToken: string,
  center: LatLng,
  mapName: string,
  zoom: string
}>()

const getPopupContentPoint = (leafletEvent: LEvented, label: number): HTMLDivElement => {
  let popupContent: HTMLDivElement = document.createElement("div");
  let currentPointLayer: LatLng = getSelectedPointCoordinate(leafletEvent)

  popupContent.innerHTML = `<span>lat:${JSON.stringify(currentPointLayer.lat)}<br/>`
  popupContent.innerHTML += `lng:${JSON.stringify(currentPointLayer.lng)}<br/>`
  popupContent.innerHTML += `label:${label}, id:${leafletEvent.layer._leaflet_id}</span>`

  const popupDiv: HTMLDivElement = document.createElement('div')
  popupDiv.className = 'leaflet-popup-content-inner'
  popupDiv.appendChild(popupContent)

  return popupDiv
}

const sendMLRequest = async (leafletMap: LMap, promptRequest: Array<IPointPrompt | IRectanglePrompt>, sourceType: SourceTileType = OpenStreetMap) => {
  if (map.pm.globalDragModeEnabled()) {
    map.pm.disableGlobalDragMode()
  }
  if (map.pm.globalEditModeEnabled()) {
    map.pm.disableGlobalEditMode()
  }
  console.log('sendMLRequest:: sourceType: ', sourceType)
  console.log('sendMLRequest:: promptRequest: ', promptRequest.length, '::', promptRequest)
  const bodyRequest: IBodyLatLngPoints = {
    bbox: getExtentCurrentViewMapBBox(leafletMap),
    prompt: promptRequest,
    zoom: leafletMap.getZoom(),
    source_type: sourceType
  }
  console.log('sendMLRequest:: bodyRequest: ', bodyRequest)
  const geojsonOutputOnMounted = await getGeoJSONRequest(bodyRequest, '/api/ml-fastsam/', props.accessToken)
  const featureNew = LeafletGeoJSON(geojsonOutputOnMounted)
  console.log("featureNew::", typeof featureNew, "|", featureNew)
  leafletMap.addLayer(featureNew)
}

const updateZoomBboxMap = (localMap: LMap) => {
  currentZoomRef.value = localMap.getZoom()
  currentMapBBoxRef.value = getExtentCurrentViewMapBBox(localMap)
}

const getCurrentBasemap = (url: string, providersArray: ServiceTiles) => {
  console.log('providersArray:', providersArray)
  for (const [key, value] of Object.entries(providersArray)) {
    console.log('key, value:', providersArray)
    if (value._url == url) {
      return key
    }
  }
}

onMounted(async () => {
  const osmTile = tileLayer.provider(OpenStreetMap)
  let localVarSatellite: SourceTileType = import.meta.env.VITE_SATELLITE_NAME ? String(import.meta.env.VITE_SATELLITE_NAME) : Satellite
  console.log("Satellite:", Satellite)
  console.log("localVarSatellite:", localVarSatellite)
  const satelliteTile = tileLayer.provider(localVarSatellite)

  let baseMaps: ServiceTiles = { OpenStreetMap: osmTile }
  baseMaps[localVarSatellite] = satelliteTile
  currentBaseMapNameRef.value = OpenStreetMap

  map = LeafletMap('map', {
    center: props.center,
    zoom: Number(props.zoom),
    layers: [osmTile]
  });
  map.attributionControl.setPrefix(prefix)
  LeafletControl.scale({ position: "bottomleft", imperial: false, metric: true }).addTo(map);

  LeafletControl.layers(baseMaps).addTo(map);
  setGeomanControls(map)
  updateZoomBboxMap(map)

  map.on("zoomend", (e: LEvented) => {
    updateZoomBboxMap(map)
  });

  map.on("mouseup", (e: LEvented) => {
    currentMapBBoxRef.value = getExtentCurrentViewMapBBox(map)
  });

  updateMapData(map, getPopupContentPoint, promptsArrayRef)
  map.on('baselayerchange', (e: LEvented) => {
    currentBaseMapNameRef.value = getCurrentBasemap(e.layer._url, baseMaps)
  })
})
</script>

<style scoped>

.map-predictions {
  width: 1024px;
  height: 684px;
  position: relative;
}
</style>
