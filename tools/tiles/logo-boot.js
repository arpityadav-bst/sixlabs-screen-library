// Headless render of the SixLabs mark (public/brand/sixlabs-mark.svg) built from the floor's own tile
// materials: each blade is an extruded glass slab with the tile's bevel, lying on the same floor under the
// same studio light. PARAMS: look 'cobalt' (the focused tile's glass) or 'clear' (a default tile's
// frosted glass), elev (camera height in degrees), size (logo width in tile units).
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { studioEnvironment, glassMaterials, activeMaterials } from '/src/tiles/materials.js';
import { floorMaterial, floorUniforms } from '/src/tiles/floor-material.js';
import { buildComposer } from '/src/tiles/post.js';

const RAW = await fetch('/tiles/floor-params.json').then((r) => r.json());
const opt = Object.assign({ look: 'cobalt', elev: 40, size: 1.6 }, window.PARAMS);
const P = Object.assign({ W: 1920, H: 1080 }, RAW, RAW.states?.default ?? {}, { actHeadGlow: 0 });

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = P.exposure;
const w = innerWidth, h = innerHeight;
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(P.fogColor);
scene.environment = studioEnvironment(renderer, P);
scene.environmentIntensity = P.envI;
scene.add(new THREE.HemisphereLight('#ffffff', P.hemiGround, P.hemi));
const key = new THREE.DirectionalLight('#ffffff', P.dir);
key.position.set(-4, 10, -7);
scene.add(key);

const floorGlowOff = () => { const U = floorUniforms(P, { glowX: 0, glowZ: 0, half: 0.5 }); U.uGlowS.value = U.uGlowTint.value = 0; return U; };
const floor = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), floorMaterial(P, floorGlowOff()));
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Blades: every path of the mark, extruded to the tile's thickness with the tile's bevel, UVs spanning the
// whole mark so the glass textures (gradient, frost) lie across it the way they lie across one tile.
const svg = new SVGLoader().parse(await fetch('/brand/sixlabs-mark.svg').then((r) => r.text()));
const [vx, vy, vw, vh] = svg.xml.getAttribute('viewBox').split(/\s+/).map(Number);
const k = opt.size / vw, cx = vx + vw / 2, cy = vy + vh / 2, span = Math.max(vw, vh) * k; // UV square: the tile textures are square
const logo = new THREE.Group();
for (const path of svg.paths) {
  const navy = path.color.getHexString() === '030d2d';
  for (const shape of path.toShapes(true)) {
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: P.core / k, bevelEnabled: true, bevelThickness: P.bevelT / k, bevelSize: P.bevel / k, bevelSegments: 6, curveSegments: 24,
    });
    g.translate(-cx, -cy, 0);
    g.scale(k, k, k);
    // Lie flat with the SVG's first face on top: SVG down becomes toward the camera, so the mark reads
    // upright, and nothing is mirrored (a mirror would turn every face inside out).
    g.rotateX(Math.PI / 2);
    g.translate(0, P.core + P.bevelT, 0);
    const pos = g.attributes.position, uv = g.attributes.uv;
    for (let n = 0; n < pos.count; n++) uv.setXY(n, pos.getX(n) / span + 0.5, 0.5 - pos.getZ(n) / span);
    const beamU = { uBeam: { value: 2 }, uBeamI: { value: 0 }, uFlare: { value: 0 }, uBackRim: { value: 0 }, uShine: { value: new THREE.Color(0) }, uHotF: { value: new THREE.Color(0) }, uHotR: { value: new THREE.Color(0) } };
    const rearEnv = studioEnvironment(renderer, P, { leftStrip: false, strip: P.actEnvStrip });
    let mats;
    if (navy) {
      const dark = new THREE.MeshPhysicalMaterial({ color: '#030d2d', roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.2 });
      mats = [dark, dark];
    } else mats = opt.look === 'clear' ? glassMaterials(P, { leftBand: false }) : activeMaterials(P, rearEnv, beamU);
    logo.add(new THREE.Mesh(g, mats));
  }
}
if (opt.look === 'cobalt') logo.position.y = 0.0005;
// Turn the mark to face the camera, which sits on the floor's own azimuth.
const az = THREE.MathUtils.degToRad(P.azim);
logo.rotation.y = az;
scene.add(logo);

const el = THREE.MathUtils.degToRad(opt.elev), d = opt.size * 1.5 / Math.tan(THREE.MathUtils.degToRad(P.fov / 2)) / 2;
const camera = new THREE.PerspectiveCamera(P.fov, w / h, 0.1, 400);
camera.position.set(d * Math.cos(el) * Math.sin(az), d * Math.sin(el), d * Math.cos(el) * Math.cos(az));
camera.lookAt(0, P.core / 2, 0);
scene.fog = new THREE.Fog(P.fogColor, d + P.fogNear, d + P.fogFar);

const composer = buildComposer(renderer, scene, camera, P);
composer.setPixelRatio(devicePixelRatio);
composer.setSize(w, h);
await renderer.compileAsync(scene, camera);
composer.render();
window.__info = { look: opt.look, elev: opt.elev };
window.__done = true;
