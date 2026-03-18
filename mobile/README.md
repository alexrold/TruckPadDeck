# TruckPadDeck (Mobile)

📱 Aplicación móvil construida con **Expo + React Native + Expo Router**.

Este repositorio sigue una arquitectura modular: cada dashboard está separado en su propio módulo dentro de `src/modules/`, y la navegación principal está gestionada por `expo-router` usando la convención de carpetas en `app/`.

---

## 🧭 Estructura principal del proyecto

```
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          ← menú principal
│   │   ├── index.tsx            ← dashboard principal
│   │   ├── settings.tsx         ← configuración (nick, país)
│   │   └── debug.tsx            ← debug + conexión
│   ├── dashboards/
│   │   ├── _layout.tsx
│   │   └── [id].tsx             ← router genérico de dashboards
│   └── _layout.tsx              ← ConnectionProvider aquí
│
├── src/
│   ├── modules/                 ← cada dashboard es un módulo
│   │   ├── shared/              ← recursos entre ALGUNOS dashboards
│   │   │   ├── fonts/
│   │   │   └── components/
│   │   ├── dashboard-a/
│   │   │   ├── index.tsx
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   │   └── useDashboardAFonts.ts
│   │   │   └── theme.ts         ← colores/fuentes SOLO de este dash
│   │   ├── dashboard-b/
│   │   │   └── ...
│   │   └── dashboard-c/
│   │       └── ...
│   │
│   ├── components/
│   │   ├── themed/              ← componentes base globales
│   │   │   ├── ThemedText.tsx
│   │   │   ├── ThemedView.tsx
│   │   │   └── index.ts         ← barrel
│   │   └── ui/                  ← botones, modales globales
│   │
│   ├── context/
│   │   └── ConnectionContext.tsx ← modal de conexión global
│   │
│   ├── hooks/                   ← hooks globales
│   │   ├── useColorScheme.ts
│   │   └── useThemeColor.ts
│   │
│   └── constants/
│       └── Colors.ts            ← solo colores globales
│
└── assets/
    └── fonts/                   ← todos los .ttf físicos aquí
        ├── Orbitron-Bold.ttf
        └── RobotoMono.ttf
```

---

## 🚀 Ejecutar la aplicación

> Esta app se desarrolla usando **bun** para la gestión de paquetes y ejecución de scripts, pero a continuación se muestran los comandos **npm** que están definidos en `package.json`.

📦 **Instalar dependencias**

```bash
npm install
```

🚀 **Iniciar el servidor de desarrollo**

```bash
npm start
```

📱 **Ejecutar en la plataforma deseada**

```bash
npm run android
npm run ios
npm run web
```

---

## 🗂️ Nomenclatura clave

- **`app/`**: carpetas y archivos usados por `expo-router` para definir rutas.
- **`src/modules/`**: cada dashboard se trata como un módulo independiente.
- **`src/components/themed/`**: componentes base que consumen el esquema de temas.
- **`src/context/ConnectionContext.tsx`**: proveedor global de conexión (presumiblemente usado para manejar el estado de conexión y modal).
- **`src/constants/Colors.ts`**: colores globales compartidos por toda la app.

---

## 🧩 Añadir un nuevo dashboard

1. Crear una carpeta dentro de `src/modules/` (por ejemplo `dashboard-d/`).
2. Añadir el punto de entrada `index.tsx` y los componentes/hooks necesarios.
3. Añadir rutas de `expo-router` (p.ej. usando `app/dashboards/[id].tsx`) para que el dashboard sea accesible.

---

## 📝 Notas

- La carpeta `src/modules/shared/` está pensada para recursos que se comparten entre varios dashboards (por ejemplo, componentes UI o fuentes compartidas).
- Mantén los colores y tipografías específicos de cada dashboard en su `theme.ts` correspondiente para evitar acoplamientos.

---

¡Listo! Si necesitas que adapte este README a otra estructura o que añada secciones (por ejemplo: testing, DEPLOY, arquitectura de datos, etc.), solo dime.
