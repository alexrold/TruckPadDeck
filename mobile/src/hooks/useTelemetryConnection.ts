import {useEffect, useRef} from 'react';
import {useConnectionStore, useTelemetryStore} from '@store/index';

/**
 * useTelemetryConnection - Hook para la gestión del ciclo de vida del enlace de datos.
 * Orquesta la conexión WebSocket, el Handshake de seguridad y la persistencia de la sesión.
 */
export const useTelemetryConnection = () => {
  const {ip, port, pin, status, setStatus, setModalOpen} = useConnectionStore();
  const {setTelemetryData, resetTelemetry} = useTelemetryStore();
  
  // Referencias persistentes para el control del Socket y el estado de la conexión
  const socketRef = useRef<WebSocket | null>(null);
  const statusRef = useRef(status);

  // Sincronización de referencia con el estado global de conexión
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    /**
     * Inicializa la instancia del WebSocket y define los controladores de eventos.
     * Implementa el protocolo de autenticación (Handshake) post-apertura.
     */
    const connect = () => {
      if (socketRef.current || !ip || !port || !pin) return;

      const wsUrl = `ws://${ip}:${port}`;
      console.log(`[WS] Connection attempt: ${wsUrl}`);
      
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log('[WS] Socket open. Initiating Handshake...');
        // Transmisión del Payload de autenticación según requerimientos del servidor
        ws.send(JSON.stringify({ type: 'auth', pin }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Procesamiento de respuestas de autenticación
          if (data.status === 'auth_ok') {
            console.log('[WS] Handshake successful.');
            setStatus('CONNECTED');
            setModalOpen(false);
            return;
          }

          if (data.status === 'auth_failed') {
            console.error('[WS] Auth failed: Invalid PIN.');
            socketRef.current = null; // Previene que onclose sobrescriba el estado de error
            setStatus('ERROR');
            ws.close();
            return;
          }

          // Ingesta de ráfagas de telemetría y estados del servidor
          if (data.status === 'connected' || data.truck || data.status === 'waiting_for_game') {
            setTelemetryData(data);
          }
        } catch (e) {
          console.error('[WS] Data parsing error:', e);
        }
      };

      ws.onerror = (e) => {
        console.error('[WS] Socket error.');
        setStatus('ERROR');
      };

      ws.onclose = () => {
        console.log('[WS] Socket closed.');
        socketRef.current = null;
        
        // Disparador de reconexión automática si el cierre no fue manual
        if (statusRef.current === 'CONNECTED') {
          setStatus('RECONNECTING');
        } else if (statusRef.current === 'CONNECTING') {
          setStatus('ERROR');
        }
      };
    };

    // --- Disparadores de Conexión/Desconexión ---
    if (status === 'CONNECTING' && !socketRef.current) {
      connect();
    }

    if (status === 'DISCONNECTED' && socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      resetTelemetry();
    }

    // Cleanup al desmontar el componente (RootLayout)
    return () => {
      // No cerramos aquí si el estado es CONNECTED para permitir persistencia
      // a menos que el componente se destruya totalmente.
    };
  }, [status, ip, port, pin, setStatus, setTelemetryData, resetTelemetry, setModalOpen]);

  // Manejador de reconexión
  useEffect(() => {
    if (status === 'RECONNECTING') {
      const timer = setTimeout(() => setStatus('CONNECTING'), 3000);
      return () => clearTimeout(timer);
    }
  }, [status, setStatus]);
};
