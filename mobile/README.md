# TruckPadDeck (Mobile)

📱 Aplicación móvil construida con **Expo + React Native + Expo Router**.

Este repositorio sigue una arquitectura modular: cada dashboard está separado en su propio módulo dentro de `src/modules/`, y la navegación principal está gestionada por `expo-router` usando la convención de carpetas en `app/`.

---

## 🧭 Estructura principal del proyecto

```text
├── app/                                ← Enrutamiento (Expo Router)
│   ├── (tabs)/
│   │   ├── _layout.tsx                 ← Menú principal (Tabs)
│   │   ├── index.tsx                   ← Dashboard principal / Biblioteca
│   │   ├── settings.tsx                ← Configuración (Usuario, Preferencias)
│   │   └── debug.tsx                   ← Herramientas de diagnóstico
│   ├── dashboards/
│   │   └── [id].tsx                    ← Visor dinámico de tableros
│   ├── _layout.tsx                     ← Root Layout (Providers & Fuentes)
│   └── +not-found.tsx                  ← Manejo de rutas inexistentes
│
├── assets/                             ← Recursos físicos estáticos
│   ├── fonts/                          ← Tipografías (.ttf, .otf)
│   └── images/                         ← Iconos, splash y placeholders
│
├── components/                         ← UI Atómica (Componentes globales)
│   ├── themed/                         ← Sistema @themed (Soporte nativo de temas)
│   │   ├── ThemedButton.tsx            ← Botones con variantes dinámicas
│   │   ├── ThemedCard.tsx              ← Contenedores con elevación y bordes
│   │   ├── ThemedIcon.tsx              ← Iconos reactivos al color del tema
│   │   ├── ThemedInfoItem.tsx          ← Pares de datos (Icono-Etiqueta-Valor)
│   │   ├── ThemedSwitch.tsx            ← Interruptor deslizante personalizado
│   │   ├── ThemedText.tsx              ← Tipografía estandarizada
│   │   ├── ThemedView.tsx              ← Contenedores base con Safe Area
│   │   └── index.ts                    ← Barrel de exportación
│   └── ExternalLink.tsx                ← Enlaces externos seguros
│
├── constants/                          ← Datos estáticos y configuraciones
│   ├── Colors.ts                       ← Paleta de colores oficial
│   ├── DashboardDataSeed.ts            ← Catálogo de dashboards disponibles
│   └── defaultDashboardImage.ts        ← Imagen de respaldo para tarjetas
│
├── hooks/                              ← Hooks de infraestructura UI
│   ├── themed/
│   │   └── useThemeColor.ts            ← Consumo reactivo de la paleta
│   └── useColorScheme.ts               ← Lógica de esquema de color (Híbrido)
│
└── src/                                ← Lógica de Dominio e Integración
    ├── features/                       ← Módulos por dominio funcional
    │   ├── home/                       ← Lógica de Biblioteca y Búsqueda
    │   └── dashboard/                  ← Lógica de Detalle y Gestión
    ├── store/                          ← Estado global (Zustand)
    │   ├── useConnectionStore.ts       ← Gestión de Red y Handshake
    │   ├── useTelemetryStore.ts        ← Datos en tiempo real (20Hz)
    │   ├── useUIStore.ts               ← Preferencias (Idioma, Tema)
    │   └── ...                         ← Favoritos, Descargas
    ├── i18n/                           ← Internacionalización
    │   ├── es.ts | en.ts               ← Diccionarios de idiomas
    │   └── index.ts                    ← Orquestador i18next
    ├── hooks/                          ← Hooks de lógica reutilizable
    │   ├── useTelemetryConnection.ts   ← Motor WebSocket
    │   ├── useHardwareManager.ts       ← Control de WakeLock
    │   └── useTranslation.ts           ← Acceso tipado a textos
    ├── lib/                            ← Utilidades y Helpers
    │   └── utils.ts                    ← Tailwind Merge y funciones puras
    └── modules/                        ← Catálogo de Skins (Dashboards Reales)
        ├── shared/                     ← Componentes comunes entre skins
        └── dashboard-x/                ← Implementación visual específica
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
