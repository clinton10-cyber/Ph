import * as THREE from 'three';
import { FLOOR_HEIGHT, COLORS } from '../utils/constants.js';
import { makeBox, makeCylinder } from '../utils/helpers.js';
import {
  buildFloor, buildCeiling, buildWall, buildDoor, buildWindow, buildStairs, buildCorridor
} from '../buildingSystems/compartmentLayout.js';
import { buildOfficeDesk, buildOfficeChair, buildFilingCabinet, buildBookshelf, buildConferenceTable, buildReceptionDesk } from '../furniture/desks.js';
import { buildToilet, buildSink, buildUrinal, buildBathroomCubicle, buildShowerCubicle } from '../furniture/bathroomSets.js';
import { buildKitchenCounter, buildKitchenSink, buildRefrigerator, buildStove, buildMicrowave, buildDiningSet } from '../furniture/kitchenSets.js';
import { buildSofa, buildArmchair, buildBed, buildWardrobe, buildCoffeeTable } from '../furniture/sofas.js';

// Build a full multi-floor building shell
export function buildBuildingShell(config) {
  const { width, depth, floors, color, roofColor, style = 'modern', name } = config;
  const group = new THREE.Group();
  group.name = name || 'building';

  const wallMat = new THREE.MeshLambertMaterial({ color: color || COLORS.building_concrete });
  const roofMat = new THREE.MeshLambertMaterial({ color: roofColor || 0x606860 });

  // Solid building body
  const totalH = floors * FLOOR_HEIGHT;
  const bodyGeo = new THREE.BoxGeometry(width, totalH, depth);
  const body = new THREE.Mesh(bodyGeo, wallMat);
  body.position.y = totalH / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Floor slabs (visible in cross-section, thin strips on exterior)
  for (let f = 1; f < floors; f++) {
    const slabGeo = new THREE.BoxGeometry(width + 0.2, 0.15, depth + 0.2);
    const slabMat = new THREE.MeshLambertMaterial({ color: 0x888080 });
    const slab = new THREE.Mesh(slabGeo, slabMat);
    slab.position.y = f * FLOOR_HEIGHT;
    group.add(slab);
  }

  // Roof
  if (style === 'colonial') {
    buildColonialRoof(group, width, depth, totalH, roofMat);
  } else if (style === 'flat') {
    const roofGeo = new THREE.BoxGeometry(width + 0.4, 0.4, depth + 0.4);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = totalH + 0.2;
    group.add(roof);
  } else {
    const roofGeo = new THREE.BoxGeometry(width + 0.3, 0.3, depth + 0.3);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = totalH + 0.15;
    group.add(roof);
  }

  // Windows grid on all four faces
  addWindowsToBuilding(group, width, depth, floors, style);

  // Ground entrance steps
  buildEntranceSteps(group, width, style);

  return group;
}

function buildColonialRoof(group, w, d, baseH, mat) {
  // Pitched roof
  const pitchH = w * 0.3;
  const roofGeo = new THREE.ConeGeometry(Math.sqrt(w * w + d * d) / 2 * 1.05, pitchH, 4);
  const roof = new THREE.Mesh(roofGeo, mat);
  roof.position.y = baseH + pitchH / 2;
  roof.rotation.y = Math.PI / 4;
  group.add(roof);
}

