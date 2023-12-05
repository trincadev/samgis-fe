<template>
  <div class="map-predictions-container">
    <div class="map-predictions" id="map" />
    <button @click="sendMLRequest(map, promptsArrayRef)">send ML request</button>
    <p>current zoom: {{ currentZoomRef }}</p>
    <p>current map bbox: {{ currentMapBBoxRef }}</p>
    <p>prompts array: {{ promptsArrayRef }}</p>
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

import { maxZoom, minZoom, geojsonRef, responseMessageRef, durationRef, numberOfPolygonsRef, numberOfPredictedMasksRef, attribution, prefix } from "./constants";
import { getSelectedPointCoordinate, getExtentCurrentViewMapBBox, setGeomanControls, getGeoJSON, updateMapData } from "./helpers";
import type { IBodyLatLngPoints, IPointPrompt, IRectanglePrompt } from "./types";


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
  responseMessageRef.value = ""
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

const sendMLRequest = async (leafletMap: L.Map, promptRequest: Array<IPointPrompt|IRectanglePrompt>) => {
  console.log("sendMLRequest:: promptRequest: ", promptRequest)
  const bodyRequest: IBodyLatLngPoints = {
    bbox: getExtentCurrentViewMapBBox(leafletMap),
    prompt: promptRequest,
    zoom: leafletMap.getZoom(),
    source_type: "Satellite"
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
  const osm = L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    minZoom: Number(minZoom),
    maxZoom: Number(maxZoom),
    attribution: attribution
  });
  const osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    minZoom: Number(minZoom),
    maxZoom: Number(maxZoom),
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
  });
  const baseMaps = {
    "OpenStreetMap": osm,
    "<span style='color: red'>OpenStreetMap.HOT</span>": osmHOT
  };

  map = L.map('map', {
    center: props.center,
    zoom: props.zoom,
    layers: [osm]
  });
  map.attributionControl.setPrefix(prefix)
  L.control.scale({ position: "bottomleft", imperial: false, metric: true }).addTo(map);

  L.control.layers(baseMaps).addTo(map);
  setGeomanControls(map, getPopupContentPoint)
  updateZoomBboxMap(map)

  map.on("zoomend", function (e: Event) {
    updateZoomBboxMap(map)
  });

  map.on("mousedown", function (e: Event) {
    currentMapBBoxRef.value = getExtentCurrentViewMapBBox(map)
  });

  updateMapData(map, getPopupContentPoint, promptsArrayRef)
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
</style>
