import {useEffect} from 'react';
import dgram from 'react-native-udp';
import {useStore} from '../store/use-store';

/**
 * Hook para el descubrimiento automático del servidor de TruckPadDeck en la red local.
 * Escucha paquetes UDP Broadcast enviados por el servidor (Beacon).
 */
export function useServerDiscovery() {
  const setIsScanning = useStore((state) => state.setIsScanning);
  const setDiscoveredServers = useStore((state) => state.setDiscoveredServers);

  useEffect(() => {
    let socket: any = null;
    const discoveryPort = 5555;

    try {
      socket = dgram.createSocket({type: 'udp4'});
      if (!socket) throw new Error('UDP socket is null');
    } catch (e) {
      console.warn(
        '⚠️ UDP no soportado en este entorno (Expo Go). El autodescubrimiento no funcionará.',
      );
      setIsScanning(false);
      return;
    }

    socket.on('message', (msg: any, rinfo: any) => {
      try {
        const data = JSON.parse(msg.toString());

        // Validar si el mensaje proviene de un servidor TruckPadDeck
        if (data.type === 'truckpaddeck_discovery') {
          const newServer = {
            ip: data.ip,
            port: data.port,
            serverName: data.server_name,
            lastSeen: Date.now(),
          };

          // Actualizar la lista de servidores utilizando el estado anterior para evitar stale closures
          setDiscoveredServers((prev) => {
            const exists = prev.some((s) => s.ip === newServer.ip);
            if (!exists) {
              return [...prev, newServer];
            }
            // Si ya existe, solo actualizamos los datos dinámicos si han cambiado
            return prev.map((s) =>
              s.ip === newServer.ip
                ? { ...s, lastSeen: Date.now(), port: newServer.port, serverName: newServer.serverName }
                : s
            );
          });
        }
      } catch (err) {
        console.warn('⚠️ Error parseando paquete de descubrimiento UDP:', err);
      }
    });

    socket.on('error', (err) => {
      console.error('❌ Error en el socket de descubrimiento UDP:', err);
      setIsScanning(false);
    });

    socket.on('listening', () => {
      console.log(
        `📡 Escuchando descubrimiento UDP en el puerto ${discoveryPort}`,
      );
      setIsScanning(true);
    });

    // Iniciar el socket
    try {
      socket.bind(discoveryPort);
    } catch (bindErr) {
      console.error(
        '❌ No se pudo bindear el puerto de descubrimiento:',
        bindErr,
      );
    }

    // Limpiar al desmontar
    return () => {
      if (socket) {
        socket.close();
      }
      setIsScanning(false);
    };
  }, [setDiscoveredServers, setIsScanning]);
}
