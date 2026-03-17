import { create } from 'zustand';

//TODO: -MOVER INTERFACES A UN ARCHIVO SEPARADO (telemetry-types.ts) PARA LIMPIEZA Y REUTILIZACIÓN
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
    parking_brake: boolean; // Freno de mano
    motor_brake: boolean; // Retarder freno motor
    blinker_left: boolean; // Intermitente izquierdo
    blinker_right: boolean; // Intermitente derecho
    beam_low: boolean; // Luces bajas
    beam_high: boolean; // Luces altas
    beacon: boolean; // Baliza
    brake: boolean; // Freno
    hazard: boolean; // Peligro
    cruise_control: boolean; // Control de crucero
  };

  /** Información del trabajo actual y vehículo */
  job: {
    cargo: string; // Tipo de carga (ej: "Contenedores", "Madera")
    city_src: string; // Ciudad de origen
    city_dst: string; // ciudad de destino
    truck_name: string; // Nombre del camión (ej: "Volvo FH16")
    on_job: boolean; // Si el jugador está actualmente en un trabajo activo
    trailer_attached: boolean; // Si el camión tiene un remolque enganchado
  };

  /** Flags de eventos instantáneos (True durante el frame del evento) */
  events: {
    fined: boolean; // Multa
    tollgate: boolean; // Paso por peaje
    ferry: boolean; // Viaje en ferry
    train: boolean; // Viaje en tren
    refuel: boolean; // Repostaje en curso
  };

  /** Estado de la sesión  */
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
  ip: string; // Dirección IP del servidor
  port: number; // Puerto de conexión
  serverName: string; // Nombre del servidor
  lastSeen: number; // Timestamp de la última vez que se vio el servidor
};

interface TelemetryState {
  // --- Estado de Red ---
  serverIp: string | null; // Dirección IP del servidor
  serverPort: number | null; // Puerto de conexión
  pin: string | null; // PIN de seguridad
  connectionStatus: ConnectionStatus; // Estado de la conexión
  error: string | null; // Mensaje de error en caso de fallo

  // --- Discovery ---
  discoveredServers: DiscoveredServer[]; // Lista de servidores descubiertos
  isScanning: boolean; // Indica si se está escaneando para encontrar servidores
  discoveryError: string | null; // Mensaje de error en caso de fallo en el descubrimiento

  // --- Datos de Telemetría ---
  data: TelemetryData | null; // Última captura de telemetría recibida del servidor

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

/**
 * Zustand store para gestionar toda la lógica de conexión, descubrimiento y almacenamiento de telemetría.
 * Este store es el corazón de la aplicación, ya que centraliza el estado y las acciones relacionadas con la telemetría.
 * Permite a cualquier componente acceder a los datos de telemetría, estado de conexión y lista de servidores descubiertos sin necesidad de prop drilling.
 */

export const useTelemetryStore = create<TelemetryState>((set) => ({
  /** Estado inicial */

  // Red y Conexión
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

  //* Acciones para actualizar el estado */

  // Guarda la IP y puerto del servidor al que se quiere conectar, y resetea cualquier error previo
  setServer: (ip, port) => set({ serverIp: ip, serverPort: port, error: null }),
  // Guarda el PIN ingresado por el usuario para autenticación
  setPin: (pin) => set({ pin }),
  // Actualiza el estado de la conexión (ej: 'connecting', 'connected', 'error')
  setStatus: (status) => set({ connectionStatus: status }),
  // Al recibir nuevos datos de telemetría, los guarda en el estado y marca la conexión como activa
  setTelemetryData: (data) => set({ data, connectionStatus: 'connected' }),
  // Registra un error ocurrido durante la conexión o autenticación, y cambia el estado a 'error'
  setError: (error) => set({ error, connectionStatus: 'error' }),

  //* Discovery actions */

  // Reemplaza toda la lista de servidores descubiertos
  setDiscoveredServers: (servers) => set({ discoveredServers: servers }),

  // Agrega o actualiza un servidor descubierto en la lista, evitando duplicados por IP
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

  // Indica si se está escaneando para encontrar servidores
  setIsScanning: (isScanning) => set({ isScanning }),
  // Registra un error en el proceso de descubrimiento de servidores
  setDiscoveryError: (error) => set({ discoveryError: error }),
  // Resetear todo el estado para iniciar una nueva conexión
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
