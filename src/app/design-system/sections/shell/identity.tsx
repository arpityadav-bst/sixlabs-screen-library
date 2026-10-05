import type { CSSProperties } from "react";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { Section } from "@/app/design-system/_kit/Section";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { Lockup, LOCKUP_SIZES } from "@/components/design-system/Lockup";
import { ChatGptMark, SixLabsLogo, SixLabsMark } from "@/components/website/brand-marks";
import { Word } from "@/components/website/CopyLine";
import * as D from "./identity-data";
import s from "./shell.module.css";

const W = "@/components/website/";
const LOCKUP_SRC = { from: "@/components/design-system/Lockup", name: "Lockup" };
const LINK_STATES = ["rest", "hover", "focus-visible"] as const;
// literal classes per size, so the scanner sees each one
const MARK_CLASS: Record<(typeof D.MARKS_LADDER)[number]["px"], string> = { 16: "h-4 w-4", 36: "h-9 w-9", 44: "h-11 w-11", 64: "h-16 w-16" };
// hover is rest by design (Lockup's forceState), so its column says none, as the Button and Chip grids do
const NONE = <span className="ds-label">none</span>;
const clear = (px: number) => ({ "--ds-clear": `${px}px` }) as CSSProperties;

export function IdentitySection() {
  const md = LOCKUP_SIZES.md;
  return (
    <Section
      id="identity"
      lead="One mark and one wordmark, joined as a lockup at three sizes and two tones. The blades keep the logo's own blue and the 6 takes the interface accent."
    >
      <Spec
        title="Header lockup"
        source={{ from: `${W}Header`, name: "Header", line: 64 }}
        role="Every lockup size scales from the header's, so it is measured where it ships, inside the real bar."
      >
        <Anatomy frame layout="stack" ground="page" pins={D.SHIPPED_LOCKUP_PINS} gutter={56} label="Header lockup anatomy">
          <ViewportPreview
            part="header-rest"
            title="The header's lockup"
            height={96}
            widths={[1280]}
            crop={{ x: 0, y: 0, width: 220, height: 80 }}
          />
        </Anatomy>
      </Spec>

      <Spec
        title="Lockup"
        source={LOCKUP_SRC}
        props="size tone suffix href"
        role="The one lockup part, so a page never rebuilds the mark and the wordmark by hand at a size of its own."
        drawer={{ values: D.LOCKUP_VALUES, props: D.LOCKUP_PROPS, code: D.LOCKUP_CODE }}
      >
        <Anatomy ground="page" pins={D.LOCKUP_PINS} gutter={56} label="Lockup anatomy">
          <Lockup size="lg" />
        </Anatomy>
      </Spec>

      <Spec title="Lockup sizes" source={LOCKUP_SRC} props="size" role="Three sizes on one ratio, the mark leading the line height, so sm and lg read as the header's lockup scaled.">
        <SizeLadder
          label="Lockup sizes"
          sizes={D.LOCKUP_LADDER.map((r) => ({
            name: r.name,
            spec: r.spec,
            select: "[data-lockup-mark]",
            node: <Lockup size={r.name} />,
          }))}
        />
      </Spec>

      <Spec
        title="Tones and clear space"
        source={LOCKUP_SRC}
        props="tone"
        role="Clear space is the core circle's width on every side, which keeps the lockup off the bar's edge and any neighbour."
        caption={`dashed box · clear space ${md.clear} at md · minimum mark 20`}
      >
        <Canvas ground="page" label="Ink on the page">
          <span className={s["ds-clear"]} style={clear(md.clear)}>
            <Lockup />
          </span>
          <span className={s["ds-clear"]} style={clear(md.clear)}>
            <Lockup suffix=".ai" />
          </span>
        </Canvas>
        <Canvas ground="container" label="Ink on the container">
          <span className={s["ds-clear"]} style={clear(md.clear)}>
            <Lockup />
          </span>
        </Canvas>
        <Canvas ground="on-blue" label="White on the accent water">
          <span className={`${s["ds-clear"]} ${s["ds-clear-inverse"]}`} style={clear(md.clear)}>
            <Lockup tone="onBlue" />
          </span>
        </Canvas>
      </Spec>

      <Spec
        title="Lockup link"
        source={LOCKUP_SRC}
        props="href forceState"
        role="Hover leaves the lockup as it is, because it is a way home rather than an offer. Focus shows the ring of its ground."
      >
        <StateGrid
          label="Lockup link states, ink"
          states={LINK_STATES}
          render={({ force }) => (force === "hover" ? NONE : <Lockup href="#identity" forceState={force} />)}
        />
        <StateGrid
          label="Lockup link states, on blue"
          ground="on-blue"
          states={LINK_STATES}
          render={({ force }) => (force === "hover" ? NONE : <Lockup href="#identity" tone="onBlue" forceState={force} />)}
        />
      </Spec>

      <Spec
        title="Wordmark"
        source={{ from: `${W}CopyLine`, name: "Word", line: 50 }}
        props="plain"
        role="The wordmark is text in Outfit, so it takes the type around it and stays sharp at any size."
        drawer={{ values: D.WORD_VALUES, props: D.WORD_PROPS }}
      >
        <Canvas ground="page">
          <Item label="Word · 24">
            <span className={`${s["ds-word"]} ${s["ds-word-24"]}`}><Word /></span>
          </Item>
          <Item label="Word plain · 24">
            <span className={`${s["ds-word"]} ${s["ds-word-24"]}`}><Word plain /></span>
          </Item>
          <Item label="Word · 56">
            <span className={`${s["ds-word"]} ${s["ds-word-56"]}`}><Word /></span>
          </Item>
          <Item label="Word plain · 56">
            <span className={`${s["ds-word"]} ${s["ds-word-56"]}`}><Word plain /></span>
          </Item>
        </Canvas>
      </Spec>

      <Spec
        title="Logo"
        source={{ from: `${W}brand-marks`, name: "SixLabsLogo", line: 69 }}
        props="fade"
        role="The logo file's own fills, flat or fading down its last 40% in gradients, so the footer's crest needs no mask."
        drawer={{ values: D.LOGO_VALUES, props: D.LOGO_PROPS }}
      >
        <Canvas ground="page">
          <Item label="flat · 96">
            <SixLabsLogo className="h-24 w-24" />
          </Item>
          <Item label="fade · 96">
            <SixLabsLogo className="h-24 w-24" fade />
          </Item>
        </Canvas>
      </Spec>

      <Spec
        title="Line marks"
        source={{ from: `${W}brand-marks`, name: "SixLabsMark", line: 29 }}
        chips={["ChatGptMark"]}
        props="className"
        role="The mark redrawn in outline at the ChatGPT mark's weight, so the comparison cards read as one icon set."
        note="ChatGptMark is OpenAI's mark, from Simple Icons. It names the model a card compares against and never stands for 6labs."
        drawer={{ values: D.MARKS_VALUES, code: D.MARKS_CODE }}
      >
        <SizeLadder
          label="Line marks at 16, 36, 44 and 64"
          sizes={D.MARKS_LADDER.map(({ px, name }) => ({
            name,
            spec: px,
            select: "svg",
            node: (
              <span className={s["ds-pair"]}>
                <SixLabsMark className={MARK_CLASS[px]} />
                <ChatGptMark className={MARK_CLASS[px]} />
              </span>
            ),
          }))}
        />
      </Spec>

      <DoDont>
        <Do reason="The ink lockup sits on the light grounds, where the blades and the navy core both hold." ground="page">
          <Lockup />
        </Do>
        <Dont reason="The flat blades are #1770EF, a step off the #1a6dff water, so on the water only the core is left." ground="on-blue">
          <SixLabsLogo className="h-16 w-16" />
        </Dont>
      </DoDont>
    </Section>
  );
}
