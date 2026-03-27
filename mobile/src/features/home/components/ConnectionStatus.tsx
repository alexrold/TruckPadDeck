import {ThemedIcon, ThemedText, ThemedView} from '@/components/themed';
import React from 'react';

/**
 * ConnectionStatus - Lado derecho de la cabecera: Estado técnico del enlace.
 * Actualmente usa datos mockeados, próximamente conectados a Zustand.
 */
export const ConnectionStatus = () => {
  // Mock data - Futuro: const { status, port, pin } = useConnectionStore();
  const CONNECTION_DATA = {
    port: 42424,
    pin: '424242',
    status: 'CONNECTED',
  };

  return (
    <ThemedView variant="transparent" className="items-end">
      <ThemedView variant="transparent" className="flex-row items-center gap-2">
        <ThemedText
          type="semibold"
          className="text-[10px] uppercase tracking-widest leading-tight"
        >
          {CONNECTION_DATA.status}
        </ThemedText>
        <ThemedIcon name="wifi" size={28} variant="success" />
      </ThemedView>
      <ThemedText type="caption" variant="muted" className="mt-1">
        • PORT: {CONNECTION_DATA.port} • PIN: {CONNECTION_DATA.pin}
      </ThemedText>
    </ThemedView>
  );
};
