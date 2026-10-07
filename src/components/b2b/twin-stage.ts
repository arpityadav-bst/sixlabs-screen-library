// The B2B hero's stage (B2BHero.tsx): people become their digital twins. On the left, a crowd of ASCII stick
// figures drifts toward the middle, loose and uneven; one at a time a person leaves its front and walks a lane
// to the 6labs line, where the model reads them (they break into glyphs, a ripple runs along the line), and
// out the other side comes their twin, a dot-matrix figure that flies to its slot in the wall of twins on the
// right: exact rows, drifting away at the crowd's pace, each new slot a "[ ]" until its twin lands. One
// departure every INTERVAL, the rows taking turns, so the two sides move as one pipeline. onTwin hears each
// landing. All of it seen as a panorama, on the inside of a ring (PERSP, below). Drawn on one 2D canvas from
// prepared pictures (twin-sprites.ts), the line as a column of dots. It runs only while on screen and the tab
// is shown, and draws a single still frame under reduced motion.
import { GLYPHS, PERSON, makeSprites, type Sprite, type Sprites } from "./twin-sprites";

export type Twin = { count: number; player: string; hours: number; fit: number };
type Walker = { r: number; n: number; x: number; y: number; phase: "walk" | "read" | "fly"; t0: number; x0: number };

const INTERVAL = 0.9; // s between departures, all rows together
const WALK = 46; // px/s along the lane
const READ_S = 0.45; // the read at the line
const FLY_S = 0.9; // from the line to the slot
const RING_S = 0.7;
const ORDER = [3, 0, 4, 1, 5, 2]; // the rows' turns, hopping so departures never run top to bottom
// The panorama, after onBlue's businesses hero (onblue-vesper/brands.html, the sample ring): the stage is laid
// out flat, then seen on the inside of a cylinder, its middle the far point. A point s from the middle sits at
// angle s / R; the perspective divide (perspective PERSP x R) scales it by K(a), 1 at the far middle and
// growing toward the ends, which leave the screen EDGE_A round. A drum a little more than onBlue's ring (its 1.8
// and 63 degrees): the viewer nearer the drum, so the ends swell more and curve further round. Heights grow by
// K; widths are held back a little by the turn (TURN_BY), so the figures stand taller, turned toward you.
const PERSP = 1.4;
const EDGE_A = 1.15; // about 66 degrees
const TURN_BY = 0.2;
const K = (a: number) => (PERSP + 1) / (PERSP + Math.cos(a));
const EDGE_K = K(EDGE_A); // the ends' scale, where the drum leaves the screen
// how wide a picture at angle a draws: the curve's own stretch, less its turn away from the viewer
const TURN = (a: number) => ((PERSP + 1) * (PERSP * Math.cos(a) + 1)) / (PERSP + Math.cos(a)) ** 2 * (1 - TURN_BY + TURN_BY * Math.cos(a));

