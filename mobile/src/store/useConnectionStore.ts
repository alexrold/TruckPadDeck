import {create} from 'zustand';

export type ConnectionStatus = 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING' | 'RECONNECTING' | 'ERROR';

interface ConnectionState {
  // --- Datos del Servidor ---
  ip: string;
  port: number;
  pin: string;
  status: ConnectionStatus;

  // --- Acciones ---
  setConnection: (config: {ip: string; port: number; pin: string}) => void;
  setStatus: (status: ConnectionStatus) => void;
  resetConnection: () => void;
}

/**
 * useConnectionStore - Store para la gestión del enlace técnico con el servidor.
 * Centraliza los parámetros de red y el estado del ciclo de vida del WebSocket.
 */
export const useConnectionStore = create<ConnectionState>((set) => ({
  ip: '---',
  port: 0,
  pin: '------',
  status: 'DISCONNECTED',

  setConnection: (config) => set({...config}),
  setStatus: (status) => set({status}),
  resetConnection: () => set({
    ip: '---',
    port: 0,
    pin: '------',
    status: 'DISCONNECTED'
  }),
}));
