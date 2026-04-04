import {
  ThemedButton,
  ThemedIcon,
  ThemedText,
  ThemedView,
} from '@/components/themed';
import {useConnectionStore} from '@store/index';
import React from 'react';

/**
 * ConnectionStatus - Indicador interactivo del estado del enlace.
 * Diseñado como un "Status Pill" para maximizar la visibilidad.
 * Actúa como punto de entrada al ConnectionModal.
 */
export const ConnectionStatus = () => {
  const port = useConnectionStore((state) => state.port);
  const pin = useConnectionStore((state) => state.pin);
  const status = useConnectionStore((state) => state.status);
  const setModalOpen = useConnectionStore((state) => state.setModalOpen);

  const isConnected = status === 'CONNECTED';

  return (
    <ThemedButton onPress={() => setModalOpen(true)}>
      <ThemedView
        variant="transparent"
        // Estética de "Píldora": fondo sutil, bordes redondeados y padding táctil.
        className="flex-row items-center gap-4 px-4 py-2 rounded-2xl border border-light-border/50 dark:border-dark-border/50 bg-light-muted/5 dark:bg-dark-muted/10"
      >
        <ThemedView variant="transparent" className="items-end">
          <ThemedView
            variant="transparent"
            className="flex-row items-center gap-2"
          >
            <ThemedText
              type="semibold"
              className="text-[10px] uppercase tracking-widest leading-tight"
            >
              {status}
            </ThemedText>
            <ThemedIcon
              name="wifi"
              size={20}
              variant={isConnected ? 'success' : 'muted'}
            />
          </ThemedView>

          {isConnected && (
            <ThemedText type="caption" variant="muted" className="text-[9px]">
              {port} • PIN:{pin}
            </ThemedText>
          )}
        </ThemedView>

        {/* Icono de indicación de interactividad (Affordance) */}
        <ThemedIcon
          name="chevron-forward"
          size={16}
          variant="muted"
          className="opacity-50"
        />
      </ThemedView>
    </ThemedButton>
  );
};
