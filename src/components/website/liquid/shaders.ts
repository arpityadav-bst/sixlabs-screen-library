// The liquid's shaders (liquid-sim.ts), after Canvas UI's Liquid Object: a small fluid simulation (splat,
// curl, vorticity, divergence, pressure, gradient, advect) whose flow field drags a picture around, with a
// chromatic lens at the cursor, a sheen and a rainbow shimmer where it flows, and film grain. Only the
// composite differs from the original: it drags a flat picture (the sentence, drawn to a canvas) rather than
// a rendered 3D scene, adds only the light the flow makes (none at rest, so the words keep their colours
// exactly while still), keeps its grain to the cursor's lens, and skips the scene's tone mapping.

export const QUAD_VERT = `
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

export const SPLAT_FRAG = `
uniform sampler2D tTarget;
uniform vec2 uPoint;
uniform vec3 uValue;
uniform float uRadius;
uniform float uAspect;
in vec2 vUv;
out vec4 fragColor;
void main() {
  vec2 d = vUv - uPoint;
  d.x *= uAspect;
  float fall = exp(-dot(d, d) / max(uRadius, 1e-5));
  fragColor = vec4(texture(tTarget, vUv).xyz + uValue * fall, 1.0);
}`;

export const CURL_FRAG = `
uniform sampler2D tVelocity;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;
void main() {
  float l = texture(tVelocity, vUv - vec2(uTexel.x, 0.0)).y;
  float r = texture(tVelocity, vUv + vec2(uTexel.x, 0.0)).y;
  float b = texture(tVelocity, vUv - vec2(0.0, uTexel.y)).x;
  float t = texture(tVelocity, vUv + vec2(0.0, uTexel.y)).x;
  fragColor = vec4((r - l - t + b) * 0.5, 0.0, 0.0, 1.0);
}`;

export const VORTICITY_FRAG = `
uniform sampler2D tVelocity;
uniform sampler2D tCurl;
uniform vec2 uTexel;
uniform float uCurl;
uniform float uDt;
in vec2 vUv;
out vec4 fragColor;
void main() {
  float l = texture(tCurl, vUv - vec2(uTexel.x, 0.0)).x;
  float r = texture(tCurl, vUv + vec2(uTexel.x, 0.0)).x;
  float b = texture(tCurl, vUv - vec2(0.0, uTexel.y)).x;
  float t = texture(tCurl, vUv + vec2(0.0, uTexel.y)).x;
  float c = texture(tCurl, vUv).x;
  vec2 force = vec2(abs(t) - abs(b), abs(r) - abs(l)) * 0.5;
  force /= length(force) + 1e-4;
  force *= uCurl * c;
  force.y *= -1.0;
  vec2 v = texture(tVelocity, vUv).xy + force * uDt;
  fragColor = vec4(clamp(v, -600.0, 600.0), 0.0, 1.0);
}`;

export const DIVERGENCE_FRAG = `
uniform sampler2D tVelocity;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;
void main() {
  float l = texture(tVelocity, vUv - vec2(uTexel.x, 0.0)).x;
  float r = texture(tVelocity, vUv + vec2(uTexel.x, 0.0)).x;
  float b = texture(tVelocity, vUv - vec2(0.0, uTexel.y)).y;
  float t = texture(tVelocity, vUv + vec2(0.0, uTexel.y)).y;
  fragColor = vec4((r - l + t - b) * 0.5, 0.0, 0.0, 1.0);
}`;

export const PRESSURE_FRAG = `
uniform sampler2D tPressure;
uniform sampler2D tDivergence;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;
void main() {
  float l = texture(tPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float r = texture(tPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float b = texture(tPressure, vUv - vec2(0.0, uTexel.y)).x;
  float t = texture(tPressure, vUv + vec2(0.0, uTexel.y)).x;
  float d = texture(tDivergence, vUv).x;
  fragColor = vec4((l + r + b + t - d) * 0.25, 0.0, 0.0, 1.0);
}`;

export const GRADIENT_FRAG = `
uniform sampler2D tPressure;
uniform sampler2D tVelocity;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;
void main() {
  float l = texture(tPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float r = texture(tPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float b = texture(tPressure, vUv - vec2(0.0, uTexel.y)).x;
  float t = texture(tPressure, vUv + vec2(0.0, uTexel.y)).x;
  vec2 v = texture(tVelocity, vUv).xy - vec2(r - l, t - b) * 0.5;
  fragColor = vec4(v, 0.0, 1.0);
}`;

export const ADVECT_FRAG = `
uniform sampler2D tVelocity;
uniform sampler2D tSource;
uniform vec2 uTexel;
uniform float uDt;
uniform float uDissipation;
in vec2 vUv;
out vec4 fragColor;
void main() {
  vec2 coord = vUv - uDt * texture(tVelocity, vUv).xy * uTexel;
  fragColor = texture(tSource, coord) * uDissipation;
}`;

export const FADE_FRAG = `
uniform sampler2D tSource;
uniform float uFade;
in vec2 vUv;
out vec4 fragColor;
void main() {
  fragColor = texture(tSource, vUv) * uFade;
}`;

export const COMPOSITE_FRAG = `
uniform sampler2D tScene;
uniform sampler2D tField;
uniform vec2 uFieldTexel;
uniform float uDistortion;
uniform float uAberration;
uniform float uGrain;
uniform vec2 uCursor;
uniform float uLensRadius;
uniform float uGlow;
uniform float uAspect;
uniform float uSheen;
uniform float uIridescence;
uniform float uAmbient;
uniform float uTime;
in vec2 vUv;
out vec4 fragColor;

vec3 toSrgb(vec3 c) {
  vec3 lo = c * 12.92;
  vec3 hi = 1.055 * pow(max(c, vec3(0.0)), vec3(0.41666)) - 0.055;
  return mix(lo, hi, step(vec3(0.0031308), c));
}
vec4 unpremultiply(vec4 c) { return vec4(c.rgb / max(c.a, 1e-4), c.a); }

void main() {
  vec2 flow = texture(tField, vUv).xy;
  vec2 drift = vec2(
    sin(vUv.y * 9.0 + uTime * 0.7) + sin(vUv.y * 21.0 - uTime * 1.1) * 0.6,
    sin(vUv.x * 8.0 - uTime * 0.6) + sin(vUv.x * 17.0 + uTime * 0.9) * 0.6
  );
  vec2 push = flow * uDistortion * 0.001 + drift * uAmbient * 0.0016;

  float lx = length(texture(tField, vUv - vec2(uFieldTexel.x, 0.0)).xy);
  float rx = length(texture(tField, vUv + vec2(uFieldTexel.x, 0.0)).xy);
  float by = length(texture(tField, vUv - vec2(0.0, uFieldTexel.y)).xy);
  float ty = length(texture(tField, vUv + vec2(0.0, uFieldTexel.y)).xy);
  vec2 grad = vec2(rx - lx, ty - by);

  vec2 toCursor = (vUv - uCursor) * vec2(uAspect, 1.0);
  float lens = smoothstep(uLensRadius, uLensRadius * 0.15, length(toCursor)) * uGlow;
  vec2 spread = normalize(toCursor + 1e-5) * (lens * uAberration * 0.006) / vec2(uAspect, 1.0);
  vec4 sr = unpremultiply(texture(tScene, vUv - push - spread));
  vec4 sg = unpremultiply(texture(tScene, vUv - push));
  vec4 sb = unpremultiply(texture(tScene, vUv - push + spread));
  float alpha = (sr.a + sg.a + sb.a) / 3.0;
  vec3 color = vec3(sr.r, sg.g, sb.b);

  // the sheen: only what the flow's slope adds over a still surface
  vec3 light = normalize(vec3(-0.4, 0.55, 0.73));
  vec3 normal = normalize(vec3(-grad * 0.3, 1.0));
  float spec = max(pow(max(dot(normal, light), 0.0), 16.0) - pow(light.z, 16.0), 0.0);
  color += spec * uSheen * 2.5;

  float energy = length(flow);
  float rim = length(grad);
  float wave = smoothstep(0.4, 8.0, rim + energy * 0.12);
  vec3 shimmer = 0.5 + 0.5 * cos(vec3(0.0, 2.094, 4.188) + energy * 0.045 + (grad.x - grad.y) * 0.1 + uTime * 0.6);
  color += shimmer * wave * uIridescence * 0.5;

  color = toSrgb(clamp(color, 0.0, 1.0));
  float grainN = fract(sin(dot(gl_FragCoord.xy + vec2(uTime * 127.1, uTime * 311.7), vec2(12.9898, 78.233))) * 43758.5453);
  vec3 blended = color * alpha + (grainN - 0.5) * uGrain * lens * 0.14 * alpha; // grain only in the cursor's lens
  fragColor = vec4(max(blended, 0.0), alpha);
}`;
