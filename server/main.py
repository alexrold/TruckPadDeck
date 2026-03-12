#!/usr/bin/env python3
import asyncio
import logging
import sys
import os
import websockets

# Asegurar que el directorio del servidor esté en el path para importaciones modulares
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

from network.discovery import get_local_ip, udp_beacon, MDNSAdvertiser
from core.auth import SecurityManager
from core.bridge import TelemetryBridge

# Configuración de registro de eventos (Logging)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Restringir logs ruidosos de la librería websockets
logging.getLogger('websockets.server').setLevel(logging.ERROR)

async def main():
    """
    Orquestador principal del servidor TruckPadDeck.
    Gestiona el ciclo de vida de los servicios de red, seguridad y telemetría.
    """
    # Identificamos la IP local para que la App sepa a qué dirección apuntar.
    local_ip = get_local_ip()
    # server_port se inicializa en None; su valor final dependerá de la negociación con Windows.
    server_port = None

    # Inicialización de componentes core (Seguridad y Puente de datos).
    security_mgr = SecurityManager()
    bridge_mgr = TelemetryBridge(security_mgr)

    # ... Interfaz Visual ...
    print("\n" + "═"*45)
    print(f"  TRUCK PAD DECK SERVER v1.2")
    print(f"  IP LOCAL: {local_ip}")
    print(f"  PIN DE SEGURIDAD: {security_mgr.get_pin()}")
    print("═"*45 + "\n")

    # Definimos una función de retorno (callback). 
    # Permite que el proceso UDP consulte el puerto en tiempo real cuando este sea asignado.
    def get_current_port():
        return server_port

    # Lanzamos el "Faro UDP" en segundo plano. 
    # Su única misión es anunciar la presencia del servidor en la red local (Puerto 5555).
    asyncio.create_task(udp_beacon(local_ip, get_current_port))
    logger.info(f"Faro de descubrimiento activo (Puerto UDP 5555)")

    # NEGOCIACIÓN DEL PUERTO WEBSOCKET:
    # Intentamos usar el puerto 42424 por defecto.
    preferred_port = 42424
    try:
        # Si el puerto está libre, iniciamos el servicio de datos aquí.
        server = await websockets.serve(bridge_mgr.handle_connection, "0.0.0.0", preferred_port)
        server_port = preferred_port
    except OSError:
        # FALLBACK: Si 42424 está ocupado, solicitamos al Sistema Operativo un puerto libre aleatorio (Puerto 0).
        logger.warning(f"Puerto {preferred_port} occupied. Negociando puerto dinámico con Windows...")
        server = await websockets.serve(bridge_mgr.handle_connection, "0.0.0.0", 0)
        # Extraemos el número de puerto que Windows nos asignó finalmente.
        server_port = server.sockets[0].getsockname()[1]

    # En este punto, server_port ya tiene un valor numérico y el Faro UDP empezará a anunciarlo.
    logger.info(f"Servidor de datos (WebSocket) operativo en {local_ip}:{server_port}")

    # Registro del servicio vía mDNS (Zeroconf) para redundancia
    mdns = MDNSAdvertiser(local_ip, server_port)
    await mdns.start()

    logger.info("Sistema operativo y a la espera de conexiones de la App.")

    # Mantener el bucle de eventos activo
    try:
        await asyncio.get_running_loop().create_future()
    except Exception as e:
        logger.error(f"Error crítico durante la ejecución del servidor: {e}")
    finally:
        await mdns.stop()
        bridge_mgr.close_reader()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Servidor detenido manualmente por el usuario.")
        sys.exit(0)
