// Auto-play for the live floor. Once the tiles are in, the character tiles on screen focus and activate
// one at a time by themselves: first one near the middle of the screen, then the rest in random order,
// each settling back in (spent) before the next starts. When every one on screen is spent, a wave runs
// left to right across the screen: each spent tile flips over like a card, about the axis through its
// centre parallel to its top-right edge, and lands as a clear default tile with its human back. Then the
// cycle starts again. Each wave also swaps the tiles to the other cast of characters (cast, floor.js). The visitor always wins: pointing at a live tile pauses the auto-play (a clicked
// tile still finishes), and it resumes RESUME_MS after the pointer leaves the tiles. reset() sends the wave
// at once over every character tile on screen, activated or not, and restarts the cycle from the middle.
import * as THREE from 'three';

const RESUME_MS = 3000, FOCUS_MS = 380, GAP_MS = 220, MIN_SHOWN = 0.4;

// Polygon area (shoelace) and clipping to the screen square [-1, 1] (Sutherland-Hodgman).
const area = (p) => Math.abs(p.reduce((s, [x, y], k) => { const [u, w] = p[(k + 1) % p.length]; return s + x * w - u * y; }, 0)) / 2;
function clip(poly) {
  const edges = [[0, -1, 1], [0, 1, -1], [1, -1, 1], [1, 1, -1]]; // axis, bound, side: keep side * (c - bound) >= 0
  for (const [ax, bound, side] of edges) {
    const inside = (p) => side * (p[ax] - bound) >= 0, out = [];
    poly.forEach((p, k) => {
      const q = poly[(k + 1) % poly.length], pi = inside(p), qi = inside(q);
      if (pi) out.push(p);
      if (pi !== qi) { const t = (bound - p[ax]) / (q[ax] - p[ax]); out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); }
    });
    poly = out;
    if (!poly.length) break;
  }
  return poly;
}
const WAVE_SPREAD = 1.3, FLIP_SECONDS = 0.75; // stagger across the screen, one tile's flip
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function startAutoplay({ ctl, camera, chars, flipTile, composer, refiner, cast, half }) {
  let stopped = false, paused = false, resumeTimer = 0, first = true, resetReq = false, waving = false;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const until = async (ok) => { while (!stopped && !ok()) await wait(60); };
  const cellOf = (key) => key.split(',').map(Number);

  // The character tiles that count as on screen: at least MIN_SHOWN of the tile's top face inside the view
  // (its projected outline clipped to the screen, by area). x, y: the centre, in normalised device coords.
  const v = new THREE.Vector3();
  const project = (x, y, z) => { v.set(x, y, z).project(camera); return [v.x, v.y]; };
  const onScreen = () => [...chars.entries()].map(([key, ch]) => {
    const [x, y, z] = ch.at, quad = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => project(x + a * half, y, z + b * half));
    const [sx, sy] = project(x, y, z);
    return { key, x: sx, y: sy, shown: area(clip(quad)) / Math.max(1e-9, area(quad)) };
  }).filter((t) => t.shown >= MIN_SHOWN);

  ctl.onUser = (active) => {
    clearTimeout(resumeTimer);
    if (active) paused = true;
    else resumeTimer = setTimeout(() => { paused = false; }, RESUME_MS);
  };

  async function wave(all = false) {
    const tiles = onScreen().filter((t) => all || ctl.spent.has(t.key));
    for (const key of ctl.spent) if (!tiles.some((t) => t.key === key)) ctl.unspend(key); // off screen: reset quietly
    if (!tiles.length) return;
    ctl.inert = true;
    waving = true;
    const x0 = Math.min(...tiles.map((t) => t.x)), span = Math.max(1e-3, Math.max(...tiles.map((t) => t.x)) - x0);
    const swapped = new Set(), target = cast.next();
    refiner.moving();
    await new Promise((resolve) => {
      let start = 0;
      const frame = (now) => {
        if (stopped) return resolve();
        start ||= now;
        const s = (now - start) / 1000;
        let busy = false;
        for (const t of tiles) {
          const p = Math.min(1, Math.max(0, (s - ((t.x - x0) / span) * WAVE_SPREAD) / FLIP_SECONDS));
          const a = Math.PI * ease(p);
          // Edge-on, the far side comes up: swap to the default look and turn on from the other side.
          if (a >= Math.PI / 2 && !swapped.has(t.key)) { // (unspend also clears any tint)
            swapped.add(t.key);
            ctl.unspend(t.key);
            const ch = chars.get(t.key);
            ch.converted = false;
            ch.setScan(0);
            cast.show(t.key, target);
          }
          flipTile(t.key, p >= 1 ? null : a < Math.PI / 2 ? a : a - Math.PI);
          if (p < 1) busy = true;
        }
        refiner.moving();
        composer.render();
        if (busy) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });
    cast.done(target);
    refiner.start();
    waving = false;
    ctl.inert = false;
    first = true;
  }

  (async () => {
    while (!stopped) {
      if (resetReq) {
        resetReq = false;
        ctl.clearAll();
        await wave(true);
        await wait(GAP_MS);
        continue;
      }
      const todo = onScreen().filter((t) => !ctl.spent.has(t.key));
      if (!todo.length) {
        await until(() => !ctl.busy() || resetReq);
        if (!stopped && !resetReq) await wave();
        await wait(GAP_MS);
        continue;
      }
      if (paused || ctl.busy()) { await wait(120); continue; }
      const next = first
        ? todo.reduce((a, b) => (Math.hypot(a.x, a.y) <= Math.hypot(b.x, b.y) ? a : b)) // nearest the middle
        : todo[Math.floor(Math.random() * todo.length)];
      first = false;
      const cell = cellOf(next.key);
      ctl.hover(cell);
      await wait(FOCUS_MS);
      if (stopped) break;
      if (paused || resetReq) continue; // the visitor took over before the click
      ctl.click(cell);
      await until(() => !ctl.busy() || resetReq);
      await wait(GAP_MS);
    }
  })();

  return {
    stop: () => { stopped = true; clearTimeout(resumeTimer); ctl.onUser = null; },
    reset: () => { if (!waving) resetReq = true; },
  };
}
