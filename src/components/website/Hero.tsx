"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TileFloor } from "@/components/tiles/TileFloor";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const [floorReady, setFloorReady] = useState(false);
  return (
    <section className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-[#e3e5e8] border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col">
      {/* The glass tile floor replaces the prompt's background video. It takes pointer events so the
          tiles stay interactive; the text layer above lets them through except on its own block. */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none">
        <TileFloor className="w-full h-full" onReady={() => setFloorReady(true)} />
      </div>

      {/* While the floor loads, the logo turns slowly in the tiles' white glass on the right, where the
          tiles will be (a pre-rendered turntable on the floor, tools/tiles/turntable.py; its square frame
          is feathered into the container), then fades away as the tiles fade in. The mark spans about
          two thirds of the frame, so a 30%-wide frame makes it 40% of the right half. */}
      <AnimatePresence>
        {!floorReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4, ease } }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.6, ease } }}
            className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 z-10 w-[30%] max-h-full aspect-square pointer-events-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- an animated WebP, served as is */}
            <img
              src="/brand/sixlabs-mark-spin.webp"
              alt=""
              width={520}
              height={520}
              className="w-full h-full [mask-image:radial-gradient(closest-side,#000_72%,transparent_98%)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start pointer-events-none">
        <motion.div
          // Fade only: the block is in its final place from the first frame (a slide-up read as a jerk).
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease }}
          className="flex-1 flex flex-col items-start pb-10 md:pb-12"
        >
          <h1 className="font-display text-[42px] md:text-[56px] font-medium tracking-tight leading-[1.05] text-[#0a1b33]">
            Making models of
            <br />
            human players.
          </h1>
          <p className="font-sans text-[14px] md:text-[15px] text-[#64748b] mt-5 max-w-[440px] leading-relaxed">
            Our model watched millions of hours of gameplay. Now it understands the game player.
          </p>
          {/* The primary CTA, wide, with the secondary action as an underlined link centred under it. The
              quiet line of social proof sits at the bottom of the container. Only the controls take the
              pointer, so the tiles under the rest of this column stay interactive. */}
          <div className="mt-8 flex flex-col items-center pointer-events-auto">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="min-w-[220px] bg-[#0a152d] text-white rounded-full px-10 py-3.5 text-[15px] font-medium"
            >
              Try now
            </motion.button>
            <a
              href="#"
              className="mt-4 text-[14px] font-medium text-[#0a1b33] underline underline-offset-4 decoration-slate-300 hover:decoration-[#0a1b33] transition-colors duration-200"
            >
              See What It Does
            </a>
          </div>
          <p className="mt-auto font-sans text-[13px] leading-relaxed text-slate-400">
            One million players have a copy.
            <br />
            <span className="text-slate-600">Yours next.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
