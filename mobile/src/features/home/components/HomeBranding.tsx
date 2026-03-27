import {ThemedButton, ThemedIcon, ThemedText, ThemedView} from '@/components/themed';
import React from 'react';

interface HomeBrandingProps {
  isMenuOpen: boolean;
  onOpenMenu: () => void;
}

/**
 * HomeBranding - Lado izquierdo de la cabecera: Logo y navegación.
 * Actualmente usa datos mockeados, próximamente conectados a Zustand.
 */
export const HomeBranding = ({
  isMenuOpen,
  onOpenMenu,
}: HomeBrandingProps) => {
  // Mock data - Futuro: const { ip } = useConnectionStore();
  const CONNECTION_DATA = {
    ip: '192.168.1.15',
  };

  return (
    <ThemedView variant="transparent" className="flex-row items-center gap-4">
      {!isMenuOpen && (
        <ThemedButton size="icon" variant="ghost" onPress={onOpenMenu}>
          <ThemedIcon name="menu-outline" size={32} variant="primary" />
        </ThemedButton>
      )}
      <ThemedView variant="transparent">
        <ThemedText type="logo" variant="primary">
          TruckPadDeck
        </ThemedText>
        <ThemedText type="semibold" variant="muted">
          Dashboard • {CONNECTION_DATA.ip}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};
