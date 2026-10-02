"use client";

// The light page's section heading as one part: a navy line whose closing words carry the accent ("One
// model. Three jobs.", Jobs.tsx:106), an optional muted subline and an optional eyebrow. The accent takes a
// node, so a TypedWord can sit in it. Two sizes: the h2 role and the closing display role, both read from
// the type tokens. With rise it enters as every section does, 28px up over 0.7s once a quarter is in view.
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { EASE, RISE } from "./motion";
import { typeStyle } from "./tokens";

export type SectionHeadSize = "h2" | "display";

export type SectionHeadProps = {
  /** the line before the accent, in ink */
  title: ReactNode;
  /** the closing word or two, in the accent */
  accent?: ReactNode;
  /** put the accent on its own line (the closing line's break) */
  accentBreak?: boolean;
  sub?: ReactNode;
  eyebrow?: string;
  size?: SectionHeadSize;
  align?: "start" | "center";
  as?: "h2" | "h3";
  /** the subline's slate, a step darker on the container grey */
  ground?: "page" | "container";
  rise?: boolean;
  id?: string;
  className?: string;
};

export function SectionHead({
  title,
  accent,
  accentBreak = false,
  sub,
  eyebrow,
  size = "h2",
  align = "start",
  as: Heading = "h2",
  ground = "page",
  rise = false,
  id,
  className = "",
}: SectionHeadProps) {
  const still = useReducedMotion();
  const centre = align === "center";
  const role = size === "display" ? "closing" : "h2";
  const subTone = ground === "container" ? "text-(--ds-color-text-body)" : "text-(--ds-color-text-muted)";
  const motionProps = rise
    ? {
        initial: still ? false : { opacity: 0, y: RISE.y },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.25 },
        transition: { duration: RISE.duration, ease: EASE },
      }
    : {};

  return (
    <motion.div {...motionProps} className={(centre ? "text-center " : "") + className}>
      {eyebrow && (
        <p className="mb-3 font-sans text-[11px] font-medium uppercase leading-[1.5] tracking-[0.18em] text-(--ds-color-text-muted)">
          {eyebrow}
        </p>
      )}
      <Heading id={id} className="text-(--ds-color-ink)" style={typeStyle(role)}>
        {title}
        {accent && (accentBreak ? <br /> : " ")}
        {accent && <span className="text-(--ds-color-accent)">{accent}</span>}
      </Heading>
      {sub && (
        <p
          className={
            `mt-4 max-w-[520px] font-sans text-[15px] leading-snug md:text-[16px] ${subTone} ` +
            (centre ? "mx-auto text-balance" : "")
          }
        >
          {sub}
        </p>
      )}
    </motion.div>
  );
}
