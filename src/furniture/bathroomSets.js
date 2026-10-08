import * as THREE from 'three';
import { makeBox, makeCylinder } from '../utils/helpers.js';

const WHITE_CERAMIC = 0xf4f2ee;
const CHROME = 0xc8ccd0;
const TILE = 0xe0dcd8;
const MIRROR_COLOR = 0x8ab4d4;

export function buildToilet() {
  const group = new THREE.Group();
  // Base / bowl
  const base = makeBox(0.44, 0.42, 0.56, WHITE_CERAMIC);
  // Tank
  const tank = makeBox(0.4, 0.3, 0.2, WHITE_CERAMIC);
  tank.position.set(0, 0.46, -0.22);
  // Seat
  const seatGeo = new THREE.TorusGeometry(0.16, 0.04, 8, 16);
  const seatMat = new THREE.MeshLambertMaterial({ color: WHITE_CERAMIC });
  const seat = new THREE.Mesh(seatGeo, seatMat);
  seat.rotation.x = Math.PI / 2;
  seat.position.set(0, 0.44, 0.08);
  group.add(base, tank, seat);
  group.name = 'toilet';
  return group;
}

export function buildSink() {
  const group = new THREE.Group();
  // Basin
  const basinGeo = new THREE.BoxGeometry(0.54, 0.2, 0.4);
  const basinMat = new THREE.MeshLambertMaterial({ color: WHITE_CERAMIC });
  const basin = new THREE.Mesh(basinGeo, basinMat);
  basin.position.y = 0.86;

  // Pedestal
  const ped = makeCylinder(0.08, 0.12, 0.8, WHITE_CERAMIC, 8);
  ped.position.y = 0;

  // Tap
  const tap = makeBox(0.04, 0.16, 0.04, CHROME);
  tap.position.set(0, 1.02, -0.08);

  // Mirror above
  const mirror = makeBox(0.5, 0.4, 0.04, MIRROR_COLOR);
  mirror.position.set(0, 1.3, -0.2);

  group.add(basin, ped, tap, mirror);
  group.name = 'sink';
  return group;
}

export function buildShowerCubicle() {
  const group = new THREE.Group();
  const h = 2.3;
  const w = 1.0;

  // Base tray
  const tray = makeBox(w, 0.12, w, WHITE_CERAMIC);

  // Walls (three sides, glass front)
  const wallMat = new THREE.MeshLambertMaterial({ color: TILE });
  const glassMat = new THREE.MeshLambertMaterial({ color: 0x8ab4d4, transparent: true, opacity: 0.45 });

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.12), wallMat);
  backWall.position.set(0, h / 2, -w / 2 + 0.06);
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, h, w), wallMat);
  leftWall.position.set(-w / 2 + 0.06, h / 2, 0);
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, h, w), wallMat);
  rightWall.position.set(w / 2 - 0.06, h / 2, 0);
  const glassDoor = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.06), glassMat);
  glassDoor.position.set(0, h / 2, w / 2 - 0.03);

  // Shower head
  const headGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.04, 10);
  const headMat = new THREE.MeshLambertMaterial({ color: CHROME });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.set(0, h - 0.2, -w / 2 + 0.2);
  head.rotation.x = Math.PI / 2;

  group.add(tray, backWall, leftWall, rightWall, glassDoor, head);
  group.name = 'shower';
  return group;
}

export function buildUrinal() {
  const group = new THREE.Group();
  const body = makeBox(0.28, 0.5, 0.22, WHITE_CERAMIC);
  body.position.set(0, 1.1, 0);
  const flush = makeBox(0.28, 0.06, 0.06, CHROME);
  flush.position.set(0, 1.64, -0.1);
  group.add(body, flush);
  group.name = 'urinal';
  return group;
}

export function buildBathroomCubicle() {
  const group = new THREE.Group();
  const h = 2.0; const w = 1.0; const d = 1.2;
  const wallMat = new THREE.MeshLambertMaterial({ color: TILE });

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.08), wallMat);
  backWall.position.set(0, h / 2, -d / 2);
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.08, h, d), wallMat);
  leftWall.position.set(-w / 2, h / 2, 0);
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.08, h, d), wallMat);
  rightWall.position.set(w / 2, h / 2, 0);

  // Door
  const doorGeo = new THREE.BoxGeometry(w - 0.1, h - 0.3, 0.06);
  const doorMat = new THREE.MeshLambertMaterial({ color: 0xc0a880 });
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(0, h / 2 - 0.15, d / 2);

  const toilet = buildToilet();
  toilet.position.z = -0.2;

  group.add(backWall, leftWall, rightWall, door, toilet);
  group.name = 'bathroom-cubicle';
  return group;
}
