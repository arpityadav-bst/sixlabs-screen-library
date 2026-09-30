"use client";

// A job's terminal window (Jobs.tsx): the agent doing the job, played step by step from its run
// (jobs-data.ts). It waits quietly, an empty prompt with a blinking cursor, until `play` (the visitor
// pointing at its card, or on a touch screen the terminal coming into view): then it runs the job once,
// start to finish, and stays filled. Only the one being looked at moves, so the section asks for no
// attention it has not been given. The command types in after the prompt with a caret; each step then lands
// in turn (a progress bar filling, a line ticked off, a share growing to its bar) until the result. A real
// terminal: a dark navy window, flat in its card (no shadow), its bar only the traffic-light dots, light
// type, the accent brightened (HI) so it reads on the dark (after the onBlue creators page's terminals).
// Set clean: JetBrains Mono; a command at the left after its prompt and everything it prints indented under
// it; one grid for all output (a glyph or label column, then the text); a blank line between a command's
// working and its result; commands white, working grey, results light, and the accent on the run's answer
// alone. While it waits, the window is not an empty dark box: the page's ASCII field (ascii-field.js) runs
// in it as it looks under the cursor, a bed of churning glyphs brightest at the middle and falling off to
// the edges, held there with no pointer, faint, over a glow of the accent rising from the window's foot;
// both fade out as the run begins, and the field then stops drawing. Where there is a mouse, a faint cursor
// breathes in the middle of the waiting window, a ring spreading from its tip (.term-hint, globals.css):
// the hint that pointing at the card runs it; it goes with the field. Reduced motion shows the finished
// run the moment it is asked for.
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { MousePointer2 } from "lucide-react";
import type { Step } from "./jobs-data";
import { mountAsciiField } from "./ascii-field";

const TYPE_MS = 34; // per typed character
const STEP_MS = { out: 420, kv: 420, check: 200, bar: 360 } as const;
const LOAD_MS = 1300;
const ease = [0.22, 1, 0.36, 1] as const;
// the accent, lifted for the dark window (the answer only)
const HI = "text-[#6ea8ff]";
const CURSOR =
  "inline-block h-[14px] w-[7px] translate-y-[2px] animate-pulse bg-slate-300";
// the idle field's glyphs: slate, warming to the lifted accent toward the pool's middle, half strength
const FIELD_TINT = {
  "--ascii-a": "148, 163, 184",
  "--ascii-b": "110, 168, 255",
  "--ascii": 0.5,
} as React.CSSProperties;

