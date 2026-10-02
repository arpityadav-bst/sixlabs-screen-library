// The radius section's data: the ladder is RADIUS in tokens. Here are the nesting diagram's rows (quoted
// from the language menu), the assertions behind its numbers and its pins.
import type { AnatomyPin } from "@/app/design-system/_kit/anatomy-measure";
import { RADIUS } from "@/components/design-system/tokens";
import { site, type Assertion } from "./foundation-assert";
import { check } from "./foundation-scan";

/** Every step but the caret, which is a 1px detail rather than a surface. */
export const LADDER = RADIUS.filter((t) => t.name !== "radius-caret");

export const RADIUS_VALUES = RADIUS.map((t) => ({ part: t.useFor, token: `--ds-${t.name}`, value: t.value, source: t.source }));

export const RADIUS_CODE = `import { cssVar } from "@/components/design-system/tokens";

<div style={{ borderRadius: cssVar("radius-lg") }}>...</div>`;

/** The language menu's panel and rows, the site's one nested pair. */
export const NEST_PANEL = site("LanguageMenu.tsx", "w-48 p-1.5 rounded-2xl");
export const NEST_ROW = site("LanguageMenu.tsx", "px-3 py-2.5 rounded-xl");

/** A pin's file:line and expect, both from the assertion its number was read off. */
const cited = (a: Assertion) => ({ source: check(a).at, expect: a.needles[0] });

/** The diagram's two layers, pinned with the language panel's own numbers. */
export const NEST_PINS: readonly AnatomyPin[] = [
  { selector: "[data-ds-nest]", name: "Panel", token: "--ds-radius-sm, --ds-space-1-5", value: "16 radius, 6 padding",
    ...cited(NEST_PANEL), padding: true, side: "right" },
  { selector: "[data-ds-row]", name: "Row", token: "--ds-radius-xs", value: "12, the panel's 16 less 6, up to a step",
    ...cited(NEST_ROW) },
];

export const NEST_ROWS = [
  { code: "US", label: "English" },
  { code: "KR", label: "한국어" },
  { code: "JP", label: "日本語" },
] as const;

/** The double spellings of one value, each asserted in its file. */
export const SPELLINGS = [
  { key: "16px", value: "rounded-[16px] in the terminal, rounded-2xl in the language panel",
    asserts: [site("JobTerminal.tsx", "rounded-[16px]"), NEST_PANEL] },
  { key: "12px", value: "rounded-[12px] in the tag panel, rounded-xl in the language rows",
    asserts: [site("Jobs.tsx", "rounded-[12px] border"), NEST_ROW] },
] as const;
