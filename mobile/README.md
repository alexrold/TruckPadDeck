# 🚀 TruckPadDeck Mobile (Expo)

Este directorio contiene la aplicación móvil de TruckPadDeck construida con **Expo + React Native + TypeScript**.

---

## 🧭 Estructura principal

- `app/` - Rutas y pantallas de la app (Expo Router).
- `src/` - Código fuente principal:
  - `components/` - Componentes UI reutilizables (botones, cards, layout, etc.).
  - `features/` - Features (dashboards) organizados por responsabilidad.
  - `store/` - Estado global (Zustand) y tipados de telemetría.

---

## ▶️ Ejecutar la app (desarrollo)

1. Instalar dependencias:

   ```bash
   cd mobile
   bun install
   ```

2. Iniciar Expo:

   ```bash
   cd mobile
   bun run start
   ```

3. Conectar el dispositivo:

- Usa Expo Go en Android/iOS, o el simulador.
- Escanea el QR que muestra Expo.

---

## 🔌 Conexión al servidor de telemetría

La app se conecta al servidor Python usando un **WebSocket**.

1. Asegúrate de tener el servidor ejecutándose (`server/main.py`).
2. El servidor anuncia su IP/puerto mediante **UDP Beacon + mDNS**.
3. La app detecta el servidor automáticamente y muestra el PIN para emparejar.

---

## 🧱 Cómo agregar un nuevo Dashboard (feature)

Se recomienda el siguiente patrón para cada dashboard:

```
src/features/<nombre>/
  components/   # UI específica del dashboard
  hooks/        # Hooks React específicos de esa feature
  screens/      # Pantallas/routers de Expo Router
  services/     # Lógica de negocio / servicios
  types.ts      # Tipos (si los necesita)
  index.ts      # Exportaciones públicas del módulo
```

Esto mantiene cada dashboard aislado y fácil de mantener.

---

## 🛠️ Linter / Formateo

Ejecuta:

```bash
cd mobile
npm run lint
npm run format
```

---

## 📌 Notas rápidas

- El estado global de telemetría se encuentra en `src/store/telemetry-store.ts`.
- Si necesitas convertir unidades (km/mi, C/F, bar/psi), crea utilitarios en `src/lib/` o `src/services/`.

---

¡Listo! Si necesitas una plantilla de feature (archivos + estructura) para copiar, avisa y te la genero.
