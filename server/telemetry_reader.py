import mmap
import struct
import logging
from datetime import datetime

# Configuración de logs internos del lector
logger = logging.getLogger(__name__)

class TruckTelemetryReader:
    """
    Lector de telemetría de alto rendimiento para ETS2/ATS.
    Mapea la memoria compartida del plugin de RenCloud (Local\\SCSTelemetry).
    """

    def __init__(self):
        self.mmf_name = "Local\\SCSTelemetry"
        self.mmf_size = 32 * 1024  # 32KB definido por el plugin
        self.shmem = None
        self.is_connected = False

    def connect(self):
        """
        Establece la conexión con la memoria compartida de Windows.
        Este método debe ser llamado antes de intentar leer datos.
        """
        try:
            # En Windows, mmap.mmap(0, size, tagname) abre la memoria compartida existente
            self.shmem = mmap.mmap(0, self.mmf_size, self.mmf_name, mmap.ACCESS_READ)
            self.is_connected = True
            logger.info(f"✅ Conectado exitosamente al MMF: {self.mmf_name}")
            return True
        except FileNotFoundError:
            # El juego o el plugin no están activos
            self.is_connected = False
            return False
        except Exception as e:
            logger.error(f"⚠️ Error inesperado al mapear memoria: {e}")
            self.is_connected = False
            return False

    def _read_string(self, offset, size=64):
        """
        Auxiliar para leer cadenas de texto (char arrays) de la memoria.
        Limpia los caracteres nulos (\x00) al final.
        """
        try:
            self.shmem.seek(offset)
            raw = self.shmem.read(size)
            # Cortamos en el primer byte nulo y decodificamos ignorando errores
            return raw.split(b'\x00')[0].decode('utf-8', 'ignore')
        except:
            return ""

    def get_data(self):
        """
        Extrae y estructura todos los datos relevantes del juego en un diccionario.
        Los offsets son calculados a partir de la estructura scsTelemetryMap_t.
        """
        if not self.shmem:
            return None

        try:
            # --- ZONA 1: ESTADO (Offset 0) ---
            self.shmem.seek(0)
            sdk_active = struct.unpack('?', self.shmem.read(1))[0]
            self.shmem.seek(4)
            paused = struct.unpack('?', self.shmem.read(1))[0]

            # --- ZONA 3: INTEGERS (Offset 500) ---
            # gearDashboard es el segundo int en truck_i (500 + 4)
            self.shmem.seek(504)
            gear = struct.unpack('i', self.shmem.read(4))[0]

            # --- ZONA 4: FLOATS (Offset 948) ---
            # Leemos un bloque continuo de 28 floats para optimizar el acceso a memoria
            self.shmem.seek(948)
            f_block = struct.unpack('28f', self.shmem.read(28 * 4))

            # --- ZONA 5: BOOLEANS (Offset 1566) ---
            # Bloque truck_b que contiene estados de luces y frenos
            self.shmem.seek(1566)
            b_block = struct.unpack('24?', self.shmem.read(24))

            # --- ZONA 8: POSICIÓN (Offset 2200) ---
            # Coordenadas mundiales y rotación (doubles de 8 bytes)
            self.shmem.seek(2200)
            dp_block = struct.unpack('6d', self.shmem.read(6 * 8))

            return {
                "sdk_active": sdk_active,
                "paused": paused,
                "timestamp": datetime.now().isoformat(),
                "truck": {
                    "speed": round(abs(f_block[0] * 3.6), 1), # m/s a km/h
                    "rpm": int(f_block[1]),
                    "gear": gear,
                    "fuel": round(f_block[13], 1),
                    "throttle": round(f_block[3] * 100, 1), # % pedal
                    "brake": round(f_block[4] * 100, 1),    # % pedal
                    "odometer": round(f_block[27], 1),      # km acumulados
                    "cruise_control_speed": round(f_block[10] * 3.6, 1) if b_block[23] else 0
                },
                "lights": {
                    "parking_brake": b_block[0],
                    "blinker_left": b_block[12],
                    "blinker_right": b_block[13],
                    "beam_low": b_block[17],
                    "beam_high": b_block[18],
                    "beacon": b_block[19],
                    "hazard": b_block[22]
                },
                "job": {
                    "cargo": self._read_string(2300 + (5 * 64)),
                    "city_dst": self._read_string(2300 + (7 * 64)),
                    "city_src": self._read_string(2300 + (11 * 64)),
                    "truck_name": self._read_string(2300 + (3 * 64))
                },
                "navigation": {
                    "lat": round(dp_block[0], 6),
                    "lng": round(dp_block[2], 6),
                    "heading": round(dp_block[5], 4)
                },
                "status": {
                    "cruise_control": b_block[23],
                    "motor_brake": b_block[1]
                }
            }
        except Exception as e:
            logger.error(f"⚠️ Error crítico leyendo telemetría: {e}")
            self.close() # Cerramos por seguridad si hay corrupción de datos
            return None

    def close(self):
        """
        Libera los recursos de memoria compartida y limpia el estado del lector.
        """
        if self.shmem:
            try:
                self.shmem.close()
                logger.info("🔌 Memoria compartida liberada correctamente.")
            except Exception as e:
                logger.warning(f"⚠️ Error al intentar cerrar MMF: {e}")
            finally:
                self.shmem = None
                self.is_connected = False
