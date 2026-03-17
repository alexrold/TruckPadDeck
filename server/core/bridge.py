import asyncio
import websockets
import json
import logging
from telemetry_reader import TruckTelemetryReader

logger = logging.getLogger(__name__)

class TelemetryBridge:
    """ 
    Gestiona la comunicación bidireccional entre el PC y la App móvil.
    Implementa un protocolo WebSocket con una fase inicial de apretón de manos (handshake)
    basado en PIN de seguridad, seguido de un streaming de datos a alta frecuencia.
    """
    def __init__(self, security_manager):
        self.security_manager = security_manager
        self.reader = TruckTelemetryReader()

    async def handle_connection(self, websocket):
        """ 
        Punto de entrada para cada cliente conectado.
        Aísla el ciclo de vida de cada sesión en una corrutina independiente.
        """
        remote_addr = websocket.remote_address[0]
        logger.info(f"Incoming connection attempt from: {remote_addr}")

        try:
            # Fase 1: Autenticación obligatoria mediante PIN de seguridad
            auth_payload = await websocket.recv()
            if await self._authenticate(websocket, auth_payload, remote_addr):
                # Fase 2: Streaming continuo de telemetría si el PIN fue validado
                await self._streaming_loop(websocket)
        except websockets.exceptions.ConnectionClosed:
            logger.info(f"Connection closed by client: {remote_addr}")
        except Exception as e:
            logger.error(f"Unexpected session failure for {remote_addr}: {e}")

    async def _authenticate(self, websocket, payload, address):
        """ 
        Procesa el primer paquete de datos para validar la identidad del cliente.
        Espera un objeto JSON con estructura {'type': 'auth', 'pin': 'XXXXXX'}.
        """
        try:
            data = json.loads(payload)
            if data.get("type") == "auth" and self.security_manager.validate_pin(data.get("pin")):
                self.security_manager.log_auth_success(address)
                await websocket.send(json.dumps({
                    "status": "auth_ok",
                    "message": "Authentication successful."
                }))
                return True
            else:
                self.security_manager.log_auth_failure(address)
                await websocket.send(json.dumps({
                    "status": "auth_failed",
                    "message": "Invalid security PIN."
                }))
                await websocket.close()
                return False
        except (json.JSONDecodeError, KeyError):
            logger.warning(f"Malformed authentication packet from {address}")
            await websocket.close()
            return False

    async def _streaming_loop(self, websocket):
        """ 
        Bucle de envío asíncrono. Intenta mantener una tasa de refresco 
        cercana a 20Hz (0.05s) para minimizar la percepción de latencia 
        en las agujas y luces de la interfaz cliente.
        """
        while True:
            # Reconexión automática con el plugin del simulador si se pierde el acceso
            if not self.reader.is_connected:
                if not self.reader.connect():
                    await websocket.send(json.dumps({
                        "status": "waiting_for_game",
                        "message": "Server active. Simulator not detected."
                    }))
                    await asyncio.sleep(2) # Pausa larga mientras esperamos al juego
                    continue
                else:
                    logger.info("Telemetry link with simulator established.")

            # Captura y formateo de la instantánea de datos
            data = self.reader.get_data()
            if data:
                data["status"] = "connected"
                await websocket.send(json.dumps(data))
            else:
                await asyncio.sleep(1)

            # Control de frecuencia: 0.05s = 20Hz (Sincronía visual fluida)
            await asyncio.sleep(0.05)

    def close_reader(self):
        """ Libera los recursos de memoria compartida al apagar el servidor. """
        self.reader.close()
