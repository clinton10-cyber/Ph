import * as THREE from 'three';
import { ROADS, INTERSECTIONS } from '../data/roadsData.js';
import { COLORS, CURB_HEIGHT, SIDEWALK_HEIGHT, SIDEWALK_WIDTH } from '../utils/constants.js';
import { PROFILE } from '../utils/deviceProfile.js';

export function buildRoads(scene) {
  const group = new THREE.Group();
  group.name = 'roads';

  ROADS.forEach(road => {
    buildRoadSegment(group, road);
  });

  INTERSECTIONS.forEach(inter => {
    buildIntersection(group, inter);
  });

  scene.add(group);
  return group;
}

function buildRoadSegment(parent, road) {
  const pts = road.points.map(([x, z]) => new THREE.Vector3(x, 0.02, z));
  const curve = new THREE.CatmullRomCurve3(pts);

  const w = road.width;
  const segments = Math.max(4, Math.ceil((pts.length * 8) / PROFILE.roadSegmentDivisor));

  // Road surface
  const geo = new THREE.TubeGeometry(curve, segments, w / 2, 2, false);
  const mat = new THREE.MeshLambertMaterial({ color: COLORS.asphalt });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  mesh.name = `road-${road.id}`;
  parent.add(mesh);

  // Road markings: centre line
  const markingPts = curve.getPoints(segments);
  buildCenterLine(parent, markingPts, road);
}

function buildCenterLine(parent, points, road) {
  // Dashed centre line using LineSegments
  const positions = [];
  const dashLength = 4;
  const gapLength = 4;
  let distance = 0;
  let drawing = true;

  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    const segLen = start.distanceTo(end);
    distance += segLen;

    if (distance >= (drawing ? dashLength : gapLength)) {
      distance = 0;
      drawing = !drawing;
    }

    if (drawing) {
      positions.push(start.x, start.y + 0.04, start.z);
      positions.push(end.x, end.y + 0.04, end.z);
    }
  }

  if (positions.length < 4) return;

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const mat = new THREE.LineBasicMaterial({
    color: road.type === 'highway' ? COLORS.road_line : COLORS.road_line_white,
    linewidth: 1
  });
  const line = new THREE.LineSegments(geo, mat);
  line.name = `marking-${road.id}`;
  parent.add(line);
}

function buildIntersection(parent, inter) {
  const pos = inter.position;

  if (inter.type === 'roundabout') {
    const r = inter.radius || 16;

    // Road surface circle
    const discGeo = new THREE.CircleGeometry(r + 8, 32);
    const discMat = new THREE.MeshLambertMaterial({ color: COLORS.asphalt });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.rotation.x = -Math.PI / 2;
    disc.position.set(pos.x, 0.02, pos.z);
    disc.receiveShadow = true;
    parent.add(disc);

    // Central island
    const islandGeo = new THREE.CylinderGeometry(r, r, 0.3, PROFILE.isMobile ? 10 : 20);
    const islandMat = new THREE.MeshLambertMaterial({ color: COLORS.grass });
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.position.set(pos.x, 0.15, pos.z);
    island.receiveShadow = true;
    parent.add(island);

    // Central monument at Rumuokoro
    if (inter.id === 'rumuokoro') {
      buildRumuokoroMonument(parent, pos);
    }

  } else {
    // Standard crossroads - slightly wider asphalt square
    const boxGeo = new THREE.BoxGeometry(24, 0.04, 24);
    const boxMat = new THREE.MeshLambertMaterial({ color: COLORS.asphalt });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(pos.x, 0.02, pos.z);
    box.receiveShadow = true;
    parent.add(box);
  }
}

function buildRumuokoroMonument(parent, pos) {
  // Obelisk-style monument at roundabout center
  const baseGeo = new THREE.BoxGeometry(4, 0.8, 4);
  const baseMat = new THREE.MeshLambertMaterial({ color: 0xb0a090 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.set(pos.x, 0.55, pos.z);
  base.castShadow = true;
  parent.add(base);

  const shaftGeo = new THREE.BoxGeometry(1.2, 8, 1.2);
  const shaftMat = new THREE.MeshLambertMaterial({ color: 0xc8c0b0 });
  const shaft = new THREE.Mesh(shaftGeo, shaftMat);
  shaft.position.set(pos.x, 5.2, pos.z);
  shaft.castShadow = true;
  parent.add(shaft);

  const tipGeo = new THREE.ConeGeometry(0.8, 2, 4);
  const tipMat = new THREE.MeshLambertMaterial({ color: 0xe8d890 });
  const tip = new THREE.Mesh(tipGeo, tipMat);
  tip.position.set(pos.x, 10.2, pos.z);
  tip.castShadow = true;
  parent.add(tip);
}
