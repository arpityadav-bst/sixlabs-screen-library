// Auto-play for the live floor. Once the tiles are in, the character tiles on screen focus and activate
// one at a time by themselves: first one near the middle of the screen, then the rest in random order,
// each settling back in (spent) before the next starts. When every one on screen is spent, a wave runs
// left to right across the screen: each spent tile flips over like a card, about the axis through its
// centre parallel to its top-right edge, and lands as a clear default tile with its human back. Then the
// cycle starts again. Each wave also swaps the tiles to the other cast of characters (cast, floor.js). The visitor always wins: pointing at a live tile pauses the auto-play (a clicked
// tile still finishes), and it resumes RESUME_MS after the pointer leaves the tiles. reset() sends the wave
// at once over every character tile on screen, activated or not, and restarts the cycle from the middle.
import * as THREE from 'three';

const RESUME_MS = 3000, FOCUS_MS = 380, GAP_MS = 220;
const WAVE_SPREAD = 1.3, FLIP_SECONDS = 0.75; // stagger across the screen, one tile's flip
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function startAutoplay({ ctl, camera, chars, flipTile, composer, refiner, cast }) {
  let stopped = false, paused = false, resumeTimer = 0, first = true, resetReq = false, waving = false;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const until = async (ok) => { while (!stopped && !ok()) await wait(60); };
  const cellOf = (key) => key.split(',').map(Number);

  // Screen position (normalised device coordinates) of each character tile's centre.
  const v = new THREE.Vector3();
  const onScreen = () => [...chars.entries()].map(([key, ch]) => {
    v.set(...ch.at).project(camera);
    return { key, x: v.x, y: v.y };
  }).filter((t) => Math.abs(t.x) < 0.96 && Math.abs(t.y) < 0.96);

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
