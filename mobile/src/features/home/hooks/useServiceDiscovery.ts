import {useEffect} from 'react';
import dgram from 'react-native-udp';
import {useConnectionStore} from '@store/index';

/**
 * useServiceDiscovery - Hook de infraestructura para el Discovery automático.
 * Implementa un receptor de Beacons mediante protocolos UDP Broadcast.
 */
export const useServiceDiscovery = () => {
  const {setConnection, setStatus, status} = useConnectionStore();

  useEffect(() => {
    // Si la sesión ya está activa, suspendemos la escucha de Beacons
    if (status === 'CONNECTED') return;

    const socket = dgram.createSocket({type: 'udp4', reusePort: true});
    const DISCOVERY_PORT = 5555; // Puerto estandarizado para Discovery

    socket.on('message', (msg, rinfo) => {
      try {
        const data = JSON.parse(msg.toString());

        // Validación del contrato de Discovery definido en el Servidor (network/discovery.py)
        if (data.type === 'truckpaddeck_discovery') {
          console.log(`[UDP] Server Beacon discovered: ${data.ip}:${data.port}`);
          
          setConnection({
            ip: data.ip,
            port: data.port,
            pin: '', // El PIN se requiere para el Handshake en el Modal
          });
        }
      } catch (e) {
        // Descarte de paquetes no compatibles con el protocolo
      }
    });

    socket.on('error', (err) => {
      console.error(`[UDP] Discovery socket error: ${err}`);
      setStatus('ERROR');
    });

    // Enlace del socket al puerto de escucha de Discovery
    socket.bind(DISCOVERY_PORT);

    return () => {
      socket.close();
    };
  }, [status, setConnection, setStatus]);
};
