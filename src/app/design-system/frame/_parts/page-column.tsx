// A light section the way the website lays it out: inside main's gutter and horizontal clip, on the grained
// block that bleeds back over the gutter, with ClickLock mounted as the page mounts it. A swipe row that pulls
// past the section's padding (the jobs row) is clipped by main as it is on the page, so the frame never
// scrolls sideways and the cards keep their shipped widths. Every section but Understands sits deep in the
// page's one grained block, so by default the grain starts 240px above the frame (GrainLead), past its fade.
import type { ReactNode } from "react";
import { ClickLock } from "@/components/website/ClickLock";
import s from "./page-column.module.css";

export function LightColumn({
  className,
  lead = true,
  children,
}: {
  className?: string;
  /** start the grain past its 240px fade, as deep in the page (off for Understands, which opens the block) */
  lead?: boolean;
  children: ReactNode;
}) {
  const cls = ["page-grain", s["ds-col-grain"], lead ? s["ds-grain-lead"] : "", className].filter(Boolean).join(" ");
  return (
    <div className={s["ds-col"]}>
      <div className={cls}>
        <ClickLock />
        {children}
      </div>
    </div>
  );
}

/** The grain block for a part that sits deep in the page's grained run: its fade runs above the frame. */
export function GrainLead({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={["page-grain", s["ds-grain-lead"], className].filter(Boolean).join(" ")}>{children}</div>;
}
