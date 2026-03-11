/**
 * Definiciones de tipos para TruckPadDeck - Telemetría SCS (ETS2/ATS)
 * Basado en el esquema de datos del Servidor v12 (Revision 12).
 * 
 * Este archivo actúa como el "contrato" entre el servidor Python y la App Expo.
 */

export interface SCSTelemetry {
    sdk_active: boolean;    // ¿El simulador está enviando datos?
    paused: boolean;        // ¿El juego está en pausa o menú?
    timestamp: string;      // ISO 8601 del servidor para medir latencia
    game: GameInfo;         // Datos del motor del juego
    truck: TruckData;       // El camión y su estado físico completo
    navigation: Navigation; // GPS, rutas y límites de velocidad
    lights: Lights;         // Estado de interruptores y bombillas
    job: JobInfo;           // Información de carga y remolque
    events: GameEvents;     // Eventos instantáneos (multas, peajes, ferries)
    status: "connected" | "disconnected" | "error";
}

export interface GameInfo {
    time: number;           // Tiempo total del juego en minutos
    plugin_version: number; // Revisión del SDK (actualmente 12)
}

export interface TruckData {
    speed: number;          // Velocidad en km/h
    rpm: number;            // Revoluciones por minuto actuales
    rpm_max: number;        // Límite rojo del motor (útil para el tacómetro)
    gear: number;           // Marcha física (-1 R, 0 N, 1-18)
    gear_dashboard: number; // Representación visual (ej: 4L, 4H)
    fuel: {
        amount: number;             // Litros actuales
        capacity: number;           // Capacidad total del tanque
        range: number;              // Autonomía estimada en km
        avg_consumption: number;    // Consumo promedio L/km
    };
    adblue: number;         // Nivel de líquido AdBlue
    inputs: {
        throttle: number;   // Acelerador 0-100%
        brake: number;      // Freno 0-100%
        clutch: number;     // Embrague 0-100%
        steer: number;      // Volante -100 a 100%
    };
    fluids: {
        air_pressure: number;
        oil_pressure: number;
        oil_temperature: number;
        water_temperature: number;
        battery_voltage: number;
    };
    damage: {
        engine: number;       // Desgaste motor 0-100%
        transmission: number; // Desgaste transmisión 0-100%
        cabin: number;        // Desgaste cabina 0-100%
        chassis: number;      // Desgaste chasis 0-100%
        wheels: number;       // Desgaste neumáticos 0-100%
    };
    odometer: number;       // Kilometraje total del camión
}

export interface Navigation {
    speed_limit: number;    // Límite de velocidad de la vía en km/h
    route_distance: number; // Distancia restante al destino en metros
    route_time: number;     // Tiempo estimado de llegada en minutos
    location: {
        x: number;
        y: number;
        z: number;
    };
    heading: number;        // Orientación del vehículo (0.0 a 1.0)
}

export interface Lights {
    parking_brake: boolean;
    motor_brake: boolean;
    blinker_left: boolean;
    blinker_right: boolean;
    beam_low: boolean;
    beam_high: boolean;
    beacon: boolean;
    brake: boolean;
    hazard: boolean;
    cruise_control: boolean;
}

export interface JobInfo {
    cargo: string;          // Nombre de la carga actual
    city_src: string;       // Ciudad de Origen
    city_dst: string;       // Ciudad de Destino
    truck_name: string;     // Modelo/Marca del camión
    on_job: boolean;        // ¿Tiene un contrato activo?
    trailer_attached: boolean; // ¿Hay un remolque enganchado?
}

export interface GameEvents {
    fined: boolean;         // True si se detecta una multa
    tollgate: boolean;      // True en zona de peaje
    ferry: boolean;         // True en embarque de ferry
    train: boolean;         // True en transporte por tren
    refuel: boolean;        // True mientras se está repostando combustible
}
