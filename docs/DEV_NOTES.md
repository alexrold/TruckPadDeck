# Notas de Desarrollo - TruckPadDeck

**Fecha:** 12 de Marzo de 2026
**Estado:** Servidor Modularizado (Backend v1.2) - Frontend en Reestructuración

## 🛠️ Estándares de Código (Backend)

1.  **Logging & Messages:** All console output, logger info/errors, and status messages MUST be in **English**.
    - Tone: Technical, concise, and direct.
    - Example: `[UDP] Beacon active on port 5555` instead of `Faro activo`.
2.  **Architecture:** Keep logic decoupled between `network`, `core`, and `telemetry`.

## 🏗️ Deployment & Setup Strategy (v1.0.0 Roadmap)

This section outlines the requirements for the final installer, aimed at providing a "one-click" setup experience for the end-user.

1.  **Universal Game Detection:**
    *   **Registry-based:** Scan Windows Registry keys (HKLM/HKCU) to locate ETS2 and ATS installation paths regardless of the platform (Steam, GOG, or Retail).
    *   **Fallback:** Provide a manual directory picker if registry keys are missing.
2.  **Plugin Management:**
    *   **Auto-Creation:** The installer must verify the existence of the `plugins/` directory within `bin/win_x64/`. Create it if missing.
    *   **DLL Injection:** Automatically copy `scs-telemetry.dll` to the correct location and verify write permissions.
3.  **Network Configuration:**
    *   **Firewall Rules:** Execute elevated PowerShell commands during installation to open:
        *   **UDP 5555:** Inbound/Outbound for Service Discovery (Beacon).
        *   **TCP 42424:** Inbound for WebSocket Data Streaming.
4.  **Standalone Executable:**
    *   **Bundling:** Use **PyInstaller** or **Nuitka** to compile the Python server into a single `.exe` file.
    *   **User Experience:** Eliminate the need for the user to install Python or manage virtual environments manually.

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
