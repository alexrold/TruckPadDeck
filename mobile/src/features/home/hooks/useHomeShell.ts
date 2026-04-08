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
    let isMounted = true;

    // Lock de orientación seguro. Se silencia el error si la actividad nativa no está lista.
    const setupNativeEnvironment = async () => {
      try {
        if (isMounted) {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
          await NavigationBar.setVisibilityAsync('hidden');
        }
      } catch (error) {
        console.warn('[HomeShell] Native environment setup skipped:', error);
      }
    };

    setupNativeEnvironment();

    return () => {
      isMounted = false;
    };
  }, []);};
