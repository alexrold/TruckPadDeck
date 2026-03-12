/**
 * Mapeo de Offsets Validado para RenCloud scs-sdk-plugin (v12)
 * Basado en el código fuente scs-telemetry-common.hpp.
 */

export const SCS_TELEMETRY_OFFSETS = {
  // --- ZONA 1: CONTROL (0-39) ---
  SDK_ACTIVE: 0,              // bool
  PAUSED: 4,                  // bool
  GAME_TIME: 8,               // uint64 (time)

  // --- ZONA 3: INTEGERS (500-699) ---
  // common_i empieza en 500 (restStop: 4 bytes)
  // truck_i empieza en 504
  GEAR: 504,                  // int32 (gear)
  GEAR_DASHBOARD: 508,        // int32

  // --- ZONA 4: FLOATS (700-1499) ---
  // truck_f empieza en el offset 948
  SPEED: 948,                 // float (m/s)
  RPM: 952,                   // float
  USER_STEER: 956,            // float
  USER_THROTTLE: 960,         // float (0.0 - 1.0)
  USER_BRAKE: 964,            // float
  USER_CLUTCH: 968,           // float
  FUEL: 1000,                 // float (Offset 13: 948 + 13*4)
  FUEL_AVG_CONS: 1004,        // float
  TRUCK_ODOMETER: 1056,       // float (Offset 27: 948 + 27*4)
  CRUISE_CONTROL_SPEED: 988,  // float (Offset 10: 948 + 10*4)

  // --- ZONA 5: BOOLEANS (1500-1639) ---
  // config_b (1500-1565). truck_b empieza en 1566
  PARK_BRAKE: 1566,           // bool
  MOTOR_BRAKE: 1567,          // bool
  BLINKER_L_ACTIVE: 1578,     // bool (1566 + 12)
  BLINKER_R_ACTIVE: 1579,     // bool (1566 + 13)
  LIGHT_LOW_BEAM: 1583,       // bool (1566 + 17)
  LIGHT_HIGH_BEAM: 1584,      // bool (1566 + 18)
  LIGHT_BEACON: 1585,         // bool (1566 + 19)
  LIGHT_HAZARD: 1588,         // bool (1566 + 22)
  CRUISE_CONTROL_ON: 1589,    // bool (1566 + 23)

  // --- ZONA 8: POSICIÓN (2200-2299) ---
  COORD_X: 2200,              // double
  COORD_Y: 2208,              // double
  COORD_Z: 2216,              // double
  ROTATION_Z: 2240,           // double (Heading)

  // --- ZONA 9: STRINGS (2300-3999) ---
  TRUCK_NAME: 2492,           // char[64] (2300 + 3*64)
  CARGO_NAME: 2620,           // char[64] (2300 + 5*64)
  CITY_DST: 2748,             // char[64] (2300 + 7*64)
  CITY_SRC: 3004,             // char[64] (2300 + 11*64)
};
