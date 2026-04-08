import {ThemedButton, ThemedIcon, ThemedText, ThemedView} from '@/components/themed';
import {useConnectionStore} from '@store/index';
import React from 'react';

interface HomeBrandingProps {
  isMenuOpen: boolean;
  onOpenMenu: () => void;
}

/**
 * HomeBranding - Componente de identidad y navegación principal.
 * Inyección de dependencias de red mediante suscripción selectiva al store 
 * para optimizar re-renders. Implementa visualización condicional basada 
 * en el estado de la sesión activa.
 */
export const HomeBranding = ({
  isMenuOpen,
  onOpenMenu,
}: HomeBrandingProps) => {
  // Suscripción atómica a propiedades primitivas para evitar bucles de renderizado.
  const ip = useConnectionStore((state) => state.ip);
  const status = useConnectionStore((state) => state.status);

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
          Dashboard • {status === 'CONNECTED' ? ip : status}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};
