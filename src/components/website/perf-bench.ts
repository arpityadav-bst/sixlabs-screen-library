"use client";

// ?perf=bench: measures what each part of the hero floor costs on this machine, so it can be made lighter
// where it is heavy and nowhere else. Two cases come first as a baseline: nothing drawn (the page's own
// frame rate with the floor still) and a blank frame (the cost of putting any frame on the canvas at all);
// every case also notes the main thread's own time to issue its frame (cpu), so a frame rate held down by
// the processor, not the GPU, shows as such. Once the floor is in it pauses the auto-play (window.__benchHold,
// autoplay.js), then for each case below changes one thing from the full setting, lets it settle, draws the
// floor on every frame for MEASURE_MS and keeps the frame times: the median, the slowest 5% and the fps,
// each against the full setting. Alongside: the GPU, the screen and canvas size, the floor's draw calls,
// triangles, textures and shader programs, and an estimate of its drawing buffers' memory. The panel's Copy
// puts it all on the clipboard as text. The floor's parts come from window.__floorPerf (floor-perf.js).
type Cfg = { r: number; aa: number };
type Obj = {
  isInstancedMesh?: boolean;
  visible: boolean;
  material?: Mat | Mat[];
  traverse(f: (o: Obj) => void): void;
};
type Mat = {
  needsUpdate?: boolean;
  customProgramCacheKey?: () => string;
};
type Floor = {
  renderer: {
    domElement: HTMLCanvasElement;
    setRenderTarget(t: null): void;
    clear(): void;
    info: {
      autoReset: boolean;
      reset(): void;
      render: { calls: number; triangles: number };
      memory: { geometries: number; textures: number };
      programs?: unknown[];
    };
  };
  composer: {
    render(): void;
    passes: { enabled: boolean; uniforms?: Record<string, unknown> }[];
  };
  scene: Obj;
  refiner?: { moving(): void };
  dpr: number;
  set(cfg: Partial<Cfg>): void;
  restore(): void;
};

const SETTLE_MS = 700,
  MEASURE_MS = 2200;
const FULL: Cfg = { r: Infinity, aa: 4 };

const frame = () => new Promise<number>((r) => requestAnimationFrame(r));
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// every material of every object, with its object
function each(scene: Obj, f: (o: Obj, m: Mat) => void) {
  scene.traverse((o) => {
    const ms = Array.isArray(o.material)
      ? o.material
      : o.material
        ? [o.material]
        : [];
    ms.forEach((m) => f(o, m));
  });
}

// One thing switched off for a case, and its undo.
function toggle(fp: Floor, what: "grain" | "busts" | "tiles") {
  const undo: (() => void)[] = [];
  if (what === "grain")
    fp.composer.passes
      .filter((p) => p.uniforms && "uAmt" in p.uniforms)
      .forEach((p) => {
        const u = p.uniforms!.uAmt as { value: number },
          v = u.value;
        u.value = 0; // the grain is part of the output pass now (post.js): zeroed, not switched off
        undo.push(() => (u.value = v));
      });
  each(fp.scene, (o, m) => {
    const bust = m.customProgramCacheKey?.().startsWith("char-");
    if ((what === "busts" && bust) || (what === "tiles" && o.isInstancedMesh)) {
      if (o.visible) undo.push(() => (o.visible = true));
      o.visible = false;
    }
  });
  return () => undo.forEach((u) => u());
}

// the floor drawn on every frame for ms (or `draw`, a case's own frame); the frame times, and the main
// thread's time to issue each frame
const drawFloor = (fp: Floor) => () => {
  fp.refiner?.moving();
  fp.composer.render();
};
async function measure(fp: Floor, ms: number, draw = drawFloor(fp)) {
  const gaps: number[] = [],
    cpu: number[] = [];
  let last = await frame();
  const end = last + ms;
  while (last < end) {
    const t0 = performance.now();
    draw();
    cpu.push(performance.now() - t0);
    const now = await frame();
    gaps.push(now - last);
    last = now;
  }
  gaps.sort((a, b) => a - b);
  cpu.sort((a, b) => a - b);
  return {
    med: gaps[gaps.length >> 1],
    p95: gaps[Math.floor(gaps.length * 0.95)],
    cpu: cpu[cpu.length >> 1],
  };
}

// the floor's own count, over one whole frame (three resets it for every pass otherwise)
function sceneInfo(fp: Floor) {
  const info = fp.renderer.info;
  info.autoReset = false;
  info.reset();
  fp.refiner?.moving();
  fp.composer.render();
  const out = {
    calls: info.render.calls,
    triangles: info.render.triangles,
    textures: info.memory.textures,
    geometries: info.memory.geometries,
    programs: info.programs?.length ?? 0,
  };
  info.autoReset = true;
  info.reset();
  return out;
}

// the drawing buffers' memory, roughly: the scene's multisampled target (colour and depth), the composer's two
// and the anti-aliasing's hold, the canvas
function buffersMB(w: number, h: number, c: Cfg) {
  const px = w * h;
  return Math.round(
    (px * Math.max(1, c.aa) * (8 + 4) + px * 8 * 3 + px * 8) / 1e6,
  );
}

