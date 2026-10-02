"use client";

// The system TextLink in the three lines the site sets links in, its anatomy, its states and its forms.
// Client, so a press is held here instead of jumping the guide (the shipped pages hold theirs with
// ClickLock).
import type { MouseEvent, ReactNode } from "react";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { Button } from "@/components/design-system/Button";
import type { ForceState } from "@/components/design-system/force";
import { TextLink, type TextLinkTone } from "@/components/design-system/TextLink";
import { typeStyle } from "@/components/design-system/tokens";
import { LINE_COPY, LINK_CODE, LINK_PINS, LINK_PROPS, LINK_STATES, LINK_TONES, LINK_VALUES } from "./text-link-data";

const SOURCE = { from: "@/components/design-system/TextLink", name: "TextLink" };
const hold = (e: MouseEvent<HTMLAnchorElement>) => e.preventDefault();

/** A line of copy in a type role and a text colour token, the context a link sits in. */
function Line({ role, color, children }: { role: string; color: string; children: ReactNode }) {
  return (
    <p style={{ ...typeStyle(role), color: `var(--ds-${color})`, margin: 0, maxWidth: 440 }}>{children}</p>
  );
}

export function TextLinkLines() {
  return (
    <Spec
      title="In a line"
      source={SOURCE}
      props="tone"
      role="The underline marks the link without colour, so it reads in grey body copy and to a reader who cannot see hue."
      caption="inherit in the 15px lede · ink in the 13.5px closing line · muted in the 13px footer"
      drawer={{ values: LINK_VALUES, props: LINK_PROPS, code: LINK_CODE }}
    >
      <Canvas ground="container" label="Inherit tone in the lede">
        <Line role="lede" color="color-text-body">
          {LINE_COPY.lede}{" "}
          <TextLink href="#jobs" onClick={hold}>
            {LINE_COPY.ledeLink}
          </TextLink>
        </Line>
      </Canvas>
      <Canvas ground="page" label="Ink tone in the closing line">
        <Line role="caption-l" color="color-text-muted">
          {LINE_COPY.closing}{" "}
          <TextLink href="#sign-in" tone="ink" onClick={hold}>
            {LINE_COPY.closingLink}
          </TextLink>
        </Line>
      </Canvas>
      <Canvas ground="footer" label="Muted tone in the footer line">
        <Line role="caption" color="color-text-muted">
          {LINE_COPY.legal.map((t, k) => (
            <span key={t}>
              {k > 0 && " · "}
              <TextLink href="#legal" tone="muted" onClick={hold}>
                {t}
              </TextLink>
            </span>
          ))}
        </Line>
      </Canvas>
    </Spec>
  );
}

export function TextLinkAnatomy() {
  return (
    <Spec
      title="Anatomy"
      source={SOURCE}
      props="arrow external"
      role="Glyphs ride the baseline at 14 whatever the line's size, so an arrow never outweighs the words it follows."
    >
      <Anatomy pins={LINK_PINS} label="Text link anatomy">
        <span data-pin="link">
          <Line role="body-l" color="color-text-body">
            <TextLink href="#jobs" onClick={hold}>
              {LINE_COPY.ledeLink}
            </TextLink>
          </Line>
        </span>
        <span data-pin="arrow">
          <Line role="body-l" color="color-ink">
            <TextLink href="#jobs" arrow onClick={hold}>
              {LINE_COPY.ledeLink}
            </TextLink>
          </Line>
        </span>
        <span data-pin="external">
          <Line role="body-l" color="color-ink">
            <TextLink href="https://example.com" external onClick={hold}>
              External link
            </TextLink>
          </Line>
        </span>
      </Anatomy>
    </Spec>
  );
}

const TONE_GROUND: Record<TextLinkTone, string> = {
  inherit: "color-text-body",
  ink: "color-text-muted",
  muted: "color-text-muted",
};

export function TextLinkStates() {
  return (
    <Spec
      title="States"
      source={SOURCE}
      props="tone forceState"
      role="Hover turns text and underline accent together over 300ms, and a visited link stays as it was."
      caption="caption-l line · a press thickens the underline to 2px · visited is drawn as rest on purpose"
    >
      <StateGrid
        label="Text link states"
        states={LINK_STATES}
        variants={LINK_TONES}
        minCell={140}
        render={({ variant, force }) => (
          <Line role="caption-l" color={TONE_GROUND[variant]}>
            <TextLink
              href="#sign-in"
              tone={variant}
              onClick={hold}
              forceState={force === "visited" ? undefined : (force as ForceState | undefined)}
            >
              {LINE_COPY.closingLink}
            </TextLink>
          </Line>
        )}
      />
    </Spec>
  );
}

export function TextLinkForms() {
  return (
    <Spec
      title="Arrow and external"
      source={SOURCE}
      props="arrow external"
      role="The arrow leads on to more of the page, the corner arrow says a new tab will open, and only one rides a link."
    >
      <Canvas ground="page" label="Link forms">
        <Item label="plain">
          <Line role="body-l" color="color-text-body">
            <TextLink href="#jobs" onClick={hold}>
              {LINE_COPY.ledeLink}
            </TextLink>
          </Line>
        </Item>
        <Item label="arrow · moves 2px on hover">
          <Line role="body-l" color="color-ink">
            <TextLink href="#jobs" arrow onClick={hold}>
              {LINE_COPY.ledeLink}
            </TextLink>
          </Line>
        </Item>
        <Item label="external · new tab">
          <Line role="body-l" color="color-ink">
            <TextLink href="https://example.com" external onClick={hold}>
              External link
            </TextLink>
          </Line>
        </Item>
      </Canvas>
    </Spec>
  );
}

export function TextLinkDecisions() {
  return (
    <DoDont>
      <Do reason="Starting something is a Button, so the call to action keeps its weight and a target a thumb can find.">
        <Button>Try now</Button>
      </Do>
      <Dont reason="A lone link as the call to action is a 20px target that reads as a footnote to the page.">
        <Line role="body-l" color="color-ink">
          <TextLink href="#try" arrow onClick={hold}>
            Try now
          </TextLink>
        </Line>
      </Dont>
    </DoDont>
  );
}
