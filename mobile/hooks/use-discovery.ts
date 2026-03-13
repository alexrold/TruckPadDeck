import { useEffect } from 'react';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';
import { useTelemetryStore } from '../store/telemetry-store';

/**
 * Puerto estandarizado para el faro (Beacon) de Service Discovery UDP.
 * Debe coincidir con la configuración del servidor Python (server/network/discovery.py).
 */
const DISCOVERY_PORT = 5555;

/**
 * Hook de Service Discovery (Descubrimiento de Servicios).
 * 
 * Escucha paquetes de difusión (Broadcast) en la red local para identificar 
 * automáticamente la IP y el Puerto del servidor TruckPadDeck.
 */
export function useDiscovery() {
  const { setServer, setStatus, connectionStatus } = useTelemetryStore();

  useEffect(() => {
    // Solo iniciamos el descubrimiento si el estado es 'idle' o ya estamos en 'discovering'
    if (connectionStatus !== 'idle' && connectionStatus !== 'discovering') return;

    let socket: any = null;

    try {
      socket = dgram.createSocket({ type: 'udp4' });

      socket.on('message', (msg: Buffer) => {
        try {
          const text = msg.toString('utf8');
          const data = JSON.parse(text);

          if (data.type === 'truckpaddeck_discovery' && data.ip && data.port) {
            console.log(`[Discovery] Servidor detectado en ${data.ip}:${data.port}`);
            setServer(data.ip, data.port);
            
            if (socket) {
              socket.close();
              socket = null;
            }
          }
        } catch (err) {
          // Error silencioso al parsear paquetes ajenos al protocolo en la red local
          console.debug('[Discovery] Paquete no reconocido ignorado:', err);
        }
      });

      socket.on('error', (err: Error) => {
        console.error('[Discovery] Error crítico en Socket UDP:', err.message);
        setStatus('error');
        if (socket) socket.close();
      });

      socket.bind(DISCOVERY_PORT, () => {
        console.log(`[Discovery] Escuchando Beacon UDP en puerto ${DISCOVERY_PORT}...`);
        setStatus('discovering');
      });

    } catch (err) {
      console.error('[Discovery] Fallo al inicializar el servicio de red:', err);
      setStatus('error');
    }

    return () => {
      if (socket) {
        try {
          socket.close();
        } catch (err) {
          console.debug('[Discovery] El socket ya estaba cerrado al desmontar:', err);
        }
      }
    };
  }, [connectionStatus, setServer, setStatus]);
}
