#!/usr/bin/env python3
import asyncio
import websockets
import json
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ets2_data = {
    "speed": 65.5, "rpm": 1800, "fuel": 78, "gear": 5,
    "lat": -10.1234, "lng": -75.5678, "heading": 45,
    "timestamp": datetime.now().isoformat()
}

clients = set()

async def send_telemetry(websocket):
    clients.add(websocket)
    logger.info(f"✅ Tablet conectada: {websocket.remote_address}")

    try:
        while True:
            ets2_data["timestamp"] = datetime.now().isoformat()
            await websocket.send(json.dumps(ets2_data))
            logger.info(f"Enviado: {ets2_data}")
            await asyncio.sleep(1)
    except:
        pass
    finally:
        clients.remove(websocket)

async def main():
    server = await websockets.serve(send_telemetry, "0.0.0.0", 8080)
    logger.info("🚛 Server ws://192.168.100.44:8080")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
