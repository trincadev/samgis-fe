<template>
  <div class="map-predictions" :id="'map-predictions-' + props.mapName" />
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { onMounted } from "vue";
import { LatLngTuple } from "leaflet";

import { maxZoom, minZoom } from "../components/constants";

const attribution: string = "&copy; <a target=\"_blank\" href=\"https://osm.org/copyright\">OpenStreetMap</a> contributors "
const prefix: string = " &copy; <a target=\"_blank\" href=\"https://leafletjs.com\">leaflet</a>"

const props = defineProps<{
  center: LatLngTuple,
  mapName: string,
  zoom: string
}>()

const getPopupContent = (leafletMap: L.Map, leafletEvent) => {
  const boundaries = leafletMap.getBounds()
  const ne = JSON.stringify(boundaries.getNorthEast())
  const sw = JSON.stringify(boundaries.getSouthWest())
  let popupContent: HTMLDivElement = document.createElement("div");
  popupContent.innerHTML = `point:${JSON.stringify(leafletEvent.layer._latlng)}\nmap:`
  popupContent.innerHTML += `ne:${ne}\nsw:${sw}.`
  console.log("e::", leafletEvent, "#")

  const popupDiv: HTMLDivElement = document.createElement("div");
  popupDiv.className = "leaflet-popup-content-inner"
  popupDiv.appendChild(popupContent)

  return popupDiv
}

onMounted(async () => {
  const L = await import("leaflet")
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
      onClick(actionEvent) {
        console.log("actionEvent:", actionEvent, "")
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

  map.on('pm:create', (e) => {
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
