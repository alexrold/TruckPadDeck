import {create} from 'zustand';

export type AppTheme = 'light' | 'dark' | 'system';
export type AppLanguage = 'es' | 'en';

interface UIState {
  // --- Estado ---
  theme: AppTheme;
  language: AppLanguage;
  
  // --- Acciones (Setters) ---
  setTheme: (theme: AppTheme) => void;
  setLanguage: (lang: AppLanguage) => void;
}

/**
 * useUIStore - Store para la gestión de preferencias de interfaz.
 * Aísla las configuraciones visuales y de localización del usuario.
 * Diseñado para ser persistente en futuras iteraciones.
 */
export const useUIStore = create<UIState>((set) => ({
  theme: 'system', // Por defecto sigue al sistema operativo
  language: 'es',   // Por defecto español
  
  setTheme: (theme) => set({theme}),
  setLanguage: (language) => set({language}),
}));
