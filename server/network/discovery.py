import asyncio
import socket
import json
import logging
from zeroconf.asyncio import AsyncServiceInfo, AsyncZeroconf

logger = logging.getLogger(__name__)

def get_local_ip():
    """ 
    Identifica la dirección IP de la interfaz de red principal del sistema. 
    Se conecta temporalmente a un servidor DNS externo para forzar la elección
    de la interfaz activa sin transmitir datos.
    """
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
    """ 
    Inicia un faro UDP Broadcast para descubrimiento automático.
    Emite un paquete JSON en el puerto 5555 cada 3 segundos informando
    sobre la disponibilidad, IP y puerto del servidor WebSocket.
    """
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
        logger.error(f"UDP discovery service failure: {e}")
    finally:
        sock.close()

class MDNSAdvertiser:
    """ 
    Registra el servidor en la red local mediante el protocolo mDNS/Zeroconf.
    Permite el acceso vía hostname (truckpaddeck.local) y detección avanzada
    en sistemas que soportan Bonjour o Avahi.
    """
    def __init__(self, local_ip, port):
        self.local_ip = local_ip
        self.port = port
        self.aiozc = None
        self.info = None

    async def start(self):
        desc = {'version': '1.1.0', 'server': 'TruckPadDeck'}
        self.info = AsyncServiceInfo(
            "_truckpaddeck._tcp.local.",
            "TruckPadDeck._truckpaddeck._tcp.local.",
            addresses=[socket.inet_aton(self.local_ip)],
            port=self.port,
            properties=desc,
            server="truckpaddeck.local.",
        )
        self.aiozc = AsyncZeroconf()
        await self.aiozc.async_register_service(self.info)
        logger.info(f"mDNS service registered as 'truckpaddeck.local'")

    async def stop(self):
        if self.aiozc and self.info:
            await self.aiozc.async_unregister_service(self.info)
            await self.aiozc.close()
            logger.info("mDNS service stopped.")
