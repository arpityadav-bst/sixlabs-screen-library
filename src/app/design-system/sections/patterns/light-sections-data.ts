// Data for Light sections: the jobs frame's pins, the closing's pins on its one direct mount, the section
// padding rhythm with the exact source text each value must still match, the bill of materials and the
// drawer rows.
import type { AnatomyPin } from "@/app/design-system/_kit/Anatomy";
import { QUESTIONS } from "@/components/website/faq-data";
import { site, type Assertion } from "../foundations/foundation-assert";
import { tv } from "../components/display-values";
import type { BomItem } from "./pattern-parts";
import { read, rv } from "./pattern-values";

const W = "components/website/";

export const JOBS_PINS: readonly AnatomyPin[] = [
  { selector: "#jobs", name: "Section", token: "--ds-container", value: "max 1400 · px 16, 64 from md", source: "Jobs.tsx:103", expect: "max-w-[1400px] px-4", padding: true, side: "left" },
  { selector: "#jobs h2", name: "Head", token: "--ds-type-h2-size", value: "30, 44 from md · accent on Three jobs.", source: "Jobs.tsx:106", expect: "text-[30px] md:text-[44px]", side: "left" },
  { selector: "#jobs h2 + p", name: "Subline", token: "--ds-measure-subline", value: "15, 16 from md · max 520", source: "Jobs.tsx:109", expect: "max-w-[520px] font-sans text-[15px] md:text-[16px]", side: "left" },
  { selector: '#jobs [role="tablist"]', name: "Switch", value: "below xl · mt 32", source: "Jobs.tsx:118", expect: "mt-8 inline-flex", side: "right" },
  { selector: "#jobs > div:has(> article)", name: "Card row", value: "grid of 3 from xl, gap 24 · snap row below", source: "Jobs.tsx:142", expect: "gap-6 xl:grid-cols-3", side: "right" },
  { selector: "#jobs article", name: "Job card", token: "--ds-radius-lg", value: "radius 28 (24) · px 24 · pt 28", source: "Jobs.tsx:162", expect: "rounded-[28px] max-md:rounded-[24px]", side: "right" },
];

export const JOBS_WIDTHS = [375, 768, 1280, 1440] as const;

const C = "#get-access";

export const CLOSING_PINS: readonly AnatomyPin[] = [
  { selector: `${C} > img`, name: "Mark", value: "44 · mb 24", source: "Closing.tsx:20", expect: "mb-6 h-11 w-11", side: "left" },
  { selector: `${C} h2`, name: "Promise", token: "--ds-type-closing-size", value: "clamp(38px, 5.2vw, 74px) · -0.045em", source: "Closing.tsx:22", expect: "text-[clamp(38px,5.2vw,74px)]", side: "left" },
  { selector: `${C} h2 > span`, name: "Typed line", token: "--ds-color-accent", value: "types once 60% in view", source: "Closing.tsx:25", expect: "className=\"text-accent\" onView", side: "right" },
  { selector: `${C} h2 + p`, name: "Why", token: "--ds-measure-subline", value: "15, 16 from md · max 520 · mt 20", source: "Closing.tsx:27", expect: "mt-5 max-w-[520px]", side: "left" },
  { selector: `${C} h2 + p + div`, name: "Try now", value: "mt 34", source: "Closing.tsx:31", expect: "mt-[34px]", side: "right" },
  { selector: `${C} > p:last-child`, name: "Sign in line", token: "--ds-type-caption-l-size", value: "13.5 · mt 34", source: "Closing.tsx:34", expect: "mt-[34px] font-sans text-[13.5px]", side: "left" },
];

export type Rhythm = {
  readonly name: string;
  readonly content: string;
  /** CSS lengths, drawn live at half size */
  readonly top: string;
  readonly bottom: string;
  readonly a: Assertion;
};

