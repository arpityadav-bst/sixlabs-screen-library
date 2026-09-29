// Render pipeline: 16-sample supersampling, bloom on the brightest highlights, tone mapping, film grain.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { SSAARenderPass } from 'three/addons/postprocessing/SSAARenderPass.js';
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
  const ssaa = new SSAARenderPass(scene, camera);
  ssaa.sampleLevel = P.ssaa ?? 4;
  ssaa.unbiased = true;
  composer.addPass(ssaa);
  if (P.bloomS > 0) composer.addPass(new UnrealBloomPass(new THREE.Vector2(512, 512), P.bloomS, P.bloomR, P.bloomT));
  composer.addPass(new OutputPass());
  if (P.filmGrain > 0) {
    const grain = new ShaderPass(GrainShader);
    grain.uniforms.uAmt.value = P.filmGrain;
    composer.addPass(grain);
  }
  return composer;
}
