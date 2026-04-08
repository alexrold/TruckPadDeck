import {
  ThemedButton,
  ThemedIcon,
  ThemedText,
  ThemedTextInput,
  ThemedView,
} from '@/components/themed';
import {useConnectionStore} from '@store/index';
import {useLocalIp} from '../../../hooks/useLocalIp';

import {useTranslation} from '@/src/hooks/useTranslation';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Modal, Pressable} from 'react-native';

/**
 * ConnectionModal - Gestor de interfaz para el enlace PC-Móvil.
 * Orquesta los flujos de Discovery automático, configuración manual e ingreso de PIN.
 */
export const ConnectionModal = () => {
  const {
    ip,
    port,
    status,
    isModalOpen,
    setModalOpen,
    setConnection,
    setStatus,
  } = useConnectionStore();
  const {connection, common} = useTranslation();

  // Detector de Network Prefix para optimización de entrada manual
  useLocalIp();

  const [manualMode, setManualMode] = useState(false);
  const [inputIp, setInputIp] = useState(ip);
  const [inputPort, setInputPort] = useState(port.toString());
  const [pin, setPin] = useState('');

  // Sincronización del estado local con el store (Discovery/Network Prefix)
  useEffect(() => {
    setInputIp(ip);
    setInputPort(port.toString());
  }, [ip, port]);

  /**
   * Aplicación de máscara dinámica para direcciones IPv4.
   * Facilita la entrada de datos agregando delimitadores automáticamente.
   */
  const handleIpChange = (text: string) => {
    let cleaned = text.replace(/[^0-9.]/g, '');
    cleaned = cleaned.replace(/\.\./g, '.');
    const segments = cleaned.split('.');
    if (segments.length <= 4) {
      const lastSegment = segments[segments.length - 1];
      if (
        lastSegment.length === 3 &&
        segments.length < 4 &&
        !text.endsWith('.')
      ) {
        cleaned += '.';
      }
    }
    setInputIp(cleaned);
  };

  /**
   * Persistencia de parámetros de red configurados manualmente.
   */
  const handleManualSave = () => {
    setConnection({
      ip: inputIp,
      port: parseInt(inputPort) || 42424,
      pin: '',
    });
    setManualMode(false);
  };

  /**
   * Reseteo de estados de error al modificar el PIN.
   */
  const handlePinChange = (text: string) => {
    if (status === 'ERROR') setStatus('DISCONNECTED');
    setPin(text);
  };

  /**
   * Inicia el proceso de Handshake disparando el estado CONNECTING.
   */
  const handleConnect = () => {
    if (pin.length < 6) {
      setStatus('ERROR');
      return;
    }
    setConnection({ip: inputIp, port: parseInt(inputPort), pin});
    setStatus('CONNECTING');
  };

  const renderContent = () => {
    // --- VISTA: SESIÓN ACTIVA (Ciclo de vida conectado) ---
    if (status === 'CONNECTED') {
      return (
        <ThemedView
          variant="transparent"
          className="items-center w-full gap-6 py-4"
        >
          <ThemedView variant="transparent" className="items-center gap-2">
            <ThemedIcon name="checkmark-circle" size={64} color="#10B981" />
            <ThemedText type="subtitle" className="text-green-500 font-bold">
              {connection.session_linked}
            </ThemedText>
          </ThemedView>

          <ThemedView
            variant="card"
            className="w-full p-4 border border-green-500/20 bg-green-500/5 items-center gap-1"
          >
            <ThemedText type="caption" variant="muted">
              {connection.established_at}
            </ThemedText>
            <ThemedText type="subtitle" className="font-bold">
              {ip}:{port}
            </ThemedText>
          </ThemedView>

          <ThemedView variant="transparent" className="w-full gap-3 mt-4">
            <ThemedButton
              variant="primary"
              className="w-full"
              onPress={() => setModalOpen(false)}
            >
              {connection.back_to_dashboard}
            </ThemedButton>

            <ThemedButton
              variant="ghost"
              className="w-full"
              onPress={() => {
                setStatus('DISCONNECTED');
                setPin('');
              }}
            >
              {connection.disconnect_server}
            </ThemedButton>
          </ThemedView>
        </ThemedView>
      );
    }

    // --- VISTA: MODO MANUAL (Override de Discovery) ---
    if (manualMode) {
      return (
        <ThemedView variant="transparent" className="gap-6 w-full">
          <ThemedText type="subtitle">{connection.manual_config}</ThemedText>

          <ThemedView variant="transparent" className="gap-4">
            <ThemedView variant="transparent" className="gap-2">
              <ThemedText type="caption" className="font-bold">
                {connection.ip_address}
              </ThemedText>
              <ThemedTextInput
                placeholder="192.168.1.15"
                value={inputIp}
                onChangeText={handleIpChange}
                keyboardType="numeric"
              />
            </ThemedView>

            <ThemedView variant="transparent" className="gap-2">
              <ThemedText type="caption" className="font-bold">
                {connection.port}
              </ThemedText>
              <ThemedTextInput
                placeholder="42424"
                value={inputPort}
                onChangeText={setInputPort}
                keyboardType="numeric"
              />
              <ThemedText type="caption" variant="muted" className="italic">
                {connection.port_note}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView variant="transparent" className="gap-2">
            <ThemedButton variant="primary" onPress={handleManualSave}>
              {connection.save_and_pin}
            </ThemedButton>
            <ThemedButton variant="ghost" onPress={() => setManualMode(false)}>
              {common.cancel}
            </ThemedButton>
          </ThemedView>
        </ThemedView>
      );
    }

    // --- VISTA: MODO AUTOMÁTICO (UDP Discovery) ---
    const isServerFound = ip !== '' && !ip.endsWith('.');

    return (
      <ThemedView variant="transparent" className="items-center w-full gap-6">
        <ThemedView
          variant="transparent"
          className="flex-row items-center gap-3 bg-primary/10 p-3 rounded-lg w-full"
        >
          <ThemedIcon
            name="information-circle-outline"
            size={18}
            variant="primary"
          />
          <ThemedText type="caption" className="flex-1 text-primary">
            {connection.same_network_hint}
          </ThemedText>
        </ThemedView>

        {!isServerFound ? (
          <ThemedView variant="transparent" className="items-center gap-4 py-4">
            <ActivityIndicator size="large" color="#FF5500" />
            <ThemedText type="subtitle">
              {connection.discovery_active}
            </ThemedText>
          </ThemedView>
        ) : (
          <ThemedView
            variant="transparent"
            className="items-center gap-4 w-full"
          >
            <ThemedView variant="transparent" className="items-center">
              <ThemedText type="caption" variant="muted">
                {connection.server_detected}
              </ThemedText>
              <ThemedText type="subtitle" variant="primary">
                {ip}:{port}
              </ThemedText>
            </ThemedView>

            <ThemedView variant="transparent" className="w-full gap-3">
              <ThemedText type="caption" className="text-center font-bold">
                {connection.enter_pin}
              </ThemedText>

              <ThemedTextInput
                placeholder=""
                maxLength={6}
                keyboardType="numeric"
                className={`text-center text-3xl font-bold tracking-[15px] h-20 border-2 bg-black/20 dark:bg-black/40 ${
                  status === 'ERROR'
                    ? 'border-red-500'
                    : 'border-light-border dark:border-white/10'
                }`}
                value={pin}
                onChangeText={handlePinChange}
              />

              {status === 'ERROR' && (
                <ThemedView
                  variant="transparent"
                  className="flex-row items-center justify-center gap-2"
                >
                  <ThemedIcon name="alert-circle" size={16} color="#EF4444" />
                  <ThemedText type="caption" className="text-red-500 font-bold">
                    {pin.length < 6
                      ? connection.pin_length_error
                      : connection.auth_failed}
                  </ThemedText>
                </ThemedView>
              )}
            </ThemedView>

            <ThemedButton
              variant="primary"
              className="w-full"
              onPress={handleConnect}
              disabled={status === 'CONNECTING'}
            >
              {status === 'CONNECTING'
                ? connection.establishing_link
                : connection.link_device}
            </ThemedButton>
          </ThemedView>
        )}

        <ThemedButton
          variant="ghost"
          className="mt-2"
          onPress={() => setManualMode(true)}
        >
          {isServerFound
            ? connection.modify_address
            : connection.config_manual_ip}
        </ThemedButton>
      </ThemedView>
    );
  };

  return (
    <Modal visible={isModalOpen} transparent animationType="fade">
      <Pressable
        className="flex-1 bg-black/60 items-center justify-center p-6"
        onPress={() => setModalOpen(false)}
      >
        <Pressable onPress={(e) => e.stopPropagation()} className="w-[450px]">
          <ThemedView
            variant="card"
            className="p-8 rounded-3xl border border-light-border dark:border-dark-border shadow-2xl"
          >
            <ThemedView
              variant="transparent"
              className="flex-row justify-between items-center mb-6"
            >
              <ThemedView
                variant="transparent"
                className="flex-row items-center gap-2"
              >
                <ThemedIcon name="wifi" size={24} variant="primary" />
                <ThemedText type="title">{connection.modal_title}</ThemedText>
              </ThemedView>
              <ThemedButton
                size="icon"
                variant="ghost"
                onPress={() => setModalOpen(false)}
              >
                <ThemedIcon name="close" size={24} variant="muted" />
              </ThemedButton>
            </ThemedView>
            {renderContent()}
          </ThemedView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
