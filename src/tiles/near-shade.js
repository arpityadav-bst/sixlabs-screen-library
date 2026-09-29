// Shading the active tile throws onto the tops of its neighbours: a soft gray contact shadow (a broad
// gaussian falloff, so it spreads instead of hugging the edge) and,
// when shining, a pale blue spill. Both fall off with distance from the active tile's outline and are
// weighted per side, so each can be stronger on some sides than others. The floor in the gaps is left
// alone, so the star joints beside the active tile stay bright.
//
// The blue spill can sweep outward from the front (uSpillHead, over dot(direction, front)).
// Side weights (and the shadow's per-side reach, nearShadowWDir) are [left, right, top, bottom] = [-x, +x, -z, +z], i.e. upper left, lower right,
// upper right and lower left on screen.
import * as THREE from 'three';

export function nearShadeUniforms(P, near) {
  return {
    uNearC: { value: new THREE.Vector2(near.x, near.z) }, uNearHalf: { value: near.half }, uNearRad: { value: P.tile * P.radius },
    uShadowAmt: { value: P.nearShadow }, uShadowW: { value: P.nearShadowW }, uShadowDir: { value: new THREE.Vector4(...P.nearShadowDir) },
    uShadowWDir: { value: new THREE.Vector4(...P.nearShadowWDir) },
    uSpillAmt: { value: P.nearSpill }, uSpillW: { value: P.nearSpillW }, uSpillDir: { value: new THREE.Vector4(...P.nearSpillDir) },
    uSpillCol: { value: new THREE.Color(P.nearSpillCol) }, uSpillHead: { value: -9 },
  };
}

// Patches a material that is drawn as an InstancedMesh of inactive tiles.
export function applyNearShade(mat, U) {
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (sh, r) => {
    prev?.call(mat, sh, r);
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vNearW;')
      .replace('#include <project_vertex>', `#include <project_vertex>
{ vec4 wp = vec4(transformed, 1.0);
#ifdef USE_INSTANCING
  wp = instanceMatrix * wp;
#endif
  vNearW = (modelMatrix * wp).xz; }`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
varying vec2 vNearW;
uniform vec2 uNearC; uniform float uNearHalf, uNearRad, uShadowAmt, uShadowW, uSpillAmt, uSpillW, uSpillHead;
uniform vec4 uShadowDir, uShadowWDir, uSpillDir; uniform vec3 uSpillCol;
float nearSd(vec2 p) { vec2 q = abs(p) - vec2(uNearHalf) + uNearRad; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uNearRad; }
float sideWeight(vec2 n, vec4 w) { vec2 s = n * n; return (n.x < 0.0 ? w.x : w.y) * s.x + (n.y < 0.0 ? w.z : w.w) * s.y; }`)
      .replace('#include <opaque_fragment>', `{ vec2 rel = vNearW - uNearC; float d = max(nearSd(rel), 0.0); vec2 n = normalize(rel + 1e-5);
  float sw = uShadowW * sideWeight(n, uShadowWDir); // shadow reach, per side
  outgoingLight *= 1.0 - uShadowAmt * sideWeight(n, uShadowDir) * exp(-d * d / (sw * sw));
  outgoingLight = mix(outgoingLight, uSpillCol, clamp(uSpillAmt * sideWeight(n, uSpillDir) * exp(-d / uSpillW)
    * smoothstep(uSpillHead - 0.6, uSpillHead + 0.6, dot(n, vec2(0.70711))), 0.0, 1.0)); }
#include <opaque_fragment>`);
  };
}
