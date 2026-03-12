import {StateCreator} from 'zustand';
import {ConnectionState, RootStore} from '../types';

/**
 * Slice encargado de gestionar la configuración, el descubrimiento y el estado de la conexión.
 *
 * Mantiene la dirección IP del servidor, el puerto dinámico, el PIN de seguridad
 * y monitorea el estado actual del WebSocket y el escaneo de servidores.
 *
 * @param set Función para actualizar el estado global.
 * @returns Objeto con el estado inicial y las acciones de conexión.
 */
export const createConnectionSlice: StateCreator<
  RootStore,
  [],
  [],
  ConnectionState
> = (set) => ({
  // Configuración inicial
  serverIp: '',
  serverPort: 42424, // Puerto VIP por defecto
  serverPin: '',
  status: 'disconnected',
  authStatus: 'unauthenticated',
  
  // Descubrimiento
  discoveredServers: [],
  isScanning: false,

  // Acciones
  setServerIp: (ip) => set(() => ({ serverIp: ip })),
  setServerPort: (port) => set(() => ({ serverPort: port })),
  setServerPin: (pin) => set(() => ({ serverPin: pin })),
  setConnectionStatus: (status) => set(() => ({ status })),
  setAuthStatus: (authStatus) => set(() => ({ authStatus })),
  setDiscoveredServers: (update) =>
    set((state) => ({
      discoveredServers:
        typeof update === 'function' ? update(state.discoveredServers) : update,
    })),
  setIsScanning: (isScanning) => set(() => ({ isScanning })),
});
