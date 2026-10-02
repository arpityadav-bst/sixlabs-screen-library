"use client";

// Three stills of the xl primary's sweep band alone, each the site's own CtaDots held at one moment of its
// run on a plain navy stage, so the band's shape (bowed at the ends, straight in the middle) reads without
// hovering. The shipped pill also lays its shifted fill and its label over the band, which a still leaves out.
import { useMotionValue } from "motion/react";
import { Item } from "@/app/design-system/_kit/Label";
import { CtaDots } from "@/components/website/CtaDots";
import { SWEEP_FRAMES } from "./button-data";
import styles from "./button.module.css";

const SIZE = { w: 220, h: 52 };

function Still({ at }: { at: number }) {
  const t = useMotionValue(at);
  const opacity = useMotionValue(0.75);
  return (
    <Item label={`band alone · t ${at} · ${Math.round(at * 1000)}ms of 1000`}>
      <div className={styles["ds-cta-stage"]}>
        <CtaDots t={t} opacity={opacity} size={SIZE} band={34} />
      </div>
    </Item>
  );
}

export function SweepStrip() {
  return (
    <>
      {SWEEP_FRAMES.map((k) => (
        <Still key={k} at={k} />
      ))}
    </>
  );
}
