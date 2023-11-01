<template>
  <div class="map-predictions" :id="'map-predictions-' + props.mapName" />
  <p>geojson: {{ geojsonOutput }}</p>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { onMounted, ref } from "vue";
import { LatLngTuple } from "leaflet";

import { maxZoom, minZoom } from "../components/constants";

const attribution: string = "&copy; <a target=\"_blank\" href=\"https://osm.org/copyright\">OpenStreetMap</a> contributors "
const prefix: string = " &copy; <a target=\"_blank\" href=\"https://leafletjs.com\">leaflet</a>"
const geojsonOutput = ref("geojsonOutput-placeholder")

const props = defineProps<{
  accessToken: string,
  center: LatLngTuple,
  mapName: string,
  zoom: string
}>()

interface IBodyLatLngPoints {
  bbox: Array<number>,
  points: Array<Array<number>>
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
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json"
    }
  })
  console.log("data:", data, "#")
  let output;
  if (data.statusCode === 200) {
    output = await data.json()
  } else {
    output = await data.text()
  }
  console.log("output:", output, "#")
  geojsonOutput.value = JSON.stringify(output, null, 2);
  return geojsonOutput.value
};

const getPopupContent = (leafletMap: L.Map, leafletEvent: L.Evented) => {
  const boundaries = leafletMap.getBounds()
  const ne = JSON.stringify(boundaries.getNorthEast())
  const sw = JSON.stringify(boundaries.getSouthWest())
  let popupContent: HTMLDivElement = document.createElement("div");
  console.log("leafletEvent:", typeof leafletEvent, "#")
  popupContent.innerHTML = `point:${JSON.stringify(leafletEvent.layer._latlng)}\nmap:`
  popupContent.innerHTML += `ne:${ne}\nsw:${sw}.`

  console.log("e::", leafletEvent, "#")
  const a: HTMLAnchorElement = document.createElement("a");

  a.id = `popup-a-${leafletEvent.layer._leaflet_id}`
  a.className = "leaflet-popup-span-title"
  a.onclick = async function eventClick(event) {
    event.preventDefault()
    console.log(`popup-click:${leafletEvent.layer._leaflet_id}.`)
    const bodyLatLngPoints = {
      bbox: [
        boundaries.getNorthEast().lat, boundaries.getNorthEast().lng,
        boundaries.getSouthWest().lat, boundaries.getSouthWest().lng,
      ],
      points: [[
        leafletEvent.layer._latlng.lat,
        leafletEvent.layer._latlng.lng,
      ]],
      test: true
    }
    console.log("bodyLatLngPoints:", bodyLatLngPoints, "#")
    const geojsonOutput = await getGeoJSON(props.accessToken, bodyLatLngPoints, "/api/ml-samgeo/")
    console.log("geojsonOutput:", geojsonOutput, "#")
  }
  a.innerHTML = "fire prediction"

  const popupDiv: HTMLDivElement = document.createElement("div");
  popupDiv.className = "leaflet-popup-content-inner"
  popupDiv.appendChild(popupContent)
  popupDiv.appendChild(a)

  return popupDiv
}

onMounted(async () => {
  const L = await import("leaflet")
  console.log("L::", typeof L, "#")
  await import("@geoman-io/leaflet-geoman-free")
  const map: L.Map = L.map(`map-predictions-${props.mapName}`)

  map.setView([...props.center], Number(props.zoom))
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
    title: 'Display text on hover button',
    actions: _actions,
  });
  map.pm.Draw.MarkerWithPopup.setPathOptions({ color: 'green' })

  map.on('pm:create', (e: L.Evented) => {
    if (e.shape === 'MarkerWithPopup') {
      const div = getPopupContent(map, e)
      e.layer.bindPopup(div).openPopup();
    }
  });

  return { map }
})
</script>

<style scoped>
.map-predictions {
  width: 100%;
  height: 60vh;
}

.leaflet-popup-content-inner {
  display: flex;
}
</style>
