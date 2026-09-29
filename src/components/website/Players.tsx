"use client";

// Third section, the players: straight on the page, no heading or panel. The selected player's title,
// description and trait bars sit straight on the blue on the left, in white; their portrait fills the rest, large, its
// chest fading out behind the four cards (it runs under them), over a soft blue glow. Four cards along the bottom pick the player (the first is selected).
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PLAYERS } from "./players-data";
import { PlayerPortrait } from "./PlayerPortrait";
import { PortraitSwap } from "./PortraitSwap";
import { ModeToggle } from "./ModeToggle";
import { usePlayerMode } from "./usePlayerMode";
import { PlayerDoodles } from "./PlayerDoodles";

const ease = [0.22, 1, 0.36, 1] as const;
// On the accent blue (AccentWave.tsx): white cards.
const card =
  "bg-white border-transparent shadow-[0_24px_48px_-28px_rgba(10,27,51,0.35)]";
// the unselected player cards are the same white, held back by opacity (a little more on hover)
const UNSELECTED = 0.6;
// The portrait's height (--ph): 720px, or less on a short screen so the whole section (header clearance,
// portrait, cards) fits one view. The cards cover its bottom PORTRAIT_UNDER of it, where its fade runs.
const PORTRAIT_UNDER = 0.244;
const fit = {
  "--ph": `min(720px, calc((100svh - 344px) / ${1 - PORTRAIT_UNDER}))`,
} as CSSProperties;

