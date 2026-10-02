"use client";

// The Try now button's real dot band (CtaDots) alone, held at the middle of its sweep, on a guide stand-in
// pill in the button's navy at its measured size. The label and the shifted fill a hover lays under the
// band are left out, so a still is the band, not Try now mid-hover. Its motion values are made here,
// because a server section cannot hand a MotionValue across the boundary.
import { useMotionValue } from "motion/react";
import { CtaDots } from "@/components/website/CtaDots";
import { CTA_BAND, CTA_SIZE } from "./families-data";
import s from "./fx-live.module.css";

export function CtaStill() {
  const t = useMotionValue(0.5);
  const opacity = useMotionValue(0.75);
  return (
    <div data-ds="cta-stage" className={s["ds-cta-stage"]} style={{ width: CTA_SIZE.w, height: CTA_SIZE.h }}>
      <CtaDots t={t} opacity={opacity} size={CTA_SIZE} band={CTA_BAND} />
    </div>
  );
}
