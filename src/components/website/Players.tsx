"use client";

// Third section, the players: straight on the page, no heading or panel. The selected player's title,
// description and trait bars sit in a card on the left; their character fills the rest,
// over a soft blue glow. Four cards along the bottom pick the player (the first is selected).
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PLAYERS } from "./players-data";

const ease = [0.22, 1, 0.36, 1] as const;
// On the accent blue (AccentWave.tsx): the cards are white less 4%, the selected one pure white.
const card =
  "bg-[#f5f5f6] border-transparent shadow-[0_24px_48px_-28px_rgba(10,27,51,0.35)]";

export function Players() {
  const [active, setActive] = useState(0);
  const player = PLAYERS[active];

  return (
    <section id="players" className="w-full max-w-[1400px] mx-auto mt-8">
      <div className="relative px-8 md:px-16">
        {/* soft glow behind the character */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[8%] top-[6%] h-[520px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(26,109,255,0.28),rgba(26,109,255,0.08)_55%,transparent)]"
        />

        <div className="relative grid min-h-[480px] grid-cols-1 gap-8 md:grid-cols-[minmax(0,440px)_1fr]">
          <div className={"self-center rounded-[32px] p-8 md:p-10 " + card}>
            <AnimatePresence mode="wait">
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease }}
              >
                <h3 className="font-display text-[28px] font-medium tracking-tight text-[#0a1b33]">
                  {player.title}
                </h3>
                <p className="mt-3 font-sans text-[15px] leading-relaxed text-[#64748b]">
                  {player.body}
                </p>
              </motion.div>
            </AnimatePresence>
            <dl className="mt-8 space-y-4">
              {player.traits.map((t) => (
                <div
                  key={t.label}
                  className="grid grid-cols-[130px_1fr] items-center gap-4"
                >
                  <dt className="font-sans text-[13px] text-[#64748b]">
                    {t.label}
                  </dt>
                  <dd className="h-1.5 rounded-full bg-slate-200/80">
                    <motion.div
                      className="h-full rounded-full bg-accent"
                      initial={false}
                      animate={{ width: `${t.value * 100}%` }}
                      transition={{ duration: 0.7, ease }}
                    />
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative flex items-end justify-center">
            <AnimatePresence mode="popLayout">
              {}
              <motion.img
                key={player.id}
                src={player.picture}
                alt={player.title}
                width={768}
                height={768}
                className="h-[480px] w-auto select-none"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease }}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Selector cards, each read as a model on file: the player type and a one-line read of them on top,
            its number and a status along the bottom under a hairline. The selected one, the model running,
            is pure white; the others are white less 4%, all on the page's accent blue. */}
        <div className="relative mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {PLAYERS.map((p, k) => {
            const on = k === active;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(k)}
                aria-pressed={on}
                className={
                  "flex min-h-[176px] flex-col justify-between rounded-[28px] border p-6 text-left transition-all duration-300 " +
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
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
