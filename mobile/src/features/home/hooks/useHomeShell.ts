import * as NavigationBar from 'expo-navigation-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import {useEffect} from 'react';

/**
 * useHomeShell - Gestión de la configuración imperativa del entorno nativo.
 * Centraliza los efectos secundarios relacionados con el hardware y el OS 
 * para asegurar la experiencia de "Modo Inmersivo" en la Home.
 */
export const useHomeShell = () => {
  useEffect(() => {
    // Lock de orientación para asegurar que el dashboard no rote accidentalmente.
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    
    // Ocultamiento de controles del sistema para inmersión total.
    NavigationBar.setVisibilityAsync('hidden');
  }, []);
};
