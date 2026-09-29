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

      {/* While the floor loads, the logo turns slowly in the tile glass (a pre-rendered turntable,
          tools/tiles/turntable.py), then fades away as the tiles fade in. */}
      <AnimatePresence>
        {!floorReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4, ease } }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.6, ease } }}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- an animated WebP, served as is */}
            <img src="/brand/sixlabs-mark-spin.webp" alt="" width={120} height={120} className="w-[120px] h-[120px]" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start pointer-events-none">
        <motion.div
          // Fade only: the block is in its final place from the first frame (a slide-up read as a jerk).
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col items-start pointer-events-auto"
        >
          <h1 className="font-display text-[42px] md:text-[56px] font-medium tracking-tight leading-[1.05] text-[#0a1b33]">
            Foundation of the
            <br />
            new digital epoch
          </h1>
          <p className="font-sans text-[14px] md:text-[15px] text-[#64748b] mt-5 max-w-[440px] leading-relaxed">
            Designing products, powering ecosystems and laying the foundation of a decentralized web
            for enterprises, builders and communities alike.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="mt-8 bg-[#0a152d] text-white rounded-full px-6 py-3 text-[15px] font-medium"
          >
            Contact Us
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
