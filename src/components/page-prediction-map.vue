<template>
  <div class="map-predictions-container">
    <div class="map-predictions" id="map" />
  </div>
  <p>geojson: {{ geojsonRef }}</p>
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
  label: number
}

interface IBodyLatLngPoints {
  bbox: BboxLatLngTuple,
  prompt: Array<IPrompt>,
  zoom: number,
  source_type: string
}

const getGeoJSON = async (accessToken: string, requestBody: IBodyLatLngPoints, urlApi: string) => {
  console.log("# getGeoJSON::accessToken:", accessToken, "2#")
  console.log("# getGeoJSON::requestBody:", requestBody, "2#")
  console.log("# getGeoJSON::urlApi:", urlApi, "2#")
  console.log("# env:", import.meta.env, "2#")

  const data = await fetch(urlApi, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Authorization": `Bearer ${props.accessToken}`,
      "Content-type": "application/json"
    }
  })
  const output = await data.json()
  console.log("getGeoJSON => output:", typeof output, "|", output, "#")
  const parsed = JSON.parse(output)
  console.log("getGeoJSON => parsed:", typeof parsed, "|", parsed, "#")
  geojsonRef.value = JSON.stringify(parsed.geojson)
  console.log("getGeoJSON => geojsonRef.value:", typeof geojsonRef.value, "|", geojsonRef.value, "#")
  return JSON.parse(parsed.geojson)
};

const getSelectedRectangleCoordinatesBBox = (leafletEvent: L.Map): BboxLatLngTuple => {
  const { _northEast: ne, _southWest: sw } = leafletEvent.layer._bounds
  const bbox: BboxLatLngTuple = { ne, sw }
  return bbox
}

const getExtentCurrentViewMapBBox = (leafletMap: L.Map): BboxLatLngTuple => {
  const boundaries = leafletMap.getBounds()
  return { ne: boundaries.getNorthEast(), sw: boundaries.getSouthWest() }
}

const getPopupContent = (leafletMap: L.Map, leafletEvent: L.Evented) => {
  const bbox = getExtentCurrentViewMapBBox(leafletMap)
  let popupContent: HTMLDivElement = document.createElement("div");
  console.log("getPopupContent => mapBBox:", typeof bbox, "|", bbox, "#") // leafletEvent, leafletMap
  const currentZoom = leafletMap.getZoom()
  // leafletEvent.shape === "RectangleWithPopup"
  let currentBboxLayer: BboxLatLngTuple = getSelectedRectangleCoordinatesBBox(leafletEvent)

  popupContent.innerHTML = `${leafletEvent.shape}:${JSON.stringify(currentBboxLayer)}... \nmap:`
  popupContent.innerHTML += `mapBBox: ${JSON.stringify(bbox)}... \n`
  popupContent.innerHTML += `zoom:${currentZoom}.`

  const a: HTMLAnchorElement = document.createElement("a");

  a.id = `popup-a-${leafletEvent.layer._leaflet_id}`
  a.className = "leaflet-popup-span-title"
  a.onclick = async function eventClick(event: Event) {
    event.preventDefault()
    console.log(`getPopupContent => popup-click:${leafletEvent.layer._leaflet_id}.`)
    const bodyLatLngPoints: IBodyLatLngPoints = {
      bbox: bbox,
      prompt: [{
        "type": "rectangle",
        "data": currentBboxLayer,
        "label": 0
      }],
      zoom: currentZoom,
      source_type: "Satellite"
    }
    console.log("getPopupContent => bodyLatLngPoints:", JSON.stringify(bodyLatLngPoints), "#")
    const geojsonOutputOnMounted = await getGeoJSON(props.accessToken, bodyLatLngPoints, "/api/ml-fastsam/")
    console.log("getPopupContent => geojsonOutputOnMounted:", geojsonOutputOnMounted, "#")
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
  map.pm.Toolbar.copyDrawControl('Rectangle', {
    name: 'RectangleWithPopup',
    block: 'custom',
    title: 'Rectangle - Display text on hover button',
    actions: _actions,
  });
  map.pm.Draw.MarkerWithPopup.setPathOptions({ color: 'green' })
  map.pm.Draw.RectangleWithPopup.setPathOptions({ color: 'green' })

  map.on('pm:create', (e: L.Evented) => {
    if (e.shape === 'RectangleWithPopup') {
      console.log("popup RectangleWithPopup")
      const div = getPopupContent(map, e)
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
