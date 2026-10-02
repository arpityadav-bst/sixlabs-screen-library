"use client";

// The card specimens that hold state: picking one card or several, a live selectable cell, and the snap
// row whose cards ring inside their box. Copy is the site's own (players-data.ts, jobs-data.ts).
import { useState } from "react";
import { Card, type CardTone } from "@/components/design-system/Card";
import { CardBody, CardMeta, CardTitle } from "@/components/design-system/CardParts";
import { StatusDot } from "@/components/design-system/StatusDot";
import { JOBS } from "@/components/website/jobs-data";
import { PLAYERS } from "@/components/website/players-data";

const model = (k: number) => `Model ${String(k + 1).padStart(2, "0")}`;

function Status({ on }: { on: boolean }) {
  return on ? (
    <>
      <StatusDot size={6} tone="live" motion="pulse" />
      Running
    </>
  ) : (
    <>
      <StatusDot size={6} tone="idle" />
      Ready
    </>
  );
}

/** Four player cards: one at a time (single) or any number (multiple), both as aria-pressed buttons, so a
 *  second press on the pressed card releases it, as a toggle does, in either form. */
export function CardChoices({ tone = "surface", multiple = false }: { tone?: CardTone; multiple?: boolean }) {
  const [picked, setPicked] = useState<number[]>([0]);
  const toggle = (k: number) =>
    setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : multiple ? [...p, k] : [k]));
  return (
    <div
      role="group"
      aria-label={multiple ? "Pick any players" : "Pick one player"}
      className="grid w-full grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4"
    >
      {PLAYERS.map((p, k) => {
        const on = picked.includes(k);
        return (
          <Card key={p.id} variant="selectable" tone={tone} size="compact" selected={on} onToggle={() => toggle(k)}>
            <CardTitle>{p.title}</CardTitle>
            <CardBody>{p.tagline}</CardBody>
            <CardMeta start={model(k)} end={<Status on={on} />} />
          </Card>
        );
      })}
    </div>
  );
}

/** The live cell of a selectable row: it toggles. */
export function LiveSelectable({ tone = "surface" }: { tone?: CardTone }) {
  const [on, setOn] = useState(false);
  const p = PLAYERS[1];
  return (
    <Card variant="selectable" tone={tone} size="compact" selected={on} onToggle={setOn}>
      <CardTitle>{p.title}</CardTitle>
      <CardBody>{p.tagline}</CardBody>
      <CardMeta start={model(1)} end={<Status on={on} />} />
    </Card>
  );
}

/** Below xl the job cards become a snap row, so their focus ring draws inside (inset) to survive the clip. */
export function CardSnapRow() {
  return (
    <div className="w-full max-w-[640px] overflow-hidden rounded-(--ds-radius-sm) border border-(--ds-color-line)">
      <div
        role="group"
        aria-label="Jobs, swipe sideways"
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-6 px-6 py-6 [scrollbar-width:none]"
      >
        {JOBS.map((j) => (
          <div key={j.id} className="flex w-[min(calc(100%-20px),360px)] shrink-0 snap-start">
            <Card variant="clickable" inset>
              <CardTitle>{j.title}</CardTitle>
              <CardBody>{j.body}</CardBody>
              <CardMeta start={`${j.tags.length} tags`} />
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
