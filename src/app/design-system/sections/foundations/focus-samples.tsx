// Small specimens for the focus section. RingProbe adds the two invisible boxes the Anatomy pins (the
// offset gap and the ring's outer edge). RingPill carries one ring tone on a plain pill, for the dark
// tone no system part uses yet and for the Don't panels. The card and scroll-row samples are the real
// Card, forced to focus, the card in the first job's own copy, each in the kit's Forced box (inert, with
// a reader line), so the clickable cards stay out of the Tab order.
import type { ReactNode } from "react";
import { Forced } from "@/app/design-system/_kit/Forced";
import { Card } from "@/components/design-system/Card";
import { CardBody, CardTitle } from "@/components/design-system/CardParts";
import { focusRing, type FocusTone } from "@/components/design-system/focus";
import { JOBS } from "@/components/website/jobs-data";
import styles from "./focus.module.css";

/** The focused card's copy, quoted from the first job (jobs-data.ts). */
const JOB = JOBS[0];

export function RingProbe({ children }: { children: ReactNode }) {
  return (
    <span data-ring-control="" className={styles["ds-probe"]}>
      {children}
      <span aria-hidden="true" data-probe="gap" className={styles["ds-probe-gap"]} />
      <span aria-hidden="true" data-probe="ring" className={styles["ds-probe-ring"]} />
    </span>
  );
}

const PILL = "inline-flex h-10 items-center rounded-full border px-5 font-sans text-[14px] font-medium";
const PILL_TONE = {
  light: "border-(--ds-color-line-strong) text-(--ds-color-ink)",
  dark: "border-(--ds-color-on-blue-25) text-white",
} as const;

/** A plain pill with one ring tone forced on. */
export function RingPill({
  tone = "default",
  on = "light",
  children,
}: {
  tone?: FocusTone;
  on?: keyof typeof PILL_TONE;
  children: string;
}) {
  return (
    <span data-force="focus" className={`${PILL} ${PILL_TONE[on]} ${focusRing(tone)}`}>
      {children}
    </span>
  );
}

/** A clickable card forced to focus: the ring sits 3px off its 22px corners. */
export function FocusedCard() {
  return (
    <div className={styles["ds-card-box"]}>
      <Forced state="focus" label={`${JOB.title} card`}>
        <Card variant="clickable" size="compact" forceState="focus" aria-label={JOB.title}>
          <CardTitle>{JOB.title}</CardTitle>
          <CardBody>{JOB.body}</CardBody>
        </Card>
      </Forced>
    </div>
  );
}

/** Three cards in a sideways scroll row, the first forced to focus, its ring inside or outside the box. */
export function ScrollRow({ inset }: { inset: boolean }) {
  const titles = ["Functional", "Behavioral", "Large scale"];
  return (
    <Forced state="focus" label={`${titles[0]} card in a scroll row, the ring ${inset ? "inside" : "outside"} the box`}>
      <div className={styles["ds-scroll-row"]}>
        {titles.map((t, k) => (
          <Card key={t} variant="clickable" size="compact" inset={inset} forceState={k === 0 ? "focus" : undefined}>
            <CardTitle>{t}</CardTitle>
          </Card>
        ))}
      </div>
    </Forced>
  );
}
