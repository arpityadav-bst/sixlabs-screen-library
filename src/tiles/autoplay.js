// Auto-play for the live floor. Once the tiles are in, the character tiles on screen focus and activate
// one at a time by themselves: first one near the middle of the screen, then the rest in random order,
// each settling back in (spent) before the next starts. When every one on screen is spent, a wave runs
// left to right across the screen: each spent tile flips over like a card, about the axis through its
// centre parallel to its top-right edge, and lands as a clear default tile with its human back. Then the
// cycle starts again. Each wave also swaps the tiles to the other cast of characters (cast, floor.js). The visitor always wins: pointing at a live tile pauses the auto-play (a clicked
// tile still finishes), and it resumes RESUME_MS after the pointer leaves the tiles. reset() sends the wave
// at once over every character tile on screen, activated or not, and restarts the cycle from the middle.
import { shownShare } from './viewport.js';

const RESUME_MS = 3000, FOCUS_MS = 380, GAP_MS = 220, MIN_SHOWN = 0.4, WAVE_SHOWN = 0.02;
const WAVE_SPREAD = 1.3, FLIP_SECONDS = 0.75; // stagger across the screen, one tile's flip
const PREPARE_AT = 0.7; // the share of the tiles on screen played when the next cast starts to load
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function startAutoplay({ ctl, camera, chars, flipTile, composer, refiner, cast, half }) {
  let stopped = false, paused = false, resumeTimer = 0, first = true, resetReq = false, waving = false;
  let held = false; // the floor is off screen or the tab hidden (floor.js): nothing is played, nothing drawn
  const waiters = []; // the wave button's calls waiting on their wave's start (reset)
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const until = async (ok) => { while (!stopped && !ok()) await wait(60); };
  const cellOf = (key) => key.split(',').map(Number);

  // The character tiles that count as on screen: at least MIN_SHOWN of the tile's top face inside the view
  // (its projected outline clipped to the screen, by area). x, y: the centre, in normalised device coords.
  // The wave also takes the barely visible tiles at the edges (WAVE_SHOWN), activated or not, so nothing
  // in view changes without flipping.
  const onScreen = (min = MIN_SHOWN) => [...chars.entries()].map(([key, ch]) => ({ key, ...shownShare(camera, ...ch.at, half) }))
    .filter((t) => t.shown >= min);

  ctl.onUser = (active) => {
    clearTimeout(resumeTimer);
    if (active) paused = true;
    else resumeTimer = setTimeout(() => { paused = false; }, RESUME_MS);
  };

  // onStart: called as the flip begins (after the other cast is ready), for the wave button's wait (reset)
  async function wave(all = false, onStart = () => {}) {
    await cast.prepare(); // the other cast, fetched now if it was not yet (casts.js); the tiles rest meanwhile
    if (resetReq) { // the wave button, pressed while this one waited: one wave over every tile, not two
      resetReq = false;
      all = true;
      ctl.clearAll();
      const started = waiters.splice(0), own = onStart;
      onStart = () => { own(); started.forEach((r) => r()); };
    }
    if (stopped) return onStart();
    const tiles = onScreen(WAVE_SHOWN).filter((t) => all || ctl.spent.has(t.key) || t.shown < MIN_SHOWN);
    for (const key of ctl.spent) if (!tiles.some((t) => t.key === key)) ctl.unspend(key); // off screen: reset quietly
    onStart();
    if (!tiles.length) return;
    ctl.inert = true;
    waving = true;
    if (window.__floorEvents) window.__floorEvents.wave = true; // ?perf's log marks the wave (website/perf.ts)
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
          // turned the other way round, so each tile rolls over in the wave's direction (left to right)
          flipTile(t.key, p >= 1 ? null : a < Math.PI / 2 ? -a : Math.PI - a);
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
    if (window.__floorEvents) window.__floorEvents.wave = false;
    ctl.inert = false;
    first = true;
  }

  (async () => {
    while (!stopped) {
      if (held || window.__benchHold) { await wait(250); continue; } // __benchHold: ?perf=bench measuring
      if (resetReq) {
        resetReq = false;
        ctl.clearAll();
        const started = waiters.splice(0);
        await wave(true, () => started.forEach((r) => r()));
        await wait(GAP_MS);
        continue;
      }
      const shownNow = onScreen(), todo = shownNow.filter((t) => !ctl.spent.has(t.key));
      // most of the screen played: time to fetch the next cast, so it is in by the wave (casts.js)
      if (todo.length <= shownNow.length * (1 - PREPARE_AT)) cast.prepare();
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
      // its AI copy still on its way (characters.js): wait for it, then pick again; a failed one plays human
      const ch = chars.get(next.key);
      if (!ch.aiIn && (await ch.aiReady)) continue;
      if (stopped) break;
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
    stop: () => { stopped = true; clearTimeout(resumeTimer); ctl.onUser = null; waiters.splice(0).forEach((r) => r()); },
    // resolves as the wave's flip begins, which can wait for the other cast to arrive (the wave button's loader)
    reset: () => new Promise((r) => {
      if (waving || stopped) return r();
      waiters.push(r);
      resetReq = true;
    }),
    hold: (on) => { held = on; },
  };
}
