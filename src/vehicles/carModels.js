import * as THREE from 'three';
import { makeBox, makeCylinder } from '../utils/helpers.js';
import { COLORS } from '../utils/constants.js';

// Shared wheel geometry
const WHEEL_GEO = new THREE.CylinderGeometry(0.34, 0.34, 0.24, 14);
const WHEEL_MAT = new THREE.MeshLambertMaterial({ color: 0x181818 });
const RIM_GEO = new THREE.CylinderGeometry(0.22, 0.22, 0.26, 8);
const RIM_MAT = new THREE.MeshLambertMaterial({ color: 0xb8bcc8 });
const GLASS_MAT = new THREE.MeshLambertMaterial({ color: 0x6090b0, transparent: true, opacity: 0.55 });
const HEADLIGHT_MAT = new THREE.MeshLambertMaterial({ color: 0xf8f8ee, emissive: 0xf8f8ee, emissiveIntensity: 0.0 });
const TAILLIGHT_MAT = new THREE.MeshLambertMaterial({ color: 0xdd1100, emissive: 0xdd1100, emissiveIntensity: 0.0 });

function addWheels(group, positions) {
  positions.forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(WHEEL_GEO, WHEEL_MAT);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, y, z);
    wheel.castShadow = true;
    wheel.name = 'wheel';
    const rim = new THREE.Mesh(RIM_GEO, RIM_MAT);
    rim.rotation.z = Math.PI / 2;
    rim.position.set(x, y, z);
    group.add(wheel, rim);
  });
}

// --- Toyota Camry ---
export function buildCamry(color = 0xf0f0ec) {
  const group = new THREE.Group();
  group.name = 'camry';
  const bodyMat = new THREE.MeshLambertMaterial({ color });

  // Lower body
  const lower = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.7, 1.88), bodyMat);
  lower.position.y = 0.55;
  lower.castShadow = true;

  // Upper cabin with slight taper
  const upper = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.72, 1.72), bodyMat);
  upper.position.set(-0.1, 1.25, 0);
  upper.castShadow = true;

  // Hood slope
  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 1.86), bodyMat);
  hood.position.set(1.7, 0.9, 0);
  hood.rotation.z = -0.12;

  // Trunk slope
  const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 1.86), bodyMat);
  trunk.position.set(-1.85, 0.9, 0);
  trunk.rotation.z = 0.12;

  // Windshields
  const windshieldF = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.58, 1.5), GLASS_MAT);
  windshieldF.position.set(1.16, 1.2, 0);
  windshieldF.rotation.z = -0.45;
  const windshieldR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.58, 1.5), GLASS_MAT);
  windshieldR.position.set(-1.38, 1.2, 0);
  windshieldR.rotation.z = 0.45;

  // Side windows
  for (const z of [-0.88, 0.88]) {
    const sideWin = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.5, 0.04), GLASS_MAT);
    sideWin.position.set(-0.1, 1.28, z);
    group.add(sideWin);
  }

  // Headlights
  for (const z of [-0.7, 0.7]) {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.28), HEADLIGHT_MAT);
    hl.position.set(2.34, 0.72, z);
    hl.name = 'headlight';
    group.add(hl);
  }

  // Taillights
  for (const z of [-0.7, 0.7]) {
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.2, 0.28), TAILLIGHT_MAT);
    tl.position.set(-2.34, 0.72, z);
    tl.name = 'taillight';
    group.add(tl);
  }

  // Grille
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 1.2), new THREE.MeshLambertMaterial({ color: 0x303038 }));
  grille.position.set(2.36, 0.5, 0);

  // Chrome trim
  const chromeStrip = new THREE.Mesh(new THREE.BoxGeometry(4.82, 0.06, 0.06), new THREE.MeshLambertMaterial({ color: 0xc8d0d8 }));
  chromeStrip.position.set(0, 0.92, 0.96);

  addWheels(group, [
    [1.35, 0.34, 1.02], [1.35, 0.34, -1.02],
    [-1.35, 0.34, 1.02], [-1.35, 0.34, -1.02]
  ]);

  group.add(lower, upper, hood, trunk, windshieldF, windshieldR, grille, chromeStrip);
  buildCarInterior(group, 'sedan');
  return group;
}

