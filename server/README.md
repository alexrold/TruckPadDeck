# TruckPadDeck Server - Documentación Técnica (v0.1.0-beta)

Este módulo es el núcleo encargado de leer la memoria compartida (MMF) del SDK de SCS Telemetry y transmitirla en tiempo real mediante WebSockets a la aplicación móvil.

## 📂 Estructura del Proyecto

```text
server/
├── core/                       # ⚙️ Lógica central del servidor (Sesiones, Auth, Bridge)
├── network/                    # 📡 Servicios de red (Discovery UDP, mDNS)
├── .venv/                      # 🐍 Entorno virtual de Python (Aislado)
├── debug_mem.py                # 🔍 Utilidad de diagnóstico de Memoria Compartida
├── main.py                     # 🚀 Orquestador principal (Punto de entrada)
├── offsets.ts                  # 📑 Referencia técnica de offsets (TypeScript)
├── telemetry_reader.py         # 🔍 Lector de MMF (SCS SDK Revision 12)
├── requirements.txt            # 📦 Dependencias (asyncio, websockets, zeroconf)
├── version.py                  # 📌 Control de versión del servidor
└── README.md                   # 📄 Documentación técnica (este archivo)
```

## 📊 Estructura del JSON (Contrato de Datos 1:1)

Cada ráfaga de datos es un objeto JSON estructurado que refleja el estado exacto del simulador:

### 1. `config` & `game` (Contexto)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `game` | `string` | "ETS2" o "ATS". |
| `version` | `string` | Versión del simulador (ej: "1.50"). |
| `timestamp` | `iso8601`| Marca de tiempo de la captura. |
| `units` | `object` | Preferencias de usuario (`is_metric`, `distance`, `fuel`, `temp`, `press`). |

### 2. `truck` (Dinámica del Vehículo)
| Objeto | Campos Clave | Descripción |
| :--- | :--- | :--- |
| **`speed`** | `value`, `unit` | Velocidad real convertida. |
| **`rpm`** | `value`, `max` | Revoluciones y zona roja. |
| **`gear`** | `physical`, `dashboard` | Marcha real y visual (ej: "4L"). |
| **`fuel`** | `value`, `range`, `avg_consumption` | Datos de consumo y autonomía. |
| **`temperature`** | `water`, `oil` | Temperaturas críticas de motor. |
| **`pressure`** | `air`, `oil` | Presiones de sistemas. |
| **`damage`** | `engine`, `transmission`, `cabin`, `chassis`, `wheels` | Desgaste detallado (0-100%). |
| **`inputs`** | `throttle`, `brake`, `clutch`, `steer` | Telemetría de pedales (0-100%). |

### 3. `navigation` & `job` (Logística)
| Objeto | Campos Clave | Descripción |
| :--- | :--- | :--- |
| **`navigation`** | `speed_limit`, `route_distance`, `route_time`, `location` | Datos de ruta y posición GPS. |
| **`job`** | `cargo`, `city_src`, `city_dst`, `truck_name`, `on_job` | Detalles del flete y camión. |

### 4. `lights` & `events` (Estados)
| Objeto | Campos | Descripción |
| :--- | :--- | :--- |
| **`lights`** | `parking_brake`, `blinker_left/right`, `beam_low/high`, `hazard`, `beacon`, `cruise_control` | Testigos de cabina. |
| **`events`** | `fined`, `tollgate`, `ferry`, `train`, `refuel` | Banderas de eventos en tiempo real. |

## 🛠️ Notas de Implementación

- **Frecuencia (20Hz):** Ráfagas cada 50ms para fluidez total en agujas y luces.
- **Service Discovery:** Beacon UDP en `255.255.255.255:5555`.
- **Handshake:** Requiere validación de PIN antes de iniciar el flujo de datos.
