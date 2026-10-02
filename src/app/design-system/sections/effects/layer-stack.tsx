// Layer stack: how the page's grounds and effects stack, bottom to top, and where a new layer goes.
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { LayerDiagram, MiniStack } from "./layer-stack-diagram";
import { DO_STACK, DONT_STACK, LAYER_DETAILS, LAYER_ROWS, LAYERS, Z_ROWS } from "./layer-stack-data";

export function LayerStackSection() {
  return (
    <Section
      id="layer-stack"
      lead="Seven planes from the page's ground to the perf readout. Only the water, Players and the fixed chrome set a z on the root. Everything else stacks by DOM order."
    >
      <Spec
        title="The page, exploded"
        source={{ from: "@/app/website/page", name: "WebsitePage", file: "page.tsx" }}
        chips={["fixed", "z auto", "DOM order"]}
        role="A plane paints over everything below it, so a new effect claims its plane here before it is given a z."
        caption="7 planes · bottom to top · drawn by the guide, the real layers only meet on the full page"
        drawer={{ label: "Stacking contexts", values: LAYER_DETAILS }}
        warn="The hero's copy sits at z 20, level with the water, and the hero section is not isolated, so only DOM order keeps them apart. The header and BackToTop share z 40."
      >
        <Canvas ground="page" layout="bleed" label="Page layers">
          <LayerDiagram layers={LAYERS} />
        </Canvas>
        <KeyRows label="Layers, bottom to top" rows={LAYER_ROWS} />
      </Spec>

      <Spec
        title="Z-scale"
        source={{ from: "@/components/design-system/tokens", name: "Z", file: "token-space.ts" }}
        props="z-*"
        role="Each step belongs to one kind of layer, and the four above the header wait for parts the site does not have yet."
      >
        <SpecTable caption="Z-scale" columns={["Token", "z", "Use for", "Source"]} rows={Z_ROWS} mono={[0, 1, 3]} minWidth={640} />
      </Spec>

      <DoDont>
        <Do reason="At z 45 the menu clears the header's 40, so it opens over the strip it hangs from." ground="container">
          <MiniStack planes={DO_STACK} label="A menu panel at z 45" />
        </Do>
        <Dont reason="At z 20 it ties with the water and the hero copy, and DOM order decides which one shows." ground="container">
          <MiniStack planes={DONT_STACK} label="A menu panel at z 20" />
        </Dont>
      </DoDont>
    </Section>
  );
}
