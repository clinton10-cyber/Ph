import * as THREE from 'three';
import { buildBuildingShell, buildToiletRoom, buildKitchenRoom, buildReceptionRoom } from './buildingFactory.js';
import { buildLandmarkLabel } from './labelUtils.js';
import { makeBox, makeCylinder } from '../utils/helpers.js';
import { buildSofa } from '../furniture/sofas.js';

export function buildAirport(landmark) {
  const group = new THREE.Group();

  // Main terminal - glass facade
  const terminal = buildBuildingShell({
    width: 120, depth: 40, floors: 2,
    color: 0x9ab8cc, roofColor: 0x506070,
    style: 'modern', name: 'airport-terminal'
  });
  group.add(terminal);

  // Control tower
  buildControlTower(group, 50, -25);

  // Runway
  buildRunway(group);

  // Jet bridges (4)
  for (let i = 0; i < 4; i++) {
    buildJetBridge(group, -45 + i * 30, 22);
  }

  // Parked aircraft
  buildStaticAircraft(group, -40, -80, 0);
  buildStaticAircraft(group, 20, -90, 0.2);
  buildStaticAircraft(group, 70, -85, -0.15);

  // Check-in hall furniture
  buildCheckInHall(group);

  // Waiting lounge
  buildWaitingLounge(group, 0, 1, -10);

  // Toilets
  const toilet = buildToiletRoom(6, 5, true);
  toilet.position.set(45, 0, 10);
  group.add(toilet);

  // Ground vehicles
  buildAirportGroundVehicles(group);

  buildLandmarkLabel(group, landmark);
  return group;
}

function buildControlTower(group, x, z) {
  const base = makeBox(8, 16, 8, 0xc0b8a8);
  base.position.set(x, 0, z);
  const cab = makeBox(10, 4, 10, 0x9ab8cc);
  cab.position.set(x, 18, z);
  // Radar disc
  const radarGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.3, 16);
  const radar = new THREE.Mesh(radarGeo, new THREE.MeshLambertMaterial({ color: 0x606870 }));
  radar.position.set(x, 21, z);
  radar.name = 'radar';
  radar.userData.animates = true;
  group.add(base, cab, radar);
}

function buildRunway(group) {
  // Main runway
  const rwy = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 260),
    new THREE.MeshLambertMaterial({ color: 0x2a2e34 })
  );
  rwy.rotation.x = -Math.PI / 2;
  rwy.position.set(0, 0.02, -120);
  group.add(rwy);

  // Centre line markings
  const lineMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  for (let i = 0; i < 20; i++) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 6), lineMat);
    line.rotation.x = -Math.PI / 2;
    line.position.set(0, 0.03, -240 + i * 14);
    group.add(line);
  }

  // Taxiway
  const taxi = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 80),
    new THREE.MeshLambertMaterial({ color: 0x252830 })
  );
  taxi.rotation.x = -Math.PI / 2;
  taxi.position.set(30, 0.02, -100);
  group.add(taxi);
}

function buildJetBridge(group, x, z) {
  const tube = makeBox(3, 3, 16, 0x9090a0);
  tube.position.set(x, 3, z - 4);
  const gate = makeBox(4, 4, 4, 0x8090a0);
  gate.position.set(x, 3, z);
  group.add(tube, gate);
}

function buildStaticAircraft(group, x, z, ry) {
  const g = new THREE.Group();
  // Fuselage
  const fuse = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.0, 38, 10),
    new THREE.MeshLambertMaterial({ color: 0xf0f0ee })
  );
  fuse.rotation.z = Math.PI / 2;
  fuse.position.y = 4;
  // Wings
  const wingGeo = new THREE.BoxGeometry(42, 0.4, 6);
  const wing = new THREE.Mesh(wingGeo, new THREE.MeshLambertMaterial({ color: 0xe8e8e4 }));
  wing.position.y = 3.2;
  // Tail
  const tailH = new THREE.Mesh(new THREE.BoxGeometry(14, 0.3, 2.5), new THREE.MeshLambertMaterial({ color: 0xe8e8e4 }));
  tailH.position.set(0, 5, -17);
  const tailV = makeBox(0.4, 5, 4, 0xe8e8e4);
  tailV.position.set(0, 5, -16);
  // Engines (2)
  for (const xOff of [-12, 12]) {
    const eng = makeCylinder(1.2, 1.4, 5, 0xd0d0d0, 10);
    eng.rotation.z = Math.PI / 2;
    eng.position.set(xOff, 2.8, 0);
    g.add(eng);
  }
  // Landing gear
  const gear = makeBox(0.4, 2.5, 0.4, 0x505050);
  gear.position.set(0, 1.2, 6);
  g.add(fuse, wing, tailH, tailV, gear);
  g.position.set(x, 0, z);
  g.rotation.y = ry;
  group.add(g);
}

function buildCheckInHall(group) {
  for (let i = 0; i < 8; i++) {
    const counter = makeBox(2.4, 1.2, 0.8, 0xd8d0c4);
    counter.position.set(-42 + i * 12, 0, -16);
    group.add(counter);
    const screen = makeBox(0.4, 0.5, 0.04, 0x102040);
    screen.position.set(-42 + i * 12, 1.2, -16.3);
    group.add(screen);
  }
}

function buildWaitingLounge(group, x, floor, z) {
  // Rows of seats
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      const seat = makeBox(0.5, 0.5, 0.5, 0x4a5060);
      seat.position.set(x - 12 + col * 4, 0.25, z + row * 2);
      group.add(seat);
    }
  }
}

function buildAirportGroundVehicles(group) {
  // Fuel truck
  buildGroundVehicle(group, -20, -50, 0x202060, 4, 1.8, 8);
  // Baggage cart
  buildGroundVehicle(group, 10, -45, 0xf0a020, 3, 1.2, 5);
  // Catering truck  
  buildGroundVehicle(group, 30, -55, 0xffffff, 3.5, 2.0, 7);
}

function buildGroundVehicle(group, x, z, color, w, h, d) {
  const body = makeBox(w, h, d, color);
  body.position.set(x, 0, z);
  // Wheels
  for (const [wx, wz] of [[-w/2+0.4, -d/2+0.5], [w/2-0.4, -d/2+0.5], [-w/2+0.4, d/2-0.5], [w/2-0.4, d/2-0.5]]) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.3, 10), new THREE.MeshLambertMaterial({ color: 0x202020 }));
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x + wx, 0.35, z + wz);
    group.add(wheel);
  }
  group.add(body);
}
