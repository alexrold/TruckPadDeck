import { View } from 'react-native';
import ScreenHome from '../components/screens/home';
import { ConnectionModal } from '../components/screens/home/connection-modal';
import { useServerDiscovery } from '../hooks/use-server-discovery';
import { useSCSTelemetry } from '../hooks/use-scs-telemetry';

/**
 * Pantalla principal de la aplicación (Home).
 * 
 * Orquestador central que inicia el descubrimiento de servidores
 * y gestiona la conexión WebSocket de telemetría.
 * 
 * @returns El componente del dashboard principal con el modal de conexión.
 */
export default function Page() {
  // Iniciar descubrimiento de servidores UDP
  useServerDiscovery();

  return (
    <View style={{ flex: 1 }}>
      <ScreenHome />
      <ConnectionModal />
    </View>
  );
}
