// Responsive framing. The composition is designed at 16:9 (P.W x P.H). Wider screens keep the same lens
// and camera, so more floor shows on both sides. Taller screens keep the lens and pull the camera back
// along its line of sight, so the design's full width stays in view with more floor above and below and
// no added perspective distortion. The grid and characters are built to cover every aspect in ASPECTS.
import * as THREE from 'three';

export const ASPECTS = [16 / 9, 2.6, 0.45]; // design, ultrawide, phone portrait

export function placeCamera(camera, P, aspect, fog) {
  const el = THREE.MathUtils.degToRad(P.elev), az = THREE.MathUtils.degToRad(P.azim);
  const d = P.dist * Math.max(1, (P.W / P.H) / aspect);
  camera.aspect = aspect;
  camera.position.set(d * Math.cos(el) * Math.sin(az), d * Math.sin(el), d * Math.cos(el) * Math.cos(az));
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  if (fog) { fog.near = d + P.fogNear; fog.far = d + P.fogFar; }
}

// Floor points under the four screen corners, for every supported aspect.
export function coverage(camera, P) {
  const cam = camera.clone(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), rc = new THREE.Raycaster(), pts = [];
  for (const aspect of ASPECTS) {
    placeCamera(cam, P, aspect);
    for (const [x, y] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      rc.setFromCamera(new THREE.Vector2(x, y), cam);
      const p = new THREE.Vector3();
      if (rc.ray.intersectPlane(plane, p)) pts.push(p);
    }
  }
  return pts;
}

// True when a point is on screen (plus margin) at any supported aspect.
export function onSomeScreen(camera, P, point, mx = 1.12, my = 1.2) {
  const cam = camera.clone();
  return ASPECTS.some((aspect) => {
    placeCamera(cam, P, aspect);
    const v = point.clone().project(cam);
    return Math.abs(v.x) < mx && Math.abs(v.y) < my;
  });
}

// Polygon area (shoelace) and clipping to the screen square [-1, 1] (Sutherland-Hodgman).
const area = (p) => Math.abs(p.reduce((s, [x, y], k) => { const [u, w] = p[(k + 1) % p.length]; return s + x * w - u * y; }, 0)) / 2;
function clip(poly) {
  const edges = [[0, -1, 1], [0, 1, -1], [1, -1, 1], [1, 1, -1]]; // axis, bound, side: keep side * (c - bound) >= 0
  for (const [ax, bound, side] of edges) {
    const inside = (p) => side * (p[ax] - bound) >= 0, out = [];
    poly.forEach((p, k) => {
      const q = poly[(k + 1) % poly.length], pi = inside(p), qi = inside(q);
      if (pi) out.push(p);
      if (pi !== qi) { const t = (bound - p[ax]) / (q[ax] - p[ax]); out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); }
    });
    poly = out;
    if (!poly.length) break;
  }
  return poly;
}

// How much of a tile's top face (centre x, y, z; half-size `half`) is on screen, by area (0..1), with the
// centre in normalised device coordinates.
export function shownShare(camera, x, y, z, half) {
  const v = new THREE.Vector3(), project = (px, pz) => { v.set(px, y, pz).project(camera); return [v.x, v.y]; };
  const quad = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => project(x + a * half, z + b * half));
  const [cx, cy] = project(x, z);
  return { x: cx, y: cy, shown: area(clip(quad)) / Math.max(1e-9, area(quad)) };
}
