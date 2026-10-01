"use client";

// After the players, on the light page again (the light rises back over the accent blue, AccentWave.tsx):
// ChatGPT and 6labs compared, in two cards side by side. On the left, in the hero's own look (its grey
// container, rounded corners, hairline border; no shadow; navy type), ChatGPT; on the right, in the primary
// (the CTA's navy) in white for the contrast, 6labs. Each opens with its maker's mark and name side by side
// (brand-marks.tsx, both marks in one line style), then the same two lines: what it learns from, and what
// it now understands. Each line is in its card's one ink (navy on the grey, white on the navy), and the two
// cards share their rows (a subgrid), so each line sits level with its
// counterpart and reads across. The grid is the section below's (Jobs.tsx): the same width and side
// padding, and its 24px gutter between the cards. They rise in one after the other when the section comes into
// view, once, and a "vs" over the gutter between them joins the two.
// The section is only as tall as its cards; above them, below the fixed header, and below them to the next
// one (Jobs.tsx) the same block's distance (about 144px, 96px on phones), not a whole section's.
import { motion } from "motion/react";
import { ChatGptMark, SixLabsMark } from "./brand-marks";

const ease = [0.22, 1, 0.36, 1] as const;
// ChatGPT's card in the hero container's look (Hero.tsx); ours in the primary, the Try now button's navy
// (PrimaryCta.tsx), for the contrast. From md each card spans the grid's three rows as a subgrid.
const card =
  "flex flex-col rounded-[36px] max-md:rounded-[28px] border p-7 md:p-9 md:row-span-3 md:grid md:grid-rows-subgrid md:gap-y-0";
const theirs = card + " border-slate-200/50 bg-[#e3e5e8] text-[#0a1b33]";
// the left padding a step wider than the card's own (64px from md), for room from the "vs" over the gutter
const ours = card + " border-transparent bg-[#0a152d] text-white md:pl-16";
// the maker's mark and name, side by side, at the top of each card
const lockup = "flex items-center gap-2.5";
// the names at one visible weight: white on the navy reads heavier than navy on the grey, so 6labs sits a
// step lighter than ChatGPT for the two to look the same
const name = "font-display text-[22px] tracking-tight";
const line =
  "font-display text-[20px] md:text-[26px] font-normal leading-[1.3] tracking-tight";
// each line: its verb, then what it is about; the verbs are the same kind on both sides, the rest differs
const LINES = [
  {
    theirs: ["Reads", "the internet"],
    ours: ["Watches", "millions of hours of gameplay"],
  },
  {
    theirs: ["Understands", "facts and how humans think"],
    ours: ["Understands", "the game player"],
  },
];
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.7, ease, delay },
});

// a card's two lines, all in the card's own ink (navy on the grey, white on the navy)
function Lines({ side }: { side: "theirs" | "ours" }) {
  return LINES.map((l, k) => (
    <p key={k} className={line + (k === 0 ? " mt-6" : " mt-3")}>
      {l[side][0]} {l[side][1]}
    </p>
  ));
}

export function Understands() {
  return (
    <section
      id="understands"
      className="relative mx-auto w-full max-w-[1400px] px-4 pt-[calc(70px+96px)] md:px-16 md:pt-[calc(89px+clamp(96px,9vw,144px))]"
    >
      <div className="relative grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:grid-rows-[auto_auto_auto] md:gap-x-6 md:gap-y-0">
        <motion.div {...rise(0)} className={theirs}>
          <span className={lockup}>
            <ChatGptMark className="h-8 w-8" />
            <span className={name + " font-medium"}>ChatGPT</span>
          </span>
          <Lines side="theirs" />
        </motion.div>
        <motion.div {...rise(0.15)} className={ours}>
          <span className={lockup}>
            <SixLabsMark className="h-8 w-8" />
            <span className={name + " font-normal"}>6labs</span>
          </span>
          <Lines side="ours" />
        </motion.div>
        {/* the "vs" that joins them: over the gutter at the cards' middle (where the stacked cards meet, on a
            phone), a ring of the page's own colour round it, so it reads as cut into both cards. The word is
            lower case with no ascenders, so it is lifted a little (0.07em) to sit in the disc's optical middle */}
        <motion.span
          {...rise(0.3)}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[6px] border-[rgb(var(--page-rgb))] bg-white font-display text-[34px] font-normal tracking-tight text-[#0a1b33]/30 max-md:h-16 max-md:w-16 max-md:text-[27px]"
        >
          <span className="relative -top-[0.07em] leading-none">vs</span>
        </motion.span>
      </div>
    </section>
  );
}
