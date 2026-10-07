"use client";

// The B2B hero: the claim, then the idea drawn out in the model's own language. On a dot-grid ground, the
// two numbers stand over their sides (the people, the twins made), the model's name over its line, and the
// stage below them (twin-stage.ts) turns people into twins. Under the line, the model's log writes a line
// for each twin made, and the twin count ticks up in all three places it shows. Updated straight in the page,
// not through React, as each twin lands.
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { createTwinStage, type Twin } from "./twin-stage";

const MONO = "font-[family-name:var(--font-jbmono)]";
const START = 999995; // twins made, as the page opens
const fmt = (n: number) => n.toLocaleString("en-IN");
const line = (t: Twin) => `› #${fmt(t.count)}  ← ${t.player}  · ${fmt(t.hours)} h · fit ${t.fit.toFixed(3)}`;
const FIRST: Twin[] = [
  { count: START - 2, player: "player_48213", hours: 3214, fit: 0.982 },
  { count: START - 1, player: "player_20577", hours: 1186, fit: 0.967 },
  { count: START, player: "player_71904", hours: 4502, fit: 0.991 },
];
const AGE = ["0.35", "0.6", "1"]; // the log's lines, oldest to newest

export function B2BHero() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const counts = useRef<(HTMLSpanElement | null)[]>([]);
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const stage = createTwinStage(c, START, (t) => {
      counts.current.forEach((el) => el && (el.textContent = fmt(t.count)));
      const box = log.current;
      if (!box) return;
      const row = document.createElement("div");
      row.className = "truncate";
      row.textContent = line(t);
      box.appendChild(row);
      while (box.children.length > AGE.length) box.firstElementChild!.remove();
      [...box.children].forEach((el, k) => ((el as HTMLElement).style.opacity = AGE[k]));
    });
    return () => stage?.destroy();
  }, []);

  const count = (k: number) => (
    <span
      ref={(el) => {
        counts.current[k] = el;
      }}
    >
      {fmt(START)}
    </span>
  );

  return (
    <section className="relative overflow-hidden">
      {/* the ground: a dot grid, and a soft accent light behind the claim */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(10,27,51,0.11)_1px,transparent_1.3px)] [background-size:18px_18px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] [background:radial-gradient(55%_75%_at_50%_0%,rgba(26,109,255,0.11),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1200px] px-5 pt-14 text-center md:px-8 md:pt-20">
        <p
          className={`${MONO} inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-slate-500`}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/50" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Behaviour model · live
        </p>
        <h1 className="mt-6 font-display text-[40px] font-medium leading-[1.05] tracking-tight text-[#0a1b33] md:text-[64px]">
          Modelling <span className="text-accent">human behaviour.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-[520px] text-[15px] leading-relaxed text-slate-500 md:text-[17px]">
          Built from millions of hours of gameplay. Learning how people decide.
        </p>
      </div>

      {/* the numbers over each side, the model's name over its line */}
      <div className="relative mx-auto mt-12 grid max-w-[1200px] grid-cols-[1fr_auto_1fr] items-end px-5 md:mt-16 md:px-8">
        <div>
          <p className="font-display text-[30px] font-medium leading-none tracking-tight text-[#0a1b33] md:text-[44px]">2B</p>
          <p className={`${MONO} mt-2 text-[10px] uppercase tracking-[0.12em] text-slate-500 md:text-[11px]`}>human players</p>
        </div>
        <p className={`${MONO} pb-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-accent md:text-[11px]`}>6labs model</p>
        <div className="text-right">
          <p className="font-display text-[30px] font-medium leading-none tracking-tight text-accent md:text-[44px]">{count(0)}</p>
          <p className={`${MONO} mt-2 text-[10px] uppercase tracking-[0.12em] text-slate-500 md:text-[11px]`}>twins made</p>
        </div>
      </div>

      <p className="sr-only">People on the left walk through the 6labs model and come out on the right as their digital twins.</p>
      <canvas ref={canvas} aria-hidden className="relative mt-4 block h-[230px] w-full md:h-[290px]" />

      {/* the model's log, fed from the line: one line per twin made */}
      <div className="relative mx-auto flex w-full max-w-[440px] flex-col items-center px-5">
        <span aria-hidden className="h-5 w-px bg-accent/60" />
        <div
          ref={log}
          className={`${MONO} w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-[11px] leading-[1.75] text-slate-600 shadow-[0_10px_30px_-18px_rgba(10,27,51,0.3)]`}
        >
          {FIRST.map((t, k) => (
            <div key={t.count} className="truncate" style={{ opacity: AGE[k] }}>
              {line(t)}
            </div>
          ))}
        </div>
      </div>

      <div className="relative px-5 pb-16 pt-10 text-center md:pb-20">
        <p className="text-[15px] text-slate-500">
          {count(1)} players have a twin. Yours next.
        </p>
        <a
          href="#"
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-[14px] font-semibold text-accent transition-colors hover:border-accent/40"
        >
          See how it works
          <ArrowRight size={16} strokeWidth={2} />
        </a>
      </div>
    </section>
  );
}
