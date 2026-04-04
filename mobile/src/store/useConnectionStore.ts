import {create} from 'zustand';

export type ConnectionStatus = 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING' | 'RECONNECTING' | 'ERROR';

interface ConnectionState {
  // --- Datos del Servidor ---
  ip: string;
  port: number;
  pin: string;
  status: ConnectionStatus;
  
  // --- UI State ---
  isModalOpen: boolean;

  // --- Acciones ---
  setConnection: (config: {ip: string; port: number; pin: string}) => void;
  setStatus: (status: ConnectionStatus) => void;
  setModalOpen: (open: boolean) => void;
  resetConnection: () => void;
}

/**
 * useConnectionStore - Almacén global para la gestión del ciclo de vida del enlace de red.
 * Centraliza los parámetros de direccionamiento (IP/Port), autenticación (PIN)
 * y los estados de la sesión para el orquestador de telemetría.
 */
export const useConnectionStore = create<ConnectionState>((set) => ({
  ip: '',
  port: 42424,
  pin: '',
  status: 'DISCONNECTED',
  isModalOpen: false,

  setConnection: (config) => set({...config}),
  setStatus: (status) => set({status}),
  setModalOpen: (isModalOpen) => set({isModalOpen}),
  resetConnection: () => set({
    ip: '',
    port: 42424,
    pin: '',
    status: 'DISCONNECTED'
  }),
}));
