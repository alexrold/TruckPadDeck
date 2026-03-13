# Notas de Desarrollo - TruckPadDeck

**Fecha:** 12 de Marzo de 2026
**Estado:** Servidor Modularizado (Backend v1.2) - Frontend en Reestructuración

## 🚀 Logros Recientes

1.  **Arquitectura Modular (Server):**
    - Separada la lógica en `network/discovery.py`, `core/auth.py` y `core/bridge.py`.
    - Implementada negociación dinámica de puertos (Fallback al puerto 0 si 42424 está ocupado).
    - Documentación técnica exhaustiva añadida a cada módulo.
2.  **Seguridad:**
    - Aislamiento del `SecurityManager` para gestión de PIN y validación de sesiones.
3.  **Saneamiento de Git:**
    - Rama `main` consolidada como punto de ruptura.
    - App antigua movida a `old-app/` e ignorada para iniciar nueva estructura limpia.

## 📍 Próximos Pasos (Prioridades)

1.  **Normalización de Unidades (CRÍTICO):** Investigar la detección automática de Metric vs Imperial en el SDK.
    - El servidor debe proveer datos normalizados o informar a la App de la preferencia del usuario (Km/h vs Mph, Litros vs Galones).
    - Verificar flags de configuración en la Zona 2 (UI/Config) de la memoria compartida.
2.  **Nueva Estructura App:** Iniciar `app/` desde cero con una arquitectura de carpetas limpia y coherente.
3.  **Modularización Frontend:** Separar la lógica de WebSocket del UI para permitir múltiples dashboards (Ingeniero, Logística, Dashboard Clásico).

## ⚠️ Estado de Ramas

- `main`: Estable y Modularizada. (Norte actual).
- `old-app/`: Referencia histórica (Ignorada).

## 📝 Resumen de Sesión (13/03/2026) - CONTEXTO PARA IA

- **Servidor (Backend v1.2.1):**
  - Implementada **Detección Automática de Juego** (Offset 44):
    - `1` -> Euro Truck Simulator 2 (ETS2)
    - `2` -> American Truck Simulator (ATS)
  - Implementada **Detección de Versión** (Offsets 56 y 60): Ejemplo "1.50".
  - **Nueva Estructura JSON (config):** El servidor ahora envía una cabecera de configuración en cada snapshot:
    ```json
    "config": {
        "game": "ETS2",
        "version": "1.50",
        "units": {
            "is_metric": true, // Determinado por el ID del juego
            "temperature": "C",
            "pressure": "bar"
        }
    }
    ```
- **Lector de Telemetría:** Sincronizado con SCS SDK Revision 12. Soporta daños detallados, navegación y estados de luces.
- **Frontend (Rebuild):**
  - Carpeta antigua movida a `old-app/`.
  - Nueva carpeta `mobile/` creada con `bun create expo-app --template blank-typescript`.
  - Configurado **NativeWind v4** siguiendo la documentación oficial (Babel, Metro y Tailwind).
  - Configurado **Expo Router** como sistema de navegación principal.
  - **Estado actual:** Pendiente de estabilizar la visualización del terminal y las dependencias nativas del SDK de Expo.

## Comandos Útiles

- Iniciar servidor: `cd server && python main.py`
- Instalar dependencias (mobile): `cd mobile && bun install`
- Iniciar App: `cd mobile && bun run start`
