import {ThemedText, ThemedView} from '@/components/themed';
import Constants from 'expo-constants';
import React from 'react';

/**
 * SidebarFooter - Información de versión y branding en la parte inferior.
 */
export const SidebarFooter = () => {
  const version = Constants.expoConfig?.version;

  return (
    <ThemedView variant="transparent" className="items-center opacity-40">
      <ThemedText type="caption">
        {version ? `v${version}` : 'v--'}
      </ThemedText>
    </ThemedView>
  );
};
