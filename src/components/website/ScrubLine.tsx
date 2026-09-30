"use client";

// Section between the hero and "Real player. Their model.": one sentence, played out on scroll (after the
// BlueAI "own an AI" page's second section). The section is tall and its stage sticks to the viewport,
// so you scroll through the sentence while each word fills from faint to full ink. The fill completes at
// COMPLETE_AT of the track, so the finished line holds for a beat before the section leaves. Going
// back up it empties faster (BACK), and once empty the page glides on up to the hero (TOP_S). The phrase
// in ACCENT fills to the accent blue. Reduced motion shows it filled. On desktops the words show through a
// liquid the cursor stirs (LiquidLine.tsx). Once the whole line is lit, its first GLITCH words ("People lie")
// glitch now and then: in the liquid's shader on desktops, elsewhere as .glitch-word (globals.css).
import { useEffect, useRef, useState } from "react";
import { FloatingBadges } from "./FloatingBadges";
import { easeOut, glideTo, gliding } from "./glide";
import { LiquidLine } from "./LiquidLine";

const LINE =
  "People lie in surveys. Their play never does. We model what they do, run a million of those models on your new build, and you see how it lands before a single player touches it.";
const ACCENT = ["a", "million", "of", "those", "models"]; // "run a million of those models": the words after "run"
const GLITCH = 2; // "People lie"
export const COMPLETE_AT = 0.82;
// Scrolling back up empties the line BACK times faster than scrolling down fills it; scrolling down
// again refills at that pace too, until it has caught up with where the scroll is.
const BACK = 3;
// Once scrolling up has emptied the line, the page glides the rest of the way up to the hero by itself
// (TOP_S), so no stretch of the track is scrolled through with nothing happening.
const TOP_S = 1.4;
// The track runs WAVE_VH longer than the words need: the stage stays pinned while the accent water
// (AccentWave.tsx) rises over it, and only then lets go.
export const WAVE_VH = 1.3;

const WORDS = LINE.split(" ");
const accentAt = WORDS.findIndex(
  (w, k) => w === "a" && WORDS[k + 1] === "million",
);
const ACCENTS = WORDS.map(
  (_, k) => k >= accentAt && k < accentAt + ACCENT.length,
);
const GLITCHES = WORDS.map((_, k) => k < GLITCH);

export function ScrubLine() {
  const track = useRef<HTMLElement>(null);
  // the stage carries the line's height (--line-h), so the badges can keep clear of it (FloatingBadges.tsx)
  const stage = useRef<HTMLDivElement>(null);
  const words = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const s = stage.current,
      w = words.current;
    if (!s || !w) return;
    const ro = new ResizeObserver(() =>
      s.style.setProperty("--line-h", `${w.offsetHeight}px`),
    );
    ro.observe(w);
    return () => ro.disconnect();
  }, []);
  const [lit, setLit] = useState(0);
  const full = lit >= WORDS.length; // the whole line lit: the glitch's cue
  // desktops: the words show through the liquid (LiquidLine.tsx), their own ink made transparent under it
  const [liquid, setLiquid] = useState(false);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let queued = false,
      shown = -1, // words lit, fractional; -1 until the first paint
      lastT = 0,
      upArmed = false; // the glide up to the hero, armed once a word has been lit
    const paint = () => {
      queued = false;
      const el = track.current;
      if (!el) return;
      if (still) return setLit(WORDS.length);
      const scrollable = el.offsetHeight - window.innerHeight * (1 + WAVE_VH);
      const p =
        scrollable <= 0
          ? 1
          : Math.min(
              1,
              Math.max(0, -el.getBoundingClientRect().top / scrollable),
            );
      // where the scroll puts the fill, in words
      const t = Math.min(1, p / COMPLETE_AT) * WORDS.length;
      if (shown < 0) shown = t;
      else {
        const d = t - lastT;
        // up: empties BACK times as fast; down: refills as fast, never past where the scroll is
        shown = Math.max(0, Math.min(t, shown + d * BACK));
      }
      const up = t < lastT;
      lastT = t;
      if (shown >= 1) upArmed = true;
      if (up && upArmed && shown <= 0 && p > 0 && !gliding()) {
        upArmed = false;
        glideTo(0, TOP_S, easeOut);
      }
      setLit(Math.floor(shown));
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(paint);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={track}
      id="model-line"
      aria-label={LINE}
      className="relative h-[390vh]"
    >
      <div
        ref={stage}
        className="sticky top-0 flex h-screen items-center justify-center px-6"
      >
        <FloatingBadges />
        <p
          ref={words}
          aria-hidden
          className={
            "relative max-w-[980px] text-center font-display text-[26px] md:text-[44px] font-medium leading-[1.3] tracking-tight" +
            (liquid ? " [&>span]:text-transparent!" : "")
          }
        >
          {WORDS.map((w, k) => {
            const accent = ACCENTS[k];
            const on = k < lit;
            return (
              <span
                key={k}
                data-text={GLITCHES[k] ? w : undefined}
                className={
                  "transition-colors duration-200 " +
                  (on
                    ? accent
                      ? "text-accent"
                      : "text-[#0a1b33]"
                    : "text-[#0a1b33]/15") +
                  (GLITCHES[k] && full && !liquid ? " glitch-word" : "")
                }
              >
                {w}{" "}
              </span>
            );
          })}
          <LiquidLine
            para={words}
            lit={lit}
            accents={ACCENTS}
            glitches={GLITCHES}
            glitch={full}
            onLive={setLiquid}
          />
        </p>
      </div>
    </section>
  );
}
