import mmap
import struct
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class TruckTelemetryReader:
    """
    Lector de Telemetría para SCS Software (ETS2/ATS).
    Compatible con SCS SDK Plugin v12 (Revision 12).
    
    ESTRUCTURA DE MEMORIA (MMF):
    La memoria compartida se divide en 'Zonas' según el tipo de dato:
    - Zona 1 (0-39): Bools de control y Timestamps.
    - Zona 2 (40-499): Unsigned Integers (Versiones, Tiempos de juego).
    - Zona 3 (500-699): Integers (Marchas, Retarders).
    - Zona 4 (700-1499): Floats (Velocidad, Presiones, Consumo, Daños).
    - Zona 5 (1500-1639): Bools de estado (Luces, Frenos, Indicadores).
    - Zona 8 (2200-2299): Doubles (Coordenadas GPS y Rotación).
    - Zona 9 (2300-3999): Strings (Nombres de camión, carga, ciudades).
    - Zona 12 (4300-4399): Special Bools (Eventos como multas, peajes, ferries).
    """

    def __init__(self):
        self.mmf_name = "Local\\SCSTelemetry"
        self.mmf_size = 32 * 1024 # 32KB asignados por el plugin
        self.shmem = None
        self.is_connected = False

    def connect(self):
        """ Establece conexión con el bloque de memoria 'Local\\SCSTelemetry' """
        try:
            self.shmem = mmap.mmap(-1, self.mmf_size, tagname=self.mmf_name, access=mmap.ACCESS_READ)
            
            # Validación de Revisión: Offset 40 (telemetry_plugin_revision)
            # Es vital que sea 12 para que los offsets coincidan.
            self.shmem.seek(40)
            plugin_revid = struct.unpack('I', self.shmem.read(4))[0]
            
            if plugin_revid == 12:
                # Identificar el juego inmediatamente para el log
                self.shmem.seek(44)
                game_id = struct.unpack('I', self.shmem.read(4))[0]
                game_name = "Euro Truck Simulator 2" if game_id == 1 else "American Truck Simulator" if game_id == 2 else "Simulator"
                
                self.is_connected = True
                logger.info(f"Connected to {game_name} (SDK Revision {plugin_revid})")
                return True
            elif plugin_revid == 0:
                # El juego está en el menú principal o cargando; el plugin aún no tiene datos.
                self.is_connected = False
                return False
            else:
                logger.warning(
                    f"Incompatible Plugin version (Detected: v{plugin_revid}). "
                    f"Requires strictly 'SCS SDK Plugin v1.12.1 (Revision 12)'. "
                    f"Check 'scs-telemetry.dll' in the simulator's plugins folder."
                )
                self.close()
                return False
        except FileNotFoundError:
            self.is_connected = False
            return False
        except Exception as e:
            logger.error(f"Connection failed: {e}")
            self.is_connected = False
            return False

    def _read_string(self, offset, size=64):
        """ Lee una cadena de caracteres terminada en null de la memoria """
        try:
            self.shmem.seek(offset)
            raw = self.shmem.read(size)
            return raw.split(b'\x00')[0].decode('utf-8', 'ignore').strip()
        except:
            return ""

    def get_data(self):
        """ 
        Captura y procesa una snapshot de la telemetría.
        Mapea los bytes crudos a un diccionario estructurado.
        """
        if not self.shmem or not self.is_connected:
            return None

        try:
            # --- ZONA 1: CONTROL (0-39) ---
            self.shmem.seek(0)
            raw_z1 = self.shmem.read(40)
            sdk_active = struct.unpack('?', raw_z1[0:1])[0] # ¿El SDK está enviando datos?
            paused = struct.unpack('?', raw_z1[4:5])[0]     # ¿El juego está en pausa/menú?

            # --- ZONA 2: UI/CONFIG (40-499) ---
            # Leemos metadatos del juego (ID y Versión)
            self.shmem.seek(44)
            raw_z2_meta = self.shmem.read(20) # De 44 a 64
            game_id = struct.unpack('I', raw_z2_meta[0:4])[0]      # Offset 44
            ver_major = struct.unpack('I', raw_z2_meta[12:16])[0]  # Offset 56
            ver_minor = struct.unpack('I', raw_z2_meta[16:20])[0]  # Offset 60
            
            # Offset 64: common_ui.time_abs (tiempo total en min)
            self.shmem.seek(64)
            game_time = struct.unpack('I', self.shmem.read(4))[0]

            # Mapeo de Identidad del Juego y Unidades por defecto
            game_name = "ETS2" if game_id == 1 else "ATS" if game_id == 2 else "Unknown"
            game_ver = f"{ver_major}.{ver_minor}"
            
            # Preferencia de unidades basada en el juego (ETS2: Métrico, ATS: Imperial)
            # TODO: Refinar con detección de flag real del usuario si está disponible.
            is_metric = True if game_id == 1 else False

            # --- ZONA 3: INTEGERS (500-699) ---
            self.shmem.seek(504) # truck_i: gear (504) y gearDashboard (508)
            gears_raw = struct.unpack('2i', self.shmem.read(8))
            gear = gears_raw[0]             # Marcha física (-1 R, 0 N, 1-18)
            gear_dashboard = gears_raw[1]   # Lo que muestra el display (ej: 4L, 4H)

            # --- ZONA 4: FLOATS (700-1499) ---
            # Bloque de Configuración (Límites fijos) - Offset 704
            self.shmem.seek(704)
            config_f = struct.unpack('10f', self.shmem.read(40))
            fuel_capacity = config_f[0] # Litros totales del tanque
            rpm_max = config_f[9]       # Límite de revoluciones del motor

            # Bloque de Telemetría Real (Valores dinámicos) - Offset 948
            self.shmem.seek(948)
            # Leemos 31 floats secuenciales:
            # [0]speed, [1]rpm, [2]userSteer, [3]userThrottle, [4]userBrake, [5]userClutch...
            # [11]airPressure, [13]fuel, [14]fuelAvg, [15]fuelRange, [16]adblue...
            # [17]oilPress, [18]oilTemp, [19]waterTemp, [20]batteryVolt...
            # [22-26]wear (daños), [27]odometer, [28]routeDist, [29]routeTime, [30]speedLimit
            f_block = struct.unpack('31f', self.shmem.read(31 * 4))

            # --- ZONA 5: BOOLEANS (1500-1639) ---
            self.shmem.seek(1566) # truck_b: Estado de luces y frenos
            # 0:parkBrake, 1:motorBrake, 12:blinkerL, 13:blinkerR, 17:beamLow, 18:beamHigh...
            b_block = struct.unpack('24?', self.shmem.read(24))

            # --- ZONA 8: POSICIÓN (2200-2299) ---
            self.shmem.seek(2200) # truck_dp: Coordenadas mundiales (double precision)
            dp_block = struct.unpack('6d', self.shmem.read(6 * 8))

            # --- ZONA 12: EVENTOS ESPECIALES (4300-4399) ---
            self.shmem.seek(4300) # special_b: Banderas de eventos (true durante el frame del evento)
            # 0:onJob, 4:fined, 5:tollgate, 6:ferry, 7:train, 8:refuel
            special_events = struct.unpack('10?', self.shmem.read(10))

            # --- REMOLQUE (Básico) ---
            self.shmem.seek(6082) # Offset 6000 + 82 (attached): ¿Hay remolque conectado?
            trailer_attached = struct.unpack('?', self.shmem.read(1))[0]

            # Construcción del objeto de respuesta con estructura organizada
            return {
                "sdk_active": sdk_active,
                "paused": paused,
                "timestamp": datetime.now().isoformat(),
                "config": {
                    "game": game_name,
                    "version": game_ver,
                    "units": {
                        "is_metric": is_metric,
                        "temperature": "C" if is_metric else "F",
                        "pressure": "bar" if is_metric else "psi"
                    }
                },
                "game": {
                    "time": game_time,
                    "plugin_version": 12
                },
                "truck": {
                    "speed": round(abs(f_block[0] * 3.6), 1), # m/s a km/h
                    "rpm": int(f_block[1]),
                    "rpm_max": int(rpm_max),
                    "gear": gear,
                    "gear_dashboard": gear_dashboard,
                    "fuel": {
                        "amount": round(f_block[13], 1),        # Litros actuales
                        "capacity": round(fuel_capacity, 1),    # Capacidad tanque
                        "range": round(f_block[15], 1),         # Autonomía estimada (km)
                        "avg_consumption": round(f_block[14], 2) # L/km promedio
                    },
                    "adblue": round(f_block[16], 1),
                    "inputs": {
                        "throttle": round(f_block[3] * 100, 1), # 0-100%
                        "brake": round(f_block[4] * 100, 1),
                        "clutch": round(f_block[5] * 100, 1),
                        "steer": round(f_block[2] * 100, 1)
                    },
                    "fluids": {
                        "air_pressure": round(f_block[11], 1),   # psi o bar según config
                        "oil_pressure": round(f_block[17], 1),
                        "oil_temperature": round(f_block[18], 1),
                        "water_temperature": round(f_block[19], 1),
                        "battery_voltage": round(f_block[20], 1)
                    },
                    "damage": {
                        "engine": round(f_block[22] * 100, 1),      # 0-100% de desgaste
                        "transmission": round(f_block[23] * 100, 1),
                        "cabin": round(f_block[24] * 100, 1),
                        "chassis": round(f_block[25] * 100, 1),
                        "wheels": round(f_block[26] * 100, 1)
                    },
                    "odometer": round(f_block[27], 1) # km totales
                },
                "navigation": {
                    "speed_limit": round(f_block[30] * 3.6, 1) if f_block[30] > 0 else 0, # km/h
                    "route_distance": round(f_block[28], 1), # Metros hasta destino
                    "route_time": round(f_block[29] / 60, 1), # Segundos a Minutos
                    "location": {
                        "x": round(dp_block[0], 2),
                        "y": round(dp_block[1], 2),
                        "z": round(dp_block[2], 2)
                    },
                    "heading": round(dp_block[5], 4) # Orientación del camión
                },
                "lights": {
                    "parking_brake": b_block[0],
                    "motor_brake": b_block[1],
                    "blinker_left": b_block[12],
                    "blinker_right": b_block[13],
                    "beam_low": b_block[17],
                    "beam_high": b_block[18],
                    "beacon": b_block[19],
                    "brake": b_block[20],
                    "hazard": b_block[22],
                    "cruise_control": b_block[23]
                },
                "job": {
                    "cargo": self._read_string(2300 + (5 * 64)),  # String en Zona 9
                    "city_src": self._read_string(2300 + (11 * 64)),
                    "city_dst": self._read_string(2300 + (7 * 64)),
                    "truck_name": self._read_string(2300 + (3 * 64)),
                    "on_job": special_events[0],
                    "trailer_attached": trailer_attached
                },
                "events": {
                    "fined": special_events[4],      # Multa detectada
                    "tollgate": special_events[5],   # En peaje
                    "ferry": special_events[6],      # En ferry
                    "train": special_events[7],      # En tren
                    "refuel": special_events[8]      # Repostando
                },
                "status": "connected"
            }
        except Exception as e:
            logger.error(f"Telemetry data processing error: {e}")
            return None

    def close(self):
        if self.shmem:
            try:
                self.shmem.close()
            finally:
                self.shmem = None
                self.is_connected = False
