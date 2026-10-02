// Frame part terminal-phone: one job terminal outside its card, at a true viewport width. It keeps only the
// card's width chain (main's gutter, the jobs section's inner, then the job card's width, border and side
// padding below xl), so its phone step (292 tall, 11.5 / 20 type under 768) is the frame's own and it is as
// wide as on the homepage. The card itself (its border, fill, title, line and the 26px above the terminal,
// Jobs.tsx) is not drawn, so the terminal is never shown at a height the card does not give it. It is asked to
// play once mounted and then stays filled, on the grain ground, past the grain's fade as deep in the page.
import { JobTerminal } from "@/components/website/JobTerminal";
import { JOBS } from "@/components/website/jobs-data";
import { GrainLead } from "./page-column";
import s from "./phone-frames.module.css";

export function TerminalPhone() {
  return (
    <GrainLead>
      <div className={s["ds-term"]}>
        <div className={s["ds-term-card"]}>
          <JobTerminal run={JOBS[1].run} play />
        </div>
      </div>
    </GrainLead>
  );
}
