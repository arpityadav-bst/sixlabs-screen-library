// Render pipeline: anti-aliasing, bloom on the brightest highlights, tone mapping, film grain.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { TAARenderPass } from 'three/addons/postprocessing/TAARenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// The film grain, added in the output pass's own shader after its tone mapping and sRGB (it was a pass of its
// own, a whole extra full-screen read and write a frame for the same result).
// Sine-free hash: stays random at 4K pixel coordinates, where the sine version forms stripes.
const GRAIN = `uniform float uAmt;
float grainHash(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }`;
function outputPass(amt) {
  const pass = new OutputPass();
  if (!(amt > 0)) return pass;
  pass.uniforms.uAmt = { value: amt };
  pass.material.fragmentShader = pass.material.fragmentShader
    .replace('varying vec2 vUv;', `varying vec2 vUv;\n${GRAIN}`)
    .replace(/\}\s*$/, 'gl_FragColor.rgb += (grainHash(gl_FragCoord.xy) - 0.5) * uAmt;\n}\n'); // the last line of main()
  return pass;
}

// A moving frame is one plain sample. The anti-aliasing pass would copy it from its own (multisampled) target
// into the composer's buffer for the next pass to read; here the next pass reads it where it is, which saves a
// full-screen copy a frame and draws the same pixels (a single sample is copied at a weight of exactly 1).
// Only where the output pass comes straight after it (no bloom between).
function readInPlace(aa, next) {
  const own = aa.render.bind(aa), oldClear = new THREE.Color();
  aa.render = (renderer, writeBuffer, readBuffer, ...rest) => {
    aa.inPlace = !aa.accumulate && aa.sampleLevel === 0 && !aa.renderToScreen;
    if (!aa.inPlace) return own(renderer, writeBuffer, readBuffer, ...rest);
    const autoClear = renderer.autoClear, oldAlpha = renderer.getClearAlpha();
    renderer.getClearColor(oldClear);
    renderer.autoClear = false;
    renderer.setClearColor(aa.clearColor, aa.clearAlpha);
    renderer.setRenderTarget(aa._sampleRenderTarget);
    renderer.clear();
    renderer.render(aa.scene, aa.camera);
    renderer.autoClear = autoClear;
    renderer.setClearColor(oldClear, oldAlpha);
    aa.accumulateIndex = -1;
  };
  const nextRender = next.render.bind(next);
  next.render = (renderer, writeBuffer, readBuffer, ...rest) => nextRender(renderer, writeBuffer, aa.inPlace ? aa._sampleRenderTarget : readBuffer, ...rest);
}

export function buildComposer(renderer, scene, camera, P) {
  const composer = new EffectComposer(renderer);
  // TAA with accumulate off is plain supersampling (static renders use it at P.ssaa); the live floor
  // switches accumulation on through createRefiner.
  const aa = new TAARenderPass(scene, camera);
  aa.sampleLevel = P.ssaa ?? 4;
  aa.unbiased = true;
  // The pass's own scene target, made up front with 4x hardware multisampling (the pass only creates one
  // when missing): edges stay smooth even on the one-sample frames drawn while tiles move, which with the
  // auto-play running is nearly all the time.
  aa._sampleRenderTarget = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: P.msaa ?? 4 });
  composer.addPass(aa);
  if (P.bloomS > 0) composer.addPass(new UnrealBloomPass(new THREE.Vector2(512, 512), P.bloomS, P.bloomR, P.bloomT));
  const out = outputPass(P.filmGrain);
  composer.addPass(out);
  if (!(P.bloomS > 0)) readInPlace(aa, out);
  return composer;
}

// Progressive smoothing for the live floor. While anything moves, frames are one plain sample each.
// Once the scene is still, every frame adds one more jittered sample to a running average until 32 are
// in, so the image sharpens over about half a second instead of one heavy frame blocking the GPU.
export function createRefiner(composer) {
  const aa = composer.passes[0];
  let raf = 0;
  const step = () => { composer.render(); raf = aa.accumulateIndex < 32 ? requestAnimationFrame(step) : 0; };
  return {
    moving() { cancelAnimationFrame(raf); raf = 0; aa.accumulate = false; aa.sampleLevel = 0; },
    start() { cancelAnimationFrame(raf); aa.accumulate = true; aa.sampleLevel = 0; aa.accumulateIndex = -1; raf = requestAnimationFrame(step); },
    // The pass keeps its hold buffer at the old size after a resize; drop it so it is rebuilt.
    resized() { aa._holdRenderTarget?.dispose(); aa._holdRenderTarget = null; aa.accumulateIndex = -1; },
    stop() { cancelAnimationFrame(raf); raf = 0; },
  };
}
