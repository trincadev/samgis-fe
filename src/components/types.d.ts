import { LatLngTuple } from "leaflet";

export interface BboxLatLngTuple {
    ne: LatLngTuple,
    sw: LatLngTuple
}

enum ExcludeIncludeLabelPrompt {
    EXCLUDE = 0,
    INCLUDE = 1
}
type PointPromptType = "point"
type RectanglePromptType = "rectangle"

export interface IPointPrompt {
    type: PointPromptType,
    data: BboxLatLngTuple,
    label: ExcludeIncludeLabelPrompt
}

export interface IRectanglePrompt {
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