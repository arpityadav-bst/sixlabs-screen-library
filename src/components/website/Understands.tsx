"use client";

// After the players, on the light page again (the accent water drains off it, AccentWave.tsx): one sentence
// that rewrites itself. First ChatGPT's version fills word by word as the page scrolls, like the scroll
// line's (ScrubLine.tsx); then the portrait swap's laser (PortraitSwap.tsx) scans up through it: a band of
// dotted, colour-split type, and a glowing line that lights only the letters it crosses (never the page
// around them), and behind it the sentence re-prints as ours. Only the three parts that differ change; "Now it understands" holds its place (the text is left
// aligned, so it never moves), and "the game player." lands in the accent. The whole of it runs on the
// scroll, both ways, while the stage stays pinned; reduced motion shows ours.
import { useEffect, useRef, useState } from "react";
import { sweepGeometry } from "./understands-sweep";

const OLD = [
  ["ChatGPT", "read", "the", "internet."],
  ["Now", "it", "understands", "facts", "and", "how", "humans", "think."],
];
const NEW = [
  ["Our", "model", "watched", "millions", "of", "hours", "of", "gameplay."],
  ["Now", "it", "understands", "the", "game", "player."],
];
const ACCENT_FROM = 3; // in NEW's second row, "the game player." is the accent
const OLD_WORDS = OLD[0].length + OLD[1].length;
// shares of the track: ChatGPT's line fills by FILL_END, the laser runs SWEEP_START to SWEEP_END
const FILL_END = 0.34;
const SWEEP_START = 0.42;
const SWEEP_END = 0.86;
const HIDDEN = "inset(100% 0 0 0)";
const type =
  "font-display text-[26px] md:text-[44px] font-medium leading-[1.3] tracking-tight";

export function Understands() {
  const track = useRef<HTMLElement>(null);
  const block = useRef<HTMLDivElement>(null);
  const olds = useRef<(HTMLParagraphElement | null)[]>([]);
  const news = useRef<(HTMLParagraphElement | null)[]>([]);
  const bands = useRef<(HTMLParagraphElement | null)[]>([]);
  const lasers = useRef<(HTMLParagraphElement | null)[]>([]);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let queued = false;
    const paint = () => {
      queued = false;
      const el = track.current,
        box = block.current;
      if (!el || !box) return;
      const scrollable = el.offsetHeight - window.innerHeight;
      const p = still
        ? 1
        : Math.min(
            1,
            Math.max(0, -el.getBoundingClientRect().top / scrollable),
          );
      setLit(Math.floor(Math.min(1, p / FILL_END) * OLD_WORDS));
      const s = Math.min(
        1,
        Math.max(0, (p - SWEEP_START) / (SWEEP_END - SWEEP_START)),
      );
      const g = sweepGeometry(box, s);
      [0, 1].forEach((r) => {
        const o = olds.current[r],
          n = news.current[r],
          b = bands.current[r],
          l = lasers.current[r];
        if (!o || !n || !b || !l) return;
        const sweeping = s > 0 && s < 1;
        // ChatGPT's above the laser's line, ours below it, the dotted band across it
        o.style.clipPath = s <= 0 ? "none" : s >= 1 ? HIDDEN : g.above(o);
        n.style.clipPath = s <= 0 ? HIDDEN : s >= 1 ? "none" : g.below(n);
        b.style.clipPath = sweeping ? g.band(b) : HIDDEN;
        // the laser: a thin bright stripe painted through the letters (the text is its only canvas)
        const y = g.y(l);
        l.style.backgroundImage = sweeping
          ? `linear-gradient(to bottom, transparent ${y - 5}px, #7fb2ff ${y - 2}px, #1a6dff ${y}px, #7fb2ff ${y + 2}px, transparent ${y + 5}px)`
          : "none";
      });
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

  let k = 0; // ChatGPT's words, counted across both rows, for the fill
  return (
    <section
      ref={track}
      id="understands"
      aria-label="Our model watched millions of hours of gameplay. Now it understands the game player."
      className="relative h-[330vh]"
    >
      <div className="sticky top-0 flex h-screen items-center justify-center px-6">
        <div
          ref={block}
          aria-hidden
          className={"relative w-full max-w-[980px] " + type}
        >
          {[0, 1].map((r) => (
            <div key={r} className="grid">
              <p
                ref={(e) => {
                  olds.current[r] = e;
                }}
                // ChatGPT's first row sits on the second, however many lines ours takes
                className={
                  "[grid-area:1/1] " + (r === 0 ? "self-end" : "self-start")
                }
              >
                {OLD[r].map((w) => {
                  const on = k++ < lit;
                  return (
                    <span
                      key={w + k}
                      className={
                        "transition-colors duration-200 " +
                        (on ? "text-[#0a1b33]" : "text-[#0a1b33]/15")
                      }
                    >
                      {w}{" "}
                    </span>
                  );
                })}
              </p>
              <p
                ref={(e) => {
                  news.current[r] = e;
                }}
                className="[grid-area:1/1] text-[#0a1b33]"
                style={{ clipPath: HIDDEN }}
              >
                <Words row={r} />
              </p>
              {/* the laser's band: ours again, in dots, its colour split sideways */}
              <p
                ref={(e) => {
                  bands.current[r] = e;
                }}
                className="understands-band [grid-area:1/1] text-[#0a1b33]"
                style={{ clipPath: HIDDEN }}
              >
                <Words row={r} />
              </p>
              {/* the laser's line, only where it crosses the letters */}
              <p
                ref={(e) => {
                  lasers.current[r] = e;
                }}
                className="understands-laser [grid-area:1/1]"
              >
                <Words row={r} plain />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// our version of a row, the accent on "the game player."
function Words({ row, plain }: { row: number; plain?: boolean }) {
  return (
    <>
      {NEW[row].map((w, i) => (
        <span
          key={w + i}
          className={
            !plain && row === 1 && i >= ACCENT_FROM ? "text-accent" : undefined
          }
        >
          {w}{" "}
        </span>
      ))}
    </>
  );
}
