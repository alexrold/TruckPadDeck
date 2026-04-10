# TruckPadDeck Server - Documentación Técnica (v0.1.0-beta)

Este módulo es el núcleo encargado de leer la memoria compartida (MMF) del SDK de SCS Telemetry y transmitirla en tiempo real mediante WebSockets a la aplicación móvil.

## 📂 Estructura del Proyecto

```text
server/
├── core/                       # ⚙️ Lógica central del servidor
│   ├── auth.py                 # 🔐 Gestión de seguridad (Generación y validación de PIN)
│   ├── bridge.py               # 🌉 Puente WebSocket (Streaming de telemetría a 20Hz)
│   └── __init__.py
├── network/                    # 📡 Servicios de red y descubrimiento
│   ├── discovery.py            # 🔦 Beacon UDP y mDNS (Detección automática de la App)
│   └── __init__.py
├── main.py                     # 🚀 Orquestador principal (Punto de entrada)
├── telemetry_reader.py         # 🔍 Lector de Memoria Compartida (SCS SDK Revision 12)
├── requirements.txt            # 📦 Dependencias (asyncio, websockets, zeroconf)
├── version.py                  # 📌 Control de versión del servidor
└── README.md                   # 📄 Documentación técnica (este archivo)
```

## 📊 Estructura del JSON (Contrato de Datos 1:1)

Cada mensaje enviado por el servidor es un objeto JSON con la siguiente estructura dinámica:

### 1. `config` (Metadatos y Preferencias)

| Campo               | Tipo     | Descripción                                      |
| :------------------ | :------- | :----------------------------------------------- |
| `game`              | `string` | "ETS2" o "ATS".                                  |
| `version`           | `string` | Versión del simulador detectada (ej: "1.50").    |
| `units.is_metric`   | `bool`   | ¿El usuario usa sistema métrico en el juego?     |
| `units.distance`    | `string` | "km" o "miles".                                  |
| `units.temperature` | `string` | "C" o "F".                                       |

### 2. `truck` (Telemetría de alta frecuencia)

Valores procesados y listos para mostrar en medidores analógicos o digitales.

| Objeto / Campo    | Sub-campo   | Tipo     | Descripción / Unidad                  |
| :---------------- | :---------- | :------- | :------------------------------------ |
| **`speed`**       | `value`     | `float`  | Velocidad real (Km/h o Mph).          |
|                   | `unit`      | `string` | "km/h" o "mph".                       |
| **`rpm`**         | `value`     | `int`    | Revoluciones actuales del motor.      |
|                   | `max`       | `int`    | Zona roja (Límite del motor).         |
| **`gear`**        | `physical`  | `int`    | Marcha real (-1 R, 0 N, 1-18).        |
|                   | `dashboard` | `string` | Marcha visual (ej: "4L", "R1").       |
| **`damage`**      | `engine`    | `float`  | Porcentaje de desgaste (0-100%).      |
|                   | `wheels`    | `float`  | Desgaste de neumáticos (0-100%).      |

### 3. `lights` (Estado de Indicadores)

Campos booleanos (`true`/`false`) sincronizados con los testigos de la cabina:

- `parking_brake`, `motor_brake`.
- `blinker_left`, `blinker_right`.
- `beam_low`, `beam_high`.
- `hazard`, `beacon`.

## 🛠️ Notas de Implementación

- **Frecuencia (20Hz):** El servidor envía una ráfaga cada 50ms (0.05s) para garantizar una fluidez visual perfecta sin saturar la red local.
- **Service Discovery:** El servidor emite un broadcast UDP a `255.255.255.255:5555` informando sobre su IP y Puerto de datos.
- **Autenticación:** La App debe enviar el PIN mostrado en consola al conectarse antes de empezar a recibir telemetría.
