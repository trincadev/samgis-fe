import { LatLngTuple } from "leaflet";

export interface BboxLatLngTuple {
    ne: LatLngTuple,
    sw: LatLngTuple
}
  
export interface IPrompt {
    type: string,
    data: BboxLatLngTuple,
    label?: number
}
  
export interface IBodyLatLngPoints {
    bbox: BboxLatLngTuple,
    prompt: Array<IPrompt>,
    zoom: number,
    source_type: string
}