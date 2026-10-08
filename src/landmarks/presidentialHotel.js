import * as THREE from 'three';
import { buildBuildingShell, buildGuestRoom, buildToiletRoom, buildKitchenRoom, buildReceptionRoom, buildConferenceRoom } from './buildingFactory.js';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeBox, makeCylinder } from '../utils/helpers.js';
import { FLOOR_HEIGHT } from '../utils/constants.js';

export function buildPresidentialHotel(landmark) {
  const group = new THREE.Group();
  const main = buildBuildingShell({ width: 35, depth: 30, floors: 6, color: 0xd4a840, roofColor: 0x907028, style: 'flat', name: 'presidential-hotel' });
  group.add(main);
  // Grand lobby
  const lobby = buildReceptionRoom(16, 12);
  lobby.position.set(0, 0, 6);
  group.add(lobby);
  // Suites per floor
  for (let floor = 1; floor <= 5; floor++) {
    for (let i = 0; i < 5; i++) {
      const suite = buildGuestRoom(6, 6);
      suite.position.set(-14 + i * 7, floor * FLOOR_HEIGHT, -8);
      group.add(suite);
    }
  }
  // Conference halls
  const conf1 = buildConferenceRoom(18, 12);
  conf1.position.set(-8, FLOOR_HEIGHT, -6);
  group.add(conf1);
  // Pool area
  buildPool(group, 18, 0, 0);
  // Gym
  buildGym(group, -16, 0, -10);
  // Restaurant with kitchen
  buildLuxuryRestaurant(group, 0, 0, -8);
  const kitchen = buildKitchenRoom(10, 8);
  kitchen.position.set(16, 0, -8);
  group.add(kitchen);
  // Spa
  buildSpa(group, -16, 0, 0);
  // Toilets
  const toilet = buildToiletRoom();
  toilet.position.set(14, 0, 8);
  group.add(toilet);

  buildLandmarkLabel(group, landmark);
  return group;
}

function buildPool(group, x, y, z) {
  const poolWater = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 6), new THREE.MeshLambertMaterial({ color: 0x2060a0, transparent: true, opacity: 0.8 }));
  poolWater.position.set(x, y + 0.25, z);
  const poolEdge = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.3, 7.2), new THREE.MeshLambertMaterial({ color: 0xc8c0b0 }));
  poolEdge.position.set(x, y, z);
  // Loungers
  for (let i = 0; i < 4; i++) {
    const lounger = makeBox(1.8, 0.12, 0.6, 0xe8d4a0);
    lounger.position.set(x - 4 + i * 2.8, y + 0.06, z + 5);
    group.add(lounger);
  }
  group.add(poolWater, poolEdge);
}

function buildGym(group, x, y, z) {
  const mat = new THREE.MeshLambertMaterial({ color: 0x3a4a5a });
  const treadmill = makeBox(0.8, 0.9, 1.8, 0x404858);
  treadmill.position.set(x, y, z);
  const bench = makeBox(1.4, 0.5, 0.5, 0x606868);
  bench.position.set(x + 3, y, z);
  group.add(treadmill, bench);
}

function buildLuxuryRestaurant(group, x, y, z) {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const table = makeBox(1.4, 0.08, 0.9, 0x6a4828);
      table.position.set(x - 7 + col * 4.5, y + 0.74, z - 4 + row * 3.5);
      group.add(table);
    }
  }
}

function buildSpa(group, x, y, z) {
  const room = makeBox(8, FLOOR_HEIGHT, 6, 0xe8e0d8);
  room.position.set(x, y, z);
  const table = makeBox(1.8, 0.8, 0.6, 0xd8c8b0);
  table.position.set(x, y, z);
  group.add(room, table);
}
