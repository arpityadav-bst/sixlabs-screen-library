// Activation timeline, matched frame by frame to the reference recording (30 fps):
//   0.00 s  the rim beam appears at the front corner
//   0.17 s  beam at the middle of both front edges, the tile starts brightening at the front
//   0.30 s  beam reaches both side corners, then runs faint along the back edges
//   0.40 s  the right corner flares
//   0.90 s  brightening has swept front to back, blue spill has spread front (LL, LR) then top-right
// Deactivation is not a reverse sweep: everything fades out together over about 1.05 s.
//
// State: S (sweep time, seconds, only advances while activating) and F (fade, 0..1).
export const ACT_SECONDS = 0.9, DEACT_SECONDS = 1.05;
// Once the activation is this far in (the character has started converting), leaving the tile lets it
// finish before fading back; leaving earlier reverts straight away.
export const COMMIT_SECONDS = 0.25;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

export function sweepValues(S, F) {
  const t = S;
  return {
    fade: F,
    beamHead: t < 0.3 ? 0.95 - (t / 0.3) * 0.95 : -((t - 0.3) / 0.5) * 1.1, // front corner -> side corners -> rear
    flare: F * smooth(0.3, 0.45, t),
    brightHead: 1.5 - 3 * clamp((t - 0.1) / 0.8),                       // front -> back, wide and soft
    spillHead: 1.5 - 3 * clamp(t / 0.75),                                // glow starts under the front corner
    amount: F * smooth(0.1, 0.9, t),                                     // shadows to blue, floor glow, light
    convert: smooth(0.25, 0.85, t),                                      // human -> AI copy
  };
}

// Fades an activated slab's materials in from the front corner toward the back (uHead, soft edge uSoft)
// and out uniformly (uFade). u = (x + z) / tile: +0.92 front corner, 0 side corners, -0.92 rear corner.
export function addSweep(mats, U, P) {
  const inv = (1 / P.tile).toFixed(4);
  mats.forEach((mat, k) => {
    const prev = mat.onBeforeCompile;
    mat.customProgramCacheKey = () => `sweep-${k}`;
    mat.onBeforeCompile = (sh, r) => {
      prev?.call(mat, sh, r);
      Object.assign(sh.uniforms, U);
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec2 vSw;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvSw = position.xz;');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying vec2 vSw; uniform float uHead, uFade, uSoft;')
        .replace('#include <opaque_fragment>', `diffuseColor.a *= uFade * smoothstep(uHead - uSoft, uHead + uSoft, (vSw.x + vSw.y) * ${inv});
#include <opaque_fragment>`);
    };
  });
}
