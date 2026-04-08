import React, {useState} from 'react';
import {Image, Modal} from 'react-native';
import {ThemedView, ThemedButton, ThemedIcon} from '@/components/themed';
import {DEFAULT_DASHBOARD_IMAGE} from '@/constants/defaultDashboardImage';

interface DashboardHeroProps {
  image: any;
  onBack: () => void;
}

/**
 * DashboardHero - Cabecera visual interactiva.
 * Maneja la previsualización de la imagen y el modal de expansión (Lightbox).
 */
export const DashboardHero = ({image, onBack}: DashboardHeroProps) => {
  const [isImageOpen, setIsImageOpen] = useState(false);

  return (
    <>
      {/* Modal de Imagen Ampliada (Lightbox) */}
      <Modal visible={isImageOpen} transparent animationType="fade">
        <ThemedButton
          variant="ghost"
          className="flex-1 bg-black/95 items-center justify-center p-0 rounded-none"
          onPress={() => setIsImageOpen(false)}
        >
          <Image
            source={image || DEFAULT_DASHBOARD_IMAGE}
            className="w-full h-full"
            resizeMode="contain"
          />
          <ThemedView variant="transparent" className="absolute top-12 right-6">
            <ThemedIcon name="close" size={32} color="white" />
          </ThemedView>
        </ThemedButton>
      </Modal>

      {/* Sección Hero con Controles */}
      <ThemedView
        variant="transparent"
        className="w-full h-80 relative bg-light-muted/5 dark:bg-black/40"
      >
        <ThemedButton
          variant="ghost"
          onPress={() => setIsImageOpen(true)}
          className="flex-1 p-0 rounded-none overflow-hidden"
        >
          <Image
            source={image || DEFAULT_DASHBOARD_IMAGE}
            className="w-full h-full opacity-90"
            resizeMode="cover"
          />
        </ThemedButton>

        {/* Botón de Retroceso Flotante */}
        <ThemedView
          variant="transparent"
          className="absolute bottom-6 left-6 z-10"
        >
          <ThemedButton
            variant="ghost"
            size="icon"
            onPress={onBack}
            className="bg-black/40 rounded-2xl w-14 h-14"
          >
            <ThemedIcon name="arrow-back" size={28} color="white" />
          </ThemedButton>
        </ThemedView>

        {/* Indicador de Expansión */}
        <ThemedView
          variant="transparent"
          className="absolute bottom-6 right-6 z-10 pointer-events-none"
        >
          <ThemedView
            variant="transparent"
            className="bg-black/30 p-3 rounded-2xl"
          >
            <ThemedIcon name="expand" size={24} color="white" />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </>
  );
};
