import { LANDMARKS } from '../data/landmarksData.js';
import { formatTime } from '../utils/helpers.js';

export class HUD {
  constructor({ onFlyTo, onDayNight, onOverview, onAudio }) {
    this.onFlyTo = onFlyTo;
    this.onDayNight = onDayNight;
    this.onOverview = onOverview;
    this.onAudio = onAudio;

    this.isNight = false;
    this.audioOn = false;
    this.mapOpen = false;
    this.cityTime = 12 * 3600; // Start at noon

    this._els = {
      loadScreen: document.getElementById('loading-screen'),
      loaderBar: document.getElementById('loader-bar'),
      loaderStatus: document.getElementById('loader-status'),
      hud: document.getElementById('hud'),
      timeDisplay: document.getElementById('time-display'),
      locationLabel: document.getElementById('location-label'),
      compassNeedle: document.getElementById('compass-needle'),
      btnOverview: document.getElementById('btn-overview'),
      btnDayNight: document.getElementById('btn-daynight'),
      btnMap: document.getElementById('btn-map'),
      btnAudio: document.getElementById('btn-audio'),
      searchInput: document.getElementById('search-input'),
      searchResults: document.getElementById('search-results'),
      minimapPanel: document.getElementById('minimap-panel'),
      minimapClose: document.getElementById('minimap-close'),
      infoPanel: document.getElementById('info-panel'),
      infoClose: document.getElementById('info-close'),
      infoBadge: document.getElementById('info-badge'),
      infoTitle: document.getElementById('info-title'),
      infoDesc: document.getElementById('info-desc'),
      infoTags: document.getElementById('info-tags'),
      infoGoto: document.getElementById('info-goto'),
      tooltip: document.getElementById('tooltip'),
    };

    this._bindEvents();
  }

  _bindEvents() {
    const e = this._els;

    e.btnOverview.addEventListener('click', () => {
      this.onOverview && this.onOverview();
    });

    e.btnDayNight.addEventListener('click', () => {
      this.isNight = !this.isNight;
      e.btnDayNight.textContent = this.isNight ? 'Night' : 'Day';
      e.btnDayNight.classList.toggle('active', this.isNight);
      this.onDayNight && this.onDayNight(this.isNight);
    });

    e.btnMap.addEventListener('click', () => {
      this.mapOpen = !this.mapOpen;
      e.minimapPanel.classList.toggle('hidden', !this.mapOpen);
      e.btnMap.classList.toggle('active', this.mapOpen);
    });

    e.btnAudio.addEventListener('click', () => {
      this.audioOn = !this.audioOn;
      e.btnAudio.textContent = this.audioOn ? 'Audio On' : 'Audio Off';
      e.btnAudio.classList.toggle('active', this.audioOn);
      this.onAudio && this.onAudio(this.audioOn);
    });

    e.minimapClose.addEventListener('click', () => {
      this.mapOpen = false;
      e.minimapPanel.classList.add('hidden');
      e.btnMap.classList.remove('active');
    });

    e.infoClose.addEventListener('click', () => {
      this.hideInfoPanel();
    });

    e.infoGoto.addEventListener('click', () => {
      const id = e.infoGoto.dataset.landmarkId;
      if (id) this._flyToLandmark(id);
    });

    // Search
    e.searchInput.addEventListener('input', () => {
      const query = e.searchInput.value.trim().toLowerCase();
      this._updateSearch(query);
    });

    e.searchInput.addEventListener('focus', () => {
      if (e.searchInput.value.trim()) {
        e.searchResults.classList.add('open');
      }
    });

    document.addEventListener('click', ev => {
      if (!e.searchInput.contains(ev.target) && !e.searchResults.contains(ev.target)) {
        e.searchResults.classList.remove('open');
      }
    });
  }

  _updateSearch(query) {
    const e = this._els;
    if (!query) {
      e.searchResults.classList.remove('open');
      e.searchResults.innerHTML = '';
      return;
    }
    const matches = LANDMARKS.filter(l =>
      l.name.toLowerCase().includes(query) ||
      l.badge.toLowerCase().includes(query) ||
      l.tags.some(t => t.toLowerCase().includes(query))
    ).slice(0, 7);

    if (matches.length === 0) {
      e.searchResults.classList.remove('open');
      return;
    }

    e.searchResults.innerHTML = matches.map(l => `
      <div class="search-result-item" data-id="${l.id}">
        <span class="result-dot"></span>
        ${l.name}
      </div>
    `).join('');
    e.searchResults.classList.add('open');

    e.searchResults.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const landmark = LANDMARKS.find(l => l.id === item.dataset.id);
        if (landmark) {
          e.searchInput.value = '';
          e.searchResults.classList.remove('open');
          this.showInfoPanel(landmark);
          this._flyToLandmark(landmark.id);
        }
      });
    });
  }

  _flyToLandmark(id) {
    const landmark = LANDMARKS.find(l => l.id === id);
    if (landmark && this.onFlyTo) {
      const pos = landmark.position;
      const floors = landmark.floors || 2;
      const targetPos = { x: pos.x + 30, y: floors * 3.6 + 20, z: pos.z + 40 };
      const lookAt = { x: pos.x, y: 0, z: pos.z };
      this.onFlyTo(targetPos, lookAt);
    }
  }

  showInfoPanel(landmark) {
    const e = this._els;
    e.infoBadge.textContent = landmark.badge;
    e.infoTitle.textContent = landmark.name;
    e.infoDesc.textContent = landmark.description;
    e.infoTags.innerHTML = landmark.tags.map(t => `<span class="info-tag">${t}</span>`).join('');
    e.infoGoto.dataset.landmarkId = landmark.id;
    e.infoPanel.classList.remove('hidden');
  }

  hideInfoPanel() {
    this._els.infoPanel.classList.add('hidden');
  }

  showTooltip(text, x, y) {
    const t = this._els.tooltip;
    t.textContent = text;
    t.style.left = `${x + 14}px`;
    t.style.top = `${y - 8}px`;
    t.classList.remove('hidden');
  }

  hideTooltip() {
    this._els.tooltip.classList.add('hidden');
  }

  setLocationLabel(name) {
    this._els.locationLabel.textContent = name;
  }

  updateCompass(cameraRotationY) {
    const deg = (cameraRotationY * 180 / Math.PI) % 360;
    this._els.compassNeedle.style.transform = `rotate(${deg}deg)`;
  }

  updateLoadingProgress(progress, status) {
    this._els.loaderBar.style.width = `${Math.round(progress * 100)}%`;
    if (status) this._els.loaderStatus.textContent = status;
  }

  hideLoadingScreen() {
    this._els.loadScreen.classList.add('fade-out');
    setTimeout(() => {
      this._els.loadScreen.style.display = 'none';
    }, 900);
  }

  tick(delta) {
    // Advance city time (1 real second = 60 city seconds)
    this.cityTime = (this.cityTime + delta * 60) % (24 * 3600);
    this._els.timeDisplay.textContent = formatTime(this.cityTime);
  }
}
