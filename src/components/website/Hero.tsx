"use client";

import { useEffect, useRef, useState } from "react";
import { TileFloor, type FloorHandle } from "@/components/tiles/TileFloor";
import { ScrollCue } from "./ScrollCue";
import { PrimaryCta } from "./PrimaryCta";
import { linkTo } from "./jump";
import { TypedWord } from "./TypedWord";
import { FloorLogo, HeroNumbers, WaveButton, type Stat } from "./HeroBits";
import { useArt } from "./art";
import { HeroLoader } from "./HeroLoader";
import { FULL_TILES_AT, useHeroIntro } from "./hero-intro";

// The full view's headline and its line, on the onBlue creators hero's scale (onblue-vesper/onblue.css,
// --h1 and --lede by width): the title 34 / 36 / 42 / 54 / 64 / 76 / 88px from phones to 2560px screens,
// the line 16 / 16.5 / 15 / 16 / 18 / 20 / 22px at a 1.55 leading, its measure widening with them. Only a
// screen under 720px tall caps the title at 48px, so the copy, numbers and scroll cue still fit it.
const FULL_TITLE =
  "text-[34px] min-[561px]:text-[36px] min-[901px]:text-[42px] min-[1280px]:text-[54px] min-[1600px]:text-[64px] min-[1920px]:text-[76px] min-[2560px]:text-[88px] [@media(min-width:1280px)_and_(max-height:720px)]:text-[48px]!";
const FULL_LEDE =
  "text-[16px] min-[561px]:text-[16.5px] min-[901px]:text-[15px] min-[1280px]:text-[16px] min-[1600px]:text-[18px] min-[1920px]:text-[20px] min-[2560px]:text-[22px] leading-[1.55] tracking-[-0.015em] mt-[18px] min-[901px]:mt-[14px] min-[1600px]:mt-[22px] max-w-[470px] min-[901px]:max-w-[440px] min-[1600px]:max-w-[540px] min-[1920px]:max-w-[620px] min-[2560px]:max-w-[680px]";

// Digital copies start from the published figure and count up by one each time a character on the floor
// becomes their AI copy.
const COPIES_BASE = 1_009_271;
// on a phone, the gap between the copy's last line and the highest tile, px
const CLEAR = -12; // below zero: the field top is measured a little past the screen edges, so the gap on screen is wider than this

