// Headless render of the SixLabs mark (public/brand/sixlabs-mark.svg) built from the floor's own tile
// materials: each blade is an extruded glass slab with the tile's bevel, lying on the same floor under the
// same studio light. PARAMS: look 'cobalt' (the focused tile's glass) or 'clear' (a default tile's
// frosted glass), elev (camera height in degrees), size (logo width in tile units), depth (slab thickness as a share of a tile's), inset (SVG units each blade is
// pulled in by, which widens the gaps between blades; the navy core keeps its size), spin (degrees the mark turns in its own plane,
// for turntable frames), coreDepth (the core's thickness as a share of the blades': thin keeps it reading as a
// circle once straightened, its wall hidden), accentPath (index of the SVG path drawn in the accent blue,
// the site's --color-accent), bareFloor (hide the mark), transparent (no floor
// or background, for a cut-out PNG). __info.corners gives the screen pixels of the mark's top-face square,
// so the frame can be straightened into a front view (tools/tiles/flatten_logo.py).
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { studioEnvironment, glassMaterials, activeMaterials } from '/src/tiles/materials.js';
import { floorMaterial, floorUniforms } from '/src/tiles/floor-material.js';
import { buildComposer } from '/src/tiles/post.js';

const RAW = await fetch('/tiles/floor-params.json').then((r) => r.json());
const opt = Object.assign({ look: 'cobalt', elev: 40, size: 1.6, transparent: false, depth: 1, inset: 0, spin: 0, coreDepth: 1, accentPath: -1 }, window.PARAMS);
const P = Object.assign({ W: 1920, H: 1080 }, RAW, RAW.states?.default ?? {}, { actHeadGlow: 0 }, opt.transparent ? { filmGrain: 0 } : {});

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

const floorGlowOff = () => { const U = floorUniforms(P, { glowX: 0, glowZ: 0, half: 0.5 }); U.uGlowS.value = U.uGlowTint.value = 0; return U; };
const floor = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), floorMaterial(P, floorGlowOff()));
floor.rotation.x = -Math.PI / 2;
if (!opt.transparent) scene.add(floor);

// Blades: every path of the mark, extruded to the tile's thickness with the tile's bevel, UVs spanning the
// whole mark so the glass textures (gradient, frost) lie across it the way they lie across one tile.
const svg = new SVGLoader().parse(await fetch('/brand/sixlabs-mark.svg').then((r) => r.text()));
const [vx, vy, vw, vh] = svg.xml.getAttribute('viewBox').split(/\s+/).map(Number);
const k = opt.size / vw, cx = vx + vw / 2, cy = vy + vh / 2, span = Math.max(vw, vh) * k; // UV square: the tile textures are square
const logo = new THREE.Group();
// The accent blade: the same cobalt glass, its colours lifted to the site accent (#1a6dff).
const PX = Object.assign({}, P, {
  actLightCol: '#4d8dff', actDarkCol: '#1a6dff', actSheenCol: '#5b97ff', actUnderCol: '#1a5ee6', actRim: '#1a5ee6',
  actSide: '#8ab4ff', actSideDark: '#1a5ee6', actSideLight: '#4d8dff',
});
svg.paths.forEach((path, pi) => {
  const navy = path.color.getHexString() === '030d2d', depth = P.core * opt.depth * (navy ? opt.coreDepth : 1);
  for (const shape of path.toShapes(true)) {
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: depth / k, bevelEnabled: true, bevelThickness: P.bevelT / k, bevelSize: P.bevel / k, bevelOffset: navy ? 0 : -opt.inset, bevelSegments: 6, curveSegments: 24,
    });
    g.translate(-cx, -cy, 0);
    g.scale(k, k, k);
    // Lie flat with the SVG's first face on top: SVG down becomes toward the camera, so the mark reads
    // upright, and nothing is mirrored (a mirror would turn every face inside out).
    g.rotateX(Math.PI / 2);
    g.translate(0, depth + P.bevelT, 0);
    const pos = g.attributes.position, uv = g.attributes.uv;
    for (let n = 0; n < pos.count; n++) uv.setXY(n, pos.getX(n) / span + 0.5, 0.5 - pos.getZ(n) / span);
    const beamU = { uBeam: { value: 2 }, uBeamI: { value: 0 }, uFlare: { value: 0 }, uBackRim: { value: 0 }, uShine: { value: new THREE.Color(0) }, uHotF: { value: new THREE.Color(0) }, uHotR: { value: new THREE.Color(0) } };
    const rearEnv = studioEnvironment(renderer, P, { leftStrip: false, strip: P.actEnvStrip });
    let mats;
    if (navy && opt.look !== 'clear') { // the clear look keeps the core in the same white glass
      const dark = new THREE.MeshPhysicalMaterial({ color: '#030d2d', roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.2 });
      mats = [dark, dark];
    } else mats = opt.look === 'clear' ? glassMaterials(P, { leftBand: false }) : activeMaterials(pi === opt.accentPath ? PX : P, rearEnv, beamU);
    logo.add(new THREE.Mesh(g, mats));
  }
});
if (opt.look === 'cobalt') logo.position.y = 0.0005;
// Turn the mark to face the camera, which sits on the floor's own azimuth.
const az = THREE.MathUtils.degToRad(P.azim);
const pivot = new THREE.Group();
pivot.rotation.y = az;
logo.rotation.y = THREE.MathUtils.degToRad(-opt.spin); // clockwise as seen from above
pivot.add(logo);
scene.add(pivot);
logo.visible = !opt.bareFloor; // bareFloor: the floor alone, for a difference matte

const el = THREE.MathUtils.degToRad(opt.elev), d = opt.size * 1.5 / Math.tan(THREE.MathUtils.degToRad(P.fov / 2)) / 2;
const camera = new THREE.PerspectiveCamera(P.fov, w / h, 0.1, 400);
camera.position.set(d * Math.cos(el) * Math.sin(az), d * Math.sin(el), d * Math.cos(el) * Math.cos(az));
camera.lookAt(0, P.core / 2, 0);
if (!opt.transparent) scene.fog = new THREE.Fog(P.fogColor, d + P.fogNear, d + P.fogFar);

const composer = buildComposer(renderer, scene, camera, P);
composer.setPixelRatio(devicePixelRatio);
composer.setSize(w, h);
await renderer.compileAsync(scene, camera);
composer.render();
const top = P.core * opt.depth + P.bevelT, hs = span / 2, dpr = devicePixelRatio;
const corners = [[-hs, -hs], [hs, -hs], [hs, hs], [-hs, hs]].map(([x, z]) => {
  const v = pivot.localToWorld(new THREE.Vector3(x, top, z)).project(camera);
  return [(v.x + 1) / 2 * w * dpr, (1 - v.y) / 2 * h * dpr];
});
window.__info = { look: opt.look, elev: opt.elev, corners };
window.__done = true;
