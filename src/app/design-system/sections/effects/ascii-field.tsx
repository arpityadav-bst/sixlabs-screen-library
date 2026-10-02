// Glyph field: the real mountAsciiField on panel hosts, in the page's variant and the idle terminal's. The
// page part (AsciiBackdrop) is fixed and full-viewport and hides itself by #model-line, so the guide never
// mounts it: it calls the same function on a host it owns, with the page's numbers.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { AsciiPanel } from "./ascii-field-live";
import {
  FIELD_PINS,
  FIELD_PROPS,
  FIELD_RULES,
  PAGE_CODE,
  PAGE_VALUES,
  TERMINAL_CODE,
  TERMINAL_VALUES,
} from "./ascii-field-data";

const FIELD = { from: "@/components/website/ascii-field", name: "mountAsciiField", file: "ascii-field.js" };
const POOL_STATES = ["resting", "pool"] as const;

export function AsciiFieldSection() {
  return (
    <Section
      id="ascii-field"
      lead="A sparse field of navy glyphs behind the page's own white, warming to the accent in a pool under the cursor."
    >
      <Sub title="Page field">
        <Spec
          title="Page variant"
          level={4}
          source={FIELD}
          props="reach lens pointer"
          chips={["AsciiBackdrop.tsx:22"]}
          role="It runs behind every section from the top to the line, so the white page carries texture without a picture."
          caption="page · reach 120 · lens 0.24 · 15px cells · repaint 68ms"
          drawer={{ values: PAGE_VALUES, props: FIELD_PROPS, code: PAGE_CODE }}
          note="Here the pool follows the pointer inside the panel. On the site it listens on the whole document."
        >
          <Anatomy pins={FIELD_PINS} ground="page" layout="stack" label="Page glyph field">
            <AsciiPanel mode="page" height={360} />
          </Anatomy>
        </Spec>

        <Spec
          title="Pool states"
          level={4}
          source={FIELD}
          props="pool pointer"
          role="The pool is the field's only answer to the visitor, so it is wired only where a pointer can hover."
        >
          <StateGrid
            label="Glyph field pool states"
            states={POOL_STATES}
            ground="page"
            minCell={200}
            liveCaption="move the pointer here"
            render={({ force }) => <AsciiPanel mode={force ?? "page"} cell />}
          />
        </Spec>

        <Spec
          title="When it draws"
          level={4}
          source={{ from: "@/components/website/AsciiBackdrop", name: "AsciiBackdrop" }}
          role="A repaint every 68ms is the field's whole cost, so it stops wherever none of it would show."
        >
          <KeyRows label="Glyph field rules" rows={FIELD_RULES} />
        </Spec>
      </Sub>

      <Sub title="Terminal field">
        <Spec
          title="Terminal variant"
          level={4}
          source={FIELD}
          props="pool reach lens"
          chips={["JobTerminal.tsx:66"]}
          role="The idle terminal holds a pool in place, so the waiting window is a quiet bed of glyphs, not an empty box."
          caption="terminal · reach 420 · lens 0.5 · pool at 0.5, 0.6 · opacity 0.5"
          drawer={{ values: TERMINAL_VALUES, code: TERMINAL_CODE }}
        >
          <Canvas ground="terminal" layout="stack" label="Terminal glyph field">
            <AsciiPanel mode="terminal" height={280} />
          </Canvas>
        </Spec>

        <DoDont>
          <Do ground="terminal" layout="stack" reason="Each host carries its own tints, so the glyphs keep their contrast on the ground under them.">
            <AsciiPanel mode="terminal" height={200} />
          </Do>
          <Dont ground="terminal" layout="stack" reason="The page's navy glyphs sink into the terminal's dark, and the window reads as empty.">
            <AsciiPanel mode="page-on-terminal" height={200} />
          </Dont>
        </DoDont>
      </Sub>
    </Section>
  );
}
