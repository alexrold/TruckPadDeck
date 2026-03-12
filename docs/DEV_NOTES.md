# Notas de Desarrollo - TruckPadDeck

**Fecha:** 11 de Marzo de 2026
**Estado:** Integración de Telemetría (Backend completado, Frontend en progreso)

## 🚀 Logros Recientes
1.  **Backend (Python):** 
    - Actualizado `telemetry_reader.py` para soportar **SCS SDK Plugin Revision 12**.
    - Mapeo completo de memoria: Datos de camión, fluidos, daños, navegación y eventos.
    - Añadidos `city_src` y `city_dst` al objeto JSON.
    - Documentación técnica exhaustiva añadida al código.
2.  **Frontend (Expo):**
    - Sincronizado `scs-telemetry-types.ts` con la nueva estructura del servidor.
    - Refactorizada pantalla `Home` para evitar errores de compilación y mostrar nuevos datos (Límite de velocidad, ETA, Combustible restante).

## 📍 Próximos Pasos (Para la siguiente sesión)
1.  **Descubrimiento de IP:** Eliminar la IP hardcodeada en la App. Investigar mDNS (Zeroconf) o un simple UDP Broadcast del servidor para que la tablet encuentre el PC automáticamente en la red local.
2.  **Validación de Datos:** Crear una pantalla de "Debug" o extender la Home para visualizar *todos* los campos raw (temperaturas, daños específicos, presión de aire) y asegurar que coinciden con el juego.
3.  **Estilizado:** Configurar **TailwindCSS (NativeWind)** para mejorar la UI.
4.  **Nuevas Pantallas:** Diseñar pantallas específicas (Dashboard de Ingeniero con temperaturas, Dashboard de Logística con mapa/trabajo).

## ⚠️ Ramas Activas
- `feature/server-telemetry-integration`: Estable (Backend).
- `feature/frontend-expo`: En desarrollo (Frontend). **(Rama actual)**.

## Comandos Útiles
- Iniciar servidor: `cd server && python main.py`
- Iniciar App: `cd app && npx expo start`
