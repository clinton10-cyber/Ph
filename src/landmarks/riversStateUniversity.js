import * as THREE from 'three';
import { buildBuildingShell, buildOfficeRoom, buildToiletRoom, buildKitchenRoom } from './buildingFactory.js';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeBox } from '../utils/helpers.js';
import { FLOOR_HEIGHT } from '../utils/constants.js';

export function buildUniversity(landmark) {
  const group = new THREE.Group();
  const campus = new THREE.Mesh(new THREE.PlaneGeometry(80, 60), new THREE.MeshLambertMaterial({ color: 0x3a7a30 }));
  campus.rotation.x = -Math.PI / 2; campus.position.y = 0.01;
  group.add(campus);
  // Admin block
  const admin = buildBuildingShell({ width: 22, depth: 16, floors: 3, color: 0x8a7060, roofColor: 0x605040, style: 'modern', name: 'rsu-admin' });
  admin.position.set(-20, 0, -15);
  group.add(admin);
  // Lecture hall 1
  const lh1 = buildBuildingShell({ width: 28, depth: 18, floors: 2, color: 0x9a8878, roofColor: 0x705848, style: 'flat', name: 'rsu-lh1' });
  lh1.position.set(18, 0, -12);
  group.add(lh1);
  // Library
  const lib = buildBuildingShell({ width: 20, depth: 18, floors: 2, color: 0x8a8070, roofColor: 0x605848, style: 'modern', name: 'rsu-lib' });
  lib.position.set(-20, 0, 15);
  group.add(lib);
  // Lab block
  const labs = buildBuildingShell({ width: 18, depth: 14, floors: 2, color: 0x9090a0, roofColor: 0x606870, style: 'modern', name: 'rsu-labs' });
  labs.position.set(20, 0, 16);
  group.add(labs);
  // Sports field
  const field = new THREE.Mesh(new THREE.PlaneGeometry(40, 28), new THREE.MeshLambertMaterial({ color: 0x2a6020 }));
  field.rotation.x = -Math.PI / 2; field.position.set(-10, 0.02, 22);
  group.add(field);
  // Cafeteria
  const caf = buildBuildingShell({ width: 14, depth: 10, floors: 1, color: 0xc8b898, roofColor: 0x807060, style: 'flat', name: 'rsu-caf' });
  caf.position.set(28, 0, 20);
  group.add(caf);
  // Interior details
  buildLectureHallInterior(group, 18, 0, -12);
  buildLibraryInterior(group, -20, 0, 15);
  const toilet = buildToiletRoom(5, 4, true);
  toilet.position.set(-30, 0, -8);
  group.add(toilet);
  const kitchen = buildKitchenRoom();
  kitchen.position.set(28, 0, 20);
  group.add(kitchen);

  buildLandmarkLabel(group, landmark);
  return group;
}

function buildLectureHallInterior(group, x, y, z) {
  // Tiered seating rows
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 10; col++) {
      const seat = makeBox(0.5, 0.4, 0.45, 0x505868);
      seat.position.set(x - 12 + col * 2.4, y + 0.2 + row * 0.3, z - 5 + row * 2.4);
      group.add(seat);
    }
  }
  const podium = makeBox(1.4, 1.1, 0.8, 0x7a6040);
  podium.position.set(x, y, z + 6);
  group.add(podium);
}

function buildLibraryInterior(group, x, y, z) {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      const shelf = makeBox(0.3, 2.2, 3.5, 0x8a6040);
      shelf.position.set(x - 7 + j * 5, y, z - 5 + i * 4);
      group.add(shelf);
    }
  }
  // Reading tables
  for (let i = 0; i < 4; i++) {
    const table = makeBox(3.0, 0.08, 1.0, 0xb0906a);
    table.position.set(x + 6, y + 0.74, z - 4 + i * 4);
    group.add(table);
  }
}
