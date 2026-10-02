"use client";

// Sample cards rising the way a light section's parts do: in view, once, on the ease. The plan (travel,
// length, staggers, threshold) is data, so the Don't panel runs the same code with long travel. A `vs` plan
// draws Understands' beats: two cards, then the small disc over the gutter at their middle (where the
// cards meet once they stack), ringed in the page's colour as the site's 80px disc is.
import { motion } from "motion/react";
import { EASE } from "@/components/design-system/motion";
import type { RisePlan } from "./_data/entrance";
import styles from "./motion.module.css";

export function RiseSample({ plan }: { plan: RisePlan }) {
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: plan.y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: plan.amount },
    transition: { duration: plan.duration, ease: EASE, delay },
  });
  const cards = plan.vs ? plan.delays.slice(0, -1) : plan.delays;
  const vsAt = plan.delays[plan.delays.length - 1];

  return (
    <div className={styles["ds-mo-row"]}>
      {cards.map((delay) => (
        <motion.div key={delay} className={styles["ds-mo-sample"]} {...rise(delay)}>
          <span />
          <span />
        </motion.div>
      ))}
      {plan.vs && (
        <motion.span className={styles["ds-mo-vs"]} aria-hidden="true" {...rise(vsAt)}>
          vs
        </motion.span>
      )}
    </div>
  );
}
