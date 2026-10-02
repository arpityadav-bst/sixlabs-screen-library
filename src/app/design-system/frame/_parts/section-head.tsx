// The system section head at true widths, for its responsive preview: the h2 size steps from 30 to 44 at
// md and the subline from 15 to 16, and the display size follows the window between 38 and 74. Both heads sit
// deep in the page's grained block (Jobs, Closing), so the grain starts past its fade (GrainLead), and the
// closing's typed accent waits for its words to come into view (onView), as Closing.tsx ships it.
import { SectionHead } from "@/components/design-system/SectionHead";
import { TypedWord } from "@/components/website/TypedWord";
import { CLOSING_HEAD, JOBS_HEAD } from "../../_data/specimens";
import { GrainLead } from "./page-column";

export function SectionHeadPart() {
  return (
    <GrainLead>
      <div style={{ display: "grid", gap: 56, padding: "40px 16px 56px", maxWidth: 1400, margin: "0 auto" }}>
        <SectionHead title={JOBS_HEAD.title} accent={JOBS_HEAD.accent} sub={JOBS_HEAD.sub} />
        <SectionHead
          size="display"
          align="center"
          accentBreak
          title={CLOSING_HEAD.title}
          accent={<TypedWord word={CLOSING_HEAD.accent} className="text-accent" onView />}
        />
      </div>
    </GrainLead>
  );
}
