import * as THREE from 'three';
import { buildBuildingShell, buildToiletRoom, buildKitchenRoom, buildOfficeRoom } from './buildingFactory.js';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeBox } from '../utils/helpers.js';
import { buildSofa } from '../furniture/sofas.js';

export function buildTerminalTwo(landmark) {
  const group = new THREE.Group();
  const terminal = buildBuildingShell({ width: 60, depth: 30, floors: 1, color: 0x9ab4c8, roofColor: 0x506070, style: 'flat', name: 'terminal-two' });
  group.add(terminal);
  // Check-in counters
  for (let i = 0; i < 6; i++) {
    const counter = makeBox(2.4, 1.1, 0.8, 0xd8d0c4);
    counter.position.set(-22 + i * 9, 0, -10);
    const screen = makeBox(0.4, 0.45, 0.04, 0x102040);
    screen.position.set(-22 + i * 9, 1.1, -10.3);
    group.add(counter, screen);
  }
  // Waiting lounge seats
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      const seat = makeBox(0.5, 0.5, 0.5, 0x4a5060);
      seat.position.set(-25 + col * 7, 0.25, -2 + row * 2.5);
      group.add(seat);
    }
  }
  // Gates
  for (let i = 0; i < 4; i++) {
    const gate = makeBox(4, 3.2, 0.2, 0x8090a0);
    gate.position.set(-20 + i * 14, 0, 13);
    group.add(gate);
  }
  // Small parked aircraft outside
  buildSmallAircraft(group, -20, 0, 40);
  buildSmallAircraft(group, 20, 0, 45);
  const toilet = buildToiletRoom();
  toilet.position.set(25, 0, 5);
  group.add(toilet);
  const kitchen = buildKitchenRoom(6, 4);
  kitchen.position.set(-25, 0, 5);
  group.add(kitchen);
  const office = buildOfficeRoom();
  office.position.set(25, 0, -5);
  group.add(office);

  buildLandmarkLabel(group, landmark);
  return group;
}

function buildSmallAircraft(group, x, y, z) {
  const g = new THREE.Group();
  const fuse = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.3, 26, 10), new THREE.MeshLambertMaterial({ color: 0xf0f0ee }));
  fuse.rotation.z = Math.PI / 2;
  fuse.position.y = 3;
  const wing = makeBox(30, 0.3, 4, 0xe8e8e4);
  wing.position.y = 2.5;
  const tailH = makeBox(10, 0.25, 2, 0xe8e8e4);
  tailH.position.set(0, 4, -11);
  const tailV = makeBox(0.3, 3.5, 3, 0xe8e8e4);
  tailV.position.set(0, 4, -11);
  for (const xOff of [-8, 8]) {
    const eng = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.0, 3.5, 10), new THREE.MeshLambertMaterial({ color: 0xd0d0d0 }));
    eng.rotation.z = Math.PI / 2;
    eng.position.set(xOff, 2.3, 0);
    g.add(eng);
  }
  g.add(fuse, wing, tailH, tailV);
  g.position.set(x, y, z);
  group.add(g);
}
