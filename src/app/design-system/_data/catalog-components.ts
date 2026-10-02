// Catalog entries for Components, in page order: the group, its runs kept one file per sub-label pair
// (Actions and Selection, Inputs, Display, Feedback and Overlays) so no file outgrows the cap.
import { defineGroup } from "./catalog-types";
import { ACTIONS_SELECTION } from "./catalog-components-actions";
import { DISPLAY } from "./catalog-components-display";
import { INPUTS } from "./catalog-components-inputs";
import { FEEDBACK_OVERLAYS } from "./catalog-components-overlays";

export const COMPONENTS = defineGroup({
  id: "components",
  title: "Components",
  lead: "The parts a page is made of, grouped by what they do, each shown in every variant and state it can take.",
  sections: [...ACTIONS_SELECTION, ...INPUTS, ...DISPLAY, ...FEEDBACK_OVERLAYS],
});
