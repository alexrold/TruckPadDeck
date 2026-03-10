import { StateCreator } from 'zustand';
import { ConnectionState, RootStore } from '../types';

/**
 * Slice encargado de gestionar la configuración y el estado de la conexión.
 *
 * Mantiene la dirección IP del servidor y monitorea el estado actual del
 * WebSocket (conectando, conectado, desconectado, error).
 *
 * @param set Función para actualizar el estado global.
 * @returns Objeto con el estado inicial y las acciones de conexión.
 */
export const createConnectionSlice: StateCreator<RootStore, [], [], ConnectionState> = (set) => ({
  serverIp: '192.168.100.44', // IP inicial (mock)
  status: 'disconnected',
  setServerIp: (ip) => set(() => ({ serverIp: ip })),
  setConnectionStatus: (status) => set(() => ({ status })),
});
