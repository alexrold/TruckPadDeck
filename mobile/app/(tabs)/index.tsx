import {ThemedView} from '@/components/themed';
import {StatusBar} from 'expo-status-bar';
import React, {useState, useMemo} from 'react';
import {dashboardDataSeed} from '@/constants/DashboardDataSeed';
import {useUIStore} from '@/src/store/useUIStore';
import {useFavoriteStore} from '@/src/store/useFavoriteStore';
import {useDownloadStore} from '@/src/store/useDownloadStore';

// Feature Components & Hooks
import {
  Sidebar,
  HomeHeader,
  LibraryHeader,
  DashboardGrid,
  ConnectionModal,
} from '@features/home/components';
import {
  useDashboardSearch,
  useDashboardFilter,
  useDashboardLayout,
  useHomeShell,
} from '@features/home/hooks';

const SIDEBAR_WIDTH = 300;
const CARD_MIN_WIDTH = 280;

/**
 * HomeScreen - Orquestador principal del Shell de la Aplicación.
 */
const HomeScreen = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {viewMode} = useUIStore();
  const {favoriteIds} = useFavoriteStore();
  const {downloadedIds} = useDownloadStore();

  useHomeShell();

  // Filtrado de favoritos: Solo si están marcados Y descargados
  const baseData = useMemo(() => {
    if (viewMode === 'favorites') {
      return dashboardDataSeed.filter(
        (item) => favoriteIds.includes(item.id) && downloadedIds.includes(item.id)
      );
    }
    return dashboardDataSeed;
  }, [viewMode, favoriteIds, downloadedIds]);

  const {searchQuery, setSearchQuery} = useDashboardSearch();
  const filteredDashboards = useDashboardFilter(baseData, searchQuery);
  const numColumns = useDashboardLayout(
    isMenuOpen,
    SIDEBAR_WIDTH,
    CARD_MIN_WIDTH,
  );

  return (
    <ThemedView className="flex-1 flex-row">
      <StatusBar hidden />

      <Sidebar
        width={SIDEBAR_WIDTH}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <ThemedView variant="transparent" className="flex-1 p-6">
        <HomeHeader
          isMenuOpen={isMenuOpen}
          onOpenMenu={() => setIsMenuOpen(true)}
        />

        <LibraryHeader
          isVisible={!isMenuOpen}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultsCount={filteredDashboards.length}
          showQuickAccess={viewMode !== 'favorites'} // Ocultar si estamos filtrando
        />

        <DashboardGrid numColumns={numColumns} data={filteredDashboards} />
      </ThemedView>

      <ConnectionModal />
    </ThemedView>
  );
};

export default HomeScreen;
