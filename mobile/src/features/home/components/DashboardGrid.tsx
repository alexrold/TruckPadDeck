import {DASHBOARD_DATA_TYPE} from '@/constants/DashboardDataSeed';
import React from 'react';
import {FlatList} from 'react-native';
import {DashboardCard} from './DashboardCard';
import {DashboardEmptyState} from './DashboardEmptyState';

interface DashboardGridProps {
  numColumns: number;
  data: DASHBOARD_DATA_TYPE[];
}

/**
 * DashboardGrid - Grilla principal de la biblioteca de dashboards.
 * Implementa 'ListEmptyComponent' para manejar estados sin resultados de forma nativa.
 */
export const DashboardGrid = ({numColumns, data}: DashboardGridProps) => {
  return (
    <FlatList
      key={numColumns}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => <DashboardCard item={item} />}
      ListEmptyComponent={<DashboardEmptyState />}
      numColumns={numColumns}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}
    />
  );
};
