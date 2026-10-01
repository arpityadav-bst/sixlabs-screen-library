// Headless render of ONE floor tile carrying one character, lifted off the floor, for the floating tiles
// in the scroll-line section. Same geometry, glass, busts and light as the floor (floor.js), seen from the
// floor's camera angle. PARAMS: name (character file), ai (true: the AI copy), transparent (no floor or
// background), elev (camera height in degrees), mask (the tile's outline only, white on black: the
// cut-out mask for the grey-backed render, so the glass keeps the floor's look once cut out), straight
// (square on to the camera, the bust upright along the tile's axis, a gentler angle; default true),
// az (with straight: the camera's turn around the tile in degrees, so each tile can sit at its own angle),
// bg (the colour behind the glass, which shows through it: lighter for tiles floating on the white page),
// exposure (overrides the floor's).
import * as THREE from 'three';
import { studioEnvironment, glassMaterials } from '/src/tiles/materials.js';
import { buildComposer } from '/src/tiles/post.js';
import { addCharacters, loadPictures } from '/src/tiles/characters.js';
import { tileGeometry } from '/src/tiles/geometry.js';

const RAW = await fetch('/tiles/floor-params.json').then((r) => r.json());
const opt = Object.assign({ name: '03-braids.webp', ai: false, transparent: true, elev: null, mask: false, straight: true, az: 0, bg: null, exposure: null }, window.PARAMS);
const P = Object.assign({ W: 1920, H: 1080, assetBase: '/tiles', aiAssetBase: '/tiles-holo' }, RAW, RAW.states?.default ?? {}, { chars: [opt.name], charActive: null, charEdgeSoft: opt.straight ? 0.004 : RAW.charEdgeSoft, charInset: opt.straight ? 0.004 : RAW.charInset }, opt.transparent ? { filmGrain: 0 } : {});

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: opt.transparent });
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = opt.exposure ?? P.exposure;
const w = innerWidth, h = innerHeight;
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = opt.transparent ? null : new THREE.Color(opt.bg ?? P.fogColor);
scene.environment = studioEnvironment(renderer, P);
scene.environmentIntensity = P.envI;
scene.add(new THREE.HemisphereLight('#ffffff', P.hemiGround, P.hemi));
const key = new THREE.DirectionalLight('#ffffff', P.dir);
key.position.set(-4, 10, -7);
scene.add(key);

const half = P.tile / 2, tileH = P.core + P.bevelT;
const white = new THREE.MeshBasicMaterial({ color: '#ffffff' });
scene.add(new THREE.Mesh(tileGeometry(P, half), opt.mask ? white : glassMaterials(P, { leftBand: false })));
const chars = await addCharacters(scene, P, [{ i: 0, j: 0, x: 0, y: tileH, z: 0, active: false, screen: [0, 0], shown: 1 }], loadPictures(P, P.chars));
const ch = chars.get('0,0');
ch.setScan(opt.ai ? 1 : 0);
// Straight: turn the bust from the tile's diagonal onto its axis, head to the back edge, chest toward
// the camera edge (the floor lays it corner to corner for its diamond view).
// The floor stretches the bust along the view to undo its 40 degree tilt; this gentler view needs less,
// and the bust is sized so the character fills about 70% of the tile, as on the floor.
const TILE_FILL = 0.88 * 1.3; // bust picture width in tile widths (the floor's ~70% figure, scaled up 30%)
const undoTilt = Math.sin(THREE.MathUtils.degToRad(P.elev)) / Math.sin(THREE.MathUtils.degToRad(opt.elev ?? 62));
if (opt.straight) ch.meshes.forEach((m) => {
  m.rotation.z = 0;
  const tall = TILE_FILL * P.charStretch * undoTilt;
  // Seated on the near edge, not faded into the glass: the picture's own soft bottom (its last ~20%) is
  // pushed past the tile's edge, which clips it with a hard line (charEdgeSoft), so the figure meets it.
  m.position.set(0, m.position.y, P.tile / 2 - tall * 0.3);
  m.scale.set(TILE_FILL, tall, 1);
});
if (opt.mask) {
  ch.meshes.forEach((m) => { m.visible = false; });
  scene.background = new THREE.Color('#000000');
}

const az = THREE.MathUtils.degToRad(opt.straight ? opt.az : P.azim);
const el = THREE.MathUtils.degToRad(opt.elev ?? (opt.straight ? 62 : P.elev));
const d = (P.tile * 1.55) / Math.tan(THREE.MathUtils.degToRad(P.fov / 2)) / 2;
const camera = new THREE.PerspectiveCamera(P.fov, w / h, 0.1, 400);
camera.position.set(d * Math.cos(el) * Math.sin(az), d * Math.sin(el), d * Math.cos(el) * Math.cos(az));
camera.lookAt(0, tileH / 2, 0);

const composer = buildComposer(renderer, scene, camera, P);
composer.setPixelRatio(devicePixelRatio);
composer.setSize(w, h);
await renderer.compileAsync(scene, camera);
composer.render();
window.__info = { name: opt.name, ai: opt.ai };
window.__done = true;
