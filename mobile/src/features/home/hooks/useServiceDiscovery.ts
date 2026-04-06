import {useConnectionStore} from '@store/index';
import {useEffect} from 'react';
import dgram from 'react-native-udp';

/**
 * Hook de detección de servicios vía UDP Broadcast (Puerto 5555).
 * Extrae la IP del host desde rinfo.address para garantizar accesibilidad.
 */
export const useServiceDiscovery = () => {
  const {setConnection, status} = useConnectionStore();

  useEffect(() => {
    if (status === 'CONNECTED') return;

    const socket = dgram.createSocket({type: 'udp4', reusePort: true});
    const DISCOVERY_PORT = 5555;

    socket.on('message', (msg, rinfo) => {
      try {
        const data = JSON.parse(msg.toString());
        
        if (data.type === 'truckpaddeck_discovery') {
          // Vinculación de IP de transporte y puerto de aplicación al store
          setConnection({
            ip: rinfo.address,
            port: data.port,
            pin: '',
          });
        }
      } catch (e) {}
    });

    socket.bind(DISCOVERY_PORT, '0.0.0.0');

    return () => {
      socket.close();
    };
  }, [status, setConnection]);
};
