import * as THREE from 'three';
import { buildBuildingShell, buildGuestRoom, buildToiletRoom, buildKitchenRoom, buildReceptionRoom } from './buildingFactory.js';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeBox } from '../utils/helpers.js';
import { FLOOR_HEIGHT } from '../utils/constants.js';

export function buildBluePeterHotel(landmark) {
  const group = new THREE.Group();
  const main = buildBuildingShell({ width: 30, depth: 25, floors: 4, color: 0x4878a8, roofColor: 0x304060, style: 'flat', name: 'blue-peter-hotel' });
  group.add(main);
  // Reception lobby
  const reception = buildReceptionRoom(12, 8);
  reception.position.set(0, 0, 4);
  group.add(reception);
  // Guest rooms per floor
  for (let floor = 1; floor <= 3; floor++) {
    for (let i = 0; i < 4; i++) {
      const room = buildGuestRoom();
      room.position.set(-11 + i * 7.5, floor * FLOOR_HEIGHT, -6);
      group.add(room);
    }
  }
  // Restaurant on ground floor
  buildRestaurant(group, 0, 0, -8);
  // Kitchen
  const kitchen = buildKitchenRoom(8, 6);
  kitchen.position.set(12, 0, -8);
  group.add(kitchen);
  // Laundry
  buildLaundry(group, -12, 0, -8);
  // Toilets
  const toilet = buildToiletRoom();
  toilet.position.set(12, 0, 6);
  group.add(toilet);

  buildLandmarkLabel(group, landmark);
  return group;
}

function buildRestaurant(group, x, y, z) {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const table = makeBox(1.4, 0.08, 0.9, 0x9a7050);
      table.position.set(x - 6 + col * 4, y + 0.74, z - 3 + row * 3.5);
      group.add(table);
    }
  }
}

function buildLaundry(group, x, y, z) {
  const room = makeBox(5, FLOOR_HEIGHT, 4, 0xd0c8c0);
  room.position.set(x, y, z);
  for (let i = 0; i < 3; i++) {
    const machine = makeBox(0.7, 0.9, 0.7, 0xc0c8d0);
    machine.position.set(x - 1.5 + i * 1.5, y, z);
    group.add(machine);
  }
  group.add(room);
}
