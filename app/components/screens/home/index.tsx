import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStore } from '../../../store/use-store';
import { useColorScheme } from '../../../hooks/use-color-scheme';

/**
 * Pantalla principal que muestra el dashboard detallado de telemetría.
 */
export default function ScreenHome() {
  const telemetry = useStore((state) => state.telemetry);
  const status = useStore((state) => state.status);
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  return (
    <View style={styles.container}>
      {/* Barra de Estado Superior */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          {status === 'connected' ? '🟢 CONECTADO' : status === 'waiting_for_game' ? '🟡 ESPERANDO JUEGO' : '🔴 DESCONECTADO'}
        </Text>
        {telemetry?.job.truck_name && (
          <Text style={styles.truckText}>{telemetry.job.truck_name}</Text>
        )}
      </View>

      {telemetry ? (
        <View style={styles.dashboard}>
          {/* Velocímetro y RPM */}
          <View style={styles.gaugeRow}>
            <View style={styles.gauge}>
              <Text style={styles.speedValue}>{Math.round(telemetry.truck.speed)}</Text>
              <Text style={styles.gaugeUnit}>km/h</Text>
            </View>
            <View style={styles.gauge}>
              <Text style={styles.rpmValue}>{telemetry.truck.rpm}</Text>
              <Text style={styles.gaugeUnit}>RPM</Text>
            </View>
          </View>

          {/* Fila de Marchas y Pedales */}
          <View style={styles.infoRow}>
            <Text style={styles.gearText}>MARCHA: {telemetry.truck.gear}</Text>
            <Text style={styles.fuelText}>⛽ {Math.round(telemetry.truck.fuel)} L</Text>
          </View>

          {/* Indicadores de Luces */}
          <View style={styles.lightsContainer}>
            <Text style={[styles.lightIcon, telemetry.lights.blinker_left && styles.lightOn]}>⬅️</Text>
            <Text style={[styles.lightIcon, telemetry.lights.parking_brake && styles.lightWarning]}>🅿️</Text>
            <Text style={[styles.lightIcon, telemetry.lights.beam_high && styles.lightHigh]}>🔦</Text>
            <Text style={[styles.lightIcon, telemetry.lights.blinker_right && styles.lightOn]}>➡️</Text>
          </View>

          {/* Información del Trabajo */}
          {telemetry.job.cargo !== "Sin carga" && (
            <View style={styles.jobCard}>
              <Text style={styles.cargoText}>📦 {telemetry.job.cargo}</Text>
              <Text style={styles.routeText}>{telemetry.job.city_src} ➔ {telemetry.job.city_dst}</Text>
            </View>
          )}

          <Text style={styles.odometerText}>ODO: {Math.round(telemetry.truck.odometer)} km</Text>
        </View>
      ) : (
        <View style={styles.waitingContainer}>
          <Text style={styles.waitingText}>
            {status === 'waiting_for_game' 
              ? 'Por favor, inicia ETS2 con el SDK instalado' 
              : 'Buscando servidor de telemetría...'}
          </Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#111' : '#eee',
    padding: 20,
    justifyContent: 'center',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  statusText: {
    color: isDark ? '#aaa' : '#555',
    fontSize: 12,
    fontWeight: 'bold',
  },
  truckText: {
    color: '#888',
    fontSize: 12,
  },
  dashboard: {
    alignItems: 'center',
  },
  gaugeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  gauge: {
    alignItems: 'center',
  },
  speedValue: {
    fontSize: 80,
    color: isDark ? '#fff' : '#000',
    fontWeight: '900',
  },
  rpmValue: {
    fontSize: 40,
    color: '#888',
  },
  gaugeUnit: {
    color: '#666',
    fontSize: 14,
    marginTop: -5,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  gearText: {
    fontSize: 24,
    color: '#f00',
    fontWeight: 'bold',
  },
  fuelText: {
    fontSize: 24,
    color: '#0a0',
  },
  lightsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
    backgroundColor: isDark ? '#222' : '#ddd',
    padding: 15,
    borderRadius: 15,
  },
  lightIcon: {
    fontSize: 24,
    opacity: 0.2,
  },
  lightOn: { opacity: 1 },
  lightWarning: { opacity: 1, color: '#f00' },
  lightHigh: { opacity: 1, color: '#00f' },
  jobCard: {
    backgroundColor: isDark ? '#333' : '#fff',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cargoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#000',
    marginBottom: 5,
  },
  routeText: {
    fontSize: 14,
    color: '#888',
  },
  odometerText: {
    marginTop: 20,
    fontSize: 12,
    color: '#666',
  },
  waitingContainer: {
    alignItems: 'center',
  },
  waitingText: {
    color: '#888',
    textAlign: 'center',
  },
});
