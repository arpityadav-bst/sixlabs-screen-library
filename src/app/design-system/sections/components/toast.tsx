// Toast: transient outcomes on the navy panel, in flow by tone, stacked, by control state, through their
// life, live in the guide's Toaster and placed against BackToTop. The reasons live in DESIGN.md 7.24.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { Timeline } from "@/app/design-system/_kit/Timeline";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { Toast } from "@/components/design-system/Toast";
import { ToastStack } from "@/components/design-system/ToastStack";
import styles from "./overlays.module.css";
import {
  TOAST_CODE,
  TOAST_CONTROLS,
  TOAST_CONTROL_STATES,
  TOAST_LIFE,
  TOAST_PINS,
  TOAST_PROPS,
  TOAST_TONES,
  TOAST_TRIO,
  TOAST_VALUES,
} from "./toast-data";
import { ToastLive } from "./toast-live";

const TOAST = { from: "@/components/design-system/Toast", name: "Toast" };
const STACK = { from: "@/components/design-system/ToastStack", name: "ToastStack" };
const TOASTER = { from: "@/components/design-system/Toaster", name: "Toaster" };
const INFO = TOAST_TONES[1];

export function ToastSection() {
  return (
    <Section
      id="toast"
      lead="A short word that something happened, at the bottom centre and clear of BackToTop, gone on its own unless it is an error."
    >
      <Spec
        title="Toast"
        source={TOAST}
        props="tone title body action"
        role="The navy panel and radius are the terminal window's, so a toast reads as the product talking back."
        drawer={{ values: TOAST_VALUES, props: TOAST_PROPS, code: TOAST_CODE }}
      >
        <Anatomy pins={TOAST_PINS} ground="page" label="Toast anatomy">
          <div className={styles["ds-toast-col"]}>
            <Toast tone={INFO.tone} title={INFO.title} body={INFO.body} action={{ label: INFO.action ?? "" }} />
          </div>
        </Anatomy>
      </Spec>
      <Spec
        title="Tones"
        source={TOAST}
        props="tone"
        role="Each tone changes only the icon and its colour, lifted for navy, so the panel stays one shape for every outcome."
        caption="success, info, error, loading · in the flow with no timer"
      >
        <Canvas ground="page" label="Toast tones">
          <div className={styles["ds-toast-col"]}>
            {TOAST_TONES.map((t) => (
              <Toast
                key={t.tone}
                tone={t.tone}
                title={t.title}
                body={t.body}
                action={t.action ? { label: t.action } : undefined}
              />
            ))}
          </div>
        </Canvas>
      </Spec>
      <Spec
        title="Stack"
        source={STACK}
        props="items expanded"
        role="Three at most, the newest in front, so a burst of outcomes stays one object at the edge of the screen."
        caption="hover the first stack to fan it out · the second is held fanned"
      >
        <Canvas ground="page" label="Toast stack, tucked">
          <Item label="tucked · older 8 up at 0.96">
            <div className={styles["ds-toast-col"]}>
              <ToastStack items={TOAST_TRIO} live={false} />
            </div>
          </Item>
        </Canvas>
        <Canvas ground="page" label="Toast stack, fanned">
          <Item label="fanned · 8 apart, timers held">
            <div className={styles["ds-toast-col"]}>
              <ToastStack items={TOAST_TRIO} live={false} expanded />
            </div>
          </Item>
        </Canvas>
      </Spec>
      <Spec
        title="Control states"
        source={TOAST}
        props="forceAction forceClose"
        role="Both controls lift to white on hover and take the dark ring, because the accent ring would vanish on navy."
      >
        <StateGrid
          label="Toast control states"
          states={TOAST_CONTROL_STATES}
          variants={TOAST_CONTROLS}
          minCell={300}
          render={({ variant, force }) => (
            <div className={styles["ds-toast-col"]}>
              <Toast
                tone="error"
                title="The answer did not load"
                action={{ label: "Try again" }}
                forceAction={variant === "action" ? force : undefined}
                forceClose={variant === "close" ? force : undefined}
              />
            </div>
          )}
        />
      </Spec>
      <Spec
        title="Life"
        source={{ from: "@/components/design-system/toast-store", name: "lifeOf", file: "toast-store.ts" }}
        role="An action buys time to reach it, and an error waits for the visitor, because it may need them."
        caption="hover or focus inside the stack holds every clock"
      >
        <Timeline label="Toast life" axisLabel="from the toast's arrival" lanes={TOAST_LIFE} />
      </Spec>
      <Spec
        title="Live"
        source={TOASTER}
        role="These fire real toasts into the guide's one Toaster, with the polite and alert regions a screen reader hears."
      >
        <Canvas ground="page" label="Fire a toast">
          <ToastLive />
        </Canvas>
      </Spec>
      <Spec
        title="Placement"
        source={TOASTER}
        role="On phones the stack spans the width and rises above BackToTop's disc, so neither covers the other."
        caption="the real Toaster and BackToTop in a frame"
      >
        <Canvas ground="container" layout="stack">
          <ViewportPreview part="toast-stack" title="Toast stack beside BackToTop" height={420} widths={[375, 768, 1280]} />
        </Canvas>
      </Spec>
      <DoDont>
        <Do reason="A toast confirms what the visitor just did, so a few words are enough and nothing waits on it." ground="page">
          <div className={styles["ds-toast-col"]}>
            <Toast tone="success" title="Link copied" />
          </div>
        </Do>
        <Dont reason="A step the visitor must take before going on can be missed at the screen's edge, so it belongs in a dialog.">
          <div className={styles["ds-toast-col"]}>
            <Toast tone="error" title="Your session ended" body="Sign in again to keep your work." action={{ label: "Sign in" }} />
          </div>
        </Dont>
      </DoDont>
    </Section>
  );
}
