// Type: the three families, every role the site sets (rendered with the site's own class string,
// measured where it renders, and asserted against its source), the same roles at true widths in a
// frame, and the scale new work draws from.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section, SectionLink, Sub } from "@/app/design-system/_kit/Section";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { cssVar } from "@/components/design-system/tokens";
import { check } from "./foundation-scan";
import {
  BLUE_ROWS, DISPLAY_ROWS, FAMILY_CARDS, FAMILY_CODE, FAMILY_VALUES, FOOTER_ROW, FRAME_PINS, HERO_ROWS, HERO_TEXT_ROWS, MONO_ROWS,
  OFF_SCALE, ROLE_CODE, ROLE_COLUMNS, SCALE_CODE, SCALE_STEPS, SCALE_VALUES, TERMINAL_ROW, TEXT_ROWS, roleOf, roleTable,
  rowOf, type RoleRow,
} from "./type-data";
import { FamilyCard, TypeRows } from "./type-rows";
import t from "./type.module.css";
import { ReadAt } from "./viewport-read";

const TOKENS = { from: "@/components/design-system/tokens", name: "TYPE_ROLES", file: "token-type.ts" };

function roleDrawer(rows: readonly RoleRow[]) {
  return {
    code: ROLE_CODE,
    children: <SpecTable caption="Roles" columns={ROLE_COLUMNS} rows={roleTable(rows)} mono={[0, 1, 2, 3, 4, 6]} minWidth={760} />,
  };
}

const unused = FAMILY_CARDS.filter((f) => f.unused.length > 0).map((f) => `${f.name} ${f.unused.join(", ")}`);

