import {useEffect} from 'react';
import {activateKeepAwakeAsync, deactivateKeepAwake} from 'expo-keep-awake';
import {useConnectionStore} from '@store/index';

/**
 * useHardwareManager - Hook para la gestión de recursos de hardware críticos.
 * Controla el estado de retro iluminación de la pantalla (KeepAwake) basado en la sesión.
 */
export const useHardwareManager = () => {
  const {status} = useConnectionStore();

  useEffect(() => {
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

    return () => {
      deactivateKeepAwake();
    };
  }, [status]);
};
