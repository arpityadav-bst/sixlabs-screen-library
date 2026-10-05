// The comparison pair redrawn at the shipped proportions for the Do / Don't pairs, a sketch rather than a
// second mount (Understands mounts once, above, and its frame shows every width). Each card takes radius-xl
// and 36 padding (radius-lg and 28 under md, as the site steps them), and the navy card a 64 left padding
// from md, for room from the vs. Each opens with the maker's mark at 36 (44 from md) and, 12 beside it, its
// name as the card's heading in the comparison-name role at the side's weight. Under it the two lines are
// the body, plain spans in the comparison role, in the card's one ink. The flat form sets the lines at the
// names' size, the Don't of the hierarchy pair. The copy is the site's own (LINES in comparison-data).
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

type CardProps = { k: 0 | 1; tone: SketchTone; subgrid: boolean; flat: boolean };

/** One card. On a subgrid it spans the row's three tracks, so each line sits level with its counterpart. */
function SketchCard({ k, tone, subgrid, flat }: CardProps) {
  const { side, name, weight } = SIDES[k];
  const Mark = MARK[side];
  const rows = subgrid ? "row-span-3 grid grid-rows-subgrid" : "flex flex-col";
  const vs = side === "ours" ? " md:pl-16" : "";
  const line = flat ? { ...typeStyle("comparison-name"), fontWeight: 400 } : typeStyle("comparison");
  return (
    <div className={`${rows} min-w-0 rounded-(--ds-radius-xl) border p-9 max-md:rounded-(--ds-radius-lg) max-md:p-7${vs} ${TONE[tone]}`}>
      <span className="flex items-center gap-3">
        <Mark className="h-9 w-9 md:h-11 md:w-11" />
        <span style={{ ...typeStyle("comparison-name"), fontWeight: weight }}>{name}</span>
      </span>
      {LINES[side].map((l, n) => (
        <span key={n} className={`block break-words ${n === 0 ? "mt-6" : "mt-3"}`} style={line}>
          {l.join(" ")}
        </span>
      ))}
    </div>
  );
}

type PairProps = {
  tones: readonly [SketchTone, SketchTone];
  /** on the site's shared three-row subgrid, or in two loose columns */
  subgrid?: boolean;
  /** the lines at the names' size, so heading and body compete */
  flat?: boolean;
};

/** The two cards side by side: on a shared three-row subgrid as the site sets them, or in two loose columns. */
export function SketchPair({ tones, subgrid = true, flat = false }: PairProps) {
  const grid = subgrid ? "grid grid-cols-2 grid-rows-[auto_auto_auto] gap-x-3" : "flex gap-3 *:flex-1";
  return (
    <div className={`w-full ${grid}`}>
      <SketchCard k={0} tone={tones[0]} subgrid={subgrid} flat={flat} />
      <SketchCard k={1} tone={tones[1]} subgrid={subgrid} flat={flat} />
    </div>
  );
}
