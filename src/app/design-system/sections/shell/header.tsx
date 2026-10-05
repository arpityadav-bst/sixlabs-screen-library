import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section, SectionLink } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { Button } from "@/components/design-system/Button";
import { PrimaryCta } from "@/components/website/PrimaryCta";
import * as D from "./header-data";
import { Cell, Shot, Shots } from "./shell-common";

const SRC = { from: "@/components/website/Header", name: "Header" };

export function HeaderSection() {
  return (
    <Section
      id="header"
      lead="The fixed bar on both pages: one size, two variants and four grounds. Its states come from the window, so every specimen here is the real Header in a frame of its own."
    >
      <Spec
        title="Header"
        source={{ ...SRC, line: 49 }}
        props="clear"
        role="The lockup, four tabs and one outlined Sign in on a near-opaque strip of the page, so sections show faintly as they pass under."
        caption={D.HEADER_STRIP[0].label}
        note="Switch the width: below 768 the tabs and the language leave the bar and the menu button takes their place."
        drawer={{ values: D.HEADER_VALUES, props: D.HEADER_PROPS, code: D.HEADER_CODE }}
      >
        <Anatomy frame layout="stack" ground="container" pins={D.HEADER_PINS} label="Header anatomy">
          <ViewportPreview part="header-rest" title="Header at rest" height={96} widths={[375, 768, 1024, 1280, 1440]} />
        </Anatomy>
      </Spec>

      <Spec
        title="Grounds"
        source={{ ...SRC, line: 55 }}
        role="The ground answers what is under the bar: the page, the tile floor, or the accent water once it has filled the view."
      >
        <Canvas ground="container" layout="stack" label="Header grounds at 1280">
          {D.HEADER_STRIP.slice(1).map((r) => (
            <Shot key={r.part} label={r.label}>
              <ViewportPreview part={r.part} title={r.title} height={96} widths={[1280]} />
            </Shot>
          ))}
        </Canvas>
        <KeyRows label="What flips the bar" rows={D.HEADER_TRIGGERS} />
      </Spec>

      <Spec
        title="On a phone"
        source={{ ...SRC, line: 53 }}
        role="On a phone the bar keeps the lockup, a smaller Sign in and the menu button, and the rest moves into the sheet."
      >
        <Canvas ground="page" label="Header at 375">
          <Shots>
            {D.PHONE_STRIP.map((r) => (
              <Shot key={r.title} label={r.label}>
                <ViewportPreview part={r.part} title={r.title} height={96} widths={[375]} />
              </Shot>
            ))}
          </Shots>
        </Canvas>
      </Spec>

      <Spec
        title="Tabs and Sign in"
        source={{ ...SRC, line: 82 }}
        role="Tabs turn accent on hover and Sign in fills faintly, so the bar answers the pointer without outbidding the hero's Try now."
        note={
          <>
            Neither has a focus ring or a current state yet. <SectionLink id="gaps" /> tracks the missing focus.
          </>
        }
      >
        <StateGrid
          label="Header controls, live"
          states={[]}
          liveCaption="hover the tabs or Sign in"
          render={() => (
            <Cell>
              <ViewportPreview
                part="header-rest"
                title="Header controls"
                interactive
                height={96}
                widths={[1280]}
                crop={{ x: 560, y: 0, width: 720, height: 80 }}
              />
            </Cell>
          )}
        />
        <KeyRows label="Control states" rows={D.HEADER_CONTROL_STATES} />
      </Spec>

      <DoDont>
        <Do
          reason="Sign in stays outlined, so the hero's Try now is the only solid pill in the first view. Drawn as the system Button md, the bar's replacement."
          ground="page"
        >
          <Button variant="secondary" size="md">Sign in</Button>
          <PrimaryCta>Try now</PrimaryCta>
        </Do>
        <Dont reason="A solid Sign in in the bar competes with Try now, and the visitor reads two offers." ground="page">
          <Button variant="primary" size="md">Sign in</Button>
          <PrimaryCta>Try now</PrimaryCta>
        </Dont>
      </DoDont>
    </Section>
  );
}
