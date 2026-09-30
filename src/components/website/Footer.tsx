"use client";

// The footer, after the onBlue creators page's (blueai/public/experiments/onblue-vesper, .site-foot) in the
// page's own light look, a shade (4%) darker than the closing call above it, the noise still showing
// through. Full width under a hairline: the logo and its line, the Explore links, and Back to
// top at the right; then the copy line, the landscape with the huge wordmark in front of it (CopyLine.tsx);
// then the tail, the copyright and the legal links. The legal links are stubs.
import { ArrowUp } from "lucide-react";
import { jumpTo, linkTo, type Spot } from "./jump";
import { CopyLine, Word } from "./CopyLine";

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
  "cursor-pointer underline decoration-slate-300 decoration-1 underline-offset-[3px] transition-colors duration-300 hover:text-accent hover:decoration-accent";
export function Footer() {
  return (
    <footer className="relative -mx-4 border-t border-slate-200/80 bg-black/[0.04] font-sans text-[13px] tracking-[-0.01em] text-[#64748b] md:-mx-8">
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
              className="cursor-pointer transition-colors duration-300 hover:text-accent"
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => jumpTo("top")}
          className="inline-flex items-center gap-[7px] justify-self-end whitespace-nowrap text-[13.5px] text-[#0a1b33] transition-colors duration-300 hover:text-accent max-md:justify-self-start"
        >
          Back to top <ArrowUp size={14} strokeWidth={2} aria-hidden />
        </button>
      </div>

      <CopyLine />

      {/* the tail, a shade (4%) darker again than the rest of the footer */}
      <div className="border-t border-slate-200/80 bg-black/[0.04] pb-[env(safe-area-inset-bottom)]">
        <div
          className={
            INNER +
            " flex flex-wrap justify-between gap-4 py-[22px] max-md:justify-center max-md:text-center"
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
