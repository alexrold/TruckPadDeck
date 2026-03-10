#!/usr/bin/env python3
import asyncio
import websockets
import json
import logging
import random
from datetime import datetime

# Configuración de logs para monitorear la actividad del servidor
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Estado actual de la telemetría (Simulado)
# Este objeto persistirá durante la ejecución para permitir simulaciones fluidas.
current_telemetry = {
    "speed": 0.0,
    "rpm": 800,
    "fuel": 100,
    "gear": 0,
    "lat": -10.1234,
    "lng": -75.5678,
    "heading": 0,
    "cargo": "Carga de Prueba"
}

async def update_simulation():
    """
    Tarea en segundo plano que actualiza los valores de telemetría.
    Simula un camión acelerando gradualmente hasta una velocidad de crucero.
    """
    global current_telemetry
    while True:
        # Lógica de simulación simple: acelerar hasta 80 km/h
        if current_telemetry["speed"] < 80:
            current_telemetry["speed"] += random.uniform(0.5, 1.5)
            current_telemetry["rpm"] = 1000 + (current_telemetry["speed"] * 20)
            current_telemetry["gear"] = int(current_telemetry["speed"] / 15) + 1
        else:
            # Velocidad de crucero con pequeñas oscilaciones
            current_telemetry["speed"] += random.uniform(-0.5, 0.5)
            current_telemetry["rpm"] = 2000 + random.randint(-20, 20)

        # Consumo mínimo de combustible
        current_telemetry["fuel"] = max(0, current_telemetry["fuel"] - 0.001)

        await asyncio.sleep(0.5)

async def send_telemetry(websocket):
    """
    Gestiona el envío de telemetría a un cliente conectado a través de WebSockets.
    Args:
        websocket: Instancia de la conexión WebSocket activa.
    """
    logger.info(f"✅ Cliente conectado desde: {websocket.remote_address}")

    try:
        while True:
            # Añadimos el timestamp actual al paquete de datos
            data_to_send = current_telemetry.copy()
            data_to_send["timestamp"] = datetime.now().isoformat()

            # Enviamos el paquete de datos en formato JSON
            await websocket.send(json.dumps(data_to_send))

            # Intervalo de envío sincronizado con la app (aprox. 10Hz)
            await asyncio.sleep(0.1)
    except websockets.exceptions.ConnectionClosed:
        logger.warning(f"❌ Cliente desconectado: {websocket.remote_address}")
    except Exception as e:
        logger.error(f"⚠️ Error en la conexión: {e}")

async def main():
    """
    Inicia el servidor de WebSockets y la tarea de simulación.
    """
    # Iniciamos la simulación en segundo plano
    asyncio.create_task(update_simulation())

    # Iniciamos el servidor en el puerto 8080
    async with websockets.serve(send_telemetry, "0.0.0.0", 8080):
        logger.info("🚛 Servidor de Telemetría TruckPadDeck iniciado en el puerto 8080")
        logger.info("📡 Esperando conexiones de la aplicación móvil...")
        await asyncio.get_running_loop().create_future()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("🛑 Servidor detenido por el usuario.")
