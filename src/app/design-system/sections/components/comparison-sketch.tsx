// The comparison pair redrawn at the shipped proportions for the Do / Don't pairs, a sketch rather than a
// second mount (Understands mounts once, above, and its frame shows every width). Each card takes radius-xl
// and 36 padding (radius-lg and 28 under md, as the site steps them), the maker's mark at 32 beside its name
// in the card-name role, and each line is a plain span in the comparison role, in the card's one ink. The
// copy is the site's own (LINES in comparison-data).
import { typeStyle } from "@/components/design-system/tokens";
import { ChatGptMark, SixLabsMark } from "@/components/website/brand-marks";
import { LINES, SIDES } from "./comparison-data";

export type SketchTone = "container" | "navy" | "white";

const TONE: Record<SketchTone, string> = {
  container: "border-(--ds-color-line-faint) bg-(--ds-color-container) text-(--ds-color-ink)",
  navy: "border-transparent bg-(--ds-color-primary) text-white",
  white: "border-(--ds-color-line) bg-(--ds-color-surface) text-(--ds-color-ink)",
};

const MARK = { theirs: ChatGptMark, ours: SixLabsMark } as const;

/** One card. On a subgrid it spans the row's three tracks, so each line sits level with its counterpart. */
function SketchCard({ k, tone, subgrid }: { k: 0 | 1; tone: SketchTone; subgrid: boolean }) {
  const { side, name, weight } = SIDES[k];
  const Mark = MARK[side];
  const rows = subgrid ? "row-span-3 grid grid-rows-subgrid" : "flex flex-col";
  return (
    <div className={`${rows} min-w-0 rounded-(--ds-radius-xl) border p-9 max-md:rounded-(--ds-radius-lg) max-md:p-7 ${TONE[tone]}`}>
      <span className="flex items-center gap-2.5">
        <Mark className="h-8 w-8" />
        <span style={{ ...typeStyle("card-name"), fontWeight: weight }}>{name}</span>
      </span>
      {LINES[side].map((l, n) => (
        <span key={n} className={`block break-words ${n === 0 ? "mt-6" : "mt-3"}`} style={typeStyle("comparison")}>
          {l.join(" ")}
        </span>
      ))}
    </div>
  );
}

/** The two cards side by side: on a shared three-row subgrid as the site sets them, or in two loose columns. */
export function SketchPair({ tones, subgrid = true }: { tones: readonly [SketchTone, SketchTone]; subgrid?: boolean }) {
  const grid = subgrid ? "grid grid-cols-2 grid-rows-[auto_auto_auto] gap-x-3" : "flex gap-3 *:flex-1";
  return (
    <div className={`w-full ${grid}`}>
      <SketchCard k={0} tone={tones[0]} subgrid={subgrid} />
      <SketchCard k={1} tone={tones[1]} subgrid={subgrid} />
    </div>
  );
}
