import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface FavoriteState {
  // Array con los IDs de los dashboards marcados como favoritos
  favoriteIds: string[];

  // Acciones
  toggleFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

/**
 * useFavoriteStore - Gestión persistente de dashboards favoritos.
 * 
 * PROPÓSITO:
 * Almacena los identificadores de los dashboards preferidos del usuario. 
 * Esta información es vital para alimentar tanto la sección de 'Acceso Rápido' 
 * como la vista filtrada de 'Favoritos'.
 */
export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      /**
       * Añade o elimina un dashboard de la lista de favoritos.
       * @param id Identificador único del dashboard.
       */
      toggleFavorite: (id: string) => {
        const { favoriteIds } = get();
        const isFav = favoriteIds.includes(id);

        if (isFav) {
          set({ favoriteIds: favoriteIds.filter((favId) => favId !== id) });
        } else {
          set({ favoriteIds: [...favoriteIds, id] });
        }
      },

      /**
       * Elimina explícitamente un dashboard de la lista de favoritos.
       * @param id Identificador único del dashboard.
       */
      removeFavorite: (id: string) => {
        const { favoriteIds } = get();
        set({ favoriteIds: favoriteIds.filter((favId) => favId !== id) });
      },

      /**
       * Comprueba si un dashboard específico es favorito.
       * @param id Identificador único del dashboard.
       */
      isFavorite: (id: string) => get().favoriteIds.includes(id),
    }),
    {
      name: 'truckpaddeck-favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
