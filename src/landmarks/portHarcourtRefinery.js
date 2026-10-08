import * as THREE from 'three';
import { buildBuildingShell, buildOfficeRoom, buildToiletRoom, buildKitchenRoom } from './buildingFactory.js';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeBox, makeCylinder } from '../utils/helpers.js';
import { FLOOR_HEIGHT } from '../utils/constants.js';

export function buildRefinery(landmark) {
  const group = new THREE.Group();
  // Perimeter fence
  buildPerimeterFence(group, 100, 80);
  // Storage tanks cluster
  for (let i = 0; i < 6; i++) {
    buildStorageTank(group, -38 + (i % 3) * 28, Math.floor(i / 3) * 30 - 30);
  }
  // Processing units
  buildProcessingUnit(group, 20, -10);
  buildProcessingUnit(group, 40, -10);
  // Flare stack
  buildFlareStack(group, 45, 25);
  // Pipeline network
  buildPipelines(group);
  // Control room
  const ctrl = buildBuildingShell({ width: 18, depth: 12, floors: 2, color: 0x505860, style: 'flat', name: 'refinery-ctrl' });
  ctrl.position.set(-30, 0, 20);
  group.add(ctrl);
  buildControlRoomInterior(group, -30, 0, 20);
  // Admin building
  const admin = buildBuildingShell({ width: 14, depth: 10, floors: 2, color: 0x585a60, style: 'flat', name: 'refinery-admin' });
  admin.position.set(-30, 0, -20);
  group.add(admin);
  for (let i = 0; i < 3; i++) {
    const office = buildOfficeRoom();
    office.position.set(-34 + i * 5, FLOOR_HEIGHT, -20);
    group.add(office);
  }
  // Cafeteria
  const caf = buildBuildingShell({ width: 12, depth: 8, floors: 1, color: 0x585a60, style: 'flat', name: 'refinery-caf' });
  caf.position.set(-30, 0, 35);
  group.add(caf);
  const kitchen = buildKitchenRoom();
  kitchen.position.set(-30, 0, 35);
  group.add(kitchen);
  const toilet = buildToiletRoom();
  toilet.position.set(-18, 0, 20);
  group.add(toilet);

  buildLandmarkLabel(group, landmark);
  return group;
}

function buildStorageTank(group, x, z) {
  const h = 12 + Math.random() * 6;
  const r = 7 + Math.random() * 3;
  const bodyGeo = new THREE.CylinderGeometry(r, r, h, 8);
  const body = new THREE.Mesh(bodyGeo, new THREE.MeshLambertMaterial({ color: 0x708090 }));
  body.position.set(x, h / 2, z);
  body.castShadow = true;
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(r, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshLambertMaterial({ color: 0x607080 })
  );
  dome.position.set(x, h, z);
  // Staircase spiral suggestion
  const stairStrip = makeBox(0.3, h, 0.3, 0x505860);
  stairStrip.position.set(x + r + 0.2, h / 2, z);
  group.add(body, dome, stairStrip);
}

function buildProcessingUnit(group, x, z) {
  // Vertical distillation column
  const col = makeCylinder(1.4, 1.6, 20, 0x808898, 10);
  col.position.set(x, 0, z);
  col.castShadow = true;
  // Horizontal vessel
  const vessel = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.2, 10, 10),
    new THREE.MeshLambertMaterial({ color: 0x909098 })
  );
  vessel.rotation.z = Math.PI / 2;
  vessel.position.set(x + 7, 3, z);
  // Connecting pipes
  for (let i = 0; i < 3; i++) {
    const pipe = makeCylinder(0.2, 0.2, 6, 0x707078, 6);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(x + 4, 5 + i * 3, z);
    group.add(pipe);
  }
  // Platform walkway
  const platform = makeBox(4, 0.2, 2, 0x606870);
  platform.position.set(x, 10, z);
  group.add(col, vessel, platform);
}

function buildFlareStack(group, x, z) {
  const pole = makeCylinder(0.3, 0.5, 30, 0x505860, 8);
  pole.position.set(x, 0, z);
  // Flame glow at top
  const flame = new THREE.Mesh(
    new THREE.ConeGeometry(0.8, 2.5, 8),
    new THREE.MeshLambertMaterial({ color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 0.8 })
  );
  flame.position.set(x, 31.5, z);
  flame.name = 'flare-flame';
  flame.userData.animates = true;
  group.add(pole, flame);
}

function buildPipelines(group) {
  const pipeMat = new THREE.MeshLambertMaterial({ color: 0x707878 });
  // Horizontal pipelines connecting units
  const routes = [
    { from: [-20, 1.5, -10], to: [40, 1.5, -10] },
    { from: [20, 3, -10], to: [20, 3, 25] },
    { from: [40, 3, -10], to: [40, 3, 25] },
  ];
  routes.forEach(r => {
    const dx = r.to[0] - r.from[0];
    const dz = r.to[2] - r.from[2];
    const len = Math.sqrt(dx * dx + dz * dz);
    const pipeGeo = new THREE.CylinderGeometry(0.25, 0.25, len, 6);
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.position.set((r.from[0] + r.to[0]) / 2, r.from[1], (r.from[2] + r.to[2]) / 2);
    if (Math.abs(dz) > 0.1) pipe.rotation.x = Math.PI / 2;
    else pipe.rotation.z = Math.PI / 2;
    group.add(pipe);
  });
}

function buildControlRoomInterior(group, x, y, z) {
  // Console bank
  for (let i = 0; i < 5; i++) {
    const console = makeBox(1.4, 1.2, 0.7, 0x404858);
    console.position.set(x - 6 + i * 3, y, z - 3);
    const screen = makeBox(1.0, 0.7, 0.04, 0x102040);
    screen.position.set(x - 6 + i * 3, y + 1.0, z - 3.3);
    group.add(console, screen);
  }
}

function buildPerimeterFence(group, w, d) {
  const mat = new THREE.MeshLambertMaterial({ color: 0x505860 });
  const h = 2.4;
  const panels = [
    { geo: [w, h, 0.2], pos: [0, h / 2, d / 2] },
    { geo: [w, h, 0.2], pos: [0, h / 2, -d / 2] },
    { geo: [0.2, h, d], pos: [w / 2, h / 2, 0] },
    { geo: [0.2, h, d], pos: [-w / 2, h / 2, 0] },
  ];
  panels.forEach(p => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...p.geo), mat);
    mesh.position.set(...p.pos);
    group.add(mesh);
  });
}
