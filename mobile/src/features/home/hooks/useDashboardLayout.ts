import {useMemo} from 'react';
import {useWindowDimensions} from 'react-native';

/**
 * useDashboardLayout - Gestión reactiva del layout de la grilla.
 * Calcula el número óptimo de columnas basándose en el ancho del Viewport
 * y el estado del Sidebar para evitar overflow y asegurar legibilidad.
 */
export const useDashboardLayout = (
  isMenuOpen: boolean,
  sidebarWidth: number,
  cardMinWidth: number,
) => {
  const {width: windowWidth} = useWindowDimensions();

  return useMemo(() => {
    // Calculo del área útil descontando el sidebar si está activo.
    const availableWidth = isMenuOpen
      ? windowWidth - sidebarWidth
      : windowWidth;
    
    // Algoritmo de grid fluido basado en ancho mínimo de card.
    const cols = Math.floor(availableWidth / cardMinWidth);
    return cols > 0 ? cols : 1;
  }, [windowWidth, isMenuOpen, sidebarWidth, cardMinWidth]);
};
