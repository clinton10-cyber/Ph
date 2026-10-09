import * as THREE from 'three';
import { LANDMARK_MAP } from '../data/landmarksData.js';

export class InteractionManager {
  constructor(camera, renderer, scene, hud) {
    this.camera   = camera;
    this.renderer = renderer;
    this.scene    = scene;
    this.hud      = hud;

    this.raycaster    = new THREE.Raycaster();
    this.pointer      = new THREE.Vector2();
    // landmarkMeshes is refreshed by ChunkLoader callbacks
    this.landmarkMeshes = {};
    this.interactables  = [];

    this._lastHovered = null;
    this._setupEvents();
  }

  setLandmarkMeshes(meshes) {
    this.landmarkMeshes = meshes;
    this.interactables  = Object.values(meshes);
  }

  _setupEvents() {
    const canvas = this.renderer.domElement;

    canvas.addEventListener('pointermove', e => {
      this.pointer.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this._handleHover(e.clientX, e.clientY);
    });

    canvas.addEventListener('click', () => { this._handleClick(); });
  }

  _handleHover(mx, my) {
    if (this.interactables.length === 0) return;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.interactables, true);

    let found = null;
    for (const hit of hits) {
      const id = this._getLandmarkId(hit.object);
      if (id) { found = id; break; }
    }

    if (found !== this._lastHovered) {
      // Unhighlight previous
      if (this._lastHovered) this._highlightLandmark(this._lastHovered, false);
      this._lastHovered = found;
      if (found) {
        const lm = LANDMARK_MAP[found];
        if (lm) this.hud.showTooltip(lm.name, mx, my);
        this._highlightLandmark(found, true);
      } else {
        this.hud.hideTooltip();
      }
    } else if (found) {
      // Update position only
      const lm = LANDMARK_MAP[found];
      this.hud.showTooltip(lm?.name || '', mx, my);
    }
  }

  _handleClick() {
    if (!this._lastHovered) return;
    const lm = LANDMARK_MAP[this._lastHovered];
    if (lm) this.hud.showInfoPanel(lm);
  }

  _getLandmarkId(object) {
    let obj = object;
    while (obj) {
      if (obj.userData?.landmarkId) return obj.userData.landmarkId;
      obj = obj.parent;
    }
    return null;
  }

  _highlightLandmark(id, on) {
    const group = this.landmarkMeshes[id];
    if (!group) return;
    group.traverse(child => {
      if (!child.isMesh || !child.material || child.name.includes('marker')) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach(m => {
        if (on) {
          if (!child.userData._origEmissive) {
            child.userData._origEmissive = m.emissive
              ? m.emissive.clone()
              : new THREE.Color(0x000000);
          }
          m.emissive = new THREE.Color(0x443322);
        } else {
          if (child.userData._origEmissive) m.emissive = child.userData._origEmissive;
        }
      });
    });
  }
}
