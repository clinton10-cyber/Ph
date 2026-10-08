import * as THREE from 'three';
import { buildCamry, buildGWagon, buildCybertruck, buildHilux, buildCorolla, buildTaxi, buildBus, buildTruck } from './carModels.js';
import { COLORS } from '../utils/constants.js';
import { PROFILE } from '../utils/deviceProfile.js';

const BUILDERS = {
  camry: () => buildCamry([0xf0f0ec, 0xb8bcc0, 0x202428, 0xa02020, 0x204080][Math.floor(Math.random() * 5)]),
  gwagon: () => buildGWagon([0x181818, 0xf0f0ec, 0x204080, 0x802020][Math.floor(Math.random() * 4)]),
  cybertruck: () => buildCybertruck(0xc0c4c8),
  hilux: () => buildHilux([0xa02020, 0x2040a0, 0x204820, 0x808080][Math.floor(Math.random() * 4)]),
  corolla: () => buildCorolla([0xf0f0ec, 0xb8bcc0, 0x202428, 0x809040][Math.floor(Math.random() * 4)]),
  taxi: () => buildTaxi(0xf0c020),
  bus: () => buildBus(0xe0dcd8),
  truck: () => buildTruck(0x405868)
};

export function buildAllVehicles(scene, routes, parkingLots) {
  const vehicles = [];

  // Traffic vehicles on routes
  routes.forEach(route => {
    const count = route.vehicleTypes.length;
    route.vehicleTypes.forEach((type, i) => {
      const car = spawnRouteVehicle(type, route, i / count);
      if (car) {
        scene.add(car.group);
        vehicles.push(car);
      }
    });
    // Add extra random traffic (none on mobile)
    for (let extra = 0; extra < PROFILE.vehicleRouteExtras; extra++) {
      const type = route.vehicleTypes[Math.floor(Math.random() * route.vehicleTypes.length)];
      const car = spawnRouteVehicle(type, route, Math.random());
      if (car) {
        scene.add(car.group);
        vehicles.push(car);
      }
    }
  });

  // Parked cars in lots (heavily reduced on mobile)
  parkingLots.forEach(lot => {
    const scaledLot = PROFILE.parkingSlotMultiplier < 1
      ? { ...lot, slots: Math.max(1, Math.ceil(lot.slots * PROFILE.parkingSlotMultiplier)) }
      : lot;
    spawnParkedCars(scene, scaledLot);
  });

  return vehicles;
}

function spawnRouteVehicle(type, route, progress) {
  const builder = BUILDERS[type] || BUILDERS.camry;
  const group = builder();

  const curve = buildCurveFromRoute(route);
  if (!curve) return null;

  // Cache refs to avoid per-frame traverse
  const wheels = [];
  const headlights = [];
  const taillights = [];
  group.traverse(child => {
    if (child.name === 'wheel' || child.name === 'rim') wheels.push(child);
    else if (child.name === 'headlight' && child.material) headlights.push(child);
    else if (child.name === 'taillight' && child.material) taillights.push(child);
  });

  return {
    group,
    curve,
    progress,
    speed: route.speed * (0.85 + Math.random() * 0.3),
    totalLength: curve.getLength(),
    type,
    isParked: false,
    headlightsOn: false,
    wheels,
    headlights,
    taillights
  };
}

function buildCurveFromRoute(route) {
  if (!route.points || route.points.length < 2) return null;
  const pts = route.points.map(p => new THREE.Vector3(p[0], p[1], p[2]));
  return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
}

function spawnParkedCars(scene, lot) {
  const types = ['camry', 'corolla', 'gwagon', 'hilux', 'taxi'];
  const cols = Math.min(Math.floor(lot.area.w / 5.5), Math.ceil(Math.sqrt(lot.slots)));
  const rows = Math.ceil(lot.slots / cols);

  let count = 0;
  for (let row = 0; row < rows && count < lot.slots; row++) {
    for (let col = 0; col < cols && count < lot.slots; col++) {
      if (Math.random() < 0.75) {
        const type = types[Math.floor(Math.random() * types.length)];
        const car = BUILDERS[type]();
        const x = lot.position.x - (cols * 5.5) / 2 + col * 5.5 + 2.8;
        const z = lot.position.z - (rows * 3.5) / 2 + row * 3.5 + 1.8;
        car.position.set(x, 0, z);
        car.rotation.y = row % 2 === 0 ? 0 : Math.PI;
        scene.add(car);
        count++;
      }
    }
  }
}

export function updateVehicles(vehicles, delta, isNight) {
  vehicles.forEach(v => {
    if (v.isParked) return;

    // Advance progress along spline
    const dist = (v.speed * delta) / v.totalLength;
    v.progress = (v.progress + dist) % 1;

    const point = v.curve.getPoint(v.progress);
    const tangent = v.curve.getTangent(v.progress);

    v.group.position.copy(point);
    v.group.position.y = 0;

    // Orient to face direction of travel
    if (tangent.lengthSq() > 0.0001) {
      const angle = Math.atan2(tangent.x, tangent.z);
      v.group.rotation.y = angle;
    }

    // Rotate wheels (cached refs — no traverse)
    const wheelRot = v.speed * delta * 1.8;
    for (let w = 0; w < v.wheels.length; w++) v.wheels[w].rotation.x += wheelRot;

    // Headlights on at night (cached refs — no traverse)
    if (isNight !== v.headlightsOn) {
      v.headlightsOn = isNight;
      const hIntensity = isNight ? 1.0 : 0.0;
      const tIntensity = isNight ? 0.8 : 0.0;
      for (let h = 0; h < v.headlights.length; h++) v.headlights[h].material.emissiveIntensity = hIntensity;
      for (let t = 0; t < v.taillights.length; t++) v.taillights[t].material.emissiveIntensity = tIntensity;
    }
  });
}
