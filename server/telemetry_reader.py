import mmap
import struct
import logging
from datetime import datetime

class TruckTelemetryReader:
    """
    Lector de telemetría de alto rendimiento para ETS2/ATS.
    Mapea la memoria compartida del plugin de RenCloud (Local\\SCSTelemetry).
    """

    def __init__(self):
        self.mmf_name = "Local\\SCSTelemetry"
        self.mmf_size = 32 * 1024  # 32KB
        self.shmem = None
        self.is_connected = False

    def connect(self):
        """Establece la conexión con la memoria compartida de Windows."""
        try:
            # En Windows, usamos tagname para acceder a la memoria del plugin
            self.shmem = mmap.mmap(-1, self.mmf_size, tagname=self.mmf_name, access=mmap.ACCESS_READ)
            self.is_connected = True
            return True
        except FileNotFoundError:
            self.is_connected = False
            return False
        except Exception as e:
            logging.error(f"⚠️ Error al conectar con la memoria: {e}")
            self.is_connected = False
            return False

    def _read_string(self, offset, size=64):
        """Lee y limpia una cadena de texto de la memoria."""
        try:
            self.shmem.seek(offset)
            raw = self.shmem.read(size)
            return raw.split(b'\x00')[0].decode('utf-8', 'ignore')
        except:
            return ""

    def get_data(self):
        """
        Extrae y estructura todos los datos relevantes del juego.
        Basado en los offsets calculados de scs-telemetry-common.hpp.
        """
        if not self.shmem:
            return None

        try:
            # --- ZONA 1: ESTADO (Offset 0) ---
            self.shmem.seek(0)
            sdk_active = struct.unpack('?', self.shmem.read(1))[0]
            self.shmem.seek(4)
            paused = struct.unpack('?', self.shmem.read(1))[0]

            # --- ZONA 3: MARCHA (Offset 504) ---
            # truck_i empieza en 500. gear es el segundo int (500 + 4).
            self.shmem.seek(504)
            gear = struct.unpack('i', self.shmem.read(4))[0]

            # --- ZONA 4: INSTRUMENTACIÓN (Offset 948) ---
            # truck_f: speed(0), rpm(1), ..., fuel(13)
            self.shmem.seek(948)
            # Leemos los primeros 14 floats de la estructura truck_f
            f_block = struct.unpack('14f', self.shmem.read(14 * 4))

            # --- ZONA 5: LUCES Y ESTADOS (Offset 1566) ---
            # config_b (1500-1565). truck_b empieza en 1566.
            self.shmem.seek(1566)
            # Leemos los primeros 24 bools (parkingBrake...hazard)
            b_block = struct.unpack('24?', self.shmem.read(24))

            # --- ZONA 8: POSICIÓN (Offset 2200) ---
            self.shmem.seek(2200)
            dp_block = struct.unpack('6d', self.shmem.read(6 * 8))

            return {
                "sdk_active": sdk_active,
                "paused": paused,
                "timestamp": datetime.now().isoformat(),
                "truck": {
                    "speed": round(abs(f_block[0] * 3.6), 1),
                    "rpm": int(f_block[1]),
                    "gear": gear,
                    "fuel": round(f_block[13], 1),
                    "throttle": round(f_block[3] * 100, 1),
                    "brake": round(f_block[4] * 100, 1),
                    "odometer": round(f_block[27], 1) # truckOdometer es el offset 27 en truck_f
                },
                "lights": {
                    "parking_brake": b_block[0],
                    "motor_brake": b_block[1],
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
                    "lat": dp_block[0],
                    "lng": dp_block[2],
                    "heading": round(dp_block[5], 4)
                }
            }
        except Exception as e:
            logging.error(f"⚠️ Error leyendo offsets: {e}")
            self.is_connected = False
            return None

    def close(self):
        if self.shmem:
            self.shmem.close()
            self.is_connected = False
