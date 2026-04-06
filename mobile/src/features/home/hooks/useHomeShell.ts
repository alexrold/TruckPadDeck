import * as NavigationBar from 'expo-navigation-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import {useEffect} from 'react';
import {useServiceDiscovery} from './useServiceDiscovery';

/**
 * useHomeShell - Gestión de la configuración imperativa del entorno nativo.
 * Centraliza los efectos secundarios relacionados con el hardware y el OS 
 * para asegurar la experiencia de "Modo Inmersivo" en la Home.
 */
export const useHomeShell = () => {
  // Inicialización del Discovery automático de servidores en segundo plano
  useServiceDiscovery();

  useEffect(() => {
    // Lock de orientación para asegurar que el dashboard no rote accidentalmente.
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    
    // Ocultamiento de controles del sistema para inmersión total.
    NavigationBar.setVisibilityAsync('hidden');
  }, []);
};
