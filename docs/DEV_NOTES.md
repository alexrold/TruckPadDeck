# 🛡️ TruckPadDeck - Protocolo de Desarrollo e Integridad

> **ATENCIÓN AGENTE:** Este proyecto exige rigor técnico absoluto. Antes de proponer o ejecutar cualquier cambio, **DEBES** realizar un análisis profundo del código real. Prohibido asumir estados de implementación basados únicamente en conversaciones previas o resúmenes de texto.

## 📜 Reglas de Oro de la Sesión
1.  **Análisis de Código Mandatorio:** Al iniciar la sesión, utiliza herramientas de exploración para validar la estructura actual. No te fíes de tu memoria; fíate del sistema de archivos.
2.  **Arquitectura Feature-First:** Respeta la división por dominios en `mobile/src/features/`. Todo componente nuevo debe nacer en su feature correspondiente antes de ser globalizado.
3.  **Sistema de Temas (@themed):** Está terminantemente prohibido usar componentes base de React Native (`View`, `Text`, `Pressable`) si existe una variante en `mobile/components/themed/`.
4.  **Gestión de Estado (Zustand):** Los stores en `mobile/src/store/` son la fuente de verdad. No dupliques estados locales si ya existen globalmente.
5.  **Orden Cronológico:** Mantén `DEV_NOTES.md` siempre ordenado de forma descendente (lo más nuevo arriba).
6.  **Validación de Git:** Revisa siempre `git status` para entender en qué punto exacto se quedó la sesión anterior.

## 🌿 Flujo de Trabajo Estándar (Git)
- **Sincronización:** Cada sesión comienza en `main` con el código limpio.
- **Ramificación:** Para cada nueva característica o refactorización, se DEBE crear una rama dedicada (ej: `feat/settings`).
- **Commits Atómicos:** Realizar commits pequeños y descriptivos.
- **Integración:** Al finalizar la tarea, la rama se mergea a `main` tras la validación.
- **Documentación:** El último paso de cada tarea es actualizar este archivo con los logros alcanzados.

---

# Notas de Desarrollo - TruckPadDeck

## 📝 Resumen de Sesión (08/04/2026) - REFACCIÓN E INTEGRIDAD

- **Arquitectura Dashboards (Feature-First):**
  - Refactorización total de `app/dashboards/[id].tsx` en componentes atómicos: `DashboardHero`, `DashboardInfo`, `DashboardTechSpecs` y `DashboardActions`.
  - Implementación de `DashboardRegistry.ts` (conceptual) para separar el contenedor de los diseños de camiones.
  - Implementación de `techSpecsConfig.ts` para un renderizado de datos técnicos basado en configuración (Data-Driven).
- **Core de UI & Theming (Mejoras Críticas):**
  - **ThemedView:** Ahora gestiona automáticamente bordes y fondos cuando se usa la variante `card` basándose en la paleta `Colors.ts`.
  - **ThemedButton:** Añadidas las variantes `success`, `warning` y corregida la variante `danger`. Ahora el color de texto y fondo es 100% dinámico y coherente.
  - **ThemedInfoItem:** Creado como nuevo componente global para pares de información Icono-Etiqueta-Valor.
- **Integridad de Datos & UX:**
  - **Filtro de Favoritos:** Corregida la lógica en `HomeScreen` para que solo muestre dashboards que estén marcados como favoritos Y descargados.
  - **Eliminación Atómica:** Al desinstalar un dashboard, se limpia automáticamente del store de favoritos.
  - **Grid Responsiva:** Implementada lógica de "elementos fantasma" en `DashboardGrid` y `DashboardCard` para mantener la alineación perfecta en cualquier dispositivo (móvil/tablet) sin importar el número de elementos.
- **Constantes:**
  - Desacoplada la imagen por defecto a `constants/defaultDashboardImage.ts`.
  - Actualizada la semilla de datos para soportar la etiqueta híbrida `'ETS2 - ATS'`.

## 📝 Resumen de Sesión (07/04/2026) - Acuerdos Estratégicos (CONTEXTO PARA IA)

- **Servidor (Backend - DX):**
  - **Modo Simulación (`--mock`):** Acordado implementar un flag en `main.py` para generar datos de telemetría simulados (Fake Data). Esto elimina la necesidad de tener ETS2/ATS abierto durante el desarrollo de la App.
- **Conectividad y Red:**
  - **Estrategia Dual Discovery:** Confirmada la estructura de usar mDNS como método primario y UDP (puerto 5555) como fallback.
  - **Handshake Visual:** El servidor generará y mostrará un PIN en consola que el usuario deberá ingresar en la App una sola vez (similar al emparejamiento Bluetooth o Android TV).
- **Frontend (Mobile UI/UX):**
  - **Prioridad Estructural:** El desarrollo se centrará en finalizar el marco estructural (Idiomas, Temas, Ajustes, Store Global) antes de invertir tiempo en los dashboards visuales.
  - **Dashboard "Raw Telemetry Data":** Se diseñará una página/vista especial para mostrar en crudo todo el JSON que llega del servidor. Esto servirá como herramienta de diagnóstico y base para construir los medidores futuros.
- **Arquitectura de Datos (Decisión Crítica - Telemetría):**
  - Se ha acordado **NO persistir** los datos de alta frecuencia de `useTelemetryStore.ts` en el almacenamiento local (`AsyncStorage`). Dado que la aplicación es una herramienta de monitoreo en tiempo real a 20Hz, guardar estados pasados (velocidad, RPM) es contraproducente para el rendimiento y la precisión de la información (es preferible mostrar un aviso de desconexión en vivo que mostrar datos "congelados" de hace horas). La persistencia se limitará exclusivamente a configuraciones (IP, Puerto, Idioma, Tema) o datos estáticos de estado de viaje en futuras versiones (modo "Hoja de Ruta").

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

## 📝 Resumen de Sesión (12/03/2026) - Estándares y Estrategia

### 🛠️ Estándares de Código (Backend)

1.  **Logging & Messages:** All console output, logger info/errors, and status messages MUST be in **English**.
    - Tone: Technical, concise, and direct.
    - Example: `[UDP] Beacon active on port 5555` instead of `Faro activo`.
2.  **Architecture:** Keep logic decoupled between `network`, `core`, and `telemetry`.

### 🏗️ Deployment & Setup Strategy (v1.0.0 Roadmap)

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

## 📍 Próximos Pasos (Prioridades)

1.  **Dashboard Visual Real (Prioridad Alta):** Iniciar el desarrollo del primer tablero real (Digital Dashboard) consumiendo datos vivos del Store.
2.  **Persistencia:** Verificar a fondo la persistencia de temas e idiomas.
3.  **Refactor de Discovery:** Optimizar el hook de mDNS para mobile.

## ⚠️ Estado de Ramas

- `main`: Estable y Modularizada. (Norte actual).
- `old-app/`: Referencia histórica (Ignorada).

## Comandos Útiles

- Iniciar servidor: `cd server && python main.py`
- Instalar dependencias (mobile): `cd mobile && bun install`
- Iniciar App: `cd mobile && bun run start`