export function JobTerminal({ run, play }: { run: Step[]; play: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  // steps fully shown, the one in progress (if any), and how much of a command is typed; `started` once
  // the run has begun (before that: the empty prompt)
  const [at, setAt] = useState({ n: 0, busy: false, typed: 0 });
  const [started, setStarted] = useState(false);
  const began = useRef(false); // the run, once begun, is never begun again (nor stopped by its own start)
  // touch screens have no hover: there the terminal runs when it comes into view
  const [seen, setSeen] = useState(false);
  const field = useRef<HTMLDivElement>(null);

  // the idle field: mounted once; hidden once the run has faded it, which stops its drawing
  useEffect(() => {
    const host = field.current;
    if (!host || host.firstChild) return;
    // the pool, held a little below the middle and wide enough to reach the corners
    mountAsciiField({
      host,
      pointer: false,
      pool: { x: 0.5, y: 0.6 },
      reach: 420,
      lens: 0.5,
    });
  }, []);
  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => {
      if (field.current) field.current.style.display = "none";
    }, 800);
    return () => clearTimeout(t);
  }, [started]);

  useEffect(() => {
    const el = box.current;
    if (!el || window.matchMedia("(hover: hover)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = play || seen;
  useEffect(() => {
    if (!go || began.current) return;
    began.current = true;
    let alive = true;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    (async () => {
      setStarted(true);
      if (still) return setAt({ n: run.length, busy: false, typed: 0 });
      for (let i = 0; i < run.length; i++) {
        const s = run[i];
        if (s.t === "cmd") {
          for (let c = 1; c <= s.text.length; c++) {
            if (!alive) return;
            setAt({ n: i, busy: true, typed: c });
            await wait(TYPE_MS);
          }
          await wait(280);
        } else {
          if (!alive) return;
          setAt({ n: i, busy: true, typed: 0 });
          await wait(s.t === "load" ? (s.ms ?? LOAD_MS) : STEP_MS[s.t]);
        }
        if (!alive) return;
        setAt({ n: i + 1, busy: false, typed: 0 });
      }
    })();
    return () => {
      alive = false;
    };
  }, [go, run]);

  return (
    <div
      ref={box}
      aria-hidden
      className="overflow-hidden rounded-[16px] bg-[#0b1526]"
    >
      <div className="flex gap-1.5 border-b border-white/[0.06] bg-[#111d31] px-4 py-3">
        <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className="relative h-[300px] px-4 py-4 font-[family-name:var(--font-jbmono)] text-[12.5px] leading-[22px] text-slate-400 max-md:h-[292px] max-md:text-[11.5px] max-md:leading-[20px]">
        <div
          className={
            "pointer-events-none absolute inset-0 transition-opacity duration-700 " +
            (started ? "opacity-0" : "opacity-100")
          }
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_100%,rgba(110,168,255,0.11),transparent)]" />
          <div ref={field} style={FIELD_TINT} className="absolute inset-0" />
          <div className="absolute inset-0 hidden items-center justify-center [@media(hover:hover)_and_(pointer:fine)]:flex">
            <span className="term-hint relative block">
              <span className="term-hint-ring absolute left-[4px] top-[4px] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-white/70 bg-white/[0.06]" />
              <MousePointer2
                className="h-7 w-7 fill-white/45 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
                strokeWidth={1.5}
              />
            </span>
          </div>
        </div>
        <div className="relative">
          {!started ? (
            // waiting: an empty prompt, the cursor blinking
            <div className="text-white">
              <span className="mr-[1ch] text-slate-500">$</span>
              <span className={CURSOR} />
            </div>
          ) : (
            run.map((s, i) =>
              i < at.n || (i === at.n && at.busy) ? (
                <Line
                  key={i}
                  s={s}
                  live={i === at.n && at.busy}
                  typed={at.typed}
                />
              ) : null,
            )
          )}
        </div>
      </div>
    </div>
  );
}

// the output's indent under its command, and the label column of the result lines
const OUT = "pl-[2ch]";
const KEY = "grid grid-cols-[9ch_1fr]";

function Line({ s, live, typed }: { s: Step; live: boolean; typed: number }) {
  const inn = {
    initial: { opacity: 0, y: 3 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.25, ease },
  };
  const gap = s.gap ? "mt-[11px]" : "";
  if (s.t === "cmd")
    return (
      <div className={"text-white " + gap}>
        <span className="mr-[1ch] text-slate-500">$</span>
        {live ? s.text.slice(0, typed) : s.text}
        {live && <span className={"ml-px " + CURSOR} />}
      </div>
    );
  if (s.t === "load")
    return (
      <motion.div
        {...inn}
        className={OUT + " flex items-center gap-[1ch] " + gap}
      >
        {/* a small spinner while it works, a tick once it is done */}
        <span className="grid w-[1ch] shrink-0 place-items-center text-slate-500">
          {live ? (
            <span className="block h-2 w-2 animate-spin rounded-full border border-slate-500 border-t-transparent" />
          ) : (
            "✓"
          )}
        </span>
        <span className="shrink-0">{s.text}</span>
        <span className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/[0.08]">
          <motion.span
            className="block h-full rounded-full bg-white/40"
            initial={{ width: live ? "0%" : "100%" }}
            animate={{ width: "100%" }}
            transition={{ duration: (s.ms ?? LOAD_MS) / 1000, ease: "linear" }}
          />
        </span>
      </motion.div>
    );
  if (s.t === "out")
    return (
      <motion.div
        {...inn}
        className={
          OUT +
          " " +
          gap +
          " " +
          (s.tone === "ink" ? "text-slate-200" : "text-slate-400")
        }
      >
        {s.text}
      </motion.div>
    );
  if (s.t === "kv")
    return (
      <motion.div {...inn} className={OUT + " " + KEY + " " + gap}>
        <span className="text-slate-500">{s.k}</span>
        <span className={s.accent ? HI : "text-slate-200"}>{s.v}</span>
      </motion.div>
    );
  if (s.t === "check")
    return (
      <motion.div
        {...inn}
        className={OUT + " flex gap-[1ch] text-slate-200 " + gap}
      >
        <span className="w-[1ch] shrink-0 text-center text-slate-500">✓</span>
        {s.text}
      </motion.div>
    );
  return (
    <motion.div {...inn} className={OUT + " pb-1 " + gap}>
      <div className="flex justify-between">
        <span className="text-slate-300">{s.text}</span>
        <span className="w-[4ch] text-right tabular-nums text-slate-200">
          {s.value}%
        </span>
      </div>
      <div className="mt-0.5 h-[2px] overflow-hidden rounded-full bg-white/[0.08]">
        <motion.div
          className="h-full origin-left rounded-full bg-white/40"
          style={{ width: `${(s.value / s.of) * 100}%` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease }}
        />
      </div>
    </motion.div>
  );
}
