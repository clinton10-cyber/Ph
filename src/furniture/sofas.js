import * as THREE from 'three';
import { makeBox } from '../utils/helpers.js';

const FABRIC_GRAY = 0x606878;
const FABRIC_BEIGE = 0xc8b898;
const LEATHER_DARK = 0x3a2818;
const WOOD_LEG = 0x7a5838;

export function buildSofa(seats = 3) {
  const group = new THREE.Group();
  const w = 0.7 + seats * 0.65;

  // Base
  const base = makeBox(w, 0.44, 0.78, FABRIC_GRAY);

  // Back
  const back = makeBox(w, 0.6, 0.16, FABRIC_GRAY);
  back.position.set(0, 0.72, -0.32);

  // Armrests
  const armL = makeBox(0.18, 0.56, 0.78, FABRIC_GRAY);
  armL.position.set(-w / 2 + 0.09, 0.28, 0);
  const armR = makeBox(0.18, 0.56, 0.78, FABRIC_GRAY);
  armR.position.set(w / 2 - 0.09, 0.28, 0);

  // Cushions
  for (let i = 0; i < seats; i++) {
    const cushion = makeBox(0.6, 0.12, 0.64, FABRIC_BEIGE);
    cushion.position.set(-w / 2 + 0.4 + i * 0.65, 0.5, 0.04);
    group.add(cushion);
  }

  // Legs
  for (const [x, z] of [[-w / 2 + 0.1, 0.3], [w / 2 - 0.1, 0.3], [-w / 2 + 0.1, -0.3], [w / 2 - 0.1, -0.3]]) {
    const leg = makeBox(0.06, 0.12, 0.06, WOOD_LEG);
    leg.position.set(x, -0.06, z);
    group.add(leg);
  }

  group.add(base, back, armL, armR);
  group.name = 'sofa';
  return group;
}

export function buildArmchair() {
  const group = new THREE.Group();
  const base = makeBox(0.74, 0.44, 0.72, LEATHER_DARK);
  const back = makeBox(0.74, 0.6, 0.14, LEATHER_DARK);
  back.position.set(0, 0.72, -0.3);
  const armL = makeBox(0.14, 0.52, 0.72, LEATHER_DARK);
  armL.position.set(-0.3, 0.26, 0);
  const armR = makeBox(0.14, 0.52, 0.72, LEATHER_DARK);
  armR.position.set(0.3, 0.26, 0);
  const cushion = makeBox(0.62, 0.1, 0.62, 0x5a4030);
  cushion.position.set(0, 0.49, 0.04);
  group.add(base, back, armL, armR, cushion);
  group.name = 'armchair';
  return group;
}

export function buildBed(type = 'double') {
  const group = new THREE.Group();
  const w = type === 'single' ? 1.0 : 1.6;

  // Frame
  const frame = makeBox(w + 0.12, 0.36, 2.1, WOOD_LEG);
  // Mattress
  const mattress = makeBox(w, 0.24, 2.0, 0xe8e0d4);
  mattress.position.y = 0.42;
  // Headboard
  const head = makeBox(w + 0.12, 0.8, 0.14, WOOD_LEG);
  head.position.set(0, 0.58, -1.0);
  // Pillow(s)
  const pillowW = type === 'single' ? 0.44 : 0.38;
  for (let i = 0; i < (type === 'single' ? 1 : 2); i++) {
    const pillow = makeBox(pillowW, 0.1, 0.56, 0xf0eeec);
    pillow.position.set(type === 'single' ? 0 : -0.32 + i * 0.64, 0.57, -0.68);
    group.add(pillow);
  }

  group.add(frame, mattress, head);
  group.name = 'bed';
  return group;
}

export function buildWardrobe() {
  const group = new THREE.Group();
  const body = makeBox(1.6, 2.2, 0.6, 0xb8a888);
  body.position.y = 1.1;
  // Doors
  for (const x of [-0.4, 0.4]) {
    const door = makeBox(0.74, 2.14, 0.04, 0xc8b898);
    door.position.set(x, 1.1, 0.32);
    const handle = makeBox(0.04, 0.16, 0.04, 0xc0c4c8);
    handle.position.set(x + (x < 0 ? 0.18 : -0.18), 1.1, 0.35);
    group.add(door, handle);
  }
  group.add(body);
  group.name = 'wardrobe';
  return group;
}

export function buildCoffeeTable() {
  const group = new THREE.Group();
  const top = makeBox(1.0, 0.05, 0.55, 0x8a6040);
  top.position.y = 0.44;
  for (const [x, z] of [[-0.44, -0.22], [0.44, -0.22], [-0.44, 0.22], [0.44, 0.22]]) {
    const leg = makeBox(0.05, 0.44, 0.05, 0x6a4828);
    leg.position.set(x, 0, z);
    group.add(leg);
  }
  group.add(top);
  group.name = 'coffee-table';
  return group;
}
