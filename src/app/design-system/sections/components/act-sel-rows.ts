// The props row the Actions and Selection sections (button, icon button, text link, segmented, tabs, chip)
// share. Their value rows come from display-values.ts, the one token and site row helper.
import type { PropRow } from "@/app/design-system/_kit/SpecDrawer";

/** The forceState prop every system part takes, written once. */
export const FORCE_PROP: PropRow = {
  name: "forceState",
  type: "ForceState",
  note: "a StateGrid cell's state, printed as data-force or switched on as a prop",
};
