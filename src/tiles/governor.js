// Keeps the live floor smooth on a weak GPU (an Intel Mac's UHD 630 ran the full view at 2 fps). While the
// floor is drawing (a render in the last second), it times the page's own frames and, about every second,
// takes their median: slower than SLOW_MS (about 45 fps) steps the floor's work down LEVELS, further at once
// the slower it is (two steps under 25 fps, three under 10). A level sets the drawing resolution, the glass's
// see-through pass and the anti-aliasing samples; the resolution goes first and the anti-aliasing last (at a
// resolution of 1 its samples cost little, and without them the tiles' edges stair-step), and it stops at
// 0.75. A fast GPU never trips it and keeps everything at full.
// It never steps back up: a sharpness that comes and goes reads worse than one that holds. onChange redraws
// the floor at the new resolution; <html data-floor> reads "ratio/glass/aa" (?perf, website/perf.ts).
const SLOW_MS = 22;
const LEVELS = [
  { r: Infinity, glass: 1, aa: 4 }, // r: the most device pixels it draws per CSS pixel
  { r: Infinity, glass: 0.5, aa: 4 },
  { r: 1.5, glass: 0.5, aa: 4 },
  { r: 1.25, glass: 0.5, aa: 4 },
  { r: 1, glass: 0.5, aa: 4 },
  { r: 1, glass: 0.5, aa: 2 },
  { r: 0.85, glass: 0.25, aa: 2 },
  { r: 0.75, glass: 0.25, aa: 0 },
];

export function governFloor(renderer, composer, onChange) {
  const dpr = window.devicePixelRatio || 1, aaPass = composer.passes[0];
  let level = 0;
  let ratio = dpr, lastRender = 0, prev = 0, gaps = [], since = 0;
  const apply = () => {
    const L = LEVELS[level];
    ratio = Math.min(dpr, L.r);
    renderer.transmissionResolutionScale = L.glass;
    const rt = aaPass?._sampleRenderTarget;
    if (rt && rt.samples !== L.aa) { rt.samples = L.aa; rt.dispose(); } // rebuilt at its new samples on next use
    document.documentElement.dataset.floor = `${ratio.toFixed(2)}/${L.glass}/${L.aa}`;
  };
  apply();
  const render = composer.render.bind(composer);
  composer.render = (...args) => {
    lastRender = performance.now();
    return render(...args);
  };
  // the page's frames, timed only while the floor is drawing; a hidden tab or a long stall is not counted
  const probe = (now) => {
    if (!renderer.domElement.isConnected) return; // the floor is gone
    const gap = prev ? now - prev : Infinity;
    prev = now;
    if (now - lastRender < 1000 && !document.hidden && gap < 5000) {
      gaps.push(gap);
      since ||= now;
    }
    if (gaps.length >= 3 && now - since >= 1000) {
      const med = gaps.sort((a, b) => a - b)[gaps.length >> 1];
      gaps = [];
      since = 0;
      const steps = med > 100 ? 3 : med > 40 ? 2 : med > SLOW_MS ? 1 : 0;
      if (steps && level < LEVELS.length - 1) {
        level = Math.min(LEVELS.length - 1, level + steps);
        apply();
        onChange();
      }
    }
    requestAnimationFrame(probe);
  };
  requestAnimationFrame(probe);
  return { get ratio() { return ratio; } };
}
