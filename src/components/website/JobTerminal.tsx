"use client";

// A job's terminal window (Jobs.tsx): the agent doing the job, played step by step from its run
// (jobs-data.ts). The command types in after the prompt with a caret; each step then lands in turn (a
// progress bar filling, a line ticked off, a share growing to its bar) until the result, the status pill
// turns from running to done, it rests, and the run starts again. It plays only while in view, from the
// top each time it comes back; `lead` staggers the three so they never move in step. Light, in the page's
// own look (the onBlue creators page's terminals, redrawn). Reduced motion shows the finished run.
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { Step } from "./jobs-data";

const TYPE_MS = 34; // per typed character
const STEP_MS = { out: 420, kv: 420, check: 200, bar: 360 } as const;
const LOAD_MS = 1300;
const HOLD_MS = 5200; // the finished run rests this long before it plays again
const ease = [0.22, 1, 0.36, 1] as const;

export function JobTerminal({
  id,
  run,
  lead = 0,
}: {
  id: string;
  run: Step[];
  lead?: number; // ms before its first run
}) {
  const box = useRef<HTMLDivElement>(null);
  // steps fully shown, the one in progress (if any), and how much of a command is typed
  const [at, setAt] = useState({ n: 0, busy: false, typed: 0, done: false });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alive = false,
      first = true;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const play = async () => {
      while (alive) {
        setAt({ n: 0, busy: false, typed: 0, done: false });
        await wait(first ? 500 + lead : 700);
        first = false;
        for (let i = 0; i < run.length; i++) {
          if (!alive) return;
          const s = run[i];
          if (s.t === "cmd") {
            for (let c = 1; c <= s.text.length && alive; c++) {
              setAt({ n: i, busy: true, typed: c, done: false });
              await wait(TYPE_MS);
            }
            await wait(280);
          } else {
            setAt({ n: i, busy: true, typed: 0, done: false });
            await wait(s.t === "load" ? (s.ms ?? LOAD_MS) : STEP_MS[s.t]);
          }
          if (!alive) return;
          setAt({ n: i + 1, busy: false, typed: 0, done: false });
        }
        setAt({ n: run.length, busy: false, typed: 0, done: true });
        await wait(HOLD_MS);
      }
    };
    const io = new IntersectionObserver(
      ([e]) => {
        // reduced motion: the finished run, as it is
        if (still)
          return setAt({ n: run.length, busy: false, typed: 0, done: true });
        if (e.isIntersecting && !alive) {
          alive = true;
          play();
        } else if (!e.isIntersecting) alive = false;
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      alive = false;
      io.disconnect();
    };
  }, [run, lead]);

  return (
    <div
      ref={box}
      aria-hidden
      className="overflow-hidden rounded-[18px] border border-slate-200/80 bg-white shadow-[0_18px_40px_-30px_rgba(10,27,51,0.4)]"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <span className="flex items-center gap-3">
          <span className="flex gap-1.5">
            <i className="h-2 w-2 rounded-full bg-slate-300" />
            <i className="h-2 w-2 rounded-full bg-slate-300" />
            <i className="h-2 w-2 rounded-full bg-slate-300" />
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            6labs · {id}
          </span>
        </span>
        <span
          className={
            "flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] " +
            (at.done ? "text-slate-400" : "text-accent")
          }
        >
          <span
            className={
              "h-1.5 w-1.5 rounded-full " +
              (at.done ? "bg-slate-300" : "bg-accent animate-pulse")
            }
          />
          {at.done ? "done" : "running"}
        </span>
      </div>
      <div className="h-[276px] px-4 py-4 font-mono text-[12.5px] leading-[22px] max-md:h-[256px] max-md:text-[11.5px] max-md:leading-[20px]">
        {run.map((s, i) =>
          i < at.n || (i === at.n && at.busy) ? (
            <Line key={i} s={s} live={i === at.n && at.busy} typed={at.typed} />
          ) : null,
        )}
      </div>
    </div>
  );
}

function Line({ s, live, typed }: { s: Step; live: boolean; typed: number }) {
  const inn = {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.25, ease },
  };
  if (s.t === "cmd")
    return (
      <div className="text-[#0a1b33]">
        <span className="mr-2 text-accent">›</span>
        {live ? s.text.slice(0, typed) : s.text}
        {live && (
          <span className="ml-0.5 inline-block h-[14px] w-[7px] translate-y-[2px] animate-pulse bg-accent" />
        )}
      </div>
    );
  if (s.t === "load")
    return (
      <motion.div {...inn} className="flex items-center gap-3 text-slate-500">
        <span className="shrink-0">{s.text}</span>
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
          <motion.span
            className="block h-full rounded-full bg-accent"
            initial={{ width: live ? "0%" : "100%" }}
            animate={{ width: "100%" }}
            transition={{ duration: (s.ms ?? LOAD_MS) / 1000, ease: "linear" }}
          />
        </span>
        <span
          className={
            "w-9 shrink-0 text-right " +
            (live ? "text-slate-300" : "text-accent")
          }
        >
          {live ? "···" : "done"}
        </span>
      </motion.div>
    );
  if (s.t === "out")
    return (
      <motion.div
        {...inn}
        className={s.tone === "ink" ? "text-[#0a1b33]" : "text-slate-500"}
      >
        {s.text}
      </motion.div>
    );
  if (s.t === "kv")
    return (
      <motion.div {...inn} className="grid grid-cols-[72px_1fr] gap-2">
        <span className="text-slate-400">{s.k}</span>
        <span className={s.accent ? "text-accent" : "text-[#0a1b33]"}>
          {s.v}
        </span>
      </motion.div>
    );
  if (s.t === "check")
    return (
      <motion.div {...inn} className="text-[#0a1b33]">
        <span className="mr-2 text-accent">✓</span>
        {s.text}
      </motion.div>
    );
  return (
    <motion.div {...inn} className="pb-1">
      <div className="flex justify-between text-slate-600">
        <span>{s.text}</span>
        <span className={s.accent ? "text-accent" : "text-[#0a1b33]"}>
          {s.value}%
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className={
            "h-full origin-left rounded-full " +
            (s.accent ? "bg-accent" : "bg-slate-300")
          }
          style={{ width: `${(s.value / s.of) * 100}%` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease }}
        />
      </div>
    </motion.div>
  );
}
