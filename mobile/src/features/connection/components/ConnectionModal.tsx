import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useTelemetryStore } from '@/store/telemetry-store';
import { useDiscovery } from '../hooks/use-discovery';
import { useTelemetrySocket } from '../hooks/use-telemetry-socket';

export const ConnectionModal: React.FC = () => {
  const { 
    connectionStatus, 
    serverIp, 
    serverPort, 
    error, 
    setPin, 
    reset 
  } = useTelemetryStore();

  useDiscovery();
  useTelemetrySocket();

  const [inputPin, setInputPin] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (connectionStatus === 'connected') {
      const timer = setTimeout(() => setIsVisible(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [connectionStatus]);

  const handleConnect = () => {
    if (inputPin.length === 4) {
      setPin(inputPin);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View className="flex-1 justify-center items-center bg-black/60 px-6">
        <View className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl">
          
          <View className="items-center mb-6">
            <Text className="text-2xl font-bold text-slate-800">TruckPadDeck</Text>
            <Text className="text-slate-500 mt-1">Enlace de Telemetría</Text>
          </View>

          {connectionStatus === 'discovering' && !serverIp && (
            <View className="items-center py-4">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="text-slate-600 mt-4 text-center">Buscando servidor...</Text>
            </View>
          )}

          {serverIp && (connectionStatus === 'idle' || connectionStatus === 'discovering' || connectionStatus === 'error') && (
            <View>
              <View className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100">
                <Text className="text-blue-900 font-mono text-center">{serverIp}:{serverPort}</Text>
              </View>
              <TextInput
                className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-center text-2xl font-bold tracking-[10px] text-slate-800 mb-4"
                placeholder="0000"
                keyboardType="number-pad"
                maxLength={4}
                value={inputPin}
                onChangeText={setInputPin}
              />
              <TouchableOpacity 
                onPress={handleConnect}
                disabled={inputPin.length !== 4}
                className={`py-4 rounded-xl ${inputPin.length === 4 ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <Text className="text-white text-center font-bold text-lg">Vincular</Text>
              </TouchableOpacity>
            </View>
          )}

          {(connectionStatus === 'connecting' || connectionStatus === 'authenticating') && (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="text-slate-600 mt-4 font-medium">Validando seguridad...</Text>
            </View>
          )}

          {connectionStatus === 'connected' && (
            <View className="items-center py-8">
              <View className="bg-green-100 p-4 rounded-full mb-4">
                <Text className="text-3xl">🚛</Text>
              </View>
              <Text className="text-green-700 font-bold text-xl text-center">¡Conexión Exitosa!</Text>
            </View>
          )}

          {error && (
            <View className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
              <Text className="text-red-700 text-sm text-center font-medium">{error}</Text>
              <TouchableOpacity onPress={reset} className="mt-2">
                <Text className="text-red-600 text-xs text-center font-bold uppercase underline">Reintentar</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </View>
    </Modal>
  );
};
