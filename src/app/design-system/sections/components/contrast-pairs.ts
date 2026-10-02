// The colour pairs the Components sections grade with a ContrastBadge, read from the parts' own class
// strings, so a badge follows whatever value the part lands on. A colour with alpha is laid over its ground
// first, because that is the colour the reader sees.
import { composite, parseColor } from "@/app/design-system/_kit/contrast";
import { tokenColour } from "./display-values";

/** The players' accent water, the ground every on-blue pair is judged on. */
export const WATER = tokenColour("color-accent");

const hex2 = (n: number) => Math.round(n).toString(16).padStart(2, "0");

/** top laid over under, as an opaque #rrggbb. */
export function blend(top: string, under: string): string {
  const t = parseColor(top);
  const u = parseColor(under);
  if (!t || !u) throw new Error(`Components: cannot blend ${top} over ${under}`);
  const c = composite(t, u);
  return `#${hex2(c.r)}${hex2(c.g)}${hex2(c.b)}`;
}

type Prop = "bg" | "text" | "border" | "ring";

/** The --ds- token a class string gives one property at rest, or undefined when it is white or unset. */
export function restToken(cls: string, prop: Prop): string | undefined {
  const head = `${prop}-(--ds-`;
  for (const c of cls.split(/\s+/)) {
    if (c.startsWith(head) && c.endsWith(")")) return c.slice(head.length, -1);
  }
  return undefined;
}

/** The rest colour a class string gives one property (bg, text, border, ring): a --ds- token's value,
 *  white, white at an alpha or transparent, read from the class with no variant in front of it. */
export function restColour(cls: string, prop: Prop): string {
  for (const c of cls.split(/\s+/)) {
    if (!c.startsWith(`${prop}-`)) continue;
    const v = c.slice(prop.length + 1);
    const tok = /^\(--ds-([\w-]+)\)(?:\/(\d+))?$/.exec(v);
    if (tok) {
      const base = tokenColour(tok[1]);
      if (!tok[2]) return base;
      const rgb = parseColor(base);
      if (!rgb) throw new Error(`Components: cannot read --ds-${tok[1]}`);
      return `rgb(${rgb.r} ${rgb.g} ${rgb.b} / ${(rgb.a * Number(tok[2])) / 100})`;
    }
    if (v === "white") return "#ffffff";
    if (v === "transparent") return "transparent";
    if (/^white\/\d+$/.test(v)) return `rgb(255 255 255 / ${Number(v.split("/")[1]) / 100})`;
  }
  throw new Error(`Components: no rest ${prop} colour in "${cls.slice(0, 60)}"`);
}
