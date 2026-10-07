"use client";

// The B2B hero, one screen, laid out as onBlue's dark hero: the idea drawn out at the top (twin-stage.ts: people
// become their twins through the model's line), the two numbers and the 6labs mark under it (Stats.tsx), and at
// the foot the title, the line, the call and the model's prompt (CtaBlock.tsx). On onBlue's
// cool field with fading grid lines and grain (b2b.css, GridLines.tsx). The twin count ticks in each place it
// shows, set straight in the page as each twin lands, not through React.
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createTwinStage } from "./twin-stage";
import { CtaBlock } from "./CtaBlock";
import { Stats } from "./Stats";
import { GridLines } from "./GridLines";
import { TypedWord } from "@/components/website/TypedWord";

const START = 999995; // twins made, as the page opens
const fmt = (n: number) => n.toLocaleString("en-IN");

export function B2BHero() {
  const canvas = useRef<HTMLCanvasElement>(null);
  // the title's accent words type once their line has risen (TypedWord holds until then)
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setTyping(true), 1300);
    return () => window.clearTimeout(id);
  }, []);
  // every place the twin count shows, set as each twin lands
  const setters = useRef(new Set<(s: string) => void>());
  const bind = useCallback((set: (s: string) => void) => {
    setters.current.add(set);
    return () => void setters.current.delete(set);
  }, []);


  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const stage = createTwinStage(c, START, (t) => {
      setters.current.forEach((set) => set(fmt(t.count)));
    });
    return () => stage?.destroy();
  }, []);


  return (
    <section className="relative flex h-svh min-h-[560px] flex-col overflow-hidden">
      {/* the ground: onBlue's cool field, grid lines fading out evenly, and grain */}
      <div aria-hidden className="b2b-field" />
      <GridLines />
      <div aria-hidden className="b2b-grain" />
      <div aria-hidden className="b2b-foot" />

      {/* one screen, always, laid out as onBlue's dark hero (onblue-dark-v1): the illustration fills the top, the
          copy and the call sit together at the foot; the copy keeps its size, the stage takes what is left */}
      <div className="relative flex min-h-0 flex-1 flex-col justify-center pt-[calc(73px+clamp(8px,2vh,24px))] md:pt-[calc(89px+clamp(8px,2.5vh,32px))]">
        <p className="sr-only">People on the left walk through the 6labs model and come out on the right as their digital twins.</p>
        <div data-grid-clear="96" className="relative min-h-[150px] flex-1 md:max-h-[340px]">
          <canvas ref={canvas} aria-hidden className="absolute inset-0 block h-full w-full" />
        </div>
        {/* under the stage: the numbers out at the edges, the 6labs mark at work between them, under the line */}
        <div className="b2b-in-soft mt-3" style={{ "--d": "0.9s" } as CSSProperties}>
          <Stats start={fmt(START)} bind={bind} />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1180px] shrink-0 px-5 pb-[clamp(20px,5vh,56px)] pt-[clamp(12px,3vh,36px)] text-center md:px-12">
        {/* in the full view's title face, at onBlue's dark hero's sizes (b2b.css): each line rising inside its own
            clipped line, the accent words typed in once their line is up */}
        <h1 data-grid-clear className="mx-auto w-fit font-display font-medium leading-[1.08] tracking-tight text-[#0a1b33] [font-size:var(--h1)]">
          <span className="b2b-line">
            <span className="b2b-in-mask" style={{ "--d": "1.05s" } as CSSProperties}>Modelling</span>
          </span>
          <span className="b2b-line">
            <span className="b2b-in-mask" style={{ "--d": "1.15s" } as CSSProperties}>
              <TypedWord word="human behaviour." className="text-accent" hold={!typing} />
            </span>
          </span>
        </h1>
        <p
          data-grid-clear
          className="b2b-in-soft mx-auto mt-[var(--lede-mt)] w-fit font-sans leading-[1.55] tracking-[-0.015em] text-[#475569] [font-size:var(--lede)] md:whitespace-nowrap"
          style={{ "--d": "1.4s", animationDuration: "1.25s" } as CSSProperties}
        >
          Built from millions of hours of gameplay. Learning how people decide.
        </p>
        <div className="mt-[var(--actions-mt)]">
          <CtaBlock start={fmt(START)} bind={bind} />
        </div>
      </div>
    </section>
  );
}
