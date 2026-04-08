# 🚛 TruckPadDeck

> Panel de Telemetría en Tiempo Real para Euro Truck Simulator 2 y American Truck Simulator.

![Version](https://img.shields.io/badge/version-0.1.0--beta-orange)
![Status](https://img.shields.io/badge/status-Active-brightgreen)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Android%20%7C%20iOS-blue)
![Architecture](https://img.shields.io/badge/arch-Modular-orange)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🚀 ¿Qué es TruckPadDeck?

TruckPadDeck es un ecosistema de telemetría que permite convertir cualquier dispositivo móvil en un tablero de instrumentos profesional para **ETS2** y **ATS**. A diferencia de otras soluciones, utiliza un sistema de **Service Discovery** automático y un enlace de baja latencia para una sincronización visual perfecta.

---

## 🏗️ Arquitectura del Sistema

El flujo de datos se divide en tres capas críticas:

1.  **Captura (Plugin):** `scs-telemetry.dll` lee la memoria compartida (MMF) del simulador (SCS SDK v12).
2.  **Puente (Server):** Servidor Python asíncrono que orquesta la seguridad (PIN) y el streaming vía WebSockets a 20Hz.
3.  **Visualización (Mobile):** Aplicación modular desarrollada en **Expo/React Native** con arquitectura **Feature-First**.

---

## 📂 Estructura del Proyecto

```text
TruckPadDeck/
├── server/             # Servidor Python (Asyncio + WebSockets)
│   ├── network/        # Beacon UDP (Service Discovery) y mDNS
│   ├── core/           # Lógica de seguridad (PIN) y Telemetry Bridge
│   └── telemetry_reader.py # Lector de memoria compartida (MMF)
├── mobile/             # Aplicación Móvil (Expo + TypeScript)
│   ├── src/
│   │   ├── store/      # Estado global (Zustand) con mapeo 1:1 de telemetría
│   │   ├── features/   # Módulos por responsabilidad (Connection, Dashboards)
│   │   └── components/ # Librería UI (NativeWind v4)
│   └── app/            # Sistema de rutas (Expo Router)
├── plugin/             # SCS SDK Plugin (C++) - Revision 12 compatible
└── docs/               # Notas de desarrollo y especificaciones técnicas
```

---

## 📡 Protocolos de Comunicación

Para garantizar una experiencia "Plug & Play", el sistema implementa:

- **Service Discovery:** El servidor emite un faro UDP (Beacon) en el puerto `5555`. La App detecta automáticamente la IP y el Puerto.
- **Seguridad:** Handshake inicial mediante PIN de 4 dígitos generado por el servidor.
- **Streaming:** Canal WebSocket bidireccional con ráfagas de telemetría a alta frecuencia (50ms de intervalo).

---

## 🛠️ Requisitos e Instalación

1.  **Simulador:** Euro Truck Simulator 2 o American Truck Simulator (Steam).
2.  **Plugin:** Instalar `scs-telemetry.dll` en la carpeta `plugins/` del juego.
3.  **Servidor:** Ejecutar `python server/main.py`.
4.  **App:**
    1. En una terminal: `cd mobile && bun install && bun run start`
    2. Vincular el dispositivo mediante el PIN mostrado en la consola del servidor.

---

## 👥 Créditos y Autor

- **Autor:** Ronald Betancourt ([@alexrold](https://github.com/alexrold))
- **Base del Plugin:** [RenCloud/scs-sdk-plugin](https://github.com/RenCloud/scs-sdk-plugin)
