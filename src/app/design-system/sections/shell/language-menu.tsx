import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { frameHref } from "@/app/design-system/frame/_parts/ids";
import * as D from "./language-menu-data";
import { LanguageLive } from "./language-live";
import { Cell } from "./shell-common";

const SRC = { from: "@/components/website/LanguageMenu", name: "LanguageMenu" };
const STATES = ["rest", "open"] as const;

export function LanguageMenuSection() {
  return (
    <Section
      id="language-menu"
      lead="The region picker in the bar and in the phone sheet: a globe and a code that open a short list on a soft spring. The choice is cosmetic today and changes no locale."
    >
      <Spec
        title="Language menu"
        source={{ ...SRC, line: 27 }}
        role="A globe and a two-letter code keep the picker small in the bar, and the list says each language in its own script."
        caption="click to open · arrows, Enter and Escape work while the trigger has focus"
        note="The system Select takes this panel's geometry without the blur, for any picker a page adds."
        drawer={{ values: D.LANGUAGE_VALUES, code: D.LANGUAGE_CODE }}
      >
        <Canvas ground="grain" isolateKeys label="Language menu, live">
          <LanguageLive />
        </Canvas>
      </Spec>

      <Spec
        title="Menu states"
        source={{ ...SRC, line: 57 }}
        role="Open fills the trigger and turns the globe, and the highlight starts on the selected row."
      >
        <StateGrid
          label="Language menu states"
          ground="grain"
          states={STATES}
          live={false}
          minCell={220}
          render={({ state }) => (
            <Cell>
              <ViewportPreview
                src={frameHref("language", state === "rest" ? "open=0" : undefined)}
                title={`Language menu, ${state}`}
                height={300}
                widths={[360]}
              />
            </Cell>
          )}
        />
        <KeyRows label="Trigger and row states" rows={D.LANGUAGE_STATES} />
      </Spec>

      <Spec
        title="Open panel"
        source={{ ...SRC, line: 70 }}
        role="It hangs from the trigger's right edge, so near the bar's end the list opens into the page, never off it."
        caption="12 under the trigger · w 192 · rows on radius 12 inside the panel's 16"
        warn="While the panel is open its backdrop blur and its blur-in break the compositor rule, so Chrome on Intel and dual-GPU Macs drops to 30 fps."
      >
        <Anatomy frame layout="stack" ground="grain" pins={D.OPEN_PINS} label="Language panel anatomy">
          <ViewportPreview part="language" title="Language menu, open" height={300} widths={[360]} />
        </Anatomy>
      </Spec>
    </Section>
  );
}
