import * as THREE from 'three';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeBox, makeCylinder } from '../utils/helpers.js';

export function buildIsaacBoroPark(landmark) {
  const group = new THREE.Group();
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(50, 40), new THREE.MeshLambertMaterial({ color: 0x3a7a30 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = 0.01;
  group.add(ground);
  // Memorial statue base
  buildMemorialStatue(group, 0, 0);
  // Amphitheatre
  buildAmphitheatre(group, 15, -10);
  // Paved paths
  const mat = new THREE.MeshLambertMaterial({ color: 0xc8b890 });
  const h = new THREE.Mesh(new THREE.PlaneGeometry(48, 2.5), mat);
  h.rotation.x = -Math.PI / 2; h.position.y = 0.02;
  const v = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 38), mat);
  v.rotation.x = -Math.PI / 2; v.position.y = 0.02;
  group.add(h, v);
  // Benches
  for (let i = 0; i < 6; i++) {
    const bench = makeBox(1.8, 0.1, 0.42, 0x7a5830);
    bench.position.set(-18 + i * 7, 0.44, 12);
    group.add(bench);
  }
  // Public toilets
  const toilet = makeBox(5, 3, 3.5, 0xb0a898);
  toilet.position.set(-20, 0, -15);
  group.add(toilet);

  buildLandmarkLabel(group, landmark);
  return group;
}

function buildMemorialStatue(group, x, z) {
  // Plinth
  const plinth = makeBox(4, 2.0, 4, 0xb8b0a0);
  plinth.position.set(x, 0, z);
  // Statue silhouette (abstract)
  const body = makeBox(0.8, 2.8, 0.6, 0x707070);
  body.position.set(x, 2.4, z);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 6), new THREE.MeshLambertMaterial({ color: 0x707070 }));
  head.position.set(x, 4.1, z);
  // Arm raised
  const arm = makeBox(0.24, 0.24, 1.4, 0x707070);
  arm.position.set(x + 0.3, 4.0, z - 0.5);
  arm.rotation.x = -0.4;
  group.add(plinth, body, head, arm);
}

function buildAmphitheatre(group, x, z) {
  const mat = new THREE.MeshLambertMaterial({ color: 0xb8b0a0 });
  // Tiered seating semicircle
  for (let tier = 0; tier < 4; tier++) {
    const tierGeo = new THREE.CylinderGeometry(3 + tier * 2, 3 + tier * 2, 0.4, 16, 1, false, 0, Math.PI);
    const tierMesh = new THREE.Mesh(tierGeo, mat);
    tierMesh.position.set(x, tier * 0.5, z);
    group.add(tierMesh);
  }
  // Stage
  const stage = makeBox(6, 0.4, 3, 0xc8a870);
  stage.position.set(x, 0, z + 6);
  group.add(stage);
}
