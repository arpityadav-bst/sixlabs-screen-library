"use client";

// After the players, on the light page again (the light rises back over the accent blue, AccentWave.tsx):
// two cards side by side, the same line twice. On the left, in the hero's own look (its grey container,
// rounded corners, hairline border; no shadow; navy type), ChatGPT: it reads the internet and now
// understands facts and how humans think. On the right, in the primary (the CTA's navy) in white for the contrast, 6labs: it
// watches the gameplay and now understands the game player. Each card opens with its maker's mark and name
// side by side (brand-marks.tsx, both marks in one line style). They rise in one after the other when the
// section comes into view, once. The section is only as tall as its cards; above them, below the fixed
// header, and below them to the next one (Jobs.tsx) the same block's distance (about 144px, 96px on
// phones), not a whole section's.
import { motion } from "motion/react";
import { ChatGptMark, SixLabsMark } from "./brand-marks";

const ease = [0.22, 1, 0.36, 1] as const;
// ChatGPT's card in the hero container's look (Hero.tsx); ours in the primary, the Try now button's navy
// (PrimaryCta.tsx), for the contrast
const card =
  "flex flex-col rounded-[36px] max-md:rounded-[28px] border p-7 md:p-9";
const theirs = card + " border-slate-200/50 bg-[#e3e5e8] text-[#0a1b33]";
const ours = card + " border-transparent bg-[#0a152d] text-white";
// the maker's mark and name, side by side, at the top of each card
const lockup = "flex items-center gap-2.5";
const name = "font-display text-[18px] font-medium tracking-tight";
const line =
  "mt-6 font-display text-[20px] md:text-[26px] font-medium leading-[1.3] tracking-tight";
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.7, ease, delay },
});

export function Understands() {
  return (
    <section
      id="understands"
      className="relative mx-auto w-full max-w-[1400px] px-4 pt-[calc(70px+96px)] md:px-16 md:pt-[calc(89px+clamp(96px,9vw,144px))]"
    >
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div {...rise(0)} className={theirs}>
          <span className={lockup}>
            <ChatGptMark className="h-8 w-8" />
            <span className={name}>ChatGPT</span>
          </span>
          <p className={line}>
            It reads the internet and now it understands facts and how humans
            think.
          </p>
        </motion.div>
        <motion.div {...rise(0.15)} className={ours}>
          <span className={lockup}>
            <SixLabsMark className="h-8 w-8" />
            <span className={name}>6labs</span>
          </span>
          <p className={line}>
            It watches millions of hours of gameplay and now it understands the
            game player.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