// --- Mercedes G-Wagon ---
export function buildGWagon(color = 0x181818) {
  const group = new THREE.Group();
  group.name = 'gwagon';
  const bodyMat = new THREE.MeshLambertMaterial({ color });

  // Boxy body - characteristic squared-off shape
  const body = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1.6, 2.0), bodyMat);
  body.position.y = 0.9;
  body.castShadow = true;

  // Roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.08, 1.96), bodyMat);
  roof.position.y = 1.72;

  // Hood - flat boxy hood
  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 1.98), bodyMat);
  hood.position.set(1.85, 1.0, 0);

  // Round headlights (characteristic G-Wagon)
  for (const z of [-0.62, 0.62]) {
    const hl = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 12), HEADLIGHT_MAT);
    hl.rotation.z = Math.PI / 2;
    hl.position.set(2.36, 0.9, z);
    hl.name = 'headlight';
    group.add(hl);
  }

  // Chrome grille
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 1.5), new THREE.MeshLambertMaterial({ color: 0xc0c8d0 }));
  grille.position.set(2.3, 0.7, 0);

  // Side steps
  for (const z of [-1.06, 1.06]) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.12, 0.22), new THREE.MeshLambertMaterial({ color: 0x303030 }));
    step.position.set(0, 0.46, z);
    group.add(step);
  }

  // Spare tire on back
  const spareTire = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.22, 14), WHEEL_MAT);
  spareTire.rotation.y = Math.PI / 2;
  spareTire.position.set(-2.42, 0.9, 0);

  // Taillights
  for (const z of [-0.72, 0.72]) {
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.32, 0.32), TAILLIGHT_MAT);
    tl.position.set(-2.34, 0.9, z);
    tl.name = 'taillight';
    group.add(tl);
  }

  // Windshield
  const ws = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.82, 1.72), GLASS_MAT);
  ws.position.set(1.22, 1.28, 0);
  ws.rotation.z = -0.18;

  // Side windows
  for (const z of [-0.99, 0.99]) {
    const sw = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.62, 0.04), GLASS_MAT);
    sw.position.set(0, 1.28, z);
    group.add(sw);
  }

  addWheels(group, [
    [1.4, 0.42, 1.08], [1.4, 0.42, -1.08],
    [-1.4, 0.42, 1.08], [-1.4, 0.42, -1.08]
  ]);

  group.add(body, roof, hood, grille, spareTire, ws);
  buildCarInterior(group, 'suv');
  return group;
}

// --- Tesla Cybertruck ---
export function buildCybertruck(color = 0xc0c4c8) {
  const group = new THREE.Group();
  group.name = 'cybertruck';
  const bodyMat = new THREE.MeshLambertMaterial({ color });

  // Angular stainless body - triangular cross section
  // Lower chassis
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.5, 2.0), bodyMat);
  chassis.position.y = 0.5;
  chassis.castShadow = true;

  // Cabin - slanted sharp geometry
  const cabinVerts = new Float32Array([
    // Front face (sharp slope from hood to roof)
    -0.2, 0, -1.0,   1.6, 0, -1.0,   -0.2, 1.5, -1.0,
    1.6, 0, -1.0,    1.6, 0.5, -1.0,  -0.2, 1.5, -1.0,
    // Back face
    -0.2, 0, 1.0,   1.6, 0, 1.0,   -0.2, 1.5, 1.0,
    1.6, 0, 1.0,    1.6, 0.5, 1.0,  -0.2, 1.5, 1.0,
  ]);
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.4, 1.96),
    bodyMat
  );
  cabin.position.set(0.4, 1.25, 0);
  cabin.castShadow = true;

  // Bed
  const bed = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.5, 1.98), bodyMat);
  bed.position.set(-1.6, 0.85, 0);

  // Light bar (single horizontal LED strip front)
  const lightBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.12, 2.0),
    new THREE.MeshLambertMaterial({ color: 0xf8f8ee, emissive: 0xf8f8ee, emissiveIntensity: 0.2 })
  );
  lightBar.position.set(2.86, 1.05, 0);
  lightBar.name = 'headlight';

  // Rear light bar
  const rearBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.1, 2.0),
    new THREE.MeshLambertMaterial({ color: 0xdd1100, emissive: 0xdd1100, emissiveIntensity: 0.2 })
  );
  rearBar.position.set(-2.86, 0.9, 0);
  rearBar.name = 'taillight';

  // Tonneau cover
  const tonneau = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.06, 1.98), bodyMat);
  tonneau.position.set(-1.6, 1.12, 0);

  addWheels(group, [
    [1.55, 0.44, 1.08], [1.55, 0.44, -1.08],
    [-1.55, 0.44, 1.08], [-1.55, 0.44, -1.08]
  ]);

  group.add(chassis, cabin, bed, lightBar, rearBar, tonneau);
  buildCarInterior(group, 'truck');
  return group;
}

