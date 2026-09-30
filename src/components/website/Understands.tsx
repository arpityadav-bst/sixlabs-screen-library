"use client";

// After the players, on the light page again (the light rises back over the accent blue, AccentWave.tsx):
// two cards side by side, the same line twice. On the left, in white, ChatGPT's: read the internet, so it
// understands facts and how humans think. On the right, in the accent blue, ours: watched the gameplay, so
// it understands the game player. Each carries its maker's mark at the top, both in the same line style
// (brand-marks.tsx). They rise in one after the other when the section comes into view, once.
import { motion } from "motion/react";
import { ChatGptMark, SixLabsMark } from "./brand-marks";

const ease = [0.22, 1, 0.36, 1] as const;
const card =
  "flex min-h-[300px] flex-col justify-between rounded-[28px] p-8 md:min-h-[340px] md:p-12";
const line =
  "mt-12 font-display text-[24px] md:text-[32px] font-medium leading-[1.25] tracking-tight";
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
      className="relative mx-auto flex min-h-screen w-full max-w-[1400px] items-center px-4 py-24 md:px-16"
    >
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div
          {...rise(0)}
          className={
            card + " bg-white shadow-[0_24px_48px_-28px_rgba(10,27,51,0.35)]"
          }
        >
          <ChatGptMark className="h-11 w-11 text-[#0a1b33]" />
          <p className={line + " text-[#64748b]"}>
            <span className="text-[#0a1b33]">ChatGPT read the internet.</span>{" "}
            Now it understands facts and how humans think.
          </p>
        </motion.div>
        <motion.div
          {...rise(0.15)}
          className={
            card + " bg-accent shadow-[0_28px_56px_-26px_rgba(26,109,255,0.6)]"
          }
        >
          <SixLabsMark className="h-11 w-11 text-white" />
          <p className={line + " text-white/75"}>
            <span className="text-white">
              Our model watched millions of hours of gameplay.
            </span>{" "}
            Now it understands{" "}
            <span className="text-white">the game player.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
