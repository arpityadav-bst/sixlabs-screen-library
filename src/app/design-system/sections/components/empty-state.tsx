// Empty state: what a view shows when it has nothing, finds nothing or fails, contained at page level and
// bare inside a card. The reasons live in DESIGN.md 7.22.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { ContrastBadge } from "@/app/design-system/_kit/ContrastBadge";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { Replay } from "@/app/design-system/_kit/Replay";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { Button } from "@/components/design-system/Button";
import { Card } from "@/components/design-system/Card";
import { EmptyState, type EmptyStateVariant } from "@/components/design-system/EmptyState";
import { TextLink } from "@/components/design-system/TextLink";
import { EMPTY_CODE, EMPTY_COPY, EMPTY_PINS, EMPTY_PROPS, EMPTY_VALUES, EMPTY_VARIANTS } from "./empty-state-data";
import { RetryEmpty } from "./empty-state-live";
import { tokenColour } from "./display-values";
import styles from "./overlays.module.css";

const SOURCE = { from: "@/components/design-system/EmptyState", name: "EmptyState" };
const HERE = "#empty-state";

function Filled({
  variant,
  contained = true,
  loading = false,
  muted = false,
}: {
  variant: EmptyStateVariant;
  contained?: boolean;
  loading?: boolean;
  muted?: boolean;
}) {
  const c = EMPTY_COPY[variant];
  return (
    <EmptyState
      variant={variant}
      contained={contained}
      headingLevel={4}
      title={c.title}
      body={muted ? <span className="text-(--ds-color-text-muted)">{c.body}</span> : c.body}
      primaryAction={
        <Button variant={c.primary.variant} loading={loading}>
          {c.primary.label}
        </Button>
      }
      secondaryAction={c.link && <TextLink href={HERE}>{c.link}</TextLink>}
    />
  );
}

const STATES = ["rest", "loading"] as const;
const ROWS = ["error", "offline"] as const;

export function EmptyStateSection() {
  return (
    <Section
      id="empty-state"
      lead="One part for a view with nothing in it yet, nothing that matches, or a failure, each ending on the next step."
    >
      <Spec
        title="Empty state"
        source={SOURCE}
        props="variant title body primaryAction secondaryAction"
        role="Icon, title, reason and one action, in that order, so the eye lands on what happened and leaves on what to do."
        drawer={{ values: EMPTY_VALUES, props: EMPTY_PROPS, code: EMPTY_CODE }}
      >
        <Anatomy pins={EMPTY_PINS} ground="page" layout="stack" label="Empty state anatomy">
          <Filled variant="firstUse" />
        </Anatomy>
      </Spec>
      <Spec
        title="Variants"
        source={SOURCE}
        props="variant"
        role="The variant only picks the icon, so the title and body carry the difference in words the visitor can act on."
        caption="Replay runs the 12px rise · error tints its icon danger ink"
      >
        <Canvas ground="page" layout="grid" label="Empty state variants">
          <Replay>
            {EMPTY_VARIANTS.map((v) => (
              <Item key={v} label={v} align="start">
                <Filled variant={v} />
              </Item>
            ))}
          </Replay>
        </Canvas>
      </Spec>
      <Spec
        title="Inside a card"
        source={SOURCE}
        props="contained"
        role="Inside a card the grey would sit on the card's own edge, so the part drops its container and keeps the column."
      >
        <Canvas ground="page" layout="grid" label="Uncontained empty states in cards">
          <Card tone="surface" size="feature">
            <Filled variant="noResults" contained={false} />
          </Card>
          <Card tone="surface" size="feature">
            <Filled variant="error" contained={false} />
          </Card>
        </Canvas>
      </Spec>
      <Spec
        title="States"
        source={SOURCE}
        role="The action is the only moving part, so a retry shows its work in the button and the message holds still."
      >
        <StateGrid
          label="Empty state states"
          states={STATES}
          variants={ROWS}
          minCell={320}
          liveCaption="press Try again"
          render={({ variant, force }) =>
            force ? <Filled variant={variant} loading={force === "loading"} /> : <RetryEmpty variant={variant} />
          }
        />
      </Spec>
      <Spec
        title="Across widths"
        source={SOURCE}
        role="It reads its own width, not the window's, so a narrow card column gets the phone layout on any screen."
        caption="343 · 720 · the part's own width, not the window's"
      >
        <Canvas ground="page" label="Empty state at 343 wide">
          <Item label="343 wide · padding 32 · actions stacked">
            <div className={styles["ds-narrow"]}>
              <Filled variant="noAccess" />
            </div>
          </Item>
        </Canvas>
        <Canvas ground="page" label="Empty state at 720 wide">
          <Item label="720 wide · padding 48 · actions in a row">
            <div className={styles["ds-wide"]}>
              <Filled variant="noAccess" />
            </div>
          </Item>
        </Canvas>
      </Spec>
      <DoDont>
        <Do reason="The body grey passes AA on the container, so the reason stays readable at 14px." ground="page" layout="stack">
          <Filled variant="offline" />
          <ContrastBadge fg={tokenColour("color-text-body")} bg="container" />
        </Do>
        <Dont reason="The muted grey falls short of AA on the container, so the one line that explains the state is the hardest to read." layout="stack">
          <Filled variant="offline" muted />
          <ContrastBadge fg={tokenColour("color-text-muted")} bg="container" />
        </Dont>
      </DoDont>
      <DoDont>
        <Do reason="Naming what was searched and offering the way back turns a dead end into one more step." ground="page">
          <Filled variant="noResults" />
        </Do>
        <Dont reason="A title with no reason and no action ends the visit, because the view gives nothing to do next.">
          <EmptyState variant="noResults" title="Nothing here" headingLevel={4} />
        </Dont>
      </DoDont>
    </Section>
  );
}
