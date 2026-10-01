// The one tile shape every tile shares: a rounded square slab with a bevelled top edge. curve and bevel are
// its segments per corner arc and across the bevel: the full 18 / 6 for the raised tile (shown large) and
// still renders; the resting floor's tiles, a few dozen px across, take far fewer (floor.js: 6 per corner, the
// 1-2px bevel as one slope), as at their size the corners and the bevel read the same and 4,000 triangles a
// tile were mostly smaller than a pixel.
import * as THREE from 'three';

export function tileGeometry(P, half, curve = 18, bevel = 6) {
  const h = half - P.bevel, r = P.tile * P.radius - P.bevel;
  const s = new THREE.Shape();
  s.moveTo(-h + r, -h);
  s.lineTo(h - r, -h);
  s.absarc(h - r, -h + r, r, -Math.PI / 2, 0, false);
  s.lineTo(h, h - r);
  s.absarc(h - r, h - r, r, 0, Math.PI / 2, false);
  s.lineTo(-h + r, h);
  s.absarc(-h + r, h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(-h, -h + r);
  s.absarc(-h + r, -h + r, r, Math.PI, Math.PI * 1.5, false);
  const g = new THREE.ExtrudeGeometry(s, {
    depth: P.core, bevelEnabled: true, bevelThickness: P.bevelT, bevelSize: P.bevel, bevelSegments: bevel, curveSegments: curve,
  });
  g.rotateX(-Math.PI / 2);
  // The underside bevel sits below the floor, so each tile meets the floor with a clean wall, no dark crease.
  const pos = g.attributes.position, uv = g.attributes.uv;
  for (let k = 0; k < pos.count; k++) uv.setXY(k, pos.getX(k) / P.tile + 0.5, 0.5 - pos.getZ(k) / P.tile);
  return g;
}
