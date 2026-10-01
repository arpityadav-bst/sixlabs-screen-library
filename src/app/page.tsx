// SixLabs Screen Library: the handoff index, like BlueAI's. One row per page of the website, in its two
// hero layouts. Links are full-page <a> so each route loads fresh.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "6labs Screen Library",
  description: "The 6labs website.",
};

type Row = { href: string; name: string; desc: string };

const ROWS: Row[] = [
  {
    href: "/website",
    name: "6labs website",
    desc: "The landing page: the top header and the hero in its rounded container over the live glass tile floor. Every AI copy is a faceless blue scan-line hologram: on the hero's tiles, in the players' Human / AI switch and in the footer.",
  },
  {
    href: "/6labs-fullview",
    name: "6labs fullview",
    desc: "The same landing page with the glass tile floor filling the whole first screen, edge to edge: the header lies over it, and the numbers, the scroll cue and the wave button sit inside it along its foot.",
  },
];

export default function Index() {
  return (
    <main className="min-h-screen px-6 md:px-12 py-14 md:py-20">
      <div className="max-w-[880px] mx-auto">
        <p className="text-[12px] font-semibold tracking-[0.14em] uppercase text-slate-400">6labs</p>
        <h1 className="font-display text-[40px] font-medium tracking-tight text-[#0a1b33] mt-2">Screen Library</h1>
        <p className="text-[15px] text-slate-500 mt-3 max-w-[560px] leading-relaxed">
          Design-only handoff. The 6labs website, in its two hero layouts.
        </p>

        <section className="mt-12">
          <h2 className="text-[12px] font-semibold tracking-[0.14em] uppercase text-slate-400">Website</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {ROWS.map((row) => (
              <li key={row.href}>
                <a
                  href={row.href}
                  className="block rounded-2xl px-6 py-5 transition-all border bg-white border-slate-200/60 shadow-sm hover:border-slate-300"
                >
                  <span className="flex items-center gap-2 font-display text-[18px] font-medium text-[#0a1b33]">{row.name}</span>
                  <span className="block text-[14px] text-slate-500 mt-1.5 leading-relaxed">{row.desc}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
