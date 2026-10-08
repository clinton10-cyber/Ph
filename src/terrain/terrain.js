import * as THREE from 'three';
import { COLORS, CITY_BOUNDS } from '../utils/constants.js';
import { PROFILE } from '../utils/deviceProfile.js';

// Build base terrain: ground plane, rivers, waterways
export function buildTerrain(scene) {
  const group = new THREE.Group();
  group.name = 'terrain';

  // Ground plane
  const groundGeo = new THREE.PlaneGeometry(1200, 900, 1, 1);
  const groundMat = new THREE.MeshLambertMaterial({ color: COLORS.grass });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.name = 'ground';
  group.add(ground);

  // Main river (Bonny Estuary approximation - runs south of city)
  buildRiver(group, [
    [-500, 220], [-300, 210], [-100, 230], [100, 240], [300, 220], [500, 200]
  ], 40);

  // Creek 1 - western tributary
  buildRiver(group, [
    [-350, 100], [-300, 140], [-260, 160], [-220, 180], [-180, 200]
  ], 18);

  // Creek 2 - eastern waterway
  buildRiver(group, [
    [350, 180], [340, 150], [330, 100], [320, 60], [310, 0]
  ], 14);

  // Inner creek near waterfront
  buildRiver(group, [
    [-280, 150], [-240, 160], [-200, 165], [-160, 160], [-120, 150]
  ], 10);

  scene.add(group);
  return group;
}

function buildRiver(parent, points2d, width) {
  // Approximate river as a flat shape slightly below terrain
  const path = new THREE.CatmullRomCurve3(
    points2d.map(([x, z]) => new THREE.Vector3(x, -0.05, z))
  );
  const tubeGeo = new THREE.TubeGeometry(path, PROFILE.isMobile ? 8 : 24, width / 2, 3, false);
  const waterMat = new THREE.MeshLambertMaterial({
    color: COLORS.water,
    transparent: true,
    opacity: 0.88
  });
  const river = new THREE.Mesh(tubeGeo, waterMat);
  river.receiveShadow = true;
  river.name = 'river';
  parent.add(river);
}
