"use client";

// Lite mode, on for everyone (the page as smooth as it runs on any machine, an Intel Mac's built-in graphics
// included): <html data-lite="1"> from the server's first paint (layout.tsx), which the page's heavy parts
// answer: scrolling is the browser's own, not smoothed (SmoothScroll.tsx), the ASCII field stays off
// (AsciiBackdrop.tsx), the accent water's halftone is coarser (AccentWave.tsx), the floor's glass pass runs
// at half resolution (governor.js, which still lowers the floor's resolution where it runs slow), and the
// page noise, the header's blur and the floating tiles' shadow are off (globals.css).
// ?full in the address turns it off, for the full version; ?perf shows a small readout (frame rate, lite,
// the floor's resolution, the GPU), for checking a machine from afar.
export const isLite = () =>
  typeof document !== "undefined" &&
  document.documentElement.dataset.lite === "1";

function gpuName() {
  const gl = document.createElement("canvas").getContext("webgl");
  const ext = gl?.getExtension("WEBGL_debug_renderer_info");
  return (ext && gl?.getParameter(ext.UNMASKED_RENDERER_WEBGL)) || "unknown";
}

function readout() {
  if (document.getElementById("perf-readout")) return;
  const el = document.createElement("div");
  el.id = "perf-readout";
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

// Reads the address once, on the first page (SmoothScroll.tsx runs it before it starts): ?full, ?perf.
export function readPerfFlags() {
  const q = new URLSearchParams(location.search);
  if (q.has("full")) delete document.documentElement.dataset.lite;
  if (q.has("perf")) readout();
}
