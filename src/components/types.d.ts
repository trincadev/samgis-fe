import { Evented, LatLngTuple } from "leaflet";

export interface BboxLatLngTuple {
    ne: LatLngTuple,
    sw: LatLngTuple
}

export enum ExcludeIncludeLabelPrompt {
    ExcludeMarkerPrompt = 0,
    IncludeMarkerPrompt = 1
}
type PointPromptType = "point"
type RectanglePromptType = "rectangle"

export interface IPointPrompt {
    id: Evented.layer._url,
    type: PointPromptType,
    data: BboxLatLngTuple,
    label: ExcludeIncludeLabelPrompt
}

export interface IRectanglePrompt {
    id: Evented.layer._url,
    type: RectanglePromptType,
    data: {
        ne: BboxLatLngTuple,
        sw: BboxLatLngTuple
    }
}
  
export interface IBodyLatLngPoints {
    bbox: BboxLatLngTuple,
    prompt: Array<IPointPrompt|IRectanglePrompt>,
    zoom: number,
    source_type: string
}

export type OpenStreetMap = "OpenStreetMap"
export type Satellite = "Satellite"
export type SourceTileType = OpenStreetMap | Satellite
export type ArrayNumber = Array<number>