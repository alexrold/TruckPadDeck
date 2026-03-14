import { useEffect } from 'react';
import { NativeModules } from 'react-native';
import { Buffer } from 'buffer';
import { useTelemetryStore } from '@/store/telemetry-store';

const DISCOVERY_PORT = 5555;

/**
 * Hook de descubrimiento de servidor.
 *
 * @param enabled Si es false, no inicia la búsqueda.
 *                Si es true, comienza a escuchar el beacon UDP.
 */
export function useDiscovery(enabled: boolean = true) {
  const {
    setServer,
    setStatus,
    connectionStatus,
    addDiscoveredServer,
    setIsScanning,
    setDiscoveryError,
  } = useTelemetryStore();

  useEffect(() => {
    if (!enabled) {
      setIsScanning(false);
      return;
    }

    if (connectionStatus !== 'idle' && connectionStatus !== 'discovering') return;

    let socket: any = null;
    let dgram: any = null;

    // Algunos entornos (Expo Go) no tienen soporte para react-native-udp.
    // Intentamos cargarlo dinámicamente para evitar errores en el bundler.
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      dgram = require('react-native-udp');
    } catch {
      dgram = null;
    }

    if (!dgram || typeof dgram.createSocket !== 'function' || !NativeModules.UdpSockets) {
      console.error('[Discovery] react-native-udp no está disponible en este entorno.');
      setDiscoveryError(
        'Discovery no soportado en este entorno (Expo Go no incluye el módulo nativo UDP).'
      );
      setIsScanning(false);
      return;
    }

    try {
      socket = dgram.createSocket({ type: 'udp4' });
      setDiscoveryError(null);
      setIsScanning(true);

      socket.on('message', (msg: Buffer) => {
        try {
          const text = msg.toString('utf8');
          const data = JSON.parse(text);

          if (data.type === 'truckpaddeck_discovery' && data.ip && data.port) {
            console.log(`[Discovery] Servidor detectado en ${data.ip}:${data.port}`);
            addDiscoveredServer({
              ip: data.ip,
              port: data.port,
              serverName: data.server_name || 'TruckPadDeck',
              lastSeen: Date.now(),
            });

            // No cerramos la escucha; permitimos descubrir más servidores / actualizaciones.
          }
        } catch (err) {
          console.debug('[Discovery] Paquete no reconocido ignorado:', err);
        }
      });

      socket.on('error', (err: Error) => {
        console.error('[Discovery] Error crítico en Socket UDP:', err.message);
        setDiscoveryError(err.message);
        setIsScanning(false);
        if (socket) socket.close();
      });

      socket.bind(DISCOVERY_PORT, () => {
        console.log(`[Discovery] Escuchando Beacon UDP en puerto ${DISCOVERY_PORT}...`);
        setIsScanning(true);
      });
    } catch (err) {
      console.error('[Discovery] Fallo al inicializar el servicio de red:', err);
      setDiscoveryError(String(err));
      setIsScanning(false);
    }

    return () => {
      if (socket) {
        try {
          socket.close();
        } catch (err) {
          console.debug('[Discovery] El socket ya estaba cerrado al desmontar:', err);
        }
      }
      setIsScanning(false);
    };
  }, [enabled, connectionStatus, setServer, setStatus]);
}
