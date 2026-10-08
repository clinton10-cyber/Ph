import * as THREE from 'three';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeBox } from '../utils/helpers.js';
import { buildBed, buildWardrobe } from '../furniture/sofas.js';
import { buildToiletRoom } from './buildingFactory.js';

export function buildTouristBeach(landmark) {
  const group = new THREE.Group();
  // Sandy ground
  const sand = new THREE.Mesh(new THREE.PlaneGeometry(100, 50), new THREE.MeshLambertMaterial({ color: 0xe8d4a0 }));
  sand.rotation.x = -Math.PI / 2; sand.position.y = 0.01;
  group.add(sand);
  // Water strip
  const water = new THREE.Mesh(new THREE.PlaneGeometry(100, 18), new THREE.MeshLambertMaterial({ color: 0x1a4a8a, transparent: true, opacity: 0.85 }));
  water.rotation.x = -Math.PI / 2; water.position.set(0, 0.02, 28);
  group.add(water);
  // Chalets
  for (let i = 0; i < 6; i++) {
    buildChalet(group, -40 + i * 16, -15);
  }
  // Beach chairs and umbrellas
  for (let i = 0; i < 10; i++) {
    buildBeachSetup(group, -40 + i * 9, 10);
  }
  // Wooden walkways
  for (let i = 0; i < 3; i++) {
    const walkGeo = new THREE.BoxGeometry(2, 0.12, 20);
    const walk = new THREE.Mesh(walkGeo, new THREE.MeshLambertMaterial({ color: 0x9a7040 }));
    walk.position.set(-30 + i * 30, 0.06, 20);
    group.add(walk);
  }
  // Lifeguard towers
  buildLifeguardTower(group, -35, 18);
  buildLifeguardTower(group, 35, 18);
  // Public toilets
  const toilet = buildToiletRoom(6, 5, true);
  toilet.position.set(-42, 0, -22);
  group.add(toilet);

  buildLandmarkLabel(group, landmark);
  return group;
}

function buildChalet(group, x, z) {
  const g = new THREE.Group();
  const body = makeBox(6, 3.2, 5.5, 0xc8a870);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(5, 2.0, 4), new THREE.MeshLambertMaterial({ color: 0x8a4820 }));
  roof.position.y = 4.2; roof.rotation.y = Math.PI / 4;
  const bed = buildBed('double');
  bed.position.set(0, 0, -0.5);
  const wardrobe = buildWardrobe();
  wardrobe.position.set(-2.2, 0, -2.0);
  g.add(body, roof, bed, wardrobe);
  g.position.set(x, 0, z);
  group.add(g);
}

function buildBeachSetup(group, x, z) {
  // Chair
  const seat = makeBox(0.6, 0.08, 1.4, 0x9a7040);
  seat.position.set(x, 0.4, z);
  // Umbrella pole
  const pole = makeBox(0.06, 2.0, 0.06, 0xb08040);
  pole.position.set(x, 0, z - 0.3);
  const umbrella = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.6, 10), new THREE.MeshLambertMaterial({ color: [0xe84040, 0x2080e0, 0x40b040, 0xe8e040][Math.floor(Math.random() * 4)] }));
  umbrella.rotation.x = Math.PI;
  umbrella.position.set(x, 2.1, z - 0.3);
  group.add(seat, pole, umbrella);
}

function buildLifeguardTower(group, x, z) {
  const platform = makeBox(2.5, 0.2, 2.5, 0x9a7040);
  platform.position.set(x, 2.4, z);
  for (const [lx, lz] of [[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]]) {
    const leg = makeBox(0.16, 2.4, 0.16, 0x9a7040);
    leg.position.set(x + lx, 0, z + lz);
    group.add(leg);
  }
  const roof = new THREE.Mesh(new THREE.BoxGeometry(3, 0.2, 3), new THREE.MeshLambertMaterial({ color: 0xe84020 }));
  roof.position.set(x, 3.6, z);
  group.add(platform, roof);
}
