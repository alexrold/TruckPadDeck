#!/usr/bin/env python3
import asyncio
import websockets
import json
import logging
import socket
import random
from zeroconf.asyncio import AsyncServiceInfo, AsyncZeroconf
from telemetry_reader import TruckTelemetryReader

# Configuración de logs profesional
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Silenciar logs ruidosos de librerías externas
logging.getLogger('websockets.server').setLevel(logging.ERROR)

# Instancia global del lector de telemetría
reader = TruckTelemetryReader()

# Generar PIN de seguridad único para esta sesión
SECRET_PIN = "".join([str(random.randint(0, 9)) for _ in range(6)])

def get_local_ip():
    """ Obtiene la dirección IP local de la interfaz de red activa. """
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

async def udp_beacon(local_ip, port_callback):
    """ Envía un paquete UDP Broadcast cada 3 segundos. """
    broadcast_ip = "255.255.255.255"
    beacon_port = 5555
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    
    try:
        while True:
            current_port = port_callback()
            if current_port:
                beacon_data = json.dumps({
                    "type": "truckpaddeck_discovery",
                    "server_name": socket.gethostname(),
                    "ip": local_ip,
                    "port": current_port
                }).encode('utf-8')
                sock.sendto(beacon_data, (broadcast_ip, beacon_port))
            await asyncio.sleep(3)
    except Exception as e:
        logger.error(f"⚠️ Error en el faro UDP: {e}")
    finally:
        sock.close()

async def telemetry_bridge(websocket):
    """ Gestiona la conexión WebSocket con seguridad por PIN. """
    remote_addr = websocket.remote_address[0]
    logger.info(f"🌐 Nuevo intento de conexión desde: {remote_addr}")

    try:
        # 1. Fase de Autenticación
        auth_payload = await websocket.recv()
        try:
            auth_data = json.loads(auth_payload)
            if auth_data.get("type") == "auth" and str(auth_data.get("pin")) == SECRET_PIN:
                logger.info(f"✅ Dispositivo {remote_addr} autenticado con éxito.")
                await websocket.send(json.dumps({
                    "status": "auth_ok",
                    "message": "¡Conexión segura establecida!"
                }))
            else:
                logger.warning(f"🚫 PIN incorrecto desde {remote_addr}.")
                await websocket.send(json.dumps({
                    "status": "auth_failed",
                    "message": "PIN de seguridad incorrecto."
                }))
                await websocket.close()
                return
        except (json.JSONDecodeError, KeyError):
            logger.warning(f"⚠️ Formato de autenticación inválido.")
            await websocket.close()
            return

        # 2. Fase de Telemetría
        while True:
            if not reader.is_connected:
                if not reader.connect():
                    await websocket.send(json.dumps({
                        "status": "waiting_for_game",
                        "message": "Conectado al PC. Iniciando simulador..."
                    }))
                    await asyncio.sleep(2)
                    continue
                else:
                    logger.info("🚀 Telemetría del juego detectada. Enviando datos...")

            data = reader.get_data()
            if data:
                data["status"] = "connected"
                await websocket.send(json.dumps(data))
            else:
                await asyncio.sleep(1)

            await asyncio.sleep(0.05)

    except websockets.exceptions.ConnectionClosed:
        logger.warning(f"❌ Dispositivo desconectado: {remote_addr}")
    except Exception as e:
        logger.error(f"⚠️ Error inesperado en el bridge: {e}")

async def main():
    """ Inicia el ecosistema del servidor TruckPadDeck. """
    local_ip = get_local_ip()
    server_port = None

    def get_current_port():
        return server_port

    # Interfaz Visual Inicial
    print("\n" + "═"*45)
    print(f"  🚛 TRUCK PAD DECK SERVER v1.1")
    print(f"  🔐 PIN DE SEGURIDAD: {SECRET_PIN}")
    print("═"*45 + "\n")
    
    # 1. Iniciar Faro UDP (Descubrimiento rápido)
    asyncio.create_task(udp_beacon(local_ip, get_current_port))
    logger.info(f"📡 Faro UDP: Activo en puerto 5555")

    # 2. Iniciar Servidor WebSocket (Datos)
    preferred_port = 42424
    try:
        try:
            server = await websockets.serve(telemetry_bridge, "0.0.0.0", preferred_port)
            server_port = preferred_port
        except OSError:
            logger.warning(f"⚠️ Puerto {preferred_port} ocupado. Buscando puerto libre...")
            server = await websockets.serve(telemetry_bridge, "0.0.0.0", 0)
            server_port = server.sockets[0].getsockname()[1]

        logger.info(f"🚀 WebSocket: Escuchando en {local_ip}:{server_port}")
        
        # 3. Iniciar mDNS (Anuncio de red)
        desc = {'version': '1.1.0', 'server': 'TruckPadDeck'}
        info = AsyncServiceInfo(
            "_truckpaddeck._tcp.local.",
            "TruckPadDeck._truckpaddeck._tcp.local.",
            addresses=[socket.inet_aton(local_ip)],
            port=server_port,
            properties=desc,
            server="truckpaddeck.local.",
        )
        aiozc = AsyncZeroconf()
        await aiozc.async_register_service(info)
        logger.info(f"🌐 Anuncio mDNS: Registrado como 'TruckPadDeck.local'")

        logger.info("✅ Todos los servicios están operativos. Esperando conexión de App móvil...")
        
        try:
            await asyncio.get_running_loop().create_future()
        finally:
            await aiozc.async_unregister_service(info)
            await aiozc.close()

    except Exception as e:
        logger.error(f"❌ Error crítico en el inicio: {e}")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        reader.close()
        logger.info("🛑 Servidor detenido por el usuario.")
