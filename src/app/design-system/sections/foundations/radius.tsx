// Radius: every step of the ladder as a live box with the browser's own computed radius under it, and
// the one nested pair the site has (the language panel and its rows), drawn as a diagram from its numbers.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { RADIUS, cssVar } from "@/components/design-system/tokens";
import { Computed } from "./computed-style";
import { check } from "./foundation-scan";
import { LADDER, NEST_PINS, NEST_ROWS, RADIUS_CODE, RADIUS_VALUES, SPELLINGS } from "./radius-data";
import s from "./radius.module.css";
import { UseTable } from "./token-use";
import { roleOf } from "./type-data";

const TOKENS = { from: "@/components/design-system/tokens", name: "RADIUS", file: "token-shape.ts" };

function Panel({ same }: { same?: boolean }) {
  const code = roleOf("code-tag").classes;
  return (
    <div className={`${s["ds-panel"]} ${same ? s["ds-panel--same"] : ""}`} data-ds-nest="">
      {NEST_ROWS.map((r, i) => (
        <div key={r.code} className={`${s["ds-row"]} ${i === 0 ? s["ds-row--on"] : ""}`} data-ds-row="">
          <span className={`${code} ${s["ds-row-code"]}`}>{r.code}</span>
          {r.label}
        </div>
      ))}
    </div>
  );
}

export function RadiusSection() {
  const spellings = SPELLINGS.map((sp) => ({
    key: sp.key,
    value: sp.value,
    source: sp.asserts.map((a) => check(a).at).join(", "),
  }));

  const first = LADDER[0];
  const last = LADDER[LADDER.length - 1];
  const lead =
    `${LADDER.length} steps, from ${first.name} at ${first.value} to ${last.name} at ${last.value}, ` +
    "each tied to the surfaces that take it.";

  return (
    <Section id="radius" lead={lead}>
      <Spec
        title="Ladder"
        source={TOKENS}
        role="Radius grows with the surface, so a row, the card that holds it and the container round it each read as their own layer."
        drawer={{
          values: RADIUS_VALUES,
          code: RADIUS_CODE,
          children: (
            <>
              <UseTable tokens={RADIUS} />
              <KeyRows label="One value, two spellings" rows={spellings} />
            </>
          ),
        }}
      >
        <Canvas ground="page" label="Radius ladder">
          {LADDER.map((t) => (
            <div key={t.name}>
              <Computed prop="border-top-left-radius" label={t.name}>
                <div
                  className={`${s["ds-box"]} ${t.name === "radius-full" ? s["ds-box--pill"] : ""}`}
                  style={{ borderRadius: cssVar(t.name) }}
                />
              </Computed>
              <p className={s["ds-box-use"]}>{t.useFor}</p>
            </div>
          ))}
        </Canvas>
      </Spec>

      <Spec
        title="Nesting"
        source={{ from: "@/components/website/LanguageMenu", name: "LanguageMenu", at: "absolute right-0 top-full mt-3 w-48" }}
        chips={["radius-sm", "radius-xs"]}
        role="Inside a padded surface the inner corner steps down the ladder, which keeps two curves from fighting at the corner."
        caption={
          <>
            a diagram drawn from LanguageMenu&apos;s own numbers, not the part · the live panel opens in{" "}
            <a href="#language-menu">Language menu</a>
          </>
        }
      >
        <Anatomy ground="page" pins={NEST_PINS} label="Nested panel and rows, a diagram" minHeight={240}>
          <Panel />
        </Anatomy>
      </Spec>

      <DoDont>
        <Do reason="The inner corner is the outer one less the padding, so the gap between the two curves stays even all the way round.">
          <Panel />
        </Do>
        <Dont reason="An inner corner as round as the outer one leaves the gap thick at each corner and thin along the sides.">
          <Panel same />
        </Dont>
      </DoDont>
    </Section>
  );
}
