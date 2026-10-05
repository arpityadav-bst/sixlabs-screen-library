// Values for the mobile menu section: pins measured inside the menu-open frame, its behaviour and the
// drawer rows, each with the file:line it is read from.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import type { Pin } from "@/app/design-system/sections/components/display-values";

export const MENU_PINS: readonly Pin[] = [
  { selector: '#site-head button[aria-label="Close menu"]', name: "Menu button", value: "40 round · X 22/1.75", source: "MobileMenu.tsx:53,56", expect: ["h-10 w-10 place-items-center rounded-full", "<X size={22} strokeWidth={1.75} />"], side: "right" },
  { selector: "#site-head div:has(> ul)", name: "Sheet", token: "--ds-color-surface", value: "px 16 · pt 4 · pb 24 · under the bar", source: "MobileMenu.tsx:80", expect: "top-full border-b border-slate-200/80 bg-white px-4 pb-6 pt-1", padding: true, side: "left" },
  { selector: "#site-head ul a", name: "Row", token: "--ds-type-menu-row-size", value: "Outfit 20/400 · py 16 · slate-100 rule", source: "MobileMenu.tsx:91", expect: "border-slate-100 py-4 font-display text-[20px] font-normal", padding: true, side: "left" },
  { selector: "#site-head ul a svg", name: "Row arrow", token: "--ds-color-text-quiet", value: "ArrowRight 18/1.75", source: "MobileMenu.tsx:95-97", expect: ["size={18}", "text-slate-400"], side: "right" },
  { selector: '#site-head ul ~ div:has(button[aria-haspopup="listbox"])', name: "Language row", value: "label 13 · mt 16 · above the CTA", source: "MobileMenu.tsx:104-105", expect: ["relative z-10 mt-4", "text-[13px]"], side: "left" },
  { selector: "#site-head ul ~ div button[data-cta]", name: "Try now", token: "--ds-color-primary", value: "PrimaryCta at full width · mt 20", source: "MobileMenu.tsx:110", expect: "mt-5 [&>button]:w-full", side: "right" },
  { selector: '#site-head div[aria-hidden="true"]', name: "Veil", token: "--ds-color-ink-20", value: "ink at 20% · a tap closes", source: "MobileMenu.tsx:72", expect: "bg-[#0a1b33]/20", side: "left" },
];

export const MENU_STATES = ["closed", "open"] as const;

export const MENU_BEHAVIOUR: readonly KeyRow[] = [
  { key: "open", value: "the veil fades in over 250ms and the sheet rises 8px as it fades in, on the system ease", source: "MobileMenu.tsx:79" },
  { key: "hold", value: "the page's overflow is clipped while the sheet is open, so it holds still", source: "MobileMenu.tsx:16" },
  { key: "close", value: "the X, a tap on the veil or Escape", source: "MobileMenu.tsx:30" },
  { key: "row tap", value: "closes, frees the page, then glides to the section. Under ClickLock the row is locked and the sheet stays", source: "MobileMenu.tsx:40" },
  { key: "row pressed", value: "the label turns accent while pressed, touch having no hover", source: "MobileMenu.tsx:91" },
  { key: "md 768px", value: "every part is md:hidden, so the menu exists only below 768", source: "MobileMenu.tsx:53" },
];

export const MENU_VALUES: readonly ValueRow[] = [
  { part: "Menu button", value: "40 round · Menu and X at 22/1.75 · ink · icons swap at once", source: "MobileMenu.tsx:53" },
  { part: "Veil", token: "--ds-color-ink-20", value: "rgb(10 27 51 / 0.2) · from the bar's foot, 100vh tall", source: "MobileMenu.tsx:72" },
  { part: "Sheet", token: "--ds-color-surface", value: "#ffffff · px 16 · pt 4 · pb 24 · slate-200 stroke at 80%", source: "MobileMenu.tsx:80" },
  { part: "Row", token: "--ds-type-menu-row-size", value: "Outfit 20 · 400 · tracking tight · py 16 · 63 tall (30 line, 16 above and below, 1px rule)", source: "MobileMenu.tsx:91" },
  { part: "Row rule", token: "--ds-color-line-divider", value: "slate-100, 1px", source: "MobileMenu.tsx:91" },
  { part: "Row arrow", token: "--ds-color-text-quiet", value: "ArrowRight 18 · 1.75 · slate-400", source: "MobileMenu.tsx:94" },
  { part: "Language label", token: "--ds-color-text-muted", value: "13 · #64748b", source: "MobileMenu.tsx:105" },
  { part: "Try now", token: "--ds-color-primary", value: "PrimaryCta stretched to full width, mt 20", source: "MobileMenu.tsx:110" },
  { part: "Motion", token: "--ds-dur-menu", value: "250ms · the sheet on --ds-ease-out, the veil on motion's default", source: "MobileMenu.tsx:79" },
];

export const MENU_PROPS: readonly PropRow[] = [
  { name: "links", type: "{ label: string; to: Spot }[]", note: "required, the header passes its tabs" },
];

export const MENU_CODE = `import { MobileMenu } from "@/components/website/MobileMenu";

// in the header's right cluster, after Sign in
<MobileMenu links={LINKS} />`;
