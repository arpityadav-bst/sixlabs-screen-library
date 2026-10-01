// The live floor always draws at full: the screen's own pixel density and 4x multisampling, on every
// machine. (Until 2026-10-01 a governor stepped a slow GPU down, to as low as 0.75x with no anti-aliasing;
// it read as blurry and stair-stepped, and the first seconds stuttered while it decided. The floor now asks
// for the machine's faster GPU instead, floor.js, and costs less per frame for the same picture.)
// With ?perf in the address it hands the page's benchmark (website/perf-bench.ts) window.__floorPerf: the
// floor's parts, and set(cfg) / restore() to draw at a resolution and anti-aliasing of the bench's own
// choosing while it measures (onChange redraws at it). <html data-floor> reads "ratio/aa" (website/perf.ts).
const FULL = { r: Infinity, aa: 4 }; // r: the most device pixels drawn per CSS pixel

export function floorPerf(renderer, composer, onChange, parts = {}) {
  const dpr = window.devicePixelRatio || 1, aaPass = composer.passes[0];
  let held = null, ratio = dpr;
  if (!new URLSearchParams(location.search).has('perf')) return { get ratio() { return ratio; } };
  const apply = () => {
    const L = held ?? FULL;
    ratio = Math.min(dpr, L.r);
    const rt = aaPass?._sampleRenderTarget;
    if (rt && rt.samples !== L.aa) { rt.samples = L.aa; rt.dispose(); } // rebuilt at its new samples on next use
    document.documentElement.dataset.floor = `${ratio.toFixed(2)}/${L.aa}`;
  };
  apply();
  window.__floorPerf = {
    renderer, composer, ...parts, dpr,
    set(cfg) { held = { ...FULL, ...held, ...cfg }; apply(); onChange(); },
    restore() { held = null; apply(); onChange(); },
  };
  return { get ratio() { return ratio; } };
}
