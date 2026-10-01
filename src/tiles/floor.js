// Deterministic glass tile floor for the SixLabs hero. Geometry is exact by construction:
// one shared square grid, identical tiles, uniform gaps, straight rows to every frame edge.
// All look settings come from floor-params.json (served from `base`), or `params` when given.
//
// Tile states: default (glass, human), focused (raised, states.default), activated (glowing, states.shine).
// A static render (isStatic, used by the headless renderer) shows the tile at activeAt in actState. The
// live floor starts with every tile in the default state and is interactive.
import * as THREE from 'three';
import { studioEnvironment, glassMaterials } from './materials.js';
import { nearShadeUniforms, applyNearShade } from './near-shade.js';
import { floorMaterial, floorUniforms } from './floor-material.js';
import { buildComposer, createRefiner } from './post.js';
import { addCharacters } from './characters.js';
import { planLoad } from './load-plan.js';
import { idleUploader } from './upload.js';
import { governFloor } from './governor.js';
import { createCasts } from './casts.js';
import { createFocusRig } from './focus-rig.js';
import { startInteraction } from './interact.js';
import { placeCamera, coverage, onSomeScreen, shownShare, lowerView } from './viewport.js';
import { tileGeometry } from './geometry.js';
import { playIntro } from './intro.js';
import { startAutoplay } from './autoplay.js';

