// Top header: layout and styling from the Halo prompt's navbar, recoloured to this site's light palette;
// content from the 6labs.ai header. Sticky: fixed to the top, on a frosted strip of the page colour so
// the sections read through it as they scroll under.
// Content from the 6labs.ai header. The mark is the SixLabs logo rendered in the tile glass (tools/tiles).
import { LanguageMenu } from "./LanguageMenu";

const LINKS = [
  { label: "Product", href: "#" },
  { label: "The players", href: "#players" },
  { label: "What it does", href: "#" },
];

export function Header() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-5 bg-[#f9fafb]/75 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <a href="/website" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- a fixed 32px mark, no optimisation needed */}
          <img
            src="/brand/sixlabs-mark-3d.png"
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
          {LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-base font-medium text-slate-500 hover:text-[#0a1b33] transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <LanguageMenu />
          {/* Secondary: outlined, so Try now in the hero stays the one solid CTA on the page. */}
          <button className="border border-slate-300 text-[#0a1b33] text-[15px] px-6 py-3 rounded-full hover:bg-white/70 hover:border-[#b7c0cb] transition-colors duration-200">
            Sign in
          </button>
        </div>
      </div>
    </nav>
  );
}
