import * as THREE from 'three';

// When night mode toggles, make building windows emit light
export function applyWindowEmissives(scene, isNight) {
  scene.traverse(child => {
    if (!child.isMesh || !child.material) return;
    const mat = child.material;

    // Glass windows glow at night
    if (mat.color && isWindowMaterial(child)) {
      mat.emissive = isNight
        ? new THREE.Color(0xf0e8a0).multiplyScalar(0.25 + Math.random() * 0.15)
        : new THREE.Color(0x000000);
      mat.emissiveIntensity = isNight ? 1.0 : 0.0;
    }

    // Street lamp heads
    if (child.material.emissive && isLampHead(child)) {
      child.material.emissiveIntensity = isNight ? 1.0 : 0.15;
    }
  });
}

function isWindowMaterial(child) {
  if (!child.material) return false;
  const c = child.material.color;
  if (!c) return false;
  // Blue-ish transparent = window glass
  return child.material.transparent && child.material.opacity < 0.75 && c.b > 0.4;
}

function isLampHead(child) {
  return child.name === 'lamp-head' || (
    child.material &&
    child.material.emissive &&
    child.material.emissive.r > 0.8 &&
    child.material.emissive.g > 0.8
  );
}
