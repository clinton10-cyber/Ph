// Vehicle spline routes - arrays of [x, y, z] world points
// y is 0 (ground level) for all road vehicles

export const VEHICLE_ROUTES = [
  {
    id: 'route-aba-road',
    roadId: 'aba-road',
    direction: 1,
    speed: 12,
    vehicleTypes: ['camry', 'corolla', 'taxi'],
    points: [
      [0, 0, -280], [20, 0, -200], [40, 0, -100], [60, 0, -80],
      [80, 0, 0], [100, 0, 80], [120, 0, 140]
    ]
  },
  {
    id: 'route-aba-road-return',
    roadId: 'aba-road',
    direction: -1,
    speed: 10,
    vehicleTypes: ['gwagon', 'hilux', 'bus'],
    points: [
      [120, 0, 140], [100, 0, 80], [80, 0, 0], [60, 0, -80],
      [40, 0, -100], [20, 0, -200], [0, 0, -280]
    ]
  },
  {
    id: 'route-rumuola',
    roadId: 'rumuola-road',
    direction: 1,
    speed: 10,
    vehicleTypes: ['camry', 'corolla', 'truck'],
    points: [
      [-200, 0, -60], [-80, 0, -40], [0, 0, 0], [80, 0, 20],
      [140, 0, 40], [220, 0, -80]
    ]
  },
  {
    id: 'route-trans-amadi',
    roadId: 'trans-amadi',
    direction: 1,
    speed: 14,
    vehicleTypes: ['truck', 'hilux', 'gwagon'],
    points: [
      [100, 0, -200], [160, 0, -160], [220, 0, -100],
      [280, 0, -60], [320, 0, 0], [340, 0, 80]
    ]
  },
  {
    id: 'route-airport',
    roadId: 'airport-access',
    direction: 1,
    speed: 16,
    vehicleTypes: ['camry', 'gwagon', 'sienna'],
    points: [
      [200, 0, -200], [250, 0, -240], [300, 0, -260], [380, 0, -280]
    ]
  },
  {
    id: 'route-waterfront',
    roadId: 'waterfront-road',
    direction: 1,
    speed: 8,
    vehicleTypes: ['camry', 'taxi', 'corolla'],
    points: [
      [-300, 0, 200], [-240, 0, 170], [-180, 0, 150],
      [-120, 0, 120], [-60, 0, 100], [0, 0, 80]
    ]
  },
  {
    id: 'route-eastern-bypass',
    roadId: 'eastern-bypass',
    direction: 1,
    speed: 18,
    vehicleTypes: ['truck', 'hilux', 'bus'],
    points: [
      [260, 0, -80], [280, 0, 0], [300, 0, 60], [320, 0, 140], [340, 0, 200]
    ]
  }
];

export const PARKING_LOTS = [
  { id: 'mall-parking', position: { x: 140, z: 100 }, slots: 20, area: { w: 40, d: 30 } },
  { id: 'stadium-parking', position: { x: -160, z: -80 }, slots: 30, area: { w: 50, d: 25 } },
  { id: 'airport-parking', position: { x: 340, z: -300 }, slots: 40, area: { w: 60, d: 30 } },
  { id: 'gov-house-parking', position: { x: 80, z: -100 }, slots: 12, area: { w: 30, d: 20 } },
  { id: 'hotel-parking', position: { x: -110, z: 30 }, slots: 15, area: { w: 25, d: 20 } },
  { id: 'university-parking', position: { x: 220, z: 160 }, slots: 25, area: { w: 40, d: 20 } },
  { id: 'refinery-parking', position: { x: 320, z: 80 }, slots: 20, area: { w: 35, d: 20 } }
];
