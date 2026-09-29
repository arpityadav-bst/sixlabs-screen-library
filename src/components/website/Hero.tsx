"use client";

import { useRef, useState } from "react";
import { Waves } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { TileFloor, type FloorHandle } from "@/components/tiles/TileFloor";

const ease = [0.22, 1, 0.36, 1] as const;

const STATS = [
  {
    value: "2B",
    label: ["human players", "the 6labs model"],
    tile: "bg-gradient-to-br from-white to-slate-200 border border-slate-300/80 shadow-[0_1px_2px_rgba(10,27,51,0.12)]",
  },
  {
    value: "1,009,271",
    label: ["digital copies made"],
    tile: "bg-gradient-to-br from-[#5b97ff] to-accent shadow-[0_0_0_3px_rgba(26,109,255,0.14),0_2px_6px_rgba(26,109,255,0.45)]",
  },
];

export function Hero() {
  const [floorReady, setFloorReady] = useState(false);
  const floor = useRef<FloorHandle | null>(null);
  return (
    <>
      <section className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-[#e3e5e8] border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[680px] flex flex-col">
        {/* The glass tile floor replaces the prompt's background video. It takes pointer events so the
          tiles stay interactive; the text layer above lets them through except on its own block. */}
        <div className="absolute inset-0 z-0 overflow-hidden select-none">
          {/* the logo placeholder fades out over 0.45s, then the tiles fade in */}
          <TileFloor
            className="w-full h-full"
            introDelay={0.5}
            onReady={(f) => {
              floor.current = f;
              setFloorReady(true);
            }}
          />
        </div>

        {/* While the floor loads, the logo lies on the floor in the tiles' white glass, toward the bottom right
          where the tiles will be, and turns very slowly about the floor's vertical axis; it fades away just before the
          tiles fade in. One still (27 KB, tools/tiles/floor_logo.py): the render at the tile camera angle,
          contrast-boosted and straightened, which a CSS tilt lays back on the floor (40 degrees up, a
          long lens) and the compositor spins (.floor-spin in globals.css), so it costs almost nothing to
          load and turns smoothly. Its square is feathered into the floor. Sized and placed so about a fifth of the
          mark runs past the container's bottom edge and a little (under a tenth) past its right (the mark spans two thirds of its square,
          and the tilt shortens it to about half its width in height), at 60% opacity. */}
        <AnimatePresence>
          {!floorReady && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.4, ease } }}
              exit={{
                opacity: 0,
                scale: 0.96,
                transition: { duration: 0.45, ease },
              }}
              className="absolute top-[77%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-10 w-[70%] aspect-square pointer-events-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- one small still, served as is */}
              <img
                src="/brand/sixlabs-mark-floor.webp"
                alt=""
                width={1200}
                height={1200}
                className="floor-spin w-full h-full opacity-60 [mask-image:radial-gradient(closest-side,#000_72%,transparent_98%)]"
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
              Making <span className="text-accent">models</span> of
              <br />
              human players.
            </h1>
            <p className="font-sans text-[14px] md:text-[15px] text-[#64748b] mt-5 max-w-[440px] leading-relaxed">
              Our model watched millions of hours of gameplay. Now it
              understands the game player.{" "}
              <a
                href="#"
                className="pointer-events-auto underline underline-offset-4 decoration-slate-300 hover:decoration-[#64748b] transition-colors duration-200"
              >
                See what it does
              </a>
            </p>
            {/* The primary CTA, wide; the secondary action is the link that ends the subtitle. The quiet line
              of social proof sits at the bottom of the container. Only the controls take the pointer, so
              the tiles under the rest of this column stay interactive. */}
            <div className="mt-8 pointer-events-auto">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="min-w-[220px] bg-[#0a152d] text-white rounded-full px-10 py-3.5 text-[15px] font-medium"
              >
                Try now
              </motion.button>
            </div>
            <p className="mt-auto font-sans text-[13px] leading-relaxed text-slate-400">
              One million players have a copy.
              <br />
              <span className="text-slate-600">Yours next.</span>
            </p>
          </motion.div>
        </div>
      </section>
      {/* Outside the container, in line with the text column: the headline numbers under its bottom-left
          corner, the wave button under its bottom-right. */}
      <div className="w-full max-w-[1400px] mx-auto mt-5 px-8 md:px-16 flex items-start justify-between">
        {/* Each stat carries a tiny floor tile, turned to the floor's diamond: a clear glass tile for the
            humans, the activated blue tile for their digital copies. */}
        <dl className="flex items-center">
          {STATS.map((s, k) => (
            <div key={s.value} className="flex items-center">
              {k > 0 && (
                <span aria-hidden className="mx-7 h-9 w-px bg-slate-200" />
              )}
              <span
                aria-hidden
                className={
                  "mr-3.5 h-3 w-3 shrink-0 rotate-45 rounded-[3px] " + s.tile
                }
              />
              <div className="flex flex-col">
                <dt className="order-2 mt-1.5 text-[12px] leading-[1.35] text-slate-500">
                  {s.label.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </dt>
                <dd className="order-1 font-display text-[26px] font-medium leading-none tracking-tight tabular-nums text-[#0a1b33]">
                  {s.value}
                </dd>
              </div>
            </div>
          ))}
        </dl>
        {/* Sends the flip wave now: every tile back to default, activated or not. Just the icon; its label
            fades in to its left on hover. */}
        <button
          type="button"
          onClick={() => floor.current?.reset()}
          className="group -mr-10 p-1 flex items-center gap-1.5 text-slate-400 hover:text-[#0a1b33] transition-colors duration-200"
        >
          <span className="text-[12px] leading-none opacity-0 translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
            Next wave
          </span>
          <Waves className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </div>
    </>
  );
}
