// Data for the Select and search section. Options are the site's own lists: the player types
// (players-data.ts), the job tags (jobs-data.ts) and the FAQ questions (faq-data.ts).
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import type { SelectOption } from "@/components/design-system/select-panel";
import { QUESTIONS } from "@/components/website/faq-data";
import { JOBS } from "@/components/website/jobs-data";
import { PLAYERS } from "@/components/website/players-data";
import type { Pin } from "../display-values";

const SP = "select-panel.tsx";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export const PLAYER_OPTIONS: readonly SelectOption[] = PLAYERS.map((p) => ({ value: p.id, label: p.title }));

/** Job tags grouped under their job, with one row disabled to show the state. */
export const TAG_OPTIONS: readonly SelectOption[] = JOBS.flatMap((j) =>
  j.tags.map((t) => ({ value: slug(t), label: t, group: j.title, disabled: t === "Large scale" })),
);
export const TAG_SELECTED = slug(JOBS[1].tags[1]);
export const TAG_ACTIVE = slug(JOBS[1].tags[0]);

export const QUESTION_OPTIONS: readonly SelectOption[] = QUESTIONS.map((q) => ({ value: slug(q.q), label: q.q }));

export function matchQuestions(query: string): readonly SelectOption[] {
  const q = query.trim().toLowerCase();
  return q ? QUESTION_OPTIONS.filter((o) => o.label.toLowerCase().includes(q)).slice(0, 6) : [];
}

export const SELECT_STATES = ["rest", "hover", "focus", "open", "filled", "disabled", "read-only", "invalid"] as const;
export type SelectState = (typeof SELECT_STATES)[number];
export const SEARCH_STATES = ["empty", "hover", "focus", "filled", "results", "searching", "no-results", "disabled"] as const;
export type SearchState = (typeof SEARCH_STATES)[number];
export const SIZES = ["sm", "md", "lg"] as const;

const SS = "search-styles.ts";

export const SELECT_PINS: readonly Pin[] = [
  { selector: "[data-slot=label]", name: "Label", value: "Inter 13/18 500", source: "field-styles.ts:82-83", expect: ["FIELD_LABEL", "text-[13px] font-medium leading-[18px]"], side: "left" },
  { selector: "[data-slot=box]", name: "Trigger", token: "--ds-color-line-field", value: "the md field box", source: "Select.tsx:236", expect: 'data-slot="box"', padding: true, side: "right" },
  { selector: "[data-slot=chevron]", name: "Chevron", token: "--ds-icon-16", value: "turns 180 on open", source: "Select.tsx:165,166,170", expect: ['data-slot="chevron"', "rotate: turned ? 180 : 0", "<ChevronDown size={16}"], side: "right" },
  { selector: "[data-slot=panel]", name: "Panel", token: "--ds-shadow-pop", value: "white, radius 16, p 6", source: `${SP}:42-43`, expect: ["rounded-(--ds-radius-sm) border border-(--ds-color-line-soft)", "bg-(--ds-color-surface) p-1.5 shadow-(--ds-shadow-pop)"], padding: true, side: "left" },
  { selector: "[data-slot=group]", name: "Group label", value: "Inter 11 caps 0.14em, muted", source: `${SP}:186-187`, expect: ['data-slot="group"', "text-[11px] font-medium uppercase leading-4 tracking-[0.14em] text-(--ds-color-text-muted)"], side: "left" },
  { selector: "[data-slot=option][data-active]", name: "Active row", token: "--ds-color-fill-highlight", value: "glides between rows", source: `${SP}:140,142,143`, expect: ["layoutId={`${id}-highlight`}", 'data-slot="highlight"', "bg-(--ds-color-fill-highlight)"], side: "left" },
  { selector: "[data-slot=option][aria-selected=true]", name: "Selected row", token: "--ds-color-ink", value: "500 with a 16 check", source: `${SP}:152,158`, expect: ['on ? "font-medium text-(--ds-color-ink)"', '<Check aria-hidden data-slot="check" size={16}'], side: "right" },
  { selector: "[data-slot=option][aria-disabled=true]", name: "Disabled row", value: "40%, skipped by the keys", source: `${SP}:126,135`, expect: ["aria-disabled={o.disabled || undefined}", '"cursor-not-allowed opacity-40"'], side: "right" },
];

export const SEARCH_PINS: readonly Pin[] = [
  { selector: "[data-slot=box]", index: 0, name: "Pill", token: "--ds-color-line-field", value: "40 tall, text at 40", source: `${SS}:13-14, SearchField.tsx:160`, expect: ['h: "h-10"', "pl-[calc(var(--ds-space-3-5)+var(--ds-icon-16)+var(--ds-space-2-5))]", "rounded-full"], padding: true, side: "left" },
  { selector: "[data-slot=icon]", index: 0, name: "Glass", token: "--ds-icon-16", value: "at 14", source: `${SS}:13, SearchField.tsx:164`, expect: ['at: "left-3.5"', 'data-slot="icon"'], side: "left" },
  { selector: "[data-slot=shortcut]", name: "Shortcut chip", value: "JetBrains Mono 11, 20 tall, radius 6", source: `${SS}:23-24, SearchField.tsx:213`, expect: ["grid h-5 min-w-5 place-items-center rounded-(--ds-radius-mark)", "font-(family-name:--ds-font-mono) text-[11px]", 'data-slot="shortcut"'], side: "right" },
  { selector: "[data-slot=value]", index: 1, name: "Query", value: "14, 16 under md", source: `${SS}:13, SearchField.tsx:172`, expect: ['text: "text-[14px] max-md:text-[16px]"', 'data-slot="value"'], side: "left" },
  { selector: "[data-slot=trailing] button", name: "Clear", value: "xs ghost icon button, X 14", source: "SearchField.tsx:199,201,202", expect: ["icon={X}", 'size="xs"', 'variant="ghost"'], side: "right" },
  { selector: "[data-slot=panel]", name: "Results", value: "the select panel", source: `${SP}:42-43`, expect: ["rounded-(--ds-radius-sm) border border-(--ds-color-line-soft)", "bg-(--ds-color-surface) p-1.5 shadow-(--ds-shadow-pop)"], side: "left" },
  { selector: "[data-slot=match]", name: "Match", token: "--ds-color-ink", value: "500", source: `${SP}:75`, expect: 'data-slot="match" className="font-medium text-(--ds-color-ink)"', side: "right" },
];

