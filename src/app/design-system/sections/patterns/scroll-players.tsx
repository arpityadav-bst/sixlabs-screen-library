// Scroll line to players: the middle of the page, where the line hands over to the water and the players
// stand on it. The section renders #players, so it is shown only in a frame of its own. The reasons live
// in DESIGN.md 9.3.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { ContrastBadge } from "@/app/design-system/_kit/ContrastBadge";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { tokenByName, typeStyle } from "@/components/design-system/tokens";
import { PLAYERS } from "@/components/website/players-data";
import { Bom, SecLink } from "./pattern-parts";
import { PLAYERS_BOM, PLAYERS_CODE, PLAYERS_FLOW, PLAYERS_PINS, PLAYERS_VALUES, PLAYERS_WIDTHS } from "./scroll-players-data";
import s from "./scroll-players.module.css";

const SRC = { from: "@/components/website/Players", name: "Players" };
const ACCENT = tokenByName("color-accent")?.value ?? "";
const INK = tokenByName("color-ink")?.value ?? "";

function Player({ tone }: { tone: "white" | "ink" }) {
  const p = PLAYERS[0];
  return (
    <div className={s["ds-sp-player"]} data-tone={tone}>
      <p className={s["ds-sp-title"]} style={typeStyle("hero")}>
        {p.title}
      </p>
      <p className={s["ds-sp-body"]} style={typeStyle("player-body")}>
        {p.body}
      </p>
      <ContrastBadge fg={tone === "white" ? "#ffffff" : INK} bg={ACCENT} bgName="accent" />
    </div>
  );
}

export function ScrollPlayersSection() {
  return (
    <Section
      id="scroll-players"
      lead="The middle of the page. The scroll line fills, the water rises over it, and the players stand on the water, the one stretch of the site filled with the accent."
    >
      <Spec
        title="Players, composed"
        source={SRC}
        role="The pick, its portrait and the four models share one view, so choosing a player never needs a scroll."
        caption="the real section on a solid accent ground, revealed by its own accentwave event · pins follow the width"
        drawer={{ values: PLAYERS_VALUES, code: PLAYERS_CODE }}
        note={
          <>
            The live run from the line to the water plays under <SecLink id="scroll-line" /> and{" "}
            <SecLink id="accent-water" />.
          </>
        }
      >
        <Anatomy frame layout="stack" ground="on-blue" pins={PLAYERS_PINS} label="Players anatomy">
          <ViewportPreview
            part="players"
            title="Players section"
            height={900}
            widths={PLAYERS_WIDTHS}
            width={1440}
            cost={{ gl: 3 }}
          />
        </Anatomy>
      </Spec>

      <Spec
        title="Bill of materials"
        source={SRC}
        role="The section owns no look of its own beyond its layout, so each part is specced where it is reused."
      >
        <Bom items={PLAYERS_BOM} label="Players parts" />
      </Spec>

      <Spec
        title="How it comes in"
        source={{ ...SRC, line: 50 }}
        role="The section waits for the water rather than for the scroll, so it never appears on the light page."
      >
        <KeyRows label="Players behaviour" rows={PLAYERS_FLOW} />
      </Spec>

      <DoDont>
        <Do ground="on-blue" reason="White is the strongest colour the blue can carry, so type on the water is white or sits on a white card.">
          <Player tone="white" />
        </Do>
        <Dont ground="on-blue" reason="Navy on the blue falls under the ratio body type needs and reads as a stain.">
          <Player tone="ink" />
        </Dont>
      </DoDont>
    </Section>
  );
}
