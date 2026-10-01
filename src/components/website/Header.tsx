// Top header: layout and styling from the Halo prompt's navbar, recoloured to this site's light palette;
// content from the 6labs.ai header. Sticky: fixed to the top, on a strip of the page colour at 92%, so the
// sections show faintly through it as they scroll under, with a faint bottom stroke once the page has
// scrolled. Not frosted (backdrop blur): any on screen makes Chrome on a Mac put every frame together itself,
// which held the whole page at 30 fps there (website/perf.ts, ?off=fx). The mark is the SixLabs logo's own SVG (public/brand/sixlabs-mark.svg).
"use client";

import { useEffect, useState } from "react";
import { LanguageMenu } from "./LanguageMenu";
import { MobileMenu } from "./MobileMenu";
import { HERO_LOADED } from "./hero-intro";
import { linkTo, type Spot } from "./jump";

// each tab glides to its section (jump.ts), in the page's order
const LINKS: { label: string; to: Spot }[] = [
  { label: "Product", to: "model-line" },
  { label: "The players", to: "players" },
  { label: "What it does", to: "jobs" },
  { label: "FAQs", to: "faq" },
];

// `clear` (the 6labs-fullview page, where the tile floor runs under the bar): no ground at the top of the
// page, so the floor reads edge to edge; the usual bar once the page has scrolled. There
// it is also hidden while the hero's loader shows, from the first paint, and there at once, no fade, when
// loading is done (hero-intro.ts).
export function Header({ clear = false }: { clear?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [held, setHeld] = useState(clear);
  useEffect(() => {
    if (!clear) return;
    const on = () => setHeld(false);
    window.addEventListener(HERO_LOADED, on);
    return () => window.removeEventListener(HERO_LOADED, on);
  }, [clear]);
  // solid white once the accent water has filled the view (AccentWave.tsx), so it stands clear of the blue
  const [onBlue, setOnBlue] = useState(false);
  useEffect(() => {
    const on = (e: Event) =>
      setOnBlue((e as CustomEvent<{ filled: boolean }>).detail.filled);
    window.addEventListener("accentwave", on);
    return () => window.removeEventListener("accentwave", on);
  }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      id="site-head"
      className={
        "fixed top-0 left-0 right-0 z-40 px-6 py-5 max-md:px-4 max-md:py-4 border-b transition-colors duration-300 " +
        (held ? "invisible " : "") +
        (onBlue
          ? "bg-white "
          : clear && !scrolled
            ? "bg-transparent "
            : "bg-[rgb(var(--page-rgb)/0.92)] ") +
        (scrolled ? "border-slate-300/80" : "border-transparent")
      }
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <a {...linkTo("top")} className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- a fixed 32px mark, no optimisation needed */}
          <img
            src="/brand/sixlabs-mark.svg"
            alt=""
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="font-display text-2xl font-medium tracking-tight text-[#0a1b33]">
            <span className="text-accent">6</span>labs
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {/* Ink at the regular weight, as onBlue's tabs: a mid grey at medium weight reads soft, the
              anti-aliasing smearing its lighter edges, where dark type on the light bar stays crisp. The
              hover turns to the accent. */}
          {LINKS.map(({ label, to }) => (
            <a
              key={label}
              {...linkTo(to)}
              className="text-[15px] font-normal tracking-[-0.01em] text-[#0a1b33] hover:text-accent transition-colors duration-300"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 max-md:gap-1.5">
          {/* on a phone the language moves into the menu, which takes the tabs too (MobileMenu.tsx) */}
          <div className="max-md:hidden">
            <LanguageMenu />
          </div>
          {/* Secondary: outlined, so Try now in the hero stays the one solid CTA on the page; and medium
              (14px, about 38px tall; 13px and 32px on a phone), the large size being the hero's. */}
          <button
            data-cta
            className="border border-slate-300 text-[#0a1b33] text-[14px] px-5 py-2 max-md:px-3.5 max-md:py-1.5 max-md:text-[13px] rounded-full hover:bg-white/70 hover:border-[#b7c0cb] transition-colors duration-200"
          >
            Sign in
          </button>
          <MobileMenu links={LINKS} />
        </div>
      </div>
    </nav>
  );
}
