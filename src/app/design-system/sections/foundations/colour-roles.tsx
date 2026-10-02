// Colour roles: every interface colour as a named role, tier by tier. Each tier shows its colours where they
// ship first, then its token cards (value, use and, for a text colour, grades), then a drawer with the CSS
// name, the value, the source and the site's class, and a use table with what each token is never for and
// how many site files write it. The two decisions, the drift table and TokenStyle close the section.
import type { ReactNode } from "react";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SwatchGrid, TokenSwatch } from "@/app/design-system/_kit/TokenSwatch";
import { groupCaption, groupCode, groupSource, itemsOf, swatchOf, tok, valueRows } from "./colour-kit";
import { FieldEdgePair, SelectedPair } from "./colour-roles-dodont";
import { DriftSpec, TokenStyleSpec } from "./colour-roles-drift";
import { ON_CONTAINER, TIERS, type Tier } from "./colour-roles-data";
import { AccentUse, GroundNest, NavyPair, StatusUse, TextStack } from "./colour-roles-specimens";
import { Strip, type SampleMode } from "./colour-strip";
import { UseTable } from "./token-use";

function TierSpec({ tier, role, children }: { tier: Tier; role: string; children?: ReactNode }) {
  return (
    <Spec
      title={tier.title}
      level={4}
      source={groupSource(tier.exportName, "token-colour.ts")}
      role={role}
      caption={groupCaption(tier.tokens)}
      drawer={{
        values: valueRows(tier.tokens),
        code: groupCode(tier.exportName, tier.tokens[0]),
        children: <UseTable tokens={tier.tokens} files level={4} />,
      }}
    >
      {children}
      <SwatchGrid label={`${tier.title} tokens`}>
        {tier.tokens.map((t) => (
          <TokenSwatch key={t.name} {...swatchOf(t, tier.grade(t))} />
        ))}
      </SwatchGrid>
    </Spec>
  );
}

/** A tier's plain strip: white for most, the container for the few that ship there. */
function TierStrip({ tier, mode }: { tier: Tier; mode: SampleMode }) {
  const white = tier.tokens.filter((t) => !ON_CONTAINER.includes(t.name));
  const grey = tier.tokens.filter((t) => ON_CONTAINER.includes(t.name));
  return (
    <>
      <Canvas ground="surface" label={`${tier.title} on white`}>
        <Strip label={`${tier.title} on white`} items={itemsOf(white, mode, { caption: (t) => t.role })} />
      </Canvas>
      {grey.length > 0 && (
        <Canvas ground="container" label={`${tier.title} on the container`}>
          <Strip label={`${tier.title} on the container`} items={itemsOf(grey, mode, { caption: (t) => t.role })} />
        </Canvas>
      )}
    </>
  );
}

export function ColourSection() {
  return (
    <Section
      id="colour"
      lead="Every interface colour is a role with one job. Ink is for type, primary navy is for fills and state, the accent is for attention, and three greys hold the grounds."
    >
      <Sub title="Type and fills">
        <TierSpec tier={TIERS.ink} role="Each alpha step quiets the ink for one job, so the vs, a veil or an unlit word keeps the heading's hue.">
          <Canvas ground="page" label="The ink ladder on the page">
            <Strip label="Ink ladder" items={itemsOf(TIERS.ink.tokens, "fill", { caption: (t) => t.role })} />
          </Canvas>
        </TierSpec>
        <TierSpec
          tier={TIERS.primary}
          role="Primary navy fills Try now and every selected or pressed state, a hair deeper than the ink beside it."
        >
          <NavyPair />
        </TierSpec>
        <TierSpec
          tier={TIERS.text}
          role="Four text roles, from ink down to quiet. The container is darker than white, so a grey that passes on white can fail there."
        >
          <TextStack />
        </TierSpec>
      </Sub>

      <Sub title="Grounds and lines">
        <TierSpec
          tier={TIERS.grounds}
          role="A part's fill follows its ground: white controls on the grey container, a sunken panel inside a white card."
        >
          <Canvas ground="page" label="Grounds as they nest">
            <GroundNest />
          </Canvas>
        </TierSpec>
        <TierSpec tier={TIERS.lines} role="Lines get stronger as their job does: a faint rule groups, a firm one answers hover, and the field line marks an edge to find.">
          <TierStrip tier={TIERS.lines} mode="line" />
        </TierSpec>
        <TierSpec tier={TIERS.fills} role="Quiet fills answer a pointer or show a load in progress, each light enough that navy alone reads as selected.">
          <TierStrip tier={TIERS.fills} mode="fill" />
        </TierSpec>
      </Sub>

      <Sub title="Attention and status">
        <TierSpec tier={TIERS.accent} role="The one vivid blue the eye goes to first, spent on a word, a dot or a ring, and filled only as the players' water.">
          <AccentUse />
        </TierSpec>
        <TierSpec
          tier={TIERS.status}
          role="Status colours label a result or an error, as text on white or as an icon on navy, never as a large fill."
        >
          <StatusUse />
        </TierSpec>
        <TierSpec tier={TIERS.veils} role="A modal veil is solid ink at 40%, never a blur, so the page behind stays cheap to draw.">
          <Canvas ground="page" label="Veil and halo">
            <Strip
              label="Veil and halo"
              items={itemsOf([tok("color-veil-modal"), tok("color-focus-halo")], (t) => (t.name === "color-focus-halo" ? "halo" : "fill"), {
                caption: (t) => t.role,
              })}
            />
          </Canvas>
        </TierSpec>
      </Sub>

      <Sub title="Two decisions">
        <SelectedPair />
        <FieldEdgePair />
      </Sub>

      <Sub title="Where the source has drifted">
        <DriftSpec />
      </Sub>

      <Sub title="How a value reaches CSS">
        <TokenStyleSpec />
      </Sub>
    </Section>
  );
}
