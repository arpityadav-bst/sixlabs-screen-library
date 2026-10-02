"use client";

// The duration ladder: one dot per duration token, all leaving together on the ease, so the eye reads the
// ladder as lengths rather than numbers. It runs once when it scrolls into view (not under reduced
// motion) and again on Run. The dots travel by transform only.
import { motion, useInView } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import { EASE } from "@/components/design-system/motion";
import { useReducedMotionSetting } from "@/app/design-system/_kit/reduced-motion";
import styles from "./motion.module.css";

export type LadderRung = { name: string; ms: number; job: string };

export function DurationLadder({ rungs, label }: { rungs: readonly LadderRung[]; label: string }) {
  const box = useRef<HTMLDListElement>(null);
  const seen = useInView(box, { once: true, amount: 0.5 });
  const reduced = useReducedMotionSetting();
  const [run, setRun] = useState(0);
  const go = run > 0 || (seen && !reduced);

  return (
    <>
      <button type="button" className="ds-btn ds-replay" aria-label={`Run ${label}`} onClick={() => setRun((n) => n + 1)}>
        <RotateCcw size={14} strokeWidth={2} aria-hidden="true" />
        Run
      </button>
      <dl ref={box} className={styles["ds-mo-ladder"]} aria-label={label}>
        {rungs.map((r) => (
          <div key={r.name} style={{ display: "contents" }}>
            <dt title={r.job}>
              <b>{r.ms}</b> ms · {r.name}
            </dt>
            <dd className={styles["ds-mo-track"]}>
              <motion.span
                key={run}
                aria-hidden="true"
                className={styles["ds-mo-mover"]}
                initial={{ x: "0%" }}
                animate={{ x: go ? "100%" : "0%" }}
                transition={{ duration: r.ms / 1000, ease: EASE }}
              >
                <span className={styles["ds-mo-dot"]} />
              </motion.span>
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
