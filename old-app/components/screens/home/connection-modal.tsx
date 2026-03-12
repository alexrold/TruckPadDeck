import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, FlatList, TextInput, ActivityIndicator, View } from 'react-native';
import { ThemedView } from '../../theme/themed-view';
import { ThemedText } from '../../theme/themed-text';
import { useStore } from '../../../store/use-store';
import { Colors } from '../../../constants/theme';
import { useColorScheme } from '../../../hooks/use-color-scheme';

/**
 * Modal de conexión para TruckPadDeck.
 * Permite descubrir servidores en la red local e introducir el PIN de seguridad.
 */
export function ConnectionModal() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  
  // Estado del Store
  const discoveredServers = useStore((state) => state.discoveredServers);
  const isScanning = useStore((state) => state.isScanning);
  const status = useStore((state) => state.status);
  const authStatus = useStore((state) => state.authStatus);
  const setServerIp = useStore((state) => state.setServerIp);
  const setServerPort = useStore((state) => state.setServerPort);
  const setServerPin = useStore((state) => state.setServerPin);

  // Estado local del Modal
  const [selectedServer, setSelectedServer] = useState<{ip: string, name: string, port: number} | null>(null);
  const [isManual, setIsManual] = useState(false);
  const [manualIp, setManualIp] = useState('');
  const [pin, setPin] = useState('');

  const isConnected = status === 'connected' || status === 'waiting_for_game';
  const showModal = !isConnected;

  const handleConnect = () => {
    const targetIp = isManual ? manualIp : selectedServer?.ip;
    const targetPort = isManual ? 42424 : (selectedServer?.port ?? 42424);
    
    if (targetIp && pin.length === 6) {
      setServerIp(targetIp);
      setServerPort(targetPort);
      setServerPin(pin);
    }
  };

  const renderServerItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.serverItem, { backgroundColor: themeColors.tabIconDefault + '20' }]}
      onPress={() => {
        setSelectedServer({ ip: item.ip, name: item.serverName, port: item.port });
        setIsManual(false);
      }}
    >
      <ThemedText type="defaultSemiBold">🖥️ {item.serverName}</ThemedText>
      <ThemedText type="small" style={{ opacity: 0.7 }}>{item.ip}:{item.port}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <Modal visible={showModal} animationType="slide" transparent={true}>
      <ThemedView style={styles.overlay}>
        <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
          <ThemedText type="title" style={styles.title}>🚛 TruckPadDeck</ThemedText>
          
          {(selectedServer || isManual) ? (
            <View style={styles.authSection}>
              <ThemedText type="defaultSemiBold">
                {isManual ? 'Conexión Manual' : `Conectando a ${selectedServer?.name}`}
              </ThemedText>
              
              {isManual && (
                <TextInput
                  style={[styles.ipInput, { color: themeColors.text, borderColor: themeColors.tint }]}
                  value={manualIp}
                  onChangeText={setManualIp}
                  placeholder="IP del PC (ej: 192.168.1.50)"
                  placeholderTextColor="#999"
                  autoFocus
                />
              )}

              <ThemedText style={styles.subtitle}>Introduce el PIN de 6 dígitos que ves en tu PC:</ThemedText>
              
              <TextInput
                style={[styles.pinInput, { color: themeColors.text, borderColor: themeColors.tint }]}
                value={pin}
                onChangeText={setPin}
                placeholder="000000"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={6}
                autoFocus={!isManual}
              />

              {authStatus === 'denied' && (
                <ThemedText style={styles.errorText}>❌ PIN incorrecto. Inténtalo de nuevo.</ThemedText>
              )}

              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={() => { setSelectedServer(null); setIsManual(false); setPin(''); }}
                >
                  <ThemedText style={{ color: '#fff' }}>Atrás</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.connectButton, { backgroundColor: themeColors.tint }]} 
                  onPress={handleConnect}
                  disabled={pin.length !== 6 || (isManual && !manualIp)}
                >
                  {status === 'connecting' ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <ThemedText style={{ color: '#fff' }}>Conectar</ThemedText>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.discoverySection}>
              <ThemedText style={styles.subtitle}>Buscando servidores en tu red local...</ThemedText>
              
              <FlatList
                data={discoveredServers}
                renderItem={renderServerItem}
                keyExtractor={(item) => item.ip}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color={themeColors.tint} />
                    <ThemedText style={styles.emptyText}>
                      Asegúrate de que el servidor esté abierto en tu PC y de que ambos dispositivos se encuentren en la misma red.
                    </ThemedText>
                    
                    <TouchableOpacity 
                      style={[styles.manualButton, { borderColor: themeColors.tint }]}
                      onPress={() => setIsManual(true)}
                    >
                      <ThemedText style={{ color: themeColors.tint }}>⌨️ Introducir IP manualmente</ThemedText>
                    </TouchableOpacity>
                  </View>
                }
                style={styles.list}
              />
              
              {isScanning && (
                <ThemedText type="small" style={styles.scanningBadge}>📡 Escaneando...</ThemedText>
              )}
            </View>
          )}
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  discoverySection: {
    width: '100%',
  },
  list: {
    maxHeight: 300,
    marginVertical: 10,
  },
  serverItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 15,
    textAlign: 'center',
    opacity: 0.6,
    marginBottom: 20,
  },
  manualButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  scanningBadge: {
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.5,
  },
  authSection: {
    alignItems: 'center',
    width: '100%',
  },
  ipInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    marginVertical: 15,
  },
  pinInput: {
    width: '100%',
    height: 60,
    borderWidth: 2,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 8,
    marginVertical: 15,
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    flex: 0.45,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  connectButton: {
    // Background dinámico
  },
});
