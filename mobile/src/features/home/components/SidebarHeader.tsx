import {ThemedButton, ThemedIcon, ThemedText, ThemedView} from '@/components/themed';
import React from 'react';

interface SidebarHeaderProps {
  onClose: () => void;
}

/**
 * SidebarHeader - Título y controles superiores del menú lateral.
 */
export const SidebarHeader = ({onClose}: SidebarHeaderProps) => {
  return (
    <ThemedView
      variant="transparent"
      className="flex-row justify-between items-center mb-10"
    >
      <ThemedText type="title">Menu</ThemedText>
      <ThemedButton size="icon" variant="ghost" onPress={onClose}>
        <ThemedIcon name="chevron-back-outline" size={24} variant="primary" />
      </ThemedButton>
    </ThemedView>
  );
};
