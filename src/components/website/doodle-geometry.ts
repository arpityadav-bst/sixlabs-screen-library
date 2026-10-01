// The doodles' geometry (DoodleStroke.tsx): a stroke's points as the page draws them, in the portrait's own
// 810 x 1080 frame. The hand's waver used to be an SVG filter over the whole drawing (feTurbulence and
// feDisplacementMap, at ROUGH_FREQ and up to WOBBLE frame px, pushing the line along the diagonal), redrawn
// every frame a stroke drew in; Safari does that on the processor, and it held the players' section at 3 to 7
// fps there. The same waver is worked into each hand stroke's points once instead: every point is pushed off
// its path by a smooth two-octave noise of the frame position (fixed seed), along the diagonal, as the filter
// pushed its pixels. A dotted stroke is its dots, DOT_GAP apart along the line.
import type { Stroke } from "./player-doodles";

export const SIZE = 0.7; // each drawing's size against how its strokes are written, about its own centre
const WOBBLE = 6;
const ROUGH_FREQ = 0.03;
const STEP = 2; // frame px between the points a wavering line is drawn through
const MIN_POINTS = 32; // and at least this many a piece, so a small circle stays round
export const DOT_GAP = 15; // frame px between a dotted stroke's dots

// smooth noise in about -1..1: gradient noise on a shuffled lattice (seeded, so every visit wavers alike)
const P = new Uint8Array(512);
{
  const p = Array.from({ length: 256 }, (_, i) => i);
  let s = 7;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) P[i] = p[i & 255];
}
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const grad = (h: number, x: number, y: number) => (h & 1 ? -x : x) + (h & 2 ? -y : y);
function noise(x: number, y: number) {
  const X = Math.floor(x),
    Y = Math.floor(y),
    fx = x - X,
    fy = y - Y,
    u = fade(fx),
    v = fade(fy);
  const a = P[X & 255] + (Y & 255),
    b = P[(X + 1) & 255] + (Y & 255);
  const top = grad(P[a], fx, fy) + u * (grad(P[b], fx - 1, fy) - grad(P[a], fx, fy));
  const bot = grad(P[a + 1], fx, fy - 1) + u * (grad(P[b + 1], fx - 1, fy - 1) - grad(P[a + 1], fx, fy - 1));
  return top + v * (bot - top);
}
// how far the hand pushes the line at a frame point, frame px (both axes, as the filter's single channel did)
const push = (x: number, y: number) =>
  (WOBBLE * (noise(x * ROUGH_FREQ, y * ROUGH_FREQ) + 0.5 * noise(x * ROUGH_FREQ * 2 + 17.3, y * ROUGH_FREQ * 2 + 9.1))) / 1.5;

// a stroke's own placement (a drawing shrunk about its centre and moved close round the head): point to frame
export const scaleOf = (s: Stroke) => (s.o ? SIZE * (s.scale ?? 1) : 1);
const place = (s: Stroke) => {
  if (!s.o) return (x: number, y: number) => [x, y] as const;
  const k = scaleOf(s),
    [ox, oy] = s.o,
    [tx, ty] = s.to ?? s.o;
  return (x: number, y: number) => [tx + k * (x - ox), ty + k * (y - oy)] as const;
};

let probe: SVGPathElement | null = null;
// points every `step` along one piece of a path (one moveto's worth), at least MIN_POINTS
function along(d: string, step: number) {
  probe ??= document.createElementNS("http://www.w3.org/2000/svg", "path");
  probe.setAttribute("d", d);
  const L = probe.getTotalLength(),
    n = Math.max(MIN_POINTS, Math.round(L / step));
  return Array.from({ length: n + 1 }, (_, i) => {
    const q = probe!.getPointAtLength((i / n) * L);
    return [q.x, q.y] as const;
  });
}

// the hand's line through the frame, wavering, as an SVG path: each of a stroke's pieces (a tick mark, an
// eye, a dash of a clock face: every moveto starts one) traced on its own, never joined to the next
export function waveredPath(s: Stroke) {
  const to = place(s),
    k = scaleOf(s);
  return s.d
    .split(/(?=M)/)
    .filter((piece) => piece.trim())
    .map((piece) =>
      along(piece, STEP / k)
        .map(([x, y], i) => {
          const [fx, fy] = to(x, y),
            w = push(fx, fy);
          return `${i ? "L" : "M"}${(fx - w).toFixed(1)} ${(fy - w).toFixed(1)}`;
        })
        .join(""),
    )
    .join("");
}

// a dotted stroke's dots: in the frame and wavering (the hand) or as written (the AI's copy, which is drawn in
// the stroke's own placement), each with how far along the line it sits (0..1)
export function strokeDots(s: Stroke, hand: boolean) {
  const to = place(s),
    k = scaleOf(s);
  probe ??= document.createElementNS("http://www.w3.org/2000/svg", "path");
  probe.setAttribute("d", s.d);
  const L = probe.getTotalLength(),
    gap = DOT_GAP / k;
  const out: { x: number; y: number; at: number }[] = [];
  for (let l = 0; l <= L + 1e-6; l += gap) {
    const q = probe.getPointAtLength(l);
    let x = q.x,
      y = q.y;
    if (hand) {
      const [fx, fy] = to(x, y),
        w = push(fx, fy);
      x = fx - w;
      y = fy - w;
    }
    out.push({ x, y, at: L ? l / L : 0 });
  }
  return out;
}
