// Values for the back to top section: pins measured inside the frames, the state cells, the visibility
// rules and the drawer rows, each with the file:line it is read from.
import type { AnatomyPin } from "@/app/design-system/_kit/Anatomy";
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import type { Crop } from "@/app/design-system/_kit/ViewportPreview";
import type { PartId } from "@/app/design-system/frame/_parts";

const BTN = 'button[aria-label="Back to top"]';

export const BACK_PINS: readonly AnatomyPin[] = [
  { selector: BTN, name: "Button", token: "--ds-shadow-float", value: "44 round · white · slate-200 hairline · 24 from the corner (40 and 16 on phones)", source: "BackToTop.tsx:62", side: "left" },
  { selector: `${BTN} svg`, name: "Arrow", token: "--ds-color-ink", value: "ArrowUp 18 · 1.75", source: "BackToTop.tsx:66", side: "left" },
];

/** the bottom-right corner of each frame, where the button lives */
const DESK: Crop = { x: 1100, y: 80, width: 180, height: 140 };
const PHONE: Crop = { x: 235, y: 527, width: 140, height: 140 };

export const BACK_STATES = ["hidden", "shown"] as const;
export const BACK_VARIANTS = ["desktop", "phone"] as const;

type Cell = { part: PartId; query?: string; width: number; height: number; crop: Crop };
export const BACK_CELLS: Record<(typeof BACK_VARIANTS)[number], Record<(typeof BACK_STATES)[number], Cell>> = {
  desktop: {
    hidden: { part: "back-to-top", query: "y=0", width: 1280, height: 220, crop: DESK },
    shown: { part: "back-to-top", width: 1280, height: 220, crop: DESK },
  },
  phone: {
    hidden: { part: "back-to-top-phone", query: "y=1400", width: 375, height: 667, crop: PHONE },
    shown: { part: "back-to-top-phone", width: 375, height: 667, crop: PHONE },
  },
};
export const BACK_CROP = DESK;

export const BACK_RULES: readonly KeyRow[] = [
  { key: "shown", value: "once #model-line's foot is inside the view, so from the players on", source: "BackToTop.tsx:27" },
  { key: "phone", value: "only while scrolling up (a change of more than 4px) and never with the footer in view", source: "BackToTop.tsx:30" },
  { key: "hidden", value: "opacity 0, 8px down, no pointer, tabIndex -1, yet still in the accessibility tree", source: "BackToTop.tsx:63" },
  { key: "hover", value: "lifts 2px and turns slate-50", source: "BackToTop.tsx:62" },
  { key: "focus, pressed", value: "missing" },
  { key: "press", value: "glides to the top in 0.9s plus 1s per 4000px, 2.2s at most", source: "BackToTop.tsx:52" },
];

export const BACK_VALUES: readonly ValueRow[] = [
  { part: "Size", value: "44, 40 on phones", source: "BackToTop.tsx:62" },
  { part: "Inset", value: "24 from the bottom and right, 16 on phones", source: "BackToTop.tsx:62" },
  { part: "Ground", token: "--ds-color-surface", value: "#ffffff, slate-50 on hover", source: "BackToTop.tsx:62" },
  { part: "Hairline", token: "--ds-color-line", value: "slate-200 at 80%", source: "BackToTop.tsx:62" },
  { part: "Shadow", token: "--ds-shadow-float", value: "0 1px 2px rgba(10,27,51,0.06), 0 12px 28px -12px rgba(10,27,51,0.35)", source: "BackToTop.tsx:62" },
  { part: "Arrow", token: "--ds-color-ink", value: "ArrowUp 18 · 1.75", source: "BackToTop.tsx:66" },
  { part: "Layer", token: "--ds-z-header", value: "40, over the water (20) and the players (30)", source: "BackToTop.tsx:62" },
  { part: "Show and hide", token: "--ds-dur-line", value: "opacity, translate and fill over 300ms, Tailwind's default ease", source: "BackToTop.tsx:62" },
  { part: "Lift", token: "--ds-lift-y", value: "2px on hover", source: "BackToTop.tsx:62" },
];

export const BACK_CODE = `import { BackToTop } from "@/components/website/BackToTop";

// once per page, after the footer. It needs #model-line and a <footer> on the page
<BackToTop />`;

export const CUE_PINS: readonly AnatomyPin[] = [
  { selector: 'div[aria-hidden="true"] > span', name: "Label", token: "--ds-color-text-quiet", value: "11 · 500 · caps · 0.18em", source: "ScrollCue.tsx:25", side: "left" },
  { selector: 'div[aria-hidden="true"] > svg', name: "Arrow", value: "ArrowDown 16 · 1.75 · bobs 4px over 1.8s", source: "ScrollCue.tsx:26", side: "right" },
];

export const CUE_VALUES: readonly ValueRow[] = [
  { part: "Colour", token: "--ds-color-text-quiet", value: "slate-400, on light grounds only", source: "ScrollCue.tsx:21" },
  { part: "Label", value: "11 · 500 · uppercase · tracking 0.18em", source: "ScrollCue.tsx:25" },
  { part: "Arrow", value: "ArrowDown 16 · 1.75 · gap 6 under the label", source: "ScrollCue.tsx:26" },
  { part: "Bob", token: "--ds-loop-max", value: "0 to 4px and back over 1.8s, ease-in-out, off under reduced motion", source: "globals.css:50" },
  { part: "Away", token: "--ds-dur-line", value: "opacity 0 past 40px of scroll, over 300ms", source: "ScrollCue.tsx:11" },
  { part: "Where", value: "under the container hero from md, at the full view's foot from lg, never on phones", source: "Hero.tsx:102" },
];
