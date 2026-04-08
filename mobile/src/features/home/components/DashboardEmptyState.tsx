import {ThemedIcon, ThemedText, ThemedView} from '@/components/themed';
import React from 'react';

/**
 * DashboardEmptyState - Vista de fallback para la biblioteca.
 * Se activa cuando el filtrado por búsqueda no retorna resultados, 
 * evitando una UI vacía que pueda interpretarse como un fallo del sistema.
 */
export const DashboardEmptyState = () => {
  return (
    <ThemedView
      variant="transparent"
      className="flex-1 items-center justify-center py-20 opacity-40"
    >
      <ThemedIcon name="search-outline" size={64} variant="muted" />
      <ThemedText type="subtitle" variant="muted" className="mt-4">
        No se encontraron dashboards
      </ThemedText>
      <ThemedText type="caption" variant="muted" className="mt-1">
        Prueba con otra marca o modelo de camión
      </ThemedText>
    </ThemedView>
  );
};
