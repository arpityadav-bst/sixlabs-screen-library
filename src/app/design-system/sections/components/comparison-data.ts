// Data for the comparison section: pins measured on the one direct Understands mount, the values its drawer
// prints, each read from Understands.tsx, and the guide's one copy of the comparison's lines (LINES), held
// to the site's LINES so the Do / Don't sketches and Decisions quote it word for word.
import { site, type Assertion } from "@/app/design-system/sections/foundations/foundation-assert";
import { sv, tv, type Pin } from "./display-values";

const GRID = "#understands > div";
const THEIRS = `${GRID} > div:nth-of-type(1)`;
const OURS = `${GRID} > div:nth-of-type(2)`;
const U = "Understands.tsx";

/** Each side's two lines as Understands.tsx writes them (LINES at :34): a verb, then what it is about. */
export const LINES = {
  theirs: [
    ["Reads", "the internet"],
    ["Understands", "facts and how humans think"],
  ],
  ours: [
    ["Watches", "millions of hours of gameplay"],
    ["Understands", "the game player"],
  ],
} as const;

type Side = keyof typeof LINES;
const quoted = (side: Side, k: 0 | 1) => `${side}: ["${LINES[side][k][0]}", "${LINES[side][k][1]}"]`;

/** LINES held to the site, so a reworded line turns Coverage red. */
export const LINES_CHECK: Assertion = site(U, quoted("theirs", 0), quoted("ours", 0), quoted("theirs", 1), quoted("ours", 1));

/** The two sides as the sketches name them, each with its lockup weight (500 on grey, 400 on navy). */
export const SIDES = [
  { side: "theirs", name: "ChatGPT", weight: 500 },
  { side: "ours", name: "6labs", weight: 400 },
] as const;

export const COMPARISON_PINS: readonly Pin[] = [
  { selector: THEIRS, name: "ChatGPT card", token: "--ds-color-container", value: "radius 36 (28), p 36 (28)", source: `${U}:22-23`, expect: ["rounded-[36px] max-md:rounded-[28px] border p-7 md:p-9", "bg-[#e3e5e8]"], padding: true },
  { selector: OURS, name: "6labs card", token: "--ds-color-primary", value: "pl 64 from md, for the vs", source: `${U}:25`, expect: "bg-[#0a152d] text-white md:pl-16", padding: true },
  { selector: `${THEIRS} > span`, name: "Lockup", value: "mark 32, gap 10, name Outfit 22", source: `${U}:27,30,69`, expect: ["flex items-center gap-2.5", "text-[22px]", '<ChatGptMark className="h-8 w-8" />'] },
  { selector: `${THEIRS} > p`, name: "Line", token: "--ds-type-comparison", value: "Outfit 26 / 1.3 (20), 400, in the card's one ink", source: `${U}:32`, expect: "font-display text-[20px] md:text-[26px] font-normal leading-[1.3]" },
  { selector: `${THEIRS} > p:nth-of-type(2)`, name: "Second line", value: "mt 12, under the first", source: `${U}:54`, expect: '(k === 0 ? " mt-6" : " mt-3")' },
  { selector: `${OURS} > p:nth-of-type(2)`, name: "6labs second line", value: "level with the grey card's, subgrid row 3", source: `${U}:22`, expect: "md:row-span-3 md:grid md:grid-rows-subgrid" },
  { selector: `${OURS} > span > span`, name: "6labs name", value: "400 on navy, 500 on grey", source: `${U}:70,77`, expect: ['name + " font-medium"', 'name + " font-normal"'] },
  { selector: `${GRID} > span`, name: "vs", token: "--ds-stroke-ring-vs", value: "80 (64), 6px page ring, Outfit 34 (27) at ink 30%", source: `${U}:87`, expect: ["h-20 w-20", "border-[6px] border-[rgb(var(--page-rgb))]", "text-[34px]", "max-md:text-[27px]"] },
];

export const COMPARISON_VALUES = [
  sv("Grid", "1 column, 2 from md, gap 24, rows auto auto auto", `${U}:66`, undefined, "md:grid-rows-[auto_auto_auto]"),
  sv("Subgrid", "each card spans 3 rows as a subgrid from md", `${U}:22`, undefined, "md:row-span-3 md:grid md:grid-rows-subgrid"),
  sv("ChatGPT card", "#e3e5e8, slate-200 at 50%, no shadow", `${U}:23`, "--ds-color-container", "border-slate-200/50 bg-[#e3e5e8]"),
  sv("6labs card", "#0a152d, pl 64 from md", `${U}:25`, "--ds-color-primary", "bg-[#0a152d] text-white md:pl-16"),
  sv("Line ink", "one ink per card: navy #0a1b33 on the grey, white on the navy", `${U}:23`, undefined, "text-[#0a1b33]"),
  tv("Card radius", "radius-xl"),
  tv("Phone radius", "radius-lg"),
  sv("Names", "Outfit 22, ChatGPT 500, 6labs 400", `${U}:30`, undefined, 'const name = "font-display text-[22px] tracking-tight";'),
  sv("Lines", "Outfit 20, 26 from md, 400, 1.3", `${U}:32`, undefined, "font-display text-[20px] md:text-[26px] font-normal leading-[1.3]"),
  sv("First line", "mt 24, the second mt 12", `${U}:54`, undefined, '(k === 0 ? " mt-6" : " mt-3")'),
  tv("vs ring", "stroke-ring-vs"),
  sv("vs ring colour", "rgb(var(--page-rgb)), the page", `${U}:87`, "--ds-color-page", "border-[rgb(var(--page-rgb))]"),
  sv("vs type", "Outfit 34 (27), 400, ink 30%, lifted 0.07em", `${U}:87`, undefined, "text-[34px] font-normal tracking-tight text-[#0a1b33]/30", "max-md:text-[27px]", "-top-[0.07em]"),
  sv("Rise", "y 28 to 0 over 0.7s, delays 0, 0.15, 0.3, once at 40%", `${U}:44`, undefined, "initial: { opacity: 0, y: 28 }", "viewport: { once: true, amount: 0.4 }"),
  sv("Top padding", "calc(70px + 96px), calc(89px + clamp(96px, 9vw, 144px)) from md", `${U}:64`, undefined, "pt-[calc(70px+96px)]", "md:pt-[calc(89px+clamp(96px,9vw,144px))]"),
] as const;
