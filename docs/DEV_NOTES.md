# Notas de Desarrollo - TruckPadDeck

**Fecha:** 12 de Marzo de 2026
**Estado:** Servidor Modularizado (Backend v1.2) - Frontend en Reestructuración

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
1.  **Normalización de Unidades (CRÍTICO):** Investigar la detección automática de Metric vs Imperial en el SDK.
    - El servidor debe proveer datos normalizados o informar a la App de la preferencia del usuario (Km/h vs Mph, Litros vs Galones).
    - Verificar flags de configuración en la Zona 2 (UI/Config) de la memoria compartida.
2.  **Nueva Estructura App:** Iniciar `app/` desde cero con una arquitectura de carpetas limpia y coherente.
3.  **Modularización Frontend:** Separar la lógica de WebSocket del UI para permitir múltiples dashboards (Ingeniero, Logística, Dashboard Clásico).

## ⚠️ Estado de Ramas
- `main`: Estable y Modularizada. (Norte actual).
- `old-app/`: Referencia histórica (Ignorada).

## Comandos Útiles
- Iniciar servidor: `cd server && python main.py`
- Iniciar App: `cd app && npx expo start`