// distScale pulls the camera back (smaller tiles, more of them: the grid is built to what it sees); mixWaves
// casts the second wave's characters on the middle tiles and the first wave's around them (casts.js).
export async function createFloor(container, { params, base = '/tiles', aiBase = base, res = 768, isStatic = false, expose = false, introDelay = 0, onConvert = () => {}, distScale = 1, mixWaves = false, spentTint = '' } = {}) {
  const RAW0 = params ?? await fetch(`${base}/floor-params.json`).then((r) => r.json());
  const RAW = distScale === 1 ? RAW0 : { ...RAW0, dist: RAW0.dist * distScale };
  const common = Object.assign({ W: 1920, H: 1080, assetBase: base, aiAssetBase: aiBase, picDir: res === 768 ? '' : `/${res}` }, RAW, spentTint && { spentTint }); // aiBase: where chars-ai/ is read from (the hologram copies live in /tiles-holo)
  const PF = Object.assign({}, common, RAW.states?.default ?? {}), PA = Object.assign({}, common, RAW.states?.shine ?? {});
  const P = PF;

  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = P.exposure;
  Object.assign(renderer.domElement.style, { display: 'block', width: '100%', height: '100%' });
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(P.fogColor);
  scene.environment = studioEnvironment(renderer, P);
  scene.environmentIntensity = P.envI;
  scene.fog = new THREE.Fog(P.fogColor, P.dist + P.fogNear, P.dist + P.fogFar);

  // Camera on a fixed orbit around the floor origin, laid out at the 16:9 design frame (P.W x P.H).
  const camera = new THREE.PerspectiveCamera(P.fov, P.W / P.H, 0.1, 400);
  placeCamera(camera, P, P.W / P.H);
  const az = THREE.MathUtils.degToRad(P.azim);
  const toCam = new THREE.Vector2(Math.sin(az), Math.cos(az)); // floor direction toward the camera

  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const floorAt = (sx, sy) => {
    const rc = new THREE.Raycaster(), p = new THREE.Vector3();
    rc.setFromCamera(new THREE.Vector2(sx * 2 - 1, 1 - sy * 2), camera);
    rc.ray.intersectPlane(floorPlane, p);
    return p;
  };
  const toScreen = (x, z) => { const v = new THREE.Vector3(x, 0, z).project(camera); return [(v.x + 1) / 2 * P.W, (1 - v.y) / 2 * P.H]; };

  // Grid: tile (i, j) is centred at (ox + i * pitch, oz + j * pitch). The field is the half-plane i >= 0,
  // so its only inner boundary is one straight grid line. It covers the floor under every supported
  // screen shape, not just the design frame.
  const pitch = P.tile + P.gap, half = P.tile / 2;
  const x0 = floorAt(P.bandBottomX, 1).x; // the field's one inner edge passes exactly through this bottom point
  const ox = x0 + half, oz = P.gridShiftZ * pitch;
  const cx = (i) => ox + i * pitch, cz = (j) => oz + j * pitch;
  const corners = coverage(camera, P), xs = corners.map((p) => p.x), zs = corners.map((p) => p.z);
  const iMax = Math.ceil((Math.max(...xs) - ox) / pitch) + 2;
  const jMin = Math.floor((Math.min(...zs) - oz) / pitch) - 2, jMax = Math.ceil((Math.max(...zs) - oz) / pitch) + 2;
  const pa = floorAt(...P.activeAt);
  const ia = Math.max(1, Math.round((pa.x - ox) / pitch)), ja = Math.round((pa.z - oz) / pitch);
  const ax = cx(ia), azz = cz(ja);

  const geo = tileGeometry(P, half);
  const tileH = P.core + P.bevelT; // visible height above the floor

  // Floor: the blue pool follows whichever tile is raised (the rig moves it and sets its strength).
  const U = floorUniforms(P, { glowX: ax, glowZ: azz, half });
  U.uGlowS.value = U.uGlowTint.value = 0;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), floorMaterial(P, U));
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Glass tiles, instanced, one per cell. The first column gets its own material: its left edge faces the
  // empty floor, so it carries no seen-through shadow band on that side. The raised tile hides its cell.
  // Tiles and busts share one group, so the load-in (intro.js) can raise them together.
  const field = new THREE.Group();
  scene.add(field);
  const cells = [];
  for (let i = 0; i <= iMax; i++) for (let j = jMin; j <= jMax; j++) cells.push([i, j]);
  // Characters go on every tile whose bust would be on screen (the tile's centre, inside the frame plus a
  // margin) at any supported screen shape.
  const inDesign = ([i, j]) => { const v = new THREE.Vector3(cx(i), tileH, cz(j)).project(camera); return Math.abs(v.x) < 1.12 && Math.abs(v.y) < 1.2; };
  const busted = cells.filter(([i, j]) => inDesign([i, j]) || onSomeScreen(camera, P, new THREE.Vector3(cx(i), tileH, cz(j))));
  // Casting order (characters.js): by how much of each tile this screen shows, most first, so every
  // character lands on a well-visible tile before any repeats, and repeats go to the most cut-off tiles.
  const nowCam = camera.clone();
  placeCamera(nowCam, P, Math.max(1, container.clientWidth) / Math.max(1, container.clientHeight));
  const bustTiles = busted.map(([i, j]) => (
    { i, j, x: cx(i), y: tileH, z: cz(j), active: i === ia && j === ja, screen: toScreen(cx(i), cz(j)), ...(({ x, y, shown }) => ({ shown, mid: Math.hypot(x, y) }))(shownShare(nowCam, cx(i), tileH, cz(j), half)) }));
  // The first cast's pictures, in the order they are needed (load-plan.js); started here, ahead of building
  // the materials, so they download while those are made. warm puts each late one on the GPU in idle time.
  const { cast: cast0, pictures, wait } = planLoad(P, bustTiles, isStatic);
  const warm = idleUploader(renderer, () => !renderer.domElement.isConnected);
  // Every tile carries an instance colour from the start (white = untouched), so tinting one later is a
  // buffer update, not a shader recompile.
  const m4 = new THREE.Matrix4(), slot = new Map(), WHITE = new THREE.Color('#ffffff'), SPENT = new THREE.Color(P.spentTint ?? '#b8bbc1');
  const addTiles = (list, materials) => {
    const mesh = new THREE.InstancedMesh(geo, materials, list.length);
    list.forEach(([i, j], k) => { mesh.setMatrixAt(k, m4.makeTranslation(cx(i), 0, cz(j))); mesh.setColorAt(k, WHITE); slot.set(`${i},${j}`, [mesh, k]); });
    field.add(mesh);
  };
  // Raises one glass tile (it rides up under the cobalt slab) or hides it once the slab covers it.
  const setTileLift = (i, j, y, hidden) => {
    const [mesh, k] = slot.get(`${i},${j}`);
    mesh.setMatrixAt(k, hidden ? m4.makeScale(0, 0, 0) : m4.makeTranslation(cx(i), y, cz(j)));
    mesh.instanceMatrix.needsUpdate = true;
  };
  // A spent tile (activated once, back in the floor) keeps a slight charcoal tint.
  const tint = (key, spent) => {
    const [mesh, k] = slot.get(key);
    mesh.setColorAt(k, spent ? SPENT : WHITE);
    mesh.instanceColor.needsUpdate = true;
  };
  // Card flip for the reset wave (autoplay.js): turns tile `key` by angle a about the axis through its centre
  // parallel to its top-right edge (world x), in place (no lift: the half turning downward passes into the
