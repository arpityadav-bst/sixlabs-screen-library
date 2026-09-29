// Render pipeline: anti-aliasing, bloom on the brightest highlights, tone mapping, film grain.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { TAARenderPass } from 'three/addons/postprocessing/TAARenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const GrainShader = {
  uniforms: { tDiffuse: { value: null }, uAmt: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uAmt; varying vec2 vUv;
// Sine-free hash: stays random at 4K pixel coordinates, where the sine version forms stripes.
float h(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
void main() { vec4 c = texture2D(tDiffuse, vUv); gl_FragColor = vec4(c.rgb + (h(gl_FragCoord.xy) - 0.5) * uAmt, c.a); }`,
};

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
  composer.addPass(new OutputPass());
  if (P.filmGrain > 0) {
    const grain = new ShaderPass(GrainShader);
    grain.uniforms.uAmt.value = P.filmGrain;
    composer.addPass(grain);
  }
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
