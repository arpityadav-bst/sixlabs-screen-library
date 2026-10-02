// WCAG 2 contrast maths for the token cards. A colour with alpha is composited over the ground first,
// because that is the colour the reader sees. Text grades follow 1.4.3 and 1.4.6: AAA at 7, AA at 4.5,
// AA large at 3 (text 24px, or 18.66px bold), fail under that. A ring, a field line or a mark is graded on
// 1.4.11 instead, pass at 3 and fail under, because a text grade means nothing for a line.

import { tokenByName } from "@/components/design-system/tokens";

export type RGBA = { r: number; g: number; b: number; a: number };

/** A ground token's plain sRGB colour (its srgb twin when the value is oklch). Throws on an unknown name. */
function ground(name: string): string {
  const t = tokenByName(name);
  if (!t) throw new Error(`contrast: no token ${name}`);
  return t.srgb ?? t.value;
}

/** The four grounds every swatch is judged on, read from their tokens. */
export const CONTRAST_GROUNDS = {
  page: ground("color-page"),
  surface: ground("color-surface"),
  container: ground("color-container"),
  navy: ground("color-primary"),
} as const;

/** @deprecated the old name, kept while badge-tag-data.ts moves to CONTRAST_GROUNDS */
export const GROUNDS = CONTRAST_GROUNDS;

export type GroundName = keyof typeof CONTRAST_GROUNDS;
export const GROUND_NAMES = Object.keys(CONTRAST_GROUNDS) as GroundName[];

export type Grade = "AAA" | "AA" | "AA large" | "fail";
/** 1.4.11's one bar for a ring, a line or a mark */
export type NonTextGrade = "pass" | "fail";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function channel(part: string, max: number): number {
  const v = part.trim();
  return v.endsWith("%") ? (parseFloat(v) / 100) * max : parseFloat(v);
}

/** Reads #rgb, #rgba, #rrggbb, #rrggbbaa, rgb() and rgba() in either comma or space syntax. */
export function parseColor(input: string): RGBA | null {
  const s = input.trim().toLowerCase();
  if (s === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
  if (s.startsWith("#")) {
    let h = s.slice(1);
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join("");
    if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/.test(h)) return null;
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
  }
  const m = /^rgba?\(([^)]+)\)$/.exec(s);
  if (!m) return null;
  const [rgb, alpha] = m[1].split("/");
  const parts = rgb.split(/[\s,]+/).filter(Boolean);
  if (parts.length < 3) return null;
  const a = alpha ?? parts[3];
  return {
    r: clamp(channel(parts[0], 255), 0, 255),
    g: clamp(channel(parts[1], 255), 0, 255),
    b: clamp(channel(parts[2], 255), 0, 255),
    a: a === undefined ? 1 : clamp(channel(a, 1), 0, 1),
  };
}

/** fg over bg by plain alpha compositing. bg is treated as opaque. */
export function composite(fg: RGBA, bg: RGBA): RGBA {
  const a = fg.a;
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
    a: 1,
  };
}

/** WCAG relative luminance of an opaque colour. */
export function luminance({ r, g, b }: RGBA): number {
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** The ratio of fg on bg (1 to 21), or null when either colour does not parse. */
export function contrastRatio(fg: string, bg: string): number | null {
  const f = parseColor(fg);
  const b = parseColor(bg);
  if (!f || !b) return null;
  const ground = composite(b, { r: 255, g: 255, b: 255, a: 1 });
  const l1 = luminance(composite(f, ground));
  const l2 = luminance(ground);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export function grade(ratio: number): Grade {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA large";
  return "fail";
}

/** A ring, field line or mark's grade: 3:1 passes (1.4.11). */
export function nonTextGrade(ratio: number): NonTextGrade {
  return ratio >= 3 ? "pass" : "fail";
}

/** "4.53" (two decimals, rounded down so a ratio never reads as passing when it does not) */
export function formatRatio(ratio: number): string {
  return (Math.floor(ratio * 100) / 100).toFixed(2);
}

export const isGround = (v: string): v is GroundName => Object.prototype.hasOwnProperty.call(CONTRAST_GROUNDS, v);

/** A ground name or any colour string, as a colour. */
export function groundColor(bg: GroundName | string): string {
  return isGround(bg) ? CONTRAST_GROUNDS[bg] : bg;
}

/** True when two colour strings are the same colour (alpha to 1/255). */
export function sameColor(a: string, b: string): boolean {
  const x = parseColor(a);
  const y = parseColor(b);
  if (!x || !y) return a.trim().toLowerCase() === b.trim().toLowerCase();
  const near = (p: number, q: number) => Math.abs(p - q) < 0.5;
  return near(x.r, y.r) && near(x.g, y.g) && near(x.b, y.b) && Math.abs(x.a - y.a) < 1 / 255;
}
