<template>
  <div class="map-predictions-container">
    <div class="map-predictions" id="map" />
    <button
      @click="sendMLRequest(map, promptsArrayRef, currentBaseMapNameRef)"
      :disabled="promptsArrayRef.length == 0"
      >
      <div v-if="promptsArrayRef.length == 0">empty prompt...</div>
      <div v-else-if="responseMessageRef" class="hidden-message">{{ responseMessageRef }}</div>
      <div v-else>send ML request</div>
    </button>
    <p>current zoom: {{ currentZoomRef }}</p>
    <p>current map bbox: {{ currentMapBBoxRef }}</p>
    <p>prompts array: {{ promptsArrayRef.length }} elements, {{ promptsArrayRef }}</p>
    <p>current base map name/type: {{ currentBaseMapNameRef }}</p>
  </div>
  <br />
  <div v-if="responseMessageRef">
    <p>{{ responseMessageRef }}</p>
  </div>
  <div v-else>
    <p>duration request: {{ durationRef }}</p>
    <p>number Of Polygons: {{ numberOfPolygonsRef }}</p>
    <p>number Of predicted masks: {{ numberOfPredictedMasksRef }}</p>
    <p>geojson: {{ geojsonRef }}</p>
  </div>
</template>

<script setup lang="ts">
import L, { LatLngTuple, tileLayer } from "leaflet";
import 'leaflet-providers';
import "@geoman-io/leaflet-geoman-free";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { onMounted, ref, type Ref } from "vue";

import { geojsonRef, responseMessageRef, durationRef, numberOfPolygonsRef, numberOfPredictedMasksRef, prefix, OpenStreetMap, Satellite } from "./constants";
import { getSelectedPointCoordinate, getExtentCurrentViewMapBBox, setGeomanControls, getGeoJSON, updateMapData } from "./helpers";
import type { IBodyLatLngPoints, IPointPrompt, IRectanglePrompt, SourceTileType } from "./types";

const currentBaseMapNameRef = ref()
const currentMapBBoxRef = ref()
const currentZoomRef = ref()
const promptsArrayRef: Ref<Array<IPointPrompt|IRectanglePrompt>> = ref([])
let map: L.map;
type ServiceTiles = {
    [key: SourceTileType]: L.TileLayer;
};

const props = defineProps<{
  accessToken: string,
  center: LatLngTuple,
  mapName: string,
  zoom: string
}>()

const getPopupContentPoint = (leafletEvent: L.Evented, label: number) => {
  let popupContent: HTMLDivElement = document.createElement("div");
  let currentPointLayer: LatLngTuple = getSelectedPointCoordinate(leafletEvent)

  popupContent.innerHTML = `<span>lat:${JSON.stringify(currentPointLayer.lat)}<br/>`
  popupContent.innerHTML += `lng:${JSON.stringify(currentPointLayer.lng)}<br/>`
  popupContent.innerHTML += `label:${label}, id:${leafletEvent.layer._leaflet_id}</span>`

  const popupDiv: HTMLDivElement = document.createElement("div");
  popupDiv.className = "leaflet-popup-content-inner"
  popupDiv.appendChild(popupContent)

  return popupDiv
}

const sendMLRequest = async (leafletMap: L.Map, promptRequest: Array<IPointPrompt|IRectanglePrompt>, sourceType: SourceTileType = OpenStreetMap) => {
  console.log("sendMLRequest:: sourceType: ", sourceType)
  console.log("sendMLRequest:: promptRequest: ", promptRequest.length, "::", promptRequest)
  const bodyRequest: IBodyLatLngPoints = {
    bbox: getExtentCurrentViewMapBBox(leafletMap),
    prompt: promptRequest,
    zoom: leafletMap.getZoom(),
    source_type: sourceType
  }
  console.log("sendMLRequest:: bodyRequest: ", bodyRequest)
  const geojsonOutputOnMounted = await getGeoJSON(bodyRequest, "/api/ml-fastsam/", props.accessToken)
  const featureNew = L.geoJSON(geojsonOutputOnMounted);
  leafletMap.addLayer(featureNew);
}

const updateZoomBboxMap = (localMap: L.Map) => {
    currentZoomRef.value = localMap.getZoom()
    currentMapBBoxRef.value = getExtentCurrentViewMapBBox(localMap)
}

const getCurrentBasemap = (url: string, providersArray: ServiceTiles) => {
  console.log("providersArray:", providersArray)
  for (const [key, value] of Object.entries(providersArray)) {
    console.log("key, value:", providersArray)
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

  let baseMaps: ServiceTiles = {OpenStreetMap: osmTile};
  baseMaps[localVarSatellite] = satelliteTile
  currentBaseMapNameRef.value = OpenStreetMap

  map = L.map('map', {
    center: props.center,
    zoom: props.zoom,
    layers: [osmTile]
  });
  map.attributionControl.setPrefix(prefix)
  L.control.scale({ position: "bottomleft", imperial: false, metric: true }).addTo(map);

  L.control.layers(baseMaps).addTo(map);
  setGeomanControls(map)
  updateZoomBboxMap(map)

  map.on("zoomend", function (e: Event) {
    updateZoomBboxMap(map)
  });

  map.on("mousedown", function (e: Event) {
    currentMapBBoxRef.value = getExtentCurrentViewMapBBox(map)
  });

  updateMapData(map, getPopupContentPoint, promptsArrayRef)
  map.on('baselayerchange', function (e: L.Evented) {
    currentBaseMapNameRef.value = getCurrentBasemap(e.layer._url, baseMaps)
  });
});
</script>

<style scoped>

.map-predictions {
  width: 1024px;
  height: 684px;
  display: block;
  position: relative;
  z-index: 1;
}

.leaflet-popup-content-inner {
  display: flex;
}

.hidden-message {
  width: 200px;
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
