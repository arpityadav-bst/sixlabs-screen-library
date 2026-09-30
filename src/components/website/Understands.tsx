"use client";

// After the players, on the light page again (the accent water drains off it, AccentWave.tsx): one sentence
// that rewrites itself. First ChatGPT's version fills word by word as the page scrolls, like the scroll
// line's (ScrubLine.tsx); then the portrait swap's laser (PortraitSwap.tsx) rises through it, a band of
// dotted, colour-split type with a glowing line along its middle, and behind it the sentence re-prints as
// ours. Only the three parts that differ change; "Now it understands" holds its place (the text is left
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
  const laser = useRef<SVGPathElement>(null);
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
          b = bands.current[r];
        if (!o || !n || !b) return;
        // ChatGPT's above the laser's line, ours below it, the dotted band across it
        o.style.clipPath = s <= 0 ? "none" : s >= 1 ? HIDDEN : g.above(o);
        n.style.clipPath = s <= 0 ? HIDDEN : s >= 1 ? "none" : g.below(n);
        b.style.clipPath = s <= 0 || s >= 1 ? HIDDEN : g.band(b);
      });
      if (laser.current) {
        laser.current.setAttribute("d", g.line);
        laser.current.style.opacity = s > 0 && s < 1 ? "1" : "0";
      }
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
            </div>
          ))}
          <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
            <path
              ref={laser}
              fill="none"
              stroke="#1a6dff"
              strokeWidth={2}
              strokeLinecap="round"
              className="understands-laser"
              style={{ opacity: 0 }}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

// our version of a row, the accent on "the game player."
function Words({ row }: { row: number }) {
  return (
    <>
      {NEW[row].map((w, i) => (
        <span
          key={w + i}
          className={row === 1 && i >= ACCENT_FROM ? "text-accent" : undefined}
        >
          {w}{" "}
        </span>
      ))}
    </>
  );
}
