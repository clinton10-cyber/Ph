import * as THREE from 'three';
import { buildBuildingShell, buildOfficeRoom, buildToiletRoom, buildKitchenRoom } from './buildingFactory.js';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeBox } from '../utils/helpers.js';
import { FLOOR_HEIGHT } from '../utils/constants.js';

export function buildCivicCentre(landmark) {
  const group = new THREE.Group();
  const main = buildBuildingShell({ width: 45, depth: 35, floors: 2, color: 0xa09080, roofColor: 0x706858, style: 'flat', name: 'civic-centre' });
  group.add(main);
  buildEventHall(group, 0, 0, -5);
  buildLobby(group, 0, 0, 12);
  const kitchen = buildKitchenRoom(10, 7);
  kitchen.position.set(16, 0, -10);
  group.add(kitchen);
  const toilet = buildToiletRoom();
  toilet.position.set(-16, 0, -10);
  group.add(toilet);
  buildLandmarkLabel(group, landmark);
  return group;
}

function buildEventHall(group, x, y, z) {
  // Banquet tables
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 4; col++) {
      const table = makeBox(2.4, 0.08, 1.0, 0x9a8060);
      table.position.set(x - 9 + col * 5, y + 0.74, z - 8 + row * 4);
      for (let c = 0; c < 4; c++) {
        const chair = makeBox(0.5, 0.4, 0.45, 0x505060);
        chair.position.set(x - 9 + col * 5 - 0.8 + c * 0.55, y + 0.25, z - 8 + row * 4 + 0.7);
        group.add(chair);
      }
      group.add(table);
    }
  }
  // Stage platform
  const stage = makeBox(20, 0.5, 5, 0x8a6840);
  stage.position.set(x, y, z - 12);
  // Chandelier approximation
  const chandelier = new THREE.Mesh(new THREE.SphereGeometry(1.0, 12, 8), new THREE.MeshLambertMaterial({ color: 0xf0e090, emissive: 0xf0e090, emissiveIntensity: 0.3 }));
  chandelier.position.set(x, y + FLOOR_HEIGHT - 0.5, z);
  group.add(stage, chandelier);
}

function buildLobby(group, x, y, z) {
  for (let i = 0; i < 4; i++) {
    const sofa = makeBox(1.8, 0.5, 0.7, 0x607080);
    sofa.position.set(x - 8 + i * 5, y + 0.25, z);
    group.add(sofa);
  }
  const counter = makeBox(5, 1.1, 0.7, 0xb0a080);
  counter.position.set(x, y, z - 3);
  group.add(counter);
}
