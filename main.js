import * as THREE from 'three';
import { createScene } from './src/core/scene.js';
import { createRenderer, handleResize } from './src/core/renderer.js';
import { createCamera } from './src/core/camera.js';
import { createControls } from './src/core/controls.js';
import { createLighting, applyDayNight } from './src/core/lighting.js';
import { startAnimationLoop } from './src/core/animationLoop.js';
import { buildTerrain } from './src/terrain/terrain.js';
import { buildRoads } from './src/terrain/roads.js';
import { buildVegetation } from './src/terrain/vegetation.js';
import { buildAllLandmarks } from './src/landmarks/index.js';
import { buildAllVehicles, updateVehicles } from './src/vehicles/carFactory.js';
import { MinimapRenderer } from './src/map/mapCanvas.js';
import { HUD } from './src/ui/hud.js';
import { InteractionManager } from './src/ui/interaction.js';
import { CameraTween } from './src/utils/helpers.js';
import { VEHICLE_ROUTES } from './src/data/vehicleRoutesData.js';
import { PARKING_LOTS } from './src/data/vehicleRoutesData.js';
import { applyWindowEmissives } from './src/utils/nightUtils.js';

// --- Boot sequence ---
async function init() {
  const canvas = document.getElementById('city-canvas');
  const scene = createScene();
  const renderer = createRenderer(canvas);
  const camera = createCamera();
  const controls = createControls(camera, canvas);
  const lights = createLighting(scene);
  const tween = new CameraTween(camera, controls);
  handleResize(renderer, camera);

  let isNight = false;
  let vehicles = [];
  let minimapFrameCount = 0;

  // HUD setup
  const hud = new HUD({
    onFlyTo: (pos, lookAt) => {
      tween.flyTo(pos, lookAt, 1.6);
    },
    onDayNight: (night) => {
      isNight = night;
      applyDayNight(lights, scene, night);
      applyWindowEmissives(scene, night);
    },
    onOverview: () => {
      tween.flyTo({ x: 0, y: 280, z: 320 }, { x: 0, y: 0, z: 0 }, 1.8);
    },
    onAudio: (on) => {
      // Audio system placeholder
    }
  });

  // Loading progress
  const steps = [
    ['Building terrain...', 0.1],
    ['Laying roads...', 0.22],
    ['Planting vegetation...', 0.34],
    ['Constructing landmarks...', 0.50],
    ['Furnishing interiors...', 0.65],
    ['Deploying vehicles...', 0.80],
    ['Wiring systems...', 0.90],
    ['City ready.', 1.0],
  ];

  for (const [status, progress] of steps) {
    hud.updateLoadingProgress(progress, status);
    await tick(32);
  }

  // Build world
  buildTerrain(scene);
  buildRoads(scene);
  buildVegetation(scene);

  const landmarkMeshes = buildAllLandmarks(scene);

  // Set all landmark groups interactive
  Object.entries(landmarkMeshes).forEach(([id, group]) => {
    group.userData.landmarkId = id;
    group.traverse(child => {
      if (child.isMesh) child.userData.landmarkId = id;
    });
  });

  vehicles = buildAllVehicles(scene, VEHICLE_ROUTES, PARKING_LOTS);

  // Interaction
  const interaction = new InteractionManager(camera, renderer, scene, hud);
  interaction.setLandmarkMeshes(landmarkMeshes);

  // Minimap
  const minimapCanvas = document.getElementById('minimap-canvas');
  const minimap = new MinimapRenderer(minimapCanvas);
  minimap.onLandmarkClick = (landmark) => {
    hud.showInfoPanel(landmark);
    const pos = landmark.position;
    const floors = landmark.floors || 2;
    tween.flyTo(
      { x: pos.x + 30, y: floors * 3.6 + 20, z: pos.z + 40 },
      { x: pos.x, y: 0, z: pos.z },
      1.6
    );
  };

  // Wire minimap HUD fly-to from info panel
  hud.onFlyTo = (pos, lookAt) => tween.flyTo(pos, lookAt, 1.6);

  hud.hideLoadingScreen();

  // --- Cache animated objects ONCE after world is built (avoid per-frame traverse) ---
  const radarMeshes = [];
  const flareMeshes = [];
  const craneTrolleys = [];
  scene.traverse(child => {
    if (child.name === 'radar') radarMeshes.push(child);
    else if (child.name === 'flare-flame') flareMeshes.push(child);
    else if (child.name === 'crane-trolley') craneTrolleys.push(child);
  });

  // Animated elements state
  let radarAngle = 0;
  let flareScale = 1;
  let flareDir = 1;
  let craneX = 0;
  let craneDir = 1;

  // Main loop
  startAnimationLoop(renderer, scene, camera, controls, (delta, elapsed) => {
    hud.tick(delta);
    tween.update(delta);

    // Update vehicles
    updateVehicles(vehicles, delta, isNight);

    // Animate radar dishes (cached — no traverse)
    radarAngle += delta * 0.6;
    for (let i = 0; i < radarMeshes.length; i++) radarMeshes[i].rotation.y = radarAngle;

    // Animate flare flame (cached — no traverse)
    flareScale += flareDir * delta * 1.2;
    if (flareScale > 1.3 || flareScale < 0.7) flareDir *= -1;
    for (let i = 0; i < flareMeshes.length; i++) {
      flareMeshes[i].scale.setScalar(flareScale);
      flareMeshes[i].position.y = 31.5 + Math.sin(elapsed * 4) * 0.3;
    }

    // Animate crane trolleys (cached — no traverse)
    craneX += craneDir * delta * 3;
    if (craneX > 10 || craneX < -10) craneDir *= -1;
    for (let i = 0; i < craneTrolleys.length; i++) {
      const t = craneTrolleys[i];
      t.position.x = t.parent ? t.parent.position.x + craneX : craneX;
    }

    // Update minimap every 6 frames (cheap canvas 2D, but no need to run every frame)
    minimapFrameCount = (minimapFrameCount + 1) % 6;
    if (minimapFrameCount === 0) {
      minimap.render(camera.position);
    }

    // Update compass
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    hud.updateCompass(Math.atan2(camDir.x, camDir.z));
  });
}

// Async yield helper
function tick(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

init().catch(console.error);
