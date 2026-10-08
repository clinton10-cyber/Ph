import * as THREE from 'three';
import { COLORS } from '../utils/constants.js';
import { PROFILE } from '../utils/deviceProfile.js';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.sky_day);
  // Tighter fog on mobile = fewer objects reach the renderer
  scene.fog = new THREE.Fog(0xc8dce8, 200, PROFILE.fogFar);
  return scene;
}