function panel() {
  const el = document.createElement("div");
  Object.assign(el.style, {
    position: "fixed",
    left: "8px",
    bottom: "44px",
    zIndex: "2147483647",
    maxWidth: "min(560px, 92vw)",
    maxHeight: "70vh",
    overflow: "auto",
    font: "11px/1.5 ui-monospace, monospace",
    color: "#fff",
    background: "rgba(10,27,51,0.92)",
    padding: "10px 12px",
    borderRadius: "10px",
    whiteSpace: "pre",
  });
  document.body.appendChild(el);
  return el;
}

export async function runBench(gpuName: () => string) {
  const el = panel();
  const say = (t: string) => (el.textContent = t);
  say("perf bench: waiting for the floor…");
  const w = window as unknown as {
    __floorPerf?: Floor;
    __floorReady?: boolean;
    __benchHold?: boolean;
  };
  while (!w.__floorPerf || !w.__floorReady) await sleep(250);
  const fp = w.__floorPerf;
  const gpu = gpuName(); // the floor's own GPU (perf.ts)
  await sleep(2500); // the tiles rise and their first pictures go up
  w.__benchHold = true;
  say("perf bench: pausing the auto-play… (keep the mouse off the floor)");
  await sleep(3500); // the activation under way finishes

  const blank = () => {
    fp.renderer.setRenderTarget(null);
    fp.renderer.clear();
  };
  const cases: [
    string,
    Partial<Cfg>,
    Parameters<typeof toggle>[1]?,
    (() => void)?,
  ][] = [
    ["full (dpr, aa 4)", {}],
    ["nothing drawn (page alone)", {}, undefined, () => {}],
    ["blank frame (canvas only)", {}, undefined, blank],
    ["aa 2", { aa: 2 }],
    ["aa 0 (no anti-aliasing)", { aa: 0 }],
    ["resolution 1.5", { r: 1.5 }],
    ["resolution 1", { r: 1 }],
    ["resolution 0.75", { r: 0.75 }],
    ["film grain off", {}, "grain"],
    ["portraits hidden", {}, "busts"],
    ["floor tiles hidden", {}, "tiles"],
  ];
  const rows: string[] = [];
  let base = 0,
    info = sceneInfo(fp);
  for (const [k, [name, cfg, off, draw]] of cases.entries()) {
    say(`perf bench: ${k + 1}/${cases.length} ${name}…\n\n${rows.join("\n")}`);
    fp.set({ ...FULL, ...cfg });
    const undo = off ? toggle(fp, off) : () => {};
    await measure(fp, SETTLE_MS); // settles, and compiles what changed
    if (k === 0) info = sceneInfo(fp);
    const m = await measure(fp, MEASURE_MS, draw);
    undo();
    if (k === 0) base = m.med;
    const vs =
      k === 0
        ? ""
        : `  ${m.med <= base ? "-" : "+"}${Math.abs(m.med - base).toFixed(1)} ms`;
    rows.push(
      `${name.padEnd(28)} ${m.med.toFixed(1).padStart(6)} ms  p95 ${m.p95.toFixed(1).padStart(6)}  ${Math.round(
        1000 / m.med,
      )
        .toString()
        .padStart(3)} fps  cpu ${m.cpu.toFixed(1).padStart(5)} ms${vs}`,
    );
  }
  fp.restore();
  w.__benchHold = false;

  const c = fp.renderer.domElement,
    cw = c.clientWidth,
    ch = c.clientHeight;
  const head = [
    `6labs perf bench · ${new Date().toISOString().slice(0, 16)}`,
    `gpu ${gpu}`,
    `dpr ${fp.dpr} · screen ${screen.width}x${screen.height} · floor ${cw}x${ch} css px`,
    `floor: ${info.calls} draw calls · ${(info.triangles / 1e6).toFixed(2)} M triangles · ${info.textures} textures · ${info.geometries} geometries · ${info.programs} programs`,
    `drawing buffers ~${buffersMB(cw * fp.dpr, ch * fp.dpr, FULL)} MB at full (estimate)`,
    `${navigator.userAgent.replace(/^Mozilla\/5\.0 /, "")}`,
    "",
    "case                         median          worst 5%    fps  cpu (main thread)  vs full",
  ];
  const text = [...head, ...rows].join("\n");
  el.textContent = text + "\n\n";
  const copy = document.createElement("button");
  copy.textContent = "Copy";
  Object.assign(copy.style, {
    font: "12px ui-monospace, monospace",
    padding: "4px 10px",
    borderRadius: "6px",
    border: "0",
    background: "#fff",
    color: "#0a1b33",
    cursor: "pointer",
  });
  copy.onclick = () =>
    navigator.clipboard
      ?.writeText(text)
      .then(() => (copy.textContent = "Copied"));
  el.appendChild(copy);
}
