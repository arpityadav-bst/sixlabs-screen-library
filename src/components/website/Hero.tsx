"use client";

import { motion } from "motion/react";
import { TileFloor } from "@/components/tiles/TileFloor";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-[#e3e5e8] border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col">
      {/* The glass tile floor replaces the prompt's background video. It takes pointer events so the
          tiles stay interactive; the text layer above lets them through except on its own block. */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none">
        <TileFloor className="w-full h-full" />
      </div>

      <div className="relative z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
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
