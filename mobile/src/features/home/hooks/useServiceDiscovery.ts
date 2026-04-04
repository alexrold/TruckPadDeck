import {useEffect} from 'react';
import dgram from 'react-native-udp';
import {useConnectionStore} from '@store/index';

/**
 * useServiceDiscovery - Hook de infraestructura para el Discovery automático.
 * Implementa la escucha de paquetes UDP Broadcast en el puerto 5555.
 * 
 * Flujo:
 * 1. Abre un socket UDP tipo 'udp4'.
 * 2. Filtra paquetes que cumplan con el protocolo { type: 'truckpaddeck_discovery' }.
 * 3. Actualiza el ConnectionStore de forma reactiva al detectar un servidor activo.
 */
export const useServiceDiscovery = () => {
  const {setConnection, setStatus, status} = useConnectionStore();

  useEffect(() => {
    // Si ya estamos conectados, no necesitamos seguir buscando activamente.
    if (status === 'CONNECTED') return;

    const socket = dgram.createSocket({type: 'udp4', reusePort: true});
    const DISCOVERY_PORT = 5555;

    socket.on('message', (msg, rinfo) => {
      try {
        const data = JSON.parse(msg.toString());

        // Validación del contrato de Discovery definido en el Servidor (network/discovery.py)
        if (data.type === 'truckpaddeck_discovery') {
          console.log(`[UDP] Server discovered at ${data.ip}:${data.port}`);
          
          setConnection({
            ip: data.ip,
            port: data.port,
            pin: '------', // El PIN se ingresa manualmente o se negocia luego
          });
          
          setStatus('CONNECTED');
        }
      } catch (e) {
        // Ignoramos paquetes que no sean JSON válidos de nuestro protocolo.
      }
    });

    socket.on('error', (err) => {
      console.error(`[UDP] Socket error: ${err}`);
      setStatus('ERROR');
    });

    // Enlazamos el socket al puerto de Discovery.
    socket.bind(DISCOVERY_PORT);

    // Limpieza del socket al desmontar el componente o cambiar el estado.
    return () => {
      socket.close();
    };
  }, [status, setConnection, setStatus]);
};
