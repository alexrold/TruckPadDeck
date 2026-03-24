import {
  ThemedButton,
  ThemedIcon,
  ThemedText,
  ThemedView,
} from '@/components/themed';
import * as NavigationBar from 'expo-navigation-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {Modal} from 'react-native';

const CONNECTION_DATA = {
  ip: '192.168.1.15',
  port: '42424',
  pin: '424242',
};

const HomeScreen = () => {
  // estado del menu lateral
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * Configuración de la interface
   *  Oculta elementos del sistema y coloca la interface
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
      <ThemedView className="mb-10 bg-light-background dark:bg-dark-background">
        {/* Header BarMenu */}
        <ThemedView className="flex-row items-center bg-light-background">
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
            <ThemedText type="semibold">
              Dashboard • {CONNECTION_DATA.ip}
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
              className="flex-row mb-4 gap-4 bg-light-background/50 dark:bg-dark-background/50"
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
              className="flex-row mb-4 gap-4 bg-light-background/50 dark:bg-dark-background/50"
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
              className="flex-row mb-4 gap-4 bg-light-background/50 dark:bg-dark-background/50"
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
          <ThemedView className="mb-6 place-items-end  pt-4 bg-transparent">
            <ThemedText type="caption">TruckPadDeck v1.0.0</ThemedText>
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
};

export default HomeScreen;
