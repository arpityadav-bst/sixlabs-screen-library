// Values for the footer section: pins measured inside the footer frame, the compositions by width, the
// link states and the drawer rows, each with the file:line it is read from.
import type { AnatomyPin } from "@/app/design-system/_kit/Anatomy";
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { ValueRow } from "@/app/design-system/_kit/SpecDrawer";

const BAND = "footer > div:nth-of-type(2)";
const LABEL = `${BAND} > div:nth-of-type(2) > div > div`;
const TAIL = "footer > div:last-child > div";

export const FOOTER_PINS: readonly AnatomyPin[] = [
  { selector: "footer > div:first-child", name: "Top grid", value: "1.7fr / 1fr / auto · gap 40 · pt 60 · px 64", source: "Footer.tsx:30", padding: true, side: "left" },
  { selector: "footer > div:first-child > div", name: "Brand block", value: "lockup · tagline 14/1.65 at mt 22", source: "Footer.tsx:33", side: "left" },
  { selector: "footer nav", name: "Explore", value: "gap 13 · h3 13.5/600 · links 13", source: "Footer.tsx:55", side: "right" },
  { selector: "footer > div:first-child > button", name: "Back to top", value: "13.5 · ArrowUp 14/2 · gap 7", source: "Footer.tsx:75", side: "right" },
  { selector: `${BAND} > div:first-child`, name: "Colour split", token: "--ds-color-fringe-red", value: "pale red copy 3px left · pale cyan 3px right · each fading by 16%", source: "CopyLine.tsx:72", side: "right" },
  { selector: `${BAND} > span`, name: "Crest", value: "SixLabsLogo fade · 0.95em", source: "CopyLine.tsx:122", side: "left" },
  { selector: `${BAND} > div:nth-of-type(3)`, name: "Word", token: "--ds-type-footer-word-size", value: "clamp(84px, 19vw, 300px) · 600 · -0.055em", source: "CopyLine.tsx:128", side: "left" },
  { selector: LABEL, index: 0, name: "Spec label", token: "--ds-color-surface-85", value: "pill 12 · 28px leader · end dot 7", source: "CopyLine.tsx:105", side: "left" },
  { selector: LABEL, index: 1, name: "Spec label, strong", token: "--ds-color-primary", value: "navy pill · white text", source: "CopyLine.tsx:104", side: "right" },
  { selector: TAIL, name: "Tail", token: "--ds-color-footer-tail", value: "py 22 · ink hairline at 8% · 4% darker again", source: "Footer.tsx:86", padding: true, side: "left" },
  { selector: `${TAIL} > span:last-child`, name: "Legal", value: "gap 18 · underlined, offset 3", source: "Footer.tsx:93", side: "right" },
];

export const FOOTER_WIDTHS = [375, 768, 1440] as const;

/** What the foot shows at each width: the band's picture and labels switch at viewport breakpoints. */
export const COMPOSITIONS: readonly KeyRow[] = [
  { key: "phone, under 768", value: "two columns, the brand block across both. The band is the mark and the word only, the tail centred", source: "Footer.tsx:30" },
  { key: "tablet, 768 to 1023", value: "the three-column grid and the copy-line picture behind the word", source: "CopyLinePicture.tsx:77" },
  { key: "desktop, from 1024", value: "the two spec labels on the picture, pinned in its coordinates so they stay on the same heads", source: "CopyLine.tsx:90" },
];

export const FOOTER_LINK_STATES: readonly KeyRow[] = [
  { key: "link rest", value: "muted #64748b at 13", source: "Footer.tsx:26" },
  { key: "link hover", value: "accent over 300ms. Legal links turn their underline accent too", source: "Footer.tsx:64" },
  { key: "Back to top hover", value: "ink to accent over 300ms", source: "Footer.tsx:75" },
  { key: "focus", value: "missing on every control" },
  { key: "stubs", value: "Case Studies, Terms of Use and Privacy Policy have no href, so a keyboard never reaches them", source: "Footer.tsx:94" },
];

export const FOOTER_VALUES: readonly ValueRow[] = [
  { part: "Ground", token: "--ds-color-footer", value: "black at 4% over the page, the noise showing through", source: "Footer.tsx:26" },
  { part: "Top stroke", token: "--ds-color-line", value: "slate-200 at 80%", source: "Footer.tsx:26" },
  { part: "Type", token: "--ds-color-text-muted", value: "Inter 13 · tracking -0.01em · #64748b", source: "Footer.tsx:26" },
  { part: "Inner", token: "--ds-gutter-section-md", value: "1400 max · px 16, 64 from md", source: "Footer.tsx:21" },
  { part: "Top grid", value: "2 columns, then 1.7fr / 1fr / auto from md · gap 40 · pt 60", source: "Footer.tsx:30" },
  { part: "Tagline", value: "14 · 1.65 · -0.015em · mt 22", source: "Footer.tsx:48" },
  { part: "Explore heading", token: "--ds-color-ink", value: "h3 13.5 · 600 · -0.02em", source: "Footer.tsx:57" },
  { part: "Word", token: "--ds-type-footer-word-size", value: "clamp(84px, 19vw, 300px) · Outfit 600 · -0.055em", source: "CopyLine.tsx:67" },
  { part: "Band air", value: "72px + 0.46em above the word, 150px + 0.46em from md", source: "CopyLine.tsx:126" },
  { part: "Colour split", token: "--ds-color-fringe-red", value: "#e89fa4 left 3px and #9ed5dd right 3px, each fading by 16%", source: "globals.css:206" },
  { part: "Picture", value: "2688 × 1152, or 1344 on bands under 1545.6 device px · drawn on a canvas", source: "CopyLinePicture.tsx:111" },
  { part: "Picture ground", value: "#f9fafb × 0.96 baked into the pixels, the footer's ground", source: "CopyLinePicture.tsx:16" },
  { part: "Tail", token: "--ds-color-footer-tail", value: "black at 4% again · ink hairline at 8% · py 22 · safe-area padding", source: "Footer.tsx:85" },
];

export const FOOTER_CODE = `import { Footer } from "@/components/website/Footer";

// last child of the page's .page-grain wrapper, inside main's px-4 md:px-8
<Footer />`;
