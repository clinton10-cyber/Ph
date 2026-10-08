import * as THREE from 'three';
import { LANDMARKS } from '../data/landmarksData.js';
import { buildLandmarkLabel } from './labelUtils.js';
import { buildBuildingShell } from './buildingFactory.js';
import { buildCityHall } from './cityHall.js';
import { buildPleasurePark } from './pleasurePark.js';
import { buildAirport } from './airport.js';
import { buildGovernmentHouse } from './governmentHouse.js';
import { buildTouristBeach } from './touristBeach.js';
import { buildIsaacBoroPark } from './isaacBoroPark.js';
import { buildPHMall } from './phMall.js';
import { buildUniversity } from './riversStateUniversity.js';
import { buildWaterfrontBridge } from './waterfrontBridge.js';
import { buildCulturalCentre } from './culturalCentre.js';
import { buildCivicCentre } from './civicCentre.js';
import { buildBluePeterHotel } from './bluePeterHotel.js';
import { buildPresidentialHotel } from './presidentialHotel.js';
import { buildLiberationStadium } from './liberationStadium.js';
import { buildMileOneMarket } from './mileOneMarket.js';
import { buildRumuokoroArea } from './rumuokoroRoundabout.js';
import { buildRefinery } from './portHarcourtRefinery.js';
import { buildOnnePort } from './onnePort.js';
import { buildTerminalTwo } from './airportTerminalTwo.js';
import { buildNewGRA } from './newGRA.js';

const BUILDERS = {
  'city-hall': buildCityHall,
  'pleasure-park': buildPleasurePark,
  'airport': buildAirport,
  'government-house': buildGovernmentHouse,
  'tourist-beach': buildTouristBeach,
  'isaac-boro-park': buildIsaacBoroPark,
  'ph-mall': buildPHMall,
  'rivers-state-university': buildUniversity,
  'waterfront-bridge': buildWaterfrontBridge,
  'cultural-centre': buildCulturalCentre,
  'civic-centre': buildCivicCentre,
  'blue-peter-hotel': buildBluePeterHotel,
  'presidential-hotel': buildPresidentialHotel,
  'liberation-stadium': buildLiberationStadium,
  'mile-one-market': buildMileOneMarket,
  'rumuokoro-roundabout': buildRumuokoroArea,
  'ph-refinery': buildRefinery,
  'onne-port': buildOnnePort,
  'airport-terminal-two': buildTerminalTwo,
  'new-gra': buildNewGRA
};

export function buildAllLandmarks(scene) {
  const landmarkMeshes = {};

  LANDMARKS.forEach(landmark => {
    const builder = BUILDERS[landmark.id];
    let group;

    if (builder) {
      try {
        group = builder(landmark);
      } catch (err) {
        console.warn(`Error building ${landmark.id}:`, err);
        group = buildGenericFallback(landmark);
      }
    } else {
      group = buildGenericFallback(landmark);
    }

    group.position.set(landmark.position.x, 0, landmark.position.z);
    group.userData = { landmarkId: landmark.id, landmark };
    group.name = landmark.id;
    group.traverse(child => {
      if (child.isMesh) child.userData.landmarkId = landmark.id;
    });

    scene.add(group);
    landmarkMeshes[landmark.id] = group;
  });

  return landmarkMeshes;
}

function buildGenericFallback(landmark) {
  const group = new THREE.Group();
  const s = landmark.scale;
  const floors = landmark.floors || 2;
  const shell = buildBuildingShell({
    width: s.x, depth: s.z, floors,
    color: landmark.color, style: 'modern', name: landmark.id
  });
  group.add(shell);
  buildLandmarkLabel(group, landmark);
  return group;
}
