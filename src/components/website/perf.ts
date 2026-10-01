"use client";

// ?perf in the address shows a small readout in the corner, for checking a machine from afar; nothing else
// about the page changes. Every half second: the frame rate, the slowest 5% of the last two seconds' frames,
// the frames over 50ms in the last ten, the main thread's long tasks in the last ten (where the browser
// reports them), the hero floor's level as "resolution/anti-aliasing" (governor.js) and its canvas in
// device px, the screen's pixel density, the JS heap (where reported) and the GPU; and on a second line the
// players' clips (PlayerPortrait.tsx): which files play (webm or stacked), how long their seeks took to land
// in the last ten seconds (the scrubbed turn: the average, the slowest and how many), and how long the last
// clip to appear waited for its first frame. ?perf=bench also runs the floor benchmark (perf-bench.ts),
// which measures what each of its parts costs here.
import type { PerfVideo } from "./PlayerPortrait";

// ?off=… in the address turns parts of the page off for one visit, to find what a slow machine is paying
// for: ascii (the ASCII field), wave (the accent water's halftone dots; its blue stays), liquid (the scroll
// line's liquid), tiles (the floating tiles), doodles (the players' doodles), smooth (the smooth scrolling),
// grain (the page noise), blur (the header's blur). Comma-separated, any number; <html data-off> carries them
// for the CSS ones (globals.css). Nothing changes without it.
export const isOff = (part: string) =>
  typeof location !== "undefined" &&
  (new URLSearchParams(location.search).get("off") ?? "")
    .split(",")
    .includes(part);
export function applyOff() {
  const off = new URLSearchParams(location.search).get("off");
  if (off) document.documentElement.dataset.off = off.split(",").join(" ");
}

function gpuName() {
  const gl = document.createElement("canvas").getContext("webgl");
  const ext = gl?.getExtension("WEBGL_debug_renderer_info");
  return (ext && gl?.getParameter(ext.UNMASKED_RENDERER_WEBGL)) || "unknown";
}

export function perfReadout() {
  const mode = new URLSearchParams(location.search).get("perf");
  if (mode === null || document.getElementById("perf-readout")) return;
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
    maxWidth: "92vw",
    whiteSpace: "pre-line",
  });
  document.body.appendChild(el);
  const video: PerfVideo = { seeks: [], first: [] };
  (window as unknown as { __perfVideo?: PerfVideo }).__perfVideo = video;
  const gpu = gpuName();
  if (mode === "bench") import("./perf-bench").then((m) => m.runBench(gpu));

  // the main thread's long tasks (Chrome reports them; elsewhere the count stays "-")
  const tasks: [number, number][] = [];
  let tasksOn = false;
  try {
    new PerformanceObserver((list) =>
      list.getEntries().forEach((e) => tasks.push([e.startTime, e.duration])),
    ).observe({ type: "longtask", buffered: true });
    tasksOn = true;
  } catch {}

  const gaps: [number, number][] = []; // [when, frame time]
  let n = 0,
    t = performance.now(),
    last = 0;
  const tick = (now: number) => {
    n++;
    if (last) gaps.push([now, now - last]);
    last = now;
    while (gaps.length && gaps[0][0] < now - 10000) gaps.shift();
    while (tasks.length && tasks[0][0] < now - 10000) tasks.shift();
    while (video.seeks.length && video.seeks[0][0] < now - 10000)
      video.seeks.shift();
    if (now - t >= 500) {
      const recent = gaps.filter(([w]) => w > now - 2000).map(([, g]) => g);
      recent.sort((a, b) => a - b);
      const p95 = recent[Math.floor(recent.length * 0.95)] ?? 0;
      const long = gaps.filter(([, g]) => g > 50).length;
      const lt = tasksOn
        ? `${tasks.length} (${Math.round(tasks.reduce((s, [, d]) => s + d, 0))}ms)`
        : "-";
      const d = document.documentElement.dataset;
      const fc = (
        window as unknown as {
          __floorPerf?: { renderer: { domElement: HTMLCanvasElement } };
        }
      ).__floorPerf?.renderer.domElement;
      const heap = (
        performance as unknown as { memory?: { usedJSHeapSize: number } }
      ).memory;
      const sk = video.seeks.map(([, d]) => d),
        firstMs = video.first.at(-1)?.[1];
      const clips = video.format
        ? `clips ${video.format} · seeks ${sk.length ? `avg ${Math.round(sk.reduce((a, b) => a + b, 0) / sk.length)}ms, slowest ${Math.round(Math.max(...sk))}ms (${sk.length})` : "-"}/10s · first frame ${firstMs !== undefined ? `${(firstMs / 1000).toFixed(1)}s` : "-"}`
        : "";
      el.textContent =
        [
          `${Math.round((n * 1000) / (now - t))} fps`,
          `worst 5% ${p95.toFixed(0)}ms`,
          `>50ms frames ${long}/10s`,
          `long tasks ${lt}/10s`,
          `floor ${d.floor ?? "-"}${fc ? ` ${fc.width}x${fc.height}` : ""}`,
          `dpr ${window.devicePixelRatio}`,
          heap ? `heap ${Math.round(heap.usedJSHeapSize / 1e6)}MB` : "",
          gpu,
          d.off ? `off: ${d.off}` : "",
        ]
          .filter(Boolean)
          .join(" · ") +
        (clips
          ? `
${clips}`
          : "");
      n = 0;
      t = now;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
