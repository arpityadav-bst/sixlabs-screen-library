// The three rules that follow from the matrix, each as a pair of real text on its real ground with its
// reading worked out beside it: body on the container, the accent only at display size, large type on blue.
import type { CSSProperties, ReactNode } from "react";
import type { Ground } from "@/app/design-system/_kit/Canvas";
import { ContrastBadge } from "@/app/design-system/_kit/ContrastBadge";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { cssVar, typeStyle } from "@/components/design-system/tokens";
import { readable, tok } from "./colour-kit";
import { ACCENT_INK, RULE_COPY } from "./colour-contrast-data";
import m from "./colour-contrast.module.css";

const BLUE = tok("color-accent").value;

function Rule({ children, fg, bg, bgName }: { children: ReactNode; fg: string; bg: string; bgName: string }) {
  return (
    <div className={m["ds-cm-rule"]}>
      {children}
      <ContrastBadge fg={readable(tok(fg))} bg={bg} bgName={bgName} />
    </div>
  );
}

const text = (type: string, colour: string, extra?: CSSProperties): CSSProperties => ({
  ...typeStyle(type),
  color: cssVar(colour),
  margin: 0,
  ...extra,
});

function Pair({ ground, doReason, dontReason, good, bad }: {
  ground: Ground;
  doReason: string;
  dontReason: string;
  good: ReactNode;
  bad: ReactNode;
}) {
  return (
    <DoDont>
      <Do ground={ground} reason={doReason}>
        {good}
      </Do>
      <Dont ground={ground} reason={dontReason}>
        {bad}
      </Dont>
    </DoDont>
  );
}

export function BodyOnContainer() {
  return (
    <Pair
      ground="container"
      doReason="Body clears 4.5:1 on the container grey, so copy that must be read there takes body."
      dontReason="Muted falls under 4.5:1 on the container, so it is kept for white cards, where it passes."
      good={
        <Rule fg="color-text-body" bg="container" bgName="container">
          <p style={text("lede", "color-text-body")}>{RULE_COPY.lede}</p>
        </Rule>
      }
      bad={
        <Rule fg="color-text-muted" bg="container" bgName="container">
          <p style={text("lede", "color-text-muted")}>{RULE_COPY.lede}</p>
        </Rule>
      }
    />
  );
}

export function AccentAtDisplaySize() {
  return (
    <DoDont>
      <Do ground="page" reason="At display size the accent passes as large text, so it may mark a word in a heading.">
        <Rule fg="color-accent" bg="page" bgName="page">
          <p style={text("h2", "color-ink")}>
            {RULE_COPY.question.lead}
            <span style={{ color: cssVar("color-accent") }}>{RULE_COPY.question.accent}</span>
          </p>
        </Rule>
      </Do>
      <Dont ground="container" reason="Small accent copy falls under 4.5:1 on every light ground, so a short line to read stays in ink or body.">
        <Rule fg="color-accent" bg="container" bgName="container">
          <p style={text("caption", "color-accent", { fontWeight: 500 })}>{ACCENT_INK.sample}</p>
        </Rule>
      </Dont>
    </DoDont>
  );
}

export function LargeOnBlue() {
  return (
    <Pair
      ground="on-blue"
      doReason="Nothing on the blue reaches 4.5:1, so what must be read there is set large and in full white."
      dontReason="White at 80% on the blue passes only as large text, so it never carries small copy."
      good={
        <Rule fg="color-surface" bg={BLUE} bgName="the blue">
          <p style={text("h2", "color-surface")}>{RULE_COPY.playerTitle}</p>
        </Rule>
      }
      bad={
        <Rule fg="color-on-blue-80" bg={BLUE} bgName="the blue">
          <p style={text("caption", "color-on-blue-80")}>{RULE_COPY.playerTagline}</p>
        </Rule>
      }
    />
  );
}
