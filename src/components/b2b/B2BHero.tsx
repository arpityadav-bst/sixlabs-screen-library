"use client";

// The B2B hero: the full view's title (website/Hero.tsx), then the idea drawn out in the model's own language,
// in the onBlue agentic system (b2b.css). On onBlue's ground (its cool field, glyph field and grain), the two numbers stand over their sides (the people, the twins made), the model's name over its line, and the
// stage below them (twin-stage.ts) turns people into twins, and the twin count ticks up in both places it
// shows. Updated straight in the page, not through React, as each twin lands.
import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import { mountAsciiField } from "@/components/website/ascii-field";
import { createTwinStage } from "./twin-stage";
import { CtaBlock } from "./CtaBlock";
import { Stats } from "./Stats";
import { TypedWord } from "@/components/website/TypedWord";
import { HERO_LOADED } from "@/components/website/hero-intro";

// the full view's title and line sizes (website/Hero.tsx, FULL_TITLE and FULL_LEDE), on its width and height steps
const FULL_TITLE =
  "text-[34px] min-[561px]:text-[36px] min-[901px]:text-[42px] min-[1280px]:text-[54px] min-[1600px]:text-[64px] min-[1920px]:text-[76px] min-[2560px]:text-[88px] [@media(min-width:1280px)_and_(max-height:720px)]:text-[48px]!";
const FULL_LEDE =
  "text-[16px] min-[561px]:text-[16.5px] min-[901px]:text-[15px] min-[1280px]:text-[16px] min-[1600px]:text-[18px] min-[1920px]:text-[20px] min-[2560px]:text-[22px] leading-[1.55] tracking-[-0.015em] mt-[18px] min-[901px]:mt-[14px] min-[1600px]:mt-[22px] max-w-[470px] min-[901px]:max-w-[440px] min-[1600px]:max-w-[540px] min-[1920px]:max-w-[620px] min-[2560px]:max-w-[680px]";
const START = 999995; // twins made, as the page opens
const fmt = (n: number) => n.toLocaleString("en-IN");

export function B2BHero() {
  const canvas = useRef<HTMLCanvasElement>(null);
  // every place the twin count shows, set as each twin lands
  const setters = useRef(new Set<(s: string) => void>());
  const bind = useCallback((set: (s: string) => void) => {
    setters.current.add(set);
    return () => void setters.current.delete(set);
  }, []);
  const glyphs = useRef<HTMLDivElement>(null);

  // onBlue's ambient glyph field behind the hero, as it lies behind the creators page's third section
  // (#agents): sparse glyphs breathing at rest, with no pool following the pointer
  useEffect(() => {
    // the full view's header (website/Header.tsx, clear) waits for its hero's loader to end: there is none here
    window.dispatchEvent(new Event(HERO_LOADED));
    const host = glyphs.current;
    if (!host || host.firstChild) return;
    mountAsciiField({ host, pointer: false });
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
      {/* the ground: onBlue's cool field, its ambient glyph field (no pointer pool) and grain */}
      <div aria-hidden className="b2b-field" />
      <div ref={glyphs} aria-hidden className="b2b-ascii pointer-events-none absolute inset-0" />
      <div aria-hidden className="b2b-grain" />

      {/* one screen, always: the copy and the call keep their size, the stage takes what is left */}
      <div className="relative mx-auto w-full max-w-[1180px] shrink-0 px-5 pt-[calc(73px+clamp(16px,4vh,40px))] text-center md:px-12 md:pt-[calc(89px+clamp(20px,6vh,72px))]">
        {/* in the full view's title style (website/Hero.tsx), the accent words typed in */}
        <h1 className={`b2b-appear font-display font-medium leading-[1.05] tracking-tight text-[#0a1b33] ${FULL_TITLE}`}>
          Modelling
          <br />
          <TypedWord word="human behaviour." className="text-accent" />
        </h1>
        <p
          className={`b2b-appear mx-auto font-sans text-[#475569] ${FULL_LEDE} md:max-w-none md:whitespace-nowrap`}
          style={{ "--d": "0.3s" } as CSSProperties}
        >
          Built from millions of hours of gameplay. Learning how people decide.
        </p>
      </div>

      <div className="b2b-appear relative flex min-h-0 flex-1 flex-col justify-center" style={{ "--d": "0.8s" } as CSSProperties}>
        {/* the numbers out at the edges, the 6labs mark at work between them over the line */}
        <div className="mt-[clamp(16px,3vh,40px)]">
          <Stats start={fmt(START)} bind={bind} />
        </div>

        <p className="sr-only">People on the left walk through the 6labs model and come out on the right as their digital twins.</p>
        {/* the stage */}
        <div className="relative mt-3 min-h-[150px] flex-1 md:max-h-[320px]">
          <canvas ref={canvas} aria-hidden className="absolute inset-0 block h-full w-full" />
        </div>
      </div>

      <div className="b2b-appear relative shrink-0 px-5 pb-[clamp(20px,5vh,56px)] pt-[clamp(10px,2.5vh,28px)] text-center" style={{ "--d": "0.95s" } as CSSProperties}>
        <CtaBlock start={fmt(START)} bind={bind} />
      </div>
    </section>
  );
}
