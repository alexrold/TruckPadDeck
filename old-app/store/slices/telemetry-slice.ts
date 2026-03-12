import { StateCreator } from 'zustand';
import { RootStore, TelemetryState } from '../types';

/**
 * Slice encargado de la gestión de datos de telemetría del camión.
 *
 * Utiliza el patrón de "slice" de Zustand para mantener separada la lógica de
 * telemetría del resto de estados globales (como la conexión).
 *
 * @param set Función para actualizar el estado global.
 * @returns Objeto con el estado inicial y las acciones del slice.
 */
export const createTelemetrySlice: StateCreator<RootStore, [], [], TelemetryState> = (set) => ({
  telemetry: null,
  setTelemetry: (data) => set(() => ({ telemetry: data })),
  resetTelemetry: () => set(() => ({ telemetry: null })),
});
