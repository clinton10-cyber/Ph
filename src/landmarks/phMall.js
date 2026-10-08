import * as THREE from 'three';
import { buildBuildingShell, buildToiletRoom, buildKitchenRoom, buildOfficeRoom } from './buildingFactory.js';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeBox } from '../utils/helpers.js';
import { FLOOR_HEIGHT } from '../utils/constants.js';

export function buildPHMall(landmark) {
  const group = new THREE.Group();
  const main = buildBuildingShell({ width: 60, depth: 50, floors: 3, color: 0xe8e0d0, roofColor: 0x6a7080, style: 'flat', name: 'ph-mall' });
  group.add(main);
  // Atrium glass roof
  const atriumRoof = new THREE.Mesh(
    new THREE.BoxGeometry(20, 0.3, 30),
    new THREE.MeshLambertMaterial({ color: 0x8ab4d4, transparent: true, opacity: 0.5 })
  );
  atriumRoof.position.set(0, FLOOR_HEIGHT * 3 + 0.2, 0);
  group.add(atriumRoof);
  // Ground floor stores
  for (let i = 0; i < 8; i++) {
    buildStoreUnit(group, -24 + i * 7, 0, -18);
    buildStoreUnit(group, -24 + i * 7, 0, 18);
  }
  // Food court tables
  buildFoodCourt(group, 0, 0, 8);
  // Escalators
  buildEscalator(group, -20, 0, 0);
  buildEscalator(group, 20, 0, 0);
  // Cinema block
  buildCinema(group, 22, FLOOR_HEIGHT * 2, -15);
  // Toilets per floor
  for (let f = 0; f < 3; f++) {
    const t = buildToiletRoom(6, 5, true);
    t.position.set(-25, f * FLOOR_HEIGHT, 22);
    group.add(t);
  }
  // Management offices
  const office = buildOfficeRoom(8, 6);
  office.position.set(25, FLOOR_HEIGHT * 2, 20);
  group.add(office);

  buildLandmarkLabel(group, landmark);
  return group;
}

function buildStoreUnit(group, x, y, z) {
  const frame = makeBox(5.5, FLOOR_HEIGHT - 0.2, 4, 0xd8d0c8);
  frame.position.set(x, y, z);
  // Glass front
  const glass = new THREE.Mesh(new THREE.BoxGeometry(4.5, FLOOR_HEIGHT - 0.5, 0.1), new THREE.MeshLambertMaterial({ color: 0x8ab4d4, transparent: true, opacity: 0.55 }));
  glass.position.set(x, y, z + (z > 0 ? -1.95 : 1.95));
  // Shelving inside
  for (let s = 0; s < 3; s++) {
    const shelf = makeBox(4.5, 0.06, 0.3, 0xb0a080);
    shelf.position.set(x, y + 0.6 + s * 0.8, z + (z > 0 ? 0.8 : -0.8));
    group.add(shelf);
  }
  group.add(frame, glass);
}

function buildFoodCourt(group, x, y, z) {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      const table = makeBox(1.2, 0.08, 0.8, 0x9a8060);
      table.position.set(x - 8 + col * 4, y + 0.74, z - 6 + row * 3.5);
      // Chairs
      for (const ox of [-0.7, 0.7]) {
        const chair = makeBox(0.44, 0.1, 0.4, 0x606878);
        chair.position.set(x - 8 + col * 4 + ox, y + 0.46, z - 6 + row * 3.5);
        group.add(chair);
      }
      group.add(table);
    }
  }
}

function buildEscalator(group, x, floor, z) {
  const mat = new THREE.MeshLambertMaterial({ color: 0xb0b8c0 });
  const geo = new THREE.BoxGeometry(2.4, 0.3, 8);
  const esc = new THREE.Mesh(geo, mat);
  esc.position.set(x, floor + FLOOR_HEIGHT / 2, z);
  esc.rotation.x = Math.atan2(FLOOR_HEIGHT, 8);
  esc.name = 'escalator';
  esc.userData.animates = true;
  group.add(esc);
}

function buildCinema(group, x, y, z) {
  const hall = makeBox(18, FLOOR_HEIGHT, 22, 0x303040);
  hall.position.set(x, y, z);
  // Screen
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(12, 7), new THREE.MeshLambertMaterial({ color: 0xf0f0ee }));
  screen.position.set(x, y + 4.5, z - 10);
  // Seats rows
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 10; col++) {
      const seat = makeBox(0.5, 0.5, 0.5, 0x402030);
      seat.position.set(x - 7 + col * 1.4, y + 0.3 + row * 0.3, z - 7 + row * 2.0);
      group.add(seat);
    }
  }
  group.add(hall, screen);
}
