import * as THREE from 'three';
import { buildBuildingShell, buildOfficeRoom, buildToiletRoom, buildKitchenRoom, buildReceptionRoom, buildConferenceRoom } from './buildingFactory.js';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeBox, makeCylinder } from '../utils/helpers.js';
import { FLOOR_HEIGHT } from '../utils/constants.js';

export function buildGovernmentHouse(landmark) {
  const group = new THREE.Group();
  const main = buildBuildingShell({ width: 40, depth: 30, floors: 2, color: 0xd4b896, roofColor: 0x8a7050, style: 'colonial', name: 'gov-house' });
  group.add(main);

  // Landscaped garden
  const garden = new THREE.Mesh(new THREE.PlaneGeometry(70, 60), new THREE.MeshLambertMaterial({ color: 0x3a7a30 }));
  garden.rotation.x = -Math.PI / 2; garden.position.y = 0.01;
  group.add(garden);

  // Fountain at entrance
  const fGeo = new THREE.CylinderGeometry(3.5, 3.8, 0.35, 10);
  const fountain = new THREE.Mesh(fGeo, new THREE.MeshLambertMaterial({ color: 0xb8a888 }));
  fountain.position.set(0, 0.18, 22);
  const water = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.2, 10), new THREE.MeshLambertMaterial({ color: 0x2060a0, transparent: true, opacity: 0.8 }));
  water.position.set(0, 0.28, 22);
  group.add(fountain, water);

  // Gatehouse
  const gate = buildBuildingShell({ width: 4, depth: 4, floors: 1, color: 0xd4b896, style: 'modern', name: 'gatehouse' });
  gate.position.set(0, 0, 30);
  group.add(gate);

  // Interior
  const reception = buildReceptionRoom(12, 8);
  reception.position.set(0, 0, 2);
  group.add(reception);
  const conf = buildConferenceRoom(16, 10);
  conf.position.set(0, FLOOR_HEIGHT, 0);
  group.add(conf);
  for (let i = 0; i < 6; i++) {
    const off = buildOfficeRoom();
    off.position.set(-12 + i * 5, FLOOR_HEIGHT, -6);
    group.add(off);
  }
  const kitchen = buildKitchenRoom();
  kitchen.position.set(14, 0, -6);
  group.add(kitchen);
  const toilet = buildToiletRoom(5, 4, true);
  toilet.position.set(-14, 0, 4);
  group.add(toilet);

  buildLandmarkLabel(group, landmark);
  return group;
}
