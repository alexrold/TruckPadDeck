import {ThemedButton, ThemedCard, ThemedIcon, ThemedText, ThemedView} from '@/components/themed';
import {DASHBOARD_DATA_TYPE} from '@/constants/DashboardDataSeed';
import {DEFAULT_DASHBOARD_IMAGE} from '@/constants/defaultDashboardImage';
import { useRouter } from 'expo-router';
import React from 'react';
import {Image, Pressable, View} from 'react-native';

interface DashboardCardProps {
  item: DASHBOARD_DATA_TYPE & {empty?: boolean};
}

/**
 * DashboardCard - Representación visual de un dashboard en la biblioteca.
 * 
 * LÓGICA DE NAVEGACIÓN:
 * Al pulsar la tarjeta, se utiliza 'router.push' para navegar a la ruta 
 * dinámica del dashboard seleccionado, inyectando su ID único.
 */
export const DashboardCard = ({item}: DashboardCardProps) => {
  const router = useRouter();

  // Si es un elemento de relleno para la grilla, renderizamos un espacio invisible
  if (item.empty) {
    return <View className="flex-1 m-2 h-72 bg-transparent" />;
  }

  const imageSource = item.image ? {uri: item.image} : null;

  const handleNavigate = () => {
    router.push({
      pathname: '/dashboard/[id]',
      params: { id: item.id }
    });
  };

  return (
    <Pressable onPress={handleNavigate} className="flex-1">
      <ThemedCard className="flex-1 m-2 p-0 overflow-hidden border-none shadow-sm h-72">
        <ThemedView className="h-32 bg-light-muted/20 dark:bg-dark-muted/10 items-center justify-center relative">
          {imageSource ? (
            <Image
              source={imageSource}
              className="w-full h-full object-cover"
              resizeMode="cover"
            />
          ) : (
            <Image
              source={DEFAULT_DASHBOARD_IMAGE}
              className="w-full h-full object-cover"
              resizeMode="cover"
            />
          )}

          <ThemedView
            variant="transparent"
            className="absolute top-2 left-2 px-2 py-0.5 bg-light-primary/90 dark:bg-dark-primary/90 rounded-md"
          >
            <ThemedText className="text-[9px] font-bold text-white uppercase">
              {item.game}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView variant="transparent" className="p-4 flex-1 justify-between">
          <ThemedView variant="transparent">
            <ThemedText
              type="caption"
              variant="muted"
              className="uppercase text-[10px] tracking-tighter"
            >
              {item.brand}
            </ThemedText>
            <ThemedText
              type="subtitle"
              variant="default"
              className="text-sm"
              numberOfLines={1}
            >
              {item.title}
            </ThemedText>
            <ThemedView
              variant="transparent"
              className="flex-row gap-0.5 items-center mt-1"
            >
              <ThemedIcon name="star" size={12} variant="warning" />
              <ThemedText type="caption" variant="muted">
                ({item.rating.toFixed(1)})
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView
            variant="transparent"
            className="flex-row items-center justify-between mt-2"
          >
            <ThemedIcon
              name={
                item.orientation === 'landscape'
                  ? 'tablet-landscape-outline'
                  : 'tablet-portrait-outline'
              }
              size={14}
              variant="muted"
            />
            <ThemedButton
              size="sm"
              variant="primary"
              className="border-light-border/20 dark:border-dark-border/20"
              onPress={handleNavigate}
            >
              + Detalles
            </ThemedButton>
          </ThemedView>
        </ThemedView>
      </ThemedCard>
    </Pressable>
  );
};
