// Procedural canvas textures for the glass tiles. Paint callbacks receive tile-local (x, z) in [-0.5, 0.5].
import * as THREE from 'three';

// Signed distance to a rounded square of half-size b and corner radius r (2D).
export function sdRoundSquare(x, y, b, r) {
  const qx = Math.abs(x) - b + r, qy = Math.abs(y) - b + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const smooth = (e0, e1, x) => { const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1); return t * t * (3 - 2 * t); };
const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
function vnoise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y);
  let fx = x - ix, fy = y - iy;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

// Procedural textures are built once per params object and key, then shared (both rigs use the same).
const memo = new WeakMap();
function once(P, key, make) {
  let m = memo.get(P);
  if (!m) memo.set(P, (m = new Map()));
  if (!m.has(key)) m.set(key, make());
  return m.get(key);
}

// blur (in texture pixels) softens every edge after painting, used for the glint's strokes.
function canvasTexture(size, paint, srgb = true, blur = 0) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Canvas row 0 is the tile's -z edge (texture flipY plus the geometry's v = 0.5 - z).
      const [r, g, b, a] = paint((x + 0.5) / size - 0.5, (y + 0.5) / size - 0.5, x, y);
      const k = (y * size + x) * 4;
      img.data[k] = r; img.data[k + 1] = g; img.data[k + 2] = b; img.data[k + 3] = a;
    }
  }
  ctx.putImageData(img, 0, 0);
  let out = c;
  if (blur > 0) {
    out = document.createElement('canvas');
    out.width = out.height = size;
    const bctx = out.getContext('2d');
    bctx.filter = `blur(${blur}px)`;
    bctx.drawImage(c, 0, 0);
  }
  const t = new THREE.CanvasTexture(out);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// Active tile top. The body runs from actDarkCol to actLightCol along actGradDir (tile-local x, z).
// A navy pool deepens the rear corner around the glint, a soft sheen lifts one area as reflected
// studio light, and actRim edges the top face with a hairline (dark in the default state). A broad
// reflection band runs across the face horizontally on screen (actBand), with the part above it
// darkening toward navy (actUpper), the way a glossy slab reflects a bright horizon.
export function activeGradient(P) {
  return once(P, 'grad', () => {
    const [gx, gz] = P.actGradDir, gl = Math.hypot(gx, gz);
    const lo = hex(P.actDarkCol), hi = hex(P.actLightCol), rim = hex(P.actRim), navy = hex(P.actUnderCol), sheen = hex(P.actSheenCol);
    const g = (v, c, w) => Math.exp(-((v - c) ** 2) / (2 * w * w));
    const az = THREE.MathUtils.degToRad(P.azim), bx = -Math.sin(az), bz = -Math.cos(az), band = hex(P.actBandCol);
    return canvasTexture(512, (x, z) => {
      let c = mix(lo, hi, smooth(-0.9, 0.9, (x * gx + z * gz) / gl / 0.5));
      const tb = (x * bx + z * bz) / 0.5; // -1 at the front corner, +1 at the rear: vertical on screen
      c = mix(c, navy, smooth(P.actUpperAt, 1, tb) * P.actUpper);
      c = mix(c, band, Math.min(1, g(tb, P.actBandAt, P.actBandW) * P.actBand));
      c = mix(c, sheen, Math.min(1, g(x, P.actSheenAt[0], P.actSheenR) * g(z, P.actSheenAt[1], P.actSheenR) * P.actSheen));
      const u = -(x + z) * Math.SQRT1_2, v = (x - z) * Math.SQRT1_2; // along / across the rear diagonal
      c = mix(c, navy, Math.min(1, g(u, P.actNavyAt, P.actNavyAlong) * g(v, 0, P.actNavyAcross) * P.actUnderDark));
      // A soft lighter pool behind the character's head, so the bust stands out from the dark surface (after the
      // navy pool, so it is not darkened again).
      if (P.actHeadGlow > 0) c = mix(c, hex(P.actHeadCol), Math.min(1, g(x, P.actHeadAt[0], P.actHeadR) * g(z, P.actHeadAt[1], P.actHeadR) * P.actHeadGlow));
      const d = -sdRoundSquare(x, z, 0.5 - P.bevel, P.tile * P.radius - P.bevel);
      c = mix(rim, c, smooth(0.0, P.actRimBand, d));
      return [...c, 255];
    });
  });
}

