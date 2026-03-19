import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
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

export {ErrorBoundary} from 'expo-router';

// Bloquea el ocultamiento automático del Splash Screen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Carga de fuentes
  const [loaded, error] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    ArchivoBlack_400Regular,
    Barlow_600SemiBold,
    ChakraPetch_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
    if (loaded) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded) return null;

  // Configuración de temas mínimos para React Navigation 7
  const customTheme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      ...Colors[colorScheme ?? 'light'],
      notification: Colors[colorScheme ?? 'light'].accent,
    },
  };

  return (
    <ThemeProvider value={customTheme}>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" options={{headerShown: true}} />
      </Stack>
    </ThemeProvider>
  );
}