function addWindowsToBuilding(group, width, depth, floors, style) {
  const windowH = 1.3;
  const windowW = style === 'colonial' ? 0.7 : 1.1;
  const windowMat = new THREE.MeshLambertMaterial({
    color: 0x6090b0, transparent: true, opacity: 0.6
  });
  const frameMat = new THREE.MeshLambertMaterial({ color: 0x707060 });

  const faces = [
    { normal: 'z+', ax: 'x', len: width, z: depth / 2 + 0.05, rx: 0, rz: 0 },
    { normal: 'z-', ax: 'x', len: width, z: -depth / 2 - 0.05, rx: 0, rz: Math.PI },
    { normal: 'x+', ax: 'z', len: depth, z: width / 2 + 0.05, rx: 0, rz: Math.PI / 2 },
    { normal: 'x-', ax: 'z', len: depth, z: -width / 2 - 0.05, rx: 0, rz: -Math.PI / 2 }
  ];

  faces.forEach(face => {
    const count = Math.max(1, Math.floor(face.len / 3.2));
    const spacing = face.len / (count + 1);

    for (let f = 0; f < floors; f++) {
      for (let i = 0; i < count; i++) {
        const offset = -face.len / 2 + spacing * (i + 1);
        const yPos = f * FLOOR_HEIGHT + FLOOR_HEIGHT * 0.55;

        const frameGeo = new THREE.BoxGeometry(windowW + 0.1, windowH + 0.1, 0.05);
        const frame = new THREE.Mesh(frameGeo, frameMat);
        const glassGeo = new THREE.BoxGeometry(windowW, windowH, 0.04);
        const glass = new THREE.Mesh(glassGeo, windowMat);

        if (face.normal === 'z+' || face.normal === 'z-') {
          frame.position.set(offset, yPos, face.z);
          glass.position.set(offset, yPos, face.z + (face.normal === 'z+' ? 0.01 : -0.01));
        } else {
          frame.position.set(face.z, yPos, offset);
          glass.position.set(face.z + (face.normal === 'x+' ? 0.01 : -0.01), yPos, offset);
          frame.rotation.y = Math.PI / 2;
          glass.rotation.y = Math.PI / 2;
        }
        group.add(frame, glass);
      }
    }
  });
}

function buildEntranceSteps(group, width, style) {
  const stepMat = new THREE.MeshLambertMaterial({ color: 0xb0a890 });
  const stairW = style === 'colonial' ? width * 0.5 : Math.min(width * 0.4, 8);
  for (let s = 0; s < 3; s++) {
    const stepGeo = new THREE.BoxGeometry(stairW - s * 0.6, 0.16, 0.6 + s * 0.6);
    const step = new THREE.Mesh(stepGeo, stepMat);
    step.position.y = s * 0.16;
    step.position.z = -s * 0.3;
    group.add(step);
  }

  // Columns for colonial style
  if (style === 'colonial') {
    for (const xOff of [-stairW / 2 + 0.3, -stairW / 6, stairW / 6, stairW / 2 - 0.3]) {
      const col = makeCylinder(0.22, 0.26, FLOOR_HEIGHT * 2 + 0.5, 0xd8d0c4, 12);
      col.position.set(xOff, 0, 0);
      group.add(col);
    }
  }
}

// --- Compartment room builders ---

export function buildOfficeRoom(w = 5, d = 4) {
  const group = new THREE.Group();
  group.name = 'office-room';

  group.add(buildFloor(w, d, 0xc0b8a8));
  group.add(buildCeiling(w, d));

  // Furnish with desks and chairs
  for (let i = 0; i < 2; i++) {
    const desk = buildOfficeDesk();
    desk.position.set(-w / 4 + i * w / 2, 0, -0.5);
    const chair = buildOfficeChair();
    chair.position.set(-w / 4 + i * w / 2, 0, 0.5);
    group.add(desk, chair);
  }
  const cabinet = buildFilingCabinet();
  cabinet.position.set(w / 2 - 0.4, 0, -d / 2 + 0.4);
  const shelf = buildBookshelf();
  shelf.position.set(-w / 2 + 0.6, 0, -d / 2 + 0.2);
  group.add(cabinet, shelf);

  // Door
  const door = buildDoor();
  door.position.set(0, 0, d / 2);
  group.add(door);

  return group;
}

