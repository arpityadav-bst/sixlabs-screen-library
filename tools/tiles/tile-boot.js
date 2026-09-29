// Headless render of ONE floor tile carrying one character, lifted off the floor, for the floating tiles
// in the scroll-line section. Same geometry, glass, busts and light as the floor (floor.js), seen from the
// floor's camera angle. PARAMS: name (character file), ai (true: the AI copy), transparent (no floor or
// background), elev (camera height in degrees), mask (the tile's outline only, white on black: the
// cut-out mask for the grey-backed render, so the glass keeps the floor's look once cut out).
import * as THREE from 'three';
import { studioEnvironment, glassMaterials } from '/src/tiles/materials.js';
import { buildComposer } from '/src/tiles/post.js';
import { addCharacters, loadPictures } from '/src/tiles/characters.js';
import { tileGeometry } from '/src/tiles/geometry.js';

const RAW = await fetch('/tiles/floor-params.json').then((r) => r.json());
const opt = Object.assign({ name: '03-braids.webp', ai: false, transparent: true, elev: null, mask: false }, window.PARAMS);
const P = Object.assign({ W: 1920, H: 1080, assetBase: '/tiles' }, RAW, RAW.states?.default ?? {}, { chars: [opt.name], charActive: null }, opt.transparent ? { filmGrain: 0 } : {});

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: opt.transparent });
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = P.exposure;
const w = innerWidth, h = innerHeight;
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = opt.transparent ? null : new THREE.Color(P.fogColor);
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
if (opt.mask) {
  ch.meshes.forEach((m) => { m.visible = false; });
  scene.background = new THREE.Color('#000000');
}

const az = THREE.MathUtils.degToRad(P.azim), el = THREE.MathUtils.degToRad(opt.elev ?? P.elev);
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
