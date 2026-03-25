import {
  ThemedButton,
  ThemedIcon,
  ThemedText,
  ThemedView,
} from '@/components/themed';
import Constants from 'expo-constants';
import * as NavigationBar from 'expo-navigation-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {Modal} from 'react-native';

type ConnectionStatus =
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'RECONNECTING'
  | 'ERROR';

interface ConnectionSession {
  ip: string;
  port: number;
  pin: string;
  status: ConnectionStatus;
}

const HomeScreen = () => {
  // estado del menu lateral
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * Persistencia temporal de la sesión del servidor.
   * TODO: Sincronizar con servicios de red (UDP/WS).
   */
  const CONNECTION_DATA: ConnectionSession = {
    ip: '192.168.1.15',
    port: 42424,
    pin: '424242',
    status: 'CONNECTED',
  };

  /**
   * colores para cada estado de la conexión
   */
  const STATUS_COLORS: Record<ConnectionStatus, string> = {
    CONNECTED: 'text-light-success dark:text-dark-success',
    ERROR: 'text-light-error dark:text-dark-error',
    CONNECTING: 'text-light-warning dark:text-dark-warning opacity-80',
    RECONNECTING: 'text-light-primary dark:text-dark-primary animate-pulse',
    DISCONNECTED: 'text-light-secondary dark:text-dark-secondary opacity-50',
  };

  /**
   * Configuración de la interface
   * Oculta elementos del sistema y coloca la interface
   * en modo LANDSCAPE
   */
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    NavigationBar.setVisibilityAsync('hidden');
  }, []);

  return (
    <ThemedView className="flex-1 p-4">
      <StatusBar hidden />

      {/* Header */}
      <ThemedView className="mb-10 bg-transparent">
        {/* Header BarMenu - justify-between empuja el status a la derecha */}
        <ThemedView className="flex-row items-center justify-between bg-transparent">
          {/* LADO IZQUIERDO: Menu + Títulos */}
          <ThemedView className="flex-row items-center gap-4 bg-transparent">
            {/* Botón del menu */}
            <ThemedButton
              onPress={() => setIsMenuOpen(true)}
              className="active:opacity-50"
            >
              <ThemedIcon
                name={'menu-outline'}
                size={32}
                className="text-light-primary dark:text-dark-primary"
              />
            </ThemedButton>

            {/* Header title */}
            <ThemedView className="bg-transparent">
              <ThemedText
                type="logo"
                className="text-light-primary dark:text-dark-primary"
              >
                TruckPadDeck
              </ThemedText>
              <ThemedText type="semibold" className="opacity-80">
                Dashboard • {CONNECTION_DATA.ip}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Header connection status */}
          <ThemedView className="items-end bg-transparent ml-auto">
            {/* Status e Icono en fila superior */}
            <ThemedView className="flex-row items-center gap-2 bg-transparent">
              <ThemedText
                type="semibold"
                className="text-[10px] uppercase tracking-widest leading-tight"
              >
                {CONNECTION_DATA.status}
              </ThemedText>

              <ThemedIcon
                name={
                  CONNECTION_DATA.status === 'CONNECTED'
                    ? 'wifi'
                    : 'wifi-outline'
                }
                size={28}
                className={STATUS_COLORS[CONNECTION_DATA.status]}
              />
            </ThemedView>

            {/* Datos técnicos en fila inferior (debajo del icono) */}
            <ThemedText
              type="caption"
              className="opacity-50 mt-1 text-light-muted dark:text-dark-muted"
            >
              • PORT: {CONNECTION_DATA.port} • PIN: {CONNECTION_DATA.pin}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Navegación lateral */}
      <Modal
        visible={isMenuOpen}
        statusBarTranslucent={true}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <ThemedView className="h-full w-80 shadow-2xl px-6 bg-light-card dark:bg-dark-card flex-col justify-between">
          <ThemedView className="bg-transparent">
            {/* Header menu */}
            <ThemedView className="flex-row justify-between mt-20 mb-10 items-center my-12 bg-transparent dark:bg-transparent">
              <ThemedText type="title">Menu</ThemedText>
              <ThemedButton
                onPress={() => setIsMenuOpen(false)}
                className="flex-row"
              >
                <ThemedIcon
                  name="chevron-back-outline"
                  size={28}
                  className="text-light-primary dark:text-dark-primary"
                />
              </ThemedButton>
            </ThemedView>

            {/* Items menu library */}
            <ThemedButton
              onPress={() => {}}
              className="flex-row mb-4 gap-4 bg-light-background/50 dark:bg-dark-background/50 p-3 rounded-xl"
            >
              <ThemedIcon
                name={'library-outline'}
                size={24}
                className="text-light-secondary dark:text-dark-secondary"
              />
              <ThemedText type="subtitle">Library</ThemedText>
            </ThemedButton>

            {/* Items menu Debugging */}
            <ThemedButton
              onPress={() => {}}
              className="flex-row mb-4 gap-4 bg-light-background/50 dark:bg-dark-background/50 p-3 rounded-xl"
            >
              <ThemedIcon
                name={'bug-outline'}
                size={24}
                className="text-light-secondary dark:text-dark-secondary"
              />
              <ThemedText type="subtitle">Debugging</ThemedText>
            </ThemedButton>

            {/* Items menu Settings */}
            <ThemedButton
              onPress={() => {}}
              className="flex-row mb-4 gap-4 bg-light-background/50 dark:bg-dark-background/50 p-3 rounded-xl"
            >
              <ThemedIcon
                name={'settings-outline'}
                size={24}
                className="text-light-secondary dark:text-dark-secondary"
              />
              <ThemedText type="subtitle">Settings</ThemedText>
            </ThemedButton>
          </ThemedView>

          {/* Footer menu */}
          <ThemedView className="mb-6 items-center py-4 bg-transparent border-t border-light-border dark:border-dark-border">
            <ThemedText type="caption">
              TruckPadDeck v{Constants.expoConfig?.version || '0.1.0-beta'}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
};

export default HomeScreen;
