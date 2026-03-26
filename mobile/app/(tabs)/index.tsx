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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * Datos de conexión (Mock)
   */
  const CONNECTION_DATA: ConnectionSession = {
    ip: '192.168.1.15',
    port: 42424,
    pin: '424242',
    status: 'CONNECTED',
  };

  /**
   * Mapeo de estados de conexión a variantes de color
   */
  const STATUS_VARIANTS: Record<ConnectionStatus, any> = {
    CONNECTED: 'success',
    ERROR: 'error',
    CONNECTING: 'warning',
    RECONNECTING: 'primary',
    DISCONNECTED: 'secondary',
  };

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    NavigationBar.setVisibilityAsync('hidden');
  }, []);

  return (
    <ThemedView className="flex-1 p-4">
      <StatusBar hidden />

      {/* --- HEADER PRINCIPAL --- */}
      <ThemedView
        variant="transparent"
        className="mb-10 flex-row items-center justify-between"
      >
        {/* Lado Izquierdo: Branding & Info */}
        <ThemedView
          variant="transparent"
          className="flex-row items-center gap-4"
        >
          <ThemedButton
            size="icon"
            variant="ghost"
            onPress={() => setIsMenuOpen(true)}
          >
            <ThemedIcon name="menu-outline" size={32} variant="primary" />
          </ThemedButton>

          <ThemedView variant="transparent">
            <ThemedText type="logo" variant="primary">
              TruckPadDeck
            </ThemedText>
            <ThemedText type="semibold" variant="muted">
              Dashboard • {CONNECTION_DATA.ip}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Lado Derecho: Estado de Conexión */}
        <ThemedView variant="transparent" className="items-end">
          <ThemedView
            variant="transparent"
            className="flex-row items-center gap-2"
          >
            <ThemedText
              type="semibold"
              className="text-[10px] uppercase tracking-widest"
            >
              {CONNECTION_DATA.status}
            </ThemedText>
            <ThemedIcon
              name={
                CONNECTION_DATA.status === 'CONNECTED' ? 'wifi' : 'wifi-outline'
              }
              size={28}
              variant={STATUS_VARIANTS[CONNECTION_DATA.status]}
              className={
                CONNECTION_DATA.status === 'RECONNECTING' ? 'animate-pulse' : ''
              }
            />
          </ThemedView>
          <ThemedText type="caption" variant="muted" className="mt-1">
            • PORT: {CONNECTION_DATA.port} • PIN: {CONNECTION_DATA.pin}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* --- MENU LATERAL (MODAL) --- */}
      <Modal
        visible={isMenuOpen}
        statusBarTranslucent
        transparent
        animationType="fade"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <ThemedView
          variant="card"
          className="h-full w-80 shadow-2xl px-6 flex-col justify-between"
        >
          <ThemedView variant="transparent">
            {/* Header del Menu */}
            <ThemedView
              variant="transparent"
              className="flex-row justify-between mt-20 mb-10 items-center"
            >
              <ThemedText type="title">Menu</ThemedText>
              <ThemedButton
                size="icon"
                variant="ghost"
                onPress={() => setIsMenuOpen(false)}
              >
                <ThemedIcon
                  name="chevron-back-outline"
                  size={28}
                  variant="primary"
                />
              </ThemedButton>
            </ThemedView>

            {/* Opciones del Menu */}
            {[
              {icon: 'library-outline', label: 'Library'},
              {icon: 'bug-outline', label: 'Debugging'},
              {icon: 'settings-outline', label: 'Settings'},
            ].map((item) => (
              <ThemedButton
                key={item.label}
                variant="outline"
                className="flex-row mb-4 gap-4 justify-start p-4"
                onPress={() => {}}
              >
                <ThemedIcon
                  name={item.icon as any}
                  size={24}
                  variant="secondary"
                />
                <ThemedText type="subtitle">{item.label}</ThemedText>
              </ThemedButton>
            ))}
          </ThemedView>

          {/* Footer del Menu */}
          <ThemedView
            variant="transparent"
            className="mb-6 items-center py-4 border-t border-light-border dark:border-dark-border"
          >
            <ThemedText type="caption" variant="muted">
              TruckPadDeck v{Constants.expoConfig?.version || '0.1.0-beta'}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </Modal>

      {/* --- EL CONTENIDO DEL DASHBOARD IRÁ AQUÍ --- */}
    </ThemedView>
  );
};

export default HomeScreen;
