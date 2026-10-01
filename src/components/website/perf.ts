"use client";

// ?perf in the address shows a small readout in the corner, for checking a machine from afar; nothing else
// about the page changes. Every half second: the frame rate, the slowest 5% of the last two seconds' frames,
// the frames over 50ms in the last ten, the main thread's long tasks in the last ten (where the browser
// reports them), the hero floor's drawing as "resolution/anti-aliasing" (floor-perf.js) and its canvas in
// device px, the screen's pixel density, the JS heap (where reported) and the GPU the floor draws on (on a
// laptop with two, it asks for the faster one: this says whether it got it); and on a second line the
// players' clips (PlayerPortrait.tsx): which files play (webm or stacked), how long their seeks took to land
// in the last ten seconds (the scrubbed turn: the average, the slowest and how many), and how long the last
// clip to appear waited for its first frame. ?perf=bench also runs the floor benchmark (perf-bench.ts),
// which measures what each of its parts costs here. The readout keeps a log, a line a second for the last
// three minutes (the section in the middle of the view, then the readout's numbers), and its Copy button puts
// the log on the clipboard under the page's address, the GPU, the screen and the browser, so a whole test run
// (a scroll through the page, a few player switches) is one paste, no photos.
import type { PerfVideo } from "./PlayerPortrait";

// ?off=… in the address turns parts of the page off for one visit, to find what a slow machine is paying
// for: ascii (the ASCII field), wave (the accent water's halftone dots; its blue stays), liquid (the scroll
// line's liquid), tiles (the floating tiles), doodles (the players' doodles), smooth (the smooth scrolling),
// grain (the page noise), fx (every backdrop blur, blend mode, CSS mask and filter on
// the page: on a Mac, Chrome hands a frame's layers to the system as they are only when none is on screen).
// Comma-separated, any number; <html data-off> carries them for the CSS ones (globals.css). Nothing changes
// without it. ?gpu=low draws the floor and the liquid on a two-GPU laptop's low-power GPU (floor.js);
// ?portraitgpu=high draws the players' portrait on its faster one (swap-gl.ts).
export const isOff = (part: string) =>
  typeof location !== "undefined" &&
  (new URLSearchParams(location.search).get("off") ?? "")
    .split(",")
    .includes(part);
export function applyOff() {
  const off = new URLSearchParams(location.search).get("off");
  if (off) document.documentElement.dataset.off = off.split(",").join(" ");
}

// the hero floor's own context once it is up (?perf=bench waits for it), else a fresh one's
export function gpuName() {
  const fp = (
    window as unknown as {
      __floorPerf?: { renderer: { getContext(): WebGLRenderingContext } };
    }
  ).__floorPerf;
  const gl =
    fp?.renderer.getContext() ??
    document.createElement("canvas").getContext("webgl");
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
  const text = document.createElement("div");
  const copy = document.createElement("button");
  copy.textContent = "Copy log";
  Object.assign(copy.style, {
    pointerEvents: "auto",
    marginTop: "5px",
    font: "11px ui-monospace, monospace",
    padding: "3px 9px",
    borderRadius: "6px",
    border: "0",
    background: "#fff",
    color: "#0a1b33",
    cursor: "pointer",
  });
  el.append(text, copy);
  document.body.appendChild(el);
  const log: string[] = [];
  copy.onclick = () => {
    const head = [
      `6labs perf log · ${new Date().toISOString().slice(0, 19)} · ${location.href}`,
      `gpu ${gpuName()} · dpr ${window.devicePixelRatio} · screen ${screen.width}x${screen.height} · view ${innerWidth}x${innerHeight}`,
      navigator.userAgent,
      "",
    ];
    navigator.clipboard
      ?.writeText([...head, ...log].join("\n"))
      .then(() => {
        copy.textContent = "Copied";
        setTimeout(() => (copy.textContent = "Copy log"), 1500);
      });
  };
  const video: PerfVideo = { seeks: [], first: [] };
  (window as unknown as { __perfVideo?: PerfVideo }).__perfVideo = video;
  // the floor's own moments, for the log: a reset wave running, the second cast loading (autoplay.js, casts.js)
  const events: { wave?: boolean; cast?: string } = {};
  (window as unknown as { __floorEvents?: typeof events }).__floorEvents = events;
  let gpu = gpuName(),
    gpuFloor = false;
  if (mode === "bench") import("./perf-bench").then((m) => m.runBench(gpuName));

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
    last = 0,
    logged = 0;
  const born = performance.now();
  // the section in the middle of the view (the nearest element with an id under its centre)
  const section = () =>
    document.elementFromPoint(innerWidth / 2, innerHeight / 2)?.closest("[id]")
      ?.id ?? "-";
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
      if (fc && !gpuFloor) {
        gpu = gpuName();
        gpuFloor = true;
      }
      const heap = (
        performance as unknown as { memory?: { usedJSHeapSize: number } }
      ).memory;
      const sk = video.seeks.map(([, d]) => d),
        firstMs = video.first.at(-1)?.[1];
      const clips = video.format
        ? `clips ${video.format} · seeks ${sk.length ? `avg ${Math.round(sk.reduce((a, b) => a + b, 0) / sk.length)}ms, slowest ${Math.round(Math.max(...sk))}ms (${sk.length})` : "-"}/10s · first frame ${firstMs !== undefined ? `${(firstMs / 1000).toFixed(1)}s` : "-"}`
        : "";
      const fps = Math.round((n * 1000) / (now - t));
      if (now - logged >= 1000) {
        logged = now;
        log.push(
          [
            `${((now - born) / 1000).toFixed(0).padStart(4)}s ${section().padEnd(12)}`,
            `${fps} fps`,
            `worst5 ${p95.toFixed(0)}ms`,
            `>50ms ${long}`,
            `floor ${d.floor ?? "-"}${events.wave ? " WAVE" : ""}${events.cast ? ` cast ${events.cast}` : ""}`,
            clips.replace(/^clips /, ""),
          ]
            .filter(Boolean)
            .join(" · "),
        );
        if (log.length > 180) log.shift();
      }
      text.textContent =
        [
          `${fps} fps`,
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
