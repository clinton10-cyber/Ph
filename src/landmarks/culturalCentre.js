import * as THREE from 'three';
import { buildBuildingShell, buildOfficeRoom, buildToiletRoom, buildKitchenRoom } from './buildingFactory.js';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeBox } from '../utils/helpers.js';
import { FLOOR_HEIGHT } from '../utils/constants.js';

export function buildCulturalCentre(landmark) {
  const group = new THREE.Group();
  const main = buildBuildingShell({ width: 40, depth: 35, floors: 2, color: 0xc05030, roofColor: 0x802010, style: 'flat', name: 'cultural-centre' });
  group.add(main);
  // Performance hall (separate wing)
  buildPerformanceHall(group, 0, 0, -12);
  // Exhibition rooms
  buildExhibitionRoom(group, -15, 0, 10);
  buildExhibitionRoom(group, 15, 0, 10);
  // Interior offices and support
  for (let i = 0; i < 3; i++) {
    const office = buildOfficeRoom();
    office.position.set(-8 + i * 8, FLOOR_HEIGHT, 6);
    group.add(office);
  }
  const toilet = buildToiletRoom(5, 4, true);
  toilet.position.set(16, 0, -5);
  group.add(toilet);
  const kitchen = buildKitchenRoom();
  kitchen.position.set(-16, 0, 6);
  group.add(kitchen);

  buildLandmarkLabel(group, landmark);
  return group;
}

function buildPerformanceHall(group, x, y, z) {
  const hall = makeBox(36, FLOOR_HEIGHT * 1.8, 22, 0xb04828);
  hall.position.set(x, y, z);
  // Stage
  const stage = makeBox(16, 0.5, 7, 0x9a7040);
  stage.position.set(x, y, z - 7);
  // Seating rows
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 14; col++) {
      const seat = makeBox(0.5, 0.5, 0.45, [0x802018, 0x902820, 0xa03030][col % 3]);
      seat.position.set(x - 9 + col * 1.35, y + 0.25 + row * 0.25, z - 1 + row * 2.2);
      group.add(seat);
    }
  }
  // Lighting rig
  const rig = makeBox(14, 0.3, 0.3, 0x303030);
  rig.position.set(x, y + FLOOR_HEIGHT * 1.6, z - 5);
  group.add(hall, stage, rig);
}

function buildExhibitionRoom(group, x, y, z) {
  const room = makeBox(12, FLOOR_HEIGHT, 10, 0xd0c8c0);
  room.position.set(x, y, z);
  // Display cases
  for (let i = 0; i < 3; i++) {
    const displayCase = makeBox(1.2, 1.8, 0.8, 0x9ab4d4);
    displayCase.position.set(x - 3 + i * 3, y, z);
    group.add(displayCase);
  }
  group.add(room);
}
