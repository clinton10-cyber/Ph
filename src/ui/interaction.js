import * as THREE from 'three';
import { LANDMARK_MAP } from '../data/landmarksData.js';

export class InteractionManager {
  constructor(camera, renderer, scene, hud) {
    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;
    this.hud = hud;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.landmarkMeshes = {};
    this.interactables = [];

    this._lastHovered = null;
    this._setupEvents();
  }

  setLandmarkMeshes(meshes) {
    this.landmarkMeshes = meshes;
    this.interactables = Object.values(meshes);
  }

  _setupEvents() {
    const canvas = this.renderer.domElement;

    canvas.addEventListener('pointermove', e => {
      this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this._handleHover(e.clientX, e.clientY);
    });

    canvas.addEventListener('click', e => {
      this._handleClick();
    });
  }

  _handleHover(mx, my) {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.interactables, true);

    let found = null;
    for (const hit of hits) {
      const landmarkId = this._getLandmarkId(hit.object);
      if (landmarkId) {
        found = landmarkId;
        break;
      }
    }

    if (found !== this._lastHovered) {
      this._lastHovered = found;
      if (found) {
        const landmark = LANDMARK_MAP[found];
        if (landmark) this.hud.showTooltip(landmark.name, mx, my);
        this._highlightLandmark(found, true);
      } else {
        this.hud.hideTooltip();
        Object.keys(this.landmarkMeshes).forEach(id => this._highlightLandmark(id, false));
      }
    } else if (found) {
      // Update tooltip position
      this.hud.showTooltip(LANDMARK_MAP[found]?.name || '', mx, my);
    }
  }

  _handleClick() {
    if (!this._lastHovered) return;
    const landmark = LANDMARK_MAP[this._lastHovered];
    if (landmark) this.hud.showInfoPanel(landmark);
  }

  _getLandmarkId(object) {
    let obj = object;
    while (obj) {
      if (obj.userData && obj.userData.landmarkId) return obj.userData.landmarkId;
      if (obj.parent) obj = obj.parent;
      else break;
    }
    return null;
  }

  _highlightLandmark(id, on) {
    const group = this.landmarkMeshes[id];
    if (!group) return;
    group.traverse(child => {
      if (child.isMesh && child.material && !child.name.includes('marker')) {
        if (on) {
          if (!child.userData._origEmissive) {
            child.userData._origEmissive = child.material.emissive
              ? child.material.emissive.clone()
              : new THREE.Color(0x000000);
          }
          child.material.emissive = new THREE.Color(0x443322);
        } else {
          if (child.userData._origEmissive) {
            child.material.emissive = child.userData._origEmissive;
          }
        }
      }
    });
  }
}
