import {useEffect} from 'react';
import * as Network from 'expo-network';
import {useConnectionStore} from '@store/index';

/**
 * useLocalIp - Hook para la detección de la infraestructura de red local.
 * Identifica la dirección IP del dispositivo para pre-configurar el Network Prefix.
 * Optimiza la entrada manual de parámetros de red en el ConnectionModal.
 */
export const useLocalIp = () => {
  const {setConnection, ip} = useConnectionStore();

  useEffect(() => {
    /**
     * Recupera la IP local y extrae los tres primeros octetos para sugerir
     * el segmento de red donde reside el servidor PC.
     */
    const getIpPrefix = async () => {
      if (ip !== '') return;

      try {
        const ipAddress = await Network.getIpAddressAsync();
        
        if (ipAddress && ipAddress.includes('.')) {
          const parts = ipAddress.split('.');
          if (parts.length === 4) {
            // Ejemplo: '192.168.1.' (Network Prefix sugerido)
            const prefix = `${parts[0]}.${parts[1]}.${parts[2]}.`;
            
            setConnection({
              ip: prefix,
              port: 42424,
              pin: ''
            });
          }
        }
      } catch (e) {
        console.warn('[Network] IP acquisition failure:', e);
      }
    };

    getIpPrefix();
  }, [ip, setConnection]);
};
