import {useEffect} from 'react';
import {activateKeepAwakeAsync, deactivateKeepAwake} from 'expo-keep-awake';
import {useConnectionStore} from '@store/index';

/**
 * useHardwareManager - Hook para la gestión de recursos de hardware críticos.
 * Controla el estado de retroiluminación de la pantalla (KeepAwake) basado en la sesión.
 * Garantiza que el dashboard sea visible durante todo el trayecto de simulación.
 */
export const useHardwareManager = () => {
  const {status} = useConnectionStore();

  useEffect(() => {
    /**
     * Gestión del estado de la pantalla.
     * Se activa únicamente cuando existe un enlace de datos activo (CONNECTED).
     * Libera el recurso en estados de desconexión o error para optimizar consumo.
     */
    const manageScreenState = async () => {
      if (status === 'CONNECTED') {
        try {
          await activateKeepAwakeAsync();
          console.log('[Hardware] KeepAwake: ACTIVATED');
        } catch (e) {
          console.warn('[Hardware] Failed to activate KeepAwake:', e);
        }
      } else {
        deactivateKeepAwake();
        console.log('[Hardware] KeepAwake: DEACTIVATED');
      }
    };

    manageScreenState();

    // Cleanup al desmontar el hook (Cierre total de la App)
    return () => {
      deactivateKeepAwake();
    };
  }, [status]);
};
