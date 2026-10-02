// Frame part "section-faq": the real FAQ in the page's column, on the grain ground, with ClickLock mounted as
// the page mounts it, for the Focus spec's FAQ rows.
import { Faq } from "@/components/website/Faq";
import { LightColumn } from "./page-column";

export function SectionFaq() {
  return (
    <LightColumn>
      <Faq />
    </LightColumn>
  );
}
