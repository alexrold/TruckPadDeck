import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import {useEffect} from 'react';
import 'react-native-reanimated';
import '../global.css';

import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';
import {ArchivoBlack_400Regular} from '@expo-google-fonts/archivo-black';
import {Barlow_600SemiBold} from '@expo-google-fonts/barlow';
import {ChakraPetch_700Bold} from '@expo-google-fonts/chakra-petch';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';

import {useHardwareManager} from '../src/hooks/useHardwareManager';
import {useTelemetryConnection} from '../src/hooks/useTelemetryConnection';

export {ErrorBoundary} from 'expo-router';

// Evita que el splash screen se oculte antes de cargar recursos críticos
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Activación del motor de telemetría global
  useTelemetryConnection();

  // Gestión global de recursos de hardware (Pantalla/Sensores)
  useHardwareManager();

  /**
   * Carga de tipografías personalizadas utilizando Expo Google Fonts.
   */
  const [loaded, error] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    ArchivoBlack_400Regular,
    Barlow_600SemiBold,
    ChakraPetch_700Bold,
  });

  // Gestión de errores y ocultamiento del Splash
  useEffect(() => {
    if (error) throw error;
    if (loaded) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded) return null;

  /**
   * Construcción del tema de navegación.
   * Fusionamos los colores base de React Navigation con la paleta de TruckPadDeck
   * para que toda la infraestructura de navegación sea coherente.
   */
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      ...Colors[colorScheme ?? 'light'],
    },
  };

  /**
   * Estructura de navegación principal.
   * - El Stack Navigator envuelve toda la aplicación, permitiendo transiciones fluidas entre pantallas.
   * - La pantalla "(tabs)" es el punto de entrada a la navegación principal basada en pestañas.
   * - La pantalla "+not-found" se muestra para rutas no definidas, con un encabezado visible para facilitar la navegación de regreso.
   */

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" options={{headerShown: true}} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
