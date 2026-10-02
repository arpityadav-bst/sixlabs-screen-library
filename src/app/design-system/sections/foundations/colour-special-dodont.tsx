// Three decisions about the contextual palettes, each with real parts: the white ladder off the blue, the
// lifted accent off the terminal, and the logo's blue on a UI icon.
import { ContrastBadge } from "@/app/design-system/_kit/ContrastBadge";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Chip } from "@/components/design-system/Chip";
import { cssVar, typeStyle } from "@/components/design-system/tokens";
import { SixLabsMark } from "@/components/website/brand-marks";
import { Word } from "@/components/website/CopyLine";
import { tok } from "./colour-kit";
import { ANSWER, TRAIT_LABELS } from "./colour-special-data";
import s from "./colour.module.css";

function GlassChips() {
  return (
    <div role="group" aria-label="Traits" className={s["ds-col-chips"]}>
      {TRAIT_LABELS.map((label, i) => (
        <Chip key={label} ground="onBlue" selected={i === 0}>
          {label}
        </Chip>
      ))}
    </div>
  );
}

function Answer({ on }: { on: "terminal" | "surface" }) {
  const fg = tok("color-accent-on-dark").value;
  return (
    <>
      <span style={{ ...typeStyle("terminal"), color: cssVar("color-accent-on-dark") }}>{ANSWER}</span>
      <ContrastBadge fg={fg} bg={on === "terminal" ? tok("color-terminal-bg").value : "surface"} bgName={on === "terminal" ? "the terminal" : "white"} />
    </>
  );
}

function Lockup({ markColour }: { markColour: string }) {
  return (
    <span className={s["ds-col-mark"]}>
      <span className={s["ds-col-mark-icon"]} style={{ color: markColour }}>
        <SixLabsMark className="h-10 w-10" />
      </span>
      <span style={{ ...typeStyle("wordmark"), color: cssVar("color-ink") }}>
        <Word />
      </span>
    </span>
  );
}

export function OnBlueOffBlue() {
  return (
    <DoDont>
      <Do ground="on-blue" reason="The white ladder is drawn for the blue, where 15% white reads as a raised glass pill.">
        <GlassChips />
      </Do>
      <Dont ground="page" reason="Off the blue the same glass all but vanishes, so on-blue colours never leave the players section.">
        <GlassChips />
      </Dont>
    </DoDont>
  );
}

export function AnswerOffTerminal() {
  return (
    <DoDont>
      <Do ground="terminal" layout="stack" reason="The lifted accent is made for the dark window, where the run's one answer has to stand out.">
        <Answer on="terminal" />
      </Do>
      <Dont ground="surface" layout="stack" reason="On a light ground the lifted accent drops under 3:1, so it never leaves the terminal.">
        <Answer on="surface" />
      </Dont>
    </DoDont>
  );
}

export function LogoBlueInUi() {
  return (
    <DoDont>
      <Do ground="page" reason="A UI icon of the mark takes ink, so the accent 6 beside it stays the only blue in the lockup.">
        <Lockup markColour={cssVar("color-ink")} />
      </Do>
      <Dont ground="page" reason="The logo's blue sits a hair off the accent, so a UI icon painted in it reads as a second, slightly wrong blue.">
        <Lockup markColour={cssVar("color-logo-blue")} />
      </Dont>
    </DoDont>
  );
}
