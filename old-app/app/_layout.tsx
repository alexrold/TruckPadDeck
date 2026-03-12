import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '../hooks/use-color-scheme';
import { useSCSTelemetry } from '../hooks/use-scs-telemetry';

/**
 * Configuración de navegación por defecto.
 */
export const unstable_settings = {
  anchor: '(tabs)',
};

/**
 * Layout raíz de la aplicación TruckPadDeck.
 * 
 * Este componente es el orquestador principal de la aplicación. Se encarga de:
 * 1. Definir el tema visual (Claro/Oscuro).
 * 2. Gestionar la pila de navegación de Expo Router.
 * 3. Inicializar el hook de telemetría global para mantener la conexión
 *    WebSocket persistente durante toda la sesión.
 * 
 * @returns Estructura básica de la aplicación con navegación y telemetría activa.
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();

  /** 
   * Inicializamos la telemetría a nivel raíz.
   * Esto garantiza que la conexión con el servidor de SCS se mantenga activa 
   * sin importar a qué pantalla navegue el usuario.
   */
  useSCSTelemetry();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Pantalla principal que cargará el dashboard seleccionado */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
