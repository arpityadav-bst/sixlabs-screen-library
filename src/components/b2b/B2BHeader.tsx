// The B2B site's top bar: the 6labs lockup (the logo's own SVG and the wordmark, as the website's header
// draws them), the three sections in the middle, and the language and Sign in on the right. A hairline
// under it on the page's ground; no blur. Links do nothing yet: hero only.
import { ChevronDown, Globe } from "lucide-react";

const NAV = ["How it works", "Case study", "Beyond gaming"];

export function B2BHeader() {
  return (
    <header className="relative z-20 border-b border-slate-200/80 bg-[#f9fafb]">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 md:px-8">
        <a href="#" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- a fixed 28px mark, no optimisation needed */}
          <img src="/brand/sixlabs-mark.svg" alt="" width={28} height={28} className="h-7 w-7" />
          <span className="font-display text-[21px] font-medium tracking-tight text-[#0a1b33]">
            <span className="text-accent">6</span>labs<span className="text-slate-400">.ai</span>
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <a key={n} href="#" className="text-[14px] text-slate-600 transition-colors hover:text-[#0a1b33]">
              {n}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button type="button" className="hidden items-center gap-1.5 font-[family-name:var(--font-jbmono)] text-[12px] text-slate-600 sm:flex">
            <Globe size={15} strokeWidth={1.6} />
            EN
            <ChevronDown size={14} strokeWidth={1.6} />
          </button>
          <a
            href="#"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-[#0a1b33] transition-colors hover:border-slate-300"
          >
            Sign in
          </a>
        </div>
      </div>
    </header>
  );
}
