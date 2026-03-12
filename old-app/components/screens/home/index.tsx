import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStore } from '../../../store/use-store';
import { useColorScheme } from '../../../hooks/use-color-scheme';

/**
 * Pantalla principal que muestra el dashboard detallado de telemetría.
 * Actualizada para SCSTelemetry Revision 12.
 */
/**
 * Componente auxiliar para mostrar el nivel de daño de un sistema del camión.
 */
function DamageIndicator({ label, value }: { label: string; value: number }) {
  const isHighDamage = value > 15;
  const isCriticalDamage = value > 40;

  return (
    <View style={styles_helper.damageItem}>
      <View style={[
        styles_helper.damageBar, 
        { height: `${Math.max(10, value)}%`, backgroundColor: isCriticalDamage ? '#f00' : isHighDamage ? '#fa0' : '#0a0' }
      ]} />
      <Text style={styles_helper.damageLabel}>{label}</Text>
      <Text style={[styles_helper.damageValue, isHighDamage && { color: isCriticalDamage ? '#f00' : '#fa0' }]}>
        {Math.round(value)}%
      </Text>
    </View>
  );
}

const styles_helper = StyleSheet.create({
  damageItem: { alignItems: 'center', flex: 1 },
  damageBar: { width: 4, borderRadius: 2, marginBottom: 5, minHeight: 4 },
  damageLabel: { fontSize: 8, color: '#888', textTransform: 'uppercase' },
  damageValue: { fontSize: 10, fontWeight: 'bold', color: '#666' },
});

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
        <View>
          <Text style={styles.statusText}>
            {status === 'connected' ? '🟢 CONECTADO' : status === 'waiting_for_game' ? '🟡 ESPERANDO JUEGO' : '🔴 DESCONECTADO'}
          </Text>
          {telemetry?.paused && (
            <Text style={styles.pausedText}>⏸️ JUEGO EN PAUSA</Text>
          )}
        </View>
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
              {telemetry.navigation.speed_limit > 0 && (
                <View style={styles.speedLimitBadge}>
                  <Text style={styles.speedLimitText}>{telemetry.navigation.speed_limit}</Text>
                </View>
              )}
            </View>
            <View style={styles.gauge}>
              <Text style={styles.rpmValue}>{telemetry.truck.rpm}</Text>
              <Text style={styles.gaugeUnit}>RPM</Text>
              <Text style={styles.rpmMaxText}>MAX: {telemetry.truck.rpm_max}</Text>
            </View>
          </View>

          {/* Fila de Marchas y Pedales */}
          <View style={styles.infoRow}>
            <View style={styles.gearContainer}>
              <Text style={styles.gearLabel}>MARCHA</Text>
              <Text style={styles.gearValue}>
                {telemetry.truck.gear_dashboard > 0 ? telemetry.truck.gear_dashboard : telemetry.truck.gear === 0 ? 'N' : 'R'}
              </Text>
            </View>
            <View style={styles.fuelContainer}>
              <Text style={styles.fuelText}>⛽ {Math.round(telemetry.truck.fuel.amount)} L</Text>
              <Text style={styles.fuelRangeText}>{Math.round(telemetry.truck.fuel.range)} km restantes</Text>
            </View>
          </View>

          {/* Indicadores de Luces */}
          <View style={styles.lightsContainer}>
            <Text style={[styles.lightIcon, telemetry.lights.blinker_left && styles.lightOn]}>⬅️</Text>
            <Text style={[styles.lightIcon, telemetry.lights.parking_brake && styles.lightWarning]}>🅿️</Text>
            <Text style={[styles.lightIcon, telemetry.lights.beam_high && styles.lightHigh]}>🔦</Text>
            <Text style={[styles.lightIcon, telemetry.lights.cruise_control && styles.lightOn]}>⏲️</Text>
            <Text style={[styles.lightIcon, telemetry.lights.blinker_right && styles.lightOn]}>➡️</Text>
          </View>

          {/* Sección de Fluidos y Estado del Motor */}
          <View style={styles.mechanicsGrid}>
            <View style={styles.mechanicItem}>
              <Text style={styles.mechanicIcon}>🌡️</Text>
              <Text style={styles.mechanicValue}>{Math.round(telemetry.truck.fluids.water_temperature)}°C</Text>
              <Text style={styles.mechanicLabel}>AGUA</Text>
            </View>
            <View style={styles.mechanicItem}>
              <Text style={styles.mechanicIcon}>🛢️</Text>
              <Text style={styles.mechanicValue}>{Math.round(telemetry.truck.fluids.oil_temperature)}°C</Text>
              <Text style={styles.mechanicLabel}>ACEITE</Text>
            </View>
            <View style={styles.mechanicItem}>
              <Text style={styles.mechanicIcon}>💨</Text>
              <Text style={styles.mechanicValue}>{telemetry.truck.fluids.air_pressure.toFixed(1)}</Text>
              <Text style={styles.mechanicLabel}>AIRE</Text>
            </View>
            <View style={styles.mechanicItem}>
              <Text style={styles.mechanicIcon}>🔋</Text>
              <Text style={styles.mechanicValue}>{telemetry.truck.fluids.battery_voltage.toFixed(1)}V</Text>
              <Text style={styles.mechanicLabel}>BATERÍA</Text>
            </View>
          </View>

          {/* Sección de Daños */}
          <View style={styles.damageContainer}>
            <Text style={styles.sectionTitle}>ESTADO DEL VEHÍCULO</Text>
            <View style={styles.damageRow}>
              <DamageIndicator label="Motor" value={telemetry.truck.damage.engine} />
              <DamageIndicator label="Transm." value={telemetry.truck.damage.transmission} />
              <DamageIndicator label="Cabina" value={telemetry.truck.damage.cabin} />
              <DamageIndicator label="Chasis" value={telemetry.truck.damage.chassis} />
              <DamageIndicator label="Ruedas" value={telemetry.truck.damage.wheels} />
            </View>
          </View>

          {/* Información del Trabajo */}
          {telemetry.job.on_job && (
            <View style={styles.jobCard}>
              <Text style={styles.cargoText}>📦 {telemetry.job.cargo}</Text>
              <Text style={styles.routeText}>
                {telemetry.job.city_src} ➔ {telemetry.job.city_dst}
              </Text>
              <Text style={styles.navigationText}>
                🏁 {Math.round(telemetry.navigation.route_distance / 1000)} km | ⏳ {Math.round(telemetry.navigation.route_time)} min
              </Text>
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
  pausedText: {
    color: '#f00',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
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
    position: 'relative',
  },
  speedValue: {
    fontSize: 80,
    color: isDark ? '#fff' : '#000',
    fontWeight: '900',
  },
  speedLimitBadge: {
    position: 'absolute',
    top: 0,
    right: -30,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#f00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedLimitText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rpmValue: {
    fontSize: 40,
    color: '#888',
  },
  rpmMaxText: {
    fontSize: 10,
    color: '#f00',
    marginTop: 5,
  },
  gaugeUnit: {
    color: '#666',
    fontSize: 14,
    marginTop: -5,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  gearContainer: {
    alignItems: 'center',
  },
  gearLabel: {
    fontSize: 10,
    color: '#888',
    marginBottom: -5,
  },
  gearValue: {
    fontSize: 36,
    color: '#f00',
    fontWeight: 'bold',
  },
  fuelContainer: {
    alignItems: 'flex-start',
  },
  fuelText: {
    fontSize: 24,
    color: '#0a0',
  },
  fuelRangeText: {
    fontSize: 12,
    color: '#666',
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
    opacity: 0.1,
  },
  lightOn: { opacity: 1 },
  lightWarning: { opacity: 1, color: '#f00' },
  lightHigh: { opacity: 1, color: '#00f' },
  jobCard: {
    backgroundColor: isDark ? '#1a1a1a' : '#fff',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: isDark ? '#333' : '#eee',
  },
  cargoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#000',
    marginBottom: 5,
  },
  routeText: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 10,
  },
  navigationText: {
    fontSize: 12,
    color: '#08f',
    fontWeight: 'bold',
  },
  odometerText: {
    marginTop: 20,
    fontSize: 12,
    color: '#666',
  },
  mechanicsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    backgroundColor: isDark ? '#1a1a1a' : '#fff',
    padding: 15,
    borderRadius: 15,
  },
  mechanicItem: {
    alignItems: 'center',
  },
  mechanicIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  mechanicValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#000',
  },
  mechanicLabel: {
    fontSize: 9,
    color: '#888',
  },
  damageContainer: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 2,
  },
  damageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 60,
  },
  waitingContainer: {
    alignItems: 'center',
  },
  waitingText: {
    color: '#888',
    textAlign: 'center',
  },
});
