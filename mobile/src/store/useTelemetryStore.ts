import {create} from 'zustand';

/**
 * Store global para la gestión de datos de telemetría en tiempo real.
 * Provee una estructura de datos sincronizada con el servidor (Revision 12).
 */
export interface TelemetryData {
  sdk_active: boolean; // Estado de actividad del SDK en el simulador
  paused: boolean;     // Indica si el simulador está en pausa o menús
  timestamp: string;
  config: {
    game: 'ETS2' | 'ATS' | 'Unknown';
    version: string;
    units: {
      is_metric: boolean;
      distance: string;
      fuel: string;
      temperature: string;
      pressure: string;
    };
  };
  truck: {
    speed: { value: number; unit: string };
    rpm: { value: number; max: number };
    gear: { physical: number; dashboard: string };
    fuel: { 
      value: number; 
      unit: string; 
      capacity: number; 
      range: number; 
      range_unit: string;
      avg_consumption: { value: number; unit: string };
    };
    odometer: { value: number; unit: string };
    temperature: {
      water: { value: number; unit: string };
      oil: { value: number; unit: string };
    };
    pressure: {
      air: { value: number; unit: string };
      oil: { value: number; unit: string };
    };
    damage: {
      engine: number;
      transmission: number;
      cabin: number;
      chassis: number;
      wheels: number;
    };
  };
  lights: {
    parking_brake: boolean;
    motor_brake: boolean;
    blinker_left: boolean;
    blinker_right: boolean;
    beam_low: boolean;
    beam_high: boolean;
    beacon: boolean;
    brake: boolean;
    hazard: boolean;
    cruise_control: boolean;
  };
  job: {
    cargo: string;
    city_src: string;
    city_dst: string;
    truck_name: string;
    on_job: boolean;
    trailer_attached: boolean;
  };
  navigation: {
    speed_limit: number;
    route_distance: number;
    route_time: number;
  };
}

interface TelemetryState {
  data: TelemetryData | null;
  setTelemetryData: (data: TelemetryData) => void;
  resetTelemetry: () => void;
}

/**
 * useTelemetryStore - Almacén de alta frecuencia para datos del simulador.
 * Gestiona el estado reactivo de los parámetros del vehículo para su visualización en Dashboards.
 */
export const useTelemetryStore = create<TelemetryState>((set) => ({
  data: null,
  setTelemetryData: (data) => set({data}),
  resetTelemetry: () => set({data: null}),
}));
