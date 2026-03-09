#!/usr/bin/env python3
"""
🚛 TruckPadDeck Server
WebSocket server para ETS2 telemetry
"""
import asyncio
import websockets
import json
import logging
from datetime import datetime

# Configuración logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Estado ETS2 simulado (después será real)
ets2_data = {
    "speed": 65.5,
    "rpm": 1800,
    "fuel": 78,
    "gear": 5,
    "timestamp": datetime.now().isoformat()
}

clients = set()

async def send_telemetry(websocket, path):
    """Envía datos ETS2 a cliente conectado"""
    clients.add(websocket)
    logger.info(f"Cliente conectado: {websocket.remote_address}")

    try:
        while True:
            # Simula datos ETS2 reales
            global ets2_data
            ets2_data["timestamp"] = datetime.now().isoformat()

            await websocket.send(json.dumps(ets2_data))
            logger.info(f"Enviado: {ets2_data}")
            await asyncio.sleep(1)  # 1Hz
    except websockets.exceptions.ConnectionClosed:
        logger.info(f"Cliente desconectado: {websocket.remote_address}")
    finally:
        clients.remove(websocket)

async def handle_action(websocket, path):
    """Recibe acciones desde la tablet"""
    async for message in websocket:
        data = json.loads(message)
        logger.info(f"Acción recibida: {data}")

        # Simula acciones ETS2
        if data.get("action") == "horn":
            logger.info("🔊 Bocina activada")
        elif data.get("action") == "lights":
            logger.info("💡 Luces toggled")

async def main():
    """Servidor principal"""
    server = await websockets.serve(
        send_telemetry,  # endpoint /telemetry
        "localhost", 8080,
        subprotocols=['truckpaddeck']
    )

    logger.info("🚛 TruckPadDeck Server corriendo en ws://localhost:8080")
    logger.info("Conecta con: wscat -c ws://localhost:8080")

    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
