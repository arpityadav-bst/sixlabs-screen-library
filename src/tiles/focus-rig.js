// One raisable tile and everything it throws around it, movable to any cell.
//   L (rise, 0..1)          : default glass tile -> focused. The glass tile and a cobalt slab rise together
//                             while the slab fades in over the glass, so colour and height change as one.
//   S, F (see sweep.js)     : focused -> activated on the reference's timeline: the rim beam runs from
//                             the front corner, the brighter slab sweeps in front to back behind it, the
//                             shadows turn blue; on the way back everything fades out together.
// Focused look = params states.default, activated look = states.shine.
import * as THREE from 'three';
import { studioEnvironment, activeMaterials } from './materials.js';
import { glintBean, GLINT_SPAN } from './textures.js';
import { addSweep, sweepValues } from './sweep.js';
import { createHalo } from './halo.js';

const lerp = (a, b, t) => a + (b - a) * t;
const lerp4 = (a, b, t) => a.map((v, k) => lerp(v, b[k], t));
const col = (c, k) => new THREE.Color(c).multiplyScalar(k);

// mirror: the shared side-wall reflection (floor.js captures it once at startup).
export function createFocusRig({ renderer, scene, PF, PA, geo, tileH, cx, cz, toCam, setTileLift, mirror }) {
  const rearEnv = studioEnvironment(renderer, PF, { leftStrip: false, strip: PF.actEnvStrip });
  // The beam lives on both slabs with shared uniforms, so it reads the same whichever slab is showing.
  const beamU = {
    uBeam: { value: 2 }, uBeamI: { value: 0 }, uFlare: { value: 0 }, uBackRim: { value: PA.actBackRim },
    uShine: { value: col(PA.actShineCol, PA.actShine) }, uHotF: { value: col(PA.actHotCol, PA.actHotF) },
    uHotR: { value: col(PA.actHotCol, PA.actHotR) },
  };
  const sweepU = { uHead: { value: 2 }, uFade: { value: 0 }, uSoft: { value: PA.actSweepSoft } };
  const matsF = activeMaterials(PF, rearEnv, beamU), matsA = activeMaterials(PA, rearEnv, beamU);
  addSweep(matsA, sweepU, PA);
  const slabF = new THREE.Mesh(geo, matsF), slabA = new THREE.Mesh(geo, matsA);
  slabF.renderOrder = 1; slabA.renderOrder = 1.5;
  const glintGeo = new THREE.PlaneGeometry(2 * GLINT_SPAN, 2 * GLINT_SPAN);
  const glintOf = (Pm) => {
    const g = new THREE.Mesh(glintGeo, new THREE.MeshBasicMaterial({
      map: glintBean(Pm), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4,
    }));
    g.rotation.set(-Math.PI / 2, 0, Math.PI / 4); // bean bows toward the (-x, -z) corner, the rear one
    g.scale.set(PF.glintW, PF.glintW, 1);
    return g;
  };
  const glintF = glintOf(PF), glintA = glintOf(PA);
  glintF.renderOrder = 2; glintA.renderOrder = 2.5; // the slabs draw in the transparent pass; glints follow
  const glintOff = (PF.glintCrown - PF.glintTop * PF.glintW) * Math.SQRT1_2;
  const blue = new THREE.PointLight(PF.glowCol, 0, 2.6, 2);
  const halo = createHalo(PA, tileH);
  const parts = [slabF, slabA, glintF, glintA];
  scene.add(...parts, blue, halo.mesh);

  if (mirror && PF.actSideMirror > 0) {
    matsF[1].envMap = mirror;
    matsF[1].envMapIntensity = PF.actSideMirror;
    matsF[1].needsUpdate = true;
  }

  const st = { cell: null, L: 0, S: 0, F: 0 };
  const show = (on) => parts.forEach((m) => { m.visible = on; });
  show(false);
  const values = () => sweepValues(st.S, st.F);

  function apply() {
    if (!st.cell) return;
    const { L } = st, v = values(), [x, z] = [cx(st.cell[0]), cz(st.cell[1])], y = PF.lift * L;
    slabF.position.set(x, y, z); slabA.position.set(x, y, z);
    glintF.position.set(x - glintOff, y + tileH + 0.001, z - glintOff);
    glintA.position.copy(glintF.position);
    matsF.forEach((m) => { m.opacity = Math.min(1, L * 1.25); });
    sweepU.uHead.value = v.brightHead; sweepU.uFade.value = v.fade;
    beamU.uBeam.value = v.beamHead; beamU.uBeamI.value = v.fade; beamU.uFlare.value = v.flare;
    glintF.material.opacity = Math.min(1, L * 1.25) * (1 - v.amount);
    glintA.material.opacity = v.amount;
    setTileLift(...st.cell, y, L > 0.999); // the glass tile rides up under the slab, then hides once covered
    blue.position.set(x, 0.02, z);
    blue.intensity = lerp(PF.pointI, PA.pointI, v.amount) * L;
    halo.set(x, z, PA.haloAmt * v.fade * L, v.spillHead);
  }

  // Writes this tile's light into the shared floor and neighbour uniforms (only one tile drives them).
  function drive(floorU, nearU) {
    const { L } = st, v = values(), a = v.amount, [x, z] = [cx(st.cell[0]), cz(st.cell[1])], f = (k) => lerp(PF[k], PA[k], a);
    floorU.uGlowC.value.set(x + toCam.x * PF.glowShift, z + toCam.y * PF.glowShift);
    floorU.uGlowS.value = f('glowS') * L;
    floorU.uGlowTint.value = f('glowTint') * L;
    nearU.uNearC.value.set(x, z);
    nearU.uShadowAmt.value = f('nearShadow') * L;
    nearU.uShadowW.value = f('nearShadowW');
    nearU.uShadowDir.value.set(...lerp4(PF.nearShadowDir, PA.nearShadowDir, a));
    nearU.uShadowWDir.value.set(...lerp4(PF.nearShadowWDir, PA.nearShadowWDir, a));
    nearU.uSpillAmt.value = PA.nearSpill * v.fade * L;
    nearU.uSpillHead.value = v.spillHead;
    nearU.uSpillW.value = PA.nearSpillW;
    nearU.uSpillDir.value.set(...PA.nearSpillDir);
    nearU.uSpillCol.value.set(PA.nearSpillCol);
  }

  return {
    state: st, apply, drive, values,
    // Shows every part (at wherever it last was) so a shader warm-up compiles them; off again after.
    preview(on) {
      if (on) { show(true); halo.mesh.visible = true; return; }
      show(!!st.cell); // back to whatever this rig was showing before the warm-up
      if (st.cell) apply(); else halo.mesh.visible = false;
    },
    setCell(i, j) {
      if (st.cell) setTileLift(...st.cell, 0, false);
      Object.assign(st, { cell: [i, j], L: 0, S: 0, F: 0 });
      show(true);
      apply();
    },
    clear() {
      if (st.cell) setTileLift(...st.cell, 0, false);
      Object.assign(st, { cell: null, L: 0, S: 0, F: 0 });
      show(false);
      halo.set(0, 0, 0, -9);
      blue.intensity = 0;
    },
  };
}
