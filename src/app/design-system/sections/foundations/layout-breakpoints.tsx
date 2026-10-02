// Layout and breakpoints: the container and its gutters drawn from the tokens and then measured in a
// frame at true widths, the text measures, both breakpoint ladders with the source's own use counts,
// and the fixed header's height beside the offsets the site hard-codes.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { BarList } from "./foundation-parts";
import { check, variantCounts } from "./foundation-scan";
import { BreakpointRuler, NestBar } from "./layout-diagrams";
import {
  ALL_PREFIXES, BREAKPOINT_ROWS, DIAGRAM_WIDTHS, FRAME_PINS, FULL_GRID, HEADER_OFFSETS, HEADER_TOKENS, LAYOUT_CODE,
  LAYOUT_VALUES, MEASURES, MEDIA_GATES, PAGE_GUTTER, PHONE_COPY, SECTION_INNER, type Gate,
} from "./layout-data";
import s from "./layout.module.css";
import { roleOf } from "./type-data";

const TOKENS = { from: "@/components/design-system/tokens", name: "LAYOUT", file: "token-space.ts" };

const gateRows = (gates: readonly Gate[]) => gates.map((g) => ({ key: g.key, value: g.value, source: check(g.assert).at }));

export function LayoutSection() {
  const counts = variantCounts(ALL_PREFIXES);
  const bpRows = BREAKPOINT_ROWS.map((b) => [
    b.name,
    `${b.px}px`,
    b.ladder,
    b.prefixes.map((p) => `${p}: ${counts.get(p) ?? 0}`).join(", "),
    b.useFor,
    b.neverFor,
  ]);
  const anchors = [
    { key: "Page gutter", value: "main px-4 md:px-8", source: check(PAGE_GUTTER).at },
    { key: "Section inner", value: "max-w-[1400px] px-4 md:px-16", source: check(SECTION_INNER).at },
    { key: "Full-view copy grid", value: "max-w-[1448px] px-6 max-md:px-4", source: check(FULL_GRID).at },
  ];

  return (
    <Section
      id="layout"
      lead="One container with two gutters, the measures that cap each text block, the widths the site splits on, and the fixed header's height."
    >
      <Spec
        title="Container and gutters"
        source={TOKENS}
        chips={["max-w-[1400px]"]}
        role="The same three widths nest in every section, so a new section starts its copy where the others do."
        drawer={{ values: LAYOUT_VALUES, code: LAYOUT_CODE, children: <KeyRows label="Where the site writes them" rows={anchors} /> }}
      >
        <Canvas ground="surface" label="Container nesting at three widths">
          <div className={s["ds-nests"]}>
            {DIAGRAM_WIDTHS.map((w) => (
              <NestBar key={w} width={w} />
            ))}
          </div>
        </Canvas>
      </Spec>

      <Spec
        title="Across widths"
        source={{ from: "@/components/website/Closing", name: "Closing", at: "max-w-[1400px] flex-col items-center px-4" }}
        chips={["frame layout-closing"]}
        role="The frame lays a real section out at a true width, so the gutters and the cap are measured rather than drawn."
      >
        <Anatomy frame ground="container" layout="stack" pins={FRAME_PINS} label="Closing section gutters at true widths">
          <ViewportPreview part="layout-closing" title="Closing section gutters" height={640} fitHeight widths={[375, 768, 1280, 1920]} />
        </Anatomy>
      </Spec>

      <Spec
        title="Measures"
        source={TOKENS}
        role="Each text block caps its line length, because past a point the eye loses its way back to the start of the next line."
      >
        <Canvas ground="surface" layout="stack" label="Measures">
          <BarList bars={MEASURES} scale="fit" label="Text measures, widest first" />
        </Canvas>
      </Spec>

      <Spec
        title="Breakpoints"
        source={{ from: "@/components/design-system/tokens", name: "BREAKPOINTS", file: "token-space.ts" }}
        role="Both ladders share one axis here, so a new part can see which widths the page already changes at."
        caption="ticks show how many classes open with each width's prefix in src/components/website"
        drawer={{
          children: (
            <SpecTable
              caption="Breakpoints"
              columns={["Token", "Width", "Ladder", "Prefixes in the site", "Use for", "Never for"]}
              rows={bpRows}
              mono={[0, 1, 3]}
              minWidth={760}
            />
          ),
        }}
      >
        <Canvas ground="surface" layout="stack" label="Breakpoint ladders">
          <BreakpointRuler counts={counts} />
        </Canvas>
        <KeyRows label="Media gates" rows={gateRows(MEDIA_GATES)} />
      </Spec>

      <Spec
        title="Header height"
        source={{ from: "@/components/website/Header", name: "Header", at: "fixed top-0 left-0 right-0 z-40" }}
        chips={["--ds-header-h", "--ds-header-h-md"]}
        role="Content under the fixed bar starts below it by the bar's own height, so one token can replace the offsets written by hand."
        note={
          <>
            The hand-written offsets disagree: 73 and 70 for the same phone bar, and 89 from md over a bar near 80. New
            work offsets with --ds-header-h. <a href="#gaps">Known gaps</a> tracks the offsets.
          </>
        }
      >
        <KeyRows label="Header tokens" rows={HEADER_TOKENS.map((t) => ({ key: `--ds-${t.name}`, value: `${t.value}, ${t.role.toLowerCase()}` }))} />
        <KeyRows label="Offsets in the site" rows={gateRows(HEADER_OFFSETS)} />
      </Spec>

      <DoDont>
        <Do reason="Copy keeps the 16 gutter on a phone, so its first letter never meets the edge of the glass.">
          <div className={`${s["ds-phone"]} ${s["ds-phone-gutter"]}`}>
            <p className={roleOf("body-s").classes}>{PHONE_COPY}</p>
          </div>
        </Do>
        <Dont reason="Flush copy runs into the screen's edge, where a case or a rounded corner cuts the first letters.">
          <div className={`${s["ds-phone"]} ${s["ds-phone-flush"]}`}>
            <p className={roleOf("body-s").classes}>{PHONE_COPY}</p>
          </div>
        </Dont>
      </DoDont>
    </Section>
  );
}