const hash = (a: number, b: number, c = 0) => {
  const s = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return s - Math.floor(s);
};
const smooth = (a: number, b: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

export function createTwinStage(canvas: HTMLCanvasElement, start: number, onTwin: (t: Twin) => void) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-jbmono").trim() || "monospace";
  let W = 0, H = 0, dpr = 1, S: Sprites | null = null;
  let rows = 6, pitch = 24, gap = 120, cx = 0, F = 0, B = 0, rowH = 40, top = 0, v = 1;
  let turn: number[] = [], R = 400, cy = 0;
  let t = 0, count = start, silent = false, raf = 0, last = 0, onScreen = false, gone = false;
  let departed: number[] = [], filled: number[] = [], walkers: Walker[] = [], rings: { y: number; t0: number }[] = [];

  const phase = (r: number) => v * t + (turn[r] * pitch) / rows;
  const rowY = (r: number) => top + r * rowH + (rowH - S!.m.figH) / 2;
  const slotX = (r: number, n: number) => B + phase(r) - n * pitch;

  function setup() {
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    if (!W || !H) return false;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    const phone = W < 768;
    S = makeSprites(phone ? 8 : W < 1200 ? 10 : 11, dpr * EDGE_K, family); // drawn up to EDGE_K larger, so made sharper
    const m = S.m;
    // as many rows as the stage's height holds without crowding (the hero fits one screen, so it varies)
    // (laid out at the far middle's scale, so the rows still fit where the ends grow them by EDGE_K)
    rows = Math.max(3, Math.min(phone ? 5 : 6, Math.floor((H - 16) / EDGE_K / (m.figH * 1.22))));
    pitch = Math.round(m.figW * 1.22);
    gap = phone ? 40 : W < 1200 ? 92 : 120;
    cx = Math.round(W / 2);
    F = cx - gap - m.figW;
    B = cx + gap;
    rowH = (H - 16) / EDGE_K / rows;
    cy = H / 2;
    top = cy - (rows * rowH) / 2;
    R = W / 2 / (Math.sin(EDGE_A) * EDGE_K);
    v = pitch / (rows * INTERVAL);
    const order = ORDER.filter((k) => k < rows);
    turn = Array.from({ length: rows }, (_, r) => order.indexOf(r));
    // full from the first frame: the crowd and the wall in place, the pipeline already running
    t = 0;
    departed = Array.from({ length: rows }, (_, r) => Math.floor(phase(r) / pitch));
    filled = departed.slice();
    walkers = [];
    rings = [];
    const shown = count; // the twins landed while it fills do not count
    silent = true;
    for (let k = 0; k < 180; k++) update(1 / 30);
    silent = false;
    count = shown;
    return true;
  }

  function update(dt: number) {
    if (!S) return;
    const m = S.m, half = m.figW / 2 + 4;
    t += dt;
    for (let r = 0; r < rows; r++) {
      const d = Math.floor(phase(r) / pitch);
      while (departed[r] < d) {
        const n = ++departed[r];
        // from where it stood in the crowd (the same jitter), so it steps out without a jump
        walkers.push({ r, n, x: F + (hash(r, n) - 0.5) * 6, y: rowY(r) + (hash(r, n, 1) - 0.5) * 6, phase: "walk", t0: t, x0: F });
      }
    }
    for (const w of walkers) {
      const y = rowY(w.r);
      if (w.phase === "walk") {
        w.x += WALK * dt;
        w.y += (y - w.y) * Math.min(1, dt * 3);
        if (w.x + m.figW / 2 >= cx - half) {
          w.phase = "read";
          w.t0 = t;
          w.x0 = w.x;
          rings.push({ y: y + m.figH / 2, t0: t });
        }
      } else if (w.phase === "read") {
        w.x = w.x0 + ((2 * half) / READ_S) * (t - w.t0);
        w.y = y;
        if (t - w.t0 >= READ_S) {
          w.phase = "fly";
          w.t0 = t;
          w.x0 = w.x;
        }
      } else {
        const k = Math.min(1, (t - w.t0) / FLY_S), e = 1 - (1 - k) ** 3;
        w.x = w.x0 + (slotX(w.r, w.n) - w.x0) * e;
        if (k >= 1) {
          filled[w.r] = Math.max(filled[w.r], w.n);
          count++;
          if (!silent)
            onTwin({ count, player: `player_${10000 + Math.floor(Math.random() * 89999)}`, hours: 800 + Math.floor(Math.random() * 5200), fit: 0.95 + Math.random() * 0.045 });
        }
      }
    }
    walkers = walkers.filter((w) => !(w.phase === "fly" && t - w.t0 >= FLY_S));
    rings = rings.filter((g) => t - g.t0 < RING_S);
  }

  // where a flat x (and a height y) lands on the ring
  const ringX = (x: number) => {
    const a = (x - cx) / R;
    return cx + R * Math.sin(a) * K(a);
  };
  const ringY = (x: number, y: number) => cy + (y - cy) * K((x - cx) / R);
  // a picture stood on the ring: placed by its middle, taller by K, as wide as it was
  // split: the picture's red and cyan copies, drawn first, slipping apart as it comes round toward the ends
  // (the colour split of a lens's rim, as on onBlue's glyph pool), nothing in the middle third
  const stamp = (img: CanvasImageSource, x: number, y: number, w: number, h: number, a: number, split?: Sprite[]) => {
    const ang = (x + w / 2 - cx) / R;
    if (a <= 0.01 || Math.abs(ang) > EDGE_A + 0.2) return;
    const k = K(ang), ww = w * TURN(ang), X = cx + R * Math.sin(ang) * k - ww / 2, Y = cy + (y - cy) * k;
    const ca = split ? smooth(0.35, EDGE_A, Math.abs(ang)) : 0;
    if (ca > 0.01) {
      const d = ca * 2.6;
      ctx!.globalAlpha = a * 0.55 * ca;
      ctx!.drawImage(split![0].img, X - d, Y, ww, h * k);
      ctx!.drawImage(split![1].img, X + d, Y, ww, h * k);
    }
    ctx!.globalAlpha = a;
    ctx!.drawImage(img, X, Y, ww, h * k);
  };

  function draw() {
    if (!S) return;
    const c = ctx!, m = S.m;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.globalAlpha = 1;
    c.clearRect(0, 0, W, H);
    // the lanes from the crowd's front to the wall
    c.strokeStyle = "rgba(100,116,139,0.22)";
    c.lineWidth = 1;
    c.setLineDash([2, 5]);
    c.beginPath();
    for (let r = 0; r < rows; r++) {
      const y = rowY(r) + m.figH;
      c.moveTo(ringX(F + m.figW), ringY(F + m.figW, y));
      for (let x = F + m.figW + 8; x < B; x += 8) c.lineTo(ringX(x), ringY(x, y));
      c.lineTo(ringX(B), ringY(B, y));
    }
    c.stroke();
    c.setLineDash([]);
    // the line's glyph columns: what the model is reading, ticking over
    const gl = S.glyphs, lh = m.lh;
    for (let j = 0; j * lh < H; j++)
      for (const [col, x] of [[0, cx - 7 - m.cw], [1, cx + 7]] as const) {
        const near = rings.reduce((a, g) => Math.max(a, (1 - Math.abs(g.y - j * lh) / 40) * (1 - (t - g.t0) / RING_S)), 0);
        const g = gl[Math.floor(hash(col, j, Math.floor(t * 7 + j * 0.37)) * GLYPHS.length)];
        stamp(g.img, x, j * lh, g.w, g.h, (0.1 + 0.6 * Math.max(0, near)) * smooth(0, 40, j * lh) * smooth(H, H - 40, j * lh));
      }
    // the 6labs line, a dot-matrix beam: a column of blue dots, a ripple running up and down it from each
    // read, the dot under the read swelling first
    {
      c.fillStyle = "#1a6dff";
      for (let y = 6; y < H - 4; y += 7) {
        let amp = 0;
        for (const g of rings) {
          const age = t - g.t0, fade = 1 - age / RING_S, d = Math.abs(y - g.y);
          amp = Math.max(amp, (Math.exp(-((d - age * 240) ** 2) / 200) + Math.exp(-(d * d) / 300)) * fade);
        }
        amp = Math.min(1, amp);
        c.globalAlpha = (0.32 + 0.68 * amp) * smooth(0, 36, y) * smooth(H, H - 36, y);
        c.beginPath();
        c.arc(cx, y, 1.25 + 1.5 * amp, 0, Math.PI * 2);
        c.fill();
      }
    }
    // the crowd: loose, fading out to the left
    for (let r = 0; r < rows; r++) {
      const p = phase(r), y = rowY(r);
      for (let n = Math.floor(p / pitch) + 1; ; n++) {
        const x = F + p - n * pitch + (hash(r, n) - 0.5) * 6;
        if (x < -m.figW) break;
        const stepping = hash(r, n, Math.floor(t * 2)) < 0.06, s = stepping ? S.step : S.person;
        stamp(s.img, x, y + (hash(r, n, 1) - 0.5) * 6, s.w, s.h, (0.55 + 0.4 * hash(r, n, 3)) * smooth(-m.figW, F * 0.8, x), stepping ? S.split.step : S.split.person);
      }
    }
    // the wall of twins: exact, fading out to the right; a slot still waiting on its twin is "[ ]"
    for (let r = 0; r < rows; r++) {
      const p = phase(r), y = rowY(r);
      for (let n = Math.floor(p / pitch); ; n--) {
        const x = B + p - n * pitch;
        if (x > W) break;
        const fade = 1 - smooth(W - (W - B) * 0.55, W, x);
        if (n > filled[r]) stamp(S.pending.img, x, y, S.pending.w, S.pending.h, 0.5 * fade);
        else stamp(S.twin.img, x, y, S.twin.w, S.twin.h, (hash(r, n, Math.floor(t * 1.5)) < 0.05 ? 1 : 0.78) * fade, S.split.twin);
      }
    }
    // the people on their way: walking, being read (glyphs), and their twins flying to their slots
    for (const w of walkers) {
      if (w.phase === "walk") {
        const s = Math.floor(t * 5 + w.n) % 2 ? S.step : S.person;
        stamp(s.img, w.x, w.y - (s === S.step ? 1 : 0), s.w, s.h, 0.95);
      } else if (w.phase === "read") {
        PERSON.forEach((l, k) =>
          [...l].forEach((ch, i) => {
            if (ch === " ") return;
            const g = gl[Math.floor(hash(w.n, k * 3 + i, Math.floor(t * 24)) * GLYPHS.length)];
            stamp(g.img, w.x + i * m.cw, w.y + k * lh, g.w, g.h, 0.95);
          }),
        );
      } else stamp(S.twin.img, w.x, w.y, S.twin.w, S.twin.h, 1);
    }
    c.globalAlpha = 1;
  }

  const frame = (now: number) => {
    raf = 0;
    if (!onScreen || document.hidden) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    update(dt);
    last = now;
    draw();
    raf = requestAnimationFrame(frame);
  };
  const run = () => {
    if (reduced || raf || !onScreen || document.hidden || !S) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const io = new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    run();
  });
  const ro = new ResizeObserver(() => {
    if (setup()) draw();
    run();
  });
  const onVis = () => run();
  // the figures are written in the terminal's type: drawn once it is in
  document.fonts.load(`500 11px ${family}`).finally(() => {
    if (gone) return;
    io.observe(canvas);
    ro.observe(canvas);
    document.addEventListener("visibilitychange", onVis);
  });

  return {
    destroy() {
      gone = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    },
  };
}
