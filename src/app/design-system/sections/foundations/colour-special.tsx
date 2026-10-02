// Special palettes: the colours that belong to one context, each shown on the ground it ships on. The white
// ladder on the blue (with the real switch and trait bars under pins), the terminal window, the glows and
// fringes, the floor scene read live from its params, the spent tint's three values and the logo's fills.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Item, Label } from "@/app/design-system/_kit/Label";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SwatchGrid, TokenSwatch } from "@/app/design-system/_kit/TokenSwatch";
import { contrastRatio, formatRatio } from "@/app/design-system/_kit/contrast";
import { BRAND, HOLOGRAM, ON_BLUE, TERMINAL, cssVar, typeStyle } from "@/components/design-system/tokens";
import { SixLabsLogo } from "@/components/website/brand-marks";
import { Word } from "@/components/website/CopyLine";
import { groupCaption, groupCode, groupSource, swatchOf, valueRows } from "./colour-kit";
import { AnswerOffTerminal, LogoBlueInUi, OnBlueOffBlue } from "./colour-special-dodont";
import {
  BRAND_PAIRS,
  BRAND_PINS,
  FRINGE_FIELD,
  FRINGE_FOOT,
  GLOW_ITEMS,
  GLOW_TOKENS,
  ON_BLUE_ITEMS,
  ON_BLUE_PINS,
  RUN_LINES,
  SPENT_TINTS,
  TERMINAL_ITEMS,
} from "./colour-special-data";
import { FloorPalette } from "./colour-special-floor";
import { OnBlueUses } from "./colour-special-onblue";
import { Sample, Strip } from "./colour-strip";
import s from "./colour.module.css";
import { UseTable } from "./token-use";

const apart = (a: string, b: string) => {
  const r = contrastRatio(a, b);
  return r === null ? "unreadable" : `${formatRatio(r)}:1`;
};

