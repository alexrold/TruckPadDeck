import {ThemedText, ThemedTextInput, ThemedView} from '@/components/themed';
import React from 'react';

interface DashboardSearchProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  resultsCount: number;
}

/**
 * DashboardSearch - Cabecera con buscador e indicadores de estado de búsqueda.
 * Proporciona feedback inmediato "in-place" para evitar que el teclado
 * oculte estados críticos de la UI (como el EmptyState de la lista).
 */
export const DashboardSearch = ({
  searchQuery,
  onSearchChange,
  resultsCount,
}: DashboardSearchProps) => {
  const hasNoResults = searchQuery.length > 0 && resultsCount === 0;

  return (
    <ThemedView
      variant="transparent"
      className="flex-row items-start justify-between mb-6"
    >
      <ThemedView variant="transparent">
        <ThemedText type="title">Library</ThemedText>
        <ThemedText type="caption" variant="muted">
          Search for your favorite truck dashboard
        </ThemedText>
      </ThemedView>

      <ThemedView variant="transparent" className="items-end gap-1">
        <ThemedTextInput
          placeholder="Search brand or model..."
          className="w-80 h-11 bg-white border-light-border dark:bg-dark-card/60 dark:border-white/20"
          value={searchQuery}
          onChangeText={onSearchChange}
        />

        {/* Feedback inmediato debajo del input para evitar oclusión por teclado */}
        {hasNoResults && (
          <ThemedText 
            variant="error"
            className="text-[10px] font-bold uppercase tracking-tighter mr-2"
          >
            No hay coincidencias para {searchQuery}
          </ThemedText>
        )}
      </ThemedView>
    </ThemedView>
  );
};
