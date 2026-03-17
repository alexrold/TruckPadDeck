import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { Container } from '@/components/layout/Container';

// TODO: SIENDO UNA APP MOVIL, ¿ES NECESARIO TENER UNA PANTALLA DE ERROR PARA RUTAS NO ENCONTRADAS?
/**
 * Pantalla de Error (Ruta No Encontrada).
 *
 * Se muestra cuando se intenta acceder a una ruta inexistente en Expo Router.
 */
export default function NotFoundScreen() {
  return (
    <Container>
      <Stack.Screen options={{ title: 'Oops!', headerShown: true }} />
      <View className="flex-1 items-center justify-center bg-slate-900 p-6">
        <Text className="mb-4 text-4xl font-black text-white">404</Text>
        <Text className="mb-8 text-center text-lg text-slate-400">
          Esta ruta no existe en TruckPadDeck.
        </Text>
        <Link href="/" className="rounded-xl bg-blue-600 px-8 py-4 shadow-lg">
          <Text className="text-lg font-bold text-white">Volver al Inicio</Text>
        </Link>
      </View>
    </Container>
  );
}
