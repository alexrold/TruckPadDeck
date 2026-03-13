import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { Container } from '@/components/layout/Container';

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
        <Text className="text-white text-4xl font-black mb-4">404</Text>
        <Text className="text-slate-400 text-lg text-center mb-8">
          Esta ruta no existe en TruckPadDeck.
        </Text>
        <Link href="/" className="bg-blue-600 px-8 py-4 rounded-xl shadow-lg">
          <Text className="text-white font-bold text-lg">Volver al Inicio</Text>
        </Link>
      </View>
    </Container>
  );
}
