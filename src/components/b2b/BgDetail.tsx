// The hero's sheet details, from the blueprint's first take: crop marks in the hero's four corners and small notes
// beside them in the terminal's type, as on a technical drawing (the figure, what it shows, where the line stands
// and the scale), in faint accent blue. Quiet, under the copy, kept out of the header's band. Not on phones.
const MONO = "font-[family-name:var(--font-jbmono)]";
const NOTE = `${MONO} absolute text-[10px] uppercase tracking-[0.14em] text-[#1a6dff]/55`;
const MARK = "absolute h-3.5 w-3.5 border-[#1a6dff]/40";

export function BgDetail() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-4 bottom-5 top-[84px] max-md:hidden md:inset-x-8 md:top-[100px]">
      <span className={MARK + " left-0 top-0 border-l border-t"} />
      <span className={MARK + " right-0 top-0 border-r border-t"} />
      <span className={MARK + " bottom-0 left-0 border-b border-l"} />
      <span className={MARK + " bottom-0 right-0 border-b border-r"} />
      <span className={NOTE + " left-6 top-0"}>Fig. 01 · behaviour model</span>
      <span className={NOTE + " right-6 top-0"}>Human → twin · live</span>
      <span className={NOTE + " bottom-0 left-6"}>x 0.500 · line</span>
      <span className={NOTE + " bottom-0 right-6"}>Scale 1 : 1</span>
    </div>
  );
}