export function TypeSection() {
  const meta = check(rowOf("card-meta").assert).at;
  return (
    <Section
      id="type"
      lead="Three families and the roles the site sets with them. Each specimen is set with the site's class string and measured where it renders."
    >
      <Spec
        title="Families"
        source={{ from: "@/app/layout", file: "layout.tsx", at: "const inter = Inter(" }}
        chips={["next/font/google"]}
        role="Outfit for display and names, Inter for reading, JetBrains Mono for machine text, so the face alone says what kind of line it is."
        drawer={{ values: FAMILY_VALUES, code: FAMILY_CODE }}
        note={
          <>
            <p>Loaded and never set: {unused.join(" and ")}. Each costs a font file and draws no glyph.</p>
            <p>
              font-mono on the player cards ({meta}) is Tailwind&apos;s system mono, not JetBrains Mono. Machine text takes
              --ds-font-mono. <SectionLink id="gaps" /> tracks the fallback.
            </p>
          </>
        }
      >
        <Canvas ground="page" layout="grid" label="Type families">
          {FAMILY_CARDS.map((f) => (
            <FamilyCard key={f.token} f={f} />
          ))}
        </Canvas>
      </Spec>

      <Sub title="Roles">
        <Spec
          level={4}
          title="Display roles"
          source={TOKENS}
          chips={["font-display"]}
          role="Display lines run tight because large Outfit at default tracking opens gaps that read as word breaks."
          caption={<ReadAt />}
          drawer={roleDrawer([...HERO_ROWS, ...DISPLAY_ROWS, FOOTER_ROW])}
        >
          <Canvas ground="container" layout="stack" label="Hero container display roles">
            <TypeRows rows={HERO_ROWS} />
          </Canvas>
          <Canvas ground="page" layout="stack" label="Section display roles">
            <TypeRows rows={DISPLAY_ROWS} />
          </Canvas>
          <Canvas ground="footer" layout="stack" label="Footer wordmark">
            <TypeRows rows={[FOOTER_ROW]} stack />
          </Canvas>
        </Spec>
        <Spec
          level={4}
          title="Text roles"
          source={TOKENS}
          chips={["font-sans"]}
          role="Text roles keep Inter's default tracking and open leading, because the tight settings that help a headline crowd a paragraph."
          caption={<ReadAt />}
          drawer={roleDrawer([...HERO_TEXT_ROWS, ...TEXT_ROWS])}
        >
          <Canvas ground="container" layout="stack" label="Hero container text roles">
            <TypeRows rows={HERO_TEXT_ROWS} />
          </Canvas>
          <Canvas ground="page" layout="stack" label="Text roles">
            <TypeRows rows={TEXT_ROWS} />
          </Canvas>
        </Spec>
        <Spec
          level={4}
          title="Player copy on blue"
          source={TOKENS}
          role="On the accent the title is white and the body a softer white, so the title leads without a second colour."
          caption={<ReadAt />}
          drawer={roleDrawer(BLUE_ROWS)}
        >
          <Canvas ground="on-blue" layout="stack" label="Player copy">
            <TypeRows rows={BLUE_ROWS} />
          </Canvas>
        </Spec>
        <Spec
          level={4}
          title="Mono roles"
          source={TOKENS}
          chips={["--ds-font-mono"]}
          role="Mono marks what the model outputs, the card meta and the terminal, so it reads as the model talking rather than the page."
          caption={<ReadAt />}
          drawer={roleDrawer([...MONO_ROWS, TERMINAL_ROW])}
        >
          <Canvas ground="surface" layout="stack" label="Card meta">
            <TypeRows rows={MONO_ROWS} />
          </Canvas>
          <Canvas ground="terminal" layout="stack" label="Terminal text">
            <TypeRows rows={[TERMINAL_ROW]} />
          </Canvas>
        </Spec>
      </Sub>

      <Spec
        title="Across widths"
        source={{ from: "@/components/website/Closing", name: "Closing", at: "font-display text-[clamp(38px,5.2vw,74px)]" }}
        chips={["frame layout-closing"]}
        role="The closing clamp and the md steps answer to the window, so the frame sets them at true widths this page cannot."
      >
        <Anatomy frame ground="container" layout="stack" pins={FRAME_PINS} label="Closing type at true widths">
          <ViewportPreview part="layout-closing" title="Closing section at true widths" height={640} fitHeight widths={[375, 768, 1280, 1920]} />
        </Anatomy>
      </Spec>

      <Spec
        title="Scale for new work"
        source={{ from: "@/components/design-system/tokens", name: "TYPE_SCALE", file: "token-type.ts" }}
        role="New work picks from these steps, so two sizes a pixel apart never sit together and read as a slip."
        drawer={{ values: SCALE_VALUES, code: SCALE_CODE }}
      >
        <SizeLadder
          label="Type scale"
          sizes={SCALE_STEPS.map((st) => ({
            name: String(st.px),
            spec: st.px,
            node: <span className={t["ds-glyph"]} style={{ fontSize: cssVar(st.name) }}>Ag</span>,
          }))}
        />
        <KeyRows label="Sizes off the scale" rows={OFF_SCALE} />
      </Spec>

      <DoDont>
        <Do reason="The heading in Outfit and the line under it in Inter, so the change of face marks where reading starts.">
          <div>
            <p className={`${roleOf("h2").classes} ${t["ds-dd-line"]}`}>Questions, answered.</p>
            <p className={`${roleOf("body-l").classes} ${t["ds-dd-sub"]}`}>Everything comes from the model of your players.</p>
          </div>
        </Do>
        <Dont reason="Set in Outfit too, the line reads as a second heading and the block loses its way in.">
          <div>
            <p className={`${roleOf("h2").classes} ${t["ds-dd-line"]}`}>Questions, answered.</p>
            <p className={`font-display text-[15px] leading-[1.5] md:text-[16px] ${t["ds-dd-sub"]}`}>Everything comes from the model of your players.</p>
          </div>
        </Dont>
      </DoDont>
      <DoDont>
        <Do reason="Capitals at 11px take wide tracking, because without it the letters touch and the word blurs into one shape.">
          <p className={roleOf("eyebrow").classes}>Scroll</p>
        </Do>
        <Dont reason="At default tracking the small capitals crowd, so the label takes longer to read than the arrow under it.">
          <p className="text-[11px] font-medium uppercase">Scroll</p>
        </Dont>
      </DoDont>
    </Section>
  );
}
