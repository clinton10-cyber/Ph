import * as THREE from 'three';
import { COLORS } from '../utils/constants.js';

export function buildLandmarkLabel(group, landmark) {
  const geo = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 16);
  const mat = new THREE.MeshLambertMaterial({
    color: COLORS.accent_gold,
    emissive: new THREE.Color(0xe8b84b),
    emissiveIntensity: 0.3
  });
  const marker = new THREE.Mesh(geo, mat);
  const floors = landmark.floors || 2;
  marker.position.set(0, floors * 3.6 + 1.5, 0);
  marker.name = 'landmark-marker';
  marker.userData = { landmarkId: landmark.id, isMarker: true };
  group.add(marker);
}
