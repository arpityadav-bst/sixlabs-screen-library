// Gamer busts, one per visible tile, laid flat on the tile's top face like a decal so they follow the
// tile's axes. Each bust's head points to the tile's back corner and its chest sits toward the
// camera-facing corner. The picture is stretched along the tile's diagonal by charStretch so the
// camera's tilt does not squash the face. Files live in ./chars/ (human) and ./chars-ai/ (the same
// name, its charcoal AI copy), assigned in screen order (top to bottom, left to right), with the
// focused tile of a static render taking P.charActive. Each is clipped to its tile's outline.
//
// Every tile carries both pictures stacked; uScan (0 human, 1 AI) crossfades between them.
import * as THREE from 'three';

function charMaterial(tex, t, P, role, scanU) {
  // pulled well forward in depth so the bust always wins over its own tile top (glass or raised slab)
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -8, polygonOffsetUnits: -8 });
  const half = P.tile / 2 - P.charInset, rad = P.tile * P.radius;
  mat.customProgramCacheKey = () => `char-${role}`; // human and AI compile different code from one closure
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTileC = { value: new THREE.Vector2(t.x, t.z) };
    sh.uniforms.uScan = scanU;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vW;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvW = (modelMatrix * vec4(transformed, 1.0)).xz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
varying vec2 vW; uniform vec2 uTileC; uniform float uScan;
float sdRS(vec2 p, float b, float r) { vec2 q = abs(p) - vec2(b) + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }`)
      // Sample one detail level sharper than the default: the busts are drawn much smaller than their
      // pictures, and the default choice of level blurs them. Anti-aliasing absorbs the extra detail.
      .replace('#include <map_fragment>', `diffuseColor *= texture2D(map, vMapUv, ${(P.charLodBias ?? 0).toFixed(2)});`)
      .replace('#include <alphamap_fragment>', `#include <alphamap_fragment>
float clip = 1.0 - smoothstep(-${P.charEdgeSoft.toFixed(3)}, 0.0, sdRS(vW - uTileC, ${half.toFixed(3)}, ${rad.toFixed(3)}));
diffuseColor.a *= clip * ${role === 'ai' ? 'uScan' : '(1.0 - uScan)'};`);
  };
  return mat;
}

// Starts downloading every human and AI picture of `names` at once: a Map "dir/name" -> Promise<Texture>.
export function loadPictures(P, names) {
  const loader = new THREE.TextureLoader(), cache = new Map();
  for (const name of names) for (const dir of ['chars', 'chars-ai']) {
    cache.set(`${dir}/${name}`, loader.loadAsync(`${P.assetBase ?? ''}/${dir}/${name}`).then((t) => {
      t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t;
    }));
  }
  return cache;
}
export const preloadCharacters = (P) => loadPictures(P, P.chars ?? []);

// Casts a set of characters onto the tiles: a Map "i,j" -> file name. Tiles go most visible first (their
// `shown` share of the screen), each taking the least recently used character that no tile within two
// cells already shows: every character lands on a well-visible tile before any repeats, and repeats end
// up on the most cut-off tiles. `active` (static renders) pins one tile.
export function castTiles(tiles, names, active) {
  const ordered = [...tiles].sort((a, b) => ((b.shown ?? 0) - (a.shown ?? 0)) || (a.screen[1] - b.screen[1]) || (a.screen[0] - b.screen[0]));
  const pool = names.filter((c) => c !== active);
  const placed = [], lastUsed = new Map(pool.map((n) => [n, -1])), cast = new Map();
  const pick = (t) => {
    if (t.active && active) return active;
    const near = new Set(placed.filter((p) => Math.abs(p.i - t.i) <= 2 && Math.abs(p.j - t.j) <= 2).map((p) => p.name));
    const byAge = [...pool].sort((x, y) => lastUsed.get(x) - lastUsed.get(y));
    return byAge.find((n) => !near.has(n)) ?? byAge[0];
  };
  for (const t of ordered) {
    const name = pick(t);
    placed.push({ i: t.i, j: t.j, name });
    if (lastUsed.has(name)) lastUsed.set(name, placed.length);
    cast.set(`${t.i},${t.j}`, name);
  }
  return cast;
}

// Returns a Map "i,j" -> { name, meshes, converted, at, setScan(s), setLift(y), setPictures(human, ai) }.
export async function addCharacters(scene, P, tiles, cache = preloadCharacters(P)) {
  const out = new Map();
  if (!P.chars?.length) return out;
  await Promise.all(cache.values());
  const load = (dir, name) => cache.get(`${dir}/${name}`);
  const geo = new THREE.PlaneGeometry(1, 1);
  const cast = castTiles(tiles, P.chars, P.charActive);
  const fwd = P.charForward * Math.SQRT1_2; // along the diagonal toward the (+x, +z) corner, nearest the camera
  for (const t of tiles) {
    const name = cast.get(`${t.i},${t.j}`);
    const scanU = { value: 0 };
    const meshes = [];
    for (const [role, dir, order] of [['human', 'chars', 3], ['ai', 'chars-ai', 4]]) {
      const bust = new THREE.Mesh(geo, charMaterial(await load(dir, name), t, P, role, scanU));
      bust.rotation.set(-Math.PI / 2, 0, Math.PI / 4); // flat on the tile, picture up = toward the back corner
      bust.scale.set(P.charSize, P.charSize * P.charStretch, 1);
      bust.position.set(t.x + fwd, t.y + 0.002, t.z + fwd);
      bust.renderOrder = order;
      scene.add(bust);
      meshes.push(bust);
    }
    out.set(`${t.i},${t.j}`, {
      name, meshes, converted: false, at: [t.x, t.y, t.z],
      setScan: (s) => { scanU.value = s; },
      setLift: (y) => meshes.forEach((m) => { m.position.y = t.y + 0.002 + y; }),
      setPictures: (human, ai) => { meshes[0].material.map = human; meshes[1].material.map = ai; },
    });
  }
  return out;
}