export function Players() {
  const [active, setActive] = useState(0);
  // The section is pulled up over the scroll line's last screen (-mt-[100vh]), so it sits in view the
  // moment the water has filled it, and is centred in that screen.
  // The section comes in once the accent water has filled the view (AccentWave.tsx) and the section is
  // actually in view, one part at a time: the four cards, then the character, then the detail card. It
  // leaves as the water drains.
  const section = useRef<HTMLElement>(null);
  const [filled, setFilled] = useState(false);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const on = (e: Event) =>
      setFilled((e as CustomEvent<{ filled: boolean }>).detail.filled);
    window.addEventListener("accentwave", on);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.2,
    });
    if (section.current) io.observe(section.current);
    return () => {
      window.removeEventListener("accentwave", on);
      io.disconnect();
    };
  }, []);
  const shown = filled && inView;
  // `to` is the opacity it settles at: the unselected player cards rest at UNSELECTED
  const enter = (delay: number, to = 1) => ({
    initial: { opacity: 0, y: 24 },
    animate: shown ? { opacity: to, y: 0 } : { opacity: 0, y: 24 },
    transition: shown ? { duration: 0.6, ease, delay } : { duration: 0.25 },
  });
  const player = PLAYERS[active];
  // the real player or their AI copy, per player, switching by itself until the visitor picks one
  const [mode, setMode] = usePlayerMode(player.id, shown && !!player.aiVideo);

  return (
    <section
      ref={section}
      id="players"
      style={fit}
      className={
        "relative z-30 w-full max-w-[1400px] mx-auto -mt-[100vh] flex min-h-screen flex-col justify-center pt-24 pb-10 " +
        (shown ? "" : "pointer-events-none") // hidden, it must not block the floating tiles under it
      }
    >
      <div className="relative px-8 md:px-16">
        {/* soft glow behind the character */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[8%] top-[6%] h-[520px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(26,109,255,0.28),rgba(26,109,255,0.08)_55%,transparent)]"
        />

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,520px)_1fr]">
          <motion.div {...enter(0.75)} className="self-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease }}
              >
                <h3 className="font-display text-[42px] md:text-[56px] font-medium leading-[1.05] tracking-tight text-white">
                  {player.title}
                </h3>
                <p className="mt-5 max-w-[520px] font-sans text-[16px] md:text-[18px] leading-relaxed text-white/80">
                  {player.body}
                </p>
              </motion.div>
            </AnimatePresence>
            <dl className="mt-10 max-w-[440px] space-y-4">
              {player.traits.map((t) => (
                <div
                  key={t.label}
                  className="grid grid-cols-[130px_1fr] items-center gap-4"
                >
                  <dt className="font-sans text-[14px] text-white/75">
                    {t.label}
                  </dt>
                  <dd className="h-1.5 rounded-full bg-white/20">
                    <motion.div
                      className="h-full rounded-full bg-white"
                      initial={false}
                      animate={{ width: `${t.value * 100}%` }}
                      transition={{ duration: 0.7, ease }}
                    />
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-10">
              <ModeToggle mode={mode} onChange={setMode} />
            </div>
          </motion.div>

          <motion.div
            {...enter(0.45)}
            className="pointer-events-none relative mb-[calc(var(--ph)*-0.244)] flex items-end justify-center"
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                key={player.id}
                className="relative isolate" // its own layer, so the doodles sit behind the portrait but above the glow
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease }}
              >
                <PlayerDoodles id={player.id} start={shown} />
                {/* a player with a clip turns with the cursor (PlayerPortrait), switching to their AI copy's clip with the toggle (PortraitSwap); the others are stills */}
                {player.video && player.aiVideo ? (
                  <PortraitSwap
                    human={player.video}
                    ai={player.aiVideo}
                    mode={mode}
                    label={player.title}
                    className="h-[var(--ph)] w-auto max-w-none select-none"
                  />
                ) : player.video ? (
                  <PlayerPortrait
                    src={player.video.src}
                    straight={player.video.straight}
                    label={player.title}
                    className="h-[var(--ph)] w-auto max-w-none select-none"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- the player's portrait
                  <img
                    src={player.picture}
                    alt={player.title}
                    width={1200}
                    height={1583}
                    className="h-[var(--ph)] w-auto max-w-none select-none"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Selector cards, each read as a model on file: the player type and a one-line read of them on top,
            its number and a status along the bottom under a hairline. The selected one, the model running,
            is pure white; the others are the same white at lower opacity, all on the page's accent blue. */}
        <div className="relative z-10 mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {PLAYERS.map((p, k) => {
            const on = k === active;
            return (
              <motion.button
                key={p.id}
                {...enter(k * 0.08, on ? 1 : UNSELECTED)}
                whileHover={on ? undefined : { opacity: 0.85 }}
                type="button"
                onClick={() => setActive(k)}
                // the stroke light follows the pointer (.sheen in globals.css)
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty(
                    "--gx",
                    `${e.clientX - r.left}px`,
                  );
                  e.currentTarget.style.setProperty(
                    "--gy",
                    `${e.clientY - r.top}px`,
                  );
                }}
                aria-pressed={on}
                className={
                  "sheen relative flex min-h-[176px] flex-col justify-between rounded-[28px] border p-6 text-left transition-[background-color,box-shadow,translate] duration-300 " +
                  (on
                    ? "bg-white border-transparent shadow-[0_28px_56px_-26px_rgba(10,27,51,0.45)]"
                    : card +
                      " hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(10,27,51,0.05),0_24px_48px_-24px_rgba(10,27,51,0.22)]")
                }
              >
                <span>
                  <span
                    className={
                      "block font-display text-[22px] font-medium leading-tight tracking-tight " +
                      "text-[#0a1b33]"
                    }
                  >
                    {p.title}
                  </span>
                  <span
                    className={
                      "mt-2 block font-sans text-[14px] leading-snug " +
                      "text-[#64748b]"
                    }
                  >
                    {p.tagline}
                  </span>
                </span>
                <span
                  className={
                    "mt-6 flex items-center justify-between border-t pt-4 font-mono text-[11px] uppercase tracking-[0.14em] " +
                    "border-slate-200/70 text-slate-400"
                  }
                >
                  Model {String(k + 1).padStart(2, "0")}
                  <span
                    className={
                      "flex items-center gap-1.5 " + (on ? "text-accent" : "")
                    }
                  >
                    <span
                      className={
                        "h-1.5 w-1.5 rounded-full " +
                        (on ? "bg-accent animate-pulse" : "bg-slate-300")
                      }
                    />
                    {on ? "Running" : "Ready"}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