export function ColourSpecialSection() {
  return (
    <Section
      id="colour-special"
      lead="Colours that belong to one context and stay there: the white ladder on the blue, the terminal window, the glows and fringes, the floor scene and the logo's own fills."
    >
      <Sub title="On the accent blue">
        <Spec
          title="White ladder on blue"
          level={4}
          source={groupSource("ON_BLUE", "token-palettes.ts")}
          chips={["ModeToggle", "PlayerTraits"]}
          role="White at seven strengths does every job on the blue and the quiet ones on navy, from 80% body copy to a 15% glass fill."
          caption={groupCaption(ON_BLUE)}
          drawer={{ values: valueRows(ON_BLUE), code: groupCode("ON_BLUE", ON_BLUE[0]), children: <UseTable tokens={ON_BLUE} files level={4} /> }}
        >
          <Canvas ground="on-blue" label="White ladder on the blue">
            <Strip label="White ladder" items={ON_BLUE_ITEMS} />
          </Canvas>
          <Anatomy ground="on-blue" pins={ON_BLUE_PINS} label="The ladder on the real switch and trait bars">
            <OnBlueUses />
          </Anatomy>
        </Spec>
        <OnBlueOffBlue />
      </Sub>

      <Sub title="The terminal window">
        <Spec
          title="Terminal palette"
          level={4}
          source={groupSource("TERMINAL", "token-palettes.ts")}
          chips={["JobTerminal"]}
          role="The jobs terminal keeps its own dark palette, with the accent lifted so the run's one answer reads on the dark."
          caption={groupCaption(TERMINAL)}
          drawer={{ values: valueRows(TERMINAL), code: groupCode("TERMINAL", TERMINAL[0]), children: <UseTable tokens={TERMINAL} files level={4} /> }}
        >
          <Canvas ground="terminal" layout="stack" label="Terminal palette">
            <Strip label="Terminal palette" items={TERMINAL_ITEMS} />
            <p className={s["ds-col-term"]}>
              {RUN_LINES.map((l) => (
                <span key={l.token} style={{ color: cssVar(l.token) }}>
                  {l.text}
                </span>
              ))}
            </p>
          </Canvas>
        </Spec>
        <AnswerOffTerminal />
      </Sub>

      <Sub title="Holograms, glows and fringes">
        <Spec
          title="Glow and fringe"
          level={4}
          source={groupSource("HOLOGRAM", "token-palettes.ts")}
          role="Light colours drawn by canvas and WebGL effects, each shown on the dark or light ground it glows over."
          caption={groupCaption(GLOW_TOKENS)}
          drawer={{ values: valueRows(GLOW_TOKENS), code: groupCode("HOLOGRAM", HOLOGRAM[0]), children: <UseTable tokens={GLOW_TOKENS} files level={4} /> }}
        >
          <Canvas ground="navy" label="Glows on dark">
            <Strip label="Glows on dark" items={GLOW_ITEMS} />
          </Canvas>
          <Canvas ground="footer" label="The wordmark's split on the footer">
            <Strip label="Footer wordmark split" items={FRINGE_FOOT} />
          </Canvas>
          <Canvas ground="page" label="Glyph field inks on the page">
            <Strip label="Glyph field inks" items={FRINGE_FIELD} />
          </Canvas>
          <SwatchGrid label="Glow and fringe tokens">
            {GLOW_TOKENS.map((t) => (
              <TokenSwatch key={t.name} {...swatchOf(t)} />
            ))}
          </SwatchGrid>
        </Spec>
      </Sub>

      <Sub title="The floor scene">
        <Spec
          title="Floor palette"
          level={4}
          source={{ from: "public/tiles/floor-params.json", file: "floor-params.json" }}
          chips={["src/tiles/floor.js", "materials.js", "halo.js"]}
          role="Each colour the floor scene lights itself with, by parameter name. They belong to the WebGL scene and never style a part."
        >
          <FloorPalette />
        </Spec>
        <Spec
          title="Spent tint, three values"
          level={4}
          source={{ from: "@/components/tiles/TileFloor", name: "TileFloor", file: "TileFloor.tsx" }}
          props="spentTint"
          role="Three files name the colour a used tile rests in, and only one of them reaches the screen."
          warn="Editing floor-params.json does not change the spent tint, because TileFloor's default prop always overrides it."
          drawer={{
            values: SPENT_TINTS.map((t) => ({ part: t.name, token: "spentTint", value: t.value, source: t.source })),
            props: [{ name: "spentTint", type: "string", default: SPENT_TINTS[0].value, note: "the colour a used tile rests in" }],
          }}
        >
          <SwatchGrid label="The three spent tints">
            {SPENT_TINTS.map((t) => (
              <TokenSwatch key={t.name} name={t.name} value={t.value} source={t.source} use={t.use} contrast={false} />
            ))}
          </SwatchGrid>
        </Spec>
      </Sub>

      <Sub title="The brand mark">
        <Spec
          title="Logo fills"
          level={4}
          source={{ from: "@/components/website/brand-marks", name: "SixLabsLogo" }}
          chips={["Word"]}
          role="The logo keeps the fills its file draws, a blue and a navy a hair off the accent and ink, which UI never borrows."
          caption={groupCaption(BRAND)}
          drawer={{ children: <UseTable tokens={BRAND} files level={4} />, values: valueRows(BRAND), code: 'import { SixLabsLogo } from "@/components/website/brand-marks";\n\n<SixLabsLogo className="h-16 w-16" />' }}
        >
          <Anatomy ground="page" pins={BRAND_PINS} label="The logo and wordmark">
            <span data-ds-logo="">
              <SixLabsLogo className="h-16 w-16" />
            </span>
            <span data-ds-word="" style={{ ...typeStyle("wordmark"), color: cssVar("color-ink") }}>
              <Word />
            </span>
          </Anatomy>
          <Canvas ground="surface" label="Logo fills beside the UI colours">
            <div className={s["ds-col-pair"]}>
              {BRAND_PAIRS.map(({ logo, ui, mode }) => (
                <Item key={logo.name} label={`${logo.name} to ${ui.name}: ${apart(logo.value, ui.value)}`}>
                  <span className={s["ds-col-duo"]}>
                    <Sample value={logo.value} mode={mode} />
                    <Sample value={ui.value} mode={mode} />
                  </span>
                </Item>
              ))}
            </div>
            <Label>left the logo, right the UI role</Label>
          </Canvas>
        </Spec>
        <LogoBlueInUi />
      </Sub>
    </Section>
  );
}
