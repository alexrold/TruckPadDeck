import { SCSTelemetry } from '../constants/scs-telemetry-types';

/**
 * Interfaz que define el estado relacionado con los datos de telemetría del camión.
 */
export interface TelemetryState {
  /** Datos actuales de telemetría provenientes del simulador. */
  telemetry: SCSTelemetry | null;
  /** Actualiza el estado global con nuevos datos de telemetría. */
  setTelemetry: (data: SCSTelemetry) => void;
  /** Limpia los datos de telemetría (útil al desconectar). */
  resetTelemetry: () => void;
}

/** Posibles estados de la conexión WebSocket. */
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * Interfaz que define el estado de la conexión con el servidor de telemetría.
 */
export interface ConnectionState {
  /** Dirección IP del servidor de telemetría. */
  serverIp: string;
  /** Estado actual de la conexión. */
  status: ConnectionStatus;
  /** Establece la dirección IP del servidor. */
  setServerIp: (ip: string) => void;
  /** Actualiza el estado de la conexión. */
  setConnectionStatus: (status: ConnectionStatus) => void;
}

/**
 * Representa la combinación de todos los slices en un único almacén de datos (Store).
 */
export type RootStore = TelemetryState & ConnectionState;
