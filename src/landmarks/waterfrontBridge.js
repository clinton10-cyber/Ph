import * as THREE from 'three';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeBox, makeCylinder } from '../utils/helpers.js';

export function buildWaterfrontBridge(landmark) {
  const group = new THREE.Group();
  buildBridgeStructure(group);
  buildDockArea(group);
  buildWarehouse(group, -20, -8);
  buildWarehouse(group, 20, -8);
  buildLandmarkLabel(group, landmark);
  return group;
}

function buildBridgeStructure(group) {
  const deckMat = new THREE.MeshLambertMaterial({ color: 0x6a7a8a });
  const pillarMat = new THREE.MeshLambertMaterial({ color: 0x5a6878 });
  // Deck
  const deck = new THREE.Mesh(new THREE.BoxGeometry(60, 0.8, 10), deckMat);
  deck.position.y = 4;
  group.add(deck);
  // Support pillars
  for (let i = 0; i < 7; i++) {
    const pillar = makeCylinder(0.6, 0.8, 5, 0x5a6878, 8);
    pillar.position.set(-27 + i * 9, 0, 0);
    group.add(pillar);
  }
  // Railings
  for (const z of [-4.6, 4.6]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(60, 0.8, 0.12), new THREE.MeshLambertMaterial({ color: 0x808898 }));
    rail.position.set(0, 4.8, z);
    group.add(rail);
  }
}

function buildDockArea(group) {
  const dock = new THREE.Mesh(new THREE.BoxGeometry(50, 0.5, 12), new THREE.MeshLambertMaterial({ color: 0x6a5840 }));
  dock.position.set(0, 0.25, -16);
  group.add(dock);
  // Moored boat
  buildBoat(group, -15, 0.3, -22);
  buildBoat(group, 10, 0.3, -24);
  // Dock bollards
  for (let i = 0; i < 6; i++) {
    const b = makeCylinder(0.2, 0.24, 1.2, 0x404848, 8);
    b.position.set(-22 + i * 9, 0.6, -10);
    group.add(b);
  }
}

function buildBoat(group, x, y, z) {
  const hull = new THREE.Mesh(new THREE.BoxGeometry(12, 1.2, 3.5), new THREE.MeshLambertMaterial({ color: 0x304050 }));
  hull.position.set(x, y, z);
  const cabin = makeBox(4, 2.4, 2.8, 0xd8d0c4);
  cabin.position.set(x - 1, y + 1.2, z);
  group.add(hull, cabin);
}

function buildWarehouse(group, x, z) {
  const body = makeBox(18, 7, 12, 0x7a8088);
  body.position.set(x, 0, z);
  // Corrugated roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(18.5, 0.6, 13), new THREE.MeshLambertMaterial({ color: 0x6a7078 }));
  roof.position.set(x, 7.3, z);
  // Crates inside
  for (let i = 0; i < 4; i++) {
    const crate = makeBox(1.5, 1.5, 1.5, 0xa08060);
    crate.position.set(x - 6 + i * 3.5, 0.75, z);
    group.add(crate);
  }
  group.add(body, roof);
}
