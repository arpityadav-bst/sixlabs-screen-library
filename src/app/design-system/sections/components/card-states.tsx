// The card's state matrices: every forced state per variant on its own ground (the page, the container
// grey, the page under the inverse navy, the accent water), with a live cell to hover, press or Tab into.
// The clickable row carries the sheen, pinned at the centre in its forced hover. A state a variant does not
// have prints "none" rather than a fake picture.
import type { Ground } from "@/app/design-system/_kit/Canvas";
import { None } from "@/app/design-system/_kit/Label";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { Card, type CardTone, type CardVariant } from "@/components/design-system/Card";
import { CardBody, CardMeta, CardTitle } from "@/components/design-system/CardParts";
import type { ForceState } from "@/components/design-system/force";
import { JOBS } from "@/components/website/jobs-data";
import { PLAYERS } from "@/components/website/players-data";
import { LiveSelectable } from "./card-live";

const STATES = ["rest", "hover", "pressed", "selected", "focus-visible", "disabled", "loading"] as const;
const ON_BLUE = ["rest", "hover", "pressed", "selected", "focus-visible", "disabled", "loading"] as const;
const ROWS = ["clickable", "selectable"] as const;

/** A clickable card goes somewhere, so it is never picked. Every other state is drawn by Card. */
const NOT: Record<(typeof ROWS)[number], readonly string[]> = {
  clickable: ["selected"],
  selectable: [],
};

function Specimen({ variant, tone, force }: { variant: CardVariant; tone: CardTone; force?: ForceState }) {
  if (variant === "clickable") {
    const j = JOBS[0];
    return (
      <Card variant="clickable" tone={tone} size="compact" sheen forceState={force}>
        <CardTitle>{j.title}</CardTitle>
        <CardBody>{j.body}</CardBody>
      </Card>
    );
  }
  const p = PLAYERS[0];
  const off = force === "disabled";
  return (
    <Card variant="selectable" tone={tone} size="compact" forceState={force}>
      <CardTitle>{p.title}</CardTitle>
      <CardBody>{p.tagline}</CardBody>
      <CardMeta start="Model 01" end={off ? "Unavailable" : force === "selected" ? "Running" : "Ready"} />
    </Card>
  );
}

function ToneGrid({ tone, ground, label }: { tone: CardTone; ground: Ground; label: string }) {
  return (
    <StateGrid
      label={label}
      ground={ground}
      states={STATES}
      variants={ROWS}
      minCell={210}
      render={({ state, variant, force }) => {
        if (state !== "live" && NOT[variant].includes(state)) return <None />;
        if (state === "live" && variant === "selectable") return <LiveSelectable tone={tone} />;
        return <Specimen variant={variant} tone={tone} force={force} />;
      }}
    />
  );
}

export function CardStateGrid() {
  return <ToneGrid tone="surface" ground="page" label="Card states on the page ground" />;
}

/** The container tone on its own grey, and the inverse navy on the page it ships on. */
export function CardToneStateGrid({ tone }: { tone: "container" | "inverse" }) {
  return tone === "container" ? (
    <ToneGrid tone="container" ground="container" label="Container card states on the container ground" />
  ) : (
    <ToneGrid tone="inverse" ground="page" label="Inverse card states on the page" />
  );
}

export function CardOnBlueStateGrid() {
  return (
    <StateGrid
      label="Card states on the accent water"
      ground="on-blue"
      states={ON_BLUE}
      variants={["onBlue"] as const}
      minCell={210}
      render={({ state, force }) =>
        state === "live" ? <LiveSelectable tone="onBlue" /> : <Specimen variant="selectable" tone="onBlue" force={force} />
      }
    />
  );
}
