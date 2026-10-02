// Loading, empty and failure: page-level states for when content or the floor is not there. The row loads
// behind skeletons, the hero survives without WebGL, and a banner names a condition above the view it
// affects. The reasons live in DESIGN.md 9.8.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Replay } from "@/app/design-system/_kit/Replay";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { Banner } from "@/components/design-system/Banner";
import { Button } from "@/components/design-system/Button";
import { EmptyState } from "@/components/design-system/EmptyState";
import { Spinner } from "@/components/design-system/Spinner";
import { typeStyle } from "@/components/design-system/tokens";
import { JobCardSkeleton } from "../components/loading-composites";
import {
  BANNER_CODE,
  BANNER_PARTS,
  BANNER_PINS,
  BANNER_PROPS,
  BANNER_STATES,
  BANNER_TONES,
  BANNER_VALUES,
  FALLBACK,
  FALLBACK_PINS,
  FALLBACK_VALUES,
  LOADING_VALUES,
  OFFLINE,
} from "./system-states-data";
import { HeroFallback } from "./system-states-fallback";
import { JobsRowLoading, LiveBanner, OfflineView } from "./system-states-live";
import s from "./system-states.module.css";

const BANNER = { from: "@/components/design-system/Banner", name: "Banner" };

export function SystemStatesSection() {
  return (
    <Section
      id="system-states"
      lead="What a page shows while content is on its way, when the floor cannot run, and when the connection or a request fails. Each state keeps the rest of the page working."
    >
      <Spec
        title="A row that loads"
        source={{ from: "@/components/design-system/Skeleton", name: "SkeletonGroup" }}
        role="Skeletons in the shape of the cards hold the row, so nothing under it moves when the cards land."
        caption="the jobs row on the grain · the switch swaps the composites for the system Card, the job card's stand-in"
        drawer={{ values: LOADING_VALUES }}
      >
        <Canvas ground="grain" layout="stack" minHeight={560} label="Jobs row loading">
          <JobsRowLoading />
        </Canvas>
      </Spec>

      <Spec
        title="Hero without WebGL"
        source={{ from: "@/components/website/Hero", name: "Hero" }}
        role="A proposed state: the hero keeps its box, copy and call, lays the mark still and says in one line why nothing moves."
        drawer={{ values: FALLBACK_VALUES }}
        note="The site has no such state yet: the full view gives up after 12s on bare grey, and the container keeps its turning mark."
      >
        <Anatomy ground="page" layout="stack" pins={FALLBACK_PINS} label="Hero fallback anatomy">
          <Replay>
            <HeroFallback />
          </Replay>
        </Anatomy>
      </Spec>

      <Spec
        title="Banner"
        source={BANNER}
        props="tone title body action dismissible"
        role="A banner names the condition above the view it affects and stays until it ends, so the page under it keeps working."
        caption="live · Retry and Try again turn busy and come back, as a retry that fails again would"
        drawer={{ values: BANNER_VALUES, props: BANNER_PROPS, code: BANNER_CODE }}
      >
        <Anatomy ground="page" layout="stack" pins={BANNER_PINS} label="Offline view anatomy" isolateKeys>
          <OfflineView />
        </Anatomy>
      </Spec>

      <Spec title="Banner tones" source={BANNER} props="tone" role="The tone picks the icon and, for warning and danger, a tint, so the words still carry the meaning.">
        <Canvas ground="page" layout="stack" label="Banner tones">
          {BANNER_TONES.map((b) => (
            <Banner key={b.tone} tone={b.tone} title={b.title} body={b.body} />
          ))}
        </Canvas>
      </Spec>

      <Spec title="Banner states" source={BANNER} props="action dismissible" role="The banner's controls are the system Button and IconButton, so they press, focus and wait the way every control does.">
        <StateGrid
          label="Banner states"
          states={BANNER_STATES}
          variants={BANNER_PARTS}
          minCell={300}
          liveCaption="press Retry or the close"
          render={({ state, variant, force }) =>
            state === "live" ? (
              <LiveBanner part={variant} />
            ) : variant === "close" && state === "loading" ? (
              // the close never waits, and the action row already shows Retry busy
              <span className="ds-label">none, the close does not wait</span>
            ) : (
              <Banner
                tone="offline"
                title={OFFLINE.title}
                action={{ label: OFFLINE.retry, loading: state === "loading" }}
                dismissible={variant === "close"}
                forceAction={variant === "action" && state !== "loading" ? force : undefined}
                forceClose={variant === "close" && state !== "loading" ? force : undefined}
              />
            )
          }
        />
      </Spec>

      <DoDont>
        <Do ground="grain" reason="A skeleton promises the shape of what is coming, so the eye is already where the card will land.">
          <JobCardSkeleton />
        </Do>
        <Dont ground="grain" reason="A spinner says only wait, and the row jumps when the cards replace it.">
          <div className={`${s["ds-ss-card"]} ${s["ds-ss-wait"]}`}>
            <Spinner size={24} delay={0} />
          </div>
        </Dont>
      </DoDont>
      <DoDont>
        <Do reason="The visitor came for the claim, so the copy stays and the missing floor gets one quiet line.">
          <p className={s["ds-fb-note"]} style={typeStyle("caption")}>
            {FALLBACK.note}
          </p>
        </Do>
        <Dont reason="An error panel in place of the hero turns a missing decoration into a broken page.">
          <EmptyState
            variant="error"
            contained
            headingLevel={4}
            title="The floor did not load"
            body="Something went wrong."
            primaryAction={<Button variant="secondary">Try again</Button>}
          />
        </Dont>
      </DoDont>
    </Section>
  );
}
