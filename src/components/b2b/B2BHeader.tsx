"use client";

// The B2B page's top bar: the full view's (website/Header.tsx: its links, language menu and phone menu), quieter,
// and with the page's rectangular buttons. Clear over the hero at the top; once the page scrolls, a strip of the
// page's colour with a faint hairline (no blur: it would hold Chrome on a Mac at 30 fps). A smaller lockup, the
// tabs in muted ink that darken on hover, and Sign in as a 6px outline rectangle like the primary call, not a
// pill. The full view's header is frozen, so this is a copy rather than a switch on it.
import { useEffect, useState } from "react";
import { LanguageMenu } from "@/components/website/LanguageMenu";
import { MobileMenu } from "@/components/website/MobileMenu";
import { linkTo, type Spot } from "@/components/website/jump";

const LINKS: { label: string; to: Spot }[] = [
  { label: "Product", to: "model-line" },
  { label: "The players", to: "players" },
  { label: "What it does", to: "jobs" },
  { label: "FAQs", to: "faq" },
];

export function B2BHeader() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      id="site-head"
      className={
        "fixed left-0 right-0 top-0 z-40 border-b px-6 py-4 transition-colors duration-300 max-md:px-4 max-md:py-3.5 " +
        (scrolled ? "border-slate-200/70 bg-[rgb(var(--page-rgb)/0.9)]" : "border-transparent bg-transparent")
      }
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between">
        <a {...linkTo("top")} className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- a fixed 26px mark, no optimisation needed */}
          <img src="/brand/sixlabs-mark.svg" alt="" width={26} height={26} className="h-[26px] w-[26px]" />
          <span className="font-display text-[20px] font-medium tracking-tight text-[#0a1b33]">
            <span className="text-accent">6</span>labs
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map(({ label, to }) => (
            <a
              key={label}
              {...linkTo(to)}
              className="text-[14px] font-normal tracking-[-0.01em] text-[var(--b2b-muted)] transition-colors duration-300 hover:text-[#0a1b33]"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 max-md:gap-1.5">
          <div className="opacity-80 max-md:hidden">
            <LanguageMenu />
          </div>
          <button
            data-cta
            className="b2b-btn h-[34px] border-slate-300/80 px-4 text-[13.5px] text-[#0a1b33] hover:border-[#0a1b33]/40 hover:bg-white/70 max-md:h-[32px] max-md:px-3 max-md:text-[13px]"
          >
            Sign in
          </button>
          <MobileMenu links={LINKS} />
        </div>
      </div>
    </nav>
  );
}
