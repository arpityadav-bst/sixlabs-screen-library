"use client";

// After the players, on the light page again (the light rises back over the accent blue, AccentWave.tsx):
// ChatGPT and 6labs compared, as the onBlue business page compares the old way with onBlue
// (blueai/public/experiments/onblue-vesper/brands.html, .cmp): one card holding a table with no rules in it.
// A header band names the two sides by their marks (brand-marks.tsx) and names; each row is a label, then
// ChatGPT's answer in a dimmer ink, then 6labs's. The rows are told apart by a faint stripe, and the 6labs
// column by a wash of the accent running the card's full height: everything else about the two sides is
// the same, so the surface does the comparing, and a row reads straight across. On a phone the label column
// goes and each answer becomes its own short sentence (the line's own words), two columns still, the
// stripes giving way to hairlines. It rises in once when the section comes into view. The section is only as
// tall as its card; above it, below the fixed header, and below it to the next one (Jobs.tsx) the same
// block's distance (about 144px, 96px on phones), not a whole section's.
import { motion } from "motion/react";
import { ChatGptMark, SixLabsMark } from "./brand-marks";

const ease = [0.22, 1, 0.36, 1] as const;
// the answers as table cells (a label beside them) and as sentences (a phone, the label gone)
const ROWS = [
  {
    label: "Learns from",
    theirs: ["The internet", "Reads the internet"],
    ours: [
      "Millions of hours of gameplay",
      "Watches millions of hours of gameplay",
    ],
  },
  {
    label: "Understands",
    theirs: [
      "Facts and how humans think",
      "Understands facts and how humans think",
    ],
    ours: ["The game player", "Understands the game player"],
  },
];
// a row: label, ChatGPT, 6labs; on a phone the two answers only, set at their tops
const row =
  "grid grid-cols-[1fr_1.25fr_1.45fr] items-center gap-7 px-6 py-5 max-md:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] max-md:items-start max-md:gap-3 max-md:px-4 max-md:py-3.5";
// the 6labs cell: its ground eats the row's own padding (and 18px before the words), so the cells meet
// with no seam and the wash runs the card's height
const col =
  "self-stretch -my-5 -mr-6 -ml-[18px] py-5 pr-6 pl-[18px] bg-[#1a6dff]/[0.07] max-md:-my-3.5 max-md:-mr-4 max-md:-ml-3 max-md:py-3.5 max-md:pr-4 max-md:pl-3";
const answer =
  "font-display text-[21px] leading-[1.3] tracking-tight max-md:text-[16px]";

export function Understands() {
  return (
    <section
      id="understands"
      className="relative mx-auto w-full max-w-[1400px] px-4 pt-[calc(70px+96px)] md:px-16 md:pt-[calc(89px+clamp(96px,9vw,144px))]"
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease }}
        className="mx-auto max-w-[880px] overflow-hidden rounded-[28px] border border-slate-200/80 bg-white max-md:rounded-[22px]"
      >
        {/* the header band: neutral, so the accent below it is the column's alone */}
        <div className={row + " bg-[#0a1b33]/[0.04]"}>
          <span className="max-md:hidden" />
          <span className="flex items-center gap-2 font-display text-[16px] font-medium tracking-tight text-[#0a1b33]/70 max-md:text-[14px]">
            <ChatGptMark className="h-6 w-6 max-md:h-5 max-md:w-5" />
            ChatGPT
          </span>
          <span
            className={
              col +
              " flex items-center gap-2 font-display text-[16px] font-medium tracking-tight text-accent max-md:text-[14px]"
            }
          >
            <SixLabsMark className="h-6 w-6 max-md:h-5 max-md:w-5" />
            6labs
          </span>
        </div>
        {ROWS.map((r, k) => (
          <div
            key={r.label}
            className={
              row +
              (k % 2 === 0 ? " bg-[#0a1b33]/[0.024]" : "") +
              " max-md:border-t max-md:border-slate-200/70 max-md:bg-transparent"
            }
          >
            <span className="font-sans text-[15px] font-semibold text-[#0a1b33] max-md:hidden">
              {r.label}
            </span>
            <span className={answer + " text-[#0a1b33]/55"}>
              <span className="max-md:hidden">{r.theirs[0]}</span>
              <span className="md:hidden">{r.theirs[1]}</span>
            </span>
            <span className={col + " " + answer + " text-[#0a1b33]"}>
              <span className="max-md:hidden">{r.ours[0]}</span>
              <span className="md:hidden">{r.ours[1]}</span>
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