// floor); its busts turn with it.
  // a = null puts it back.
  const flipM = new THREE.Matrix4(), fm = new THREE.Matrix4(), bustBase = new Map();
  const flipTile = (key, a) => {
    const [i, j] = key.split(',').map(Number), [mesh, k] = slot.get(key), busts = chars.get(key)?.meshes ?? [];
    if (a === null) {
      mesh.setMatrixAt(k, m4.makeTranslation(cx(i), 0, cz(j)));
      busts.forEach((m) => { m.matrixAutoUpdate = true; });
    } else {
      const hc = tileH / 2;
      flipM.makeTranslation(cx(i), hc, cz(j)).multiply(fm.makeRotationX(a)).multiply(fm.makeTranslation(-cx(i), -hc, -cz(j)));
      mesh.setMatrixAt(k, m4.copy(flipM).multiply(fm.makeTranslation(cx(i), 0, cz(j))));
      busts.forEach((m) => {
        if (m.matrixAutoUpdate) { m.updateMatrix(); bustBase.set(m, m.matrix.clone()); m.matrixAutoUpdate = false; }
        m.matrix.multiplyMatrices(flipM, bustBase.get(m));
      });
    }
    mesh.instanceMatrix.needsUpdate = true;
  };
  // Neighbour tops take the raised tile's contact shadow and blue spill (the rig sets their strength).
  const nearU = nearShadeUniforms(P, { x: ax, z: azz, half });
  nearU.uShadowAmt.value = nearU.uSpillAmt.value = 0;
  const shaded = (mats) => { mats.forEach((mat) => applyNearShade(mat, nearU)); return mats; }; // tops and rims
  addTiles(cells.filter(([i]) => i === 0), shaded(glassMaterials(P, { leftBand: false })));
  addTiles(cells.filter(([i]) => i > 0), shaded(glassMaterials(P)));

  // Side-wall reflection for the raised tile: one cube map, captured once (below) and shared by both
  // rigs. Re-shooting it on every hover froze the GPU for up to seconds; it is a soft reflection of the
  // same floor, so one capture reads the same on any tile.
  const mirrorRT = new THREE.WebGLCubeRenderTarget(512, { type: THREE.HalfFloatType });
  const mirrorCam = new THREE.CubeCamera(0.01, 60, mirrorRT);
  // Two rigs, so one tile can settle back down while the next one rises.
  const rigs = [0, 1].map(() => createFocusRig({ renderer, scene, PF, PA, geo, tileH, cx, cz, toCam, setTileLift, mirror: mirrorRT.texture }));

  scene.add(new THREE.HemisphereLight('#ffffff', P.hemiGround, P.hemi));
  const key = new THREE.DirectionalLight('#ffffff', P.dir);
  key.position.set(-4, 10, -7);
  scene.add(key);

  const chars = await addCharacters(field, P, bustTiles, pictures, cast0, wait, warm);

  // Capture the reflection from the activeAt tile, with that tile and its busts out of the way.
  if (P.actSideMirror > 0) {
    const own = chars.get(`${ia},${ja}`)?.meshes ?? [];
    mirrorCam.position.set(ax, P.lift + tileH / 2, azz);
    setTileLift(ia, ja, 0, true);
    own.forEach((m) => { m.visible = false; });
    mirrorCam.update(renderer, scene);
    own.forEach((m) => { m.visible = true; });
    setTileLift(ia, ja, 0, false);
  }

  if (isStatic) {
    const rig = rigs[0], act = RAW.actState === 'shine' ? 1 : 0;
    rig.setCell(ia, ja);
    Object.assign(rig.state, { L: 1, S: RAW.staticS ?? act * 0.9, F: RAW.staticF ?? act }); // staticS: seconds into the activation
    rig.apply();
    rig.drive(U, nearU);
    chars.get(`${ia},${ja}`)?.setLift(P.lift);
    chars.get(`${ia},${ja}`)?.setScan(RAW.staticScan ?? rig.values().convert * act); // 0 human, 1 AI copy
  }

  // The canvas fills its container; its buffer matches the displayed size exactly, so the browser never
  // rescales it. The camera reframes for the container's shape (viewport.js).
  const composer = buildComposer(renderer, scene, camera, P);
  const refiner = isStatic ? null : createRefiner(composer);

  // Shader warm-up: compile every material up front, in parallel where the GPU driver allows, including
  // the raised-tile parts that start hidden. It compiles against a render target because the effects
  // pipeline and the reflection camera both draw into one, and those need their own shader versions.
  // Without this the first hover and first click each froze for a second or more while compiling.
  const warmTarget = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType });
  rigs.forEach((r) => r.preview(true));
  renderer.setRenderTarget(warmTarget);
  await renderer.compileAsync(scene, camera);
  renderer.setRenderTarget(null);
  rigs.forEach((r) => r.preview(false));
  warmTarget.dispose();

  // Live: a one-sample frame straight away, then progressive smoothing (post.js). Static renders take
  // the full supersampled frame in one go. Resizes re-run it; an unchanged size is skipped (the
  // observer also fires once when it starts).
  let size = '', clearTop = 0, tops = null, gov = null; // gov: the live floor's resolution (governor.js)
  const draw = (force = false) => {
    const w = Math.max(1, container.clientWidth), h = Math.max(1, container.clientHeight);
    if (`${w}x${h}` === size && !force) return;
    size = `${w}x${h}`;
    placeCamera(camera, P, w / h, scene.fog);
    // clearTop (setClearTop, a phone's copy above the floor): the view lowers until the field's highest tile
    // sits that many px down, the floor's own ground filling the space above it (viewport.js)
    if (clearTop) {
      tops ??= cells.flatMap(([i, j]) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => new THREE.Vector3(cx(i) + a * half, tileH, cz(j) + b * half)));
      lowerView(camera, tops, h, clearTop);
    }
    renderer.setPixelRatio(gov?.ratio ?? window.devicePixelRatio);
    renderer.setSize(w, h, false);
    composer.setPixelRatio(gov?.ratio ?? window.devicePixelRatio);
    composer.setSize(w, h);
    refiner?.resized();
    refiner?.moving();
    composer.render();
    refiner?.start();
  };
  if (!isStatic) gov = governFloor(renderer, composer, () => draw(true)); // steps down on a slow GPU
  // Rehearsal: one frame with a tile raised mid-activation (reflection, glow, spill all live), so any
  // first-use GPU work happens now rather than on the first hover. It is overwritten before it is shown.
  if (!isStatic) {
    const rig = rigs[0];
    rig.setCell(ia, ja);
    Object.assign(rig.state, { L: 1, S: 0.5, F: 1 });
    rig.apply();
    rig.drive(U, nearU);
    draw(true);
    refiner.stop();
    rig.clear();
    nearU.uShadowAmt.value = nearU.uSpillAmt.value = 0;
    U.uGlowS.value = U.uGlowTint.value = 0;
  }
  draw(true);
  // Live: the tiles fade in and rise out of the floor; a resize mid-way snaps them into place.
  const intro = isStatic ? null : playIntro({ renderer, composer, refiner, field, rise: tileH, delay: introDelay });
  const resize = new ResizeObserver(() => { const w = `${Math.max(1, container.clientWidth)}x${Math.max(1, container.clientHeight)}`; if (w !== size) intro?.cancel(); draw(); });
  resize.observe(container);

  // Picks the tile under a ray: where it meets the tile tops, rounded to the nearest cell, inside the tile.
  const topPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -tileH), hit = new THREE.Vector3();
  const cellAt = (ray) => {
    if (!ray.intersectPlane(topPlane, hit)) return null;
    const i = Math.round((hit.x - ox) / pitch), j = Math.round((hit.z - oz) / pitch);
    return Math.abs(hit.x - cx(i)) < half && Math.abs(hit.z - cz(j)) < half && slot.has(`${i},${j}`) ? [i, j] : null;
  };
  let stop = () => {}, reset = () => {}, disposed = false;
  if (!isStatic) intro.done.then(() => {
    if (disposed) return;
    const ctl = startInteraction({ renderer, camera, composer, refiner, rigs, chars, cellAt, tint, floorU: U, nearU, P, expose, onConvert });
    const cast = createCasts({ P, renderer, chars, bustTiles, pictures: pictures.get, gone: () => disposed, mixWaves, warm });
    const auto = startAutoplay({ ctl, camera, chars, flipTile, composer, refiner, cast, half });
    // Off screen (scrolled past) or in a hidden tab, the auto-play holds, so the floor draws nothing
    // while the visitor is elsewhere on the page; it carries on when they come back.
    let onScreen = true;
    const sync = () => auto.hold(!onScreen || document.hidden);
    const seen = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); });
    seen.observe(container);
    document.addEventListener('visibilitychange', sync);
    stop = () => { auto.stop(); ctl.stop(); seen.disconnect(); document.removeEventListener('visibilitychange', sync); };
    reset = auto.reset;
  });

  window.__floorReady = true;
  if (expose) {
    window.__info = { characterTiles: busted.length, active: [ia, ja], activeScreen: toScreen(ax, azz).map(Math.round) };
    window.__done = true;
  }

  return {
    reset: () => reset(), // the reset wave, on demand (autoplay.js)
    setClearTop: (px) => { if (px === clearTop) return; clearTop = px; draw(true); },
    dispose() {
      disposed = true;
      resize.disconnect();
      intro?.cancel();
      stop();
      refiner?.stop();
      mirrorRT.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
