"use client";

// Section between the hero and "Real player. Their model.": one sentence, played out on scroll (after the
// BlueAI "own an AI" page's second section). The section is tall and its stage sticks to the viewport,
// so you scroll through the sentence while each word fills from faint to full ink. The fill completes at
// COMPLETE_AT of the track, so the finished line holds for a beat before the section leaves. The phrase
// in ACCENT fills to the accent blue. Reduced motion shows it filled.
import { useEffect, useRef, useState } from "react";
import { FloatingBadges } from "./FloatingBadges";

const LINE =
  "A model is built from what the person does, not what they say. Put a thousand models on a new build and you know how it will land before anyone plays it.";
const ACCENT = ["a", "thousand", "models"]; // "Put a thousand models": the words after "Put"
const COMPLETE_AT = 0.82;
// The track runs WAVE_VH longer than the words need: the stage stays pinned while the accent water
// (AccentWave.tsx) rises over it, and only then lets go.
export const WAVE_VH = 0.75;

const WORDS = LINE.split(" ");
const accentAt = WORDS.findIndex(
  (w, k) => w === "a" && WORDS[k + 1] === "thousand",
);

export function ScrubLine() {
  const track = useRef<HTMLElement>(null);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let queued = false;
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
      setLit(Math.floor(Math.min(1, p / COMPLETE_AT) * WORDS.length));
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
      className="relative h-[335vh]"
    >
      <div className="sticky top-0 flex h-screen items-center justify-center px-6">
        <FloatingBadges />
        <p
          aria-hidden
          className="relative max-w-[980px] text-center font-display text-[26px] md:text-[44px] font-medium leading-[1.3] tracking-tight"
        >
          {WORDS.map((w, k) => {
            const accent = k >= accentAt && k < accentAt + ACCENT.length;
            const on = k < lit;
            return (
              <span
                key={k}
                className={
                  "transition-colors duration-200 " +
                  (on
                    ? accent
                      ? "text-accent"
                      : "text-[#0a1b33]"
                    : "text-[#0a1b33]/15")
                }
              >
                {w}{" "}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
