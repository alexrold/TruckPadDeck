#!/usr/bin/env python3
import asyncio
import websockets
import json
import logging
from telemetry_reader import TruckTelemetryReader

# Configuración de logs para monitorear la actividad del servidor
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Instancia global del lector de telemetría real
reader = TruckTelemetryReader()

async def telemetry_bridge(websocket):
    """
    Gestiona la conexión WebSocket con la aplicación móvil.
    Actúa como puente leyendo la memoria compartida del juego y
    retransmitiendo los datos en tiempo real.
    """
    logger.info(f"✅ Dispositivo conectado: {websocket.remote_address}")

    try:
        while True:
            # Si no estamos conectados a la memoria del plugin, intentamos conectar
            if not reader.is_connected:
                if not reader.connect():
                    # Avisamos a la app que estamos esperando al simulador
                    await websocket.send(json.dumps({
                        "status": "waiting_for_game",
                        "message": "Esperando a ETS2/ATS..."
                    }))
                    await asyncio.sleep(2)
                    continue
                else:
                    logger.info("🚀 ¡Conexión establecida con la telemetría del juego!")

            # Obtener el paquete completo de datos reales
            data = reader.get_data()
            
            if data:
                # Añadimos un estado de conexión para la UI
                data["status"] = "connected"
                await websocket.send(json.dumps(data))
            else:
                # Si get_data devuelve None, algo falló en la lectura (ej. juego cerrado)
                logger.warning("⚠️ Perdiendo sincronización con el juego...")
                await asyncio.sleep(1)

            # Frecuencia de actualización: ~20Hz (50ms)
            # Suficiente para que las agujas se vean fluidas pero sin saturar la red.
            await asyncio.sleep(0.05)

    except websockets.exceptions.ConnectionClosed:
        logger.warning(f"❌ Dispositivo desconectado: {websocket.remote_address}")
    except Exception as e:
        logger.error(f"⚠️ Error inesperado en el bridge: {e}")

async def main():
    """
    Inicia el servidor WebSocket en todas las interfaces de red locales.
    """
    async with websockets.serve(telemetry_bridge, "0.0.0.0", 8080):
        logger.info("🚛 Servidor de Telemetría TruckPadDeck REAL iniciado en el puerto 8080")
        logger.info("📡 Escuchando en todas las interfaces de red locales...")
        # Mantiene el bucle de eventos activo indefinidamente
        await asyncio.get_running_loop().create_future()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        reader.close()
        logger.info("🛑 Servidor detenido por el usuario.")
