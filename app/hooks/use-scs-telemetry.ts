import { useEffect } from 'react';
import { useStore } from '../store/use-store';
import { SCSTelemetry } from '../constants/scs-telemetry-types';

/**
 * Hook que gestiona la conexión WebSocket con el servidor de telemetría de SCS.
 *
 * Implementa la fase de autenticación por PIN antes de recibir datos.
 */
export function useSCSTelemetry() {
  const serverIp = useStore((state) => state.serverIp);
  const serverPort = useStore((state) => state.serverPort);
  const serverPin = useStore((state) => state.serverPin);
  const setTelemetry = useStore((state) => state.setTelemetry);
  const setConnectionStatus = useStore((state) => state.setConnectionStatus);
  const setAuthStatus = useStore((state) => state.setAuthStatus);
  const resetTelemetry = useStore((state) => state.resetTelemetry);

  useEffect(() => {
    // Si no tenemos IP, no intentamos conectar
    if (!serverIp) return;

    const socketUrl = `ws://${serverIp}:${serverPort}`;
    let ws: WebSocket | null = null;

    try {
      setConnectionStatus('connecting');
      ws = new WebSocket(socketUrl);

      ws.onopen = () => {
        console.log(`✅ Conectado a ${socketUrl}. Enviando PIN...`);
        // Fase 1: Enviar PIN de autenticación
        ws?.send(JSON.stringify({
          type: 'auth',
          pin: serverPin
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Manejar estados de autenticación
          if (data.status === 'auth_ok') {
            console.log('✅ Autenticación exitosa.');
            setAuthStatus('authenticated');
            setConnectionStatus('connected');
            return;
          }
          
          if (data.status === 'auth_failed') {
            console.error('❌ Error de autenticación: PIN incorrecto.');
            setAuthStatus('denied');
            ws?.close();
            return;
          }

          // Si estamos autenticados, procesar telemetría
          if (data.status === 'connected' || data.status === 'waiting_for_game') {
            setConnectionStatus(data.status);
            if (data.truck) {
                setTelemetry(data as SCSTelemetry);
            }
          }
        } catch (parseError) {
          console.error('❌ Error parseando mensaje del servidor:', parseError);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setConnectionStatus('error');
      };

      ws.onclose = () => {
        console.log('❌ WebSocket cerrado');
        setConnectionStatus('disconnected');
        setAuthStatus('unauthenticated');
        resetTelemetry();
      };
    } catch (error) {
      console.error('❌ Error inicializando WebSocket:', error);
      setConnectionStatus('error');
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [serverIp, serverPort, serverPin, setTelemetry, setConnectionStatus, setAuthStatus, resetTelemetry]);
}
