"use client";

// "One model. Three jobs.": what the player model does, as three white cards (sized after the onBlue
// business page's "Every engagement is checked" cards: 20px semibold titles, 14px muted lines) (hairline border, no
// shadow, the players' cards' family; navy type, the accent on a word). Each job has its title and line, a terminal where the agent visibly does the job (JobTerminal.tsx), and its
// tags as a small skills list. The cards rise in one after the other when the section comes into view, once; each terminal runs once, the
// first time its card is pointed at (JobTerminal.tsx). Copy and runs are in jobs-data.ts.
import { useState } from "react";
import { motion } from "motion/react";
import {
  CircleCheck,
  Clapperboard,
  Eye,
  Footprints,
  Languages,
  Layers,
  Lightbulb,
  Plug,
  ScanSearch,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { JOBS } from "./jobs-data";
import { JobTerminal } from "./JobTerminal";

const ease = [0.22, 1, 0.36, 1] as const;
// each tag's line icon (the onBlue creators page's skills lists)
const TAG_ICON: Record<string, LucideIcon> = {
  "Why, not just what": Lightbulb,
  "Evidence clips": Clapperboard,
  "BI plug-in": Plug,
  Functional: CircleCheck,
  Behavioral: Footprints,
  "Large scale": Layers,
  Localization: Languages,
  Deconstruct: ScanSearch,
  Verify: ShieldCheck,
  Observe: Eye,
};
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.7, ease, delay },
});

export function Jobs() {
  // which jobs have been pointed at: each terminal runs the first time its card is
  const [asked, setAsked] = useState<Record<string, true>>({});
  return (
    <section
      id="jobs"
      className="relative mx-auto w-full max-w-[1400px] px-4 pt-[clamp(96px,9vw,144px)] pb-24 md:px-16"
    >
      <motion.div {...rise(0)}>
        <h2 className="font-display text-[30px] md:text-[44px] font-medium leading-[1.1] tracking-tight text-[#0a1b33]">
          One model. <span className="text-accent">Three jobs.</span>
        </h2>
        <p className="mt-4 max-w-[520px] font-sans text-[15px] md:text-[16px] leading-relaxed text-[#64748b]">
          Everything comes from the model of your players.
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {JOBS.map((j, k) => (
          <motion.article
            key={j.id}
            {...rise(0.1 + k * 0.12)}
            onPointerEnter={() =>
              setAsked((a) => (a[j.id] ? a : { ...a, [j.id]: true }))
            }
            className="flex flex-col rounded-[28px] max-md:rounded-[24px] border border-slate-200/80 bg-white px-6 pb-6 pt-7"
          >
            <h3 className="font-display text-[20px] font-semibold leading-tight tracking-[-0.03em] text-[#0a1b33]">
              {j.title}
            </h3>
            <p className="mt-[9px] font-sans text-[14px] leading-[1.5] tracking-[-0.01em] text-[#64748b] xl:min-h-[3em]">
              {j.body}
            </p>
            <div className="mt-[26px]">
              <JobTerminal run={j.run} play={!!asked[j.id]} />
            </div>
            {/* The tags as the onBlue creators page's skills list: one soft panel, a row per tag, an
                accent line icon then the label, filling a column three rows deep before starting the next
                (Testing's fourth sits beside its first), so every panel is three rows tall and they line up. */}
            <ul className="mt-6 grid auto-cols-max grid-flow-col grid-rows-3 justify-start gap-x-8 gap-y-3 rounded-[12px] border border-slate-200/80 bg-[#f6f7f9] px-4 py-3.5">
              {j.tags.map((t) => {
                const Icon = TAG_ICON[t];
                return (
                  <li
                    key={t}
                    className="flex items-center gap-2.5 font-sans text-[13px] leading-5 text-[#0a1b33]"
                  >
                    {Icon && (
                      <Icon
                        className="h-[17px] w-[17px] shrink-0 text-accent"
                        strokeWidth={1.6}
                      />
                    )}
                    {t}
                  </li>
                );
              })}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
