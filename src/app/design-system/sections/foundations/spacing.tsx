// Spacing and rhythm: the 4px scale with the site's own use of each step counted from its source, the
// arbitrary values that leave the grid, the measured rhythm of the container hero's copy, the padding
// each part takes, drawn on the Try now pill and a live FAQ row with every part in the drawer, and the
// control heights, each with the real parts that reach it.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { Button } from "@/components/design-system/Button";
import { ButtonGroup } from "@/components/design-system/ButtonGroup";
import { StatusDot } from "@/components/design-system/StatusDot";
import { SPACING } from "@/components/design-system/tokens";
import { PrimaryCta } from "@/components/website/PrimaryCta";
import { AssertChip, BarList } from "./foundation-parts";
import { check, offGridSpacing, spacingCounts } from "./foundation-scan";
import { ControlLadders } from "./control-ladders";
import { RhythmRuler } from "./rhythm-ruler";
import {
  HEIGHT_ROWS, HEIGHTS_CODE, HERO_COPY, OTHER_GAPS, PADDINGS, PAD_CTA, PAD_FAQ, PROOF, RHYTHM_GAPS, SPACE_CODE, SPACE_VALUES,
  stepOf, type Gap,
} from "./spacing-data";
import s from "./spacing.module.css";
import { UseTable } from "./token-use";
import { roleOf } from "./type-data";
import { ReadAt } from "./viewport-read";

const gapRows = (gaps: readonly Gap[]) =>
  gaps.map((g) => ({ key: g.key, value: `${g.value} (${g.cls})`, source: check(g.assert).at }));

function Head({ cta }: { cta: string }) {
  return (
    <div className={s["ds-head"]}>
      <p className={`${roleOf("h2").classes} ${s["ds-head-h"]}`}>One model. Three jobs.</p>
      <p className={`mt-4 ${roleOf("body-l").classes} ${s["ds-head-sub"]}`}>Everything comes from the model of your players.</p>
      <div className={cta}>
        <PrimaryCta>Try now</PrimaryCta>
      </div>
    </div>
  );
}

