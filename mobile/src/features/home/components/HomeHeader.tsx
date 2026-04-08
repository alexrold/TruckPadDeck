import {ThemedView} from '@/components/themed';
import React from 'react';
import {ConnectionStatus} from './ConnectionStatus';
import {HomeBranding} from './HomeBranding';

interface HomeHeaderProps {
  isMenuOpen: boolean;
  onOpenMenu: () => void;
}

/**
 * HomeHeader - Orquestador de la parte superior de la Home.
 */
export const HomeHeader = ({
  isMenuOpen,
  onOpenMenu,
}: HomeHeaderProps) => {
  return (
    <ThemedView
      variant="transparent"
      className="flex-row items-center justify-between mb-8"
    >
      <HomeBranding
        isMenuOpen={isMenuOpen}
        onOpenMenu={onOpenMenu}
      />
      <ConnectionStatus />
    </ThemedView>
  );
};
