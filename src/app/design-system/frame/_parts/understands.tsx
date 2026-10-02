// The comparison section in the page's column on the grained light page, for the Comparison spec's responsive
// preview, so each card takes its shipped width. Its top padding (the room the fixed header and the section
// above need on the page) is cropped to 32px by the kit's comparison crop, so each width opens on the cards.
// It opens the page's grained block, so its grain starts at its own top, with no lead-in.
import { Understands } from "@/components/website/Understands";
import crop from "../../_kit/crop.module.css";
import { LightColumn } from "./page-column";

export function SectionUnderstands() {
  return (
    <LightColumn lead={false} className={`${crop["ds-crop"]} ${crop["ds-crop--frame"]}`}>
      <Understands />
    </LightColumn>
  );
}
