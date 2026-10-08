import * as THREE from 'three';

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.5,
    2000
  );
  // Start at overview position looking at city center
  camera.position.set(0, 280, 320);
  camera.lookAt(0, 0, 0);
  return camera;
}
