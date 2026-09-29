// Floor material, shaded per pixel in world space: the blue light pool from the active tile.
// The floor is one continuous tone everywhere, inside the field and out.
import * as THREE from 'three';

export function floorUniforms(P, g) {
  return {
    uGlowC: { value: new THREE.Vector2(g.glowX, g.glowZ) }, uGlowB: { value: g.half }, uGlowR: { value: P.tile * P.radius },
    uGlowNear: { value: P.glowNear }, uGlowFar: { value: P.glowFar }, uGlowS: { value: P.glowS },
    uGlowTint: { value: P.glowTint }, uGlowCol: { value: new THREE.Color(P.glowCol) },
  };
}

export function floorMaterial(P, U) {
  const m = new THREE.MeshPhysicalMaterial({
    color: P.floorColor, roughness: P.floorRough, clearcoat: P.floorCoat, clearcoatRoughness: 0.35, dithering: true,
  });
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
varying vec3 vWPos;
uniform vec2 uGlowC; uniform float uGlowB, uGlowR, uGlowNear, uGlowFar, uGlowS, uGlowTint; uniform vec3 uGlowCol;
float sdRS(vec2 p, float b, float r) { vec2 q = abs(p) - vec2(b) + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
float glowAmt() { float d = max(sdRS(vWPos.xz - uGlowC, uGlowB, uGlowR), 0.0); return 0.75 * exp(-d / uGlowNear) + 0.25 * exp(-d / uGlowFar); }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
diffuseColor.rgb = mix(diffuseColor.rgb, uGlowCol, clamp(glowAmt() * uGlowTint, 0.0, 1.0));`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
totalEmissiveRadiance += uGlowCol * uGlowS * glowAmt();`);
  };
  return m;
}
