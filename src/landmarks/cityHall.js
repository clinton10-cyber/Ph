import * as THREE from 'three';
import { buildBuildingShell, buildOfficeRoom, buildToiletRoom, buildKitchenRoom, buildReceptionRoom, buildConferenceRoom } from './buildingFactory.js';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeCylinder, makeBox } from '../utils/helpers.js';
import { FLOOR_HEIGHT } from '../utils/constants.js';
import { buildFilingCabinet } from '../furniture/desks.js';

export function buildCityHall(landmark) {
  const group = new THREE.Group();
  group.name = 'city-hall';

  const main = buildBuildingShell({
    width: 24, depth: 18, floors: 3,
    color: 0xc8a96e, roofColor: 0x7a6848,
    style: 'colonial', name: 'city-hall-main'
  });
  group.add(main);

  const leftWing = buildBuildingShell({
    width: 10, depth: 12, floors: 2,
    color: 0xc0a060, roofColor: 0x7a6848, style: 'colonial', name: 'city-hall-lw'
  });
  leftWing.position.set(-17, 0, 0);
  group.add(leftWing);

  const rightWing = buildBuildingShell({
    width: 10, depth: 12, floors: 2,
    color: 0xc0a060, roofColor: 0x7a6848, style: 'colonial', name: 'city-hall-rw'
  });
  rightWing.position.set(17, 0, 0);
  group.add(rightWing);

  buildPortico(group);
  buildFlagPoles(group);

  const reception = buildReceptionRoom(10, 7);
  reception.position.set(-5, 0, 0);
  group.add(reception);

  const council = buildConferenceRoom(14, 9);
  council.position.set(0, FLOOR_HEIGHT, -2);
  group.add(council);

  for (let i = 0; i < 4; i++) {
    const office = buildOfficeRoom();
    office.position.set(-8 + i * 5, FLOOR_HEIGHT * 2, -3);
    group.add(office);
  }

  const toilet = buildToiletRoom(5, 4, true);
  toilet.position.set(8, 0, 5);
  group.add(toilet);

  const kitchen = buildKitchenRoom();
  kitchen.position.set(-9, 0, -5);
  group.add(kitchen);

  buildArchiveRoom(group);
  buildLandmarkLabel(group, landmark);
  return group;
}

function buildPortico(group) {
  const stepMat = new THREE.MeshLambertMaterial({ color: 0xd0c8b0 });
  for (let s = 0; s < 5; s++) {
    const geo = new THREE.BoxGeometry(20 - s, 0.18, 1.0);
    const step = new THREE.Mesh(geo, stepMat);
    step.position.set(0, s * 0.18, 9 - s * 0.3);
    group.add(step);
  }
  for (let i = 0; i < 5; i++) {
    const col = makeCylinder(0.32, 0.38, FLOOR_HEIGHT * 2, 0xd8d0c4, 12);
    col.position.set(-8 + i * 4, 0, 9);
    group.add(col);
  }
  const ped = new THREE.Mesh(
    new THREE.BoxGeometry(20, 0.4, 0.6),
    new THREE.MeshLambertMaterial({ color: 0xd8d0c4 })
  );
  ped.position.set(0, FLOOR_HEIGHT * 2 + 0.2, 9);
  group.add(ped);
}

function buildFlagPoles(group) {
  for (const x of [-14, 0, 14]) {
    const pole = makeCylinder(0.06, 0.08, 12, 0xb0b8c0, 6);
    pole.position.set(x, 0, 10);
    const flag = makeBox(2.8, 1.6, 0.04, 0x228b22);
    flag.position.set(x + 1.4, 10.5, 10);
    group.add(pole, flag);
  }
}

function buildArchiveRoom(group) {
  const room = new THREE.Group();
  room.name = 'archive-room';
  for (let i = 0; i < 6; i++) {
    const cab = buildFilingCabinet();
    cab.position.set(-7 + i * 2.5, 0, 0);
    room.add(cab);
  }
  room.position.set(0, FLOOR_HEIGHT, 5);
  group.add(room);
}
