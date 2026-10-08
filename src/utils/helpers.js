import * as THREE from 'three';

export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

export function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

export function randomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

// Create a reusable box geometry with given dimensions, centered at bottom
export function makeBox(w, h, d, color, receivesShadow = true, castsShadow = true) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshLambertMaterial({ color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = h / 2;
  mesh.castShadow = castsShadow;
  mesh.receiveShadow = receivesShadow;
  return mesh;
}

// Create a cylinder
export function makeCylinder(radiusTop, radiusBottom, height, color, segments = 8) {
  const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments);
  const mat = new THREE.MeshLambertMaterial({ color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = height / 2;
  mesh.castShadow = true;
  return mesh;
}

// Add multiple children to a group
export function addAll(parent, ...children) {
  children.forEach(c => parent.add(c));
}

// Smooth camera fly-to using tween-style animation
export class CameraTween {
  constructor(camera, controls) {
    this.camera = camera;
    this.controls = controls;
    this.active = false;
    this._startPos = new THREE.Vector3();
    this._endPos = new THREE.Vector3();
    this._startTarget = new THREE.Vector3();
    this._endTarget = new THREE.Vector3();
    this._progress = 0;
    this._duration = 1.4;
  }

  flyTo(targetPos, lookAt, duration = 1.4) {
    this._startPos.copy(this.camera.position);
    this._startTarget.copy(this.controls.target);
    this._endPos.set(targetPos.x, targetPos.y, targetPos.z);
    this._endTarget.set(lookAt.x, lookAt.y, lookAt.z);
    this._progress = 0;
    this._duration = duration;
    this.active = true;
  }

  update(delta) {
    if (!this.active) return;
    this._progress += delta / this._duration;
    if (this._progress >= 1) {
      this._progress = 1;
      this.active = false;
    }
    const t = easeOutQuart(this._progress);
    this.camera.position.lerpVectors(this._startPos, this._endPos, t);
    this.controls.target.lerpVectors(this._startTarget, this._endTarget, t);
    this.controls.update();
  }
}

// Build a spline from an array of [x, y, z] triples
export function buildSpline(points) {
  const vecs = points.map(p => new THREE.Vector3(p[0], p[1], p[2]));
  return new THREE.CatmullRomCurve3(vecs);
}

// Dispose geometry and material of a mesh
export function disposeMesh(mesh) {
  if (!mesh) return;
  if (mesh.geometry) mesh.geometry.dispose();
  if (mesh.material) {
    if (Array.isArray(mesh.material)) mesh.material.forEach(m => m.dispose());
    else mesh.material.dispose();
  }
}

// Format seconds as HH:MM
export function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600) % 24;
  const m = Math.floor((totalSeconds % 3600) / 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
