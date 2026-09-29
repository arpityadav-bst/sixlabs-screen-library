"use client";

// Second section, "Real player. Their model.": a soft panel like the hero's. The selected player's title,
// description and trait bars sit in a frosted glass card on the left; their character fills the rest,
// over a soft blue glow. Four glass cards along the bottom pick the player (the first is selected).
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PLAYERS, PLAYERS_SUBTITLE } from "./players-data";

const ease = [0.22, 1, 0.36, 1] as const;
const glass =
  "bg-white/55 backdrop-blur-xl border border-white/70 shadow-[0_20px_60px_-24px_rgba(10,27,51,0.22)]";

export function Players() {
  const [active, setActive] = useState(0);
  const player = PLAYERS[active];

  return (
    <section id="players" className="w-full max-w-[1400px] mx-auto mt-8">
      <div className="px-8 md:px-16">
        <h2 className="font-display text-[40px] md:text-[52px] font-medium tracking-tight leading-[1.05] text-[#0a1b33]">
          Real player. <span className="text-accent">Their model.</span>
        </h2>
        <p className="mt-5 max-w-[640px] font-sans text-[15px] md:text-[17px] leading-relaxed text-[#64748b]">
          {PLAYERS_SUBTITLE}
        </p>
      </div>

      <div className="relative mt-12 overflow-hidden rounded-[48px] bg-[#e3e5e8] border border-slate-200/50 p-6 md:p-10">
        {/* soft glow behind the character, so the glass has colour to frost */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[8%] top-[6%] h-[520px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(26,109,255,0.28),rgba(26,109,255,0.08)_55%,transparent)]"
        />

        <div className="relative grid min-h-[480px] grid-cols-1 gap-8 md:grid-cols-[minmax(0,440px)_1fr]">
          <div className={"self-center rounded-[32px] p-8 md:p-10 " + glass}>
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

        <div className="relative mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {PLAYERS.map((p, k) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActive(k)}
              aria-pressed={k === active}
              className={
                "flex items-center gap-3 rounded-[24px] p-3 pr-5 text-left transition-all duration-300 " +
                glass +
                (k === active
                  ? " bg-white/85 ring-2 ring-accent/70"
                  : " hover:bg-white/70")
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- small avatar from the character art */}
              <img
                src={p.picture}
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 rounded-2xl bg-slate-100 object-cover object-top"
              />
              <span className="font-display text-[16px] font-medium tracking-tight text-[#0a1b33]">
                {p.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
