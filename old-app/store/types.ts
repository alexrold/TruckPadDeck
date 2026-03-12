import { SCSTelemetry } from '../constants/scs-telemetry-types';

/**
 * Interfaz que define el estado relacionado con los datos de telemetría del camión.
 */
export interface TelemetryState {
  /** 
   * Datos actuales de telemetría provenientes del simulador.
   * Ahora incluye información detallada de luces, trabajo y navegación.
   */
  telemetry: SCSTelemetry | null;
  /** Actualiza el estado global con nuevos datos de telemetría. */
  setTelemetry: (data: SCSTelemetry) => void;
  /** Limpia los datos de telemetría (útil al desconectar). */
  resetTelemetry: () => void;
}

/** 
 * Posibles estados de la conexión WebSocket.
 * 'waiting_for_game' indica que el servidor está activo pero el juego no.
 */
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error' | 'waiting_for_game';

/**
 * Posibles estados de la autenticación con el servidor.
 */
export type AuthStatus = 'unauthenticated' | 'authenticated' | 'denied';

/**
 * Representa un servidor descubierto en la red local.
 */
export interface DiscoveredServer {
  ip: string;
  port: number;
  serverName: string;
  lastSeen: number;
}

/**
 * Interfaz que define el estado de la conexión y descubrimiento del servidor.
 */
export interface ConnectionState {
  /** Dirección IP del servidor de telemetría. */
  serverIp: string;
  /** Puerto del servidor de telemetría. */
  serverPort: number;
  /** Estado actual de la conexión. */
  status: ConnectionStatus;
  /** PIN de seguridad de 6 dígitos introducido por el usuario. */
  serverPin: string;
  /** Estado actual de la autenticación. */
  authStatus: AuthStatus;
  /** Lista de servidores encontrados por UDP en la red local. */
  discoveredServers: DiscoveredServer[];
  /** Indica si la App está buscando servidores activamente. */
  isScanning: boolean;
  
  /** Acciones */
  setServerIp: (ip: string) => void;
  setServerPort: (port: number) => void;
  setServerPin: (pin: string) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setAuthStatus: (status: AuthStatus) => void;
  setDiscoveredServers: (servers: DiscoveredServer[] | ((prev: DiscoveredServer[]) => DiscoveredServer[])) => void;
  setIsScanning: (scanning: boolean) => void;
}

/**
 * Representa la combinación de todos los slices en un único almacén de datos (Store).
 */
export type RootStore = TelemetryState & ConnectionState;
