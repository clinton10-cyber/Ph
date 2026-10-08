import * as THREE from 'three';
import { COLORS } from '../utils/constants.js';
import { PROFILE } from '../utils/deviceProfile.js';

// Shared geometries for instancing
let _trunkGeo, _canopyGeo, _palmTrunkGeo, _palmFrondGeo;

function getSharedGeos() {
  if (!_trunkGeo) {
    _trunkGeo = new THREE.CylinderGeometry(0.15, 0.22, 2.8, 6);
    _canopyGeo = new THREE.SphereGeometry(1.4, 7, 5);
    _palmTrunkGeo = new THREE.CylinderGeometry(0.12, 0.18, 5, 6);
    _palmFrondGeo = new THREE.SphereGeometry(1.8, 6, 4);
  }
  return { _trunkGeo, _canopyGeo, _palmTrunkGeo, _palmFrondGeo };
}

export function buildVegetation(scene) {
  const group = new THREE.Group();
  group.name = 'vegetation';

  const { _trunkGeo, _canopyGeo, _palmTrunkGeo, _palmFrondGeo } = getSharedGeos();

  const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5a3a20 });
  const canopyMat = new THREE.MeshLambertMaterial({ color: 0x2a6030 });
  const canopyMat2 = new THREE.MeshLambertMaterial({ color: 0x3a7a40 });
  const palmTrunkMat = new THREE.MeshLambertMaterial({ color: 0x7a6040 });
  const palmFrondMat = new THREE.MeshLambertMaterial({ color: 0x286040 });

  // Street trees along roads (instanced for performance)
  const trim = arr => {
    const n = Math.ceil(arr.length * PROFILE.treeCount);
    return arr.slice(0, n);
  };

  const streetTreePositions = trim(generateStreetTreePositions());
  buildInstancedTrees(group, streetTreePositions, _trunkGeo, trunkMat, _canopyGeo, canopyMat);

  const parkPositions = trim(generateParkTreePositions());
  buildInstancedTrees(group, parkPositions, _trunkGeo, trunkMat, _canopyGeo, canopyMat2);

  const palmPositions = trim(generatePalmPositions());
  buildPalms(group, palmPositions, _palmTrunkGeo, palmTrunkMat, _palmFrondGeo, palmFrondMat);

  scene.add(group);
  return group;
}

function buildInstancedTrees(parent, positions, trunkGeo, trunkMat, canopyGeo, canopyMat) {
  if (positions.length === 0) return;

  const trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, positions.length);
  const canopyMesh = new THREE.InstancedMesh(canopyGeo, canopyMat, positions.length);
  trunkMesh.castShadow = false;
  canopyMesh.castShadow = false;
  canopyMesh.receiveShadow = true;

  const dummy = new THREE.Object3D();
  positions.forEach((pos, i) => {
    const s = 0.8 + Math.random() * 0.5;
    dummy.position.set(pos.x, 1.4 * s, pos.z);
    dummy.scale.set(s, s, s);
    dummy.rotation.y = Math.random() * Math.PI * 2;
    dummy.updateMatrix();
    trunkMesh.setMatrixAt(i, dummy.matrix);

    dummy.position.set(pos.x, (2.8 + 1.4) * s, pos.z);
    dummy.updateMatrix();
    canopyMesh.setMatrixAt(i, dummy.matrix);
  });

  trunkMesh.instanceMatrix.needsUpdate = true;
  canopyMesh.instanceMatrix.needsUpdate = true;
  parent.add(trunkMesh);
  parent.add(canopyMesh);
}

function buildPalms(parent, positions, trunkGeo, trunkMat, frondGeo, frondMat) {
  if (positions.length === 0) return;
  const trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, positions.length);
  const frondMesh = new THREE.InstancedMesh(frondGeo, frondMat, positions.length);
  trunkMesh.castShadow = false;
  frondMesh.castShadow = false;

  const dummy = new THREE.Object3D();
  positions.forEach((pos, i) => {
    const s = 0.9 + Math.random() * 0.6;
    dummy.position.set(pos.x, 2.5 * s, pos.z);
    dummy.scale.setScalar(s);
    dummy.rotation.z = (Math.random() - 0.5) * 0.15;
    dummy.updateMatrix();
    trunkMesh.setMatrixAt(i, dummy.matrix);

    dummy.position.set(pos.x, 5.5 * s, pos.z);
    dummy.updateMatrix();
    frondMesh.setMatrixAt(i, dummy.matrix);
  });

  trunkMesh.instanceMatrix.needsUpdate = true;
  frondMesh.instanceMatrix.needsUpdate = true;
  parent.add(trunkMesh);
  parent.add(frondMesh);
}

function generateStreetTreePositions() {
  const positions = [];
  // Along major roads with spacing
  const roads = [
    { start: [-200, -60], end: [200, -60], count: 16 },
    { start: [0, -280], end: [0, 140], count: 20 },
    { start: [-140, -80], end: [200, 140], count: 18 },
  ];
  roads.forEach(r => {
    for (let i = 0; i < r.count; i++) {
      const t = i / (r.count - 1);
      const x = r.start[0] + (r.end[0] - r.start[0]) * t;
      const z = r.start[1] + (r.end[1] - r.start[1]) * t;
      const offset = 7 + Math.random() * 2;
      positions.push({ x: x + offset, z: z + (Math.random() - 0.5) * 2 });
      positions.push({ x: x - offset, z: z + (Math.random() - 0.5) * 2 });
    }
  });
  return positions;
}

function generateParkTreePositions() {
  const positions = [];
  // Pleasure Park (-180, 120) area
  for (let i = 0; i < 30; i++) {
    positions.push({
      x: -180 + (Math.random() - 0.5) * 70,
      z: 120 + (Math.random() - 0.5) * 50
    });
  }
  // Isaac Boro Park (-40, 60)
  for (let i = 0; i < 20; i++) {
    positions.push({
      x: -40 + (Math.random() - 0.5) * 40,
      z: 60 + (Math.random() - 0.5) * 30
    });
  }
  // GRA area
  for (let i = 0; i < 25; i++) {
    positions.push({
      x: -60 + (Math.random() - 0.5) * 80,
      z: -160 + (Math.random() - 0.5) * 60
    });
  }
  return positions;
}

function generatePalmPositions() {
  const positions = [];
  // Tourist Beach (-280, 200)
  for (let i = 0; i < 22; i++) {
    positions.push({
      x: -280 + (Math.random() - 0.5) * 90,
      z: 190 + Math.random() * 20
    });
  }
  // Waterfront area
  for (let i = 0; i < 12; i++) {
    positions.push({
      x: -200 + (Math.random() - 0.5) * 50,
      z: 155 + (Math.random() - 0.5) * 10
    });
  }
  return positions;
}
