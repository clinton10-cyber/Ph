import * as THREE from 'three';
import { createScene }             from './src/core/scene.js';
import { createRenderer, handleResize } from './src/core/renderer.js';
import { createCamera }            from './src/core/camera.js';
import { createControls }          from './src/core/controls.js';
import { createLighting, applyDayNight } from './src/core/lighting.js';
import { startAnimationLoop }      from './src/core/animationLoop.js';
import { buildTerrain }            from './src/terrain/terrain.js';
import { buildRoads }              from './src/terrain/roads.js';
import { buildVegetation }         from './src/terrain/vegetation.js';
import { buildAllVehicles, updateVehicles } from './src/vehicles/carFactory.js';
import { MinimapRenderer }         from './src/map/mapCanvas.js';
import { HUD }                     from './src/ui/hud.js';
import { InteractionManager }      from './src/ui/interaction.js';
import { CameraTween }             from './src/utils/helpers.js';
import { VEHICLE_ROUTES, PARKING_LOTS } from './src/data/vehicleRoutesData.js';
import { applyWindowEmissives }    from './src/utils/nightUtils.js';
import { LANDMARKS }               from './src/data/landmarksData.js';
import { ChunkLoader }             from './src/core/chunkLoader.js';

// ── Landmark builders (same set as before) ────────────────────────────────
import { buildCityHall }           from './src/landmarks/cityHall.js';
import { buildPleasurePark }       from './src/landmarks/pleasurePark.js';
import { buildAirport }            from './src/landmarks/airport.js';
import { buildGovernmentHouse }    from './src/landmarks/governmentHouse.js';
import { buildTouristBeach }       from './src/landmarks/touristBeach.js';
import { buildIsaacBoroPark }      from './src/landmarks/isaacBoroPark.js';
import { buildPHMall }             from './src/landmarks/phMall.js';
import { buildUniversity }         from './src/landmarks/riversStateUniversity.js';
import { buildWaterfrontBridge }   from './src/landmarks/waterfrontBridge.js';
import { buildCulturalCentre }     from './src/landmarks/culturalCentre.js';
import { buildCivicCentre }        from './src/landmarks/civicCentre.js';
import { buildBluePeterHotel }     from './src/landmarks/bluePeterHotel.js';
import { buildPresidentialHotel }  from './src/landmarks/presidentialHotel.js';
import { buildLiberationStadium }  from './src/landmarks/liberationStadium.js';
import { buildMileOneMarket }      from './src/landmarks/mileOneMarket.js';
import { buildRumuokoroArea }      from './src/landmarks/rumuokoroRoundabout.js';
import { buildRefinery }           from './src/landmarks/portHarcourtRefinery.js';
import { buildOnnePort }           from './src/landmarks/onnePort.js';
import { buildTerminalTwo }        from './src/landmarks/airportTerminalTwo.js';
import { buildNewGRA }             from './src/landmarks/newGRA.js';

const BUILDERS = {
  'city-hall':             buildCityHall,
  'pleasure-park':         buildPleasurePark,
  'airport':               buildAirport,
  'government-house':      buildGovernmentHouse,
  'tourist-beach':         buildTouristBeach,
  'isaac-boro-park':       buildIsaacBoroPark,
  'ph-mall':               buildPHMall,
  'rivers-state-university': buildUniversity,
  'waterfront-bridge':     buildWaterfrontBridge,
  'cultural-centre':       buildCulturalCentre,
  'civic-centre':          buildCivicCentre,
  'blue-peter-hotel':      buildBluePeterHotel,
  'presidential-hotel':    buildPresidentialHotel,
  'liberation-stadium':    buildLiberationStadium,
  'mile-one-market':       buildMileOneMarket,
  'rumuokoro-roundabout':  buildRumuokoroArea,
  'ph-refinery':           buildRefinery,
  'onne-port':             buildOnnePort,
  'airport-terminal-two':  buildTerminalTwo,
  'new-gra':               buildNewGRA,
};

