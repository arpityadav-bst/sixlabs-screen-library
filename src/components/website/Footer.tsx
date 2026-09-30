"use client";

// The footer, after the onBlue creators page's (blueai/public/experiments/onblue-vesper, .site-foot) in the
// page's own light look. Full width under a hairline: the logo and its line, the Explore links, and Back to
// top at the right; then the huge wordmark running into the tail's hairline (its lowest tenth cropped), the
// mark cresting from behind it and fading down, a faint colour split at the word's two ends only
// (.foot-word in globals.css); then the tail, the copyright and the legal links. The legal links are stubs.
import { ArrowUp } from "lucide-react";
import { jumpTo, linkTo, type Spot } from "./jump";
import { SixLabsSolid } from "./brand-marks";

// each glides to its section (jump.ts); Case Studies has no section yet, so it is a stub
const EXPLORE: { label: string; to?: Spot }[] = [
  { label: "Home", to: "top" },
  { label: "Product", to: "model-line" },
  { label: "The players", to: "players" },
  { label: "What it does", to: "jobs" },
  { label: "Case Studies" },
];

const INNER = "mx-auto w-full max-w-[1400px] px-4 md:px-16";
const LEGAL =
  "cursor-pointer underline decoration-slate-300 decoration-1 underline-offset-[3px] transition-colors duration-300 hover:text-[#0a1b33] hover:decoration-[#0a1b33]";
const COPY = "block whitespace-nowrap";

// the wordmark, its accent 6 as in the header's logo (the colour-split copies take theirs plain)
const Word = ({ plain }: { plain?: boolean }) => (
  <>
    <span className={plain ? "" : "text-accent"}>6</span>labs
  </>
);

export function Footer() {
  return (
    <footer className="relative -mx-4 border-t border-slate-200/80 font-sans text-[13px] tracking-[-0.01em] text-[#64748b] md:-mx-8">
      <div
        className={
          INNER +
          " grid grid-cols-2 items-start gap-10 pt-[60px] md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_auto]"
        }
      >
        <div className="max-md:col-span-2">
          <a {...linkTo("top")} className="inline-flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- a fixed 32px mark, no optimisation needed */}
            <img
              src="/brand/sixlabs-mark-3d.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="font-display text-2xl font-medium tracking-tight text-[#0a1b33]">
              <Word />
              .ai
            </span>
          </a>
          <p className="mt-[22px] text-[14px] leading-[1.65] tracking-[-0.015em]">
            Behavioral models of game players.
          </p>
        </div>

        <nav
          aria-label="Explore"
          className="flex flex-col items-start gap-[13px]"
        >
          <h3 className="mb-[3px] text-[13.5px] font-semibold tracking-[-0.02em] text-[#0a1b33]">
            Explore
          </h3>
          {EXPLORE.map(({ label, to }) => (
            <a
              key={label}
              {...(to ? linkTo(to) : {})}
              className="cursor-pointer transition-colors duration-300 hover:text-[#0a1b33]"
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => jumpTo("top")}
          className="inline-flex items-center gap-[7px] justify-self-end whitespace-nowrap text-[13.5px] text-[#0a1b33] transition-colors duration-300 hover:text-[#64748b] max-md:justify-self-start"
        >
          Back to top <ArrowUp size={14} strokeWidth={2} aria-hidden />
        </button>
      </div>

      {/* The wordmark. The mark crests 0.3em above the word, so the margin carries that plus the clear air. */}
      <div
        aria-hidden
        className="relative mt-[calc(52px+0.3em)] pt-[0.3em] font-display text-[clamp(84px,19vw,300px)] md:mt-[calc(100px+0.3em)]"
      >
        <span className="foot-sun absolute left-1/2 top-[-0.3em] z-0 h-[1.05em] w-[1.05em] -translate-x-1/2 text-accent drop-shadow-[0_0_0.3em_rgba(26,109,255,0.16)]">
          <SixLabsSolid className="block h-full w-full" />
        </span>
        <span className="relative z-[1] block h-[0.9em] overflow-hidden text-center">
          <span className="foot-word font-semibold tracking-[-0.055em] text-[#0a1b33]">
            <span className={COPY + " relative z-[1]"}>
              <Word />
            </span>
            <span className={COPY + " fw-l z-[2]"}>
              <Word plain />
            </span>
            <span className={COPY + " fw-r z-[2]"}>
              <Word plain />
            </span>
          </span>
        </span>
      </div>

      <div className="border-t border-slate-200/80 pb-[max(30px,env(safe-area-inset-bottom))]">
        <div
          className={
            INNER +
            " flex flex-wrap justify-between gap-4 pt-[22px] pb-2 max-md:justify-center max-md:text-center"
          }
        >
          <span>© 2026 6labs.ai · All rights reserved.</span>
          <span className="inline-flex flex-wrap items-baseline gap-[18px] max-md:justify-center">
            <a className={LEGAL}>Terms of Use</a>
            <a className={LEGAL}>Privacy Policy</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
