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
 * Implementa 'ListEmptyComponent' para manejar estados sin resultados.
 * Añade lógica de 'Placeholders' para mantener la integridad de la cuadrícula
 * cuando el número de elementos no es múltiplo de las columnas.
 */
export const DashboardGrid = ({numColumns, data}: DashboardGridProps) => {
  /**
   * Formatea los datos para que siempre sean múltiplo del número de columnas,
   * evitando que los elementos de la última fila se estiren (flex-grow).
   */
  const formatData = (dataList: DASHBOARD_DATA_TYPE[], columns: number) => {
    const fullRows = Math.floor(dataList.length / columns);
    let lastRowElements = dataList.length - fullRows * columns;

    const formattedData = [...dataList];
    while (lastRowElements !== columns && lastRowElements !== 0) {
      formattedData.push({
        id: `blank-${lastRowElements}`,
        empty: true,
      } as any);
      lastRowElements++;
    }

    return formattedData;
  };

  return (
    <FlatList
      key={numColumns}
      data={formatData(data, numColumns)}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => <DashboardCard item={item} />}
      ListEmptyComponent={<DashboardEmptyState />}
      numColumns={numColumns}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}
    />
  );
};
