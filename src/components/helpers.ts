import { icon, Evented as LEvented, LatLngTuple, Map as LMap } from 'leaflet'
import {
  responseMessageRef,
  waitingString,
  durationRef,
  numberOfPolygonsRef,
  numberOfPredictedMasksRef,
  geojsonRef
} from './constants.ts'
import {
  ExcludeIncludeLabelPrompt as excludeIncludeLabelPrompt,
  type ArrayNumber,
  type BboxLatLngTuple,
  type ExcludeIncludeLabelPrompt,
  type IBodyLatLngPoints,
  type IPointPrompt,
  type IRectanglePrompt
} from './types.d.ts'
import type { Ref } from 'vue'

/** get a custom icon given a PNG path with its anchor/size values  */
const getCustomIconMarker = (
  iconUrlNoExt: string,
  shadowUrl = '/public/marker-shadow.png',
  iconSize: ArrayNumber = [25, 41],
  iconAnchor: ArrayNumber = [12, 41],
  popupAnchor: ArrayNumber = [1, -34],
  tooltipAnchor: ArrayNumber = [5, -25],
  shadowSize: ArrayNumber = [41, 41]
): icon => {
  return icon({
    iconUrl: `${iconUrlNoExt}.png`,
    iconRetinaUrl: `${iconUrlNoExt}-2x.png`,
    shadowUrl,
    iconSize,
    iconAnchor,
    popupAnchor,
    shadowSize,
    tooltipAnchor
  })
}

/** get an  the leaflet editor geoman.io toolbar with the custom actions to draw/edit/move point and rectangle layers */
const getCustomGeomanActionsObject = (actionName: string, descriptionAction: string, arrayActions: Array<object>) => {
  return {
    name: actionName,
    block: 'custom',
    title: descriptionAction,
    actions: arrayActions
  }
}

/** prepare the leaflet editor geoman.io toolbar with the custom actions to draw/edit/move point and rectangle layers */
export function setGeomanControls(localMap: LMap) {
  // leaflet geoman toolbar
  localMap.pm.addControls({
    position: 'topleft',
    drawControls: false,
    rotateMode: false,
    cutPolygon: false,
    customControls: true
  })

  const actionArray = [{
      onClick(actionEvent: LEvented) {
        console.log('actionEvent:', typeof actionEvent, '|', actionEvent, '')
      },
      name: 'actionName'
  }]
  const includeMarkerControl = localMap.pm.Toolbar.copyDrawControl('Marker',
    getCustomGeomanActionsObject('IncludeMarkerPrompt', 'Marker that add recognition regions from SAM prompt requests', actionArray)
  )
  includeMarkerControl.drawInstance.setOptions({
    markerStyle: { icon: getCustomIconMarker('/public/marker-icon-include') }
  })
  const excludeMarkerControl = localMap.pm.Toolbar.copyDrawControl('Marker',
    getCustomGeomanActionsObject('ExcludeMarkerPrompt', 'Marker that remove recognition regions from SAM prompt requests', actionArray)
  )
  excludeMarkerControl.drawInstance.setOptions({
    markerStyle: { icon: getCustomIconMarker('/public/marker-icon-exclude') }
  })
  localMap.pm.Toolbar.copyDrawControl('Rectangle', {
    name: 'RectanglePrompt',
    block: 'custom',
    title: 'Rectangular recognition regions for SAM prompt requests',
    actions: actionArray
  })
  localMap.pm.setPathOptions({
    color: "green",
    fillColor: "green",
    fillOpacity: 0.15,
  })
}

/** get the selected rectangle layer bounding box coordinate */
export const getSelectedRectangleCoordinatesBBox = (leafletEvent: LEvented): BboxLatLngTuple => {
  const { _northEast: ne, _southWest: sw } = leafletEvent.layer._bounds
  return { ne, sw }
}

/** get the current selected point coordinate */
export const getSelectedPointCoordinate = (leafletEvent: LEvented): LatLngTuple => {
  return leafletEvent.layer._latlng
}

/** get the current map bounding box coordinates */
export const getExtentCurrentViewMapBBox = (leafletMap: LMap): BboxLatLngTuple => {
  const boundaries = leafletMap.getBounds()
  return { ne: boundaries.getNorthEast(), sw: boundaries.getSouthWest() }
}

