// Focus: the site's own controls live first (they set no focus style), then the ring drawn out, its tones
// by ground, its card, scroll-row and field forms, the SkipLink, and two decisions. Values live in
// focus-data.ts.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { ContrastBadge } from "@/app/design-system/_kit/ContrastBadge";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { contrastRatio, formatRatio, groundColor } from "@/app/design-system/_kit/contrast";
import { Button } from "@/components/design-system/Button";
import { SkipLink } from "@/components/design-system/SkipLink";
import { TextInput } from "@/components/design-system/TextInput";
import { tokenByName } from "@/components/design-system/tokens";
import {
  LIVE_VALUES,
  RING,
  RING_CODE,
  RING_CONTRAST,
  RING_PINS,
  RING_PROPS,
  RING_VALUES,
  SKIP_CODE,
  SKIP_PINS,
  SKIP_PROPS,
  SKIP_STATES,
  SKIP_VALUES,
} from "./focus-data";
import { LiveStrip } from "./focus-live";
import { FocusedCard, RingPill, RingProbe, ScrollRow } from "./focus-samples";
import { ToneStrip } from "./focus-strip";
import styles from "./focus.module.css";

const ACCENT = tokenByName("color-accent")?.value ?? "";
const TERMINAL = tokenByName("color-terminal-bg")?.value ?? "";
const ratio = (fg: string, bg: string) => formatRatio(contrastRatio(fg, groundColor(bg)) ?? 0);

const TONE_CAPTION =
  `accent ${ratio(RING.light, "page")} on page · ${ratio(RING.light, "container")} on container · ` +
  `white ${ratio(RING.inverse, ACCENT)} on accent · ${RING.dark} ${ratio(RING.dark, TERMINAL)} on terminal`;

function RingContrast() {
  return (
    <div>
      <h5 className="ds-h4">Ring contrast, 3:1 needed</h5>
      <span className="ds-cb-row">
        {RING_CONTRAST.map((c) => (
          <ContrastBadge key={`${c.fg}-${c.bg}`} fg={c.fg} bg={c.bg} bgName={c.bgName} />
        ))}
      </span>
    </div>
  );
}

export function FocusSection() {
  return (
    <Section
      id="focus"
      lead="One keyboard focus ring for every interactive part. The site ships none, so the system supplies it."
    >
      <Sub title="As shipped">
        <Spec
          title="The site's controls"
          level={4}
          source={{ from: "@/components/website/PrimaryCta", name: "PrimaryCta", at: "<motion.button" }}
          chips={["WaveButton", "LanguageMenu", "ModeToggle", "Faq"]}
          role="Tab through the live parts: each shows whatever ring the browser draws, because the site sets none."
          note="No focus or outline class appears in src/components/website, so the ring differs by browser."
          drawer={{ values: LIVE_VALUES }}
        >
          <LiveStrip />
          <Canvas layout="stack" label="FAQ row, live in a frame">
            <ViewportPreview part="section-faq" title="FAQ rows" height={240} widths={[1280]} scrollTo="#faq ul" interactive />
          </Canvas>
        </Spec>
      </Sub>

      <Sub title="The ring">
        <Spec
          title="Ring"
          level={4}
          source={{ from: "@/components/design-system/focus", name: "FOCUS", file: "focus.ts" }}
          props="tone"
          role="A 2px line outside the border box, 2px off its edge, so the ground shows between ring and fill."
          drawer={{ values: RING_VALUES, props: RING_PROPS, code: RING_CODE, children: <RingContrast /> }}
        >
          <Anatomy pins={RING_PINS} label="The focus ring">
            <RingProbe>
              <Button variant="primary" forceState="focus">
                Request access
              </Button>
            </RingProbe>
          </Anatomy>
        </Spec>
      </Sub>

      <Sub title="Tones and forms">
        <Spec
          title="Tones by ground"
          level={4}
          source={{ from: "@/components/design-system/focus", name: "focusRing", file: "focus.ts" }}
          props="tone"
          role="The ring takes its colour from the ground: accent on light, white on the accent water, a lifted blue on dark."
          caption={TONE_CAPTION}
        >
          <ToneStrip />
        </Spec>
        <Spec
          title="Cards, scroll rows and fields"
          level={4}
          source={{ from: "@/components/design-system/focus", name: "FOCUS_CARD", file: "focus.ts" }}
          props="FOCUS_CARD FOCUS_INSET FIELD_FOCUS"
          role="Cards sit 3px inside the ring, scroll rows draw it inside the box, and fields trade it for a halo."
        >
          <Canvas label="Ring forms">
            <div className={styles["ds-focus-row"]}>
              <Item label="card · offset 3">
                <FocusedCard />
              </Item>
              <Item label="scroll row · offset -2">
                <ScrollRow inset />
              </Item>
              <Item label="field · 3px halo, no outline">
                <div className={styles["ds-field-box"]}>
                  <TextInput label="Work email" placeholder="you@studio.com" forceState="focus" />
                </div>
              </Item>
            </div>
          </Canvas>
        </Spec>
      </Sub>

      <Sub title="Skip link">
        <Spec
          title="SkipLink"
          level={4}
          source={{ from: "@/components/design-system/SkipLink", name: "SkipLink" }}
          props="href inline forceState"
          role="The first Tab stop, shown only while it holds focus, so a keyboard visitor clears the header in one press."
          drawer={{ values: SKIP_VALUES, props: SKIP_PROPS, code: SKIP_CODE }}
        >
          <Anatomy pins={SKIP_PINS} layout="stack" label="Skip link pinned to the window's corner">
            <div className={styles["ds-pin-stage"]}>
              <SkipLink forceState="focus" />
            </div>
          </Anatomy>
          <StateGrid
            label="Skip link states"
            states={SKIP_STATES}
            render={({ force }) => <SkipLink inline forceState={force} />}
            liveCaption="Tab here, then hover or press it"
          />
        </Spec>
      </Sub>

      <DoDont>
        <Do ground="on-blue" reason={`White on the accent measures ${ratio(RING.inverse, ACCENT)}:1, so focus stands clear of the water.`}>
          <Button variant="inverse" forceState="focus">
            Request access
          </Button>
        </Do>
        <Dont ground="on-blue" reason="The accent ring on the water measures 1:1 and disappears.">
          <RingPill on="dark">Request access</RingPill>
        </Dont>
      </DoDont>
      <DoDont>
        <Do reason="Drawn inside the box, the ring survives the row's overflow on all four sides.">
          <ScrollRow inset />
        </Do>
        <Dont reason="An outer ring on a card in a scroll row loses its top, bottom and left edges to the overflow.">
          <ScrollRow inset={false} />
        </Dont>
      </DoDont>
    </Section>
  );
}
