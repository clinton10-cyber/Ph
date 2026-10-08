import * as THREE from 'three';
import { COLORS } from '../utils/constants.js';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.sky_day);
  scene.fog = new THREE.Fog(0xc8dce8, 300, 900);
  return scene;
}
