// Anatomy's measuring, kept free of React. Every pin is measured on the live DOM with
// getBoundingClientRect, in the stage's own coordinates. Inside a same-origin iframe the frame's rect
// gives both the offset and the scale (its drawn width over its layout width), so a scaled
// ViewportPreview pins at the right place without being told its scale. Padding is read from the
// part's computed style in its own window and scaled the same way.

export type AnatomyPin = {
  /** the number on the disc, the pin's place in the list by default */
  n?: number;
  /** a CSS selector, inside the specimen or inside the frame's document */
  selector: string;
  /** which match, when the selector matches more than one (0 by default) */
  index?: number;
  /** the part's name in the legend */
  name: string;
  token?: string;
  value?: string;
  /** file:line the value comes from */
  source?: string;
  /** text the cited line must contain (a class, a declaration), or a list of them across a cite that names
   *  several lines ("49-50"), so a cite that drifts onto a brace or a blank line is caught at build rather
   *  than read as true */
  expect?: string | readonly string[];
  /** draw the part's padding as hatched bands */
  padding?: boolean;
  /** the margin its disc sits in, by default the side nearer the part */
  side?: "left" | "right";
};

export type Box = { x: number; y: number; w: number; h: number };
export type Pad = { t: number; r: number; b: number; l: number };
/** ok: drawn. hidden: matched but zero sized or out of view. lost: no match, the drift alarm.
 *  pending: the frame has not loaded yet. */
export type PinStatus = "ok" | "hidden" | "lost" | "pending";
export type Measured = { status: PinStatus; box?: Box; pad?: Pad };

/** clip: the part of the stage the scope shows (a frame is clipped by its box) */
type Scope = { doc: Document; win: Window; scale: number; ox: number; oy: number; clip: Box };

/** The first same-origin iframe in the stage (or the one matching a selector) once it has loaded. */
function frameScope(stage: HTMLElement, frame: true | string, sr: DOMRect): Scope | null {
  const f = stage.querySelector<HTMLIFrameElement>(frame === true ? "iframe" : frame);
  if (!f) return null;
  try {
    const doc = f.contentDocument;
    const win = f.contentWindow;
    if (!doc || !win || doc.readyState !== "complete" || win.location.href === "about:blank") return null;
    const fr = f.getBoundingClientRect();
    const scale = f.offsetWidth ? fr.width / f.offsetWidth : 1;
    const cr = (f.closest(".ds-vp-box") ?? f.parentElement ?? f).getBoundingClientRect();
    const clip = { x: cr.left - sr.left, y: cr.top - sr.top, w: cr.width, h: cr.height };
    return { doc, win, scale, ox: fr.left - sr.left, oy: fr.top - sr.top, clip };
  } catch {
    return null;
  }
}

function padOf(el: Element, win: Window, scale: number): Pad {
  const cs = win.getComputedStyle(el);
  const px = (v: string) => (parseFloat(v) || 0) * scale;
  return { t: px(cs.paddingTop), r: px(cs.paddingRight), b: px(cs.paddingBottom), l: px(cs.paddingLeft) };
}

/** Measures every pin. In frame mode every pin is pending until the frame has loaded. */
export function measurePins(stage: HTMLElement, pins: readonly AnatomyPin[], frame?: true | string): Measured[] {
  const sr = stage.getBoundingClientRect();
  const scope: Scope | null = frame
    ? frameScope(stage, frame, sr)
    : { doc: document, win: window, scale: 1, ox: -sr.left, oy: -sr.top, clip: { x: 0, y: 0, w: sr.width, h: sr.height } };
  if (!scope) return pins.map(() => ({ status: "pending" }));

  return pins.map((pin) => {
    let el: Element | undefined;
    try {
      el = (frame ? scope.doc : stage).querySelectorAll(pin.selector)[pin.index ?? 0];
    } catch {
      el = undefined;
    }
    if (!el) return { status: "lost" };
    const r = el.getBoundingClientRect();
    const box: Box = {
      x: scope.ox + r.left * scope.scale,
      y: scope.oy + r.top * scope.scale,
      w: r.width * scope.scale,
      h: r.height * scope.scale,
    };
    const c = scope.clip;
    const outside = box.x + box.w < c.x || box.y + box.h < c.y || box.x > c.x + c.w || box.y > c.y + c.h;
    if (box.w < 0.5 || box.h < 0.5 || outside) return { status: "hidden", box };
    const x = Math.max(box.x, c.x);
    const y = Math.max(box.y, c.y);
    const shown: Box = { x, y, w: Math.min(box.x + box.w, c.x + c.w) - x, h: Math.min(box.y + box.h, c.y + c.h) - y };
    const clipped = shown.w < box.w - 0.5 || shown.h < box.h - 0.5;
    const pad = pin.padding && !clipped ? padOf(el, scope.win, scope.scale) : undefined;
    return { status: "ok", box: shown, pad };
  });
}

export type Callout = {
  n: number;
  box: Box;
  pad?: Pad;
  /** the disc's centre, in the margin */
  disc: { x: number; y: number };
  /** where the leader meets the part */
  anchor: { x: number; y: number };
};

const DISC = 20;
const GAP = 24;

/** Places the discs in the side margins, top to bottom without overlap, each leader meeting its part's
 *  nearer edge level with the disc where it can. */
export function layoutCallouts(
  pins: readonly AnatomyPin[],
  measured: readonly Measured[],
  width: number,
  gutter: number,
): Callout[] {
  const sides: Record<"left" | "right", Callout[]> = { left: [], right: [] };
  pins.forEach((pin, i) => {
    const m = measured[i];
    if (m?.status !== "ok" || !m.box) return;
    const b = m.box;
    const side = pin.side ?? (b.x + b.w / 2 <= width / 2 ? "left" : "right");
    const x = side === "left" ? gutter / 2 : width - gutter / 2;
    sides[side].push({ n: pin.n ?? i + 1, box: b, pad: m.pad, disc: { x, y: b.y + b.h / 2 }, anchor: { x: 0, y: 0 } });
  });
  for (const side of ["left", "right"] as const) {
    const list = sides[side].sort((a, b) => a.disc.y - b.disc.y);
    let floor = DISC / 2;
    for (const c of list) {
      c.disc.y = Math.max(c.disc.y, floor);
      floor = c.disc.y + GAP;
      const b = c.box;
      c.anchor = {
        x: side === "left" ? b.x : b.x + b.w,
        y: Math.min(b.y + b.h - 1, Math.max(b.y + 1, c.disc.y)),
      };
    }
  }
  return [...sides.left, ...sides.right].sort((a, b) => a.n - b.n);
}

/** The pad bands of a box as four rects (top, right, bottom, left), skipping empty ones. */
export function padBands(b: Box, p: Pad): Box[] {
  return [
    { x: b.x, y: b.y, w: b.w, h: p.t },
    { x: b.x + b.w - p.r, y: b.y + p.t, w: p.r, h: b.h - p.t - p.b },
    { x: b.x, y: b.y + b.h - p.b, w: b.w, h: p.b },
    { x: b.x, y: b.y + p.t, w: p.l, h: b.h - p.t - p.b },
  ].filter((r) => r.w > 0.5 && r.h > 0.5);
}
