import * as THREE from 'three';
import { buildBuildingShell, buildOfficeRoom, buildToiletRoom, buildKitchenRoom } from './buildingFactory.js';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeBox, makeCylinder } from '../utils/helpers.js';
import { FLOOR_HEIGHT } from '../utils/constants.js';

export function buildOnnePort(landmark) {
  const group = new THREE.Group();
  // Dock / water
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 40),
    new THREE.MeshLambertMaterial({ color: 0x1a4a7a, transparent: true, opacity: 0.85 })
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, 0.02, 45);
  group.add(water);
  // Quayside
  const quay = new THREE.Mesh(new THREE.BoxGeometry(100, 0.5, 12), new THREE.MeshLambertMaterial({ color: 0x6a6858 }));
  quay.position.set(0, 0.25, 24);
  group.add(quay);
  // Container cranes (4)
  for (let i = 0; i < 4; i++) {
    buildContainerCrane(group, -36 + i * 24, 24);
  }
  // Stacked shipping containers
  buildContainerYard(group, -40, 0, 0);
  buildContainerYard(group, 0, 0, 0);
  buildContainerYard(group, 40, 0, 0);
  // Docked cargo ship
  buildCargoShip(group, 0, 0, 55);
  // Warehouses
  const wh1 = buildBuildingShell({ width: 30, depth: 18, floors: 1, color: 0x6a7070, style: 'flat', name: 'onne-wh1' });
  wh1.position.set(-35, 0, -18);
  group.add(wh1);
  const wh2 = buildBuildingShell({ width: 30, depth: 18, floors: 1, color: 0x6a7070, style: 'flat', name: 'onne-wh2' });
  wh2.position.set(35, 0, -18);
  group.add(wh2);
  // Admin building
  const admin = buildBuildingShell({ width: 18, depth: 14, floors: 2, color: 0x5a6878, style: 'flat', name: 'onne-admin' });
  admin.position.set(-42, 0, -30);
  group.add(admin);
  // Control tower
  buildPortControlTower(group, 48, -30);
  // Interior
  for (let i = 0; i < 3; i++) {
    const office = buildOfficeRoom();
    office.position.set(-44 + i * 5, FLOOR_HEIGHT, -30);
    group.add(office);
  }
  const toilet = buildToiletRoom();
  toilet.position.set(42, 0, -30);
  group.add(toilet);
  const caf = buildKitchenRoom();
  caf.position.set(42, 0, -20);
  group.add(caf);

  buildLandmarkLabel(group, landmark);
  return group;
}

function buildContainerCrane(group, x, z) {
  const mat = new THREE.MeshLambertMaterial({ color: 0xe8a020 });
  // Legs
  for (const lx of [-4, 4]) {
    const leg = makeBox(0.6, 20, 0.6, 0xe8a020);
    leg.position.set(x + lx, 0, z);
    group.add(leg);
  }
  // Cross beam
  const beam = makeBox(10, 0.6, 0.6, 0xe8a020);
  beam.position.set(x, 20, z);
  // Horizontal boom
  const boom = makeBox(28, 0.5, 0.5, 0xe8a020);
  boom.position.set(x, 21, z);
  // Spreader / trolley
  const trolley = makeBox(2, 1.2, 1.2, 0xd09010);
  trolley.position.set(x, 20, z);
  trolley.name = 'crane-trolley';
  trolley.userData.animates = true;
  group.add(beam, boom, trolley);
}

function buildContainerYard(group, x, y, z) {
  const containerColors = [0xa03020, 0x2050a0, 0x40904a, 0xa08020, 0x506080, 0x904080];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 6; col++) {
      for (let stack = 0; stack < 2 + Math.floor(Math.random() * 2); stack++) {
        const color = containerColors[Math.floor(Math.random() * containerColors.length)];
        const container = makeBox(6, 2.6, 2.4, color);
        container.position.set(x - 14 + col * 6.2, stack * 2.6 + 1.3, z - 8 + row * 5.5);
        container.castShadow = true;
        group.add(container);
      }
    }
  }
}

function buildCargoShip(group, x, y, z) {
  const hull = new THREE.Mesh(
    new THREE.BoxGeometry(60, 6, 18),
    new THREE.MeshLambertMaterial({ color: 0x2a3a4a })
  );
  hull.position.set(x, y + 3, z);
  const deck = makeBox(58, 0.4, 16, 0x3a4a5a);
  deck.position.set(x, y + 6.2, z);
  const superstructure = makeBox(12, 10, 10, 0xd8d0c4);
  superstructure.position.set(x + 20, y + 7, z);
  // Cargo containers on deck
  for (let i = 0; i < 5; i++) {
    const cargo = makeBox(6, 2.6, 8, [0xa03020, 0x2050a0, 0x40904a][i % 3]);
    cargo.position.set(x - 18 + i * 6.5, y + 7.5, z);
    group.add(cargo);
  }
  // Funnel
  const funnel = makeCylinder(1.0, 1.4, 4, 0x303030, 8);
  funnel.position.set(x + 18, y + 14, z);
  group.add(hull, deck, superstructure, funnel);
}

function buildPortControlTower(group, x, z) {
  const base = makeBox(6, 12, 6, 0x5a6878);
  base.position.set(x, 0, z);
  const cab = makeBox(8, 4, 8, 0x8ab4d4);
  cab.position.set(x, 14, z);
  const radar = makeCylinder(1.4, 1.4, 0.3, 12, 0x505060);
  radar.position.set(x, 17, z);
  group.add(base, cab, radar);
}