// --- Toyota Hilux ---
export function buildHilux(color = 0xa02020) {
  const group = new THREE.Group();
  group.name = 'hilux';
  const bodyMat = new THREE.MeshLambertMaterial({ color });

  const lower = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.7, 1.92), bodyMat);
  lower.position.y = 0.55;
  lower.castShadow = true;
  const cab = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.2, 1.88), bodyMat);
  cab.position.set(0.9, 1.3, 0);
  cab.castShadow = true;
  const bed = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.3, 1.88), bodyMat);
  bed.position.set(-1.3, 0.85, 0);
  const bedSideL = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 0.1), bodyMat);
  bedSideL.position.set(-1.3, 1.1, -0.94);
  const bedSideR = bedSideL.clone();
  bedSideR.position.z = 0.94;
  const ws = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.7, 1.6), GLASS_MAT);
  ws.position.set(1.74, 1.28, 0); ws.rotation.z = -0.3;

  for (const z of [-0.66, 0.66]) {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.32), HEADLIGHT_MAT);
    hl.position.set(2.42, 0.74, z); hl.name = 'headlight';
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 0.32), TAILLIGHT_MAT);
    tl.position.set(-2.42, 0.74, z); tl.name = 'taillight';
    group.add(hl, tl);
  }

  addWheels(group, [
    [1.5, 0.42, 1.06], [1.5, 0.42, -1.06],
    [-1.5, 0.42, 1.06], [-1.5, 0.42, -1.06]
  ]);

  group.add(lower, cab, bed, bedSideL, bedSideR, ws);
  buildCarInterior(group, 'truck');
  return group;
}

// --- Toyota Corolla ---
export function buildCorolla(color = 0xb8bcc0) {
  const group = new THREE.Group();
  group.name = 'corolla';
  const bodyMat = new THREE.MeshLambertMaterial({ color });

  const lower = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.65, 1.76), bodyMat);
  lower.position.y = 0.5; lower.castShadow = true;
  const upper = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.65, 1.6), bodyMat);
  upper.position.set(-0.1, 1.15, 0); upper.castShadow = true;

  for (const z of [-0.64, 0.64]) {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, 0.3), HEADLIGHT_MAT);
    hl.position.set(2.2, 0.66, z); hl.name = 'headlight';
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.18, 0.3), TAILLIGHT_MAT);
    tl.position.set(-2.2, 0.66, z); tl.name = 'taillight';
    group.add(hl, tl);
  }

  addWheels(group, [
    [1.3, 0.32, 0.98], [1.3, 0.32, -0.98],
    [-1.3, 0.32, 0.98], [-1.3, 0.32, -0.98]
  ]);

  group.add(lower, upper);
  return group;
}

// --- Taxi ---
export function buildTaxi(color = 0xf0c020) {
  const base = buildCorolla(color);
  base.name = 'taxi';
  // Taxi roof sign
  const sign = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.28, 0.3), new THREE.MeshLambertMaterial({ color: 0xf8f020 }));
  sign.position.set(-0.1, 1.55, 0);
  base.add(sign);
  return base;
}

