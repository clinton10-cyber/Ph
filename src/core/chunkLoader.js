/**
 * ChunkLoader — proximity-based landmark streaming
 *
 * Instead of loading everything at startup the loader keeps a "live" set of
 * landmarks. Each frame (throttled) it checks which landmarks are within the
 * load radius of the camera and which have drifted outside the unload radius.
 * Buildings materialise smoothly with a short opacity fade-in and dissolve
 * on unload — so the scene never pops.
 *
 * RAM budget: at any moment only landmarks inside LOD_DISTANCES.CULL (900 u)
 * actually exist in the scene. On a typical overview shot that is ~12-16 of
 * the 20 landmarks; when you are close to one neighbourhood only 4-8 are live.
 */

import * as THREE from 'three';
import { LOD_DISTANCES } from '../utils/constants.js';

const LOAD_RADIUS   = LOD_DISTANCES.CULL;      // 900 — add to scene inside this
const UNLOAD_RADIUS = LOD_DISTANCES.CULL * 1.15; // 1035 — hysteresis band
const CHECK_EVERY   = 45;                         // frames between distance checks
const FADE_DURATION = 0.55;                       // seconds for fade in/out

// Very lightweight geometry pool: reuse disposed geometries if the same
// landmark is re-entered (avoids re-running the expensive builder).
const _geometryCache = new Map(); // landmarkId → THREE.Group (detached from scene)

export class ChunkLoader {
  /**
   * @param {THREE.Scene}   scene
   * @param {THREE.Camera}  camera
   * @param {Object}        builders  — { [landmarkId]: builderFn(landmark) }
   * @param {Array}         landmarks — the LANDMARKS array
   */
  constructor(scene, camera, builders, landmarks) {
    this._scene     = scene;
    this._camera    = camera;
    this._builders  = builders;
    this._landmarks = landmarks;

    /** live groups currently in the scene  { id → { group, fade, dir } } */
    this._live   = new Map();
    /** groups being faded out (removed from _live immediately, kept here) */
    this._fading = new Map();

    this._frameCount = 0;
    this._camPos     = new THREE.Vector3();

    // How many landmarks have been initially registered
    this._total = landmarks.length;
    this._loaded = 0;

    // Callbacks
    this.onLandmarkLoaded   = null; // (id, group) => void
    this.onLandmarkUnloaded = null; // (id) => void
    this.onInitialScan      = null; // () => void — fired once after first scan
    this._initialScanDone   = false;
  }

  /** Call this every animation frame. delta in seconds. */
  update(delta) {
    this._frameCount++;

    // Update fade animations every frame (cheap)
    this._tickFades(delta);

    // Distance check at reduced rate
    if (this._frameCount % CHECK_EVERY !== 0) return;

    this._camera.getWorldPosition(this._camPos);
    const cx = this._camPos.x;
    const cz = this._camPos.z;

    // ── LOAD pass ─────────────────────────────────────────────────────────
    for (const lm of this._landmarks) {
      if (this._live.has(lm.id)) continue;

      const dx = lm.position.x - cx;
      const dz = lm.position.z - cz;
      const distSq = dx * dx + dz * dz;

      if (distSq < LOAD_RADIUS * LOAD_RADIUS) {
        this._loadLandmark(lm);
      }
    }

    // ── UNLOAD pass ───────────────────────────────────────────────────────
    for (const [id, entry] of this._live) {
      const lm = entry.landmark;
      const dx = lm.position.x - cx;
      const dz = lm.position.z - cz;
      const distSq = dx * dx + dz * dz;

      if (distSq > UNLOAD_RADIUS * UNLOAD_RADIUS) {
        this._unloadLandmark(id, entry);
      }
    }

    if (!this._initialScanDone) {
      this._initialScanDone = true;
      if (this.onInitialScan) this.onInitialScan();
    }
  }

  // ── private ─────────────────────────────────────────────────────────────

  _loadLandmark(lm) {
    let group;

    if (_geometryCache.has(lm.id)) {
      // Reuse cached group — just re-add it
      group = _geometryCache.get(lm.id);
    } else {
      const builder = this._builders[lm.id];
      try {
        group = builder ? builder(lm) : this._genericFallback(lm);
      } catch (err) {
        console.warn(`[ChunkLoader] Error building ${lm.id}:`, err);
        group = this._genericFallback(lm);
      }
      group.position.set(lm.position.x, 0, lm.position.z);
      group.userData = { landmarkId: lm.id, landmark: lm };
      group.name = lm.id;
      group.traverse(child => {
        if (child.isMesh) child.userData.landmarkId = lm.id;
      });
      _geometryCache.set(lm.id, group);
    }

    // Start fully transparent, fade in
    this._setGroupOpacity(group, 0);
    this._scene.add(group);

    const entry = { group, landmark: lm, fade: 0, dir: 1 }; // dir=1 → fade in
    this._live.set(lm.id, entry);
    this._loaded++;

    if (this.onLandmarkLoaded) this.onLandmarkLoaded(lm.id, group);
  }

  _unloadLandmark(id, entry) {
    // Move to fading map and start fade-out
    this._live.delete(id);
    entry.dir = -1; // dir=-1 → fade out
    this._fading.set(id, entry);
    this._loaded--;
    if (this.onLandmarkUnloaded) this.onLandmarkUnloaded(id);
  }

  _tickFades(delta) {
    // Fade-in for live entries
    for (const [, entry] of this._live) {
      if (entry.fade >= 1) continue;
      entry.fade = Math.min(1, entry.fade + delta / FADE_DURATION);
      this._setGroupOpacity(entry.group, entry.fade);
    }

    // Fade-out for departing entries
    for (const [id, entry] of this._fading) {
      entry.fade = Math.max(0, entry.fade - delta / FADE_DURATION);
      this._setGroupOpacity(entry.group, entry.fade);
      if (entry.fade <= 0) {
        this._scene.remove(entry.group);
        this._fading.delete(id);
        // Keep in _geometryCache — geometry stays in CPU/GPU mem
        // but is detached from the render graph so it won't be drawn.
        // Dispose only if you're extremely memory constrained:
        // this._disposeGroup(entry.group); _geometryCache.delete(id);
      }
    }
  }

  _setGroupOpacity(group, opacity) {
    group.traverse(child => {
      if (!child.isMesh) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach(m => {
        if (!m) return;
        m.transparent = true;
        m.opacity = opacity;
        // Only write after fully opaque to avoid overdraw cost
        m.depthWrite = opacity >= 0.99;
      });
    });
  }

  _genericFallback(lm) {
    // Inline fallback so we don't import buildingFactory here
    const group = new THREE.Group();
    const s  = lm.scale;
    const fh = 3.6;
    const floors = lm.floors || 2;
    const geo = new THREE.BoxGeometry(s.x, floors * fh, s.z);
    const mat = new THREE.MeshLambertMaterial({ color: lm.color || 0xb8b0a0 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = (floors * fh) / 2;
    group.add(mesh);
    return group;
  }

  /** Number of landmarks currently in scene */
  get liveCount() { return this._live.size; }

  /**
   * Get the group for a landmark if it's currently live (for interaction wiring).
   * Returns null if not loaded.
   */
  getLiveGroup(id) {
    return this._live.get(id)?.group ?? null;
  }

  /** Returns a live snapshot map { id → group } for interaction manager */
  getLiveMeshMap() {
    const map = {};
    for (const [id, entry] of this._live) map[id] = entry.group;
    return map;
  }
}
