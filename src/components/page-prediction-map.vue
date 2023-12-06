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
import L, { LatLngTuple } from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { onMounted, ref, type Ref } from "vue";

import { maxZoom, minZoom, geojsonRef, responseMessageRef, durationRef, numberOfPolygonsRef, numberOfPredictedMasksRef, prefix, mapTilesUrl } from "./constants";
import { getSelectedPointCoordinate, getExtentCurrentViewMapBBox, setGeomanControls, getGeoJSON, updateMapData, getTileService, getCurrentBasemap } from "./helpers";
import type { IBodyLatLngPoints, IMapTile, IPointPrompt, IRectanglePrompt, SourceTileType } from "./types";

const currentBaseMapNameRef = ref()
const currentMapBBoxRef = ref()
const currentZoomRef = ref()
const promptsArrayRef: Ref<Array<IPointPrompt|IRectanglePrompt>> = ref([])
let map: L.map;

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

const sendMLRequest = async (leafletMap: L.Map, promptRequest: Array<IPointPrompt|IRectanglePrompt>, sourceType: SourceTileType = "OpenStreetMap") => {
  let localMapTile: IMapTile = mapTilesUrl[sourceType]
  let url = localMapTile.url
  console.log("sendMLRequest:: url: ", url)
  console.log("sendMLRequest:: sourceType: ", sourceType)
  console.log("sendMLRequest:: promptRequest: ", promptRequest.length, "::", promptRequest)
  const bodyRequest: IBodyLatLngPoints = {
    bbox: getExtentCurrentViewMapBBox(leafletMap),
    prompt: promptRequest,
    zoom: leafletMap.getZoom(),
    source_type: url
  }
  console.log("sendMLRequest:: bodyRequest: ", bodyRequest)
  const geojsonOutputOnMounted = await getGeoJSON(bodyRequest, "/api/ml-fastsam/", props.accessToken)
  const featureNew = L.geoJSON(geojsonOutputOnMounted);
  leafletMap.addLayer(featureNew);
}

const updateZoomBboxMap = (localMap: L.map) => {
    currentZoomRef.value = localMap.getZoom()
    currentMapBBoxRef.value = getExtentCurrentViewMapBBox(localMap)
}

onMounted(async () => {
  const osm = getTileService("OpenStreetMap", minZoom, maxZoom)
  const Satellite = getTileService("Satellite", minZoom, maxZoom)
  const baseMaps = {
    "OpenStreetMap": osm,
    "Esri WorldImagery": Satellite
  };
  currentBaseMapNameRef.value = "OpenStreetMap"

  map = L.map('map', {
    center: props.center,
    zoom: props.zoom,
    layers: [osm]
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
    currentBaseMapNameRef.value = getCurrentBasemap(e.layer._url)
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
