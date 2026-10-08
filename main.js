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
import { VEHICLE_ROUTES, PARKING_LOTS } from './src/data/vehicleRoutesData.js';
import { applyWindowEmissives } from './src/utils/nightUtils.js';

// Yield to the browser so the loading bar actually paints between steps
function frame() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

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
    onFlyTo: (pos, lookAt) => tween.flyTo(pos, lookAt, 1.6),
    onDayNight: (night) => {
      isNight = night;
      applyDayNight(lights, scene, night);
      applyWindowEmissives(scene, night);
    },
    onOverview: () => tween.flyTo({ x: 0, y: 280, z: 320 }, { x: 0, y: 0, z: 0 }, 1.8),
    onAudio: () => {}
  });

  // Each step: [label, progress 0-1, work fn]
  // Using requestAnimationFrame between steps so the browser actually paints the bar.
  const steps = [
    ['Building terrain...', 0.10, () => buildTerrain(scene)],
    ['Laying roads...',     0.25, () => buildRoads(scene)],
    ['Planting trees...',   0.40, () => buildVegetation(scene)],
    ['Constructing landmarks...', 0.65, () => buildAllLandmarks(scene)],
    ['Deploying vehicles...', 0.82, () => buildAllVehicles(scene, VEHICLE_ROUTES, PARKING_LOTS)],
    ['Wiring city systems...', 0.95, () => null],
    ['City ready.',         1.00, () => null],
  ];

  let landmarkMeshes = {};
  let vehicleList = [];

  for (const [label, progress, work] of steps) {
    hud.updateLoadingProgress(progress, label);
    // Yield BEFORE the work so the progress bar paints
    await frame();
    const result = work();
    if (label.startsWith('Constructing')) landmarkMeshes = result || {};
    if (label.startsWith('Deploying'))    vehicleList = result || [];
    // Yield AFTER the work so browser stays responsive
    await frame();
  }

  vehicles = vehicleList;

  // Wire landmark interactivity
  Object.entries(landmarkMeshes).forEach(([id, group]) => {
    group.userData.landmarkId = id;
    group.traverse(child => {
      if (child.isMesh) child.userData.landmarkId = id;
    });
  });

  // Interaction manager
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
  hud.onFlyTo = (pos, lookAt) => tween.flyTo(pos, lookAt, 1.6);

  // Cache animated objects once — avoids scene.traverse every frame
  const radarMeshes = [];
  const flareMeshes = [];
  const craneTrolleys = [];
  scene.traverse(child => {
    if (child.name === 'radar') radarMeshes.push(child);
    else if (child.name === 'flare-flame') flareMeshes.push(child);
    else if (child.name === 'crane-trolley') craneTrolleys.push(child);
  });

  hud.hideLoadingScreen();

  // Animated state
  let radarAngle = 0;
  let flareScale = 1, flareDir = 1;
  let craneX = 0, craneDir = 1;
  const _camDir = new THREE.Vector3();

  startAnimationLoop(renderer, scene, camera, controls, (delta, elapsed) => {
    hud.tick(delta);
    tween.update(delta);
    updateVehicles(vehicles, delta, isNight);

    // Radar
    radarAngle += delta * 0.6;
    for (let i = 0; i < radarMeshes.length; i++) radarMeshes[i].rotation.y = radarAngle;

    // Flare flame
    flareScale += flareDir * delta * 1.2;
    if (flareScale > 1.3 || flareScale < 0.7) flareDir *= -1;
    for (let i = 0; i < flareMeshes.length; i++) {
      flareMeshes[i].scale.setScalar(flareScale);
      flareMeshes[i].position.y = 31.5 + Math.sin(elapsed * 4) * 0.3;
    }

    // Crane trolleys
    craneX += craneDir * delta * 3;
    if (craneX > 10 || craneX < -10) craneDir *= -1;
    for (let i = 0; i < craneTrolleys.length; i++) {
      const t = craneTrolleys[i];
      t.position.x = t.parent ? t.parent.position.x + craneX : craneX;
    }

    // Minimap (every 6 frames)
    minimapFrameCount = (minimapFrameCount + 1) % 6;
    if (minimapFrameCount === 0) minimap.render(camera.position);

    // Compass
    camera.getWorldDirection(_camDir);
    hud.updateCompass(Math.atan2(_camDir.x, _camDir.z));
  });
}

init().catch(err => {
  console.error('City failed to load:', err);
  const s = document.getElementById('loader-status');
  if (s) s.textContent = 'Error: ' + (err.message || err);
});
