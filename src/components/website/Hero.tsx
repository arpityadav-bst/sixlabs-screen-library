"use client";

import { useRef, useState } from "react";
import { Waves } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { TileFloor, type FloorHandle } from "@/components/tiles/TileFloor";
import { ScrollCue } from "./ScrollCue";
import { PrimaryCta } from "./PrimaryCta";

const ease = [0.22, 1, 0.36, 1] as const;

// Digital copies start from the published figure and count up by one each time a character on the floor
// becomes their AI copy.
const COPIES_BASE = 10_956;

export function Hero() {
  const [floorReady, setFloorReady] = useState(false);
  const floor = useRef<FloorHandle | null>(null);
  const [copies, setCopies] = useState(COPIES_BASE);
  const stats = [
    {
      value: "2B",
      label: ["Human players"],
      tone: "text-[#0a1b33]",
      live: false,
    },
    {
      value: copies.toLocaleString("en-US"),
      label: ["Digital copies made"],
      tone: "text-accent",
      live: true,
    },
  ];
  return (
    <>
      <section className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-[#e3e5e8] border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[664px] max-md:h-[720px] max-md:rounded-[32px] flex flex-col">
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
            onConvert={() => setCopies((c) => c + 1)}
          />
        </div>

        {/* Phones only: the copy covers most of the narrow container, so the floor's upper rows fade under a
          scrim of the container colour and the tiles show clear in the lower part. */}
        <div
          aria-hidden
          className="md:hidden pointer-events-none absolute inset-x-0 top-0 z-10 h-[66%] bg-gradient-to-b from-[#e3e5e8] from-60% to-transparent"
        />

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

        <div className="relative z-20 flex-1 px-6 md:px-16 pt-10 md:pt-16 flex flex-col items-start pointer-events-none">
          <motion.div
            // Fade only: the block is in its final place from the first frame (a slide-up read as a jerk).
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease }}
            className="flex-1 flex flex-col items-start pb-10 md:pb-12"
          >
            <h1 className="font-display text-[34px] md:text-[56px] font-medium tracking-tight leading-[1.05] text-[#0a1b33]">
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
              <PrimaryCta>Try now</PrimaryCta>
            </div>
            <p className="mt-8 font-sans text-[13px] leading-relaxed text-slate-400">
              One million players have a copy.
              <br />
              <span className="text-slate-600">Yours next.</span>
            </p>
          </motion.div>
        </div>
      </section>
      {/* Outside the container, one row: the scroll cue under its bottom-left corner, the headline numbers
          centred, the wave button under its bottom-right corner. */}
      <div className="w-full max-w-[1400px] mx-auto mt-10 max-md:mt-8 px-8 max-md:px-2 md:px-16 grid grid-cols-[1fr_auto_1fr] items-start max-md:relative max-md:flex max-md:justify-center">
        <div className="-ml-10 max-md:hidden flex">
          <ScrollCue />
        </div>
        {/* The humans in navy, their digital copies in the accent blue (the headline's "models" colour). */}
        <motion.dl
          // Comes in once the tiles are in: the floor is ready, the placeholder logo leaves (0.5s), then the
          // tiles fade in (0.9s).
          initial={{ opacity: 0, y: 6 }}
          animate={floorReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 0.6, ease, delay: floorReady ? 1.2 : 0 }}
          className="flex items-start gap-14 max-md:gap-8"
        >
          {stats.map((s) => (
            <div
              key={s.label[0]}
              className="flex flex-col items-center text-center"
            >
              <dt className="order-2 mt-2 font-sans text-[14px] md:text-[15px] leading-snug text-[#64748b] max-md:whitespace-nowrap">
                {s.label.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </dt>
              <dd
                className={
                  "order-1 font-display text-[30px] font-medium leading-none tracking-tight tabular-nums " +
                  s.tone
                }
              >
                {/* the live figure settles in from just above each time it counts up */}
                <motion.span
                  key={s.value}
                  className="inline-block"
                  initial={s.live ? { opacity: 0.35, y: -5 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease }}
                >
                  {s.value}
                </motion.span>
              </dd>
            </div>
          ))}
        </motion.dl>
        <div className="flex justify-end max-md:absolute max-md:right-2 max-md:top-1">
          {/* Sends the flip wave now: every tile back to default, activated or not. Just the icon; its label
            fades in to its left on hover. */}
          <button
            type="button"
            onClick={() => floor.current?.reset()}
            className="group -mr-10 max-md:mr-0 p-1 flex items-center gap-1.5 text-slate-400 hover:text-[#0a1b33] transition-colors duration-200"
          >
            <span className="text-[12px] leading-none opacity-0 translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
              Next wave
            </span>
            <Waves className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </>
  );
}
