// Load-in: the empty floor shows first, then the tiles and their busts fade in while rising out of it.
// The fade is a screen-space crossfade from a captured frame of the bare floor, so only the tiles
// change; the floor, fog and grain stay exactly as they are.
import * as THREE from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const IntroShader = {
  uniforms: { tDiffuse: { value: null }, tBase: { value: null }, uAmt: { value: 1 } },
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse, tBase; uniform float uAmt; varying vec2 vUv;
void main() { gl_FragColor = mix(texture2D(tBase, vUv), texture2D(tDiffuse, vUv), uAmt); }`,
};

const ease = (t) => 1 - Math.pow(1 - t, 3);

// field: the group holding every tile and bust. Resolves once the intro has finished (or was cut short
// by a resize or dispose, in which case the field snaps to its final place).
// delay: seconds the bare floor holds before the tiles start (room for a page loader to leave first).
export function playIntro({ renderer, composer, refiner, field, rise, seconds = 0.9, delay = 0 }) {
  const pass = composer.lean ? null : new ShaderPass(IntroShader);
  const size = renderer.getDrawingBufferSize(new THREE.Vector2());
  const base = new THREE.FramebufferTexture(size.x, size.y);
  // the crossfade: a pass of its own in the usual pipeline, the lean one's last pass under ?pipeline=lean
  const blend = (amount) => (pass ? (pass.uniforms.uAmt.value = amount) : composer.setIntro(base, amount));

  // capture the bare floor, exactly as it will look under the tiles
  field.visible = false;
  refiner.moving();
  composer.render();
  renderer.copyFramebufferToTexture(base);
  field.visible = true;
  if (pass) {
    pass.uniforms.tBase.value = base;
    composer.addPass(pass);
  }

  let raf = 0, start = 0, over = false, drawn = false, finish;
  const end = () => {
    if (over) return;
    over = true;
    cancelAnimationFrame(raf);
    field.position.y = 0;
    if (pass) {
      composer.removePass(pass);
      pass.dispose();
    } else composer.setIntro(null);
    base.dispose();
    finish();
  };
  const frame = (now) => {
    start ||= now;
    // While the bare floor holds (the delay) nothing on screen changes: it is drawn once and then no frame
    // is, which keeps the page's main thread free for what comes in meanwhile (on a phone, drawing the
    // whole floor every frame here stuttered the full view's typed title word).
    if (drawn && (now - start) / 1000 < delay) { raf = requestAnimationFrame(frame); return; }
    drawn = true;
    const t = Math.min(1, Math.max(0, (now - start) / 1000 - delay) / seconds), e = ease(t);
    field.position.y = -rise * (1 - e);
    blend(e);
    refiner.moving();
    composer.render();
    if (t < 1) raf = requestAnimationFrame(frame);
    else { end(); composer.render(); refiner.start(); }
  };
  const done = new Promise((r) => { finish = r; });
  blend(0);
  field.position.y = -rise;
  raf = requestAnimationFrame(frame);
  return { done, cancel: end };
}
