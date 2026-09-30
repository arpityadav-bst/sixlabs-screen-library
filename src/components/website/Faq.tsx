"use client";

// Questions, answered: the FAQ, after the onBlue creators page's (blueai/public/experiments/onblue-vesper,
// #faqs) in the page's own light look. The heading on the left; on the right the questions as rows (white,
// a hairline that firms up on hover and when open, small corners), one list. A row opens smoothly to its
// answer; its plus turns into a minus. Content in faq-data.ts.
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { QUESTIONS } from "./faq-data";

const ease = [0.22, 1, 0.36, 1] as const;

export function Faq() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  return (
    <section
      id="faq"
      className="relative mx-auto w-full max-w-[1400px] px-4 pt-[clamp(72px,7vw,120px)] pb-32 md:px-16"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
        <div>
          <h2 className="font-display text-[30px] md:text-[44px] font-medium leading-[1.1] tracking-tight text-[#0a1b33]">
            Questions, <span className="text-accent">answered.</span>
          </h2>
        </div>
        <ul className="grid gap-2.5 max-md:gap-2">
          {QUESTIONS.map(({ q, a }) => {
            const on = !!open[q];
            return (
              <li
                key={q}
                className={
                  "rounded-[14px] border bg-white transition-colors duration-300 " +
                  (on
                    ? "border-slate-300"
                    : "border-slate-200/80 hover:border-slate-300")
                }
              >
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => setOpen((o) => ({ ...o, [q]: !o[q] }))}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left max-md:gap-4 max-md:px-5 max-md:py-4"
                >
                  <span className="font-display text-[16px] md:text-[18px] font-medium leading-snug tracking-[-0.02em] text-[#0a1b33]">
                    {q}
                  </span>
                  {/* plus, turning to minus */}
                  <span aria-hidden className="relative h-4 w-4 shrink-0">
                    <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 rounded-full bg-[#0a1b33]" />
                    <span
                      className={
                        "absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 rounded-full bg-[#0a1b33] transition-[rotate,opacity] duration-300 " +
                        (on ? "rotate-0 opacity-0" : "rotate-90")
                      }
                    />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[680px] px-6 pb-6 font-sans text-[15px] leading-[1.6] text-[#475569] max-md:px-5 max-md:pb-5 max-md:text-[14px]">
                        {a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