export function SpacingSection() {
  const counts = spacingCounts();
  const bars = SPACING.map((t) => {
    const n = counts.get(stepOf(t.name)) ?? 0;
    return { name: t.name, px: parseFloat(t.value), note: `${n} in the site · ${t.useFor}`, dim: n === 0 };
  });
  const off = offGridSpacing(new Set(bars.map((b) => b.px))).map((o) => ({ key: `${o.px}px`, value: o.uses.join(", ") }));
  const hero = roleOf("hero");
  const lede = roleOf("lede");

  return (
    <Section id="spacing" lead="Tailwind's 4px scale, how often the site writes each step, and the rhythm that orders a block from heading to action.">
      <Spec
        title="Scale"
        source={{ from: "@/components/design-system/tokens", name: "SPACING", file: "token-space.ts" }}
        role="Every gap comes from one scale on a 4px base, so blocks in different sections line up without anyone measuring them."
        caption="counts read from src/components/website at build, padding, margin, gap and space utilities"
        drawer={{ values: SPACE_VALUES, code: SPACE_CODE, children: <UseTable tokens={SPACING} /> }}
      >
        <Canvas ground="surface" layout="stack" label="Spacing steps">
          <BarList bars={bars} label="Spacing steps, 2 to 128" />
        </Canvas>
      </Spec>

      <Spec
        title="Off the grid"
        role="Each value sits a pixel or two from a step and is listed with its source, so it can fold back onto the scale."
        caption="arbitrary px values that are not a step of the scale"
      >
        <KeyRows label="Off-grid spacing" rows={off} />
      </Spec>

      <Spec
        title="Rhythm inside a block"
        source={{ from: "@/components/website/Hero", name: "Hero" }}
        chips={["PrimaryCta", "StatusDot"]}
        role="Gaps widen from the copy to the action, which is how the block says what to read first and what to do after."
        caption={<ReadAt />}
        drawer={{
          children: <KeyRows label="Rhythm in other blocks" rows={gapRows(OTHER_GAPS)} />,
        }}
      >
        <Canvas ground="container" label="Container hero copy, gaps measured">
          <RhythmRuler>
            <p className={`${hero.classes} ${s["ds-rhythm-h1"]}`}>
              Making <span className="text-accent">models</span> of
              <br />
              human players.
            </p>
            <p className={`font-sans ${RHYTHM_GAPS[0].cls} ${lede.classes} ${s["ds-rhythm-lede"]}`}>{HERO_COPY.lede}</p>
            <div className={RHYTHM_GAPS[1].cls}>
              <PrimaryCta>Try now</PrimaryCta>
            </div>
            <div className={`${PROOF.cls} ${s["ds-rhythm-proof"]}`}>
              <StatusDot tone="live" motion="ping" />
              <p>{HERO_COPY.proof}</p>
              <p className={`text-accent ${s["ds-rhythm-next"]}`}>{HERO_COPY.next}</p>
            </div>
          </RhythmRuler>
        </Canvas>
        <KeyRows label="Hero rhythm" rows={gapRows(RHYTHM_GAPS)} />
      </Spec>

      <Spec
        title="Component padding"
        source={{ from: "@/components/website/PrimaryCta", name: "PrimaryCta" }}
        chips={["Faq"]}
        role="Padding grows with the surface it sits in, so small rows stay dense and large cards keep their copy off the edge."
        caption="hatched bands are the padding, measured where each part renders · every part in the drawer"
        drawer={{
          children: (
            <SpecTable
              caption="Component padding"
              columns={["Part", "Padding", "Phones", "Source"]}
              rows={PADDINGS.map((p) => [p.part, p.padding, p.phone, <AssertChip key={p.part} a={p.assert} />])}
              mono={[1, 2]}
              minWidth={620}
            />
          ),
        }}
      >
        <Anatomy ground="container" pins={[PAD_CTA]} label="Try now padding">
          <div data-ds-pad="cta">
            <PrimaryCta>Try now</PrimaryCta>
          </div>
        </Anatomy>
        <Anatomy frame layout="stack" pins={[PAD_FAQ]} label="FAQ row padding, live in a frame">
          <ViewportPreview part="section-faq" title="FAQ row padding" height={240} widths={[375, 1280]} width={1280} scrollTo="#faq ul" />
        </Anatomy>
      </Spec>

      <Spec
        title="Control heights"
        source={{ from: "@/components/design-system/control-heights", name: "CONTROL_HEIGHTS", file: "control-heights.ts" }}
        role="Controls in one row line up by height, never by size name, because each family names its own ladder: a md field stands 44 and a md button 40."
        caption="read from each family's own size map, every part measured where it renders"
        drawer={{ code: HEIGHTS_CODE }}
      >
        <KeyRows label="Heights and the parts that reach them" rows={HEIGHT_ROWS} />
        <ControlLadders />
      </Spec>

      <DoDont>
        <Do reason="The gap before the button is twice the gap in the copy, so the copy reads as one block and the button as the next step.">
          <Head cta="mt-8" />
        </Do>
        <Dont reason="With one gap everywhere the button joins the copy, and the eye cannot tell the message from the action.">
          <Head cta="mt-4" />
        </Dont>
      </DoDont>
      <DoDont>
        <Do reason="Twelve between two buttons, the group's gap everywhere, so pairs on different pages match.">
          <ButtonGroup>
            <Button variant="secondary">Sign in</Button>
            <Button>Try now</Button>
          </ButtonGroup>
        </Do>
        <Dont reason="Seven sits a pixel from eight, so the gap reads as a slip rather than a choice.">
          <div className={s["ds-pair"]} style={{ gap: 7 }}>
            <Button variant="secondary">Sign in</Button>
            <Button>Try now</Button>
          </div>
        </Dont>
      </DoDont>
    </Section>
  );
}
