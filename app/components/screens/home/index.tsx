import React from 'react';
import { View, Text } from 'react-native';
import { useStore } from '../../../store/use-store';
import { useColorScheme } from '../../../hooks/use-color-scheme';

/**
 * Pantalla principal que muestra el dashboard de telemetría por defecto.
 * 
 * Este componente se suscribe al estado global de Zustand para obtener
 * los datos del camión en tiempo real y mostrarlos en una interfaz sencilla.
 * 
 * @returns Componente React Native con la visualización de velocidad, RPM y otros.
 */
export default function ScreenHome() {
  // Suscripción reactiva solo a la telemetría y el estado de conexión
  const telemetry = useStore((state) => state.telemetry);
  const status = useStore((state) => state.status);
  const colorScheme = useColorScheme();

  // Estilo base dinámico según el tema
  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#0f0' : '#f00';
  const backgroundColor = isDark ? '#000' : '#fff';

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: backgroundColor,
      }}
    >
      {/* Indicador de estado de conexión */}
      <Text style={{ fontSize: 14, color: '#888', marginBottom: 20 }}>
        Estado: {status === 'connected' ? '✅ Conectado' : '❌ ' + status}
      </Text>

      {/* Solo mostramos datos si telemetry no es null */}
      {telemetry ? (
        <>
          <Text
            style={{
              fontSize: 64,
              color: textColor,
              fontWeight: 'bold',
            }}
          >
            🚛 {Math.round(telemetry.speed || 0)} km/h
          </Text>
          <Text style={{ fontSize: 32, color: '#888' }}>
            RPM: {Math.round(telemetry.rpm || 0)}
          </Text>
          <Text style={{ fontSize: 32, color: '#aaa' }}>
            Marcha: {telemetry.gear || 0} | Fuel: {telemetry.fuel || 0}%
          </Text>
        </>
      ) : (
        <Text style={{ color: '#888' }}>Esperando datos del simulador...</Text>
      )}
    </View>
  );
}
