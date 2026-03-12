import random
import logging

logger = logging.getLogger(__name__)

class SecurityManager:
    """ 
    Gestiona la capa de seguridad de la sesión.
    Se encarga de generar y validar los tokens numéricos (PIN) para 
    evitar conexiones no autorizadas de dispositivos externos en la red local.
    """
    def __init__(self):
        self.secret_pin = self._generate_pin()

    def _generate_pin(self):
        """ 
        Genera un identificador numérico de 6 dígitos aleatorios. 
        Este PIN es volátil y cambia con cada reinicio del servidor.
        """
        return "".join([str(random.randint(0, 9)) for _ in range(6)])

    def validate_pin(self, pin_to_validate):
        """ Valida el PIN de conexión enviado por un cliente. """
        return str(pin_to_validate) == self.secret_pin

    def get_pin(self):
        """ Devuelve el PIN actual para su visualización en el PC. """
        return self.secret_pin

    def log_auth_success(self, address):
        logger.info(f"Acceso concedido al dispositivo: {address}")

    def log_auth_failure(self, address):
        logger.warning(f"Intento de acceso denegado (PIN incorrecto) desde: {address}")
