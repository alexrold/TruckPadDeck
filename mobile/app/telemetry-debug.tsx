import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { useTelemetryStore } from '../src/store/useTelemetryStore';
import { useTranslation } from '../src/hooks/useTranslation';
import { ThemedView, ThemedText } from '../components/themed';

/**
 * TelemetryDebugScreen - Herramienta de Auditoría y Diagnóstico de Telemetría.
 * 
 * PROPÓSITO:
 * Esta pantalla actúa como un "monitor de paquetes" para el desarrollador. Permite validar 
 * que la ingesta de datos vía WebSockets y su posterior almacenamiento en Zustand 
 * mantienen la integridad estructural definida por la Revisión 12 del SDK de SCS.
 * 
 * LÓGICA DE RENDERIZADO:
 * - Se utiliza 'useMemo' para la serialización del JSON. Dado que el store se actualiza 
 *   a 20Hz, la computación de strings pesados se optimiza para evitar bloqueos en el hilo de UI.
 * - Los indicadores de estado consumen flags booleanos directos para minimizar la latencia visual.
 * 
 * CONSIDERACIONES DE RENDIMIENTO:
 * Esta vista es intensiva en renderizado debido a la naturaleza del flujo (streaming constante).
 * Solo debe utilizarse en entornos de desarrollo o diagnóstico técnico.
 */
export default function TelemetryDebugScreen() {
  const { telemetry } = useTranslation();
  const data = useTelemetryStore((state) => state.data);
  const resetTelemetry = useTelemetryStore((state) => state.resetTelemetry);

  // Serialización optimizada del estado global para visualización técnica.
  const jsonView = useMemo(() => {
    if (!data) return null;
    return JSON.stringify(data, null, 2);
  }, [data]);

  // Determinación de colores de estado según la actividad del simulador.
  const getStatusColor = () => {
    if (!data) return '#607D8B'; // Gris: Desconectado
    if (data.paused) return '#FF9800'; // Naranja: Pausa
    if (data.sdk_active) return '#4CAF50'; // Verde: Activo
    return '#F44336'; // Rojo: Error/Inactivo
  };

  return (
    <ThemedView style={styles.container}>
      {/* Configuración del Header de navegación dinámica */}
      <Stack.Screen 
        options={{ 
          title: telemetry.debug_title,
          headerRight: () => (
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          )
        }} 
      />

      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
      >
        {/* Resumen de indicadores críticos (Quick Check) */}
        <View style={styles.header}>
          <ThemedText type="defaultSemiBold">
            {telemetry.sdk_status}: {data?.sdk_active ? 'ON' : 'OFF'}
          </ThemedText>
          <ThemedText type="defaultSemiBold">
            {telemetry.game_paused}: {data?.paused ? 'YES' : 'NO'}
          </ThemedText>
          <ThemedText type="caption" style={styles.timestamp}>
            {telemetry.last_update}: {data?.timestamp || 'N/A'}
          </ThemedText>
        </View>

        {/* Volcado de datos JSON en crudo */}
        <ThemedView style={styles.jsonContainer}>
          {data ? (
            <ThemedText style={styles.jsonText}>
              {jsonView}
            </ThemedText>
          ) : (
            <ThemedText style={styles.noData}>
              {telemetry.no_data}
            </ThemedText>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  jsonContainer: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  jsonText: {
    fontFamily: 'SpaceMono-Regular', // Fuente monoespaciada para legibilidad técnica
    fontSize: 12,
    lineHeight: 18,
  },
  noData: {
    textAlign: 'center',
    opacity: 0.5,
    marginTop: 40,
  },
  timestamp: {
    width: '100%',
    marginTop: 4,
    opacity: 0.7,
  },
  caption: {
    fontSize: 12,
  }
});
