// Live interaction.
//   hover a tile      : default -> focused (it rises and turns cobalt, smoothly, in one motion)
//   click it          : focused -> activated (a rim beam runs from the front corner to both side corners,
//                       the tile brightens, its shadows turn blue, the human becomes their AI copy)
//                       Once clicked, the tile plays its whole activation whatever the pointer does, then
//                       settles back into the grid on its own, keeps a slight charcoal tint and no
//                       longer reacts to the pointer (spent).
//   move away         : focused -> back down into the grid, the same smooth motion reversed
//   R                 : every character back to human, every spent tile live again
// Every value eases toward its target with an exponential ease-out, so any change can interrupt any
// other smoothly. Two rigs let one tile settle while the next one rises. Frames render at one sample
// while anything moves, then sharpen progressively once the scene comes to rest (post.js).
import * as THREE from 'three';
import { ACT_SECONDS, DEACT_SECONDS, COMMIT_SECONDS } from './sweep.js';

// Returns a stop() that detaches every listener and halts pending frames (for unmounting).
export function startInteraction({ renderer, camera, composer, refiner, rigs, chars, cellAt, tint, floorU, nearU, P, expose = false }) {
  // fl: linear fade, eased into state.F. locked: clicked, so the activation runs to its end regardless.
  const T = rigs.map((rig) => ({ rig, tL: 0, tA: 0, fl: 0, leaving: false, locked: false }));
  const spent = new Set(); // "i,j" of tiles that have been activated
  const done = (s) => s.rig.state.S >= ACT_SECONDS && s.fl >= 1;
  // The pointer has left this tile: past the commit point the activation finishes first (leaving), else
  // it reverts now. Either way the tile ends back down in the grid as a default tile.
  const release = (s) => {
    if (s.locked) return;
    if (s.tA === 1 && s.rig.state.S >= COMMIT_SECONDS && !done(s)) s.leaving = true;
    else { s.tA = 0; s.tL = 0; s.leaving = false; }
  };
  let last = 0, running = false;

  const settleTo = (v, t, dt, tau) => { const n = t + (v - t) * Math.exp(-dt / tau); return Math.abs(n - t) < 0.001 ? t : n; };

  let stopped = false;
  function frame(now) {
    if (stopped) return;
    // P.animSpeed plays every stage faster (rise, sweep, fade, sink) with the same easing and timeline.
    const dt = Math.min(0.05, (now - (last || now)) / 1000) * (P.animSpeed ?? 1);
    last = now;
    let moving = false;
    for (const s of T) {
      const st = s.rig.state;
      if (!st.cell) continue;
      if (s.leaving && done(s)) { s.leaving = false; s.tA = 0; s.tL = 0; } // finished: now go back down
      if (s.locked && done(s)) { // finished: tint now, so the glass tile rides back down already charcoal
        s.locked = false; s.tA = 0; s.tL = 0; spent.add(st.cell.join(',')); tint(st.cell.join(','), true);
      }
      // order: rise before activating, and fade back to focused before sinking
      const activating = st.L > 0.9 && s.tA === 1;
      if (activating) {
        s.fl = Math.min(1, s.fl + dt / 0.08);
        st.S = Math.min(ACT_SECONDS, st.S + dt);
      } else {
        s.fl = Math.max(0, s.fl - dt / DEACT_SECONDS);
        if (s.fl === 0) st.S = 0;
      }
      st.F = s.fl * s.fl * (3 - 2 * s.fl);
      const wantL = s.tL === 0 && s.fl > 0 ? 1 : s.tL; // after the fade update, so the sink starts the frame it ends
      st.L = settleTo(st.L, wantL, dt, P.riseTau);
      const ch = chars.get(st.cell.join(','));
      if (ch) {
        ch.setLift(P.lift * st.L);
        if (st.S >= ACT_SECONDS && st.F > 0.99) ch.converted = true;
        ch.setScan(ch.converted ? 1 : s.rig.values().convert * st.F);
      }
      if (st.L === 0 && s.tL === 0) {
        s.rig.clear(); s.fl = 0; continue;
      }
      s.rig.apply();
      if (st.L !== wantL || s.leaving || s.locked || (activating ? !done(s) : s.fl > 0)) moving = true;
    }
    // the highest tile drives the shared floor pool and neighbour shadows
    const lead = T.filter((s) => s.rig.state.cell).sort((a, b) => b.rig.state.L - a.rig.state.L)[0];
    if (lead) lead.rig.drive(floorU, nearU);
    else { nearU.uShadowAmt.value = nearU.uSpillAmt.value = 0; floorU.uGlowS.value = floorU.uGlowTint.value = 0; }

    refiner.moving();
    composer.render();
    running = moving;
    if (running) requestAnimationFrame(frame);
    else { last = 0; refiner.start(); } // at rest: sharpen progressively
  }
  const kick = () => { if (!running) { running = true; requestAnimationFrame(frame); } };

  function hover(cell) {
    const key = cell?.join(',');
    let target = key && T.find((s) => s.rig.state.cell?.join(',') === key);
    for (const s of T) if (s !== target) release(s);
    if (key && !target) {
      target = T.find((s) => !s.rig.state.cell) ?? T.filter((s) => !s.locked).sort((a, b) => a.rig.state.L - b.rig.state.L)[0];
      if (!target) return; // both rigs busy with clicked tiles
      const was = target.rig.state.cell?.join(',');
      if (was) { chars.get(was)?.setLift(0); target.rig.clear(); }
      Object.assign(target, { fl: 0, tA: 0, leaving: false });
      target.rig.setCell(...cell);
    }
    if (target) { target.tL = 1; target.leaving = false; }
    kick();
  }

  const canvas = renderer.domElement;
  const ndc = new THREE.Vector2(), rc = new THREE.Raycaster();
  let hovered = null;
  const pick = (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, 1 - ((e.clientY - r.top) / r.height) * 2);
    rc.setFromCamera(ndc, camera);
    const cell = cellAt(rc.ray);
    return cell && chars.has(cell.join(',')) && !spent.has(cell.join(',')) ? cell : null;
  };
  canvas.addEventListener('pointermove', (e) => {
    const c = pick(e);
    if (c?.join(',') !== hovered?.join(',')) { hovered = c; hover(c); }
  });
  canvas.addEventListener('pointerleave', () => { hovered = null; hover(null); });
  canvas.addEventListener('click', (e) => {
    const key = pick(e)?.join(','), s = key && T.find((t) => t.rig.state.cell?.join(',') === key);
    if (s) { s.tA = 1; s.locked = true; kick(); }
  });
  const onKey = (e) => {
    if (e.key.toLowerCase() !== 'r') return;
    chars.forEach((ch) => { ch.converted = false; ch.setScan(0); });
    spent.forEach((k) => tint(k, false));
    spent.clear();
    kick();
  };
  window.addEventListener('keydown', onKey);
  canvas.style.cursor = 'pointer';
  // read-only state probe for automated checks
  if (expose) window.__floorState = () => T.map((s) => ({ cell: s.rig.state.cell, L: +s.rig.state.L.toFixed(3), S: +s.rig.state.S.toFixed(2), fl: +s.fl.toFixed(2), tL: s.tL, tA: s.tA }));
  return () => { stopped = true; window.removeEventListener('keydown', onKey); };
}
