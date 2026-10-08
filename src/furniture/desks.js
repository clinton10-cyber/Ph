import * as THREE from 'three';
import { makeBox } from '../utils/helpers.js';

const WOOD = 0x8a6040;
const WOOD_DARK = 0x6a4828;
const METAL = 0x707880;
const SCREEN = 0x102040;
const WHITE = 0xf0eeec;
const CHAIR_FABRIC = 0x404858;

export function buildOfficeDesk(withMonitor = true) {
  const group = new THREE.Group();

  // Desk top
  const top = makeBox(1.6, 0.06, 0.8, WOOD);
  top.position.y = 0.76;
  group.add(top);

  // Legs
  const legPositions = [[-0.72, 0, -0.34], [0.72, 0, -0.34], [-0.72, 0, 0.34], [0.72, 0, 0.34]];
  legPositions.forEach(([x, y, z]) => {
    const leg = makeBox(0.06, 0.76, 0.06, WOOD_DARK);
    leg.position.set(x, 0, z);
    group.add(leg);
  });

  // Monitor
  if (withMonitor) {
    const stand = makeBox(0.06, 0.24, 0.06, METAL);
    stand.position.set(0, 0.86, -0.1);
    const screen = makeBox(0.48, 0.3, 0.04, SCREEN);
    screen.position.set(0, 1.12, -0.1);
    group.add(stand, screen);
  }

  group.name = 'office-desk';
  return group;
}

export function buildOfficeChair() {
  const group = new THREE.Group();

  const seat = makeBox(0.5, 0.08, 0.48, CHAIR_FABRIC);
  seat.position.y = 0.48;
  const back = makeBox(0.5, 0.5, 0.06, CHAIR_FABRIC);
  back.position.set(0, 0.75, -0.22);
  const stem = makeBox(0.06, 0.44, 0.06, METAL);
  stem.position.y = 0.22;

  // Wheels approximated as a base disc
  const baseGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.06, 10);
  const baseMat = new THREE.MeshLambertMaterial({ color: METAL });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.03;

  group.add(seat, back, stem, base);
  group.name = 'office-chair';
  return group;
}

export function buildFilingCabinet() {
  const group = new THREE.Group();
  const body = makeBox(0.48, 1.2, 0.56, METAL);
  // Drawer fronts
  for (let i = 0; i < 3; i++) {
    const drawer = makeBox(0.44, 0.34, 0.04, 0x808890);
    drawer.position.set(0, 0.22 + i * 0.38, 0.3);
    const handle = makeBox(0.2, 0.04, 0.04, 0xb0b4b8);
    handle.position.set(0, 0.22 + i * 0.38, 0.33);
    group.add(drawer, handle);
  }
  group.add(body);
  group.name = 'filing-cabinet';
  return group;
}

export function buildBookshelf(rows = 3) {
  const group = new THREE.Group();
  const frame = makeBox(1.0, rows * 0.36 + 0.1, 0.32, WOOD);
  group.add(frame);
  for (let r = 0; r < rows; r++) {
    for (let b = 0; b < 5; b++) {
      const bookH = 0.24 + Math.random() * 0.08;
      const bookGeo = new THREE.BoxGeometry(0.08 + Math.random() * 0.04, bookH, 0.24);
      const bookMat = new THREE.MeshLambertMaterial({
        color: [0xa03020, 0x2040a0, 0x30802a, 0xd09030, 0x806090][Math.floor(Math.random() * 5)]
      });
      const book = new THREE.Mesh(bookGeo, bookMat);
      book.position.set(-0.4 + b * 0.17, 0.3 + r * 0.36, 0);
      group.add(book);
    }
  }
  group.name = 'bookshelf';
  return group;
}

export function buildConferenceTable(seats = 8) {
  const group = new THREE.Group();
  const top = makeBox(3.2, 0.08, 1.2, WOOD_DARK);
  top.position.y = 0.76;
  group.add(top);

  // Pedestal legs
  for (const xOff of [-1.0, 0, 1.0]) {
    const leg = makeBox(0.12, 0.76, 0.12, WOOD_DARK);
    leg.position.set(xOff, 0, 0);
    group.add(leg);
  }

  // Chairs around table
  const chairPositions = [];
  const half = Math.floor(seats / 2);
  for (let i = 0; i < half; i++) {
    chairPositions.push({ x: -1.2 + i * (2.4 / (half - 1)), z: -1.0, ry: 0 });
    chairPositions.push({ x: -1.2 + i * (2.4 / (half - 1)), z: 1.0, ry: Math.PI });
  }
  chairPositions.forEach(cp => {
    const chair = buildOfficeChair();
    chair.position.set(cp.x, 0, cp.z);
    chair.rotation.y = cp.ry;
    group.add(chair);
  });

  group.name = 'conference-table';
  return group;
}

export function buildReceptionDesk() {
  const group = new THREE.Group();
  // L-shaped desk
  const front = makeBox(2.4, 1.1, 0.5, WOOD);
  front.position.set(0, 0, 0);
  const side = makeBox(0.5, 1.1, 1.4, WOOD);
  side.position.set(1.2, 0, -0.7);
  // Counter top
  const topFront = makeBox(2.4, 0.08, 0.54, WOOD_DARK);
  topFront.position.set(0, 1.1, 0);
  group.add(front, side, topFront);
  group.name = 'reception-desk';
  return group;
}
