<template>
  <div class="map-predictions-container">
    <div class="map-predictions" id="map" />
    <p>current zoom: {{ currentZoomRef }}</p>
    <p>current map bbox: {{ currentMapBBoxRef }}</p>
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
import { onMounted, ref } from "vue";

import { maxZoom, minZoom, geojsonRef, responseMessageRef, durationRef, numberOfPolygonsRef, numberOfPredictedMasksRef, attribution, prefix } from "./constants";
import { getSelectedPointCoordinate, getExtentCurrentViewMapBBox, setGeomanControls, getGeoJSON } from "./helpers";
import type { IBodyLatLngPoints } from "./types";

const currentMapBBoxRef = ref()
const currentZoomRef = ref()
let map: L.map;

const props = defineProps<{
  accessToken: string,
  center: LatLngTuple,
  mapName: string,
  zoom: string
}>()

const getPopupContentPoint = (leafletMap: L.Map, leafletEvent: L.Evented) => {
  responseMessageRef.value = ""
  const bbox = getExtentCurrentViewMapBBox(leafletMap)
  let popupContent: HTMLDivElement = document.createElement("div");
  const currentZoom = leafletMap.getZoom()
  let currentPointLayer: LatLngTuple = getSelectedPointCoordinate(leafletEvent)

  popupContent.innerHTML = `<p>${leafletEvent.shape}:</p>`
  popupContent.innerHTML += `<p>lat:${JSON.stringify(currentPointLayer.lat)}</p>`
  popupContent.innerHTML += `<p>lng:${JSON.stringify(currentPointLayer.lng)}</p>`
  popupContent.innerHTML += `<p>zoom:${currentZoom}</p>`

  const a: HTMLAnchorElement = document.createElement("a");

  a.id = `popup-a-${leafletEvent.layer._leaflet_id}`
  a.className = "leaflet-popup-span-title"
  a.onclick = async function eventClick(event: Event) {
    event.preventDefault()
    console.log(`getPopupContentPoint => popup-click:${leafletEvent.layer._leaflet_id},currentPointLayer:${currentPointLayer}.`)
    const bodyLatLngPoints: IBodyLatLngPoints = {
      bbox: bbox,
      prompt: [{
        "type": "point",
        "data": currentPointLayer,
        "label": 1
      }],
      zoom: currentZoom,
      source_type: "Satellite"
    }
    const geojsonOutputOnMounted = await getGeoJSON(bodyLatLngPoints, "/api/ml-fastsam/", props.accessToken)
    const featureNew = L.geoJSON(geojsonOutputOnMounted);
    leafletMap.addLayer(featureNew);
  }
  a.innerHTML = "fire prediction"

  const popupDiv: HTMLDivElement = document.createElement("div");
  popupDiv.className = "leaflet-popup-content-inner"
  popupDiv.appendChild(popupContent)
  popupDiv.appendChild(a)

  return popupDiv
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
