import * as THREE from 'three';
import { COLORS } from '../utils/constants.js';

export function createLighting(scene) {
  const lights = {};

  // Ambient
  lights.ambient = new THREE.AmbientLight(0xfff0e0, 0.7);
  scene.add(lights.ambient);

  // Sun (directional)
  lights.sun = new THREE.DirectionalLight(COLORS.light_warm, 2.0);
  lights.sun.position.set(200, 300, 100);
  lights.sun.castShadow = true;
  lights.sun.shadow.mapSize.set(1024, 1024); // 2048→1024: 4× less shadow memory & fill cost
  lights.sun.shadow.camera.near = 1;
  lights.sun.shadow.camera.far = 900;   // tighter far = better shadow precision
  lights.sun.shadow.camera.left = -400;
  lights.sun.shadow.camera.right = 400;
  lights.sun.shadow.camera.top = 350;
  lights.sun.shadow.camera.bottom = -350;
  lights.sun.shadow.bias = -0.0004;
  scene.add(lights.sun);

  // Secondary fill light
  lights.fill = new THREE.DirectionalLight(0xc0d8ff, 0.4);
  lights.fill.position.set(-100, 80, -200);
  scene.add(lights.fill);

  // Hemisphere sky/ground
  lights.hemi = new THREE.HemisphereLight(0x87ceeb, 0x4a6030, 0.5);
  scene.add(lights.hemi);

  return lights;
}

export function applyDayNight(lights, scene, isNight) {
  if (isNight) {
    scene.background = new THREE.Color(COLORS.sky_night);
    scene.fog.color.set(0x04080f);
    lights.ambient.color.set(0x102040);
    lights.ambient.intensity = 0.15;
    lights.sun.color.set(0x203060);
    lights.sun.intensity = 0.1;
    lights.fill.intensity = 0.0;
    lights.hemi.color.set(0x050a18);
    lights.hemi.groundColor.set(0x101008);
    lights.hemi.intensity = 0.2;
  } else {
    scene.background = new THREE.Color(COLORS.sky_day);
    scene.fog.color.set(0xc8dce8);
    lights.ambient.color.set(0xfff0e0);
    lights.ambient.intensity = 0.7;
    lights.sun.color.set(COLORS.light_warm);
    lights.sun.intensity = 2.0;
    lights.fill.intensity = 0.4;
    lights.hemi.color.set(0x87ceeb);
    lights.hemi.groundColor.set(0x4a6030);
    lights.hemi.intensity = 0.5;
  }
}
