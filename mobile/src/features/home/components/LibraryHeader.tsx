import {ThemedView} from '@/components/themed';
import {dashboardDataSeed} from '@/constants/DashboardDataSeed';
import {useFavoriteStore} from '@/src/store/useFavoriteStore';
import {useDownloadStore} from '@/src/store/useDownloadStore';
import React, { useMemo } from 'react';
import {DashboardSearch} from './DashboardSearch';
import {QuickAccess} from './QuickAccess';

interface LibraryHeaderProps {
  isVisible: boolean;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  resultsCount: number;
  showQuickAccess?: boolean;
}

/**
 * LibraryHeader - Orquestador de la sección superior de la biblioteca.
 * 
 * LÓGICA DE FILTRADO:
 * El 'Acceso Rápido' solo muestra elementos que el usuario ha marcado como 
 * FAVORITOS y que además están DESCARGADOS en el dispositivo. Esto asegura 
 * que la acción de lanzamiento sea inmediata.
 */
export const LibraryHeader = ({
  isVisible,
  searchQuery,
  onSearchChange,
  resultsCount,
  showQuickAccess = true,
}: LibraryHeaderProps) => {
  const { favoriteIds } = useFavoriteStore();
  const { downloadedIds } = useDownloadStore();

  // Intersección entre Favoritos e Instalados
  const quickAccessData = useMemo(() => {
    return dashboardDataSeed.filter(item => 
      favoriteIds.includes(item.id) && downloadedIds.includes(item.id)
    );
  }, [favoriteIds, downloadedIds]);

  if (!isVisible) return null;

  return (
    <ThemedView variant="transparent">
      <DashboardSearch
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        resultsCount={resultsCount}
      />
      {showQuickAccess && quickAccessData.length > 0 && (
        <QuickAccess data={quickAccessData} />
      )}
    </ThemedView>
  );
};



