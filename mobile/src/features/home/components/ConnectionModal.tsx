import {
  ThemedButton,
  ThemedIcon,
  ThemedText,
  ThemedTextInput,
  ThemedView,
} from '@/components/themed';
import {useConnectionStore} from '@store/index';
import React, {useState} from 'react';
import {Modal, Pressable} from 'react-native';

/**
 * ConnectionModal - Centro de control para el enlace PC-App.
 * Gestiona los flujos de Service Discovery automático, entrada de PIN (Handshake)
 * y configuración manual de parámetros de red (IP/Port Fallback).
 */
export const ConnectionModal = () => {
  const {ip, port, status, isModalOpen, setModalOpen, setConnection, setStatus} =
    useConnectionStore();

  const [manualMode, setManualMode] = useState(false);
  const [inputIp, setInputIp] = useState(ip);
  const [inputPort, setInputPort] = useState(port.toString());
  const [pin, setPin] = useState('');

  const handleManualSave = () => {
    setConnection({
      ip: inputIp,
      port: parseInt(inputPort) || 0,
      pin: '------',
    });
    setManualMode(false);
  };

  const handleClose = () => {
    setModalOpen(false);
    setManualMode(false);
  };

  // UI Helper: Renderiza el estado de búsqueda o el formulario de PIN
  const renderPairingContent = () => {
    if (manualMode) {
      return (
        <ThemedView variant="transparent" className="gap-4 w-full">
          <ThemedText type="subtitle">Configuración Manual</ThemedText>
          <ThemedTextInput
            placeholder="Dirección IP (ej. 192.168.1.15)"
            value={inputIp}
            onChangeText={setInputIp}
          />
          <ThemedTextInput
            placeholder="Puerto (ej. 42424)"
            keyboardType="numeric"
            value={inputPort}
            onChangeText={setInputPort}
          />
          <ThemedButton variant="primary" onPress={handleManualSave}>
            Aplicar Configuración
          </ThemedButton>
          <ThemedButton variant="ghost" onPress={() => setManualMode(false)}>
            Volver al Discovery
          </ThemedButton>
        </ThemedView>
      );
    }

    const isSearching = ip === '---';

    return (
      <ThemedView variant="transparent" className="items-center w-full gap-6">
        {isSearching ? (
          <>
            <ThemedIcon
              name="radio-outline"
              size={48}
              variant="primary"
              className="animate-pulse"
            />
            <ThemedText type="subtitle" className="text-center">
              Escaneando red local...
            </ThemedText>
            <ThemedText type="caption" variant="muted" className="text-center">
              Asegúrate de que el servidor de TruckPadDeck esté abierto en tu PC.
            </ThemedText>
          </>
        ) : (
          <>
            <ThemedView variant="transparent" className="items-center gap-2">
              <ThemedText type="subtitle">Servidor Encontrado</ThemedText>
              <ThemedText type="caption" variant="primary">
                {ip}:{port}
              </ThemedText>
            </ThemedView>

            <ThemedTextInput
              placeholder="Introduce el PIN de 6 dígitos"
              maxLength={6}
              keyboardType="numeric"
              className="w-full text-center text-2xl tracking-[10px] font-bold h-16"
              value={pin}
              onChangeText={setPin}
            />

            <ThemedButton
              variant="primary"
              className="w-full"
              onPress={() => setStatus('CONNECTED')}
              disabled={pin.length < 6}
            >
              Vincular Dispositivo
            </ThemedButton>
          </>
        )}

        <ThemedButton
          variant="ghost"
          className="mt-4"
          onPress={() => setManualMode(true)}
        >
          Usar IP Manual
        </ThemedButton>
      </ThemedView>
    );
  };

  return (
    <Modal
      visible={isModalOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable
        className="flex-1 bg-black/60 items-center justify-center p-6"
        onPress={handleClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()} // Evita cerrar el modal al tocar dentro
          className="w-[450px]"
        >
          <ThemedView
            variant="card"
            className="p-8 rounded-3xl border border-light-border dark:border-dark-border shadow-2xl"
          >
            {/* Header del Modal */}
            <ThemedView
              variant="transparent"
              className="flex-row justify-between items-center mb-8"
            >
              <ThemedView variant="transparent" className="flex-row items-center gap-3">
                <ThemedIcon name="wifi" size={24} variant="primary" />
                <ThemedText type="title">Conexión</ThemedText>
              </ThemedView>
              <ThemedButton size="icon" variant="ghost" onPress={handleClose}>
                <ThemedIcon name="close" size={24} variant="muted" />
              </ThemedButton>
            </ThemedView>

            {renderPairingContent()}
          </ThemedView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
