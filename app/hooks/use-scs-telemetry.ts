import { useEffect } from 'react';
import { useStore } from '../store/use-store';
import { SCSTelemetry } from '../constants/scs-telemetry-types';

/**
 * Hook que gestiona la conexión WebSocket con el servidor de telemetría de SCS.
 * 
 * Se encarga de abrir la conexión, escuchar los mensajes entrantes y 
 * sincronizar los datos recibidos con el store global de Zustand.
 * También monitorea el estado de la conexión (conectado, error, cerrado).
 *
 * @example
 * // Solo invocar una vez en el componente raíz o layout principal
 * useSCSTelemetry();
 * 
 * @returns void - Los datos se acceden a través de `useStore`.
 */
export function useSCSTelemetry() {
  // Obtenemos las acciones y la configuración del store global
  const serverIp = useStore((state) => state.serverIp);
  const setTelemetry = useStore((state) => state.setTelemetry);
  const setConnectionStatus = useStore((state) => state.setConnectionStatus);
  const resetTelemetry = useStore((state) => state.resetTelemetry);

  useEffect(() => {
    // Definimos la URL del servidor basada en la IP del store
    const socketUrl = `ws://${serverIp}:8080`;
    let ws: WebSocket | null = null;

    try {
      setConnectionStatus('connecting');
      ws = new WebSocket(socketUrl);

      ws.onopen = () => {
        console.log(`✅ WebSocket conectado a: ${socketUrl}`);
        setConnectionStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const telemetry: SCSTelemetry = JSON.parse(event.data);
          setTelemetry(telemetry);
        } catch (parseError) {
          console.error('❌ Error parseando telemetría:', parseError);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setConnectionStatus('error');
      };

      ws.onclose = () => {
        console.log('❌ WebSocket cerrado');
        setConnectionStatus('disconnected');
        resetTelemetry();
      };
    } catch (error) {
      console.error('❌ Error inicializando WebSocket:', error);
      setConnectionStatus('error');
    }

    // Limpieza al desmontar el hook o cambiar la IP
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [serverIp, setTelemetry, setConnectionStatus, resetTelemetry]);
}
