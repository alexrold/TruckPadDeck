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
 * useConnectionStore - Gestión del estado del enlace de red y UI de conexión.
 * Centraliza la configuración de red y el estado del modal de emparejamiento 
 * para permitir disparadores reactivos desde hooks de infraestructura (Discovery).
 */
export const useConnectionStore = create<ConnectionState>((set) => ({
  ip: '---',
  port: 0,
  pin: '------',
  status: 'DISCONNECTED',
  isModalOpen: false,

  setConnection: (config) => set({...config}),
  setStatus: (status) => set({status}),
  setModalOpen: (isModalOpen) => set({isModalOpen}),
  resetConnection: () => set({
    ip: '---',
    port: 0,
    pin: '------',
    status: 'DISCONNECTED'
  }),
}));
