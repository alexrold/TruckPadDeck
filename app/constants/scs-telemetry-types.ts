/**
 * Estructura de telemetría enviada por el servidor TruckPadDeck.
 * Basada en el plugin de RenCloud (SCS SDK).
 */
export interface SCSTelemetry {
  sdk_active: boolean;
  paused: boolean;
  timestamp: string;
  
  /** Datos del camión e instrumentación */
  truck: {
    speed: number;        // km/h
    rpm: number;
    gear: number;
    fuel: number;         // litros
    throttle: number;     // % (0-100)
    brake: number;        // % (0-100)
    odometer: number;     // km
    cruise_control_speed: number;
  };

  /** Estado de luces y otros indicadores */
  lights: {
    parking_brake: boolean;
    blinker_left: boolean;
    blinker_right: boolean;
    beam_low: boolean;
    beam_high: boolean;
    beacon: boolean;
    hazard: boolean;
  };

  /** Información del trabajo actual */
  job: {
    cargo: string;
    city_dst: string;
    city_src: string;
    truck_name: string;
  };

  /** Coordenadas y orientación */
  navigation: {
    lat: number;
    lng: number;
    heading: number;
  };

  /** Estados adicionales del simulador */
  status: {
    cruise_control: boolean;
    motor_brake: boolean;
  };
}
