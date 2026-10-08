import * as THREE from 'three';

export function startAnimationLoop(renderer, scene, camera, controls, onFrame) {
  const clock = new THREE.Clock();

  function loop() {
    requestAnimationFrame(loop);
    const rawDelta = clock.getDelta();
    // Clamp delta: prevents spiral-of-death when tab is backgrounded or frame spikes
    const delta = Math.min(rawDelta, 0.05);
    const elapsed = clock.elapsedTime;
    controls.update();
    onFrame(delta, elapsed);
    renderer.render(scene, camera);
  }

  loop();
}
