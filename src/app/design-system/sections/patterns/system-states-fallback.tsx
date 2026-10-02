// The hero when WebGL is not there, a proposed state: the container's box at its own height (664, 720 on a
// phone) with its copy as it ships, the lede's link, Try now and the line of social proof, the numbers in the
// row under it, the floor's mark laid still at 60% where the floor would run, and one quiet line under Try
// now that says why nothing moves. Today the site shows nothing here (the full view gives up after 12s, the
// container keeps its turning mark), so this is the state the hero should reach. It leaves out the scroll
// cue and the wave button, since a wave has no floor to land on. The mark's turn is dropped rather than kept,
// because a turning mark says "loading" and nothing is coming, and the proof dot holds still for the same
// reason. The lede's link is held, so a click here never jumps the guide.
import { COPIES_BASE, HERO_LEDE, heroStats } from "@/app/design-system/_data/specimens";
import { StatusDot } from "@/components/design-system/StatusDot";
import { TextLink } from "@/components/design-system/TextLink";
import { typeStyle } from "@/components/design-system/tokens";
import { HeroNumbers } from "@/components/website/HeroBits";
import { PrimaryCta } from "@/components/website/PrimaryCta";
import { TypedWord } from "@/components/website/TypedWord";
import { ClickHold } from "./click-hold";
import { HEADLINE, HERO_LINK } from "./hero-data";
import { FALLBACK, PROOF } from "./system-states-data";
import s from "./system-states.module.css";

export function HeroFallback() {
  const h = HEADLINE;
  return (
    <ClickHold className={s["ds-fb-wrap"]}>
      <div data-pin="fallback" className={s["ds-fb"]}>
        {/* eslint-disable-next-line @next/next/no-img-element -- the shipped floor mark, laid still */}
        <img src={FALLBACK.still} alt="" width={1200} height={1200} className={s["ds-fb-still"]} />
        <div className={s["ds-fb-copy"]}>
          <p className={s["ds-fb-title"]} style={typeStyle("hero")}>
            {h.before} <TypedWord word={h.word} className="text-accent" /> {h.after}
            <br />
            {h.line2}
          </p>
          <p className={s["ds-fb-lede"]} style={typeStyle("lede")}>
            {HERO_LEDE} <TextLink href="#jobs">{HERO_LINK.text}</TextLink>
          </p>
          <div data-pin="cta" className={s["ds-fb-cta"]}>
            <PrimaryCta>Try now</PrimaryCta>
          </div>
          <p data-pin="note" className={s["ds-fb-note"]} style={typeStyle("caption")}>
            {FALLBACK.note}
          </p>
          <div data-pin="proof" className={s["ds-fb-proof"]}>
            <StatusDot tone="live" motion="none" />
            <p className={s["ds-fb-proof-line"]}>{PROOF.line}</p>
            <p className={s["ds-fb-proof-next"]}>{PROOF.next}</p>
          </div>
        </div>
      </div>
      <div data-pin="numbers" className={s["ds-fb-under"]}>
        <HeroNumbers stats={heroStats(COPIES_BASE)} ready left={false} />
      </div>
    </ClickHold>
  );
}
