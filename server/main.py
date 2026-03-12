#!/usr/bin/env python3
import asyncio
import websockets
import json
import logging
import socket
import random
from zeroconf.asyncio import AsyncServiceInfo, AsyncZeroconf
from telemetry_reader import TruckTelemetryReader

# Configuración de logs
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

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

async def telemetry_bridge(websocket):
    """
    Gestiona la conexión WebSocket con seguridad por PIN.
    """
    remote_addr = websocket.remote_address[0]
    logger.info(f"🌐 Intento de conexión desde: {remote_addr}")

    try:
        # 1. Fase de Autenticación
        # Esperamos el primer mensaje que debe contener el PIN
        auth_payload = await websocket.recv()
        try:
            auth_data = json.loads(auth_payload)
            if auth_data.get("type") == "auth" and str(auth_data.get("pin")) == SECRET_PIN:
                logger.info(f"✅ Dispositivo {remote_addr} autenticado correctamente.")
                await websocket.send(json.dumps({
                    "status": "auth_ok",
                    "message": "¡Conexión segura establecida!"
                }))
            else:
                logger.warning(f"🚫 PIN incorrecto desde {remote_addr}. Cerrando conexión.")
                await websocket.send(json.dumps({
                    "status": "auth_failed",
                    "message": "PIN de seguridad incorrecto."
                }))
                await websocket.close()
                return
        except (json.JSONDecodeError, KeyError):
            logger.warning(f"⚠️ Formato de autenticación inválido de {remote_addr}.")
            await websocket.close()
            return

        # 2. Fase de Telemetría (Solo si se autenticó)
        while True:
            if not reader.is_connected:
                if not reader.connect():
                    await websocket.send(json.dumps({
                        "status": "waiting_for_game",
                        "message": "Esperando a ETS2/ATS..."
                    }))
                    await asyncio.sleep(2)
                    continue
                else:
                    logger.info("🚀 ¡Conexión establecida con la telemetría del juego!")

            data = reader.get_data()
            if data:
                data["status"] = "connected"
                await websocket.send(json.dumps(data))
            else:
                logger.warning("⚠️ Perdiendo sincronización con el juego...")
                await asyncio.sleep(1)

            await asyncio.sleep(0.05)

    except websockets.exceptions.ConnectionClosed:
        logger.warning(f"❌ Dispositivo desconectado: {remote_addr}")
    except Exception as e:
        logger.error(f"⚠️ Error inesperado en el bridge: {e}")

async def main():
    """ Inicia el servidor WebSocket, mDNS y muestra el PIN. """
    port = 8080
    local_ip = get_local_ip()
    
    # Mostrar el PIN de forma destacada en la consola
    print("\n" + "="*40)
    print(f"🔐 TRUCK PAD DECK - SEGURIDAD")
    print(f"CÓDIGO DE EMPAREJAMIENTO: {SECRET_PIN}")
    print("="*40 + "\n")
    
    desc = {'version': '1.0.0', 'server': 'TruckPadDeck'}
    info = AsyncServiceInfo(
        "_truckpaddeck._tcp.local.",
        "TruckPadDeck._truckpaddeck._tcp.local.",
        addresses=[socket.inet_aton(local_ip)],
        port=port,
        properties=desc,
        server="truckpaddeck.local.",
    )

    aiozc = AsyncZeroconf()
    logger.info(f"📡 Anunciando servicio mDNS en {local_ip}:{port}...")
    
    try:
        await aiozc.async_register_service(info)
        async with websockets.serve(telemetry_bridge, "0.0.0.0", port):
            logger.info(f"🚛 Servidor de Telemetría iniciado en el puerto {port}")
            await asyncio.get_running_loop().create_future()
            
    except Exception as e:
        logger.error(f"❌ Error en el servidor: {e}")
    finally:
        logger.info("🛑 Deteniendo anuncio mDNS...")
        await aiozc.async_unregister_service(info)
        await aiozc.close()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        reader.close()
        logger.info("🛑 Servidor detenido por el usuario.")



