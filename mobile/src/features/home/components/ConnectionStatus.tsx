import {ThemedIcon, ThemedText, ThemedView} from '@/components/themed';
import {useConnectionStore} from '@store/index';
import React from 'react';

/**
 * ConnectionStatus - Indicador reactivo del enlace técnico.
 * Encapsula la lógica visual de la sesión de streaming. Oculta metadatos 
 * sensibles de red (Port/PIN) durante estados de inactividad o búsqueda (Discovery).
 */
export const ConnectionStatus = () => {
  // Consumo reactivo de estado global mediante suscripción selectiva. 
  const port = useConnectionStore((state) => state.port);
  const pin = useConnectionStore((state) => state.pin);
  const status = useConnectionStore((state) => state.status);

  const isConnected = status === 'CONNECTED';

  return (
    <ThemedView variant="transparent" className="items-end">
      <ThemedView variant="transparent" className="flex-row items-center gap-2">
        <ThemedText
          type="semibold"
          className="text-[10px] uppercase tracking-widest leading-tight"
        >
          {status}
        </ThemedText>
        <ThemedIcon 
          name="wifi" 
          size={28} 
          variant={isConnected ? 'success' : 'muted'} 
        />
      </ThemedView>

      {/* Visualización condicional de parámetros de enlace técnico */}
      {isConnected && (
        <ThemedText type="caption" variant="muted" className="mt-1">
          • PORT: {port} • PIN: {pin}
        </ThemedText>
      )}
    </ThemedView>
  );
};
