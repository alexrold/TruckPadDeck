# 🚛 TruckPadDeck

> Control your Euro Truck Simulator 2 from an Android tablet in real time.

![Status](https://img.shields.io/badge/status-WIP-yellow)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Android-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ¿Qué es?

TruckPadDeck convierte tu tablet Android en un panel de control
para ETS2. Muestra telemetría en tiempo real (velocidad, RPM,
combustible) y permite ejecutar acciones desde la tablet
sin tocar el teclado.

---

## Arquitectura

ETS2 (PC)
└── scs-sdk-plugin.dll ← lee datos del juego
└── server.exe ← WebSocket (Python)
└── App Android ← panel de control (Expo)

---

## Requisitos

- Euro Truck Simulator 2 (Steam)
- Windows 10/11
- Android 8.0+
- Misma red WiFi (PC y tablet)

---

## Estructura del proyecto

TruckPadDeck/
├── plugin/ ← DLL para ETS2 (basado en RenCloud scs-sdk-plugin)
├── server/ ← WebSocket server (Python + websockets)
├── app/ ← App Android (Expo + React Native + NativeWind)
└── installer/ ← Instalador PC (Inno Setup) — próximamente

---

## Estado del proyecto

| Componente | Estado           |
| ---------- | ---------------- |
| plugin/    | 🔧 En desarrollo |
| server/    | 🔧 En desarrollo |
| app/       | 🔧 En desarrollo |
| installer/ | ⏳ Pendiente     |

---

## Créditos

- [RenCloud/scs-sdk-plugin](https://github.com/RenCloud/scs-sdk-plugin)
  base del plugin de telemetría para ETS2

---

## Autor

**Ronald Betancourt** — [@alexrold](https://github.com/alexrold)
