import { Evented, LatLngTuple, Map } from "leaflet";
import { responseMessageRef, waitingString, durationRef, numberOfPolygonsRef, numberOfPredictedMasksRef, geojsonRef } from "./constants";
import type { BboxLatLngTuple, IBodyLatLngPoints } from "./types";


export function setGeomanControls(localMap: Map, getPopupContentPoint: Function) {
    // leaflet geoman toolbar
    localMap.pm.addControls({
      position: 'topleft',
      drawControls: false,
      customControls: true
    });
  
    const _actions = [
      {
        text: 'Custom message, with click event',
        onClick(actionEvent: Evented) {
          console.log("actionEvent:", typeof actionEvent, "|", actionEvent, "")
        },
        name: 'actionName',
      },
    ];
    localMap.pm.Toolbar.copyDrawControl('Marker', {
      name: 'MarkerWithPopup',
      block: 'custom',
      title: 'Marker - Display text on hover button',
      actions: _actions,
    });
  
    localMap.on('pm:create', (e: Evented) => {
      if (e.shape === 'MarkerWithPopup') {
        console.log("popup MarkerWithPopup")
        const div = getPopupContentPoint(localMap, e)
        e.layer.bindPopup(div).openPopup();
      }
    });
}

export const getSelectedRectangleCoordinatesBBox = (leafletEvent: Map): BboxLatLngTuple => {
  const { _northEast: ne, _southWest: sw } = leafletEvent.layer._bounds
  const bbox: BboxLatLngTuple = { ne, sw }
  return bbox
}
export const getSelectedPointCoordinate = (leafletEvent: Evented): LatLngTuple => {
  return leafletEvent.layer._latlng
}

export const getExtentCurrentViewMapBBox = (leafletMap: Map): BboxLatLngTuple => {
  const boundaries = leafletMap.getBounds()
  return { ne: boundaries.getNorthEast(), sw: boundaries.getSouthWest() }
}

export const getGeoJSON = async (requestBody: IBodyLatLngPoints, urlApi: string, accessToken: string) => {
  responseMessageRef.value = waitingString
  const data = await fetch(urlApi, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json"
    }
  })
  try {
    if (data.status === 200) {
      const output: string = await data.json()
      const parsed = JSON.parse(output)
      geojsonRef.value = JSON.stringify(parsed.geojson)

      durationRef.value = parsed.duration_run
      numberOfPolygonsRef.value = parsed.n_shapes_geojson
      numberOfPredictedMasksRef.value = parsed.n_predictions
      responseMessageRef.value = ""
      return JSON.parse(parsed.geojson)
    } else {
      const outputText = await data.text()
      console.error("getGeoJSON => status not 200, outputText", outputText, "#")
      responseMessageRef.value = `error message response: ${outputText}...`
    }
  } catch (errorOtherData) {
    const statusText = data.statusText || "no response or uncaught exception!"
    console.error("getGeoJSON => data", data, "statusText", statusText, "errorOtherData", errorOtherData, "#")
    responseMessageRef.value = `error status response: ${statusText}...`
  }
};