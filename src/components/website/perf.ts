"use client";

// ?perf in the address shows a small readout in the corner (the page's frame rate, the hero floor's level as
// "resolution/glass/anti-aliasing" from governor.js, the screen's pixel density and the GPU), for checking a
// machine from afar. Nothing else about the page changes.
function gpuName() {
  const gl = document.createElement("canvas").getContext("webgl");
  const ext = gl?.getExtension("WEBGL_debug_renderer_info");
  return (ext && gl?.getParameter(ext.UNMASKED_RENDERER_WEBGL)) || "unknown";
}

export function perfReadout() {
  if (!new URLSearchParams(location.search).has("perf")) return;
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
      const floor = document.documentElement.dataset.floor ?? "-";
      el.textContent = `${Math.round((n * 1000) / (now - t))} fps · floor ${floor} · dpr ${window.devicePixelRatio} · ${gpu}`;
      n = 0;
      t = now;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
