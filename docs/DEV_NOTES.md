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

## 📡 Especificación de Red: Service Discovery (v1.1)

Para garantizar una experiencia "Plug & Play", el sistema implementa un faro UDP redundante:

1.  **Beacon UDP (Puerto 5555):**
    - **Servidor:** Emite un broadcast JSON cada 3s a `255.255.255.255`.
    - **App:** Escucha en `0.0.0.0:5555`. 
    - **Resolución de IP:** La App utiliza `rinfo.address` (capa de transporte) como fuente de verdad absoluta, ignorando el campo `ip` dentro del payload JSON. Esto previene conflictos con `localhost` o interfaces virtuales.
2.  **mDNS / Zeroconf (Opcional):**
    - El servidor se registra como `truckpaddeck.local` para resolución de nombres en redes compatibles.

## 🧭 Dashboard Navigation Strategy

Para asegurar que la experiencia de usuario sea fluida y no "bloquee" el dispositivo, se deben implementar los siguientes controles de navegación:

1.  **Cierre de Sesión (Main Dashboard):**
    *   **Acción:** Un botón visible (ej. en el Header o Menú) que realice una desconexión limpia del WebSocket y desactive el **Modo Inmersivo**.
    *   **Importante:** Debe restaurar la visibilidad de la barra de estado y de navegación de Android para que el usuario pueda salir de la app normalmente.
2.  **Retorno a la Biblioteca (Back-to-Library):**
    *   **Contexto:** Al cargar un dashboard de camión específico (ej. DAF XF), la app entra en modo "Focus".
    *   **Acción:** Cada dashboard individual debe incluir un "Gesto de Escape" o un botón semitransparente que permita volver al **Selector de Dashboards** (Library).
    *   **Implementación:** Utilizar `expo-router` para navegar hacia atrás (`router.back()`) o redirigir al index, asegurando que el flujo de datos de telemetría se mantenga activo pero se cambie solo la capa visual (UI).

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

## 📝 Resumen de Sesión (04/04/2026) - CONTEXTO PARA IA

- **Infraestructura de Datos (Mobile Core):**
  - Implementación de `useTelemetryStore.ts`: Almacén global para datos del vehículo (Velocidad, RPM, Luces, Daños, etc.).
  - Implementación de `useTelemetryConnection.ts`: Motor de WebSockets con lógica de Handshake (PIN), streaming a 20Hz y reconexión automática resiliente.
  - Integración global del motor en `RootLayout`.
- **Inteligencia de Red Local:**
  - Instalación de `expo-network`.
  - Creación del hook `useLocalIp.ts`: Detecta automáticamente el prefijo de red local (ej. `192.168.1.`) para optimizar la entrada manual de la IP del PC.
- **UX de Conexión (Refactor):**
  - **ConnectionModal robusto:**
    - Máscara automática para direcciones IPv4 (puntos automáticos al escribir).
    - Feedback visual de errores (PIN incorrecto o fallo de red) con limpieza automática al editar.
    - Puerto 42424 pre-rellenado con notas aclaratorias sobre negociación dinámica.
    - Avisos preventivos de "Misma Red Local".
    - Gestión de sesión activa: Si ya está conectado, el modal permite ver el servidor actual y desconectarse limpiamente con un botón dedicado.
- **Gestión de Hardware:**
  - Instalación de `expo-keep-awake`.
  - Creación de `useHardwareManager.ts`: Mantiene la pantalla encendida automáticamente solo cuando hay una sesión de telemetría activa.
  - Liberación de la orientación global en `app.json` (`orientation: default`) para permitir dashboards modulares (Vertical/Horizontal).
- **Calidad de Código:** Auditoría completa de la documentación técnica en todos los archivos de la App móvil, estandarizando terminología (Discovery, Handshake, Beacon, etc.).

## 📍 Próximos Pasos (Prioridades)