export const SELECT_VALUES: readonly ValueRow[] = [
  { part: "Trigger", value: "the field box at sm / md / lg, 36 / 44 / 52", source: "field-styles.ts:16, 24, 32" },
  { part: "Chevron", token: "--ds-color-text-muted", value: "16, rotates 180 on the pop spring", source: "Select.tsx:166-170" },
  { part: "Panel", token: "--ds-color-surface, --ds-color-line-soft", value: "solid white, 70% hairline, no blur", source: `${SP}:42-43` },
  { part: "Panel radius and padding", token: "--ds-radius-sm", value: "16, p 6, 8 below, max 320 tall", source: `${SP}:42-43` },
  { part: "Panel shadow", token: "--ds-shadow-pop", value: "0 18px 50px -12px rgba(10,27,51,0.18)", source: `${SP}:43` },
  { part: "Row", token: "--ds-radius-xs", value: "py 10, px 12, radius 12, Inter 15/22 slate 600", source: `${SP}:134` },
  { part: "Selected row", token: "--ds-color-ink", value: "500 with Check 16", source: `${SP}:152, 158` },
  { part: "Highlight", token: "--ds-color-fill-highlight", value: "slate 100, layoutId glide", source: `${SP}:140-143` },
  { part: "Group label", token: "--ds-color-text-muted", value: "11 caps, 0.14em", source: `${SP}:187` },
  { part: "Open", token: "--ds-spring-pop", value: "scale 0.96 (SCALE.panel), y -8, rows 35ms apart", source: `${SP}:29-30` },
  { part: "Close", token: "--ds-dur-exit", value: "140ms ease-in to scale 0.96, y -4", source: `${SP}:31` },
  { part: "Native under md", value: "under 768px, MEDIA max-md read live", source: "Select.tsx:80, use-media.ts:15, token-space.ts:87" },
];

export const SELECT_PROPS: readonly PropRow[] = [
  { name: "label", type: "string" },
  { name: "options", type: "{ value, label, code?, disabled?, group? }[]" },
  { name: "value, defaultValue, onChange", type: "string | null, (value) => void" },
  { name: "placeholder", type: "string", default: '"Choose one"' },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"' },
  { name: "helper, error", type: "ReactNode" },
  { name: "disabled, readOnly, required", type: "boolean" },
  { name: "native", type: '"auto" | "never" | "always"', default: '"auto"', note: "auto is native under md" },
  { name: "inline, active", type: "boolean, string", note: "the guide's open-in-flow form" },
  { name: "forceState", type: 'ForceState | "open"' },
];

export const SELECT_CODE = `import { Select } from "@/components/design-system/Select";

<Select
  label="Player type"
  options={[
    { value: "explorer", label: "The explorer" },
    { value: "grinder", label: "The grinder" },
  ]}
  onChange={setType}
/>`;

export const SEARCH_VALUES: readonly ValueRow[] = [
  { part: "Height sm / md / lg", value: "32 / 40 / 48", source: `${SS}:9, 13, 17` },
  { part: "Glass and text start", value: "14 at 12 / 16 at 14 / 18 at 16, text at 34 / 40 / 46", source: `${SS}:4-6, 9-18` },
  { part: "Pill", token: "--ds-color-line-field", value: "white, the field line, radius full", source: "SearchField.tsx:160" },
  { part: "Shortcut chip", token: "--ds-font-mono", value: "20 tall, radius 6, 11px, hidden on focus", source: `${SS}:22-24, SearchField.tsx:214` },
  { part: "Clear", value: "IconButton xs ghost, X 14", source: "SearchField.tsx:198-208" },
  { part: "Searching", value: "a decorative Spinner 12 (16 at lg), aria-busy", source: "SearchField.tsx:195" },
  { part: "No results", value: "a polite status row", source: "SearchField.tsx:232, 236" },
];

export const SEARCH_PROPS: readonly PropRow[] = [
  { name: "label", type: "string", note: "the accessible name, visually hidden" },
  { name: "value, defaultValue, onChange", type: "string, (value) => void" },
  { name: "suggestions", type: "SelectOption[]", note: "already filtered by the caller" },
  { name: "onSelect", type: "(option) => void" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"' },
  { name: "loading", type: "boolean" },
  { name: "shortcut, bindShortcut", type: "string, boolean", default: "unset, true" },
  { name: "disabled", type: "boolean" },
  { name: "inline, active", type: "boolean, number", note: "the guide's results-in-flow form and its highlighted row" },
  { name: "forceState", type: "ForceState" },
];

export const SEARCH_CODE = `import { SearchField } from "@/components/design-system/SearchField";

<SearchField
  label="Search the questions"
  shortcut="/"
  value={query}
  onChange={setQuery}
  suggestions={results}
  loading={pending}
  onSelect={(o) => openQuestion(o.value)}
/>`;
