"use client";

// Lite mode, for a machine that cannot keep up (an Intel Mac's built-in graphics at 2x, say). Once the
// hero's floor is in (window.__floorReady, floor.js) and a moment more, the page's frame gaps are timed in
// windows of WINDOW; if one window's median runs slower than SLOW_MS (about 40 fps), lite mode starts and
// stays: <html data-lite="1"> and a "perf-lite" event, which the page's heavy parts answer: smooth scrolling
// hands back to the browser's own (SmoothScroll.tsx), the floor drops to its lightest (governor.js), the
// ASCII field stops (AsciiBackdrop.tsx), the accent water's halftone coarsens (AccentWave.tsx), and the
// noise, blur and shadows come off (globals.css). A fast machine never trips it.
// ?lite in the address forces it; ?perf shows a small readout (frame rate, lite, the floor's resolution,
// the GPU), for checking a machine from afar.
export const LITE = "perf-lite";
export const isLite = () =>
  typeof document !== "undefined" &&
  document.documentElement.dataset.lite === "1";

const SLOW_MS = 24,
  WINDOW = 90,
  SETTLE_MS = 1500; // after the floor is in: its tiles rise and its late pictures go up first

function goLite() {
  if (isLite()) return;
  document.documentElement.dataset.lite = "1";
  window.dispatchEvent(new Event(LITE));
}

function gpuName() {
  const gl = document.createElement("canvas").getContext("webgl");
  const ext = gl?.getExtension("WEBGL_debug_renderer_info");
  return (ext && gl?.getParameter(ext.UNMASKED_RENDERER_WEBGL)) || "unknown";
}

function readout() {
  const el = document.createElement("div");
  Object.assign(el.style, {
    position: "fixed",
    left: "8px",
    bottom: "8px",
    zIndex: "2147483647",
    pointerEvents: "none",
    font: "11px/1.4 ui-monospace, monospace",
    color: "#fff",
    background: "rgba(10,27,51,0.85)",
    padding: "6px 8px",
    borderRadius: "8px",
    maxWidth: "70vw",
  });
  document.body.appendChild(el);
  const gpu = gpuName();
  let n = 0,
    t = performance.now();
  const tick = (now: number) => {
    n++;
    if (now - t >= 500) {
      const d = document.documentElement.dataset;
      el.textContent = `${Math.round((n * 1000) / (now - t))} fps · lite ${d.lite === "1" ? "on" : "off"} · floor ${d.floor ?? "-"} · dpr ${window.devicePixelRatio} · ${gpu}`;
      n = 0;
      t = now;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Starts the watch (SmoothScroll.tsx mounts it on every page); returns its stop.
export function watchPerf(): () => void {
  const q = new URLSearchParams(location.search);
  if (q.has("lite")) goLite();
  if (q.has("perf")) readout();
  if (isLite()) return () => {};
  const born = performance.now();
  let raf = 0,
    last = 0,
    from = 0,
    gaps: number[] = [];
  const tick = (now: number) => {
    const w = window as unknown as { __floorReady?: boolean };
    // from SETTLE_MS after the floor is in (or 8s in, a page without one)
    if (!from && (w.__floorReady || now - born > 8000)) from = now + SETTLE_MS;
    if (from && now > from && last && !document.hidden) {
      const g = now - last;
      if (g < 250) gaps.push(g); // a hidden tab or a one-off stall is not a slow machine
    }
    last = now;
    if (gaps.length >= WINDOW) {
      const slow = gaps.sort((a, b) => a - b)[WINDOW >> 1] > SLOW_MS;
      gaps = [];
      if (slow) return goLite();
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