/** From md. Understands opens with the header's height added, so its cards clear the fixed bar. */
export const RHYTHM: readonly Rhythm[] = [
  {
    name: "Understands",
    content: "the comparison pair",
    top: "calc(89px + clamp(96px, 9vw, 144px))",
    bottom: "0px",
    a: site("Understands.tsx", "md:pt-[calc(89px+clamp(96px,9vw,144px))]"),
  },
  { name: "Jobs", content: "head, switch, three cards", top: "clamp(96px, 9vw, 144px)", bottom: "96px", a: site("Jobs.tsx", "pt-[clamp(96px,9vw,144px)] pb-24") },
  { name: "FAQ", content: `head beside ${QUESTIONS.length} questions`, top: "clamp(72px, 7vw, 120px)", bottom: "128px", a: site("Faq.tsx", "pt-[clamp(72px,7vw,120px)] pb-32") },
  {
    name: "Closing",
    content: "mark, promise, why, Try now",
    top: "clamp(40px, 4vw, 72px)",
    bottom: "clamp(92px, 10vw, 150px)",
    a: site("Closing.tsx", "pt-[clamp(40px,4vw,72px)] pb-[clamp(92px,10vw,150px)]"),
  },
];

export const LIGHT_BOM: readonly BomItem[] = [
  { part: "Understands", job: "ChatGPT and 6labs side by side, the first section on the grain", at: "comparison" },
  {
    part: "section h2",
    job: "the head of Jobs and FAQ, written inline in Jobs.tsx:106 and Faq.tsx:22, the accent on the closing words",
    at: "section-head",
    note: "SectionHead is the system part that writes the same head for new sections",
  },
  { part: "jobs switch", job: "below xl, the three-job switch over the swipe row", at: "segmented" },
  { part: "job card", job: "title, line, terminal and tags, three across from xl", at: "card" },
  { part: "JobTerminal", job: "the agent doing the job, inside each card", at: "terminal" },
  { part: "tag panel", job: "the skills under each terminal", at: "badge-tag" },
  { part: "Faq", job: `${QUESTIONS.length} questions beside the head from lg`, at: "accordion" },
  { part: "TypedWord", job: "2 billion to go, typed in once the closing is in view", at: "stats-typed" },
  { part: "PrimaryCta", job: "Try now, the page's second and last solid call", at: "button" },
];

export const LIGHT_VALUES = [
  tv("Container", "container"),
  tv("Inner gutter", "gutter-section-md"),
  read("Grain", "from Understands to the footer, one .page-grain block", "app/website/page.tsx:37", "--ds-color-page", '<div className="page-grain'),
  read("Grain fade", "the page colour over the noise's first 240px", "app/globals.css:225", undefined, "rgb(var(--page-rgb)) 240px"),
  read(
    "Understands top",
    "calc(70px + 96px), calc(89px + clamp(96px, 9vw, 144px)) from md",
    `${W}Understands.tsx:64`,
    undefined,
    "pt-[calc(70px+96px)]",
    "md:pt-[calc(89px+clamp(96px,9vw,144px))]",
  ),
  read("Jobs", "pt clamp(96px, 9vw, 144px) · pb 96", `${W}Jobs.tsx:103`, undefined, "pt-[clamp(96px,9vw,144px)] pb-24"),
  read("FAQ", "pt clamp(72px, 7vw, 120px) · pb 128", `${W}Faq.tsx:18`, undefined, "pt-[clamp(72px,7vw,120px)] pb-32"),
  read("Closing", "pt clamp(40px, 4vw, 72px) · pb clamp(92px, 10vw, 150px)", `${W}Closing.tsx:12`, undefined, "pt-[clamp(40px,4vw,72px)] pb-[clamp(92px,10vw,150px)]"),
  rv("Head size", "h2"),
  rv("Closing size", "closing"),
  read("Closing spacing", "mark mb 24 · why mt 20 · Try now mt 34 · sign in mt 34", `${W}Closing.tsx:20`, undefined, 'className="mb-6 h-11 w-11"', "mt-5 max-w-[520px]", '<div className="mt-[34px]">', "mt-[34px] font-sans"),
] as const;

export const CLOSING_CODE = `import { Closing } from "@/components/website/Closing";

// on the grain, after the FAQ. It renders #get-access, so mount it once per page
<div className="page-grain">
  <Closing />
</div>`;

/** The two heads, quoted from Jobs.tsx:107-110 and Faq.tsx:23, for the Do / Don't pair. */
export const LIGHT_HEADS = {
  jobs: { title: "One model.", accent: "Three jobs.", sub: "Everything comes from the model of your players." },
  faq: { title: "Questions,", accent: "answered." },
} as const;
