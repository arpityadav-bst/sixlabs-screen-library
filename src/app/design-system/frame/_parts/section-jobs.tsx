// Frame part "section-jobs": the real jobs section in the page's column, on the grain ground, with ClickLock
// mounted as the page mounts it. Below xl it shows the three-job switch over a swipe row, which pulls past the
// section's padding and is clipped by main as on the page, and from xl the three cards side by side, so the
// guide frames it at true widths (the segmented switch, the job cards, the tag panels).
import { Jobs } from "@/components/website/Jobs";
import { LightColumn } from "./page-column";

export function SectionJobs() {
  return (
    <LightColumn>
      <Jobs />
    </LightColumn>
  );
}
