// The screen library's door to the design system: one full-width card in the hero container's look (the
// container grey, the 36 radius, the faint hairline and the container's shadow), with no accent fill on it.
// The copy column carries the site's own typed word and HeroNumbers. The page passes the counts and the
// tile's state count from the catalog, so the card cannot go stale and never reads the guide itself. The
// pill is the system's primary lg drawn as a span, because the whole card is the link: it lights on hover
// and on keyboard focus, and the card presses to the card scale as whole cards do. It mounts its own
// tokens, scoped to the card, since the index page sits outside the guide.
import { ArrowRight } from "lucide-react";
import { useId } from "react";
import { HeroNumbers } from "@/components/website/HeroBits";
import { TypedWord } from "@/components/website/TypedWord";
import { BUTTON_BASE, BUTTON_SIZE, BUTTON_VARIANT } from "./button-styles";
import { FOCUS_CARD } from "./focus";
import { IndexCardArt } from "./index-card-art";
import { ICON_STROKE } from "./tokens";
import { TokenStyle } from "./TokenStyle";

const SCOPE = "ds-index";
const INK = "text-(--ds-color-ink)";
/** quoted from the footer copy line's strong label (CopyLine.tsx) */
const MODELS = "1,000,000+ player models";

const CARD =
  `${SCOPE} group/ix relative flex overflow-hidden rounded-(--ds-radius-xl) border border-(--ds-color-line-faint) ` +
  "bg-(--ds-color-container) shadow-(--ds-shadow-container) transition-[translate,box-shadow,scale] duration-(--ds-dur-line) " +
  "ease-(--ds-ease-out) motion-safe:hover:-translate-y-0.5 hover:shadow-(--ds-shadow-lift) " +
  "motion-safe:active:scale-(--ds-scale-press-card) md:h-[400px] " +
  "max-md:flex-col max-md:rounded-(--ds-radius-lg) " +
  FOCUS_CARD;

const PILL =
  `${BUTTON_BASE} ${BUTTON_SIZE.lg.box} ${BUTTON_VARIANT.primary} mt-8 self-start ` +
  "group-hover/ix:bg-(--ds-color-primary-hover) group-focus-visible/ix:bg-(--ds-color-primary-hover)";

export type IndexCardCounts = { components: number; states: number; groups: number };

export type IndexCardProps = {
  /** the catalog's counts, passed by the page */
  counts: IndexCardCounts;
  /** how many states the glass tile shows */
  tileStates: number;
};

export function IndexCard({ counts, tileStates }: IndexCardProps) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const openId = `${uid}-open`;
  const stats = [
    { value: String(counts.components), label: ["Components"], tone: INK, live: false },
    { value: String(counts.states), label: ["States shown"], tone: INK, live: false },
    { value: String(counts.groups), label: ["Groups"], tone: INK, live: false },
  ];

  return (
    <>
      <TokenStyle selector={`.${SCOPE}`} />
      <a href="/design-system" className={CARD} aria-labelledby={`${titleId} ${openId}`}>
        <div className="relative z-10 flex max-w-[420px] flex-col p-10 max-md:p-7">
          <span className="font-sans text-[11px] font-semibold uppercase leading-4 tracking-[0.18em] text-(--ds-color-text-body)">
            Design system
          </span>
          <h3
            id={titleId}
            className={`mt-3 font-display text-[40px] font-medium leading-[1.05] tracking-tight max-md:text-[34px] ${INK}`}
          >
            6labs design <TypedWord word="system" className="text-accent" />
          </h3>
          <p className="mt-4 font-sans text-[15px] leading-[1.6] text-(--ds-color-text-body)">
            Every token, part and pattern of the site, rendered from its own components.
          </p>
          <div className="mt-7">
            <HeroNumbers stats={stats} ready left />
          </div>
          <span id={openId} className={PILL}>
            Open the system
            <ArrowRight size={18} strokeWidth={ICON_STROKE[18]} aria-hidden="true" />
          </span>
        </div>
        <IndexCardArt tileLabel={`Glass tile · ${tileStates} states`} modelsLabel={MODELS} />
      </a>
    </>
  );
}
