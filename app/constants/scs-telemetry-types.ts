export interface SCSTelemetry {
  speed: number; // truckf.speed
  rpm: number; // truckf.engineRpm
  gear: number; // trucki.gear
  fuel: number; // truckf.fuel
  lat: number; // truckdp.coordinateY
  lng: number; // truckdp.coordinateX
  heading: number; // truckdp.rotationZ
  cargo: string; // configs.cargo
}
