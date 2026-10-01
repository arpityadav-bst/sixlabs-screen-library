// SixLabs Screen Library: the handoff index, like BlueAI's. One row per destination, in two kinds:
// a surface (a page of the product or website) and a design library (the system a surface is built
// from). Links are full-page <a> so each route loads fresh.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "6labs Screen Library",
  description: "The 6labs website and its design libraries.",
};

type Row = { href: string; name: string; desc: string; library?: boolean };

const GROUPS: { title: string; rows: Row[] }[] = [
  {
    title: "Website",
    rows: [
      {
        href: "/website",
        name: "6labs website",
        desc: "The landing page: the top header and the hero in its rounded container over the live glass tile floor.",
      },
      {
        href: "/6labs-fullview",
        name: "6labs fullview",
        desc: "The same landing page with the glass tile floor filling the whole first screen, edge to edge: the header lies over it, and the numbers, the scroll cue and the wave button sit inside it along its foot.",
      },
      {
        href: "/website-digital-ai",
        name: "6labs website, digital AI",
        desc: "The landing page with every AI copy as a faceless blue scan-line hologram: on the hero's tiles, in the players' Human / AI switch and in the footer. The humans are unchanged.",
      },
      {
        href: "/6labs-fullview-digital-ai",
        name: "6labs fullview, digital AI",
        desc: "The fullview landing page with the same hologram AI copies.",
      },
    ],
  },
  {
    title: "Design libraries",
    rows: [
      {
        href: "/tiles",
        name: "6labs tiles",
        desc: "The glass tile floor behind the hero, full screen and live: hover a tile to focus it, click to activate it and turn its gamer into their AI copy. Built in three.js from one exact grid, with the characters, glow and film grain.",
        library: true,
      },
    ],
  },
];

export default function Index() {
  return (
    <main className="min-h-screen px-6 md:px-12 py-14 md:py-20">
      <div className="max-w-[880px] mx-auto">
        <p className="text-[12px] font-semibold tracking-[0.14em] uppercase text-slate-400">6labs</p>
        <h1 className="font-display text-[40px] font-medium tracking-tight text-[#0a1b33] mt-2">Screen Library</h1>
        <p className="text-[15px] text-slate-500 mt-3 max-w-[560px] leading-relaxed">
          Design-only handoff. Every 6labs surface and the design libraries it is built from.
        </p>

        {GROUPS.map((group) => (
          <section key={group.title} className="mt-12">
            <h2 className="text-[12px] font-semibold tracking-[0.14em] uppercase text-slate-400">{group.title}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {group.rows.map((row) => (
                <li key={row.href}>
                  <a
                    href={row.href}
                    className={
                      "block rounded-2xl px-6 py-5 transition-all border " +
                      (row.library
                        ? "bg-slate-100/70 border-slate-200/70 hover:border-slate-300"
                        : "bg-white border-slate-200/60 shadow-sm hover:border-slate-300")
                    }
                  >
                    <span className="flex items-center gap-2 font-display text-[18px] font-medium text-[#0a1b33]">
                      {row.library && <span className="text-slate-400">✦</span>}
                      {row.name}
                    </span>
                    <span className="block text-[14px] text-slate-500 mt-1.5 leading-relaxed">{row.desc}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
