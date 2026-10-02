// Holds each cover's state list to the columns its section's state grids actually show, so the index card's
// States count and the coverage table cannot drift from the grids. A grid column that is a ground or a range
// (on-blue, range) is listed as one of the cover's variants instead, and the check takes it as met. Server
// only: it reads the sections' own state arrays, which catalog.ts (pure data for the index page and the
// DESIGN.md build) must never import. The guide page refuses to build on any mismatch.
import { ACC_STATES } from "../sections/components/accordion-data";
import { BUTTON_STATES } from "../sections/components/button-data";
import { CHIP_STATES } from "../sections/components/chip-data";
import { DIALOG_STATES, SHEET_STATES } from "../sections/components/dialog-data";
import { ICON_STATES } from "../sections/components/icon-button-data";
import { STATES as PROGRESS_STATES } from "../sections/components/progress-data";
import { SEG_STATES } from "../sections/components/segmented-data";
import { TAB_STATES } from "../sections/components/tabs-data";
import { LINK_STATES } from "../sections/components/text-link-data";
import { TOAST_CONTROL_STATES } from "../sections/components/toast-data";
import { CHECK_STATES, RADIO_STATES, SWITCH_STATES } from "../sections/components/_data/choice";
import { AREA_STATES, FIELD_STATES } from "../sections/components/_data/fields";
import { SEARCH_STATES, SELECT_STATES } from "../sections/components/_data/select-search";
import { SLIDER_STATES } from "../sections/components/_data/slider";
import { SECTIONS, type SectionId } from "./catalog";

type Grid = { id: SectionId; component: string; columns: readonly (readonly string[])[] };

/** Each cover and the state arrays its grids are drawn from. */
const GRIDS: readonly Grid[] = [
  { id: "button", component: "Button", columns: [BUTTON_STATES] },
  { id: "icon-button", component: "IconButton", columns: [ICON_STATES] },
  { id: "text-link", component: "TextLink", columns: [LINK_STATES] },
  { id: "segmented", component: "Segmented", columns: [SEG_STATES] },
  { id: "tabs", component: "Tabs", columns: [TAB_STATES] },
  { id: "chip", component: "Chip", columns: [CHIP_STATES] },
  { id: "fields", component: "TextInput", columns: [FIELD_STATES] },
  { id: "fields", component: "TextArea", columns: [AREA_STATES] },
  { id: "select-search", component: "Select", columns: [SELECT_STATES] },
  { id: "select-search", component: "SearchField", columns: [SEARCH_STATES] },
  { id: "choice", component: "Checkbox", columns: [CHECK_STATES] },
  { id: "choice", component: "Radio", columns: [RADIO_STATES] },
  { id: "choice", component: "Switch", columns: [SWITCH_STATES] },
  { id: "slider", component: "Slider", columns: [SLIDER_STATES] },
  { id: "progress", component: "Progress", columns: [PROGRESS_STATES] },
  { id: "accordion", component: "Accordion", columns: [ACC_STATES] },
  { id: "toast", component: "Toast", columns: [TOAST_CONTROL_STATES] },
  { id: "dialog", component: "Dialog", columns: [DIALOG_STATES, SHEET_STATES] },
];

export function stateProblems(): string[] {
  const out: string[] = [];
  for (const g of GRIDS) {
    const c = SECTIONS.find((s) => s.id === g.id)?.covers.find((x) => x.component === g.component);
    if (!c) {
      out.push(`${g.id}: no cover for ${g.component}, whose state grid catalog-states.ts checks`);
      continue;
    }
    const variants = new Set(c.variants ?? []);
    const shown = new Set(g.columns.flat().filter((s) => !variants.has(s)));
    const listed = new Set(c.states ?? []);
    const missing = [...shown].filter((s) => !listed.has(s));
    const extra = [...listed].filter((s) => !shown.has(s));
    if (missing.length) out.push(`${g.id}: ${g.component}'s grid shows ${missing.join(", ")}, which its cover does not list`);
    if (extra.length) out.push(`${g.id}: ${g.component}'s cover lists ${extra.join(", ")}, which its grid does not show`);
  }
  return out;
}
