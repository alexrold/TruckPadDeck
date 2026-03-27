import {ThemedView} from '@/components/themed';
import {dashboardDataSeed} from '@/constants/DashboardDataSeed';
import {StatusBar} from 'expo-status-bar';
import React, {useState} from 'react';

// Feature Components & Hooks (Vía Archivos de Barril)
import {
  DashboardGrid,
  HomeHeader,
  LibraryHeader,
  Sidebar,
} from '@features/home/components';
import {
  useDashboardFilter,
  useDashboardLayout,
  useDashboardSearch,
  useHomeShell,
} from '@features/home/hooks';

// Configuración técnica de dimensiones del Shell
const SIDEBAR_WIDTH = 300;
const CARD_MIN_WIDTH = 280;

/**
 * HomeScreen - Orquestador principal del Shell de la Aplicación.
 * Su única responsabilidad es coordinar los hooks de lógica con los
 * componentes visuales de alto nivel.
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
    </ThemedView>
  );
};

export default HomeScreen;
