"use client";

// After the players, on the light page again (the light rises back over the accent blue, AccentWave.tsx):
// a comparison of two cards, side by side with a "vs" between them. On the left, in the hero's own look (its
// grey container, rounded corners, hairline border; no shadow; navy type), ChatGPT; on the right, in the
// primary (the CTA's navy) in white for the contrast, 6labs. Each opens with its maker's mark and name
// (brand-marks.tsx, both marks in one line style), then the same two rows: what it learns from, and what it
// now understands, each a small label over the answer, a hairline between them. The two cards share their
// rows (a subgrid), so each row lines up across them whatever wraps, and the eye compares row by row. They
// rise in one after the other when the section comes into view, once. The section is only as tall as its
// cards; above them, below the fixed header, and below them to the next one (Jobs.tsx) the same block's
// distance (about 144px, 96px on phones), not a whole section's.
import { motion } from "motion/react";
import { ChatGptMark, SixLabsMark } from "./brand-marks";

const ease = [0.22, 1, 0.36, 1] as const;
// ChatGPT's card in the hero container's look (Hero.tsx); ours in the primary, the Try now button's navy
// (PrimaryCta.tsx), for the contrast. From md each card spans the grid's three rows as a subgrid.
const card =
  "rounded-[36px] max-md:rounded-[28px] border p-7 md:p-9 md:row-span-3 md:grid md:grid-rows-subgrid md:gap-y-0";
const theirs = card + " border-slate-200/50 bg-[#e3e5e8] text-[#0a1b33]";
const ours = card + " border-transparent bg-[#0a152d] text-white";
// the maker's mark and name, side by side, at the top of each card
const lockup = "flex items-center gap-2.5";
// the names at one visible weight: white on the navy reads heavier than navy on the grey, so 6labs sits a
// step lighter than ChatGPT for the two to look the same
const name = "font-display text-[22px] tracking-tight";
// a row: its label small and spaced, its answer in the line's display size; the second row under a hairline
const label =
  "block font-sans text-[11px] font-medium uppercase tracking-[0.14em]";
const answer =
  "mt-2 block font-display text-[20px] md:text-[26px] font-normal leading-[1.3] tracking-tight";
const ROWS = [
  {
    label: "Learns from",
    theirs: "The internet",
    ours: "Millions of hours of gameplay",
  },
  {
    label: "Understands",
    theirs: "Facts and how humans think",
    ours: "The game player",
  },
];
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.7, ease, delay },
});

function Rows({
  side,
  rule,
  muted,
}: {
  side: "theirs" | "ours";
  rule: string;
  muted: string;
}) {
  return ROWS.map((r, k) => (
    <div
      key={r.label}
      className={k === 0 ? "pt-7" : "mt-6 border-t pt-6 " + rule}
    >
      <span className={label + " " + muted}>{r.label}</span>
      <span className={answer}>{r[side]}</span>
    </div>
  ));
}

export function Understands() {
  return (
    <section
      id="understands"
      className="relative mx-auto w-full max-w-[1400px] px-4 pt-[calc(70px+96px)] md:px-16 md:pt-[calc(89px+clamp(96px,9vw,144px))]"
    >
      <div className="relative grid w-full grid-cols-1 gap-10 md:grid-cols-2 md:grid-rows-[auto_auto_auto] md:gap-x-16 md:gap-y-0">
        <motion.div {...rise(0)} className={theirs}>
          <span className={lockup}>
            <ChatGptMark className="h-8 w-8" />
            <span className={name + " font-medium"}>ChatGPT</span>
          </span>
          <Rows
            side="theirs"
            rule="border-[#0a1b33]/10"
            muted="text-[#0a1b33]/45"
          />
        </motion.div>
        <motion.div {...rise(0.15)} className={ours}>
          <span className={lockup}>
            <SixLabsMark className="h-8 w-8" />
            <span className={name + " font-normal"}>6labs</span>
          </span>
          <Rows side="ours" rule="border-white/15" muted="text-white/50" />
        </motion.div>
        {/* the "vs" between them: in the gap's middle, side by side or stacked */}
        <motion.span
          {...rise(0.3)}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-slate-200/80 bg-white font-display text-[14px] font-medium text-[#0a1b33] shadow-[0_8px_24px_-12px_rgba(10,27,51,0.25)]"
        >
          vs
        </motion.span>
      </div>
    </section>
  );
}
