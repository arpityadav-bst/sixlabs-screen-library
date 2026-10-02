"use client";

// The third rule taught as a pair on the system Segmented, in the Jobs switch's own labels: the selected
// job in primary navy, then the same control with its primary set to the accent for the Don't.
import { useState } from "react";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Segmented } from "@/components/design-system/Segmented";
import { JOBS } from "@/components/website/jobs-data";
import s from "./start.module.css";

const OPTIONS = JOBS.map((j) => ({ id: j.id, label: j.title }));

function JobSwitch() {
  const [value, setValue] = useState(OPTIONS[0].id);
  return <Segmented options={OPTIONS} value={value} onChange={setValue} label="The three jobs" />;
}

export function StatePair() {
  return (
    <DoDont>
      <Do ground="surface" reason="The selected job takes primary navy, so state reads as a fill and the accent stays for type, dots and the ring.">
        <JobSwitch />
      </Do>
      <Dont ground="surface" reason="An accent thumb turns a choice into a call for attention, and the switch outshouts the heading above it.">
        <span className={s["ds-pr-accent"]}>
          <JobSwitch />
        </span>
      </Dont>
    </DoDont>
  );
}
