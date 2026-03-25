# TruckPadDeck Server - Documentación Técnica (v0.1.0-beta)

Este módulo es el núcleo encargado de leer la memoria compartida del SDK de SCS Telemetry y transmitirla en tiempo real mediante WebSockets.

## 📊 Estructura del JSON (Contrato de Datos 1:1)

Cada mensaje enviado por el servidor es un objeto JSON con la siguiente estructura exacta:

### 1. `config` (Configuración Dinámica)

| Campo               | Tipo     | Descripción                                      |
| :------------------ | :------- | :----------------------------------------------- |
| `game`              | `string` | "ETS2" o "ATS".                                  |
| `version`           | `string` | Versión del juego (ej: "1.50").                  |
| `units.is_metric`   | `bool`   | Refleja la preferencia de distancia del usuario. |
| `units.distance`    | `string` | "km" o "miles".                                  |
| `units.fuel`        | `string` | "l" o "gal".                                     |
| `units.temperature` | `string` | "C" o "F".                                       |
| `units.pressure`    | `string` | "bar", "psi" o "kgcm2".                          |

### 2. `truck` (Telemetría con Unidades Dinámicas)

Todos los valores numéricos están convertidos según las preferencias del juego.

| Objeto / Campo    | Sub-campo         | Tipo     | Descripción / Unidad                  |
| :---------------- | :---------------- | :------- | :------------------------------------ |
| **`speed`**       | `value`           | `float`  | Velocidad real (Km/h o Mph).          |
|                   | `unit`            | `string` | "km/h" o "mph".                       |
| **`rpm`**         | `value`           | `int`    | Revoluciones actuales.                |
|                   | `max`             | `int`    | Límite del motor.                     |
| **`gear`**        | `physical`        | `int`    | Marcha física (-1 a 18).              |
|                   | `dashboard`       | `string` | Texto del tablero (ej: "4L", "R1").   |
| **`fuel`**        | `value`           | `float`  | Cantidad (Litros o Galones).          |
|                   | `unit`            | `string` | "l" o "gal".                          |
|                   | `capacity`        | `float`  | Capacidad total del tanque.           |
|                   | `range`           | `float`  | Autonomía estimada.                   |
|                   | `range_unit`      | `string` | "km" o "miles".                       |
|                   | `avg_consumption` | `object` | `{ value, unit }` (L/100km o MPG).    |
| **`odometer`**    | `value`           | `float`  | Distancia total acumulada.            |
|                   | `unit`            | `string` | "km" o "miles".                       |
| **`temperature`** | `water`           | `object` | `{ value, unit }` (°C o °F).          |
|                   | `oil`             | `object` | `{ value, unit }` (°C o °F).          |
| **`pressure`**    | `air`             | `object` | `{ value, unit }` (bar, psi, kg/cm²). |
|                   | `oil`             | `object` | `{ value, unit }` (bar, psi, kg/cm²). |

### 3. `status` (Estados de Cabina)

Campos booleanos (`true`/`false`) para indicadores visuales:

- `parking_brake`, `motor_brake`.
- `blinker_l`, `blinker_r`.
- `lights_low`, `lights_high`, `lights_beacon`, `lights_hazard`.
- `cruise_control`.

## 🛠️ Notas de Implementación

- **Frecuencia:** El servidor envía una snapshot cada vez que detecta un cambio en la memoria (aprox. 60fps).
- **Conversiones:** Todas las conversiones matemáticas (m/s a km/h, litros a galones, etc.) se realizan en el servidor para mantener la App ligera.
- **Detección:** Si el usuario cambia las unidades en el menú del juego, el JSON cambiará automáticamente en el siguiente frame.
