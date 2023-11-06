interface ILatLng {
  lat: number
  lng: number
}

interface IPrompt {
  type: string
  data: ILatLng
  label: number
}

interface IBodyLatLngPoints {
  ne: ILatLng
  sw: ILatLng
  prompt: Array<IPrompt>
  zoom: number
  source_type: string
}

export function setGeomanControls(localMap: L.Map, accessToken: string) {}
