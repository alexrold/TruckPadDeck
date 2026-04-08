import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface DownloadState {
  // IDs de los dashboards descargados localmente
  downloadedIds: string[];

  // Acciones
  installDashboard: (id: string) => void;
  uninstallDashboard: (id: string) => void;
  isInstalled: (id: string) => boolean;
}

/**
 * useDownloadStore - Gestión de activos locales.
 * 
 * PROPÓSITO:
 * Controla el ciclo de vida de los dashboards en el almacenamiento del dispositivo. 
 * Permite implementar la estrategia de "Descarga bajo demanda" para mantener un 
 * tamaño de App reducido.
 */
export const useDownloadStore = create<DownloadState>()(
  persist(
    (set, get) => ({
      downloadedIds: [],

      installDashboard: (id: string) => {
        const { downloadedIds } = get();
        if (!downloadedIds.includes(id)) {
          set({ downloadedIds: [...downloadedIds, id] });
        }
      },

      uninstallDashboard: (id: string) => {
        const { downloadedIds } = get();
        set({ downloadedIds: downloadedIds.filter((dId) => dId !== id) });
      },

      isInstalled: (id: string) => get().downloadedIds.includes(id),
    }),
    {
      name: 'truckpaddeck-downloads-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
