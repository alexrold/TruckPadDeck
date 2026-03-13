import { View, Text } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Container } from '@/components/layout/Container';

/**
 * Pantalla de Detalles (Placeholder).
 * 
 * Ejemplo de navegación secundaria dentro de la arquitectura modular.
 */
export default function Details() {
  const { name } = useLocalSearchParams();

  return (
    <Container>
      <Stack.Screen options={{ title: 'Detalles del Camión', headerShown: true }} />
      <View className="flex-1 items-center justify-center bg-slate-900 p-6">
        <Text className="text-white text-2xl font-bold mb-4">
          Detalles para: {name}
        </Text>
        <Text className="text-slate-400 text-center">
          Esta sección mostrará información extendida de la carga y el camión en futuras versiones.
        </Text>
      </View>
    </Container>
  );
}
