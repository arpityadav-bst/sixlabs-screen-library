// Values for the language menu section: the open panel's pins (measured in the language frame), the
// states the live menu cannot be forced into, and the drawer rows, each with its file:line.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import type { Pin } from "@/app/design-system/sections/components/display-values";

export const OPEN_PINS: readonly Pin[] = [
  { selector: 'button[aria-haspopup="listbox"]', name: "Trigger, open", token: "--ds-color-fill-open", value: "px 10 py 6 · about 30 tall", source: "LanguageMenu.tsx:58-59", expect: ["px-2.5 py-1.5", "bg-slate-200/60"], padding: true, side: "right" },
  { selector: 'button[aria-haspopup="listbox"] svg', name: "Globe", value: "18 · turned 20° while open", source: "LanguageMenu.tsx:62-63", expect: ["rotate: open ? 20 : 0", "w-[18px] h-[18px]"], side: "left" },
  { selector: 'ul[role="listbox"]', name: "Panel", token: "--ds-shadow-pop", value: "w 192 · p 6 · radius 16 · white at 95%", source: "LanguageMenu.tsx:78", expect: ["w-48 p-1.5 rounded-2xl bg-white/95", "shadow-[0_18px_50px_-12px_rgba(10,27,51,0.18)]"], padding: true, side: "left" },
  { selector: 'li[role="option"]', name: "Row", token: "--ds-radius-xs", value: "px 12 py 10 · gap 12 · radius 12", source: "LanguageMenu.tsx:90", expect: "gap-3 px-3 py-2.5 rounded-xl", padding: true, side: "right" },
  { selector: 'li[role="option"] > span.absolute', name: "Highlight", token: "--ds-color-fill-highlight", value: "slate-100 · one layoutId", source: "LanguageMenu.tsx:93", expect: ['layoutId="lang-highlight"', "bg-slate-100"], side: "left" },
  { selector: 'li[aria-selected="true"] svg', name: "Check", token: "--ds-color-ink", value: "16 · selected row only", source: "LanguageMenu.tsx:99", expect: "w-4 h-4 text-[#0a1b33]", side: "right" },
];

/** The live menu's states, which are internal (no props) and so cannot be forced. */
export const LANGUAGE_STATES: readonly KeyRow[] = [
  { key: "trigger rest", value: "slate-500, no fill", source: "LanguageMenu.tsx:59" },
  { key: "trigger hover", value: "accent over 200ms", source: "LanguageMenu.tsx:59" },
  { key: "trigger open", value: "slate-200 at 60%, ink, the globe turned 20° on the spring", source: "LanguageMenu.tsx:59" },
  { key: "trigger focus", value: "missing: the browser's own outline only" },
  { key: "row active", value: "the slate-100 highlight glides under it, from the pointer or the arrows, wrapping", source: "LanguageMenu.tsx:93" },
  { key: "row selected", value: "label at 500 in ink and a Check 16", source: "LanguageMenu.tsx:96" },
  { key: "keys", value: "ArrowUp and ArrowDown move, Enter or Space choose and close, Escape closes. Tab leaves the panel open", source: "LanguageMenu.tsx:41" },
  { key: "outside", value: "a pointerdown anywhere else closes it", source: "LanguageMenu.tsx:35" },
];

export const LANGUAGE_VALUES: readonly ValueRow[] = [
  { part: "Trigger", value: "Globe 18 · code 12/500 at 18 wide · px 10 py 6 · gap 6 · pill", source: "LanguageMenu.tsx:58" },
  { part: "Trigger, open", token: "--ds-color-fill-open", value: "slate-200 at 60%", source: "LanguageMenu.tsx:59" },
  { part: "Panel", token: "--ds-color-surface-95", value: "w 192 · p 6 · radius 16 · white at 95% · slate-200 stroke at 70% · 12 below the trigger", source: "LanguageMenu.tsx:78" },
  { part: "Panel shadow", token: "--ds-shadow-pop", value: "0 18px 50px -12px rgba(10,27,51,0.18)", source: "LanguageMenu.tsx:78" },
  { part: "Panel blur", value: "backdrop-blur-xl, and a 4px filter blur on the way in", source: "LanguageMenu.tsx:21" },
  { part: "Row", token: "--ds-radius-xs", value: "px 12 py 10 · radius 12 · gap 12", source: "LanguageMenu.tsx:90" },
  { part: "Row code", token: "--ds-color-text-quiet", value: "11 · 600 · tracking wide · slate-400", source: "LanguageMenu.tsx:95" },
  { part: "Row label", value: "15 · slate-600, or 500 in ink when selected", source: "LanguageMenu.tsx:96" },
  { part: "Highlight", token: "--ds-color-fill-highlight", value: "slate-100, shared by every row through one layoutId", source: "LanguageMenu.tsx:93" },
  { part: "Spring", token: "--ds-spring-pop", value: "stiffness 460 · damping 34 · mass 0.7", source: "LanguageMenu.tsx:17" },
  { part: "Stagger", value: "rows 35ms apart, after 40ms", source: "LanguageMenu.tsx:22" },
  { part: "Exit", token: "--ds-dur-exit", value: "140ms ease-in, scale 0.97, up 4px", source: "LanguageMenu.tsx:23" },
];

export const LANGUAGE_CODE = `import { LayoutGroup } from "motion/react";
import { LanguageMenu } from "@/components/website/LanguageMenu";

// one LayoutGroup per instance, so the highlight never jumps between two menus
<LayoutGroup id="lang-head">
  <LanguageMenu />
</LayoutGroup>`;
