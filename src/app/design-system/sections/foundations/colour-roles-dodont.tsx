// Two colour decisions taught as pairs, each with real parts: a selected chip in navy against one in the
// accent, and a field edge in the field line against one in the card hairline.
import { ContrastBadge } from "@/app/design-system/_kit/ContrastBadge";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Chip } from "@/components/design-system/Chip";
import { cssVar } from "@/components/design-system/tokens";
import { PLAYERS } from "@/components/website/players-data";
import { readable, tok } from "./colour-kit";
import { tint } from "./colour-strip";
import s from "./colour.module.css";

const NAMES = PLAYERS.slice(0, 3).map((p) => p.title);

function Chips() {
  return (
    <div role="group" aria-label="Player types" className={s["ds-col-chips"]}>
      {NAMES.map((n, i) => (
        <Chip key={n} selected={i === 0}>
          {n}
        </Chip>
      ))}
    </div>
  );
}

function Field({ token, label }: { token: string; label: string }) {
  return (
    <>
      <input
        className={s["ds-col-field"]}
        style={tint(cssVar(token))}
        aria-label={label}
        placeholder="you@studio.com"
        readOnly
      />
      <ContrastBadge fg={readable(tok(token))} bg="surface" bgName="white" />
    </>
  );
}

export function SelectedPair() {
  return (
    <DoDont>
      <Do ground="surface" reason="Navy carries the selected state, which leaves the accent free for attention and for the players' water.">
        <Chips />
      </Do>
      <Dont ground="surface" reason="An accent fill reads as the players' water, so a selected chip in it competes with the one place the blue belongs.">
        <span className={s["ds-col-accent-fill"]}>
          <Chips />
        </span>
      </Dont>
    </DoDont>
  );
}

export function FieldEdgePair() {
  return (
    <DoDont>
      <Do ground="surface" layout="stack" reason="A field has to be found before it is filled, so its edge takes the field line, which clears 3:1 on white.">
        <Field token="color-line-field" label="Email, drawn with the field line" />
      </Do>
      <Dont ground="surface" layout="stack" reason="The card hairline groups content and nearly vanishes as an edge, so a field drawn in it reads as plain text.">
        <Field token="color-line" label="Email, drawn with the card hairline" />
      </Dont>
    </DoDont>
  );
}