export function buildToiletRoom(w = 4, d = 3.5, male = true) {
  const group = new THREE.Group();
  group.name = `toilet-room-${male ? 'male' : 'female'}`;
  group.add(buildFloor(w, d, 0xd8d4cc));

  // Cubicles along one wall
  for (let i = 0; i < 2; i++) {
    const cubicle = buildBathroomCubicle();
    cubicle.position.set(-w / 4 + i * w / 2, 0, -d / 4);
    group.add(cubicle);
  }
  // Sinks
  for (let i = 0; i < 2; i++) {
    const sink = buildSink();
    sink.position.set(-w / 4 + i * w / 2, 0, d / 3);
    group.add(sink);
  }
  // Urinals for male
  if (male) {
    for (let i = 0; i < 2; i++) {
      const urinal = buildUrinal();
      urinal.position.set(-w / 3 + i * w / 3, 0, d / 2 - 0.3);
      group.add(urinal);
    }
  }
  const door = buildDoor();
  door.position.set(0, 0, d / 2);
  group.add(door);
  return group;
}

export function buildKitchenRoom(w = 6, d = 4) {
  const group = new THREE.Group();
  group.name = 'kitchen-room';
  group.add(buildFloor(w, d, 0xd0c8bc));

  const counter = buildKitchenCounter(w * 0.6);
  counter.position.set(-0.3, 0, -d / 2 + 0.4);
  const ksink = buildKitchenSink();
  ksink.position.set(w / 2 - 0.5, 0, -d / 2 + 0.4);
  const fridge = buildRefrigerator();
  fridge.position.set(-w / 2 + 0.4, 0, -d / 2 + 0.4);
  const stove = buildStove();
  stove.position.set(0.4, 0, -d / 2 + 0.4);
  const micro = buildMicrowave();
  micro.position.set(0.4, 0.9, -d / 2 + 0.2);
  const dining = buildDiningSet();
  dining.position.set(0, 0, d / 4);

  group.add(counter, ksink, fridge, stove, micro, dining);
  const door = buildDoor();
  door.position.set(0, 0, d / 2);
  group.add(door);
  return group;
}

export function buildReceptionRoom(w = 8, d = 6) {
  const group = new THREE.Group();
  group.name = 'reception-room';
  group.add(buildFloor(w, d, 0xc8c0b0));

  const desk = buildReceptionDesk();
  desk.position.set(0, 0, -d / 4);
  const sofa1 = buildSofa(3);
  sofa1.position.set(-w / 4, 0, d / 4);
  const sofa2 = buildSofa(2);
  sofa2.position.set(w / 4, 0, d / 4);
  sofa2.rotation.y = Math.PI;
  const table = buildCoffeeTable();
  table.position.set(0, 0, d / 4);

  group.add(desk, sofa1, sofa2, table);
  return group;
}

export function buildConferenceRoom(w = 9, d = 6) {
  const group = new THREE.Group();
  group.name = 'conference-room';
  group.add(buildFloor(w, d, 0xb8b0a0));
  group.add(buildCeiling(w, d));

  const confTable = buildConferenceTable(10);
  confTable.position.set(0, 0, 0);
  group.add(confTable);

  // Projector screen on back wall
  const screenGeo = new THREE.BoxGeometry(3.2, 2.0, 0.04);
  const screenMat = new THREE.MeshLambertMaterial({ color: 0xf0eeec });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, 2.2, -d / 2 + 0.05);
  group.add(screen);

  const door = buildDoor();
  door.position.set(w / 4, 0, d / 2);
  group.add(door);
  return group;
}

export function buildGuestRoom(w = 5, d = 5.5) {
  const group = new THREE.Group();
  group.name = 'guest-room';
  group.add(buildFloor(w, d, 0xc8c0b0));

  const bed = buildBed('double');
  bed.position.set(0, 0, -d / 2 + 1.2);
  const wardrobe = buildWardrobe();
  wardrobe.position.set(-w / 2 + 0.9, 0, -d / 2 + 0.4);
  const desk = buildOfficeDesk(false);
  desk.position.set(w / 2 - 1.0, 0, -d / 2 + 0.6);
  const chair = buildOfficeChair();
  chair.position.set(w / 2 - 1.0, 0, -d / 2 + 1.4);

  // Small sofa
  const sofa = buildSofa(2);
  sofa.position.set(0, 0, d / 4);
  sofa.rotation.y = Math.PI;

  group.add(bed, wardrobe, desk, chair, sofa);
  const door = buildDoor();
  door.position.set(0, 0, d / 2);
  group.add(door);
  return group;
}
