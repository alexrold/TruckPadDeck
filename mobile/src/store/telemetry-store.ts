import { create } from 'zustand';

/**
 * REPRESENTACIÓN COMPLETA DE LA TELEMETRÍA (SCS SDK v12)
 * Este objeto es un espejo 1:1 del JSON enviado por el servidor Python.
 */
export interface TelemetryData {
  /** ¿El plugin del SDK está enviando datos activamente? */
  sdk_active: boolean;
  /** ¿El juego está en el menú principal o pausado? */
  paused: boolean;
  /** Momento exacto de la captura en formato ISO */
  timestamp: string;

  /** Configuración global y preferencias de unidades */
  config: {
    game: 'ETS2' | 'ATS' | 'Unknown';
    version: string;
    units: {
      /** True si el sistema es Métrico (Km/h, C, Bar), False si es Imperial (Mph, F, Psi) */
      is_metric: boolean;
      /** 'C' o 'F' */
      temperature: string;
      /** 'bar' o 'psi' */
      pressure: string;
    };
  };

  /** Datos internos del motor de juego */
  game: {
    /** Tiempo absoluto en el juego (minutos transcurridos) */
    time: number;
    /** Versión del protocolo del plugin (Debe ser 12) */
    plugin_version: number;
  };

  /** Estado dinámico del camión */
  truck: {
    /** Velocidad actual (Convertida a Km/h en el servidor) */
    speed: number;
    /** Revoluciones por minuto actuales */
    rpm: number;
    /** Límite de revoluciones antes de zona roja */
    rpm_max: number;
    /** Marcha física engranada (-1: R, 0: N, 1+: Marchas) */
    gear: number;
    /** Representación visual de la marcha (ej: '4L', '4H') */
    gear_dashboard: number;
    /** Gestión de combustible */
    fuel: {
      amount: number; // Litros actuales
      capacity: number; // Capacidad máxima del tanque
      range: number; // Autonomía estimada en Km
      avg_consumption: number; // Consumo promedio (L/Km)
    };
    /** Nivel de AdBlue en litros */
    adblue: number;
    /** Inputs del jugador (0 a 100) */
    inputs: {
      throttle: number; // Acelerador
      brake: number; // Freno
      clutch: number; // Embrague
      steer: number; // Volante (-100 a 100)
    };
    /** Presiones y temperaturas de fluidos */
    fluids: {
      air_pressure: number;
      oil_pressure: number;
      oil_temperature: number;
      water_temperature: number;
      battery_voltage: number;
    };
    /** Porcentaje de desgaste/daño (0 a 100) */
    damage: {
      engine: number;
      transmission: number;
      cabin: number;
      chassis: number;
      wheels: number;
    };
    /** Kilometraje total acumulado del camión */
    odometer: number;
  };

  /** Datos de ruta y GPS */
  navigation: {
    /** Límite de velocidad en la vía actual (Km/h) */
    speed_limit: number;
    /** Metros restantes hasta el destino */
    route_distance: number;
    /** Minutos restantes hasta el destino */
    route_time: number;
    /** Coordenadas mundiales */
    location: {
      x: number;
      y: number;
      z: number;
    };
    /** Orientación del camión (Heading) */
    heading: number;
  };

  /** Estado de luces, frenos y ayudas a la conducción */
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

  /** Información del trabajo actual y vehículo */
  job: {
    cargo: string;
    city_src: string;
    city_dst: string;
    truck_name: string;
    on_job: boolean;
    trailer_attached: boolean;
  };

  /** Flags de eventos instantáneos (True durante el frame del evento) */
  events: {
    fined: boolean; // Multa
    tollgate: boolean; // Paso por peaje
    ferry: boolean; // Viaje en ferry
    train: boolean; // Viaje en tren
    refuel: boolean; // Repostaje en curso
  };

  /** Estado de la sesión reportado por el puente */
  status: 'connected' | 'waiting_for_game' | 'disconnected';
}

/** Estados posibles del gestor de conexión en la App */
export type ConnectionStatus =
  | 'idle' // Inicial, sin hacer nada
  | 'discovering' // Buscando servidor vía UDP/mDNS
  | 'connecting' // Intentando abrir el WebSocket
  | 'authenticating' // WebSocket abierto, esperando validación de PIN
  | 'connected' // Recibiendo telemetría activamente
  | 'error'; // Fallo en cualquier etapa

type DiscoveredServer = {
  ip: string;
  port: number;
  serverName: string;
  lastSeen: number;
};

interface TelemetryState {
  // --- Estado de Red ---
  serverIp: string | null;
  serverPort: number | null;
  pin: string | null;
  connectionStatus: ConnectionStatus;
  error: string | null;

  // --- Descubrimiento ---
  discoveredServers: DiscoveredServer[];
  isScanning: boolean;
  discoveryError: string | null;

  // --- Datos de Telemetría ---
  data: TelemetryData | null;

  // --- Acciones ---
  /** Guarda los datos del servidor encontrado */
  setServer: (ip: string, port: number) => void;
  /** Guarda el PIN de seguridad del usuario */
  setPin: (pin: string) => void;
  /** Actualiza la etapa de la conexión */
  setStatus: (status: ConnectionStatus) => void;
  /** Inyecta una nueva captura de datos y marca como conectado */
  setTelemetryData: (data: TelemetryData) => void;
  /** Registra un error y cambia el estado */
  setError: (error: string | null) => void;

  /** Discovery */
  setDiscoveredServers: (servers: DiscoveredServer[]) => void;
  addDiscoveredServer: (server: DiscoveredServer) => void;
  setIsScanning: (isScanning: boolean) => void;
  setDiscoveryError: (error: string | null) => void;

  /** Limpia el estado para una nueva conexión */
  reset: () => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  serverIp: null,
  serverPort: null,
  pin: null,
  connectionStatus: 'idle',
  error: null,

  // Discovery
  discoveredServers: [],
  isScanning: false,
  discoveryError: null,

  // Telemetry data
  data: null,

  setServer: (ip, port) => set({ serverIp: ip, serverPort: port, error: null }),
  setPin: (pin) => set({ pin }),
  setStatus: (status) => set({ connectionStatus: status }),
  setTelemetryData: (data) => set({ data, connectionStatus: 'connected' }),
  setError: (error) => set({ error, connectionStatus: 'error' }),

  setDiscoveredServers: (servers) => set({ discoveredServers: servers }),
  addDiscoveredServer: (server) =>
    set((state) => {
      const exists = state.discoveredServers.some((s) => s.ip === server.ip);
      if (exists) {
        return {
          discoveredServers: state.discoveredServers.map((s) =>
            s.ip === server.ip
              ? { ...s, port: server.port, serverName: server.serverName, lastSeen: Date.now() }
              : s
          ),
        };
      }
      return {
        discoveredServers: [...state.discoveredServers, { ...server, lastSeen: Date.now() }],
      };
    }),
  setIsScanning: (isScanning) => set({ isScanning }),
  setDiscoveryError: (error) => set({ discoveryError: error }),

  reset: () =>
    set({
      serverIp: null,
      serverPort: null,
      connectionStatus: 'idle',
      data: null,
      error: null,
      discoveredServers: [],
      isScanning: false,
      discoveryError: null,
    }),
}));
