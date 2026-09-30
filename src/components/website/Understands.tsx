"use client";

// After the players, on the light page again (the light rises back over the accent blue, AccentWave.tsx):
// two cards side by side, the same line twice, in the hero's own look (its grey container, rounded corners,
// hairline border and soft shadow; one text colour, navy, with the accent only on a word). On
// the left ChatGPT's: it reads the internet and now understands facts and how humans think. On the right ours:
// it watches the gameplay and now understands the game player (the accent). Each carries its maker's mark at
// the top, both in the same line style (brand-marks.tsx), ours in the accent. They rise in one after the
// other when the section comes into view, once. The section is only as tall as its cards; above them, below the fixed
// header, and below them to the next one (Jobs.tsx) the same block's distance (about 144px, 96px on
// phones), not a whole section's.
import { motion } from "motion/react";
import { ChatGptMark, SixLabsMark } from "./brand-marks";

const ease = [0.22, 1, 0.36, 1] as const;
// the hero container's look (Hero.tsx)
const card =
  "flex min-h-[300px] flex-col justify-between rounded-[48px] max-md:rounded-[32px] border border-slate-200/50 bg-[#e3e5e8] p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] md:min-h-[340px] md:p-12";
const line =
  "mt-12 font-display text-[24px] md:text-[32px] font-medium leading-[1.25] tracking-tight text-[#0a1b33]";
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
        <motion.div {...rise(0)} className={card}>
          <ChatGptMark className="h-11 w-11 text-[#0a1b33]" />
          <p className={line}>
            ChatGPT reads the internet and now it understands facts and how
            humans think.
          </p>
        </motion.div>
        <motion.div {...rise(0.15)} className={card}>
          <SixLabsMark className="h-11 w-11 text-accent" />
          <p className={line}>
            Our model watches millions of hours of gameplay and now it
            understands <span className="text-accent">the game player.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
