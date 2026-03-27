# TruckPadDeck - Reglas del Proyecto

## 🛠️ Entorno y Herramientas
- **Sistema Operativo:** Windows 11.
- **Terminal del Usuario:** Git Bash. Los comandos sugeridos para ejecución manual deben usar sintaxis de Bash (ej. `&&`, rutas con `/`, comillas para paréntesis).
- **Entorno Local:** PowerShell (solo para ejecución interna del agente).

## 🚩 Protocolo de Git
- **Commits:** El agente NO debe ejecutar `git commit` ni `git push` de forma autónoma.
- **Flujo:** El agente prepara el stage (`git add`), propone el mensaje de commit siguiendo el estilo del proyecto y el usuario lo ejecuta manualmente para permitir la firma (GPG) o autenticación.

## 📡 Especificaciones de Red
- **Service Discovery:** Requiere un sistema de descubrimiento automático (mDNS o UDP Broadcast en puerto 5555) para evitar IPs hardcodeadas.
- **Streaming:** WebSockets a 20Hz (puerto 42424 por defecto).

## 🎨 Estándares de UI (Mobile)
- **Framework:** Expo 54 + NativeWind v4 + React 19.
- **Arquitectura:** Feature-First.
- **Diseño:** Modo horizontal (Landscape) obligatorio para dashboards.
