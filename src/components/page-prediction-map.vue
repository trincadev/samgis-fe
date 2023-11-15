<template>
  <div class="map-predictions-container">
    <div class="map-predictions" id="map" />
  </div>
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

import { maxZoom, minZoom } from "../components/constants";

const attribution: string = "&copy; <a target=\"_blank\" href=\"https://osm.org/copyright\">OpenStreetMap</a> contributors "
const prefix: string = " &copy; <a target=\"_blank\" href=\"https://leafletjs.com\">leaflet</a>"
const geojsonRef = ref("geojsonOutput-placeholder")
const durationRef = ref(0)
const numberOfPolygonsRef = ref(0)
const numberOfPredictedMasksRef = ref(0)
const waitingString = "waiting..."
const responseMessageRef = ref("")
let map: L.map;

const props = defineProps<{
  accessToken: string,
  center: LatLngTuple,
  mapName: string,
  zoom: string
}>()

interface BboxLatLngTuple {
  ne: LatLngTuple,
  sw: LatLngTuple
}

interface IPrompt {
  type: string,
  data: BboxLatLngTuple,
  label?: number
}

interface IBodyLatLngPoints {
  bbox: BboxLatLngTuple,
  prompt: Array<IPrompt>,
  zoom: number,
  source_type: string
}

const getGeoJSON = async (requestBody: IBodyLatLngPoints, urlApi: string) => {
  responseMessageRef.value = waitingString
  const data = await fetch(urlApi, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Authorization": `Bearer ${props.accessToken}`,
      "Content-type": "application/json"
    }
  })
  try {
    const output = await data.json()
    console.log("getGeoJSON => output:", typeof output, "|", output, "#")
    const parsed = JSON.parse(output)
    console.log("getGeoJSON => parsed:", typeof parsed, "|", parsed, "#")
    geojsonRef.value = JSON.stringify(parsed.geojson)
    console.log("getGeoJSON => geojsonRef.value:", typeof geojsonRef.value, "|", geojsonRef.value, "#")

    durationRef.value = parsed.duration_run
    numberOfPolygonsRef.value = parsed.n_shapes_geojson
    numberOfPredictedMasksRef.value = parsed.n_predictions
    return JSON.parse(parsed.geojson)
  } catch (errorOtherData) {
    const statusText = await data.statusText
    console.error("getGeoJSON => data", data, "#")
    console.error("getGeoJSON => statusText", statusText, "#")
    console.error("getGeoJSON => errorOtherData", errorOtherData, "#")
    responseMessageRef.value = `error message response: ${statusText}...` || "no response or uncaught exception!"
  }
};

const getSelectedRectangleCoordinatesBBox = (leafletEvent: L.Map): BboxLatLngTuple => {
  const { _northEast: ne, _southWest: sw } = leafletEvent.layer._bounds
  const bbox: BboxLatLngTuple = { ne, sw }
  return bbox
}
const getSelectedPointCoordinate = (leafletEvent: L.Evented): LatLngTuple => {
  return leafletEvent.layer._latlng
}

const getExtentCurrentViewMapBBox = (leafletMap: L.Map): BboxLatLngTuple => {
  const boundaries = leafletMap.getBounds()
  return { ne: boundaries.getNorthEast(), sw: boundaries.getSouthWest() }
}

const getPopupContentPoint = (leafletMap: L.Map, leafletEvent: L.Evented) => {
  responseMessageRef.value = ""
  const bbox = getExtentCurrentViewMapBBox(leafletMap)
  let popupContent: HTMLDivElement = document.createElement("div");
  console.log("getPopupContentPoint => mapBBox:", typeof bbox, "|", bbox, "#") // leafletEvent, leafletMap
  const currentZoom = leafletMap.getZoom()
  let currentPointLayer: LatLngTuple = getSelectedPointCoordinate(leafletEvent)
  console.log("currentPointLayer:", currentPointLayer, "#")

  popupContent.innerHTML = `<p>${leafletEvent.shape}:</p>`
  popupContent.innerHTML += `<p>lat:${JSON.stringify(currentPointLayer.lat)}</p>`
  popupContent.innerHTML += `<p>lng:${JSON.stringify(currentPointLayer.lng)}</p>`
  popupContent.innerHTML += `<p>zoom:${currentZoom}</p>`

  const a: HTMLAnchorElement = document.createElement("a");

  a.id = `popup-a-${leafletEvent.layer._leaflet_id}`
  a.className = "leaflet-popup-span-title"
  a.onclick = async function eventClick(event: Event) {
    event.preventDefault()
    console.log(`getPopupContentPoint => popup-click:${leafletEvent.layer._leaflet_id}.`)
    const bodyLatLngPoints: IBodyLatLngPoints = {
      bbox: bbox,
      prompt: [{
        "type": "point",
        "data": currentPointLayer,
        "label": 0
      }],
      zoom: currentZoom,
      source_type: "Satellite"
    }
    console.log("getPopupContentPoint => bodyLatLngPoints:", JSON.stringify(bodyLatLngPoints), "#")
    const geojsonOutputOnMounted = await getGeoJSON(bodyLatLngPoints, "/api/ml-fastsam/")
    console.log("getPopupContentPoint => geojsonOutputOnMounted:", geojsonOutputOnMounted, "#")
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

onMounted(async () => {
  map = L.map("map").setView(props.center, props.zoom);
  map.attributionControl.setPrefix(prefix)
  L.control.scale({ position: "topright", imperial: false, metric: true }).addTo(map);
  L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    minZoom: Number(minZoom),
    maxZoom: Number(maxZoom),
    attribution: attribution
  }).addTo(map);

  // leaflet geoman toolbar
  map.pm.addControls({
    position: 'topleft',
    drawCircleMarker: false,
    rotateMode: false,
  });

  const _actions = [
    {
      text: 'Custom message, with click event',
      onClick(actionEvent: L.Evented) {
        console.log("actionEvent:", typeof actionEvent, "|", actionEvent, "")
      },
      name: 'actionName',
    },
  ];
  map.pm.Toolbar.copyDrawControl('Marker', {
    name: 'MarkerWithPopup',
    block: 'custom',
    title: 'Marker - Display text on hover button',
    actions: _actions,
  });

  map.on('pm:create', (e: L.Evented) => {
    if (e.shape === 'MarkerWithPopup') {
      console.log("popup MarkerWithPopup")
      const div = getPopupContentPoint(map, e)
      e.layer.bindPopup(div).openPopup();
    }
  });
});
</script>

<style scoped>

.map-predictions {
  width: 1024px;
  height: 684px;
  display: block;
}

.leaflet-popup-content-inner {
  display: flex;
}
</style>