1.  **Persistencia (Prioridad Alta):** Implementar la persistencia de la última IP exitosa y preferencias de usuario mediante `AsyncStorage`.
2.  **Dashboard Visual:** Iniciar el desarrollo del primer tablero real (Digital Dashboard) consumiendo datos vivos del Store.
3.  **Refactor de Discovery:** Optimizar el hook de UDP para evitar falsos positivos si hay múltiples servidores en la red.

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

## 📝 Resumen de Sesión (18/03/2026) - CONTEXTO PARA IA

- **Frontend (Mobile v1.1):**
  - **Refactor de Componentes Themed:**
    - `ThemedView`: Eliminado el `flex-1` por defecto para permitir contenedores de tamaño fijo o neutro.
    - `ThemedCard`: Creado como componente estándar para la biblioteca. En modo oscuro usa un gris elevado (`#1C2833`) y bordes `white/10` para mejorar el contraste.
  - **Modo Inmersivo (Full Deck Experience):**
    - Instalada e integrada la librería `expo-navigation-bar`.
    - Configurado `NavigationBar.setVisibilityAsync('hidden')` y `StatusBar hidden` para ocultar controles del sistema.
  - **Dashboard Selector:**
    - `index.tsx` transformado en una biblioteca horizontal que filtra por juego (ETS2/ATS).
    - El menú lateral (Drawer) se ajustó a un ancho fijo de **180px** para no interferir con la visibilidad del dashboard.
- **Navegación:** Definida la necesidad de un botón de "Escape" para restaurar las barras del sistema al cerrar la app o volver a la biblioteca.

## Comandos Útiles

- Iniciar servidor: `cd server && python main.py`
- Instalar dependencias (mobile): `cd mobile && bun install`
- Iniciar App: `cd mobile && bun run start`

## 📝 Resumen de Sesión (27/03/2026) - CONTEXTO PARA IA (Suspensión)

- **Arquitectura Mobile (Feature-First):**
  - Refactorización total de `HomeScreen` (`app/(tabs)/index.tsx`). Se dividió en componentes atómicos (`Sidebar`, `HomeHeader`, `LibraryHeader`, `DashboardGrid`, `DashboardSearch`, `QuickAccess`) ubicados en `src/features/home/components/`.
  - Se crearon hooks especializados (`useDashboardSearch`, `useDashboardFilter`, `useDashboardLayout`, `useHomeShell`) en `src/features/home/hooks/`.
  - Se implementaron archivos de barril (`index.ts`) y alias (`@features`, `@hooks`, `@store`) en `tsconfig.json`.
- **Estado Global (Zustand):**
  - Instalación de `zustand`.
  - Creación de `useUIStore.ts` (manejo de tema `light/dark/system` y lenguaje `es/en`).
  - Creación de `useConnectionStore.ts` (manejo de IP, puerto, PIN, status y estado del Modal).
  - Eliminación de mocks locales en favor de la suscripción al store global.
- **Service Discovery & Red:**
  - Instalación de `react-native-udp` (requiere Development Build).
  - Implementación del hook `useServiceDiscovery.ts` para escuchar paquetes UDP en el puerto 5555 y actualizar el store de conexión automáticamente.
  - Corrección de `reuseAddr` a `reusePort` por requerimientos nativos.
- **UI/UX de Conexión:**
  - Creación de `ConnectionModal.tsx` como Centro de Mando de Red (muestra estado de escaneo, pide PIN o permite ingreso manual).
  - Refactor del disparador `ConnectionStatus.tsx` usando `ThemedButton` con renderizado condicional según el estado (`CONNECTED` vs `DISCONNECTED`).
- **Pendientes al reanudar:**
  - Probar a fondo el flujo del `ConnectionModal` con el servidor Python emitiendo UDP.
  - Definir e implementar la estructura de `useTelemetryStore.ts` para ingerir los datos del WebSocket.
  - Implementar la validación del PIN vía WebSocket.
