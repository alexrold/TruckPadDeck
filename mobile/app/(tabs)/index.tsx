import {ThemedView} from '@/components/themed';
import {StatusBar} from 'expo-status-bar';
import React, {useState} from 'react';
import {dashboardDataSeed} from '@/constants/DashboardDataSeed';

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
  /**
   * Estado de visibilidad del Shell lateral.
   * Iniciamos en 'false' para maximizar el área útil del Viewport en el arranque.
   */
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Inicialización de efectos de sistema (Native configuration)
  useHomeShell();

  // Composición de lógica de negocio y layout
  const {searchQuery, setSearchQuery} = useDashboardSearch();
  const filteredDashboards = useDashboardFilter(dashboardDataSeed, searchQuery);
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
        />

        <DashboardGrid numColumns={numColumns} data={filteredDashboards} />
      </ThemedView>

      <ConnectionModal />
    </ThemedView>
  );
};

export default HomeScreen;
