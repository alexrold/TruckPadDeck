import {ThemedView} from '@/components/themed';
import {dashboardDataSeed} from '@/constants/DashboardDataSeed';
import React from 'react';
import {DashboardSearch} from './DashboardSearch';
import {QuickAccess} from './QuickAccess';

interface LibraryHeaderProps {
  isVisible: boolean;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  resultsCount: number;
}

/**
 * LibraryHeader - Wrapper funcional para la sección superior de la biblioteca.
 * Coordina el buscador y los accesos rápidos, inyectando metadatos de resultados.
 */
export const LibraryHeader = ({
  isVisible,
  searchQuery,
  onSearchChange,
  resultsCount,
}: LibraryHeaderProps) => {
  if (!isVisible) return null;

  return (
    <ThemedView variant="transparent">
      <DashboardSearch
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        resultsCount={resultsCount}
      />
      <QuickAccess data={dashboardDataSeed.slice(0, 5)} />
    </ThemedView>
  );
};
