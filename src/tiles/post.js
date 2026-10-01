// Render pipeline: the live floor's (lean.js) or a still render's.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { TAARenderPass } from 'three/addons/postprocessing/TAARenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { buildLean } from './lean.js';

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

// The live floor draws through lean.js: tone mapped in its materials as they draw, into one 8-bit sRGB
// target with 4x multisampling, encoded and grained in one last pass. A still render (isStatic, floor.js;
// the tools' boot pages) takes this composer: supersampled anti-aliasing (TAA with accumulation off, at
// P.ssaa), bloom on the brightest highlights, tone mapping and film grain.
export function buildComposer(renderer, scene, camera, P, live = false) {
  if (live) {
    const lean = buildLean(renderer, scene, P);
    lean.setCamera(camera);
    return lean;
  }
  const composer = new EffectComposer(renderer);
  const aa = new TAARenderPass(scene, camera);
  aa.sampleLevel = P.ssaa ?? 4;
  aa.unbiased = true;
  // the pass's own scene target, with 4x hardware multisampling under each supersample
  aa._sampleRenderTarget = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: P.msaa ?? 4 });
  composer.addPass(aa);
  if (P.bloomS > 0) composer.addPass(new UnrealBloomPass(new THREE.Vector2(512, 512), P.bloomS, P.bloomR, P.bloomT));
  composer.addPass(outputPass(P.filmGrain));
  return composer;
}
