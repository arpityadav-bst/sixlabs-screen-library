// Compositor-safe rule: what never goes on screen and what the site draws instead, the switches that
// measure it on the real page, and the WebGL budget, the site's and the guide's own.
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { DoDont, Do, Dont } from "@/app/design-system/_kit/DoDont";
import { BudgetPill } from "@/app/design-system/_kit/HeavySlot";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { GlowStack } from "./perf-rule-live";
import {
  CONTEXTS,
  CONTEXT_COLUMNS,
  FILTER_CODE,
  GUIDE_BUDGET,
  RULES,
  RULE_COLUMNS,
  SWITCHES,
  SWITCH_COLUMNS,
} from "./perf-rule-data";
import s from "./fx-live.module.css";

const PERF = { from: "@/components/website/perf", name: "isOff", file: "perf.ts" };

const SWITCH_ROWS = SWITCHES.map((w) => [
  `?${w.flag}`,
  w.does,
  w.source,
  <a key={w.flag} className={s["ds-link"]} href={`/website?${w.flag}`} target="_blank" rel="noopener noreferrer">
    Open /website<span className="ds-sr"> with ?{w.flag}, in a new tab</span>
  </a>,
]);

export function PerfRuleSection() {
  return (
    <Section
      id="perf-rule"
      lead="The whole look is drawn in canvas, WebGL, alpha and gradients, because one CSS blur, blend, mask or filter on screen slows every frame on a Mac."
    >
      <Sub title="The rule">
        <Spec
          title="Never on screen"
          level={4}
          source={PERF}
          chips={["app/globals.css:274"]}
          role="Any one of these on screen makes Chrome on a Mac composite every frame itself, which caps Intel and dual-GPU Macs at 30 fps."
          note="Compositing inside a canvas and an offscreen ctx.filter baked once are allowed: neither is on screen as CSS."
        >
          <SpecTable caption="Forbidden effects and what to draw instead" columns={RULE_COLUMNS} rows={RULES} mono={[0, 2]} minWidth={720} />
        </Spec>

        <DoDont>
          <Do ground="on-blue" reason="The AI's glow is five faint strokes under each line, so it costs the compositor nothing it does not already do.">
            <GlowStack />
          </Do>
          <Dont ground="navy" layout="stack" reason="A filter or a backdrop blur anywhere on screen hands every frame back to Chrome on a Mac, and the page drops to 30 fps.">
            {FILTER_CODE.map((c) => (
              <code key={c} className={s["ds-code-line"]}>
                {c}
              </code>
            ))}
          </Dont>
        </DoDont>
      </Sub>

      <Sub title="Measuring switches">
        <Spec
          title="Switches on the real page"
          level={4}
          source={{ from: "@/components/website/PerfBoot", name: "PerfBoot" }}
          role="Each switch turns one part off for a single visit, so a slow machine is measured part by part with no build."
        >
          <SpecTable caption="Measuring switches" columns={SWITCH_COLUMNS} rows={SWITCH_ROWS} mono={[0, 2]} minWidth={760} />
        </Spec>
      </Sub>

      <Sub title="WebGL budget">
        <Spec
          title="Contexts on the site"
          level={4}
          source={{ from: "@/components/website/accent-wave-gl", name: "accentWaveGL", file: "accent-wave-gl.ts" }}
          role="Several WebGL contexts live at once on the site, and the floor and the liquid never recover one that is lost."
        >
          <SpecTable caption="WebGL contexts the site holds" columns={CONTEXT_COLUMNS} rows={CONTEXTS} mono={[1, 4]} minWidth={760} />
        </Spec>

        <Spec
          title="The guide's budget"
          level={4}
          source={{ from: "@/app/design-system/_kit/gl-budget", name: "useGlBudget", file: "gl-budget.ts" }}
          role="The guide mounts many live specimens, so it rations WebGL to eight units and one floor and frees each as it scrolls away."
          caption="the same reading as the toolbar, live"
        >
          <Canvas ground="page" label="Live WebGL budget">
            <BudgetPill />
          </Canvas>
          <KeyRows label="The guide's WebGL budget" rows={GUIDE_BUDGET} />
        </Spec>
      </Sub>
    </Section>
  );
}
