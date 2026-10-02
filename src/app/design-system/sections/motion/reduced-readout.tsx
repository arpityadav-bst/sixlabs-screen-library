"use client";

// The reader's own setting, live: which reading of every motion specimen on this page they are seeing.
// It answers false on the server and in the first paint, then the real value.
import { useReducedMotionSetting } from "@/app/design-system/_kit/reduced-motion";
import { READOUT_QUERY } from "./_data/reduced";
import styles from "./motion.module.css";

export function ReducedReadout() {
  const reduced = useReducedMotionSetting();
  return (
    <div className={styles["ds-mo-readout"]} aria-live="polite">
      <code className={styles["ds-mo-query"]}>{READOUT_QUERY}.matches</code>
      <p className={styles["ds-mo-answer"]} data-on={reduced} style={{ margin: 0 }}>
        <i aria-hidden="true" />
        {reduced ? "true: reduced motion is on" : "false: full motion"}
      </p>
      <p className={styles["ds-mo-says"]}>
        {reduced
          ? "The CSS loops on this page stand still and the spinner turns slower. The tile floor, the glide and the entrances still move."
          : "Every specimen runs as the site does. Turn on Reduce motion in the system settings to see the other reading here."}
      </p>
    </div>
  );
}
