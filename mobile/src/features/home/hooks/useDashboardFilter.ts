import {useMemo} from 'react';
import {DASHBOARD_DATA_TYPE} from '@/constants/DashboardDataSeed';

/**
 * useDashboardFilter - Lógica de filtrado de colecciones de dashboards.
 * Implementa filtrado por aproximación (case-insensitive) sobre 'title' y 'brand'.
 * Utiliza memoización para evitar recalcular filtros en re-renders triviales del padre.
 */
export const useDashboardFilter = (
  data: DASHBOARD_DATA_TYPE[],
  query: string,
) => {
  return useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    
    if (!normalizedQuery) return data;

    return data.filter(
      (dash) =>
        dash.title.toLowerCase().includes(normalizedQuery) ||
        dash.brand.toLowerCase().includes(normalizedQuery),
    );
  }, [data, query]);
};