// --- Bus ---
export function buildBus(color = 0xe0dcd8) {
  const group = new THREE.Group();
  group.name = 'bus';
  const bodyMat = new THREE.MeshLambertMaterial({ color });

  const body = new THREE.Mesh(new THREE.BoxGeometry(9.5, 2.0, 2.5), bodyMat);
  body.position.y = 1.4; body.castShadow = true;
  const roof = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.2, 2.5), bodyMat);
  roof.position.y = 2.5;

  // Windows strip
  for (let i = 0; i < 8; i++) {
    for (const z of [-1.26, 1.26]) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.04), GLASS_MAT);
      win.position.set(-3.6 + i * 1.1, 1.78, z);
      group.add(win);
    }
  }

  // Headlights
  for (const z of [-0.9, 0.9]) {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.4), HEADLIGHT_MAT);
    hl.position.set(4.72, 1.0, z); hl.name = 'headlight';
    group.add(hl);
  }

  addWheels(group, [
    [3.2, 0.44, 1.32], [3.2, 0.44, -1.32],
    [-3.2, 0.44, 1.32], [-3.2, 0.44, -1.32]
  ]);

  // Seats inside
  for (let i = 0; i < 7; i++) {
    for (const z of [-0.7, 0.7]) {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.4), new THREE.MeshLambertMaterial({ color: 0x405060 }));
      seat.position.set(3.0 - i * 1.1, 1.2, z);
      group.add(seat);
    }
  }

  group.add(body, roof);
  return group;
}

// --- Cargo Truck ---
export function buildTruck(color = 0x405868) {
  const group = new THREE.Group();
  group.name = 'truck';
  const bodyMat = new THREE.MeshLambertMaterial({ color });
  const trailerMat = new THREE.MeshLambertMaterial({ color: 0xc8d0d8 });

  // Cab
  const cab = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 2.6), bodyMat);
  cab.position.set(3.8, 1.1, 0); cab.castShadow = true;
  const cabRoof = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 2.6), bodyMat);
  cabRoof.position.set(3.8, 2.45, 0);

  // Trailer
  const trailer = new THREE.Mesh(new THREE.BoxGeometry(8.0, 2.4, 2.56), trailerMat);
  trailer.position.set(-1.0, 1.2, 0); trailer.castShadow = true;

  // Windshield
  const ws = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.9, 2.2), GLASS_MAT);
  ws.position.set(4.95, 1.6, 0); ws.rotation.z = -0.22;

  // Headlights
  for (const z of [-0.9, 0.9]) {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.28, 0.35), HEADLIGHT_MAT);
    hl.position.set(4.98, 0.8, z); hl.name = 'headlight';
    group.add(hl);
  }

  addWheels(group, [
    [2.8, 0.48, 1.36], [2.8, 0.48, -1.36],
    [-0.5, 0.48, 1.36], [-0.5, 0.48, -1.36],
    [-2.5, 0.48, 1.36], [-2.5, 0.48, -1.36]
  ]);

  group.add(cab, cabRoof, trailer, ws);
  return group;
}

// Interior cockpit for cars
function buildCarInterior(group, type) {
  // Dashboard
  const dashMat = new THREE.MeshLambertMaterial({ color: 0x202428 });
  const seatMat = new THREE.MeshLambertMaterial({ color: 0x303838 });

  const dash = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 1.5), dashMat);
  dash.position.set(type === 'suv' ? 1.0 : 0.9, 0.9, 0);
  group.add(dash);

  // Steering wheel
  const steering = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.03, 6, 16), new THREE.MeshLambertMaterial({ color: 0x181818 }));
  steering.rotation.x = -0.55;
  steering.position.set(type === 'suv' ? 0.8 : 0.7, 1.0, -0.3);
  group.add(steering);

  // Front seats
  for (const z of [-0.3, 0.3]) {
    const seatBase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.5), seatMat);
    seatBase.position.set(0.3, 0.72, z);
    const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.1), seatMat);
    seatBack.position.set(0.3, 1.06, z - 0.22);
    group.add(seatBase, seatBack);
  }

  // Rear seats
  for (const z of [-0.3, 0.3]) {
    const rearSeat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.5), seatMat);
    rearSeat.position.set(-0.7, 0.72, z);
    group.add(rearSeat);
  }
}
