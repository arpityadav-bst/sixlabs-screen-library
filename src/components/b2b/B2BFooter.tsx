"use client";

// The B2B page's footer: the full view's (website/Footer.tsx) without the copy line picture, the players
// walking in and coming out as their AI copies, which belongs to the consumer site. Everything else is its
// own: the logo and its line, the Explore links and Back to top under a hairline; the huge wordmark with the
// SixLabs mark cresting from behind it and its colour split (website/CopyLine.tsx's band, .foot-word in
// globals.css), with less clear air above it now that no picture stands there; then the tail. The full view's
// footer is frozen, so this is a copy rather than a switch on it.
import { ArrowUp } from "lucide-react";
import { jumpTo, linkTo, type Spot } from "@/components/website/jump";
import { Word } from "@/components/website/CopyLine";
import { SixLabsLogo } from "@/components/website/brand-marks";

const EXPLORE: { label: string; to?: Spot }[] = [
  { label: "Home", to: "top" },
  { label: "Product", to: "model-line" },
  { label: "The players", to: "players" },
  { label: "What it does", to: "jobs" },
  { label: "Case Studies" },
];

const INNER = "mx-auto w-full max-w-[1400px] px-4 md:px-16";
const LEGAL =
  "cursor-pointer underline decoration-slate-300 decoration-1 underline-offset-[3px] transition-colors duration-300 hover:text-accent hover:decoration-accent";
const COPY = "block whitespace-nowrap";
const AIR = "pt-[calc(56px+0.46em)] md:pt-[calc(88px+0.46em)]"; // the clear air and the crest, above the word

export function B2BFooter() {
  return (
    <footer className="relative -mx-4 border-t border-slate-200/80 bg-black/[0.04] font-sans text-[13px] tracking-[-0.01em] text-[#64748b] md:-mx-8">
      <div className={INNER + " grid grid-cols-2 items-start gap-10 pt-[60px] md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_auto]"}>
        <div className="max-md:col-span-2">
          <a {...linkTo("top")} className="inline-flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- a fixed 32px mark, no optimisation needed */}
            <img src="/brand/sixlabs-mark.svg" alt="" width={32} height={32} className="h-8 w-8" />
            <span className="font-display text-2xl font-medium tracking-tight text-[#0a1b33]">
              <Word />
              .ai
            </span>
          </a>
          <p className="mt-[22px] text-[14px] leading-[1.65] tracking-[-0.015em]">Behavioral models of game players.</p>
        </div>

        <nav aria-label="Explore" className="flex flex-col items-start gap-[13px]">
          <h3 className="mb-[3px] text-[13.5px] font-semibold tracking-[-0.02em] text-[#0a1b33]">Explore</h3>
          {EXPLORE.map(({ label, to }) => (
            <a key={label} {...(to ? linkTo(to) : {})} className="cursor-pointer transition-colors duration-300 hover:text-accent">
              {label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          data-cta
          onClick={() => jumpTo("top")}
          className="inline-flex items-center gap-[7px] justify-self-end whitespace-nowrap text-[13.5px] text-[#0a1b33] transition-colors duration-300 hover:text-accent max-md:justify-self-start"
        >
          Back to top <ArrowUp size={14} strokeWidth={2} aria-hidden />
        </button>
      </div>

      {/* the wordmark band: the word's colour split behind it, the mark cresting from behind, the word */}
      <div aria-hidden className="relative font-display text-[clamp(84px,19vw,300px)]">
        <div className={"pointer-events-none absolute inset-x-0 top-0 " + AIR}>
          <span className="block h-[1.04em] overflow-hidden text-center">
            <span className="foot-word font-semibold tracking-[-0.055em]">
              <span className={COPY + " invisible"}>
                <Word plain />
              </span>
              <span className={COPY + " fw-l"}>
                <Word plain />
              </span>
              <span className={COPY + " fw-r"}>
                <Word plain />
              </span>
            </span>
          </span>
        </div>
        <span className="absolute left-1/2 top-[calc(56px+0.03em)] h-[0.95em] w-[0.95em] -translate-x-1/2 md:top-[calc(88px+0.03em)]">
          <SixLabsLogo className="block h-full w-full" fade />
        </span>
        <div className={"relative z-[1] " + AIR}>
          <span className="block h-[1.04em] overflow-hidden text-center">
            <span className="foot-word font-semibold tracking-[-0.055em] text-[#0a1b33]">
              <span className={COPY}>
                <Word />
              </span>
            </span>
          </span>
        </div>
      </div>

      <div className="border-t border-[#0a1b33]/[0.08] bg-black/[0.04] pb-[env(safe-area-inset-bottom)]">
        <div className={INNER + " flex flex-wrap justify-between gap-4 py-[22px] max-md:justify-center max-md:text-center"}>
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
