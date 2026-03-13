import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ContainerProps {
  children: React.ReactNode;
}

/**
 * Contenedor de Estructura (Layout).
 *
 * Envuelve el contenido de las pantallas en un área segura (SafeArea)
 * y proporciona una base de color coherente para todo el proyecto.
 */
export const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 px-4">{children}</View>
    </SafeAreaView>
  );
};
