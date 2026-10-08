// Detect mobile/low-end devices and return a quality profile
export function getDeviceProfile() {
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
    || window.innerWidth < 768;
  const isLowEnd = isMobile && (navigator.hardwareConcurrency || 4) <= 4;

  if (isLowEnd || isMobile) {
    return {
      isMobile: true,
      pixelRatio: 1,           // never upscale on mobile
      shadowMapSize: 512,      // tiny shadow map
      shadowsEnabled: false,   // disable shadows entirely on mobile
      antialias: false,
      fogFar: 500,             // tighter fog = fewer objects rendered
      treeCount: 0.25,         // 25% of desktop tree count
      vehicleRouteExtras: 0,   // no extra random traffic vehicles
      parkingSlotMultiplier: 0.2,
      roadSegmentDivisor: 3,   // fewer tube segments
      sphereDetail: [4, 3],    // low-poly spheres
      cylinderDetail: 5,       // low-poly cylinders
    };
  }

  return {
    isMobile: false,
    pixelRatio: Math.min(window.devicePixelRatio, 1.5),
    shadowMapSize: 1024,
    shadowsEnabled: true,
    antialias: window.devicePixelRatio < 2,
    fogFar: 900,
    treeCount: 1.0,
    vehicleRouteExtras: 2,
    parkingSlotMultiplier: 1.0,
    roadSegmentDivisor: 1,
    sphereDetail: [8, 6],
    cylinderDetail: 8,
  };
}

export const PROFILE = getDeviceProfile();
