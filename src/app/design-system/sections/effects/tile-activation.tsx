// Activation sweep: the 0.53s from focused to activated, frame by frame, in sweep time and on the wall
// clock, then the rim and the glint it lights. The glint is shown as the floor's own baked pictures.
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { Timeline } from "@/app/design-system/_kit/Timeline";
import { AssertChip } from "@/app/design-system/sections/foundations/foundation-parts";
import { GLINT_MATCH, GLINT_PICTURES, GLINT_ROWS, RIM_ROWS, SWEEP_LANES, SWEEP_VALUES, WALL_CLOCK } from "./tile-activation-data";
import { RimDiagram } from "./tile-activation-rim";
import s from "./floor.module.css";

export function TileActivationSection() {
  return (
    <Section
      id="tile-activation"
      lead="A beam runs round the slab's top rim from the corner nearest the camera, the brighter slab sweeps in behind it, the shadows turn blue and the human becomes the hologram."
    >
      <Spec
        title="Sweep timeline"
        source={{ from: "@/tiles/sweep", name: "sweepValues", file: "sweep.js" }}
        chips={["S", "animSpeed 1.69"]}
        role="Matched frame by frame to a 30 fps reference recording, so every lane is a time the eye already accepted."
        caption="S is the engine's sweep clock · the second axis is the wall clock, S / 1.69"
        drawer={{ label: "Curves and timings", values: SWEEP_VALUES }}
        warn="The frost, gradient and glint textures are baked with the params of their day. After any params edit, run tools/tiles/bake-textures.mjs, or the page repaints them at load (about 1.4s on a 2019 MacBook Pro)."
      >
        <Timeline label="Activation, in sweep time" axisLabel="sweep time S" lanes={SWEEP_LANES} end={0.9} step={0.1} second={WALL_CLOCK} />
      </Spec>

      <Spec
        title="Rim"
        source={{ from: "@/tiles/materials", name: "activeMaterials", file: "materials.js", at: "// Rim beam." }}
        chips={["u = (x + z) / tile"]}
        role="The beam starts at the corner nearest the camera, so the light reads as arriving from the visitor's side."
        note="The sweep only exists inside a floor. Click a tile on the live floor to see it at full speed."
      >
        <Canvas ground="navy" label="Rim of an activated tile">
          <RimDiagram />
        </Canvas>
        <KeyRows label="Rim parts" rows={RIM_ROWS} />
      </Spec>

      <Spec
        title="Glint"
        source={{ from: "@/tiles/textures", name: "glintBean", file: "textures.js" }}
        chips={["glintCA", "glintSpread"]}
        role="One painted highlight per state, crossfaded by the sweep's amount, so the top face changes material without a second light."
        caption={
          <>
            the floor&apos;s own pictures from public/tiles/baked/, 512 square, shown at 200 before the shader lays them on the
            slab · each picked by the floor&apos;s test at <AssertChip a={GLINT_MATCH} />
          </>
        }
        drawer={{ label: "Glint values", children: <KeyRows label="Glint" rows={GLINT_ROWS} /> }}
      >
        {GLINT_PICTURES.map((g) => (
          <Canvas key={g.look} ground={g.ground} label={`${g.look} glint`}>
            <figure className={s["ds-glint"]}>
              {g.src ? (
                // eslint-disable-next-line @next/next/no-img-element -- the floor's own baked texture, served as is
                <img src={g.src} alt={g.alt} width={200} height={200} />
              ) : (
                <span className="ds-label">no bake matches these settings, so the floor paints this one at load</span>
              )}
              <figcaption className="ds-label">{g.look}</figcaption>
            </figure>
          </Canvas>
        ))}
      </Spec>
    </Section>
  );
}
