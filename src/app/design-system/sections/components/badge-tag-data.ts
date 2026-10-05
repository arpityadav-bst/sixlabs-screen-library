// Data for the badge, status dot and tag section: the tag items with their icons (keyed by label, as
// Jobs.tsx:34 keys its TAG_ICON), the badge tones with the colours their contrast is read from, pins, drawer
// values and props.
import {
  Clapperboard,
  CircleCheck,
  Eye,
  Footprints,
  Languages,
  Layers,
  Lightbulb,
  Plug,
  ScanSearch,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import { composite, CONTRAST_GROUNDS, parseColor } from "@/app/design-system/_kit/contrast";
import { site, type Assertion } from "@/app/design-system/sections/foundations/foundation-assert";
import type { BadgeTone } from "@/components/design-system/Badge";
import type { TagItem } from "@/components/design-system/Tag";
import { tokenByName } from "@/components/design-system/tokens";
import { JOBS } from "@/components/website/jobs-data";
import { pr, sv, tv, type Pin } from "./display-values";

/** Each job tag's line icon, keyed by its label, the map Jobs.tsx keeps private (TAG_ICON at :34). */
export const TAG_ICON: Readonly<Record<string, LucideIcon>> = {
  "Why, not just what": Lightbulb,
  "Evidence clips": Clapperboard,
  "BI plug-in": Plug,
  Functional: CircleCheck,
  Behavioral: Footprints,
  "Large scale": Layers,
  Localization: Languages,
  Deconstruct: ScanSearch,
  Verify: ShieldCheck,
  Observe: Eye,
};

/** Holds the map to Jobs.tsx's own, entry by entry, so a changed icon there turns Coverage red. */
export const TAG_ICON_ASSERT: Assertion = site(
  "Jobs.tsx",
  '"Why, not just what": Lightbulb,',
  '"Evidence clips": Clapperboard,',
  '"BI plug-in": Plug,',
  "Functional: CircleCheck,",
  "Behavioral: Footprints,",
  '"Large scale": Layers,',
  "Localization: Languages,",
  "Deconstruct: ScanSearch,",
  "Verify: ShieldCheck,",
  "Observe: Eye,",
);

/** A job's tags with their icons. A tag in jobs-data.ts with no icon here stops the build. */
export function tagsOf(job: (typeof JOBS)[number]): TagItem[] {
  return job.tags.map((label) => {
    const icon = TAG_ICON[label];
    if (!icon) throw new Error(`badge-tag-data: the job tag "${label}" has no icon in TAG_ICON`);
    return { label, icon };
  });
}

const [intel, testing] = JOBS;
for (const j of JOBS) tagsOf(j);
export const JOB_TAGS: readonly TagItem[] = tagsOf(intel);
export const TESTING_TAGS: readonly TagItem[] = tagsOf(testing);

/** A token's colour as a plain sRGB value (oklch tokens carry their srgb twin). */
const colour = (name: string) => {
  const t = tokenByName(name);
  return t?.srgb ?? t?.value ?? "#000";
};
/** A colour with alpha laid over a ground, as the eye sees it there. */
function over(name: string, ground: string): string {
  const f = parseColor(colour(name));
  const g = parseColor(ground);
  if (!f || !g) return ground;
  const c = composite(f, g);
  return `rgb(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)})`;
}
const BLUE = colour("color-accent");

export type ToneRow = { tone: BadgeTone; text: string; fg: string; bg: string; ground: "page" | "on-blue" };

export const BADGE_TONES: readonly ToneRow[] = [
  { tone: "neutral", text: "Ready", fg: colour("color-text-body"), bg: over("color-fill-highlight", CONTRAST_GROUNDS.page), ground: "page" },
  { tone: "live", text: "Running", fg: colour("color-ink"), bg: CONTRAST_GROUNDS.surface, ground: "page" },
  { tone: "success", text: "Passed", fg: colour("color-success"), bg: over("color-success-tint", CONTRAST_GROUNDS.page), ground: "page" },
  { tone: "warning", text: "Flaky", fg: colour("color-warning"), bg: over("color-warning-tint", CONTRAST_GROUNDS.page), ground: "page" },
  { tone: "danger", text: "Failed", fg: colour("color-danger-ink"), bg: over("color-danger-tint", CONTRAST_GROUNDS.page), ground: "page" },
  { tone: "inverse", text: "New", fg: "#ffffff", bg: colour("color-primary"), ground: "page" },
  { tone: "onBlue", text: "Model 01", fg: "#ffffff", bg: over("color-on-blue-15", BLUE), ground: "on-blue" },
];

export const BADGE_PINS: readonly Pin[] = [
  { selector: ".ds-a-badge > span", name: "Pill", token: "--ds-radius-full", value: "md, 22 tall, px 8, gap 6", source: "Badge.tsx:21", expect: "h-[22px] gap-1.5 px-2", padding: true },
  { selector: ".ds-a-badge > span > span", name: "Live dot", token: "--ds-color-accent", value: "6, pulse", source: "Badge.tsx:78", expect: '<StatusDot size={6} tone="live"' },
  { selector: ".ds-a-count .tabular-nums", name: "Count", token: "--ds-color-primary", value: "18, Inter 11 / 600 tabular, 4px out", source: "Badge.tsx:56,57,58", expect: ["h-[18px] min-w-[18px]", "text-[11px] font-semibold", "absolute -right-1 -top-1"] },
];

export const DOT_PINS: readonly Pin[] = [
  { selector: ".ds-a-dot > span > span:first-child", name: "Halo", token: "--ds-color-accent-ping", value: "animate-ping, accent 40%", source: "StatusDot.tsx:31-32", expect: ["animate-ping", "--ds-color-accent-ping"] },
  { selector: ".ds-a-dot > span > span:last-child", name: "Core", token: "--ds-color-accent", value: "8 circle", source: "StatusDot.tsx:24,38", expect: ['"h-2 w-2"', "relative rounded-full"] },
];

export const TAG_PINS: readonly Pin[] = [
  { selector: ".ds-a-tags > ul", name: "Panel", token: "--ds-color-surface-sunken", value: "radius 12, px 16, py 14, gap 16 / 12", source: "Tag.tsx:66", expect: "rounded-(--ds-radius-xs) border border-(--ds-color-line) bg-(--ds-color-surface-sunken) px-4 py-3.5", padding: true },
  { selector: ".ds-a-tags li svg", name: "Icon", token: "--ds-icon-16", value: "16 at 1.75, accent", source: "Tag.tsx:12,42", expect: ["h-4 w-4 shrink-0 text-(--ds-color-accent)", "ICON_STROKE[16]"] },
  { selector: ".ds-a-tags li", name: "Tag", value: "gap 10, Inter 13 / 20, ink", source: "Tag.tsx:34,38-39", expect: ['"gap-2.5"', "text-[13px] leading-5", "text-(--ds-color-ink)"] },
];

/** The hero's live proof line, read off Hero.tsx and held to it, since it is inline there. */
export const PROOF_ROWS: readonly KeyRow[] = [
  { key: "Live dot", value: "8, accent, a ping at accent 40% behind it", source: "Hero.tsx:237" },
  { key: "Line", value: "Inter 13, relaxed, #475569, in the subtitle's slate", source: "Hero.tsx:241" },
  { key: "Invitation", value: "500 in the accent, under the line", source: "Hero.tsx:244" },
  { key: "Grid", value: "an 8px column for the dot, then the words, gap 10", source: "Hero.tsx:236" },
];
export const PROOF_LINE: Assertion = site(
  "Hero.tsx",
  "grid grid-cols-[8px_1fr] items-center gap-x-2.5 font-sans text-[13px] leading-relaxed",
  "absolute inset-0 animate-ping rounded-full bg-accent/40",
  '<p className="text-[#475569]">',
  "col-start-2 font-medium text-accent",
);

export const PANEL_PINS: readonly Pin[] = [
  { selector: "article.sheen ul", name: "Tag panel", value: "radius 12, #f6f7f9, px 16, py 14", source: "Jobs.tsx:184", expect: "rounded-[12px] border border-slate-200/80 bg-[#f6f7f9] px-4 py-3.5", padding: true },
  { selector: "article.sheen ul li svg", name: "Icon", value: "17 at 1.6, accent", source: "Jobs.tsx:194-195", expect: ["h-[17px] w-[17px] shrink-0 text-accent", "strokeWidth={1.6}"] },
];

export const BADGE_VALUES = [
  tv("Shape", "radius-full"),
  tv("Label family", "font-mono"),
  sv("Sizes", "sm 18, md 22", "Badge.tsx:20-21", undefined, 'sm: "h-[18px] gap-1.5 px-1.5', 'md: "h-[22px] gap-1.5 px-2'),
  sv("Label", "11 caps at 500, tracking 0.08em (sm) / 0.12em (md)", "Badge.tsx:20-21, 72", undefined, "text-[11px] tracking-[0.08em]", "text-[11px] tracking-[0.12em]", "font-medium uppercase"),
  tv("Neutral fill", "color-fill-highlight"),
  tv("Success tint", "color-success-tint"),
  tv("Warning tint", "color-warning-tint"),
  tv("Danger tint", "color-danger-tint"),
  tv("On blue fill", "color-on-blue-15"),
  tv("On blue line", "color-on-blue-25"),
  tv("Count fill", "color-primary"),
] as const;

export const DOT_VALUES = [
  tv("Live", "color-accent"),
  tv("Ping halo", "color-accent-ping"),
  tv("Idle", "color-line-strong"),
  tv("Success", "color-success"),
  tv("Danger", "color-danger"),
  sv("Ping", "1s, scale 2 and fade, Tailwind animate-ping", "Hero.tsx:238", undefined, "absolute inset-0 animate-ping rounded-full bg-accent/40"),
  sv("Pulse", "2s, opacity 0.5 at half, Tailwind animate-pulse", "Players.tsx:269", undefined, '"bg-accent animate-pulse"'),
] as const;

export const TAG_VALUES = [
  tv("Panel fill", "color-surface-sunken"),
  tv("Panel line", "color-line"),
  tv("Panel radius", "radius-xs"),
  sv("Panel padding", "px 16, py 14", "Tag.tsx:66", undefined, "bg-(--ds-color-surface-sunken) px-4 py-3.5"),
  sv("Columns", "2 at gap 16 / 12, 1 under md", "Tag.tsx:64, 69", undefined, 'columns === 2 ? "grid-cols-2 max-md:grid-cols-1"', "grid gap-x-4 gap-y-3"),
  tv("Icon", "icon-16"),
  tv("Icon stroke", "icon-16-stroke"),
  tv("Icon colour", "color-accent"),
  sv("Pill", "28 tall, px 10, white, hairline", "Tag.tsx:16", undefined, 'pill: "h-7 rounded-full border border-(--ds-color-line) bg-(--ds-color-surface) px-2.5"'),
] as const;

export const BADGE_PROPS = [
  pr("tone", '"neutral" | "live" | "success" | "warning" | "danger" | "inverse" | "onBlue"', '"neutral"'),
  pr("size", '"sm" | "md"', '"md"'),
  pr("dot", "boolean", "false"),
  pr("pulse", "boolean", "true for live"),
  pr("count", "number", undefined, "the count form, 99+ past 99"),
  pr("pinned", "boolean", "false", "top-right of a relative parent"),
  pr("label", "string", undefined, "the count's accessible name"),
] as const;

export const DOT_PROPS = [
  pr("size", "6 | 8", "8"),
  pr("tone", '"live" | "idle" | "success" | "danger"', '"live"'),
  pr("motion", '"ping" | "pulse" | "none"', '"none"'),
] as const;

export const TAG_PROPS = [
  pr("Tag icon", "LucideIcon", undefined, "a field of the item, never looked up"),
  pr("Tag variant", '"pill" | "plain"', '"plain"'),
  pr("TagList items", "{ label, icon? }[]"),
  pr("TagList columns", "1 | 2", "2", "2 drops to 1 under md"),
  pr("TagList panel", "boolean", "true"),
  pr("TagList label", "string", undefined, "a name when no heading gives one"),
] as const;

export const BADGE_CODE = `import { Badge } from "@/components/design-system/Badge";

<Badge tone="live">Running</Badge>
<Badge tone="success" size="sm" dot>Passed</Badge>
<Badge count={3} pinned label="3 new" />`;

export const DOT_CODE = `import { StatusDot } from "@/components/design-system/StatusDot";

<StatusDot tone="live" motion="ping" />`;

export const TAG_CODE = `import { Tag, TagList } from "@/components/design-system/Tag";
import { Lightbulb, Plug } from "lucide-react";

<TagList items={[{ label: "Why, not just what", icon: Lightbulb }, { label: "BI plug-in", icon: Plug }]} />
<Tag variant="pill" icon={Plug}>BI plug-in</Tag>`;
