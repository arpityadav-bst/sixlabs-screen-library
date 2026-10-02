// Data for the section head section: pins, drawer values and props. The site's own headings as copy
// (Jobs.tsx:107 and :110, Faq.tsx:23, Closing.tsx:23) are the guide's one checked copy in
// _data/specimens.ts, each with the Assertion that holds it to its file, re-exported here so Coverage walks
// the checks with the section that shows them.
import {
  CLOSING_HEAD,
  CLOSING_HEAD_SOURCE,
  FAQ_HEAD,
  FAQ_HEAD_SOURCE,
  JOBS_HEAD,
  JOBS_HEAD_SOURCE,
} from "@/app/design-system/_data/specimens";
import { pr, sv, tv, type Pin } from "./display-values";

export { CLOSING_HEAD, CLOSING_HEAD_SOURCE, FAQ_HEAD, FAQ_HEAD_SOURCE, JOBS_HEAD, JOBS_HEAD_SOURCE };
export const EYEBROW = "The jobs";

export const HEAD_PINS: readonly Pin[] = [
  { selector: ".ds-a-head p:first-child", name: "Eyebrow", token: "--ds-type-eyebrow", value: "Inter 11 / 500 caps, 0.18em, mb 12", source: "SectionHead.tsx:63", expect: "mb-3 font-sans text-[11px] font-medium uppercase leading-[1.5] tracking-[0.18em]" },
  { selector: ".ds-a-head h2", name: "Line", token: "--ds-type-h2", value: "Outfit 30, 44 from md, 500, 1.1", source: "SectionHead.tsx:67", expect: "style={typeStyle(role)}" },
  { selector: ".ds-a-head h2 > span", name: "Accent", token: "--ds-color-accent", value: "the closing words only", source: "SectionHead.tsx:70", expect: '<span className="text-(--ds-color-accent)">{accent}</span>' },
  { selector: ".ds-a-head h2 + p", name: "Subline", token: "--ds-color-text-muted", value: "Inter 15, 16 from md, snug, max 520, mt 16", source: "SectionHead.tsx:75", expect: "mt-4 max-w-[520px] font-sans text-[15px] leading-snug md:text-[16px]" },
];

export const HEAD_VALUES = [
  sv("h2", "Outfit 30, 44 from md, 500, 1.1, -0.025em", "Jobs.tsx:106", "--ds-type-h2", "font-display text-[30px] md:text-[44px] font-medium leading-[1.1] tracking-tight"),
  sv("display", "clamp(38px, 5.2vw, 74px), 500, 1.05, -0.045em", "Closing.tsx:22", "--ds-type-closing", "text-[clamp(38px,5.2vw,74px)] font-medium leading-[1.05] tracking-[-0.045em]"),
  tv("Line", "color-ink"),
  tv("Accent", "color-accent"),
  sv("Subline", "Inter 15, 16 from md, snug, max 520, mt 16", "Jobs.tsx:109", "--ds-color-text-muted", "mt-4 max-w-[520px] font-sans text-[15px] md:text-[16px] leading-snug"),
  tv("Subline on grey", "color-text-body"),
  sv("Eyebrow", "Inter 11 / 500 caps, 0.18em, mb 12", "ScrollCue.tsx:25", "--ds-type-eyebrow", "text-[11px] font-medium uppercase tracking-[0.18em]"),
  tv("Eyebrow colour", "color-text-muted"),
  tv("Rise travel", "rise-y"),
  tv("Rise time", "dur-rise"),
  sv("Rise trigger", "once, a quarter in view", "Jobs.tsx:49", undefined, "viewport: { once: true, amount: 0.25 }"),
] as const;

export const HEAD_PROPS = [
  pr("title", "ReactNode", undefined, "the line in ink"),
  pr("accent", "ReactNode", undefined, "the closing word or two, a TypedWord may sit here"),
  pr("accentBreak", "boolean", "false", "the accent on its own line"),
  pr("sub", "ReactNode"),
  pr("eyebrow", "string"),
  pr("size", '"h2" | "display"', '"h2"'),
  pr("align", '"start" | "center"', '"start"'),
  pr("as", '"h2" | "h3"', '"h2"'),
  pr("ground", '"page" | "container"', '"page"', "the subline steps darker on grey"),
  pr("rise", "boolean", "false"),
  pr("id", "string", undefined, "for aria-labelledby on the section"),
] as const;

export const HEAD_CODE = `import { SectionHead } from "@/components/design-system/SectionHead";

<SectionHead title="One model." accent="Three jobs." sub="Everything comes from the model of your players." rise />`;
