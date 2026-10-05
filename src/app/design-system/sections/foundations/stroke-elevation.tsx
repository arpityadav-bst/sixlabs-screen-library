// Stroke and elevation: the hairline ladder on each ground it ships on with its contrast against that
// ground, the border widths and their one job each, the shadow ladder on the page and on blue, and the
// caret glow on the container it ships on, with both accent glows in the drawer.
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { contrastRatio, formatRatio } from "@/app/design-system/_kit/contrast";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { Replay } from "@/app/design-system/_kit/Replay";
import { Section, SectionLink } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { ICON_STROKE, cssVar, type Token } from "@/components/design-system/tokens";
import { TypedWord } from "@/components/website/TypedWord";
import { ArrowUp } from "lucide-react";
import {
  BLACK_FLOAT, BLUE_SHADOWS, CARD_COPY, CARD_LIFT, CARET_LINE, ELEVATION_CODE, FLAT, GLOW_VALUES, LIGHT_SHADOWS,
  LINE_GROUNDS, LINE_VALUES, SHADOW_VALUES, STROKES, STROKE_VALUES, lineColor,
} from "./elevation-data";
import e from "./elevation.module.css";
import { check } from "./foundation-scan";
import { UseTable } from "./token-use";
import { roleOf } from "./type-data";

const TOKENS = { from: "@/components/design-system/tokens", file: "token-shape.ts" };

function Tile({ t }: { t: Token }) {
  return (
    <Item label={`${t.name} · ${t.useFor}`}>
      <div className={e["ds-tile"]} style={{ boxShadow: cssVar(t.name) }} />
    </Item>
  );
}

function Card({ line, shadow }: { line?: boolean; shadow?: string }) {
  return (
    <div className={`${e["ds-card"]} ${line ? e["ds-card--line"] : ""}`} style={shadow ? { boxShadow: shadow } : undefined}>
      <p className={`${roleOf("card-title").classes} ${e["ds-card-title"]}`}>{CARD_COPY.title}</p>
      <p className={`${roleOf("body-s").classes} ${e["ds-card-body"]}`}>{CARD_COPY.body}</p>
    </div>
  );
}

function Float({ shadow }: { shadow: string }) {
  return (
    <span className={e["ds-float"]} style={{ boxShadow: shadow }}>
      <ArrowUp size={18} strokeWidth={ICON_STROKE[18]} aria-hidden="true" />
    </span>
  );
}

export function ElevationSection() {
  return (
    <Section id="elevation" lead="Lines, border widths, shadows and glows, each shown on the ground it ships on.">
      <Spec
        title="Hairlines"
        source={{ ...TOKENS, name: "LINES", file: "token-colour.ts" }}
        role="Borders carry the structure on light grounds, and only the field line is dark enough to mark a control by itself."
        caption="contrast against the canvas ground, 3:1 is the bar for a control's edge"
        drawer={{ values: LINE_VALUES }}
      >
        {LINE_GROUNDS.map((g) => (
          <Canvas key={g.ground} ground={g.ground} label={`Hairlines on ${g.ground}`}>
            {g.lines.map((t) => {
              const r = contrastRatio(lineColor(t), g.hex) ?? 0;
              return (
                <div
                  key={t.name}
                  className={`${e["ds-line"]} ${g.ground === "terminal" ? e["ds-line--dark"] : ""}`}
                  style={{ border: `1px solid ${cssVar(t.name)}` }}
                >
                  <b>{t.name}</b>
                  <span className={r >= 3 ? e["ds-line-pass"] : undefined}>
                    {formatRatio(r)}:1 on {g.ground}
                    {r >= 3 ? ", meets 3:1" : ""}
                  </span>
                </div>
              );
            })}
          </Canvas>
        ))}
      </Spec>

      <Spec
        title="Border widths"
        source={{ ...TOKENS, name: "STROKE" }}
        role="One pixel is the border everywhere, and each heavier stroke has a single job, so a thick line always means something."
        caption={
          <>
            stroke-ring-vs drawn alone, the page-colour ring with its centre open · the live vs disc it rings is in{" "}
            <SectionLink id="comparison" />
          </>
        }
        drawer={{ values: STROKE_VALUES, children: <UseTable tokens={STROKES} /> }}
      >
        <Canvas ground="container" label="Stroke widths">
          {STROKES.map((t) => (
            <Item key={t.name} label={`${t.name} · ${t.value}`}>
              {t.name === "stroke-ring-vs" ? (
                <span className={e["ds-ring"]} style={{ borderWidth: cssVar(t.name) }} />
              ) : (
                <span className={e["ds-stroke"]} style={{ height: cssVar(t.name) }} />
              )}
            </Item>
          ))}
        </Canvas>
      </Spec>

      <Spec
        title="Elevation"
        source={{ ...TOKENS, name: "SHADOW" }}
        role="Shadows mark what sits above the page, and all but the hero container's use the ink navy so depth reads as the page's own shade."
        drawer={{ values: SHADOW_VALUES, code: ELEVATION_CODE }}
        note={
          <>
            <p>
              On light grounds the system Card takes shadow-lift on hover through its lift prop ({check(CARD_LIFT).at}),
              so a clickable card rises as the player cards do on the water.
            </p>
            <p>
              Which surface sits above which is the z-scale&apos;s job, set out in <SectionLink id="layer-stack" />.
            </p>
          </>
        }
      >
        <Canvas ground="page" label="Shadows on the page" style={{ gap: 40 }}>
          <Item label={`${FLAT.name} · ${FLAT.use}`}>
            <div className={`${e["ds-tile"]} ${e["ds-tile--flat"]}`} />
          </Item>
          {LIGHT_SHADOWS.map((t) => (
            <Tile key={t.name} t={t} />
          ))}
        </Canvas>
        <Canvas ground="on-blue" label="Shadows on blue" style={{ gap: 40 }}>
          {BLUE_SHADOWS.map((t) => (
            <Tile key={t.name} t={t} />
          ))}
        </Canvas>
      </Spec>

      <Spec
        title="Glows"
        source={{ ...TOKENS, name: "SHADOW" }}
        chips={["TypedWord"]}
        role="The accent glows are light rather than depth, so they sit apart from the shadow ladder and only the caret and the sheen take them."
        caption="glow-caret on the typed caret, on the container it ships on · glow-sheen has no CSS form, so it stays a value"
        drawer={{ values: GLOW_VALUES }}
      >
        <Canvas ground="container" label="The caret glow on the hero container">
          <Replay>
            <p className={`${roleOf("h2").classes} ${e["ds-glow-line"]}`}>
              {CARET_LINE.before} <TypedWord word={CARET_LINE.word} className="text-accent" onView /> {CARET_LINE.after}
            </p>
          </Replay>
        </Canvas>
      </Spec>

      <DoDont>
        <Do reason="On a light ground a hairline separates the card, so a shadow stays free to mean that something floats.">
          <Card line />
        </Do>
        <Dont reason="A resting shadow on a card in the flow says it floats, and the page loses its one signal for what does.">
          <Card shadow={cssVar("shadow-lift")} />
        </Dont>
      </DoDont>
      <DoDont>
        <Do reason="A button that floats over the page takes the float shadow, in the same navy as the type it sits beside.">
          <Float shadow={cssVar("shadow-float")} />
        </Do>
        <Dont reason="The same shadow in black goes grey on the light ground and reads as a smudge beside the navy icon.">
          <Float shadow={BLACK_FLOAT} />
        </Dont>
      </DoDont>
    </Section>
  );
}
