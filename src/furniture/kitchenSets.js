import * as THREE from 'three';
import { makeBox } from '../utils/helpers.js';

const CABINET = 0xd8c8a8;
const COUNTERTOP = 0x707878;
const APPLIANCE = 0x585858;
const CHROME = 0xc0c4c8;
const WHITE = 0xf0f0ec;

export function buildKitchenCounter(length = 2.4) {
  const group = new THREE.Group();

  // Base cabinet
  const base = makeBox(length, 0.88, 0.6, CABINET);
  // Countertop
  const top = makeBox(length + 0.06, 0.06, 0.66, COUNTERTOP);
  top.position.y = 0.9;

  // Doors
  const doorCount = Math.floor(length / 0.6);
  for (let i = 0; i < doorCount; i++) {
    const door = makeBox(0.54, 0.82, 0.03, 0xc8b898);
    door.position.set(-length / 2 + 0.3 + i * 0.6, 0.44, 0.31);
    // Small handle
    const handle = makeBox(0.14, 0.03, 0.03, CHROME);
    handle.position.set(-length / 2 + 0.3 + i * 0.6, 0.44, 0.33);
    group.add(door, handle);
  }

  group.add(base, top);
  group.name = 'kitchen-counter';
  return group;
}

export function buildKitchenSink() {
  const group = new THREE.Group();

  const counter = buildKitchenCounter(0.8);
  group.add(counter);

  // Sink basin
  const basinGeo = new THREE.BoxGeometry(0.5, 0.18, 0.36);
  const basinMat = new THREE.MeshLambertMaterial({ color: CHROME });
  const basin = new THREE.Mesh(basinGeo, basinMat);
  basin.position.set(0, 0.88, 0);

  // Tap
  const tap = makeBox(0.04, 0.22, 0.04, CHROME);
  tap.position.set(0, 1.04, -0.1);
  const spout = makeBox(0.16, 0.04, 0.04, CHROME);
  spout.position.set(0.06, 1.15, -0.04);

  group.add(basin, tap, spout);
  group.name = 'kitchen-sink';
  return group;
}

export function buildMicrowave() {
  const group = new THREE.Group();
  const body = makeBox(0.52, 0.32, 0.38, APPLIANCE);
  body.position.y = 0.16;
  const door = makeBox(0.36, 0.26, 0.04, 0x303438);
  door.position.set(-0.06, 0.16, 0.21);
  const panel = makeBox(0.1, 0.26, 0.04, 0x202428);
  panel.position.set(0.2, 0.16, 0.21);
  group.add(body, door, panel);
  group.name = 'microwave';
  return group;
}

export function buildRefrigerator() {
  const group = new THREE.Group();
  const body = makeBox(0.7, 1.8, 0.7, WHITE);
  body.position.y = 0.9;
  // Two doors
  const topDoor = makeBox(0.64, 0.56, 0.04, 0xe8e4e0);
  topDoor.position.set(0, 1.58, 0.37);
  const bottomDoor = makeBox(0.64, 1.14, 0.04, 0xe8e4e0);
  bottomDoor.position.set(0, 0.67, 0.37);
  const handle = makeBox(0.04, 0.4, 0.06, CHROME);
  handle.position.set(-0.24, 1.0, 0.41);
  group.add(body, topDoor, bottomDoor, handle);
  group.name = 'refrigerator';
  return group;
}

export function buildStove() {
  const group = new THREE.Group();
  const body = makeBox(0.6, 0.88, 0.62, APPLIANCE);
  body.position.y = 0.44;
  const top = makeBox(0.62, 0.04, 0.64, 0x404040);
  top.position.y = 0.9;

  // Four burners
  for (const [x, z] of [[-0.14, -0.12], [0.14, -0.12], [-0.14, 0.12], [0.14, 0.12]]) {
    const burnerGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.02, 10);
    const burnerMat = new THREE.MeshLambertMaterial({ color: 0x282828 });
    const burner = new THREE.Mesh(burnerGeo, burnerMat);
    burner.position.set(x, 0.93, z);
    group.add(burner);
  }

  // Oven door
  const ovenDoor = makeBox(0.5, 0.38, 0.04, 0x383838);
  ovenDoor.position.set(0, 0.28, 0.33);
  // Controls
  const knobGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.04, 8);
  const knobMat = new THREE.MeshLambertMaterial({ color: CHROME });
  for (let k = 0; k < 4; k++) {
    const knob = new THREE.Mesh(knobGeo, knobMat);
    knob.rotation.x = Math.PI / 2;
    knob.position.set(-0.22 + k * 0.14, 0.7, 0.33);
    group.add(knob);
  }
  group.add(body, top, ovenDoor);
  group.name = 'stove';
  return group;
}

export function buildDiningSet(chairs = 4) {
  const group = new THREE.Group();
  const tableTop = makeBox(1.6, 0.06, 0.9, 0x9a7050);
  tableTop.position.y = 0.76;
  const legPositions = [[-0.74, 0, -0.4], [0.74, 0, -0.4], [-0.74, 0, 0.4], [0.74, 0, 0.4]];
  legPositions.forEach(([x, y, z]) => {
    const leg = makeBox(0.06, 0.76, 0.06, 0x7a5838);
    leg.position.set(x, 0, z);
    group.add(leg);
  });
  group.add(tableTop);
  group.name = 'dining-set';
  return group;
}
