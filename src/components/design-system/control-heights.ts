// Which sizes line up. Each family keeps the size names its own ladder needs (a field's md is 44, a
// button's md is 40), so a size name never promises a height across families. This is the pairing to
// read instead: every control height the system draws, and the sizes of each family that reach it, read
// from each family's own size map, so it cannot drift from them. Every family counts its outer box:
// Segmented stands its segment plus the track's inset on each side (space-1), so its sm is 40, not 32.
// Put controls in one row by height, never by name: a md TextInput sits with a lg IconButton, a lg
// TextInput with an xl Button.
import { BUTTON_SIZE } from "./button-styles";
import { CHIP_SIZE } from "./chip-styles";
import { FIELD_SIZE } from "./field-styles";
import { ICON_BUTTON_SIZE } from "./icon-button-styles";
import { SEARCH_SIZE } from "./search-styles";
import { SEG_SIZE } from "./segmented-styles";
import { TAB_SIZE } from "./tabs-styles";
import { SPACING } from "./token-space";

/** The height a class string sets: h-N on Tailwind's 4px scale, or h-[Npx]. */
function heightOf(classes: string): number {
  const step = /(?:^|\s)h-(\d+(?:\.\d+)?)(?=\s|$)/.exec(classes);
  if (step) return Number(step[1]) * 4;
  const px = /(?:^|\s)h-\[(\d+(?:\.\d+)?)px\](?=\s|$)/.exec(classes);
  if (px) return Number(px[1]);
  throw new Error(`control-heights: no height in "${classes}"`);
}

const inset = parseFloat(SPACING.find((t) => t.name === "space-1")?.value ?? "NaN");
if (Number.isNaN(inset)) throw new Error("control-heights: no space-1 token for the segmented track's inset");

/** Each family's sizes and the outer height each one stands. */
const FAMILIES: readonly { family: string; sizes: Readonly<Record<string, number>> }[] = [
  { family: "Button", sizes: map(BUTTON_SIZE, (s) => heightOf(s.box)) },
  { family: "IconButton", sizes: map(ICON_BUTTON_SIZE, (s) => s.px) },
  { family: "SearchField", sizes: map(SEARCH_SIZE, (s) => heightOf(s.h)) },
  { family: "Chip", sizes: map(CHIP_SIZE, heightOf) },
  { family: "Segmented", sizes: map(SEG_SIZE, (s) => heightOf(s) + 2 * inset) },
  { family: "TextInput and Select", sizes: map(FIELD_SIZE, (s) => heightOf(s.h)) },
  { family: "Tabs", sizes: map(TAB_SIZE, (s) => heightOf(s.tab)) },
];

function map<K extends string, V>(sizes: Readonly<Record<K, V>>, px: (v: V) => number): Record<string, number> {
  return Object.fromEntries(Object.entries<V>(sizes).map(([k, v]) => [k, px(v)]));
}

/** Every height a control stands, smallest first, with the sizes that reach it ("Button xs"). */
export const CONTROL_HEIGHTS: readonly { px: number; parts: readonly string[] }[] = (() => {
  const by = new Map<number, string[]>();
  for (const { family, sizes } of FAMILIES) {
    for (const [size, px] of Object.entries(sizes)) by.set(px, [...(by.get(px) ?? []), `${family} ${size}`]);
  }
  return [...by.entries()].sort(([a], [b]) => a - b).map(([px, parts]) => ({ px, parts }));
})();
