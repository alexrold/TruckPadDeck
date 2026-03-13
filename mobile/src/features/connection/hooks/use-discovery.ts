import { useEffect } from 'react';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';
import { useTelemetryStore } from '@/store/telemetry-store';

const DISCOVERY_PORT = 5555;

export function useDiscovery() {
  const { setServer, setStatus, connectionStatus } = useTelemetryStore();

  useEffect(() => {
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
