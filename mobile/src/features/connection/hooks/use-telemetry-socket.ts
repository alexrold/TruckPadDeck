import { useEffect, useRef } from 'react';
import { useTelemetryStore, TelemetryData } from '@/store/telemetry-store';

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
    if (!serverIp || !serverPort || !pin) return;
    if (connectionStatus === 'connected' || connectionStatus === 'authenticating' || connectionStatus === 'connecting') return;

    const socketUrl = `ws://${serverIp}:${serverPort}`;

    try {
      setStatus('connecting');
      const ws = new WebSocket(socketUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setStatus('authenticating');
        ws.send(JSON.stringify({ type: 'auth', pin: pin }));
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.status === 'auth_ok') {
            setStatus('connected');
            return;
          }
          if (payload.status === 'auth_failed') {
            setError('PIN de seguridad incorrecto.');
            ws.close();
            return;
          }
          if (payload.status === 'connected' && payload.truck) {
            setTelemetryData(payload as TelemetryData);
          }
        } catch (err) {
          console.error('[WebSocket] Error al procesar mensaje:', err);
        }
      };

      ws.onerror = () => {
        setError('No se pudo establecer conexión con el servidor.');
      };

      ws.onclose = () => {
        if (connectionStatus !== 'error') {
          setStatus('idle');
        }
      };

    } catch (err) {
      setStatus('error');
      setError('Fallo interno al crear el socket.');
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [serverIp, serverPort, pin, connectionStatus, setStatus, setTelemetryData, setError]);
}
