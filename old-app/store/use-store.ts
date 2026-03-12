import { create } from 'zustand';
import { RootStore } from './types';
import { createTelemetrySlice } from './slices/telemetry-slice';
import { createConnectionSlice } from './slices/connection-slice';

/**
 * Hook global de Zustand para acceder y modificar el estado de la aplicación.
 *
 * Este store unifica múltiples "slices" (rebanadas de estado) en una única interfaz.
 * Permite acceder de forma reactiva a la telemetría y el estado de conexión desde
 * cualquier componente de la aplicación Expo.
 *
 * @example
 * const speed = useStore((state) => state.telemetry?.speed);
 * const setIp = useStore((state) => state.setServerIp);
 *
 * @returns Instancia del store global TruckPadDeck.
 */
export const useStore = create<RootStore>()((...a) => ({
  ...createTelemetrySlice(...a),
  ...createConnectionSlice(...a),
}));
