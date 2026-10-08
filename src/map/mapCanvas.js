import { LANDMARKS } from '../data/landmarksData.js';
import { ROADS, INTERSECTIONS } from '../data/roadsData.js';

// World bounds for mapping to canvas
const WORLD = { minX: -400, maxX: 500, minZ: -400, maxZ: 300 };

export class MinimapRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.offsetWidth || 280;
    this.height = canvas.offsetHeight || 220;
    canvas.width = this.width;
    canvas.height = this.height;

    this.playerPos = { x: 0, z: 0 };
    this.hoveredLandmark = null;
    this.onLandmarkClick = null;

    this._setupInteraction();
  }

  // Map world coords to canvas coords
  worldToCanvas(wx, wz) {
    const cx = ((wx - WORLD.minX) / (WORLD.maxX - WORLD.minX)) * this.width;
    const cy = ((wz - WORLD.minZ) / (WORLD.maxZ - WORLD.minZ)) * this.height;
    return { x: cx, y: cy };
  }

  render(cameraWorldPos) {
    this.playerPos = { x: cameraWorldPos.x, z: cameraWorldPos.z };
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Background
    ctx.fillStyle = '#0a0e14';
    ctx.fillRect(0, 0, w, h);

    // Rivers
    this._drawRivers(ctx);

    // Roads
    this._drawRoads(ctx);

    // Intersections
    this._drawIntersections(ctx);

    // Landmarks
    this._drawLandmarks(ctx);

    // Player position
    this._drawPlayer(ctx);
  }

  _drawRivers(ctx) {
    const rivers = [
      [[-400, 220], [-300, 210], [-100, 230], [100, 240], [300, 220], [400, 200]],
      [[-350, 100], [-300, 140], [-260, 160], [-220, 180], [-180, 200]],
      [[350, 180], [340, 150], [330, 100], [320, 60], [310, 0]],
    ];
    ctx.strokeStyle = '#1a4a7a';
    rivers.forEach(river => {
      ctx.lineWidth = river === rivers[0] ? 5 : 2.5;
      ctx.beginPath();
      river.forEach(([x, z], i) => {
        const p = this.worldToCanvas(x, z);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    });
  }

  _drawRoads(ctx) {
    ROADS.forEach(road => {
      const pts = road.points;
      ctx.strokeStyle = road.type === 'highway' ? '#404858' : '#303440';
      ctx.lineWidth = road.type === 'highway' ? 2.5 : 1.5;
      ctx.beginPath();
      pts.forEach(([x, z], i) => {
        const p = this.worldToCanvas(x, z);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    });
  }

  _drawIntersections(ctx) {
    INTERSECTIONS.forEach(inter => {
      const p = this.worldToCanvas(inter.position.x, inter.position.z);
      ctx.fillStyle = '#303848';
      ctx.beginPath();
      ctx.arc(p.x, p.y, inter.type === 'roundabout' ? 4 : 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  _drawLandmarks(ctx) {
    LANDMARKS.forEach(landmark => {
      const p = this.worldToCanvas(landmark.position.x, landmark.position.z);
      const isHovered = this.hoveredLandmark === landmark.id;

      // Building footprint
      const scaleX = (landmark.scale.x / (WORLD.maxX - WORLD.minX)) * this.width;
      const scaleZ = (landmark.scale.z / (WORLD.maxZ - WORLD.minZ)) * this.height;
      ctx.fillStyle = isHovered ? '#e8b84b' : this._getLandmarkColor(landmark.type);
      ctx.globalAlpha = isHovered ? 1.0 : 0.75;
      ctx.fillRect(p.x - scaleX / 2, p.y - scaleZ / 2, scaleX, scaleZ);
      ctx.globalAlpha = 1.0;

      // Marker dot
      ctx.fillStyle = isHovered ? '#ffffff' : '#e8b84b';
      ctx.beginPath();
      ctx.arc(p.x, p.y, isHovered ? 4 : 3, 0, Math.PI * 2);
      ctx.fill();

      // Label on hover
      if (isHovered) {
        ctx.fillStyle = '#e8edf5';
        ctx.font = '9px Space Grotesk, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(landmark.name, p.x, p.y - 7);
      }
    });
  }

  _drawPlayer(ctx) {
    const p = this.worldToCanvas(this.playerPos.x, this.playerPos.z);
    // Outer ring
    ctx.strokeStyle = '#00c896';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    ctx.stroke();
    // Inner dot
    ctx.fillStyle = '#00c896';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  _getLandmarkColor(type) {
    const colors = {
      government: '#c8a060', park: '#3a7a30', transport: '#4878a8',
      leisure: '#d4b840', hospitality: '#d4a840', commercial: '#b8a860',
      education: '#7a6450', culture: '#c05030', events: '#a08060',
      sports: '#2a5c8a', commerce: '#e87840', infrastructure: '#708088',
      industrial: '#505860', port: '#3a5068', residential: '#7a9870'
    };
    return colors[type] || '#808898';
  }

  _setupInteraction() {
    this.canvas.addEventListener('mousemove', e => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let found = null;
      LANDMARKS.forEach(landmark => {
        const p = this.worldToCanvas(landmark.position.x, landmark.position.z);
        if (Math.abs(mx - p.x) < 8 && Math.abs(my - p.y) < 8) found = landmark.id;
      });
      this.hoveredLandmark = found;
    });

    this.canvas.addEventListener('click', e => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      LANDMARKS.forEach(landmark => {
        const p = this.worldToCanvas(landmark.position.x, landmark.position.z);
        if (Math.abs(mx - p.x) < 10 && Math.abs(my - p.y) < 10) {
          if (this.onLandmarkClick) this.onLandmarkClick(landmark);
        }
      });
    });
  }

  resize() {
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }
}
