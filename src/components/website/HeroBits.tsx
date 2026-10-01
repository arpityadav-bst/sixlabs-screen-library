"use client";

// Pieces of the hero (Hero.tsx): the container's loading logo, the headline numbers and the wave button.
import { Waves } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

export type Stat = {
  value: string;
  label: string[];
  tone: string;
  live: boolean;
};

// The headline numbers, centred under the container or (left, the full view) left under the copy: the
// humans in navy, their digital copies in the accent blue (the headline's "models" colour). Under the
// container they come in once the tiles are in; in the full view (left) they are part of the copy and show
// with it from the first paint (its fade, .hero-copy-in), the copies count rising only as the tiles run.
export function HeroNumbers({
  stats,
  ready,
  left,
}: {
  stats: Stat[];
  ready: boolean;
  left: boolean;
}) {
  return (
    <motion.dl
      // Comes in once the tiles are in: the floor is ready, the placeholder logo leaves (0.5s), then the
      // tiles fade in (0.9s).
      initial={left ? false : { opacity: 0, y: 6 }}
      animate={left || ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={{ duration: 0.6, ease, delay: ready ? 1.2 : 0 }}
      className={"flex items-start gap-14 max-md:gap-8"}
    >
      {stats.map((s) => (
        <div
          key={s.label[0]}
          className={
            "flex flex-col " +
            (left ? "items-start text-left" : "items-center text-center")
          }
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
            {/* the live figure brightens in place each time it counts up (no drop in: it never moves) */}
            <motion.span
              key={s.value}
              className="inline-block"
              initial={s.live ? { opacity: 0.4 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, ease }}
            >
              {s.value}
            </motion.span>
          </dd>
        </div>
      ))}
    </motion.dl>
  );
}

export function WaveButton({
  full,
  busy = false,
  onClick,
}: {
  full: boolean;
  busy?: boolean; // the next cast still loading: a spinner in the icon's place until the wave begins
  onClick: () => void;
}) {
  return (
    <>
      {/* Sends the flip wave now: every tile back to default, activated or not. Just the icon; its label
          fades in to its left on hover. */}
      <button
        type="button"
        onClick={onClick}
        aria-busy={busy}
        className={
          "group flex items-center transition-colors duration-200 hover:text-accent " +
          (full
            ? "h-10 rounded-full border border-slate-200/80 bg-white/90 px-3 text-[#0a1b33]/70"
            : "max-md:mr-0 p-1 gap-1.5 text-slate-400 -mr-10")
        }
      >
        {/* full: the button is a filled pill round the icon; its label widens in inside it on hover. No backdrop
            blur under it: any on screen makes Chrome on a Mac put every frame of the floor together itself, which
            held the whole page at 30 fps there (website/perf.ts, ?off=fx) */}
        <span
          className={
            "text-[12px] leading-none opacity-0 transition-all duration-200 group-hover:opacity-100 whitespace-nowrap " +
            (full
              ? "max-w-0 overflow-hidden group-hover:max-w-[80px] group-hover:mr-1.5"
              : "translate-x-1 group-hover:translate-x-0")
          }
        >
          Next wave
        </span>
        {busy ? (
          <span className="block h-4 w-4 animate-spin rounded-full border-[1.75px] border-current border-t-transparent" />
        ) : (
          <Waves className="w-4 h-4" strokeWidth={1.75} />
        )}
      </button>
    </>
  );
}

// While the floor loads, the logo lies on the floor in the tiles' white glass, toward the bottom right where
// the tiles will be, and turns very slowly about the floor's vertical axis; it fades away just before the
// tiles fade in. One still (27 KB, tools/tiles/floor_logo.py): the render at the tile camera angle,
// contrast-boosted and straightened, which a CSS tilt lays back on the floor (40 degrees up, a long lens)
// and the compositor spins (.floor-spin in globals.css), so it costs almost nothing to load and turns
// smoothly. Its square is feathered into the floor. Sized and placed so about a fifth of the mark runs past
// the container's bottom edge and a little (under a tenth) past its right (the mark spans two thirds of its
// square, and the tilt shortens it to about half its width in height), at 60% opacity. The container only:
// the full view has its own loader (HeroLoader.tsx).
export function FloorLogo({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4, ease } }}
          exit={{
            opacity: 0,
            scale: 0.96,
            transition: { duration: 0.45, ease },
          }}
          className="absolute top-[77%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-10 aspect-square w-[70%] pointer-events-none"
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
  );
}
