import * as THREE from 'three';
import { buildBuildingShell, buildToiletRoom, buildOfficeRoom } from './buildingFactory.js';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeBox } from '../utils/helpers.js';

export function buildMileOneMarket(landmark) {
  const group = new THREE.Group();
  // Ground
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(70, 55), new THREE.MeshLambertMaterial({ color: 0xb0a090 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = 0.01;
  group.add(ground);
  // Market stalls in grid
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 8; col++) {
      buildMarketStall(group, -28 + col * 7.5, -18 + row * 9);
    }
  }
  // Walkways between stall rows
  for (let row = 0; row < 6; row++) {
    const walkGeo = new THREE.PlaneGeometry(68, 2.5);
    const walk = new THREE.Mesh(walkGeo, new THREE.MeshLambertMaterial({ color: 0xc0b0a0 }));
    walk.rotation.x = -Math.PI / 2;
    walk.position.set(0, 0.02, -22.5 + row * 9);
    group.add(walk);
  }
  // Storage sheds
  const shed1 = buildBuildingShell({ width: 12, depth: 8, floors: 1, color: 0x8a8078, style: 'flat', name: 'shed1' });
  shed1.position.set(-28, 0, 24);
  const shed2 = buildBuildingShell({ width: 12, depth: 8, floors: 1, color: 0x8a8078, style: 'flat', name: 'shed2' });
  shed2.position.set(28, 0, 24);
  group.add(shed1, shed2);
  // Public toilets
  const toilet = buildToiletRoom();
  toilet.position.set(30, 0, -22);
  group.add(toilet);
  // Admin office
  const office = buildOfficeRoom();
  office.position.set(-30, 0, -22);
  group.add(office);

  buildLandmarkLabel(group, landmark);
  return group;
}

function buildMarketStall(group, x, z) {
  const stallColors = [0xe88040, 0x40a060, 0x4060b0, 0xa04040, 0xb0a040];
  const color = stallColors[Math.floor(Math.random() * stallColors.length)];
  // Stall frame
  const frame = makeBox(5.5, 2.4, 4, 0xb0a888);
  frame.position.set(x, 0, z);
  // Roof canopy
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.2, 4.8), new THREE.MeshLambertMaterial({ color }));
  canopy.position.set(x, 2.5, z);
  // Counter
  const counter = makeBox(4.5, 1.0, 0.5, 0xa09070);
  counter.position.set(x, 0, z + 2.1);
  // Goods on display (boxes)
  for (let i = 0; i < 4; i++) {
    const good = makeBox(0.6 + Math.random() * 0.3, 0.4 + Math.random() * 0.3, 0.4, 0x808060 + Math.floor(Math.random() * 0x404040));
    good.position.set(x - 1.5 + i * 0.85, 1.1, z + 2.0);
    group.add(good);
  }
  group.add(frame, canopy, counter);
}
