export const CITY_BOUNDS = { minX: -400, maxX: 500, minZ: -400, maxZ: 300 };
export const GROUND_Y = 0;
export const BUILDING_BASE_Y = 0;

export const COLORS = {
  sky_day: 0x87ceeb,
  sky_night: 0x04080f,
  ground: 0x3a4a2a,
  asphalt: 0x2a2e34,
  road_line: 0xf0e040,
  road_line_white: 0xffffff,
  water: 0x1a4a7a,
  grass: 0x3a6a30,
  sand: 0xd4c080,

  building_concrete: 0xb8b0a0,
  building_glass: 0x607090,
  building_colonial: 0xc8a96e,
  building_industrial: 0x505860,

  car_camry_white: 0xf0f0ec,
  car_camry_silver: 0xb8bcc0,
  car_gwagon_black: 0x181818,
  car_cybertruck: 0xc0c4c8,
  car_taxi_yellow: 0xf0c020,
  car_bus_white: 0xe0dcd8,
  car_hilux_red: 0xa02020,

  accent_green: 0x00c896,
  accent_gold: 0xe8b84b,

  light_warm: 0xfff0d0,
  light_cool: 0xe0eeff,
  light_street: 0xffcc66,
  light_headlight: 0xffffff,
  light_taillight: 0xff2200,
};

export const LAYERS = {
  DEFAULT: 0,
  LANDMARK: 1,
  VEHICLE: 2,
  UI: 3,
  RAYCAST: 4
};

export const LOD_DISTANCES = {
  HIGH: 150,
  MEDIUM: 300,
  LOW: 600,
  CULL: 900
};

export const DAY_NIGHT = {
  DAY: 'day',
  NIGHT: 'night'
};

export const FLOOR_HEIGHT = 3.6;
export const ROAD_WIDTH_DEFAULT = 10;
export const ROAD_LANE_WIDTH = 3.5;
export const CURB_HEIGHT = 0.15;
export const SIDEWALK_WIDTH = 2.5;
export const SIDEWALK_HEIGHT = 0.2;