// Glint: a bean, shaped like a loaf. Over X in [-1, 1] the top edge (toward the corner, negative Y)
// arches up by glintTop and the bottom edge bulges gently down by glintBottom. Small exponents
// (glintTopQ, glintBottomQ) keep both edges broad and flat-ish, so the ends turn over in tight round
// caps. glintDroop lowers the ends so the top follows the corner's curve. Per-state look: fill, an
// inner edge line, an outer ring (dark navy in the default state) or cyan halo (shining), and warm
// chromatic specks near the rounded ends, all softened by glintBlur. The texture spans GLINT_SPAN
// units each way for the ring.
export const GLINT_SPAN = 1.4;
export function glintBean(P) {
  return once(P, 'glint', () => {
    const g = (d, c, w) => Math.exp(-((d - c) ** 2) / (2 * w * w));
    const D = P.glintDroop;
    const fill = hex(P.glintFillCol), edgeC = hex(P.glintEdgeCol), ringC = hex(P.glintRingCol), haloC = hex(P.glintHaloCol);
    return canvasTexture(512, (x, y) => {
      const X = x * 2 * GLINT_SPAN, Y = y * 2 * GLINT_SPAN, ax = Math.abs(X);
      let d; // approximate distance to the edge, > 0 inside the bean
      if (ax < 1) {
        const f = 1 - X * X, top = D * X * X - P.glintTop * f ** P.glintTopQ, bot = D * X * X + P.glintBottom * f ** P.glintBottomQ;
        d = Math.min(Y - top, bot - Y, (1 - ax) * 0.5);
      } else d = -Math.hypot(ax - 1, Y - D);
      const body = smooth(0, 0.04, d), edge = g(d, P.glintEdgeAt, P.glintEdgeW);
      const out = 1 - body, ring = out * (d < 0 ? g(d, 0, P.glintRingW) : 1) * P.glintRingA;
      const halo = out * (d < 0 ? g(d, 0, P.glintHaloW) : 1) * P.glintHaloA;
      const specks = g(d, 0.06, 0.03) * smooth(0.6, 0.95, Math.abs(X)) * P.glintWarm;
      let c = mix(fill, edgeC, Math.min(1, edge));
      c = mix(c, [255, 196, 160], Math.min(1, specks));
      if (out > 0.5) c = mix(haloC, ringC, ring / (ring + halo + 1e-6));
      const a = Math.min(1, body * P.glintFill + edge * P.glintEdgeA + ring + halo);
      return [...c.map(Math.round), Math.round(a * 255)];
    }, true, P.glintBlur);
  });
}

// Frosted top: soft mottling, and the tile's far bottom edges seen through the glass as soft darker
// bands, displaced toward the camera by the slab's thickness: one inside the top edge (-z, upper right
// on screen) and one inside the left edge (-x, upper left). Each band peaks at the middle of its edge
// and fades out before the corners. leftBand: false drops the left one, for the first column only,
// whose left edge faces the empty floor.
export function frostTexture(P, { leftBand = true } = {}) {
  return once(P, `frost-${leftBand}`, () => {
    const a = THREE.MathUtils.degToRad(P.azim), cx = Math.sin(a) * P.ghostShift, cz = Math.cos(a) * P.ghostShift;
    const b = 0.5 - P.bevel, w2 = 2 * P.ghostWidth * P.ghostWidth;
    const along = (t) => 1 - smooth(P.ghostFadeStart, P.ghostFadeEnd, Math.abs(t)); // 1 mid-edge, 0 near corners
    return canvasTexture(1024, (x, z) => {
      const mottle = (vnoise(x * 7 + 3.1, z * 7 + 1.7) - 0.5) * P.frostMottle;
      const xs = x - cx, zs = z - cz;
      const dTop = zs + b - P.ghostInset, dLeft = xs + b - P.ghostInset; // distance inside each far edge's image
      const top = Math.exp(-(dTop * dTop) / w2) * along(xs);
      const left = leftBand ? Math.exp(-(dLeft * dLeft) / w2) * along(zs) : 0;
      const ghost = Math.max(top, left) * P.ghostDark;
      const v = Math.round(255 * Math.min(1, Math.max(0, 1 + mottle - ghost)));
      return [v, v, v, 255];
    });
  });
}
