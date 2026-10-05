// Data for Page composition: the stretches of /website in order with what the shell does in each, the two
// pages compared, and the page rules, each with the file:line it is read from.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";

export type StripGround = "hero" | "page" | "water" | "grain" | "footer";

export type Stretch = {
  readonly name: string;
  readonly ground: StripGround;
  /** its length in screens, for the strip */
  readonly screens: number;
  readonly height: string;
  readonly header: string;
  readonly ascii: string;
  readonly snap: string;
  readonly back: string;
  readonly source: string;
};

export const STRETCHES: readonly Stretch[] = [
  {
    name: "Hero",
    ground: "hero",
    screens: 1,
    height: "96 + 664 + the under-row",
    header: "rest, then scrolled past 4px",
    ascii: "on, round the container",
    snap: "none",
    back: "hidden",
    source: "Hero.tsx:125",
  },
  {
    name: "Scroll line",
    ground: "page",
    screens: 2.9,
    height: "390vh, a sticky stage one screen tall",
    header: "scrolled, white once the water is 90% up",
    ascii: "on until the line's foot",
    snap: "none",
    back: "hidden",
    source: "ScrubLine.tsx:109",
  },
  {
    name: "Water and players",
    ground: "water",
    screens: 1,
    height: "a screen at least, pulled up over the line's last",
    header: "solid white",
    ascii: "paused",
    snap: "#players, proximity plus a 0.6-screen catch",
    back: "shown (phones: scrolling up)",
    source: "Players.tsx:108",
  },
  {
    name: "Grain block",
    ground: "grain",
    screens: 4,
    height: "Understands, Jobs, FAQ, Closing",
    header: "scrolled, page at 92%",
    ascii: "covered by the grain",
    snap: "none",
    back: "shown (phones: scrolling up)",
    source: "app/website/page.tsx:37",
  },
  {
    name: "Footer",
    ground: "footer",
    screens: 0.8,
    height: "links, the copy line band, the legal row",
    header: "scrolled",
    ascii: "covered",
    snap: "none",
    back: "shown (phones: hidden, the footer has its own)",
    source: "BackToTop.tsx:34",
  },
];

/** The Don't strip: a second accent stretch after a light one. */
export const TWO_WATERS: readonly Pick<Stretch, "name" | "ground" | "screens">[] = [
  { name: "Hero", ground: "hero", screens: 1 },
  { name: "Water", ground: "water", screens: 1 },
  { name: "Light", ground: "grain", screens: 1.6 },
  { name: "Water", ground: "water", screens: 1 },
  { name: "Footer", ground: "footer", screens: 0.6 },
];

export const PAGES_COLUMNS = ["Part", "/website", "/6labs-fullview", "Source"] as const;

export const PAGES_ROWS: readonly (readonly string[])[] = [
  ["Header", "default: page at 92% from the top", "clear: no ground at the top, hidden until loaded", "Header.tsx:26"],
  ["Hero", "the rounded container, 664 tall", "the floor edge to edge, 100svh", "Hero.tsx:121"],
  ["Numbers", "centred under the container", "left, between the lede and Try now", "Hero.tsx:219"],
  ["Social proof", "under Try now", "none, the numbers carry it", "Hero.tsx:233"],
  ["Scroll cue and wave", "under the container's corners", "inside the floor, low left and bottom right", "Hero.tsx:264"],
  ["Loading", "copy at once, the mark on the grey", "the loader alone, the page held still", "hero-intro.ts:36"],
  ["From the line down", "the same", "the same", "app/6labs-fullview/page.tsx:36"],
];

export const PAGE_RULES: readonly KeyRow[] = [
  { key: "one primary", value: "one solid call per view: Try now in the hero and the closing, Sign in outlined in the header", source: "Header.tsx:98" },
  { key: "grain", value: "from the fourth section to the foot, one block that covers the glyph field", source: "app/website/page.tsx:37" },
  { key: "accent fill", value: "only the water behind the players, painted by AccentWave", source: "AccentWave.tsx:36" },
  { key: "one magnet", value: "#players is the only snap point (and desktop Safari's only JS catch), so a scroll rests on its own everywhere else", source: "globals.css:31, SafariScroll.tsx:15" },
  { key: "one container", value: "every section, the header inner and the footer sit in the same 1400 box", source: "Jobs.tsx:103" },
  { key: "ids once", value: "model-line, players, jobs and faq each mark one section, the in-page links' targets", source: "jump.ts:11" },
];

export const PAGE_CODE = `// app/website/page.tsx, the order every page keeps
<main className="relative min-h-screen overflow-x-clip px-4 md:px-8 pt-24">
  <AsciiBackdrop /> <AccentWave /> <PerfBoot /> <SafariScroll /> <ClickLock />
  <Header />
  <Hero />
  <ScrubLine />
  <Players />
  <div className="page-grain -mx-4 px-4 md:-mx-8 md:px-8">
    <Understands /> <Jobs /> <Faq /> <Closing /> <Footer />
  </div>
  <BackToTop />
</main>`;
