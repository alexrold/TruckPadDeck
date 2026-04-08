import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

export type AppTheme = 'light' | 'dark' | 'system';
export type AppLanguage = 'es' | 'en';
export type ViewMode = 'all' | 'favorites';

interface UIState {
  // --- Estado ---
  theme: AppTheme;
  language: AppLanguage;
  viewMode: ViewMode;
  
  // --- Acciones (Setters) ---
  setTheme: (theme: AppTheme) => void;
  setLanguage: (lang: AppLanguage) => void;
  setViewMode: (mode: ViewMode) => void;
}

/**
 * useUIStore - Store para la gestión de preferencias globales de la interfaz.
 */
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'es',
      viewMode: 'all', // Por defecto muestra toda la biblioteca
      
      setTheme: (theme) => set({theme}),
      setLanguage: (language) => set({language}),
      setViewMode: (viewMode) => set({viewMode}),
    }),
    {
      name: 'truckpaddeck-ui-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // No persistimos el viewMode para que al abrir la app siempre vea la biblioteca completa.
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);

