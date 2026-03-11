import ctypes
import mmap
import struct

# Constantes de Windows
FILE_MAP_READ = 0x0004

def scan_telemetry():
    print("🔍 Iniciando escaneo de memoria compartida...")
    
    # Nombres que vamos a probar
    targets = [
        "Local\\SimTelemetryETS2", 
        "SimTelemetryETS2", 
        "Local\\SCSTelemetry", 
        "SCSTelemetry",
        "Global\\SimTelemetryETS2",
        "Global\\SCSTelemetry"
    ]
    
    found = False
    for name in targets:
        # Intentamos abrir con la API de Windows
        handle = ctypes.windll.kernel32.OpenFileMappingW(FILE_MAP_READ, False, name)
        
        if handle != 0:
            print(f"✅ ¡OBJETO ENCONTRADO! Nombre: {name}")
            try:
                # Mapeamos para ver qué hay dentro
                shm = mmap.mmap(handle, 1024, None, mmap.ACCESS_READ)
                
                # Leemos los primeros 64 bytes para inspección
                shm.seek(0)
                raw = shm.read(64)
                
                # Intentamos leer la revisión en el offset 40
                rev = struct.unpack('I', raw[40:44])[0]
                sdk = struct.unpack('?', raw[0:1])[0]
                
                print(f"   -> Revision ID: {rev}")
                print(f"   -> SDK Active: {sdk}")
                print(f"   -> Hex Dump (16 bytes): {raw[:16].hex()}")
                
                if rev > 0:
                    print("   🌟 ESTE ES EL BLOQUE CORRECTO.")
                    found = True
                
                shm.close()
            except Exception as e:
                print(f"   ❌ Error leyendo contenido: {e}")
            finally:
                ctypes.windll.kernel32.CloseHandle(handle)
        else:
            # print(f"   ⚪ {name}: No encontrado.")
            pass

    if not found:
        print("\n❌ No se encontró ningún bloque de telemetría activo.")
        print("💡 Asegúrate de que el juego esté abierto y la Demo de C# esté funcionando.")

if __name__ == "__main__":
    scan_telemetry()
