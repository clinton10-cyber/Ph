import * as THREE from 'three';
import { FLOOR_HEIGHT, COLORS } from '../utils/constants.js';
import { makeBox } from '../utils/helpers.js';

// Build a wall section
export function buildWall(w, h, d, color = 0xd8d0c4, receiveShadow = true) {
  return makeBox(w, h, d, color, receiveShadow);
}

// Build a floor slab
export function buildFloor(w, d, color = 0xc0b8a8, y = 0) {
  const geo = new THREE.BoxGeometry(w, 0.2, d);
  const mat = new THREE.MeshLambertMaterial({ color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = y + 0.1;
  mesh.receiveShadow = true;
  return mesh;
}

// Build a ceiling slab
export function buildCeiling(w, d, color = 0xe8e4dc, y = FLOOR_HEIGHT) {
  const geo = new THREE.BoxGeometry(w, 0.2, d);
  const mat = new THREE.MeshLambertMaterial({ color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = y - 0.1;
  return mesh;
}

// Build a door frame with opening
export function buildDoor(height = 2.4, width = 1.0, color = 0x6a5040) {
  const group = new THREE.Group();
  const frameMat = new THREE.MeshLambertMaterial({ color: 0x7a6050 });

  // Door frame sides
  const sideGeo = new THREE.BoxGeometry(0.1, height, 0.15);
  const left = new THREE.Mesh(sideGeo, frameMat);
  left.position.set(-width / 2 - 0.05, height / 2, 0);
  const right = new THREE.Mesh(sideGeo, frameMat);
  right.position.set(width / 2 + 0.05, height / 2, 0);

  // Door top
  const topGeo = new THREE.BoxGeometry(width + 0.2, 0.1, 0.15);
  const top = new THREE.Mesh(topGeo, frameMat);
  top.position.set(0, height + 0.05, 0);

  // Door leaf
  const leafGeo = new THREE.BoxGeometry(width - 0.04, height - 0.04, 0.06);
  const leafMat = new THREE.MeshLambertMaterial({ color });
  const leaf = new THREE.Mesh(leafGeo, leafMat);
  leaf.position.set(0, height / 2, 0);
  leaf.castShadow = true;

  group.add(left, right, top, leaf);
  group.userData.leaf = leaf;
  group.name = 'door';
  return group;
}

// Build a window frame
export function buildWindow(width = 1.4, height = 1.4) {
  const group = new THREE.Group();
  const frameMat = new THREE.MeshLambertMaterial({ color: 0x707060 });
  const glassMat = new THREE.MeshLambertMaterial({
    color: 0x8ab4d4, transparent: true, opacity: 0.55
  });

  const frameGeo = new THREE.BoxGeometry(width + 0.14, height + 0.14, 0.08);
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.y = height / 2;

  const glassGeo = new THREE.BoxGeometry(width, height, 0.04);
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.y = height / 2;
  glass.position.z = 0.01;

  group.add(frame, glass);
  group.name = 'window';
  return group;
}

// Build a staircase section
export function buildStairs(steps = 10, stepW = 3, rise = 0.2, run = 0.28) {
  const group = new THREE.Group();
  const mat = new THREE.MeshLambertMaterial({ color: 0xb8b0a0 });
  for (let i = 0; i < steps; i++) {
    const geo = new THREE.BoxGeometry(stepW, rise, run);
    const step = new THREE.Mesh(geo, mat);
    step.position.set(0, rise * i + rise / 2, -run * i);
    step.castShadow = true;
    step.receiveShadow = true;
    group.add(step);
  }
  // Handrails
  const railMat = new THREE.MeshLambertMaterial({ color: 0x404040 });
  const railGeo = new THREE.BoxGeometry(0.06, steps * rise, 0.06);
  const leftRail = new THREE.Mesh(railGeo, railMat);
  const rightRail = new THREE.Mesh(railGeo, railMat);
  leftRail.position.set(-stepW / 2 + 0.1, steps * rise / 2, -(steps * run) / 2 + run);
  rightRail.position.set(stepW / 2 - 0.1, steps * rise / 2, -(steps * run) / 2 + run);
  leftRail.rotation.x = Math.atan2(steps * rise, steps * run);
  rightRail.rotation.x = Math.atan2(steps * rise, steps * run);
  group.add(leftRail, rightRail);
  group.name = 'stairs';
  return group;
}

// Build a corridor section
export function buildCorridor(length, width = 2.8, floorColor = 0xc0b8a8, wallColor = 0xd8d0c4) {
  const group = new THREE.Group();

  // Floor
  const floorGeo = new THREE.BoxGeometry(width, 0.1, length);
  const floorMat = new THREE.MeshLambertMaterial({ color: floorColor });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = 0.05;
  floor.receiveShadow = true;
  group.add(floor);

  // Walls
  const wallMat = new THREE.MeshLambertMaterial({ color: wallColor });
  const wallGeo = new THREE.BoxGeometry(0.2, FLOOR_HEIGHT - 0.1, length);
  const leftWall = new THREE.Mesh(wallGeo, wallMat);
  leftWall.position.set(-width / 2 - 0.1, FLOOR_HEIGHT / 2, 0);
  const rightWall = new THREE.Mesh(wallGeo, wallMat);
  rightWall.position.set(width / 2 + 0.1, FLOOR_HEIGHT / 2, 0);
  group.add(leftWall, rightWall);
  group.name = 'corridor';
  return group;
}
