"use client";

// "One model. Three jobs.": what the player model does, as three white cards (hairline border, soft
// shadow, the players' cards' family; navy type, the accent on a word). Each job has its title and line, a terminal where the agent visibly does the job (JobTerminal.tsx), and its
// tags as a small skills list. The cards rise in one after the other when the section comes into view, once; the terminals run
// while they are in view. Copy and runs are in jobs-data.ts.
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
  return (
    <section
      id="jobs"
      className="relative mx-auto w-full max-w-[1400px] px-4 pt-[clamp(96px,9vw,144px)] pb-24 md:px-16"
    >
      <motion.div {...rise(0)}>
        <h2 className="font-display text-[34px] md:text-[56px] font-medium leading-[1.05] tracking-tight text-[#0a1b33]">
          One model. <span className="text-accent">Three jobs.</span>
        </h2>
        <p className="mt-5 max-w-[520px] font-sans text-[16px] md:text-[18px] leading-relaxed text-[#64748b]">
          Everything comes from the model of your players.
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {JOBS.map((j, k) => (
          <motion.article
            key={j.id}
            {...rise(0.1 + k * 0.12)}
            className="flex flex-col rounded-[32px] max-md:rounded-[24px] border border-slate-200/80 bg-white p-7 md:p-8 shadow-[0_1px_2px_rgba(10,27,51,0.04),0_24px_48px_-32px_rgba(10,27,51,0.25)]"
          >
            <h3 className="font-display text-[26px] font-medium leading-tight tracking-tight text-[#0a1b33]">
              {j.title}
            </h3>
            <p className="mt-2 font-sans text-[15px] leading-relaxed text-[#64748b] xl:min-h-[3.25em]">
              {j.body}
            </p>
            <div className="mt-7">
              <JobTerminal run={j.run} lead={k * 1100} />
            </div>
            {/* The tags as the onBlue creators page's skills list: one soft panel, a row per tag, an
                accent line icon then the label, every label on the full width. The panel holds four rows in
                every card, so the three line up whichever job has fewer. */}
            <ul className="mt-6 space-y-3 rounded-[12px] border border-slate-200/80 bg-[#f6f7f9] px-4 py-3.5 xl:min-h-[146px]">
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
