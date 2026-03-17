import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

import { ConnectionModal } from '@/features/connection/components/ConnectionModal';
import { useTelemetryStore } from '@/store/telemetry-store';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Pantalla Principal de TruckPadDeck.
 *
 * Orquestador inicial de la aplicación.
 */
export default function Home() {
  const { connectionStatus, data } = useTelemetryStore();

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Módulo de Red y Seguridad */}
      <ConnectionModal />

      {/* TODO:
        - ACTUALMENTE, ESTE ES UN COMPONENTE DE PRUEBA PARA MOSTRAR LA TELEMETRÍA EN TIEMPO REAL. SE DEBE REEMPLAZAR POR UN DASHBOARD DE L APLICACIÓN QUE DE ACCESO A LA PAGINA DE DEBUGGING CONFIGURACIONES DE LA APLICACIÓN. INFORMATION DEL USUARIO ...  */}

      {/* Placeholder de Telemetría Real */}
      <View className="flex-1 items-center justify-center p-6">
        {connectionStatus === 'connected' ? (
          <View className="items-center">
            <Text className="mb-2 text-8xl font-black text-blue-400">{data?.truck.speed || 0}</Text>
            <Text className="text-xl font-bold uppercase tracking-widest text-slate-400">Km/h</Text>
            <View className="mt-8 rounded-2xl border border-slate-700 bg-slate-800 p-4">
              <Text className="text-center font-mono text-slate-300">
                Juego: {data?.config.game} | Camión: {data?.job.truck_name || 'Desconocido'}
              </Text>
            </View>
          </View>
        ) : (
          <View className="items-center">
            <Text className="italic text-slate-600">Esperando telemetría activa...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
