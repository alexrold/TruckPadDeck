import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

// --- Tipos estados de conexión ---
export type ConnectionStatus =
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'RECONNECTING'
  | 'ERROR';

// --- interface del estado global de conexión ---
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
 *
 * Persistencia: Guarda la última IP y Puerto exitosos para facilitar reconexiones.
 * Seguridad: NUNCA persiste el PIN ni el estado de conexión activa.
 */
export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set) => ({
      ip: '',
      port: 42424,
      pin: '',
      status: 'DISCONNECTED',
      isModalOpen: false,

      setConnection: (config) => set({...config}),
      setStatus: (status) => set({status}),
      setModalOpen: (isModalOpen) => set({isModalOpen}),
      resetConnection: () =>
        set({
          ip: '',
          port: 42424,
          pin: '',
          status: 'DISCONNECTED',
        }),
    }),
    {
      name: 'truckpaddeck-connection-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistimos la IP y el Puerto. El PIN y el Status deben ser efímeros.
      partialize: (state) => ({
        ip: state.ip,
        port: state.port,
      }),
    },
  ),
);
