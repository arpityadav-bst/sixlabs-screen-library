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

// Downloads pictures in turns (load-plan.js): each group of keys ("chars/name", "chars-ai/name") starts once
// the one before it is in, so what the floor waits for is not slowed by what it does not need yet. A key in
// more than one group goes with its first. Pictures come from P.picDir under their base (/512 on phones).
// Returns { get: Map key -> Promise<Texture>, now: Map key -> Texture, for those already in }.
export function planPictures(P, groups) {
  const loader = new THREE.TextureLoader(), get = new Map(), now = new Map(), go = new Map();
  for (const g of groups) for (const k of g) {
    if (get.has(k)) continue;
    const [dir, name] = k.split('/'), base = dir === 'chars-ai' ? (P.aiAssetBase ?? P.assetBase) : P.assetBase;
    get.set(k, new Promise((r) => go.set(k, r))
      .then(() => loader.loadAsync(`${base ?? ''}${P.picDir ?? ''}/${dir}/${name}`))
      .then((t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; now.set(k, t); return t; }));
  }
  (async () => {
    for (const g of groups) {
      const mine = g.filter((k) => go.has(k));
      mine.forEach((k) => { go.get(k)(); go.delete(k); });
      await Promise.allSettled(mine.map((k) => get.get(k)));
    }
  })();
  return { get, now };
}
// Every human and AI picture of `names`, all at once: a Map "dir/name" -> Promise<Texture>.
export const loadPictures = (P, names) => planPictures(P, [names.flatMap((n) => [`chars/${n}`, `chars-ai/${n}`])]).get;

// What a bust shows until its own picture is in (transparent), swapped for it then (addCharacters).
const BLANK = new THREE.DataTexture(new Uint8Array(4), 1, 1);
BLANK.colorSpace = THREE.SRGBColorSpace;
BLANK.needsUpdate = true;

// Casts a set of characters onto the tiles: a Map "i,j" -> file name. Tiles go most visible first (their
// `shown` share of the screen), each taking the least recently used character that no tile within two
// cells already shows: every character lands on a well-visible tile before any repeats, and repeats end
// up on the most cut-off tiles. `active` (static renders) pins one tile. With `fill`, the tiles go from the
// screen's middle outward instead (their `mid`), `names` take the middle ones, one each, and `fill` covers
// the rest by the same rule: a cast too small for the floor sits in its middle, framed by another.
export function castTiles(tiles, names, active, fill = null) {
  const ordered = [...tiles].sort(fill
    ? (a, b) => (a.mid ?? 0) - (b.mid ?? 0)
    : (a, b) => ((b.shown ?? 0) - (a.shown ?? 0)) || (a.screen[1] - b.screen[1]) || (a.screen[0] - b.screen[0]));
  let pool = names.filter((c) => c !== active);
  const placed = [], lastUsed = new Map([...pool, ...(fill ?? [])].map((n) => [n, -1])), cast = new Map();
  const pick = (t) => {
    if (t.active && active) return active;
    if (fill && placed.length === names.length) pool = fill; // every one of `names` is placed: the frame
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

// Returns a Map "i,j" -> { name, meshes, converted, at, aiIn, aiReady, setScan(s), setLift(y),
// setPictures(human, ai) }. It waits for the pictures in `wait` only (all by default); a bust whose picture
// is not in yet shows BLANK and takes its picture once it has arrived and warm(texture) has put it on the
// GPU. Until its AI copy is in (aiIn; aiReady resolves then, false if it failed), a tile stays human.
export async function addCharacters(scene, P, tiles, pics = planPictures(P, [(P.chars ?? []).flatMap((n) => [`chars/${n}`, `chars-ai/${n}`])]),
  cast = castTiles(tiles, P.chars ?? [], P.charActive), wait = [...pics.get.keys()], warm = async (t) => t) {
  const out = new Map();
  if (!P.chars?.length) return out;
  await Promise.all(wait.map((k) => pics.get.get(k)));
  const geo = new THREE.PlaneGeometry(1, 1);
  const fwd = P.charForward * Math.SQRT1_2; // along the diagonal toward the (+x, +z) corner, nearest the camera
  for (const t of tiles) {
    const name = cast.get(`${t.i},${t.j}`);
    const scanU = { value: 0 };
    const meshes = [];
    for (const [role, dir, order] of [['human', 'chars', 3], ['ai', 'chars-ai', 4]]) {
      const bust = new THREE.Mesh(geo, charMaterial(pics.now.get(`${dir}/${name}`) ?? BLANK, t, P, role, scanU));
      bust.rotation.set(-Math.PI / 2, 0, Math.PI / 4); // flat on the tile, picture up = toward the back corner
      bust.scale.set(P.charSize, P.charSize * P.charStretch, 1);
      bust.position.set(t.x + fwd, t.y + 0.002, t.z + fwd);
      bust.renderOrder = order;
      scene.add(bust);
      meshes.push(bust);
    }
    const entry = {
      name, meshes, converted: false, at: [t.x, t.y, t.z], aiIn: pics.now.has(`chars-ai/${name}`),
      setScan: (s) => { scanU.value = entry.aiIn ? s : 0; },
      setLift: (y) => meshes.forEach((m) => { m.position.y = t.y + 0.002 + y; }),
      setPictures: (human, ai) => { meshes[0].material.map = human; meshes[1].material.map = ai; entry.aiIn = true; entry.aiReady = Promise.resolve(true); },
    };
    // a picture still on its way: in once it has arrived and is on the GPU (unless a wave swapped it first)
    const later = (m, k) => (m.material.map !== BLANK ? Promise.resolve(true)
      : pics.get.get(k).then(warm).then((tex) => { if (m.material.map === BLANK) m.material.map = tex; return true; }, () => false));
    later(meshes[0], `chars/${name}`);
    entry.aiReady = later(meshes[1], `chars-ai/${name}`).then((ok) => { if (ok) entry.aiIn = true; return ok; });
    out.set(`${t.i},${t.j}`, entry);
  }
  return out;
}
