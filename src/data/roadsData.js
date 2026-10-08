// Road network for Port Harcourt - points in world space [x, z]
// Roads connect all 20 landmarks in an approximate real-world topology

export const ROADS = [
  // Aba Road - main spine north-south
  {
    id: 'aba-road',
    name: 'Aba Road',
    width: 14,
    type: 'highway',
    points: [
      [0, -300], [20, -200], [40, -100], [60, -80], [80, 0], [100, 80], [120, 140], [140, 220]
    ]
  },
  // Rumuola Road - east-west connector
  {
    id: 'rumuola-road',
    name: 'Rumuola Road',
    width: 10,
    type: 'main',
    points: [
      [-200, -60], [-140, -60], [-80, -40], [0, 0], [80, 20], [140, 40], [220, -80], [300, -100]
    ]
  },
  // Trans-Amadi Industrial Layout Road
  {
    id: 'trans-amadi',
    name: 'Trans-Amadi Road',
    width: 12,
    type: 'highway',
    points: [
      [100, -200], [160, -160], [220, -100], [280, -60], [320, 0], [340, 80], [340, 160]
    ]
  },
  // Stadium Road
  {
    id: 'stadium-road',
    name: 'Stadium Road',
    width: 10,
    type: 'main',
    points: [
      [-180, -100], [-150, -80], [-140, -60], [-120, -20], [-80, 20], [-40, 60]
    ]
  },
  // GRA perimeter road
  {
    id: 'gra-road',
    name: 'GRA Road',
    width: 9,
    type: 'main',
    points: [
      [-100, -200], [-80, -160], [-60, -100], [-40, -60], [-20, -20], [0, 0]
    ]
  },
  // Waterfront road
  {
    id: 'waterfront-road',
    name: 'Waterfront Road',
    width: 8,
    type: 'local',
    points: [
      [-300, 200], [-240, 170], [-180, 150], [-120, 120], [-60, 100], [0, 80]
    ]
  },
  // Airport access road
  {
    id: 'airport-access',
    name: 'Airport Access Road',
    width: 12,
    type: 'highway',
    points: [
      [200, -200], [250, -240], [300, -260], [350, -270], [380, -280]
    ]
  },
  // Mile One road
  {
    id: 'mile-one-road',
    name: 'Mile One / Ikwerre Road',
    width: 14,
    type: 'highway',
    points: [
      [40, -220], [70, -180], [100, -140], [120, -100], [140, -60], [160, 0], [180, 60], [200, 140]
    ]
  },
  // Eastern bypass to Onne
  {
    id: 'eastern-bypass',
    name: 'Eastern Bypass',
    width: 12,
    type: 'highway',
    points: [
      [260, -80], [280, 0], [300, 60], [320, 140], [340, 200]
    ]
  },
  // Local connector GRA to mall
  {
    id: 'gra-mall-connector',
    name: 'Old GRA / Forces Avenue',
    width: 8,
    type: 'local',
    points: [
      [-60, -160], [-20, -120], [40, -60], [80, 0], [120, 60], [140, 80]
    ]
  }
];

export const INTERSECTIONS = [
  { id: 'rumuokoro', position: { x: 220, z: -80 }, type: 'roundabout', radius: 18 },
  { id: 'mile-one-junction', position: { x: 100, z: -140 }, type: 'crossroads' },
  { id: 'stadium-junction', position: { x: -140, z: -60 }, type: 'crossroads' },
  { id: 'gra-junction', position: { x: -60, z: -100 }, type: 'crossroads' },
  { id: 'waterfront-junction', position: { x: -180, z: 120 }, type: 't-junction' },
  { id: 'city-hall-junction', position: { x: 0, z: 0 }, type: 'crossroads' },
  { id: 'refinery-junction', position: { x: 280, z: 60 }, type: 'crossroads' }
];
