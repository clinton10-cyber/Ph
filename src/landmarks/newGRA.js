import * as THREE from 'three';
import { buildBuildingShell, buildToiletRoom, buildKitchenRoom } from './buildingFactory.js';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeBox } from '../utils/helpers.js';
import { buildBed, buildWardrobe, buildSofa, buildCoffeeTable } from '../furniture/sofas.js';
import { FLOOR_HEIGHT } from '../utils/constants.js';

export function buildNewGRA(landmark) {
  const group = new THREE.Group();
  // Neighbourhood ground
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, 70), new THREE.MeshLambertMaterial({ color: 0x4a7a38 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = 0.01;
  group.add(ground);
  // Paved streets
  buildGRAStreets(group);
  // Houses in grid
  const housePositions = [
    { x: -32, z: -22 }, { x: -32, z: 0 }, { x: -32, z: 22 },
    { x: 0, z: -22 }, { x: 0, z: 0 }, { x: 0, z: 22 },
    { x: 32, z: -22 }, { x: 32, z: 0 }, { x: 32, z: 22 }
  ];
  housePositions.forEach((pos, i) => {
    buildGRAHouse(group, pos.x, 0, pos.z, i);
  });

  buildLandmarkLabel(group, landmark);
  return group;
}

function buildGRAStreets(group) {
  const mat = new THREE.MeshLambertMaterial({ color: 0x2a2e34 });
  // H street
  const h = new THREE.Mesh(new THREE.PlaneGeometry(88, 5), mat);
  h.rotation.x = -Math.PI / 2; h.position.set(0, 0.02, 0);
  // V street
  const v = new THREE.Mesh(new THREE.PlaneGeometry(5, 68), mat);
  v.rotation.x = -Math.PI / 2; v.position.set(0, 0.02, 0);
  group.add(h, v);
}

function buildGRAHouse(group, x, y, z, index) {
  const g = new THREE.Group();
  // Main building
  const houseColors = [0xe8d8c0, 0xd0c8e0, 0xe0d0c0, 0xd8e0d8];
  const roofColors = [0xa84020, 0x8a6040, 0x706858, 0x507060];
  const main = buildBuildingShell({
    width: 14, depth: 12, floors: 2,
    color: houseColors[index % 4], roofColor: roofColors[index % 4],
    style: 'colonial', name: `gra-house-${index}`
  });
  g.add(main);
  // Compound wall
  for (const [wx, wz, ww, wd] of [
    [0, 9, 18, 0.3], [0, -9, 18, 0.3], [9, 0, 0.3, 18], [-9, 0, 0.3, 18]
  ]) {
    const wall = makeBox(ww, 1.8, wd, 0xc0b898);
    wall.position.set(wx, 0, wz);
    g.add(wall);
  }
  // Garage
  const garage = makeBox(5.5, 3.5, 5, 0xd0c8b8);
  garage.position.set(-7, 0, 6);
  g.add(garage);
  // Parked car inside garage (simple box)
  const car = makeBox(3.8, 1.5, 1.9, 0x4060a0);
  car.position.set(-7, 0, 6);
  g.add(car);
  // Garden
  const garden = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.MeshLambertMaterial({ color: 0x3a7a30 }));
  garden.rotation.x = -Math.PI / 2; garden.position.set(5, 0.02, 6);
  g.add(garden);
  // Interior rooms ground floor
  const livingRoom = new THREE.Group();
  const sofa = buildSofa(3);
  sofa.position.set(0, 0, 1);
  const table = buildCoffeeTable();
  table.position.set(0, 0, 3.5);
  livingRoom.add(sofa, table);
  livingRoom.position.set(0, 0, 0);
  g.add(livingRoom);
  // Kitchen
  const kitchen = buildKitchenRoom(5, 4);
  kitchen.position.set(4, 0, -2);
  g.add(kitchen);
  // Bedrooms on first floor
  for (let i = 0; i < 3; i++) {
    const bed = buildBed(i === 0 ? 'double' : 'single');
    bed.position.set(-3 + i * 3.5, FLOOR_HEIGHT, -2);
    g.add(bed);
    const wardrobe = buildWardrobe();
    wardrobe.position.set(-3 + i * 3.5, FLOOR_HEIGHT, -4);
    g.add(wardrobe);
  }
  const toilet = buildToiletRoom(3.5, 3, false);
  toilet.position.set(5, FLOOR_HEIGHT, -2);
  g.add(toilet);

  g.position.set(x, y, z);
  group.add(g);
}
