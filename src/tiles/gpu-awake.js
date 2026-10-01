// A two-GPU Mac powers its Radeon down once nothing has drawn on it for some seconds, and waking it freezes the
// whole page for about a second, in Chrome and Safari alike: a Chrome trace on a 2019 MacBook Pro showed the
// graphics process stalled 0.94 s each time, about 2 s after the scroll line's liquid (or the floor) drew again
// on the way back up from the foot of the page. Both stop drawing while off screen, so a visitor further down
// left the Radeon idle. While the page is in view, the floor's context now clears a 1x1 target twice a second,
// nothing on screen and next to no work, so the Radeon is never idle long enough to be powered down. In a
// hidden tab it rests.
import * as THREE from 'three';

export function keepGpuAwake(renderer) {
  const rt = new THREE.WebGLRenderTarget(1, 1, { depthBuffer: false });
  const gl = renderer.getContext();
  const timer = setInterval(() => {
    if (document.hidden) return;
    const was = renderer.getRenderTarget();
    renderer.setRenderTarget(rt);
    renderer.clear(true, false, false);
    renderer.setRenderTarget(was);
    gl.flush(); // sent to the GPU now, not held until the next frame
  }, 500);
  return () => {
    clearInterval(timer);
    rt.dispose();
  };
}
