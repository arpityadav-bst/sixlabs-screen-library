// The lean pipeline for the live floor, behind ?pipeline=lean while it is checked against the usual one
// (post.js). The usual one draws the scene into a half-float target with 4x multisampling, copies it on to
// the composer's half-float buffers and tone maps, encodes and grains it there in a last full-screen pass:
// some 600 MB of drawing buffers at a Retina screen's size, every pixel written and read several times a
// frame. This one tone maps in each material as it draws (three's own Neutral curve, the same maths, written
// into the materials' tonemapping chunk), into one target of 8-bit sRGB with 4x multisampling (the GPU
// blends in linear light there, as the half-float target did, and encodes on write), then one pass puts it
// on the canvas, encoded as the usual pipeline's last pass encoded it, with the same film grain. About 300 MB
// at that size, and half the data moved a frame. What it leaves out: the progressive smoothing a still
// floor gets (createRefiner, post.js), which the auto-play almost never stays still long enough to reach.
// Tone mapping before blending instead of after, and resolving the multisampling after it, differ from
// the usual pipeline only where see-through layers cross the curve's bright end, by a level or so.
import * as THREE from 'three';

export const leanWanted = () => typeof location !== 'undefined' && /[?&]pipeline=lean/.test(location.search);

// three's NeutralToneMapping (tonemapping_pars_fragment), inline, so it runs whatever the target
const toneChunk = (exposure) => `{
  vec3 tmC = gl_FragColor.rgb * ${exposure.toFixed(4)};
  float tmX = min(tmC.r, min(tmC.g, tmC.b));
  tmC -= tmX < 0.08 ? tmX - 6.25 * tmX * tmX : 0.04;
  float tmPeak = max(tmC.r, max(tmC.g, tmC.b));
  if (tmPeak >= 0.76) {
    float tmD = 1.0 - 0.76, tmNew = 1.0 - tmD * tmD / (tmPeak + tmD - 0.76);
    tmC *= tmNew / tmPeak;
    tmC = mix(tmC, vec3(tmNew), 1.0 - 1.0 / (0.15 * (tmPeak - tmNew) + 1.0));
  }
  gl_FragColor.rgb = tmC;
}`;
// the same on the CPU, for the fog's colour (mixed in after the materials' tone mapping)
function neutral(c, exposure) {
  let [r, g, b] = [c.r * exposure, c.g * exposure, c.b * exposure];
  const x = Math.min(r, g, b), off = x < 0.08 ? x - 6.25 * x * x : 0.04;
  r -= off; g -= off; b -= off;
  const peak = Math.max(r, g, b);
  if (peak >= 0.76) {
    const d = 0.24, np = 1 - (d * d) / (peak + d - 0.76), k = 1 - 1 / (0.15 * (peak - np) + 1);
    [r, g, b] = [r, g, b].map((v) => v * (np / peak) * (1 - k) + np * k);
  }
  return c.setRGB(r, g, b);
}

const FINAL = {
  uniforms: { tScene: { value: null }, tBase: { value: null }, uMix: { value: 1 }, uAmt: { value: 0 } },
  vertexShader: `precision highp float; attribute vec3 position; varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
  // the usual last pass's encode (OutputPass: sRGBTransferOETF) and grain (post.js); during the load-in, the
  // bare floor's frame under it (intro.js), crossfaded as the intro's own pass did
  fragmentShader: `precision highp float; uniform sampler2D tScene, tBase; uniform float uMix, uAmt; varying vec2 vUv;
float grainHash(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
void main() {
  vec4 c = texture2D(tScene, vUv);
  c.rgb = mix(pow(c.rgb, vec3(0.41666)) * 1.055 - vec3(0.055), c.rgb * 12.92, vec3(lessThanEqual(c.rgb, vec3(0.0031308))));
  c.rgb += (grainHash(gl_FragCoord.xy) - 0.5) * uAmt;
  gl_FragColor = uMix < 1.0 ? mix(texture2D(tBase, vUv), c, uMix) : c;
}`,
};

// The lean composer: what floor.js, the floor's auto-play and ?perf (floor-perf.js, perf-bench.ts) call on a
// composer. passes[0] carries the target (its samples are the bench's anti-aliasing setting) and the grain.
export function buildLean(renderer, scene, P) {
  const exposure = P.exposure ?? 1;
  THREE.ShaderChunk.tonemapping_fragment = toneChunk(exposure);
  // programs made before now (the side-wall reflection's capture, floor.js) were built without it: let them
  // go, so every material is built again with it (the reflection itself keeps its untouched colours)
  scene.traverse((o) => [o.material].flat().forEach((m) => m?.dispose?.()));
  if (scene.fog) neutral(scene.fog.color, exposure);
  if (scene.background?.isColor) neutral(scene.background, exposure);

  const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.UnsignedByteType, colorSpace: THREE.SRGBColorSpace, samples: P.msaa ?? 4 });
  const final = new THREE.RawShaderMaterial({ ...FINAL, uniforms: THREE.UniformsUtils.clone(FINAL.uniforms), depthTest: false, depthWrite: false });
  final.uniforms.uAmt.value = P.filmGrain > 0 ? P.filmGrain : 0;
  const tri = new THREE.BufferGeometry();
  tri.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
  const quad = new THREE.Mesh(tri, final), quadScene = new THREE.Scene(), quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  quad.frustumCulled = false;
  quadScene.add(quad);
  let ratio = 1, camera = null;
  return {
    lean: true,
    passes: [{ _sampleRenderTarget: rt, uniforms: final.uniforms }],
    setCamera(c) { camera = c; },
    setPixelRatio(r) { ratio = r; },
    setSize(w, h) { rt.setSize(Math.round(w * ratio), Math.round(h * ratio)); },
    // the load-in's bare floor (a captured frame) and how far the tiles have come in over it (0..1); null ends it
    setIntro(base, amount = 1) {
      final.uniforms.tBase.value = base;
      final.uniforms.uMix.value = base ? amount : 1;
    },
    render() {
      renderer.setRenderTarget(rt);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      final.uniforms.tScene.value = rt.texture;
      renderer.render(quadScene, quadCam);
    },
  };
}

export const leanRefiner = () => ({ moving() {}, start() {}, resized() {}, stop() {} });
