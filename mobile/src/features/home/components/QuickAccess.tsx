import {ThemedButton, ThemedIcon, ThemedText, ThemedView} from '@/components/themed';
import {DASHBOARD_DATA_TYPE} from '@/constants/DashboardDataSeed';
import {useTranslation} from '@/src/hooks/useTranslation';
import React from 'react';
import {FlatList} from 'react-native';

interface QuickAccessProps {
  data: DASHBOARD_DATA_TYPE[];
}

/**
 * QuickAccess - Lista horizontal de accesos rápidos a dashboards favoritos.
 */
export const QuickAccess = ({data}: QuickAccessProps) => {
  const {home} = useTranslation();

  return (
    <ThemedView variant="transparent" className="mb-8">
      <ThemedText type="semibold" className="mb-3 opacity-60">
        {home.quick_access}
      </ThemedText>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => `fav-${item.id}`}
        renderItem={({item}) => (
          <ThemedButton
            variant="outline"
            className="mr-3 px-4 py-2 flex-row gap-2 border-light-primary/10"
          >
            <ThemedIcon name="heart" size={14} variant="error" />
            <ThemedText type="caption">{item.title}</ThemedText>
          </ThemedButton>
        )}
      />
    </ThemedView>
  );
};