/** send the ML request to the backend API through the cloudflare proxy function */
export const getGeoJSONRequest = async (
  requestBody: IBodyLatLngPoints,
  urlApi: string,
  accessToken: string
) => {
  responseMessageRef.value = waitingString
  const data = await fetch(urlApi, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/json'
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
      responseMessageRef.value = ''
      return JSON.parse(parsed.geojson)
    } else {
      const outputText = await data.text()
      console.error('getGeoJSONRequest => status not 200, outputText', outputText, '#')
      responseMessageRef.value = `error message response: ${outputText}...`
    }
  } catch (errorOtherData) {
    const statusText = data.statusText || 'no response or uncaught exception!'
    console.error(
      'getGeoJSONRequest => data',
      data,
      'statusText',
      statusText,
      'errorOtherData',
      errorOtherData,
      '#'
    )
    responseMessageRef.value = `error status response: ${statusText}...`
  }
}

/** populate a single point ML request prompt, by type (exclude or include), see type ExcludeIncludeLabelPrompt */
export const getPointPromptElement = (e: LEvented, elementType: ExcludeIncludeLabelPrompt): IPointPrompt|IRectanglePrompt => {
  const currentPointLayer: LatLngTuple = getSelectedPointCoordinate(e)
  return {
    id: e.layer._leaflet_id,
    type: 'point',
    data: currentPointLayer,
    label: elementType
  }
}

/** populate a single rectangle ML request prompt */
export const getRectanglePromptElement = (e: LEvented) => {
  return {
    id: e.layer._leaflet_id,
    type: 'rectangle',
    data: getSelectedRectangleCoordinatesBBox(e)
  }
}

/** handle different event/layer types (rectangle, point: IncludeMarkerPrompt, ExcludeMarkerPrompt) */
const updateLayerOnCreateOrEditEvent = (
  event: LEvented,
  getPopupContentPointFn: (arg0: LEvented, arg1: number) => HTMLDivElement,
  promptsArrayRef: Ref) => {
  responseMessageRef.value = ''
  if (event.shape === 'IncludeMarkerPrompt' || event.shape === 'ExcludeMarkerPrompt') {
    const labelPoint = Number(excludeIncludeLabelPrompt[event.shape])
    const div = getPopupContentPointFn(event, labelPoint)
    event.layer.bindPopup(div).openPopup()
    promptsArrayRef.value.push(getPointPromptElement(event, labelPoint))
  }
  if (event.shape === 'RectanglePrompt') {
    event.layer.bindPopup(`id:${event.layer._leaflet_id}.`).openPopup()
    promptsArrayRef.value.push(getRectanglePromptElement(event))
  }
}

/** listen on the leaflet editor geoman.io events and update its layer properties within the promptsArrayRef vue ref */
export const updateMapData = (
  localMap: LMap,
  getPopupContentPointFn: (arg0: LEvented, arg1: number) => HTMLDivElement,
  promptsArrayRef: Ref
) => {
  localMap.on('pm:create', (e: LEvented) => {
    console.log(`evented ${e.type} - pm:create ${e.shape} | `, e)
    updateLayerOnCreateOrEditEvent(e, getPopupContentPointFn, promptsArrayRef)

    // listen to changes on the new layer and update its object within promptsArrayRef
    e.layer.on('pm:edit', function(newEvent: LEvented) {
      promptsArrayRef.value = removeEventFromArrayByIndex(promptsArrayRef.value, newEvent)
      updateLayerOnCreateOrEditEvent(e, getPopupContentPointFn, promptsArrayRef)
    });
  })
  localMap.on('pm:remove', (e: LEvented) => {
    responseMessageRef.value = ''
    promptsArrayRef.value = removeEventFromArrayByIndex(promptsArrayRef.value, e)
  })
}

/** remove the selected layer from the ML request array prompt */
const removeEventFromArrayByIndex = (arr: Array<LEvented>, e: LEvented) => {
  return arr.filter((el: LEvented) => {
    return el.id != e.layer._leaflet_id
  })
}