async function init() {
  const canvas   = document.getElementById('city-canvas');
  const scene    = createScene();
  const renderer = createRenderer(canvas);
  const camera   = createCamera();
  const controls = createControls(camera, canvas);
  const lights   = createLighting(scene);
  const tween    = new CameraTween(camera, controls);
  handleResize(renderer, camera);

  let isNight  = false;
  let vehicles = [];
  let minimapFrameCount = 0;

  // ── Splash overlay ──────────────────────────────────────────────────────
  // Show a minimal full-screen overlay (just the city name + a spinner)
  // while terrain/roads are built synchronously (~100ms).
  // We skip the old progress-bar entirely.
  const splash = document.getElementById('loading-screen');

  // ── HUD ─────────────────────────────────────────────────────────────────
  const hud = new HUD({
    onFlyTo:   (pos, lookAt) => tween.flyTo(pos, lookAt, 1.6),
    onDayNight:(night) => {
      isNight = night;
      applyDayNight(lights, scene, night);
      applyWindowEmissives(scene, night);
    },
    onOverview:() => tween.flyTo({ x: 0, y: 280, z: 320 }, { x: 0, y: 0, z: 0 }, 1.8),
    onAudio:   () => {}
  });

  // ── Build cheap, always-present world geometry ───────────────────────────
  // These are flat/procedural and together cost very little RAM.
  buildTerrain(scene);
  buildRoads(scene);
  buildVegetation(scene);

  // ── Vehicles (lightweight; always present) ───────────────────────────────
  vehicles = buildAllVehicles(scene, VEHICLE_ROUTES, PARKING_LOTS);

  // ── Chunk loader — landmarks stream in as camera approaches ──────────────
  const chunkLoader = new ChunkLoader(scene, camera, BUILDERS, LANDMARKS);

  // Interaction manager needs a live snapshot of loaded meshes
  const interaction = new InteractionManager(camera, renderer, scene, hud);

  // Whenever a landmark appears or disappears refresh the raycaster set
  chunkLoader.onLandmarkLoaded = (_id, _group) => {
    interaction.setLandmarkMeshes(chunkLoader.getLiveMeshMap());
  };
  chunkLoader.onLandmarkUnloaded = (_id) => {
    interaction.setLandmarkMeshes(chunkLoader.getLiveMeshMap());
  };

  // After the first proximity scan, dismiss the splash instantly
  chunkLoader.onInitialScan = () => {
    if (splash) {
      splash.classList.add('fade-out');
      setTimeout(() => { splash.style.display = 'none'; }, 600);
    }
  };

  // ── Minimap ──────────────────────────────────────────────────────────────
  const minimapCanvas = document.getElementById('minimap-canvas');
  const minimap       = new MinimapRenderer(minimapCanvas);
  minimap.onLandmarkClick = (landmark) => {
    hud.showInfoPanel(landmark);
    const pos    = landmark.position;
    const floors = landmark.floors || 2;
    tween.flyTo(
      { x: pos.x + 30, y: floors * 3.6 + 20, z: pos.z + 40 },
      { x: pos.x, y: 0, z: pos.z },
      1.6
    );
  };
  hud.onFlyTo = (pos, lookAt) => tween.flyTo(pos, lookAt, 1.6);

  // ── Cache animated objects ───────────────────────────────────────────────
  // These are on the always-present terrain/road/vehicle meshes,
  // not on landmarks, so one-time traversal is safe.
  const radarMeshes   = [];
  const flareMeshes   = [];
  const craneTrolleys = [];
  scene.traverse(child => {
    if      (child.name === 'radar')        radarMeshes.push(child);
    else if (child.name === 'flare-flame')  flareMeshes.push(child);
    else if (child.name === 'crane-trolley') craneTrolleys.push(child);
  });

  // ── Animated state ───────────────────────────────────────────────────────
  let radarAngle = 0;
  let flareScale = 1, flareDir = 1;
  let craneX = 0, craneDir = 1;
  const _camDir = new THREE.Vector3();

  // ── Animation loop ───────────────────────────────────────────────────────
  startAnimationLoop(renderer, scene, camera, controls, (delta, elapsed) => {
    hud.tick(delta);
    tween.update(delta);
    updateVehicles(vehicles, delta, isNight);

    // Proximity-stream landmarks
    chunkLoader.update(delta);

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