// `full` (the 6labs-fullview page): the floor fills the whole first screen, edge to edge, instead of the
// rounded container; the header lies over it, and the numbers, the scroll cue and the wave button sit
// inside it: the numbers between the line and the call to action (in place of the social proof line),
// the scroll cue low at the left, the wave button, a filled pill, in the bottom right corner; the tiles
// smaller and more of them, the next wave's new faces in the middle and the first wave's round them; a faint hairline divides it from the page below.
export function Hero({ full = false }: { full?: boolean }) {
  const [floorReady, setFloorReady] = useState(false);
  const art = useArt(); // the hologram pages read the AI copies from /tiles-holo
  const intro = useHeroIntro(full, floorReady); // what has come in yet (hero-intro.ts)
  const fade = (on: boolean) =>
    "transition-opacity duration-700 ease-out " +
    (on ? "opacity-100" : "opacity-0");
  const floor = useRef<FloorHandle | null>(null);
  // Phones: the copy spans the screen, so rather than fade the tiles under it, the floor's view is lowered
  // until the field's highest tile (its diagonal edge rises to the top right) sits CLEAR px under the copy's
  // last line; the floor keeps its own shape and the empty ground above it. Kept current as sizes change.
  const box = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const clear = useRef(0);
  useEffect(() => {
    const s = box.current,
      k = copy.current;
    if (!s || !k) return;
    const phone = window.matchMedia("(max-width: 767px)");
    const set = () => {
      clear.current = phone.matches
        ? Math.round(
            k.getBoundingClientRect().bottom -
              s.getBoundingClientRect().top +
              CLEAR,
          )
        : 0;
      floor.current?.setClearTop(clear.current);
    };
    const ro = new ResizeObserver(set);
    ro.observe(k);
    ro.observe(s);
    return () => ro.disconnect();
  }, []);
  const [copies, setCopies] = useState(COPIES_BASE);
  const stats: Stat[] = [
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
  const numbers = (left: boolean) => (
    <HeroNumbers stats={stats} ready={floorReady} left={left} />
  );
  const wave = (
    <WaveButton full={full} onClick={() => floor.current?.reset()} />
  );
  const row = (
    <>
      {/* Outside the container, one row: the scroll cue under its bottom-left corner, the headline numbers
            centred, the wave button under its bottom-right corner. */}
      <div className="w-full max-w-[1400px] mx-auto mt-10 max-md:mt-8 px-8 max-md:px-2 md:px-16 grid grid-cols-[1fr_auto_1fr] items-start max-md:relative max-md:flex max-md:justify-center">
        <div className={"-ml-10 max-md:hidden flex " + fade(intro.extras)}>
          <ScrollCue />
        </div>
        {numbers(false)}
        <div
          inert={!intro.extras}
          className={
            "flex justify-end max-md:absolute max-md:right-2 max-md:top-1 " +
            fade(intro.extras)
          }
        >
          {wave}
        </div>
      </div>
    </>
  );
  return (
    <>
      <section
        ref={box}
        className={
          "relative bg-[#e3e5e8] overflow-hidden flex flex-col " +
          (full
            ? "-mx-4 md:-mx-8 -mt-24 h-svh min-h-[640px] border-b border-[#0a1b33]/[0.08]"
            : "w-full max-w-[1400px] mx-auto rounded-[48px] border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] h-[664px] max-md:h-[720px] max-md:rounded-[32px]")
        }
      >
        {/* The glass tile floor replaces the prompt's background video. It takes pointer events so the
          tiles stay interactive; the text layer above lets them through except on its own block. */}
        <div
          className={
            "absolute inset-0 z-0 overflow-hidden select-none " +
            (full ? fade(intro.floor) : "")
          }
        >
          {/* the logo placeholder fades out over 0.45s, then the tiles fade in */}
          <TileFloor
            className="w-full h-full"
            introDelay={full ? FULL_TILES_AT : 0.5}
            // full: the camera pulled back for smaller, more tiles (from 1024px wide: on a tablet or phone the faces would get
            // too small to read). Each wave has its own 37 faces, enough to fill the view with no repeats. Read once, as the
            // floor mounts.
            distScale={
              full &&
              typeof window !== "undefined" &&
              window.matchMedia("(min-width: 1024px)").matches
                ? 1.5
                : 1
            }
            aiBase={art === "hologram" ? "/tiles-holo" : undefined}
            // a used tile rests a little darker; on the hologram pages, a very light wash of the holograms' sky blue
            spentTint={art === "hologram" ? "#e3f3ff" : undefined}
            onReady={(f) => {
              floor.current = f;
              f.setClearTop(clear.current);
              setFloorReady(true);
            }}
            onConvert={() => setCopies((c) => c + 1)}
          />
        </div>

        <FloorLogo show={!full && !floorReady} />
        {/* the full view has its own loader: the mark's arcs taking turns (HeroLoader.tsx) */}
        {full && <HeroLoader show={intro.loading} />}

        <div
          // full: the copy, the scroll cue and the wave button on the header's own grid (its 1400px content
          // box inside a 24px edge, 16px on a phone), so their edges line up with the logo and the Sign in
          className={
            "relative z-20 flex-1 flex flex-col items-start pointer-events-none " +
            (full
              ? "mx-auto w-full max-w-[1448px] px-6 max-md:px-4 pt-[calc(73px+40px)] md:pt-[calc(89px+clamp(48px,9vh,120px))]"
              : "px-6 md:px-16 pt-10 md:pt-16")
          }
        >
          {/* Fade only, in CSS (.hero-copy-in), so it runs from first paint rather than once the scripts are
            up: the block is in its final place from the first frame (a slide-up read as a jerk). */}
          {/* the full view: the copy comes in after its loader (hero-intro.ts), the tiles after it */}
          <div
            inert={full && !intro.copy}
            className={
              "flex-1 flex flex-col items-start pb-10 md:pb-12 " +
              (full ? fade(intro.copy) : "hero-copy-in")
            }
          >
            <div ref={copy} className="relative flex flex-col items-start">
              <h1
                className={
                  "font-display font-medium tracking-tight leading-[1.05] text-[#0a1b33] " +
                  (full ? FULL_TITLE : "text-[34px] md:text-[56px]")
                }
              >
                Making{" "}
                <TypedWord
                  word="models"
                  className="text-accent"
                  hold={full && !intro.copy}
                />{" "}
                of
                <br />
                human players.
              </h1>
              <p
                className={
                  "font-sans text-[#475569] " +
                  (full
                    ? FULL_LEDE
                    : "text-[14px] md:text-[15px] mt-5 max-w-[440px] leading-relaxed")
                }
              >
                Our model watched millions of hours of gameplay. Now it
                understands the game player.{" "}
                <a
                  {...linkTo("jobs")}
                  className="pointer-events-auto underline underline-offset-4 decoration-slate-300 hover:text-accent hover:decoration-accent transition-colors duration-200"
                >
                  See what it does
                </a>
              </p>
              {/* full: the numbers come straight after the line, then the call to action, then the scroll cue;
              no line of social proof (the numbers carry it) */}
              {full && (
                <div className="mt-6 min-[1600px]:mt-7">{numbers(true)}</div>
              )}
              {/* The primary CTA, wide; the secondary action is the link that ends the subtitle. The quiet line
              of social proof sits at the bottom of the container. Only the controls take the pointer, so
              the tiles under the rest of this column stay interactive. */}
              <div
                className={
                  "pointer-events-auto " +
                  (full ? "mt-6 min-[1600px]:mt-7" : "mt-8 max-md:mt-6")
                }
              >
                <PrimaryCta>Try now</PrimaryCta>
              </div>
              {!full && (
                // The social proof as a live count: a softly pulsing accent dot, the line in the subtitle's
                // slate, and the invitation under it in the accent.
                <div className="mt-8 max-md:mt-6 grid grid-cols-[8px_1fr] items-center gap-x-2.5 font-sans text-[13px] leading-relaxed">
                  <span aria-hidden className="relative flex h-2 w-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-accent/40" />
                    <span className="relative h-2 w-2 rounded-full bg-accent" />
                  </span>
                  <p className="text-[#475569]">
                    One million players have a copy.
                  </p>
                  <p className="col-start-2 font-medium text-accent">
                    Yours next.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {full && (
          <>
            {/* the scroll cue low at the left, in line with the copy, well clear above where the tiles begin */}
            <div
              className={
                "pointer-events-none absolute inset-x-0 bottom-[clamp(96px,16vh,168px)] z-20 max-lg:hidden " +
                fade(intro.extras)
              }
            >
              {/* -ml-1 takes back the cue's own 4px padding, so its label starts on the copy's edge */}
              <div className="mx-auto flex w-full max-w-[1448px] px-6 [&>*]:-ml-1">
                <ScrollCue />
              </div>
            </div>
            {/* the wave button in the bottom right corner, as far from the right edge as from the bottom */}
            <div
              inert={!intro.extras}
              className={
                "absolute bottom-8 right-8 z-20 max-md:bottom-5 max-md:right-5 " +
                fade(intro.extras)
              }
            >
              {wave}
            </div>
          </>
        )}
      </section>
      {!full && row}
    </>
  );
}
