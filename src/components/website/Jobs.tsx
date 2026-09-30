"use client";

// "One model. Three jobs.": what the player model does, as three cards in the hero's look (its grey
// container, rounded, hairline border, soft shadow; navy type, the accent on a word). Each job has its
// eyebrow, title and line, a terminal where the agent visibly does the job (JobTerminal.tsx), and its
// tags. The cards rise in one after the other when the section comes into view, once; the terminals run
// while they are in view. Copy and runs are in jobs-data.ts.
import { motion } from "motion/react";
import { JOBS } from "./jobs-data";
import { JobTerminal } from "./JobTerminal";

const ease = [0.22, 1, 0.36, 1] as const;
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
      className="relative mx-auto w-full max-w-[1400px] px-4 py-24 md:px-16"
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
            className="flex flex-col rounded-[40px] max-md:rounded-[28px] border border-slate-200/50 bg-[#e3e5e8] p-7 md:p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)]"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
              {j.eyebrow}
            </span>
            <h3 className="mt-3 font-display text-[26px] font-medium leading-tight tracking-tight text-[#0a1b33]">
              {j.title}
            </h3>
            <p className="mt-2 min-h-[3.2em] font-sans text-[15px] leading-relaxed text-[#64748b]">
              {j.body}
            </p>
            <div className="mt-7">
              <JobTerminal id={j.id} run={j.run} lead={k * 1100} />
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {j.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-slate-300/60 bg-white/60 px-3.5 py-1.5 font-sans text-[13px] text-[#0a1b33]"
                >
                  {t}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
