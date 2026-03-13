import { useEffect, useRef } from 'react';
import { useTelemetryStore, TelemetryData } from '../store/telemetry-store';

/**
 * Hook de Comunicación por WebSocket (Enlace de Telemetría).
 * 
 * Gestiona el ciclo de vida de la conexión con el servidor TruckPadDeck,
 * incluyendo la autenticación por PIN y el streaming de datos.
 */
export function useTelemetrySocket() {
  const { 
    serverIp, 
    serverPort, 
    pin, 
    setStatus, 
    setTelemetryData, 
    setError,
    connectionStatus 
  } = useTelemetryStore();

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Solo intentamos conectar si tenemos IP, Puerto y PIN, y no estamos ya conectados.
    if (!serverIp || !serverPort || !pin) return;
    if (connectionStatus === 'connected' || connectionStatus === 'authenticating' || connectionStatus === 'connecting') return;

    const socketUrl = `ws://${serverIp}:${serverPort}`;
    console.log(`[WebSocket] Intentando conectar a ${socketUrl}...`);

    try {
      setStatus('connecting');
      const ws = new WebSocket(socketUrl);
      socketRef.current = ws;

      // 1. Apertura de la conexión: Iniciamos Handshake de Seguridad
      ws.onopen = () => {
        console.log('[WebSocket] Conexión abierta. Enviando credenciales...');
        setStatus('authenticating');
        
        // El servidor espera un JSON con el tipo 'auth' y el PIN generado.
        const authPayload = JSON.stringify({
          type: 'auth',
          pin: pin
        });
        ws.send(authPayload);
      };

      // 2. Recepción de mensajes
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);

          // Caso A: Respuesta de Autenticación
          if (payload.status === 'auth_ok') {
            console.log('[WebSocket] Autenticación exitosa.');
            setStatus('connected');
            return;
          }

          if (payload.status === 'auth_failed') {
            console.error('[WebSocket] PIN inválido.');
            setError('PIN de seguridad incorrecto.');
            ws.close();
            return;
          }

          // Caso B: Servidor activo pero esperando al Simulador (ETS2/ATS)
          if (payload.status === 'waiting_for_game') {
            setStatus('connected'); // El socket está vivo, pero el juego no.
            // Opcionalmente podrías tener un estado 'waiting_game' en el store.
            return;
          }

          // Caso C: Streaming de Telemetría
          if (payload.status === 'connected' && payload.truck) {
            setTelemetryData(payload as TelemetryData);
          }

        } catch (err) {
          console.error('[WebSocket] Error al procesar mensaje entrante:', err);
        }
      };

      // 3. Manejo de errores de red
      ws.onerror = (err) => {
        console.error('[WebSocket] Error de conexión:', err);
        setError('No se pudo establecer conexión con el servidor.');
      };

      // 4. Cierre de conexión
      ws.onclose = (event) => {
        console.log(`[WebSocket] Conexión cerrada (Código: ${event.code}).`);
        if (connectionStatus !== 'error') {
          setStatus('idle');
        }
      };

    } catch (err) {
      console.error('[WebSocket] Fallo crítico al inicializar el cliente:', err);
      setStatus('error');
      setError('Fallo interno al crear el socket.');
    }

    // Limpieza al desmontar el componente
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [serverIp, serverPort, pin, connectionStatus, setStatus, setTelemetryData, setError]);
}
