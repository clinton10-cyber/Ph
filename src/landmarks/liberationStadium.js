import * as THREE from 'three';
import { buildBuildingShell, buildOfficeRoom, buildToiletRoom } from './buildingFactory.js';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeBox, makeCylinder } from '../utils/helpers.js';
import { FLOOR_HEIGHT } from '../utils/constants.js';

export function buildLiberationStadium(landmark) {
  const group = new THREE.Group();
  // Football pitch
  const pitch = new THREE.Mesh(new THREE.PlaneGeometry(68, 105), new THREE.MeshLambertMaterial({ color: 0x2a6820 }));
  pitch.rotation.x = -Math.PI / 2; pitch.position.y = 0.01;
  group.add(pitch);
  // Pitch markings
  buildPitchMarkings(group);
  // Four stands
  buildStand(group, 0, 0, -60, 80, 0); // North
  buildStand(group, 0, 0, 60, 80, Math.PI); // South
  buildStand(group, -44, 0, 0, 110, Math.PI / 2); // West
  buildStand(group, 44, 0, 0, 110, -Math.PI / 2); // East
  // Floodlights
  for (const [x, z] of [[-50, -60], [50, -60], [-50, 60], [50, 60]]) {
    buildFloodlight(group, x, z);
  }
  // Locker rooms
  buildLockerRoom(group, -36, 0, -55);
  buildLockerRoom(group, 36, 0, -55);
  // Offices
  const office = buildOfficeRoom();
  office.position.set(-30, FLOOR_HEIGHT, -52);
  group.add(office);
  // Toilets
  const toilet = buildToiletRoom();
  toilet.position.set(30, 0, -52);
  group.add(toilet);

  buildLandmarkLabel(group, landmark);
  return group;
}

function buildPitchMarkings(group) {
  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  // Perimeter
  const lines = [
    { w: 68, d: 0.3, x: 0, z: -52 }, { w: 68, d: 0.3, x: 0, z: 52 },
    { w: 0.3, d: 105, x: -34, z: 0 }, { w: 0.3, d: 105, x: 34, z: 0 },
  ];
  lines.forEach(l => {
    const line = new THREE.Mesh(new THREE.BoxGeometry(l.w, 0.02, l.d), mat);
    line.position.set(l.x, 0.02, l.z);
    group.add(line);
  });
  // Centre circle
  const circleGeo = new THREE.TorusGeometry(9, 0.15, 4, 32);
  const circle = new THREE.Mesh(circleGeo, mat);
  circle.rotation.x = Math.PI / 2;
  circle.position.y = 0.02;
  group.add(circle);
  // Goals
  for (const z of [-52, 52]) {
    const goalH = makeBox(7.3, 0.12, 0.12, 0xffffff);
    goalH.position.set(0, 2.44, z);
    group.add(goalH);
  }
}

function buildStand(group, x, y, z, length, ry) {
  const tiers = 3;
  const tierDepth = 6;
  const mat = new THREE.MeshLambertMaterial({ color: 0xb0b0b8 });
  const roofMat = new THREE.MeshLambertMaterial({ color: 0x707880 });
  for (let t = 0; t < tiers; t++) {
    const tierGeo = new THREE.BoxGeometry(length, 0.4, tierDepth);
    const tier = new THREE.Mesh(tierGeo, mat);
    tier.position.set(0, t * 2.5, -t * tierDepth * 0.6);
    // Seats
    for (let i = 0; i < Math.floor(length / 1.5); i++) {
      const seat = makeBox(0.5, 0.4, 0.45, [0x2a5c8a, 0xffffff][i % 2]);
      seat.position.set(-length / 2 + 0.75 + i * 1.4, t * 2.5 + 0.45, -t * tierDepth * 0.6);
      const g = new THREE.Group();
      g.add(tier, seat);
      group.add(seat);
    }
    group.add(tier);
  }
  // Roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(length + 2, 0.4, tierDepth * tiers * 0.4), roofMat);
  roof.position.set(0, tiers * 2.5 + 2, -tiers * tierDepth * 0.3);
  const g = new THREE.Group();
  g.add(roof);
  g.position.set(x, y, z);
  g.rotation.y = ry;
  group.add(g);
}

function buildFloodlight(group, x, z) {
  const pole = makeCylinder(0.2, 0.3, 22, 0x808898, 8);
  pole.position.set(x, 0, z);
  // Light array
  for (let i = 0; i < 4; i++) {
    const light = makeBox(0.8, 0.4, 0.2, 0xf0f0d0);
    light.position.set(x - 1.2 + i * 0.8, 21.5, z);
    group.add(light);
  }
  group.add(pole);
}

function buildLockerRoom(group, x, y, z) {
  const room = makeBox(10, FLOOR_HEIGHT, 6, 0xc0b8b0);
  room.position.set(x, y, z);
  // Lockers
  for (let i = 0; i < 8; i++) {
    const locker = makeBox(0.5, 2.0, 0.5, 0x606870);
    locker.position.set(x - 3.5 + i * 1.0, y, z - 2.2);
    group.add(locker);
  }
  // Bench
  const bench = makeBox(6, 0.1, 0.4, 0x9a7040);
  bench.position.set(x, y + 0.44, z);
  group.add(room, bench);
}
