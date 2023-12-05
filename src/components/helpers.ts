import { Evented, LatLngTuple, Map } from "leaflet";
import { responseMessageRef, waitingString, durationRef, numberOfPolygonsRef, numberOfPredictedMasksRef, geojsonRef } from "./constants";
import type { BboxLatLngTuple, ExcludeIncludeLabelPrompt, IBodyLatLngPoints } from "./types";
import type { Ref } from "vue";


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
      name: 'IncludeMarkerPrompt',
      block: 'custom',
      title: 'Marker that add recognition regions from SAM prompt requests',
      actions: _actions,
    });
    localMap.pm.Toolbar.copyDrawControl('Marker', {
      name: 'ExcludeMarkerPrompt',
      block: 'custom',
      title: 'Marker that remove recognition regions from SAM prompt requests',
      actions: _actions,
    });
    localMap.pm.Toolbar.copyDrawControl('Rectangle', {
      name: 'RectanglePrompt',
      block: 'custom',
      title: 'Rectangular recognition regions for SAM prompt requests',
      actions: _actions,
    });
}

export const getSelectedRectangleCoordinatesBBox = (leafletEvent: Map): BboxLatLngTuple => {
  const { _northEast: ne, _southWest: sw } = leafletEvent.layer._bounds
  return { ne, sw }
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

export const getPointPromptElement = (e: Evented, elementType: ExcludeIncludeLabelPrompt) => {
  let currentPointLayer: LatLngTuple = getSelectedPointCoordinate(e)
  return {
    id: e.layer._leaflet_id,
    type: "point",
    data: currentPointLayer,
    label: elementType
  }
}

export const getRectanglePromptElement = (e: Evented) => {
  return {
    id: e.layer._leaflet_id,
    type: "rectangle",
    data: getSelectedRectangleCoordinatesBBox(e)
  }
}

export const updateMapData = (localMap: Map, getPopupContentPointFn: Function, promptsArrayRef: Ref) => {

  localMap.on('pm:create', (e: Evented) => {
    if (e.shape === 'IncludeMarkerPrompt') {
      console.log("pm:create, IncludeMarkerPrompt: ", e)
      const div = getPopupContentPointFn(e, 1)
      e.layer.bindPopup(div).openPopup();
      promptsArrayRef.value.push(getPointPromptElement(e, 1))
    }
    if (e.shape === 'ExcludeMarkerPrompt') {
      console.log("pm:create, ExcludeMarkerPrompt: ", e)
      const div = getPopupContentPointFn(e, 0)
      e.layer.bindPopup(div).openPopup();
      promptsArrayRef.value.push(getPointPromptElement(e, 0))
    }
    if (e.shape === 'RectanglePrompt') {
      console.log("pm:create RectanglePrompt: ", e)
      e.layer.bindPopup(`id:${e.layer._leaflet_id}.`).openPopup()
      promptsArrayRef.value.push({
        id: e.layer._leaflet_id,
        type: "rectangle",
        data: getSelectedRectangleCoordinatesBBox(e)
      })
    }
  });
  localMap.on('pm:remove', (e: Evented) => {
    if (e.type == "pm:remove" ) {
      promptsArrayRef.value = promptsArrayRef.value.filter((el: Evented) => {
        return el.id != e.layer._leaflet_id
      })
      console.log("pm:removed e:", e)
    }
  })
}