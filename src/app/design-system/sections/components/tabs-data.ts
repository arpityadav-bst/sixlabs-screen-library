// The Tabs section's data: filler tab sets, state list, pins, drawer rows and the snippet.
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { TAB_SIZE, type TabsSize } from "@/components/design-system/tabs-styles";
import { FORCE_PROP } from "./act-sel-rows";
import { heightOf, sizeNames, sv, tv, type Pin } from "./display-values";

/** The rungs, read from TAB_SIZE, so the ladder cannot drift from the part. */
export const TAB_SIZES: readonly { name: TabsSize; px: number }[] = sizeNames(TAB_SIZE).map((name) => ({ name, px: heightOf(TAB_SIZE[name].tab) }));

export const TAB_STATES = ["rest", "hover", "selected", "focus-visible", "pressed", "disabled"] as const;

/** Filler sets: three for the specimens, two for the state grid, seven for the phone box. */
export const THREE_TABS = [
  { id: "overview", label: "Overview" },
  { id: "activity", label: "Activity", count: 12 },
  { id: "settings", label: "Settings" },
] as const;
export const TWO_TABS = [
  { id: "overview", label: "Overview" },
  { id: "activity", label: "Activity" },
] as const;
export const MANY_TABS = [
  { id: "overview", label: "Overview" },
  { id: "activity", label: "Activity" },
  { id: "players", label: "Players" },
  { id: "reports", label: "Reports" },
  { id: "models", label: "Models" },
  { id: "billing", label: "Billing" },
  { id: "settings", label: "Settings" },
] as const;

export const PANEL_COPY = {
  overview: "Panel one copy.",
  activity: "Panel two copy.",
  settings: "Panel three copy.",
} as const;

const TS = "tabs-styles.ts";

export const TAB_PINS: readonly Pin[] = [
  { selector: "[data-pin=tabs] [role=tablist]", name: "List", token: "--ds-color-line", value: "1px hairline drawn inside", source: `${TS}:17-18`, expect: ["TAB_LIST", "shadow-[inset_0_-1px_0_var(--ds-color-line)]"] },
  { selector: "[data-pin=tabs] [role=tab] svg", index: 0, name: "Icon", token: "--ds-icon-16", value: "md · gap 6", source: `Tabs.tsx:144, ${TS}:31`, expect: ["<Icon aria-hidden size={s.icon}", "inline-flex items-center gap-1.5"] },
  { selector: "[data-pin=tabs] [role=tab][aria-selected=true] > span:first-child", name: "Selected label", token: "--ds-color-ink", value: "Inter 15 / 500", source: `${TS}:12,26, Tabs.tsx:147`, expect: ['md: { tab: "h-11 text-[15px] font-sans"', "aria-selected:text-(--ds-color-ink)", '${on ? "font-medium" : ""}'] },
  { selector: "[data-pin=tabs] [aria-selected=true] > span:last-child", name: "Indicator", token: "--ds-color-primary", value: "2px · as wide as the label", source: `${TS}:35-36`, expect: ["TAB_INDICATOR", "absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-(--ds-color-primary)"] },
  { selector: "[data-pin=tabs] [role=tab]:nth-child(2) > span > span:last-child", name: "Count", value: "Badge sm, mono 11 caps", source: "Tabs.tsx:152", expect: '<Badge size="sm">{t.count}</Badge>', side: "right" },
  { selector: "[data-pin=tabs] [role=tab]:nth-child(3)", name: "Rest tab", token: "--ds-color-text-muted", value: "md · 44 tall · gap 28", source: `${TS}:12,24`, expect: ['md: { tab: "h-11', 'gap: "gap-5"', "text-(--ds-color-text-muted)"], side: "right" },
];

export const TAB_VALUES: readonly ValueRow[] = [
  tv("List hairline", "color-line"),
  tv("Rest label", "color-text-muted"),
  tv("Hover and selected label", "color-ink"),
  tv("Disabled label", "color-text-quiet"),
  tv("Indicator", "color-primary"),
  tv("Indicator slide", "spring-thumb"),
  tv("Label colour", "dur-ui"),
  tv("Panel exit", "dur-exit"),
  tv("Ring", "focus-color"),
  sv("Heights", TAB_SIZES.map((s) => `${s.name} ${s.px}`).join(" · "), `${TS}:11-13`),
  sv("Labels", "13 Inter · 15 Inter · 18 Outfit at -0.01em, 500 when selected", `${TS}:11-13`),
  sv("Label to label", "20 · 28 · 32", `${TS}:8-13`),
  sv("Indicator", "2px, inset 4 to the label's width", `${TS}:35-36`),
  sv("Ring", "inset 2px, radius 6, so the scrolling list cannot clip it", "Tabs.tsx:141"),
  sv("Panel", "fades in over 200ms with a 4px rise, none under reduced motion", "Tabs.tsx:175"),
];

export const TAB_PROPS: readonly PropRow[] = [
  { name: "items", type: "{ id, label, icon?, count?, disabled? }[]" },
  { name: "value, onChange", type: "T, (id: T) => void" },
  { name: "label", type: "string", note: "the tab list's accessible name" },
  { name: "size", type: "sm | md | lg", default: "md" },
  { name: "activation", type: "auto | manual", default: "auto" },
  { name: "panels", type: "Partial<Record<T, ReactNode>>", note: "cross-faded under the list" },
  { name: "indicatorId", type: "string", note: "unique per instance by default" },
  { name: "forceOn", type: "T", note: "the tab a forced hover or press shows on" },
  FORCE_PROP,
];

export const TAB_CODE = `import { Tabs } from "@/components/design-system/Tabs";

<Tabs
  label="Account"
  items={[{ id: "overview", label: "Overview" }, { id: "activity", label: "Activity" }]}
  value={tab}
  onChange={setTab}
  panels={{ overview: <Overview />, activity: <Activity /> }}
/>`;
