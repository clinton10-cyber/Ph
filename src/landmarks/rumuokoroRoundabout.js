import * as THREE from 'three';
import { buildBuildingShell, buildToiletRoom } from './buildingFactory.js';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeBox } from '../utils/helpers.js';

export function buildRumuokoroArea(landmark) {
  const group = new THREE.Group();
  // Central island (roundabout is built in roads.js - this just adds context buildings)
  // Surrounding commercial buildings
  const positions = [
    { x: -25, z: -20 }, { x: 25, z: -20 }, { x: -25, z: 20 }, { x: 25, z: 20 }
  ];
  positions.forEach((pos, i) => {
    const shop = buildBuildingShell({ width: 12, depth: 9, floors: 2, color: [0xc0a880, 0xb0c0a8, 0xa8b0c0, 0xc0a8b0][i], style: 'flat', name: `rumu-shop-${i}` });
    shop.position.set(pos.x, 0, pos.z);
    group.add(shop);
  });
  // Bus stop shelters
  for (const [x, z] of [[-20, 10], [20, 10], [0, -22], [0, 22]]) {
    buildBusStop(group, x, z);
  }
  // Public toilets
  const toilet = buildToiletRoom(4, 3.5, true);
  toilet.position.set(-28, 0, 0);
  group.add(toilet);

  buildLandmarkLabel(group, landmark);
  return group;
}

function buildBusStop(group, x, z) {
  const roof = makeBox(4.5, 0.2, 1.6, 0x909090);
  roof.position.set(x, 2.8, z);
  const back = makeBox(4.5, 2.8, 0.1, 0x8ab4d4);
  back.position.set(x, 1.4, z - 0.7);
  // Side panels
  const side1 = makeBox(0.1, 2.8, 1.4, 0x8ab4d4);
  side1.position.set(x - 2.2, 1.4, z);
  const bench = makeBox(3.5, 0.1, 0.4, 0x9a7040);
  bench.position.set(x, 0.44, z - 0.2);
  group.add(roof, back, side1, bench);
}
