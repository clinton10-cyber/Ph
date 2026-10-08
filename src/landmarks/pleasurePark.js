import * as THREE from 'three';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeBox, makeCylinder } from '../utils/helpers.js';

export function buildPleasurePark(landmark) {
  const group = new THREE.Group();
  // Ground base
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 60),
    new THREE.MeshLambertMaterial({ color: 0x3a7a30 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0.01;
  group.add(ground);

  // Paved walkway paths
  buildWalkways(group);
  // Fountain
  buildFountain(group, 0, 0);
  // Gazebo
  buildGazebo(group, -20, 10);
  buildGazebo(group, 20, -10);
  // Benches
  for (let i = 0; i < 8; i++) {
    buildBench(group, -25 + i * 7, 15);
    buildBench(group, -25 + i * 7, -15);
  }
  // Kiosks
  buildKiosk(group, -30, 0);
  buildKiosk(group, 30, 0);
  // Public toilets block
  buildPublicToiletBlock(group, -35, -20);
  // Small pond
  buildPond(group, 25, 20);
  // Decorative lamps
  for (let i = 0; i < 10; i++) {
    buildLamp(group, -35 + i * 8, 22);
  }

  buildLandmarkLabel(group, landmark);
  return group;
}

function buildWalkways(group) {
  const mat = new THREE.MeshLambertMaterial({ color: 0xc8b890 });
  // Cross paths
  const h = new THREE.Mesh(new THREE.PlaneGeometry(78, 3), mat);
  h.rotation.x = -Math.PI / 2; h.position.y = 0.02;
  const v = new THREE.Mesh(new THREE.PlaneGeometry(3, 58), mat);
  v.rotation.x = -Math.PI / 2; v.position.y = 0.02;
  group.add(h, v);
}

function buildFountain(group, x, z) {
  const mat = new THREE.MeshLambertMaterial({ color: 0xc8c0b0 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(5, 5.4, 0.4, 12), mat);
  base.position.set(x, 0.2, z);
  const pool = new THREE.Mesh(
    new THREE.CylinderGeometry(4.6, 4.6, 0.5, 12),
    new THREE.MeshLambertMaterial({ color: 0x2060a0, transparent: true, opacity: 0.8 })
  );
  pool.position.set(x, 0.3, z);
  const shaft = makeCylinder(0.12, 0.16, 2.0, 0xd8d0c4, 8);
  shaft.position.set(x, 0.4, z);
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 6), new THREE.MeshLambertMaterial({ color: 0xd8d0c4 }));
  top.position.set(x, 2.5, z);
  group.add(base, pool, shaft, top);
}

function buildGazebo(group, x, z) {
  const g = new THREE.Group();
  // Floor
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 0.2, 8), new THREE.MeshLambertMaterial({ color: 0xb8a888 }));
  floor.position.y = 0.1;
  // Columns
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const col = makeCylinder(0.15, 0.18, 3.0, 0xd8d0c4, 8);
    col.position.set(Math.cos(angle) * 3.4, 0, Math.sin(angle) * 3.4);
    g.add(col);
  }
  // Roof
  const roof = new THREE.Mesh(new THREE.ConeGeometry(4.5, 1.8, 8), new THREE.MeshLambertMaterial({ color: 0x8a6040 }));
  roof.position.y = 3.9;
  g.add(floor, roof);
  g.position.set(x, 0, z);
  group.add(g);
}

function buildBench(group, x, z) {
  const mat = new THREE.MeshLambertMaterial({ color: 0x7a5830 });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.42), mat);
  seat.position.set(x, 0.44, z);
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.42, 0.06), mat);
  back.position.set(x, 0.66, z - 0.18);
  group.add(seat, back);
}

function buildKiosk(group, x, z) {
  const body = makeBox(3.0, 2.4, 2.4, 0xd8a860);
  body.position.set(x, 0, z);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.3, 2.8), new THREE.MeshLambertMaterial({ color: 0x8a4020 }));
  roof.position.set(x, 2.55, z);
  const counter = makeBox(2.8, 0.1, 0.5, 0x9a7848);
  counter.position.set(x, 1.0, z + 1.3);
  group.add(body, roof, counter);
}

function buildPublicToiletBlock(group, x, z) {
  const body = makeBox(6, 3, 4, 0xb8b0a8);
  body.position.set(x, 0, z);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.3, 4.4), new THREE.MeshLambertMaterial({ color: 0x707870 }));
  roof.position.set(x, 3.15, z);
  group.add(body, roof);
}

function buildPond(group, x, z) {
  const pond = new THREE.Mesh(
    new THREE.CircleGeometry(6, 24),
    new THREE.MeshLambertMaterial({ color: 0x2060a0, transparent: true, opacity: 0.75 })
  );
  pond.rotation.x = -Math.PI / 2;
  pond.position.set(x, 0.02, z);
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(6, 0.3, 6, 24),
    new THREE.MeshLambertMaterial({ color: 0xb0a890 })
  );
  rim.rotation.x = -Math.PI / 2;
  rim.position.set(x, 0.05, z);
  group.add(pond, rim);
}

function buildLamp(group, x, z) {
  const pole = makeCylinder(0.06, 0.08, 4.5, 0x404848, 6);
  pole.position.set(x, 0, z);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), new THREE.MeshLambertMaterial({ color: 0xf0e8a0, emissive: 0xf0e8a0, emissiveIntensity: 0.2 }));
  head.position.set(x, 4.8, z);
  group.add(pole, head);
}
